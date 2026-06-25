import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api/http';
import { API_ROUTES } from '@/lib/api/routes';
import type { Product } from '@/lib/types';
import type { PaginatedResult } from '@/lib/types/common';

export interface ProductsQuery {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
}

function buildQuery(q?: ProductsQuery): string {
  if (!q) return '';
  const params = new URLSearchParams();
  if (q.page)     params.set('page', String(q.page));
  if (q.limit)    params.set('limit', String(q.limit));
  if (q.category) params.set('category', q.category);
  if (q.featured !== undefined) params.set('featured', String(q.featured));
  if (q.search)   params.set('search', q.search);
  const str = params.toString();
  return str ? '?' + str : '';
}

export const fetchProducts = (query?: ProductsQuery) =>
  apiGet<PaginatedResult<Product>>(API_ROUTES.products + buildQuery(query));

export const fetchProductById = (id: string) =>
  apiGet<Product>(API_ROUTES.product(id));

export const createProduct = (data: Partial<Product>) =>
  apiPost<Product>(API_ROUTES.products, data);

export const updateProduct = (id: string, data: Partial<Product>) =>
  apiPatch<Product>(API_ROUTES.product(id), data);

export const deleteProduct = (id: string) =>
  apiDelete<{ ok: boolean }>(API_ROUTES.product(id));
