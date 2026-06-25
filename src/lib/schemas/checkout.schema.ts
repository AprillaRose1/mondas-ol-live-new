import { z } from 'zod';

// ── Form schemas (client-side validation only) ─────────────────────────────
export const shippingSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName:  z.string().min(2, 'Last name is required'),
  email:     z.string().email('Invalid email address'),
  phone:     z.string().min(6, 'Phone is required'),
  address:   z.string().min(5, 'Address is required'),
  city:      z.string().min(2, 'City is required'),
  zip:       z.string().min(3, 'ZIP is required'),
  country:   z.string().min(1, 'Country is required'),
});

export const paymentSchema = z.object({
  paymentMethod: z.literal('card'),
  cardName:   z.string().min(2, 'Name on card is required'),
  cardNumber: z.string().min(13).regex(/^[\d\s]+$/, 'Invalid card number'),
  expiry:     z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY'),
  cvc:        z.string().min(3).max(4),
});

export const checkoutFormSchema = shippingSchema.merge(paymentSchema);

// ── API payload schema (NO card data sent to backend) ──────────────────────
export const checkoutLineItemSchema = z.object({
  productId:   z.string().min(1),
  productName: z.string().min(1),
  quantity:    z.number().int().positive(),
  price:       z.number().positive(),
});

export type ShippingFormData  = z.infer<typeof shippingSchema>;
export type PaymentFormData   = z.infer<typeof paymentSchema>;
export type CheckoutFormData  = z.infer<typeof checkoutFormSchema>;
export type CheckoutLineItem  = z.infer<typeof checkoutLineItemSchema>;

export type CheckoutOrderResponse = {
  orderId: string;
  status:  'pending';
  total:   number;
  clientSecret: string | null;
};
