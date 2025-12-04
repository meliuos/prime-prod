import { relations } from 'drizzle-orm';

// Import all tables
export * from './auth';
export * from './services';
export * from './orders';
export * from './files';
export * from './settings';
export * from './showcases';
export * from './invitations';

import { user, session, account } from './auth';
import { services } from './services';
import { orders, orderStatusHistory } from './orders';
import { files } from './files';
import { invitations } from './invitations';

// Define relations
export const userRelations = relations(user, ({ many }) => ({
  ordersAsBuyer: many(orders, { relationName: 'buyer' }),
  ordersAsSeller: many(orders, { relationName: 'seller' }),
  files: many(files),
  sessions: many(session),
  accounts: many(account),
  statusChanges: many(orderStatusHistory),
  sentInvitations: many(invitations),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  buyer: one(user, {
    fields: [orders.buyerId],
    references: [user.id],
    relationName: 'buyer',
  }),
  seller: one(user, {
    fields: [orders.sellerId],
    references: [user.id],
    relationName: 'seller',
  }),
  service: one(services, {
    fields: [orders.serviceId],
    references: [services.id],
  }),
  files: many(files),
  statusHistory: many(orderStatusHistory),
}));

export const orderStatusHistoryRelations = relations(orderStatusHistory, ({ one }) => ({
  order: one(orders, {
    fields: [orderStatusHistory.orderId],
    references: [orders.id],
  }),
  changedBy: one(user, {
    fields: [orderStatusHistory.changedBy],
    references: [user.id],
  }),
}));

export const filesRelations = relations(files, ({ one }) => ({
  user: one(user, {
    fields: [files.userId],
    references: [user.id],
  }),
  order: one(orders, {
    fields: [files.orderId],
    references: [orders.id],
  }),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  invitedByUser: one(user, {
    fields: [invitations.invitedBy],
    references: [user.id],
  }),
}));
