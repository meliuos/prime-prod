import { z } from 'zod';

// File upload schema
export const fileUploadSchema = z.object({
    filename: z.string().min(1, 'Filename is required'),
    mimeType: z.string().regex(/^[a-z]+\/[a-z0-9\-.+]+$/i, 'Invalid MIME type'),
    fileSize: z.number().positive().max(100 * 1024 * 1024, 'File size must be less than 100MB'),
    relatedEntityType: z.enum(['order', 'service', 'user']),
    relatedEntityId: z.string().uuid(),
    category: z.enum(['requirement', 'deliverable', 'profile', 'service_image', 'other']).optional(),
});

export type FileUploadInput = z.infer<typeof fileUploadSchema>;

// File metadata schema
export const fileMetadataSchema = z.object({
    fileId: z.string().uuid(),
    title: z.string().max(200).optional(),
    description: z.string().max(1000).optional(),
});

export type FileMetadataInput = z.infer<typeof fileMetadataSchema>;
