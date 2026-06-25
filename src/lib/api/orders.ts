import { apiGet, apiPatch } from '@/lib/api/http';
import { API_ROUTES } from '@/lib/api/routes';
import type { Order, OrderStatus } from '@/lib/types/user';
import type { PaginatedResult } from '@/lib/types/common';

export interface OrdersQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  userId?: string;
}

function buildQuery(q?: OrdersQuery): string {
  if (!q) return '';
  const p = new URLSearchParams();
  if (q.page)   p.set('page', String(q.page));
  if (q.limit)  p.set('limit', String(q.limit));
  if (q.status) p.set('status', q.status);
  if (q.userId) p.set('userId', q.userId);
  const s = p.toString();
  return s ? '?' + s : '';
}

export const fetchOrders = (query?: OrdersQuery) =>
  apiGet<PaginatedResult<Order>>(API_ROUTES.orders + buildQuery(query));

export const fetchOrderById = (id: string) =>
  apiGet<Order>(API_ROUTES.order(id));

export const updateOrderStatus = (id: string, status: OrderStatus, notes?: string) =>
  apiPatch<Order>(API_ROUTES.orderStatus(id), { status, notes });
