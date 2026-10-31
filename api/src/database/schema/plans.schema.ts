import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from './products.schema';

export const billingIntervalEnum = pgEnum('billing_interval', [
  'daily',
  'weekly',
  'monthly',
  'yearly',
]);

export const planStatusEnum = pgEnum('plan_status', [
  'draft',
  'published',
  'deactivated',
]);

export const subscriptionPlans = pgTable(
  'subscription_plans',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'restrict' }),
    name: text('name').notNull(),
    description: text('description'),
    price: integer('price').notNull(), // Recurring price in minor units (paise)
    billingInterval: billingIntervalEnum('billing_interval')
      .notNull()
      .default('monthly'),
    billingIntervalCount: integer('billing_interval_count').notNull().default(1),
    minQuantity: integer('min_quantity').notNull().default(1),
    availableFrom: timestamp('available_from', { withTimezone: true })
      .defaultNow()
      .notNull(),
    availableUntil: timestamp('available_until', { withTimezone: true }),
    autoClose: boolean('auto_close').notNull().default(false),
    earlyClosureAllowed: boolean('early_closure_allowed')
      .notNull()
      .default(true),
    pauseAllowed: boolean('pause_allowed').notNull().default(true),
    renewalAllowed: boolean('renewal_allowed').notNull().default(true),
    status: planStatusEnum('status').notNull().default('draft'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('subscription_plans_product_id_idx').on(table.productId),
    index('subscription_plans_status_idx').on(table.status),
    index('subscription_plans_interval_idx').on(table.billingInterval),
  ],
);

export const subscriptionPlansRelations = relations(
  subscriptionPlans,
  ({ one }) => ({
    product: one(products, {
      fields: [subscriptionPlans.productId],
      references: [products.id],
    }),
  }),
);

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type NewSubscriptionPlan = typeof subscriptionPlans.$inferInsert;

