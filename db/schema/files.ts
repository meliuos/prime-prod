import { pgTable, text, timestamp, uuid, integer, index } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { orders } from './orders';

export const files = pgTable('files', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
  orderId: uuid('orderId')
    .references(() => orders.id, { onDelete: 'cascade' }),
  filename: text('filename').notNull(), // Generated unique filename
  originalName: text('originalName').notNull(), // Original uploaded filename
  mimeType: text('mimeType').notNull(),
  size: integer('size').notNull(), // File size in bytes
  path: text('path').notNull(), // File system path
  fileType: text('fileType', {
    enum: ['deliverable', 'requirement', 'avatar', 'service_image']
  }).notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  deletedAt: timestamp('deletedAt'), // Soft delete
}, (table) => ({
  userIdx: index('files_user_idx').on(table.userId),
  orderIdx: index('files_order_idx').on(table.orderId),
  typeIdx: index('files_type_idx').on(table.fileType),
  createdAtIdx: index('files_created_at_idx').on(table.createdAt),
}));
