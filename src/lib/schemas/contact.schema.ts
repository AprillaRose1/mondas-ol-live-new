import { z } from 'zod';

export const CONTACT_SUBJECTS = ['general', 'wholesale', 'order', 'feedback'] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.enum(CONTACT_SUBJECTS),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const contactMessageBodySchema = contactFormSchema;

export type ContactFormData = z.infer<typeof contactFormSchema>;
