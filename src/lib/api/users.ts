import type { User } from '@/lib/types/user';
import type { PaginatedResult } from '@/lib/types/common';
import { mockDelay, paginate } from '@/lib/api/_mock';

export const fetchUsers = (
  page = 1,
  limit = 12,
): Promise<PaginatedResult<User>> => mockDelay(paginate([] as User[], page, limit));

export const fetchUserById = (id: string): Promise<User> =>
  mockDelay({
    id,
    email: 'demo@mondas.local',
    name: 'Demo User',
    role: 'customer' as User['role'],
  });

export const updateUser = (
  id: string,
  data: Partial<Pick<User, 'name' | 'email' | 'role'>>,
): Promise<User> =>
  mockDelay({
    id,
    email: data.email ?? 'demo@mondas.local',
    name: data.name ?? 'Demo User',
    role: (data.role ?? 'customer') as User['role'],
  });

export const deleteUser = (_id: string): Promise<{ ok: boolean }> =>
  mockDelay({ ok: true });

export const changePassword = (
  _id: string,
  _currentPassword: string,
  _newPassword: string,
): Promise<{ ok: boolean }> => mockDelay({ ok: true });
