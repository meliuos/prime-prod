import { pgTable, text, timestamp, uuid, boolean, integer, index } from 'drizzle-orm/pg-core';

export const showcases = pgTable('showcases', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    category: text('category').notNull(), // e.g., "Motion Graphics", "Logo Design", "Banners"
    imageUrl: text('imageUrl').notNull(),
    order: integer('order').notNull().default(0),
    isActive: boolean('isActive').notNull().default(true),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
    deletedAt: timestamp('deletedAt'), // Soft delete
}, (table) => ({
    orderIdx: index('showcases_order_idx').on(table.order),
    activeIdx: index('showcases_active_idx').on(table.isActive),
    categoryIdx: index('showcases_category_idx').on(table.category),
}));
