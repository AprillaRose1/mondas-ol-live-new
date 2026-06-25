import type { User } from '@/lib/types/user';
import type { SessionUser } from '@/lib/auth/types';

/**
 * Maps the SessionUser returned by the backend into the Redux User shape.
 * Backend is the single source of truth for roles — no client-side inference.
 */
export function toReduxUser(session: SessionUser): User {
  return {
    id: session.id,
    email: session.email,
    name: session.name,
    role: session.role,
    orders: [],
    wishlist: [],
  };
}
