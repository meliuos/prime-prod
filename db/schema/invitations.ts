import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const invitations = pgTable('invitations', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull(),
  role: text('role', { enum: ['super_admin', 'agent', 'user'] }).notNull(),
  token: text('token').notNull().unique(),
  invitedBy: text('invitedBy').notNull().references(() => user.id),
  accepted: boolean('accepted').notNull().default(false),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  acceptedAt: timestamp('acceptedAt'),
});
