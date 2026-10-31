import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.schema';
import { subscriptionPlans } from './plans.schema';
import { products } from './products.schema';
import { productAttributeValues } from './variants.schema';
import { quotationTemplates } from './quotation-templates.schema';

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'draft',
  'quotation',
  'confirmed',
  'active',
  'closed',
]);

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    quotationNumber: text('quotation_number').notNull(), // e.g. QT-2026-0001
    subscriptionNumber: text('subscription_number'), // e.g. SUB-2026-0001 (assigned when confirmed/active)
    customerId: uuid('customer_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    quotationTemplateId: uuid('quotation_template_id').references(
      () => quotationTemplates.id,
      { onDelete: 'set null' },
    ),
    planId: uuid('plan_id')
      .notNull()
      .references(() => subscriptionPlans.id, { onDelete: 'restrict' }),
    status: subscriptionStatusEnum('status').notNull().default('draft'),
    quotationValidUntil: timestamp('quotation_valid_until', {
      withTimezone: true,
    }),
    startDate: timestamp('start_date', { withTimezone: true }),
    expiryDate: timestamp('expiry_date', { withTimezone: true }),
    paymentTerms: text('payment_terms').notNull().default('immediate'), // e.g. immediate, net_15, net_30
    subtotal: integer('subtotal').notNull().default(0), // in minor units (paise)
    taxTotal: integer('tax_total').notNull().default(0), // 18% GST in minor units (paise)
    totalAmount: integer('total_amount').notNull().default(0), // total in minor units (paise)
    notes: text('notes'),
    createdBy: uuid('created_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
    activatedAt: timestamp('activated_at', { withTimezone: true }),
    closedAt: timestamp('closed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('subscriptions_quotation_number_idx').on(table.quotationNumber),
    uniqueIndex('subscriptions_subscription_number_idx').on(
      table.subscriptionNumber,
    ),
    index('subscriptions_customer_id_idx').on(table.customerId),
    index('subscriptions_status_idx').on(table.status),
    index('subscriptions_plan_id_idx').on(table.planId),
  ],
);

export const subscriptionsRelations = relations(
  subscriptions,
  ({ one, many }) => ({
    customer: one(users, {
      fields: [subscriptions.customerId],
      references: [users.id],
    }),
    plan: one(subscriptionPlans, {
      fields: [subscriptions.planId],
      references: [subscriptionPlans.id],
    }),
    template: one(quotationTemplates, {
      fields: [subscriptions.quotationTemplateId],
      references: [quotationTemplates.id],
    }),
    creator: one(users, {
      fields: [subscriptions.createdBy],
      references: [users.id],
    }),
    lines: many(subscriptionLines),
    statusHistory: many(subscriptionStatusHistory),
  }),
);

export const subscriptionLines = pgTable(
  'subscription_lines',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    subscriptionId: uuid('subscription_id')
      .notNull()
      .references(() => subscriptions.id, { onDelete: 'cascade' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'restrict' }),
    variantValueId: uuid('variant_value_id').references(
      () => productAttributeValues.id,
      { onDelete: 'set null' },
    ),
    productName: text('product_name').notNull(), // Snapshot
    variantName: text('variant_name'), // Snapshot (e.g., 'Brand: Odoo')
    quantity: integer('quantity').notNull().default(1),
    unitPrice: integer('unit_price').notNull(), // Snapshot in paise (product salesPrice + variant add)
    taxRate: integer('tax_rate').notNull().default(18), // e.g., 18 for 18%
    taxAmount: integer('tax_amount').notNull().default(0), // in paise
    lineTotal: integer('line_total').notNull().default(0), // in paise: (unitPrice * quantity) + taxAmount
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('subscription_lines_subscription_id_idx').on(table.subscriptionId),
    index('subscription_lines_product_id_idx').on(table.productId),
  ],
);

export const subscriptionLinesRelations = relations(
  subscriptionLines,
  ({ one }) => ({
    subscription: one(subscriptions, {
      fields: [subscriptionLines.subscriptionId],
      references: [subscriptions.id],
    }),
    product: one(products, {
      fields: [subscriptionLines.productId],
      references: [products.id],
    }),
    variantValue: one(productAttributeValues, {
      fields: [subscriptionLines.variantValueId],
      references: [productAttributeValues.id],
    }),
  }),
);

export const subscriptionStatusHistory = pgTable(
  'subscription_status_history',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    subscriptionId: uuid('subscription_id')
      .notNull()
      .references(() => subscriptions.id, { onDelete: 'cascade' }),
    previousStatus: text('previous_status'),
    newStatus: text('new_status').notNull(),
    changedBy: uuid('changed_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    reason: text('reason'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('subscription_status_history_subscription_id_idx').on(
      table.subscriptionId,
    ),
    index('subscription_status_history_created_at_idx').on(table.createdAt),
  ],
);

export const subscriptionStatusHistoryRelations = relations(
  subscriptionStatusHistory,
  ({ one }) => ({
    subscription: one(subscriptions, {
      fields: [subscriptionStatusHistory.subscriptionId],
      references: [subscriptions.id],
    }),
    actor: one(users, {
      fields: [subscriptionStatusHistory.changedBy],
      references: [users.id],
    }),
  }),
);

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type SubscriptionLine = typeof subscriptionLines.$inferSelect;
export type NewSubscriptionLine = typeof subscriptionLines.$inferInsert;
export type SubscriptionStatusHistory =
  typeof subscriptionStatusHistory.$inferSelect;
export type NewSubscriptionStatusHistory =
  typeof subscriptionStatusHistory.$inferInsert;

