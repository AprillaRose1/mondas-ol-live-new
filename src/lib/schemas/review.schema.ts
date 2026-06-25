import { z } from 'zod';

export const reviewSchema = z.object({
  rating: z.number().int().min(1, 'Please select a rating').max(5),
  text: z
    .string()
    .trim()
    .min(10, 'Review must be at least 10 characters')
    .max(1000, 'Review must be 1000 characters or fewer'),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
