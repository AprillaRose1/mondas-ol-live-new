import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types';
import type { PaginatedResult } from '../types/common';
import { fetchProducts, type ProductsQuery } from '../api/products';

interface UseProductsResult {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useProducts = (query?: ProductsQuery): UseProductsResult => {
  const [result, setResult] = useState<PaginatedResult<Product>>({
    data: [], total: 0, page: 1, limit: 12, totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryKey = JSON.stringify(query);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchProducts(query)
      .then((r) => setResult(r))
      .catch(() => setError('Failed to fetch products'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  useEffect(() => { load(); }, [load]);

  return {
    products: result.data,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
    loading,
    error,
    refetch: load,
  };
};
