import type { ShippingFormData } from '@/lib/schemas';
import { mockDelay, mockId } from '@/lib/api/_mock';

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

export interface PaymentIntentResponse {
  orderId: string;
  clientSecret: string | null;
  total: number;
  discountAmount?: number;
  couponCode?: string;
}

// Standalone build: no payment backend. The order is "recorded" locally and no
// Stripe client secret is issued (clientSecret stays null → the UI shows the
// non-Stripe confirmation path).
export const submitCheckout = (
  payload: CheckoutPayload,
): Promise<CheckoutResponse> =>
  mockDelay<CheckoutResponse>({
    orderId: mockId(),
    status: 'pending',
    total: payload.subtotal + payload.shippingCost,
    clientSecret: null,
  });

export const createPaymentIntent = (
  payload: CheckoutPayload,
): Promise<PaymentIntentResponse> =>
  mockDelay({
    orderId: mockId(),
    clientSecret: null,
    total: payload.subtotal + payload.shippingCost,
  });
