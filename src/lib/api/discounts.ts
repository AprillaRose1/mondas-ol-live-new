import { mockDelay, mockId } from '@/lib/api/_mock';

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

export const validateCoupon = (
  code: string,
  orderAmount: number,
): Promise<CouponResult> =>
  mockDelay({
    valid: false,
    code,
    type: 'percentage',
    value: 0,
    discountAmount: 0,
    finalAmount: orderAmount,
    message: 'Coupons are disabled in the standalone demo.',
  });

export const fetchDiscounts = (): Promise<Discount[]> => mockDelay([]);

export const createDiscount = (input: CreateDiscountInput): Promise<Discount> =>
  mockDelay({
    id: mockId(),
    code: input.code,
    type: input.type,
    value: input.value,
    minOrderAmount: input.minOrderAmount ?? 0,
    maxUses: input.maxUses ?? null,
    usedCount: 0,
    expiresAt: input.expiresAt ?? null,
    active: input.active ?? true,
  });

export const toggleDiscount = (id: string): Promise<Discount> =>
  mockDelay({
    id,
    code: 'DEMO',
    type: 'percentage',
    value: 0,
    minOrderAmount: 0,
    maxUses: null,
    usedCount: 0,
    expiresAt: null,
    active: true,
  });

export const deleteDiscount = (_id: string): Promise<{ ok: boolean }> =>
  mockDelay({ ok: true });
