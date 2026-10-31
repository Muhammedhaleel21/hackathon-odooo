import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq, desc, and, or, sql } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.constants';
import { AppDatabase } from '../database/database.provider';
import {
  subscriptions,
  subscriptionLines,
  subscriptionStatusHistory,
  subscriptionPlans,
  products,
  productAttributeValues,
  users,
  quotationTemplates,
} from '../database/schema';
import { SubscriptionNumberService } from './subscription-number.service';
import {
  CreateQuotationDto,
  CreateQuotationLineDto,
} from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import {
  QuerySubscriptionDto,
  CloseSubscriptionDto,
} from './dto/query-subscription.dto';
import { AuthenticatedUser } from '../auth/auth.types';

@Injectable()
export class SubscriptionsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: AppDatabase,
    private readonly numberService: SubscriptionNumberService,
  ) {}

  private async calculateLines(linesDto: CreateQuotationLineDto[]) {
    const calculatedLines = [];
    let subtotal = 0;
    let taxTotal = 0;

    for (const line of linesDto) {
      const [product] = await this.db
        .select()
        .from(products)
        .where(eq(products.id, line.productId))
        .limit(1);

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${line.productId} not found`,
        );
      }

      let variantName: string | null = null;
      let variantAddPrice = 0;

      if (line.variantValueId) {
        const [variantVal] = await this.db
          .select()
          .from(productAttributeValues)
          .where(eq(productAttributeValues.id, line.variantValueId))
          .limit(1);

        if (variantVal) {
          variantName = variantVal.value;
          variantAddPrice = variantVal.additionalPrice;
        }
      }

      const unitPrice = product.salesPrice + variantAddPrice;
      const baseLineAmount = unitPrice * line.quantity;
      const taxRate = 18; // 18% standard GST
      const taxAmount = Math.round((baseLineAmount * taxRate) / 100);
      const lineTotal = baseLineAmount + taxAmount;

      subtotal += baseLineAmount;
      taxTotal += taxAmount;

      calculatedLines.push({
        productId: line.productId,
        variantValueId: line.variantValueId || null,
        productName: product.name,
        variantName: variantName ? `Option: ${variantName}` : null,
        quantity: line.quantity,
        unitPrice,
        taxRate,
        taxAmount,
        lineTotal,
      });
    }

    const totalAmount = subtotal + taxTotal;
    return { calculatedLines, subtotal, taxTotal, totalAmount };
  }

  async createQuotation(dto: CreateQuotationDto, currentUser: AuthenticatedUser) {
    // Validate customer
    const [customer] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, dto.customerId))
      .limit(1);

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${dto.customerId} not found`);
    }

    // Validate plan
    const [plan] = await this.db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.id, dto.planId))
      .limit(1);

    if (!plan) {
      throw new NotFoundException(`Subscription plan with ID ${dto.planId} not found`);
    }

    // Calculate lines
    const { calculatedLines, subtotal, taxTotal, totalAmount } =
      await this.calculateLines(dto.lines);

    const quotationNumber = await this.numberService.generateQuotationNumber();

    const [subscription] = await this.db
      .insert(subscriptions)
      .values({
        quotationNumber,
        customerId: dto.customerId,
        planId: dto.planId,
        quotationTemplateId: dto.quotationTemplateId || null,
        status: 'draft',
        paymentTerms: dto.paymentTerms || 'immediate',
        notes: dto.notes,
        subtotal,
        taxTotal,
        totalAmount,
        createdBy: currentUser.id,
      })
      .returning();

    // Insert lines
    if (calculatedLines.length > 0) {
      await this.db.insert(subscriptionLines).values(
        calculatedLines.map((l) => ({
          subscriptionId: subscription.id,
          ...l,
        })),
      );
    }

    // Insert audit history
    await this.db.insert(subscriptionStatusHistory).values({
      subscriptionId: subscription.id,
      previousStatus: null,
      newStatus: 'draft',
      changedBy: currentUser.id,
      reason: 'Draft quotation created',
    });

    return this.findOne(subscription.id, currentUser);
  }

  async findAll(query: QuerySubscriptionDto, currentUser: AuthenticatedUser) {
    const isCustomer = currentUser.role === 'customer';

    const conditions = [];

    if (isCustomer) {
      conditions.push(eq(subscriptions.customerId, currentUser.id));
    } else if (query.customerId) {
      conditions.push(eq(subscriptions.customerId, query.customerId));
    }

    if (query.status) {
      conditions.push(eq(subscriptions.status, query.status));
    }

    if (query.search) {
      const s = `%${query.search}%`;
      conditions.push(
        or(
          sql`${subscriptions.quotationNumber} ILIKE ${s}`,
          sql`${subscriptions.subscriptionNumber} ILIKE ${s}`,
          sql`${users.name} ILIKE ${s}`,
          sql`${users.email} ILIKE ${s}`,
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await this.db
      .select({
        id: subscriptions.id,
        quotationNumber: subscriptions.quotationNumber,
        subscriptionNumber: subscriptions.subscriptionNumber,
        status: subscriptions.status,
        subtotal: subscriptions.subtotal,
        taxTotal: subscriptions.taxTotal,
        totalAmount: subscriptions.totalAmount,
        quotationValidUntil: subscriptions.quotationValidUntil,
        startDate: subscriptions.startDate,
        expiryDate: subscriptions.expiryDate,
        paymentTerms: subscriptions.paymentTerms,
        createdAt: subscriptions.createdAt,
        customerId: subscriptions.customerId,
        customerName: users.name,
        customerEmail: users.email,
        planId: subscriptions.planId,
        planName: subscriptionPlans.name,
        billingInterval: subscriptionPlans.billingInterval,
      })
      .from(subscriptions)
      .innerJoin(users, eq(subscriptions.customerId, users.id))
      .innerJoin(
        subscriptionPlans,
        eq(subscriptions.planId, subscriptionPlans.id),
      )
      .where(whereClause)
      .orderBy(desc(subscriptions.createdAt));

    return results;
  }

  async findOne(id: string, currentUser: AuthenticatedUser) {
    const [subscription] = await this.db
      .select({
        id: subscriptions.id,
        quotationNumber: subscriptions.quotationNumber,
        subscriptionNumber: subscriptions.subscriptionNumber,
        status: subscriptions.status,
        subtotal: subscriptions.subtotal,
        taxTotal: subscriptions.taxTotal,
        totalAmount: subscriptions.totalAmount,
        paymentTerms: subscriptions.paymentTerms,
        notes: subscriptions.notes,
        quotationValidUntil: subscriptions.quotationValidUntil,
        startDate: subscriptions.startDate,
        expiryDate: subscriptions.expiryDate,
        confirmedAt: subscriptions.confirmedAt,
        activatedAt: subscriptions.activatedAt,
        closedAt: subscriptions.closedAt,
        createdAt: subscriptions.createdAt,
        updatedAt: subscriptions.updatedAt,
        customerId: subscriptions.customerId,
        customerName: users.name,
        customerEmail: users.email,
        planId: subscriptions.planId,
        planName: subscriptionPlans.name,
        planPrice: subscriptionPlans.price,
        billingInterval: subscriptionPlans.billingInterval,
        billingIntervalCount: subscriptionPlans.billingIntervalCount,
        quotationTemplateId: subscriptions.quotationTemplateId,
        templateName: quotationTemplates.name,
      })
      .from(subscriptions)
      .innerJoin(users, eq(subscriptions.customerId, users.id))
      .innerJoin(
        subscriptionPlans,
        eq(subscriptions.planId, subscriptionPlans.id),
      )
      .leftJoin(
        quotationTemplates,
        eq(subscriptions.quotationTemplateId, quotationTemplates.id),
      )
      .where(eq(subscriptions.id, id))
      .limit(1);

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    if (
      currentUser.role === 'customer' &&
      subscription.customerId !== currentUser.id
    ) {
      throw new ForbiddenException(
        'You do not have access to this quotation/subscription',
      );
    }

    // Fetch lines
    const lines = await this.db
      .select()
      .from(subscriptionLines)
      .where(eq(subscriptionLines.subscriptionId, id));

    // Fetch status history
    const history = await this.getStatusHistory(id);

    return {
      ...subscription,
      lines,
      statusHistory: history,
    };
  }

  async updateDraft(
    id: string,
    dto: UpdateQuotationDto,
    currentUser: AuthenticatedUser,
  ) {
    const sub = await this.findOne(id, currentUser);

    if (sub.status !== 'draft') {
      throw new BadRequestException(
        'Only draft quotations can be edited. This record is in ' +
          sub.status +
          ' status.',
      );
    }

    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (dto.customerId) updateData.customerId = dto.customerId;
    if (dto.planId) updateData.planId = dto.planId;
    if (dto.quotationTemplateId !== undefined)
      updateData.quotationTemplateId = dto.quotationTemplateId || null;
    if (dto.paymentTerms) updateData.paymentTerms = dto.paymentTerms;
    if (dto.notes !== undefined) updateData.notes = dto.notes;

    if (dto.lines && dto.lines.length > 0) {
      const { calculatedLines, subtotal, taxTotal, totalAmount } =
        await this.calculateLines(dto.lines);
      updateData.subtotal = subtotal;
      updateData.taxTotal = taxTotal;
      updateData.totalAmount = totalAmount;

      // Replace lines
      await this.db
        .delete(subscriptionLines)
        .where(eq(subscriptionLines.subscriptionId, id));

      await this.db.insert(subscriptionLines).values(
        calculatedLines.map((l) => ({
          subscriptionId: id,
          ...l,
        })),
      );
    }

    await this.db
      .update(subscriptions)
      .set(updateData)
      .where(eq(subscriptions.id, id));

    return this.findOne(id, currentUser);
  }

  async issueQuotation(id: string, currentUser: AuthenticatedUser) {
    const sub = await this.findOne(id, currentUser);

    if (sub.status !== 'draft') {
      throw new BadRequestException('Only draft quotations can be issued.');
    }

    // Default validity: 15 days or template validity
    let validityDays = 15;
    if (sub.quotationTemplateId) {
      const [tpl] = await this.db
        .select({ validityDays: quotationTemplates.validityDays })
        .from(quotationTemplates)
        .where(eq(quotationTemplates.id, sub.quotationTemplateId))
        .limit(1);
      if (tpl?.validityDays) {
        validityDays = tpl.validityDays;
      }
    }

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validityDays);

    await this.db
      .update(subscriptions)
      .set({
        status: 'quotation',
        quotationValidUntil: validUntil,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, id));

    await this.db.insert(subscriptionStatusHistory).values({
      subscriptionId: id,
      previousStatus: 'draft',
      newStatus: 'quotation',
      changedBy: currentUser.id,
      reason: `Quotation issued to customer (valid for ${validityDays} days until ${validUntil.toISOString().slice(0, 10)})`,
    });

    return this.findOne(id, currentUser);
  }

  async confirmQuotation(id: string, currentUser: AuthenticatedUser) {
    const sub = await this.findOne(id, currentUser);

    if (sub.status !== 'quotation' && sub.status !== 'draft') {
      throw new BadRequestException(
        `Quotation cannot be confirmed from status '${sub.status}'. Must be in draft or quotation status.`,
      );
    }

    await this.db
      .update(subscriptions)
      .set({
        status: 'confirmed',
        confirmedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, id));

    await this.db.insert(subscriptionStatusHistory).values({
      subscriptionId: id,
      previousStatus: sub.status,
      newStatus: 'confirmed',
      changedBy: currentUser.id,
      reason: 'Quotation confirmed and approved for service activation',
    });

    return this.findOne(id, currentUser);
  }

  async activateSubscription(id: string, currentUser: AuthenticatedUser) {
    const sub = await this.findOne(id, currentUser);

    if (sub.status !== 'confirmed') {
      throw new BadRequestException(
        `Only confirmed quotations can be activated. Current status: '${sub.status}'`,
      );
    }

    let subNumber = sub.subscriptionNumber;
    if (!subNumber) {
      subNumber = await this.numberService.generateSubscriptionNumber();
    }

    const startDate = new Date();
    const expiryDate = new Date(startDate);

    const count = sub.billingIntervalCount || 1;
    switch (sub.billingInterval) {
      case 'daily':
        expiryDate.setDate(expiryDate.getDate() + count);
        break;
      case 'weekly':
        expiryDate.setDate(expiryDate.getDate() + count * 7);
        break;
      case 'yearly':
        expiryDate.setFullYear(expiryDate.getFullYear() + count);
        break;
      case 'monthly':
      default:
        expiryDate.setMonth(expiryDate.getMonth() + count);
        break;
    }

    await this.db
      .update(subscriptions)
      .set({
        status: 'active',
        subscriptionNumber: subNumber,
        startDate,
        expiryDate,
        activatedAt: startDate,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, id));

    await this.db.insert(subscriptionStatusHistory).values({
      subscriptionId: id,
      previousStatus: 'confirmed',
      newStatus: 'active',
      changedBy: currentUser.id,
      reason: `Subscription activated under ${subNumber}. Term initialized until ${expiryDate.toISOString().slice(0, 10)}.`,
    });

    return this.findOne(id, currentUser);
  }

  async closeSubscription(
    id: string,
    dto: CloseSubscriptionDto,
    currentUser: AuthenticatedUser,
  ) {
    const sub = await this.findOne(id, currentUser);

    if (sub.status === 'closed') {
      throw new BadRequestException('Subscription is already closed');
    }

    await this.db
      .update(subscriptions)
      .set({
        status: 'closed',
        closedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, id));

    await this.db.insert(subscriptionStatusHistory).values({
      subscriptionId: id,
      previousStatus: sub.status,
      newStatus: 'closed',
      changedBy: currentUser.id,
      reason: dto.reason || 'Subscription closed by operator',
    });

    return this.findOne(id, currentUser);
  }

  async getStatusHistory(id: string) {
    return this.db
      .select({
        id: subscriptionStatusHistory.id,
        subscriptionId: subscriptionStatusHistory.subscriptionId,
        previousStatus: subscriptionStatusHistory.previousStatus,
        newStatus: subscriptionStatusHistory.newStatus,
        changedBy: subscriptionStatusHistory.changedBy,
        changedByName: users.name,
        reason: subscriptionStatusHistory.reason,
        createdAt: subscriptionStatusHistory.createdAt,
      })
      .from(subscriptionStatusHistory)
      .leftJoin(users, eq(subscriptionStatusHistory.changedBy, users.id))
      .where(eq(subscriptionStatusHistory.subscriptionId, id))
      .orderBy(desc(subscriptionStatusHistory.createdAt));
  }
}

