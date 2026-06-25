import { apiPost } from '@/lib/api/http';
import { API_ROUTES } from '@/lib/api/routes';
import type { ShippingFormData } from '@/lib/schemas';

export interface CheckoutLineItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface CheckoutPayload {
  shipping: ShippingFormData;
  items: CheckoutLineItem[];
  subtotal: number;
  shippingCost: number;
  couponCode?: string;
  notes?: string;
}

export interface CheckoutResponse {
  orderId: string;
  status: 'pending';
  total: number;
  discountAmount?: number;
  couponCode?: string;
  clientSecret: string | null;
}

export const submitCheckout = (payload: CheckoutPayload) =>
  apiPost<CheckoutResponse>(API_ROUTES.checkout, payload);

export interface PaymentIntentResponse {
  orderId: string;
  clientSecret: string | null;
  total: number;
  discountAmount?: number;
  couponCode?: string;
}

/** Creates a Stripe PaymentIntent + a pending order; returns the client secret for Stripe Elements. */
export const createPaymentIntent = (payload: CheckoutPayload) =>
  apiPost<PaymentIntentResponse>(API_ROUTES.checkout + '/create-intent', payload);
