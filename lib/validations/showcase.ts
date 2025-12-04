import { z } from 'zod';

export const createShowcaseSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
    description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
    category: z.string().min(1, 'Category is required'),
    imageUrl: z.string().url('Must be a valid URL'),
    order: z.number().int().min(0, 'Order must be a positive number').default(0),
    isActive: z.boolean().default(true),
});

export const updateShowcaseSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters').optional(),
    description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters').optional(),
    category: z.string().min(1, 'Category is required').optional(),
    imageUrl: z.string().url('Must be a valid URL').optional(),
    order: z.number().int().min(0, 'Order must be a positive number').optional(),
    isActive: z.boolean().optional(),
});

export type CreateShowcaseInput = z.infer<typeof createShowcaseSchema>;
export type UpdateShowcaseInput = z.infer<typeof updateShowcaseSchema>;
