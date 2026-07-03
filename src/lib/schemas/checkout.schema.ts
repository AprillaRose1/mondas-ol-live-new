import { z } from 'zod';

// Checkout collects shipping only — card data goes straight to Stripe Elements,
// and PayPal is handled by its own buttons. No card fields live in our form.
export const shippingSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  // Optional — empty string allowed; a non-empty value must be a valid email.
  lastName:  z.string().optional(),
  email:     z.union([z.string().email('Invalid email address'), z.literal('')]).optional(),
  phone:     z.string().min(6, 'Phone is required'),
  address:   z.string().optional(),
  city:      z.string().min(2, 'City is required'),
  zip:       z.string().min(3, 'ZIP is required'),
  country:   z.string().min(1, 'Country is required'),
});

export type ShippingFormData = z.infer<typeof shippingSchema>;
