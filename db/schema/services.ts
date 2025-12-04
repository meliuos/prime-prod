import { pgTable, text, numeric, timestamp, uuid, boolean, integer, index } from 'drizzle-orm/pg-core';

export const services = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  category: text('category', {
    enum: [
      'graphic_design',
      'fivem_trailer',
      'custom_clothing',
      'custom_cars',
      'streaming_design',
      'business_branding',
      'discord_design',
      '3d_design',
      '2d_design'
    ]
  }).notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  deliveryTime: integer('deliveryTime').notNull(), // In days
  icon: text('icon'), // Icon name or path
  color: text('color').default('#0284c7'), // Light blue default
  imageUrl: text('imageUrl'),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  deletedAt: timestamp('deletedAt'), // Soft delete
}, (table) => ({
  slugIdx: index('services_slug_idx').on(table.slug),
  categoryIdx: index('services_category_idx').on(table.category),
  activeIdx: index('services_active_idx').on(table.isActive),
}));
