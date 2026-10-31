import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq, ilike, or, SQL } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.constants';
import { AppDatabase } from '../../database/database.provider';
import {
  subscriptionPlans,
  products,
  NewSubscriptionPlan,
} from '../../database/schema';
import { QueryPlanDto } from './dto/query-plan.dto';

@Injectable()
export class PlansRepository {
  constructor(@Inject(DRIZZLE) private readonly db: AppDatabase) {}

  async create(data: NewSubscriptionPlan) {
    const [plan] = await this.db
      .insert(subscriptionPlans)
      .values(data)
      .returning();
    return plan;
  }

  async findAll(query: QueryPlanDto) {
    const conditions: SQL[] = [];

    if (query.search?.trim()) {
      const term = `%${query.search.trim()}%`;
      conditions.push(
        or(
          ilike(subscriptionPlans.name, term),
          ilike(subscriptionPlans.description, term),
          ilike(products.name, term),
        )!,
      );
    }

    if (query.productId) {
      conditions.push(eq(subscriptionPlans.productId, query.productId));
    }

    if (query.interval) {
      conditions.push(eq(subscriptionPlans.billingInterval, query.interval));
    }

    if (query.status) {
      conditions.push(eq(subscriptionPlans.status, query.status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const items = await this.db
      .select({
        id: subscriptionPlans.id,
        productId: subscriptionPlans.productId,
        productName: products.name,
        productSalesPrice: products.salesPrice,
        name: subscriptionPlans.name,
        description: subscriptionPlans.description,
        price: subscriptionPlans.price,
        billingInterval: subscriptionPlans.billingInterval,
        billingIntervalCount: subscriptionPlans.billingIntervalCount,
        minQuantity: subscriptionPlans.minQuantity,
        availableFrom: subscriptionPlans.availableFrom,
        availableUntil: subscriptionPlans.availableUntil,
        autoClose: subscriptionPlans.autoClose,
        earlyClosureAllowed: subscriptionPlans.earlyClosureAllowed,
        pauseAllowed: subscriptionPlans.pauseAllowed,
        renewalAllowed: subscriptionPlans.renewalAllowed,
        status: subscriptionPlans.status,
        createdAt: subscriptionPlans.createdAt,
        updatedAt: subscriptionPlans.updatedAt,
      })
      .from(subscriptionPlans)
      .innerJoin(products, eq(subscriptionPlans.productId, products.id))
      .where(whereClause)
      .orderBy(desc(subscriptionPlans.createdAt));

    return items;
  }

  async findById(id: string) {
    const [plan] = await this.db
      .select({
        id: subscriptionPlans.id,
        productId: subscriptionPlans.productId,
        productName: products.name,
        productSalesPrice: products.salesPrice,
        name: subscriptionPlans.name,
        description: subscriptionPlans.description,
        price: subscriptionPlans.price,
        billingInterval: subscriptionPlans.billingInterval,
        billingIntervalCount: subscriptionPlans.billingIntervalCount,
        minQuantity: subscriptionPlans.minQuantity,
        availableFrom: subscriptionPlans.availableFrom,
        availableUntil: subscriptionPlans.availableUntil,
        autoClose: subscriptionPlans.autoClose,
        earlyClosureAllowed: subscriptionPlans.earlyClosureAllowed,
        pauseAllowed: subscriptionPlans.pauseAllowed,
        renewalAllowed: subscriptionPlans.renewalAllowed,
        status: subscriptionPlans.status,
        createdAt: subscriptionPlans.createdAt,
        updatedAt: subscriptionPlans.updatedAt,
      })
      .from(subscriptionPlans)
      .innerJoin(products, eq(subscriptionPlans.productId, products.id))
      .where(eq(subscriptionPlans.id, id));

    return plan || null;
  }

  async update(id: string, data: Partial<NewSubscriptionPlan>) {
    const [updated] = await this.db
      .update(subscriptionPlans)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(subscriptionPlans.id, id))
      .returning();

    return updated;
  }

  async delete(id: string) {
    await this.db
      .delete(subscriptionPlans)
      .where(eq(subscriptionPlans.id, id));
  }
}

