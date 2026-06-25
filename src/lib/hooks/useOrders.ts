import { useState, useEffect } from 'react';
import type { Order } from '../types/user';
import type { PaginatedResult } from '../types/common';
import { fetchOrders, type OrdersQuery } from '../api/orders';

interface UseOrdersResult {
  orders: Order[];
  total: number;
  loading: boolean;
  error: string | null;
}

export const useOrders = (query?: OrdersQuery): UseOrdersResult => {
  const [result, setResult] = useState<PaginatedResult<Order>>({
    data: [], total: 0, page: 1, limit: 12, totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryKey = JSON.stringify(query);

  useEffect(() => {
    setLoading(true);
    fetchOrders(query)
      .then((r) => setResult(r))
      .catch((err) => {
        // ApiError with status 401 is handled globally by auth-hydrator
        if ((err as { status?: number }).status !== 401) {
          setError('Failed to fetch orders');
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  return { orders: result.data, total: result.total, loading, error };
};
