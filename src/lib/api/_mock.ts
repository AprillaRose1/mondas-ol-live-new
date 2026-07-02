// Standalone / "stale" build: there is NO backend. These helpers serve the
// local mock data under src/data so the app runs fully client-side with no
// network calls. Signatures of the public api/* modules are unchanged, so the
// rest of the app is untouched.
import type { PaginatedResult } from '@/lib/types/common';

export const mockDelay = <T>(data: T, ms = 100): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export function paginate<T>(all: T[], page = 1, limit = 20): PaginatedResult<T> {
  const p = Math.max(1, page);
  const start = (p - 1) * limit;
  return {
    data: all.slice(start, start + limit),
    total: all.length,
    page: p,
    limit,
    totalPages: Math.max(1, Math.ceil(all.length / limit)),
  };
}

export const mockId = (): string =>
  'mock-' + Math.random().toString(36).slice(2, 10);
