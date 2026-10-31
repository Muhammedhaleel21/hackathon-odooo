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
import { users } from './users.schema';
import { subscriptionPlans } from './plans.schema';
import { products } from './products.schema';
import { productAttributeValues } from './variants.schema';

export const quotationTemplates = pgTable(
  'quotation_templates',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    defaultPlanId: uuid('default_plan_id').references(
      () => subscriptionPlans.id,
      { onDelete: 'set null' },
    ),
    validityDays: integer('validity_days').notNull().default(15),
    isActive: boolean('is_active').notNull().default(true),
    createdBy: uuid('created_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('quotation_templates_default_plan_id_idx').on(table.defaultPlanId),
    index('quotation_templates_is_active_idx').on(table.isActive),
  ],
);

export const quotationTemplatesRelations = relations(
  quotationTemplates,
  ({ one, many }) => ({
    defaultPlan: one(subscriptionPlans, {
      fields: [quotationTemplates.defaultPlanId],
      references: [subscriptionPlans.id],
    }),
    creator: one(users, {
      fields: [quotationTemplates.createdBy],
      references: [users.id],
    }),
    lines: many(quotationTemplateLines),
  }),
);

export const quotationTemplateLines = pgTable(
  'quotation_template_lines',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    templateId: uuid('template_id')
      .notNull()
      .references(() => quotationTemplates.id, { onDelete: 'cascade' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'restrict' }),
    variantValueId: uuid('variant_value_id').references(
      () => productAttributeValues.id,
      { onDelete: 'set null' },
    ),
    defaultQuantity: integer('default_quantity').notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('quotation_template_lines_template_id_idx').on(table.templateId),
    index('quotation_template_lines_product_id_idx').on(table.productId),
  ],
);

export const quotationTemplateLinesRelations = relations(
  quotationTemplateLines,
  ({ one }) => ({
    template: one(quotationTemplates, {
      fields: [quotationTemplateLines.templateId],
      references: [quotationTemplates.id],
    }),
    product: one(products, {
      fields: [quotationTemplateLines.productId],
      references: [products.id],
    }),
    variantValue: one(productAttributeValues, {
      fields: [quotationTemplateLines.variantValueId],
      references: [productAttributeValues.id],
    }),
  }),
);

export type QuotationTemplate = typeof quotationTemplates.$inferSelect;
export type NewQuotationTemplate = typeof quotationTemplates.$inferInsert;
export type QuotationTemplateLine = typeof quotationTemplateLines.$inferSelect;
export type NewQuotationTemplateLine =
  typeof quotationTemplateLines.$inferInsert;

