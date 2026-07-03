import type { Product } from '@/lib/types';
import { MOCK_PRODUCTS } from '@/data/products';
import type { PaginatedResult } from '@/lib/types/common';
import { mockDelay, mockId, paginate } from '@/lib/api/_mock';

export interface ProductsQuery {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
}

export const fetchProducts = (
  query?: ProductsQuery,
): Promise<PaginatedResult<Product>> => {
  let list = [...MOCK_PRODUCTS];
  if (query?.category && query.category !== 'all') {
    list = list.filter((p) => p.category === query.category);
  }
  if (query?.featured !== undefined) {
    list = list.filter((p) => Boolean(p.isFeatured) === query.featured);
  }
  if (query?.search) {
    const s = query.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.en.toLowerCase().includes(s) ||
        p.name.de.toLowerCase().includes(s),
    );
  }
  return mockDelay(paginate(list, query?.page ?? 1, query?.limit ?? 12));
};

export const fetchProductById = (id: string): Promise<Product> => {
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  return product
    ? mockDelay(product)
    : Promise.reject(new Error('Product not found'));
};

export const createProduct = (data: Partial<Product>): Promise<Product> =>
  mockDelay({ ...(MOCK_PRODUCTS[0] as Product), ...data, id: mockId() });

export const updateProduct = (
  id: string,
  data: Partial<Product>,
): Promise<Product> => {
  const base = MOCK_PRODUCTS.find((p) => p.id === id) ?? MOCK_PRODUCTS[0];
  return mockDelay({ ...base, ...data, id });
};

export const deleteProduct = (_id: string): Promise<{ ok: boolean }> =>
  mockDelay({ ok: true });
