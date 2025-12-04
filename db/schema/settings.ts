import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const platformSettings = pgTable('platform_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: text('key').notNull().unique(), // e.g., 'default_commission_rate'
  value: text('value').notNull(), // Stored as string, parsed as needed
  description: text('description'),
  updatedBy: text('updatedBy'), // User ID who last updated
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});
