import { z } from 'zod';

// Order status enum from database schema
export const orderStatusEnum = z.enum([
    'pending',
    'requirements_submitted',
    'design_in_progress',
    'review',
    'revisions',
    'completed',
    'cancelled',
    'refunded',
]);

export type OrderStatus = z.infer<typeof orderStatusEnum>;

// Create order schema
export const createOrderSchema = z.object({
    serviceId: z.string().uuid(),
    userId: z.string(),
    totalAmount: z.number().positive(),
    stripePaymentId: z.string(),
    stripeSessionId: z.string().optional(),
    requirements: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// Update order status schema
export const updateOrderStatusSchema = z.object({
    orderId: z.string().uuid(),
    status: orderStatusEnum,
    notes: z.string().optional(),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

// Add requirements schema
export const addRequirementsSchema = z.object({
    orderId: z.string().uuid(),
    requirements: z.string().min(10, 'Requirements must be at least 10 characters'),
});

export type AddRequirementsInput = z.infer<typeof addRequirementsSchema>;
