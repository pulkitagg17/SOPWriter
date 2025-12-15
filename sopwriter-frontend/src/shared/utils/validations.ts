import { z } from 'zod';

/**
 * Wizard Details Validation Schema
 * Validates user details input in the wizard form
 */
export const detailsSchema = z.object({
    name: z.string()
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .regex(/^[a-zA-Z\s\-\.']+$/, 'Name can only contain letters and spaces'),

    email: z.string()
        .email('Please enter a valid email address')
        .toLowerCase()
        .trim(),

    phone: z.string()
        .min(1, 'Phone number is required')
        .regex(/^\+\d{1,4}\s\d+$/, 'Phone must be in format: +XX XXXXXXXXXX'),

    notes: z.string()
        .max(1000, 'Notes cannot exceed 1000 characters')
        .optional(),
});

export type DetailsFormData = z.infer<typeof detailsSchema>;
