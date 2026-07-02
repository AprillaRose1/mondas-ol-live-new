import type { Order, OrderStatus } from '@/lib/types/user';
import type { PaginatedResult } from '@/lib/types/common';
import { MOCK_ORDERS } from '@/data/orders';
import { mockDelay, paginate } from '@/lib/api/_mock';

export interface OrdersQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  userId?: string;
}

export const fetchOrders = (
  query?: OrdersQuery,
): Promise<PaginatedResult<Order>> => {
  let list = [...MOCK_ORDERS];
  if (query?.status) list = list.filter((o) => o.status === query.status);
  if (query?.userId) list = list.filter((o) => o.userId === query.userId);
  return mockDelay(paginate(list, query?.page ?? 1, query?.limit ?? 20));
};

export const fetchOrderById = (id: string): Promise<Order> => {
  const order = MOCK_ORDERS.find((o) => o.id === id);
  return order
    ? mockDelay(order)
    : Promise.reject(new Error('Order not found'));
};

export const updateOrderStatus = (
  id: string,
  status: OrderStatus,
  notes?: string,
): Promise<Order> => {
  const base = MOCK_ORDERS.find((o) => o.id === id) ?? MOCK_ORDERS[0];
  return mockDelay({ ...base, id, status, ...(notes !== undefined ? { notes } : {}) });
};
