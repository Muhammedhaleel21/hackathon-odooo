import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.constants';
import { AppDatabase } from '../database/database.provider';
import {
  quotationTemplates,
  quotationTemplateLines,
  subscriptionPlans,
  products,
  productAttributeValues,
  users,
} from '../database/schema';
import { CreateQuotationTemplateDto } from './dto/create-template.dto';
import { UpdateQuotationTemplateDto } from './dto/update-template.dto';

@Injectable()
export class QuotationTemplatesService {
  constructor(@Inject(DRIZZLE) private readonly db: AppDatabase) {}

  async create(dto: CreateQuotationTemplateDto, userId: string) {
    const [template] = await this.db
      .insert(quotationTemplates)
      .values({
        name: dto.name,
        description: dto.description,
        defaultPlanId: dto.defaultPlanId || null,
        validityDays: dto.validityDays ?? 15,
        isActive: dto.isActive ?? true,
        createdBy: userId,
      })
      .returning();

    if (dto.lines && dto.lines.length > 0) {
      await this.db.insert(quotationTemplateLines).values(
        dto.lines.map((l) => ({
          templateId: template.id,
          productId: l.productId,
          variantValueId: l.variantValueId || null,
          defaultQuantity: l.defaultQuantity ?? 1,
        })),
      );
    }

    return this.findOne(template.id);
  }

  async findAll() {
    const templatesList = await this.db
      .select({
        id: quotationTemplates.id,
        name: quotationTemplates.name,
        description: quotationTemplates.description,
        defaultPlanId: quotationTemplates.defaultPlanId,
        defaultPlanName: subscriptionPlans.name,
        defaultPlanPrice: subscriptionPlans.price,
        defaultPlanInterval: subscriptionPlans.billingInterval,
        validityDays: quotationTemplates.validityDays,
        isActive: quotationTemplates.isActive,
        createdAt: quotationTemplates.createdAt,
        updatedAt: quotationTemplates.updatedAt,
      })
      .from(quotationTemplates)
      .leftJoin(
        subscriptionPlans,
        eq(quotationTemplates.defaultPlanId, subscriptionPlans.id),
      )
      .orderBy(desc(quotationTemplates.createdAt));

    // Fetch line counts for each template
    const allLines = await this.db.select().from(quotationTemplateLines);

    return templatesList.map((tpl) => {
      const lines = allLines.filter((l) => l.templateId === tpl.id);
      return {
        ...tpl,
        lineCount: lines.length,
      };
    });
  }

  async findOne(id: string) {
    const [template] = await this.db
      .select({
        id: quotationTemplates.id,
        name: quotationTemplates.name,
        description: quotationTemplates.description,
        defaultPlanId: quotationTemplates.defaultPlanId,
        defaultPlanName: subscriptionPlans.name,
        defaultPlanPrice: subscriptionPlans.price,
        defaultPlanInterval: subscriptionPlans.billingInterval,
        validityDays: quotationTemplates.validityDays,
        isActive: quotationTemplates.isActive,
        createdBy: quotationTemplates.createdBy,
        creatorName: users.name,
        createdAt: quotationTemplates.createdAt,
        updatedAt: quotationTemplates.updatedAt,
      })
      .from(quotationTemplates)
      .leftJoin(
        subscriptionPlans,
        eq(quotationTemplates.defaultPlanId, subscriptionPlans.id),
      )
      .leftJoin(users, eq(quotationTemplates.createdBy, users.id))
      .where(eq(quotationTemplates.id, id))
      .limit(1);

    if (!template) {
      throw new NotFoundException(`Quotation template with ID ${id} not found`);
    }

    const lines = await this.db
      .select({
        id: quotationTemplateLines.id,
        templateId: quotationTemplateLines.templateId,
        productId: quotationTemplateLines.productId,
        productName: products.name,
        productPrice: products.salesPrice,
        productType: products.productType,
        variantValueId: quotationTemplateLines.variantValueId,
        variantValue: productAttributeValues.value,
        variantAdditionalPrice: productAttributeValues.additionalPrice,
        defaultQuantity: quotationTemplateLines.defaultQuantity,
      })
      .from(quotationTemplateLines)
      .innerJoin(products, eq(quotationTemplateLines.productId, products.id))
      .leftJoin(
        productAttributeValues,
        eq(
          quotationTemplateLines.variantValueId,
          productAttributeValues.id,
        ),
      )
      .where(eq(quotationTemplateLines.templateId, id));

    return {
      ...template,
      lines,
    };
  }

  async update(id: string, dto: UpdateQuotationTemplateDto) {
    await this.findOne(id);

    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.defaultPlanId !== undefined)
      updateData.defaultPlanId = dto.defaultPlanId || null;
    if (dto.validityDays !== undefined)
      updateData.validityDays = dto.validityDays;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    await this.db
      .update(quotationTemplates)
      .set(updateData)
      .where(eq(quotationTemplates.id, id));

    if (dto.lines !== undefined) {
      // Re-create lines
      await this.db
        .delete(quotationTemplateLines)
        .where(eq(quotationTemplateLines.templateId, id));

      if (dto.lines.length > 0) {
        await this.db.insert(quotationTemplateLines).values(
          dto.lines.map((l) => ({
            templateId: id,
            productId: l.productId,
            variantValueId: l.variantValueId || null,
            defaultQuantity: l.defaultQuantity ?? 1,
          })),
        );
      }
    }

    return this.findOne(id);
  }

  async toggleStatus(id: string) {
    const template = await this.findOne(id);
    const newStatus = !template.isActive;

    await this.db
      .update(quotationTemplates)
      .set({ isActive: newStatus, updatedAt: new Date() })
      .where(eq(quotationTemplates.id, id));

    return this.findOne(id);
  }

  async duplicate(id: string, userId: string) {
    const template = await this.findOne(id);

    return this.create(
      {
        name: `${template.name} (Copy)`,
        description: template.description || undefined,
        defaultPlanId: template.defaultPlanId || undefined,
        validityDays: template.validityDays,
        isActive: true,
        lines: template.lines.map((l) => ({
          productId: l.productId,
          variantValueId: l.variantValueId || undefined,
          defaultQuantity: l.defaultQuantity,
        })),
      },
      userId,
    );
  }
}

