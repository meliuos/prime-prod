import { z } from 'zod';

// Service category enum from database schema
export const serviceCategoryEnum = z.enum([
    'graphic_design',
    'fivem_trailer',
    'custom_clothing',
    'custom_cars',
    'streaming_design',
    'business_branding',
    'discord_design',
    '3d_design',
    '2d_design',
]);

export type ServiceCategory = z.infer<typeof serviceCategoryEnum>;

// Create service schema (aligned with DB schema)
export const createServiceSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(200),
    slug: z.string().min(3, 'Slug must be at least 3 characters').max(200).regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    category: serviceCategoryEnum,
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number with up to 2 decimal places'),
    deliveryTime: z.number().int().positive('Delivery time must be a positive integer'),
    icon: z.string().optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color').optional(),
    imageUrl: z.string().optional(),
    isActive: z.boolean().default(true),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;

// Update service schema (all fields optional except ID)
export const updateServiceSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(3).max(200).optional(),
    slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/).optional(),
    description: z.string().min(10).optional(),
    category: serviceCategoryEnum.optional(),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
    deliveryTime: z.number().int().positive().optional(),
    icon: z.string().optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    imageUrl: z.string().optional(),
    isActive: z.boolean().optional(),
});

export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;

// Service filter schema for searching/filtering
export const serviceFilterSchema = z.object({
    category: serviceCategoryEnum.optional(),
    search: z.string().optional(),
    minPrice: z.number().positive().optional(),
    maxPrice: z.number().positive().optional(),
    isActive: z.boolean().optional(),
});

export type ServiceFilterInput = z.infer<typeof serviceFilterSchema>;
