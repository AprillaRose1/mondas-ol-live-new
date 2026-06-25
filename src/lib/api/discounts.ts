import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api/http';
import { API_ROUTES } from '@/lib/api/routes';

export interface CouponResult {
  valid: boolean;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  discountAmount: number;
  finalAmount: number;
  message: string;
}

export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  active: boolean;
}

export interface CreateDiscountInput {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxUses?: number | null;
  expiresAt?: string | null;
  active?: boolean;
}

export const validateCoupon = (code: string, orderAmount: number) =>
  apiPost<CouponResult>(API_ROUTES.discounts + '/validate', { code, orderAmount });

export const fetchDiscounts = () =>
  apiGet<Discount[]>(API_ROUTES.discounts);

export const createDiscount = (input: CreateDiscountInput) =>
  apiPost<Discount>(API_ROUTES.discounts, input);

export const toggleDiscount = (id: string) =>
  apiPatch<Discount>(API_ROUTES.discounts + '/' + id + '/toggle', {});

export const deleteDiscount = (id: string) =>
  apiDelete<{ ok: boolean }>(API_ROUTES.discounts + '/' + id);
