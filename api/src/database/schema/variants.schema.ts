import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from './products.schema';

export const productAttributes = pgTable(
  'product_attributes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    name: text('name').notNull(), // e.g., 'Brand', 'Edition', 'Storage'
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index('product_attributes_product_id_idx').on(table.productId)],
);

export const productAttributesRelations = relations(
  productAttributes,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productAttributes.productId],
      references: [products.id],
    }),
    values: many(productAttributeValues),
  }),
);

export const productAttributeValues = pgTable(
  'product_attribute_values',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    attributeId: uuid('attribute_id')
      .notNull()
      .references(() => productAttributes.id, { onDelete: 'cascade' }),
    value: text('value').notNull(), // e.g., 'Standard', 'Odoo', 'Premium'
    additionalPrice: integer('additional_price').notNull().default(0), // in minor units (paise), e.g. 56000 = ₹560
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('product_attribute_values_attribute_id_idx').on(table.attributeId),
  ],
);

export const productAttributeValuesRelations = relations(
  productAttributeValues,
  ({ one }) => ({
    attribute: one(productAttributes, {
      fields: [productAttributeValues.attributeId],
      references: [productAttributes.id],
    }),
  }),
);

export type ProductAttribute = typeof productAttributes.$inferSelect;
export type NewProductAttribute = typeof productAttributes.$inferInsert;
export type ProductAttributeValue = typeof productAttributeValues.$inferSelect;
export type NewProductAttributeValue =
  typeof productAttributeValues.$inferInsert;

