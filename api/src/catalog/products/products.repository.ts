import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq, ilike, or, SQL } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.constants';
import { AppDatabase } from '../../database/database.provider';
import {
  products,
  productCategories,
  productAttributes,
  productAttributeValues,
  subscriptionPlans,
  NewProduct,
} from '../../database/schema';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: AppDatabase) {}

  async create(data: NewProduct) {
    const [product] = await this.db.insert(products).values(data).returning();
    return product;
  }

  async findAll(query: QueryProductDto) {
    const conditions: SQL[] = [];

    if (query.search?.trim()) {
      const term = `%${query.search.trim()}%`;
      conditions.push(or(ilike(products.name, term), ilike(products.notes, term))!);
    }

    if (query.type) {
      conditions.push(eq(products.productType, query.type));
    }

    if (query.status) {
      conditions.push(eq(products.status, query.status));
    }

    if (query.categoryId) {
      conditions.push(eq(products.categoryId, query.categoryId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const items = await this.db
      .select({
        id: products.id,
        name: products.name,
        categoryId: products.categoryId,
        categoryName: productCategories.name,
        productType: products.productType,
        salesPrice: products.salesPrice,
        costPrice: products.costPrice,
        notes: products.notes,
        status: products.status,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(
        productCategories,
        eq(products.categoryId, productCategories.id),
      )
      .where(whereClause)
      .orderBy(desc(products.createdAt));

    return items;
  }

  async findById(id: string) {
    const [product] = await this.db
      .select({
        id: products.id,
        name: products.name,
        categoryId: products.categoryId,
        categoryName: productCategories.name,
        productType: products.productType,
        salesPrice: products.salesPrice,
        costPrice: products.costPrice,
        notes: products.notes,
        status: products.status,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(
        productCategories,
        eq(products.categoryId, productCategories.id),
      )
      .where(eq(products.id, id));

    if (!product) return null;

    // Load attributes & values
    const attributes = await this.db
      .select()
      .from(productAttributes)
      .where(eq(productAttributes.productId, id))
      .orderBy(productAttributes.createdAt);

    const attributesWithValues = await Promise.all(
      attributes.map(async (attr) => {
        const values = await this.db
          .select()
          .from(productAttributeValues)
          .where(eq(productAttributeValues.attributeId, attr.id))
          .orderBy(productAttributeValues.createdAt);
        return {
          ...attr,
          values,
        };
      }),
    );

    // Load plans
    const plans = await this.db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.productId, id))
      .orderBy(desc(subscriptionPlans.createdAt));

    return {
      ...product,
      attributes: attributesWithValues,
      plans,
    };
  }

  async update(id: string, data: Partial<NewProduct>) {
    const [updated] = await this.db
      .update(products)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    return updated;
  }

  async delete(id: string) {
    await this.db.delete(products).where(eq(products.id, id));
  }
}

