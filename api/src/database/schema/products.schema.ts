import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { productCategories } from './categories.schema';
import { productAttributes } from './variants.schema';
import { subscriptionPlans } from './plans.schema';

export const productTypeEnum = pgEnum('product_type', [
  'service',
  'goods',
  'addon',
]);

export const productStatusEnum = pgEnum('product_status', [
  'active',
  'archived',
]);

export const products = pgTable(
  'products',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    categoryId: uuid('category_id').references(() => productCategories.id, {
      onDelete: 'set null',
    }),
    productType: productTypeEnum('product_type').notNull().default('service'),
    salesPrice: integer('sales_price').notNull(), // Price in minor units (paise) e.g. 200000 = ₹2,000
    costPrice: integer('cost_price').notNull().default(0), // Cost in minor units (paise) e.g. 80000 = ₹800
    notes: text('notes'),
    status: productStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('products_category_id_idx').on(table.categoryId),
    index('products_status_idx').on(table.status),
    index('products_type_idx').on(table.productType),
  ],
);

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(productCategories, {
    fields: [products.categoryId],
    references: [productCategories.id],
  }),
  attributes: many(productAttributes),
  plans: many(subscriptionPlans),
}));

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

