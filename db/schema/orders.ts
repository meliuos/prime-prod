import { pgTable, text, numeric, timestamp, uuid, index } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { services } from './services';

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderNumber: text('orderNumber').notNull().unique(), // e.g., "ORD-20250126-001"
  buyerId: text('buyerId')
    .notNull()
    .references(() => user.id),
  sellerId: text('sellerId')
    .references(() => user.id), // Agent assigned to this order
  serviceId: uuid('serviceId')
    .notNull()
    .references(() => services.id),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  platformCommissionRate: numeric('platformCommissionRate', { precision: 5, scale: 2 }).notNull().default('20.00'), // Commission percentage (e.g., 20.00 for 20%)
  platformCommission: numeric('platformCommission', { precision: 10, scale: 2 }), // Calculated commission amount
  agentEarnings: numeric('agentEarnings', { precision: 10, scale: 2 }), // Amount agent receives after commission
  status: text('status', {
    enum: [
      'pending',
      'assigned',
      'in_progress',
      'delivered',
      'revision_requested',
      'completed',
      'cancelled',
      'disputed'
    ]
  }).notNull().default('pending'),
  requirements: text('requirements'), // Buyer's requirements
  deliveryMessage: text('deliveryMessage'), // Seller's delivery message
  stripeSessionId: text('stripeSessionId').unique(),
  stripePaymentIntentId: text('stripePaymentIntentId'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  completedAt: timestamp('completedAt'),
  deletedAt: timestamp('deletedAt'), // Soft delete
}, (table) => ({
  buyerIdx: index('orders_buyer_idx').on(table.buyerId),
  sellerIdx: index('orders_seller_idx').on(table.sellerId),
  statusIdx: index('orders_status_idx').on(table.status),
  createdAtIdx: index('orders_created_at_idx').on(table.createdAt),
  stripeSessionIdx: index('orders_stripe_session_idx').on(table.stripeSessionId),
}));

export const orderStatusHistory = pgTable('order_status_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('orderId')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  status: text('status').notNull(),
  changedBy: text('changedBy')
    .notNull()
    .references(() => user.id),
  note: text('note'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
}, (table) => ({
  orderIdx: index('order_status_history_order_idx').on(table.orderId),
  createdAtIdx: index('order_status_history_created_at_idx').on(table.createdAt),
}));
