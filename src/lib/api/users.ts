import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api/http';
import { API_ROUTES } from '@/lib/api/routes';
import type { User } from '@/lib/types/user';
import type { PaginatedResult } from '@/lib/types/common';

export const fetchUsers = (page = 1, limit = 12) =>
  apiGet<PaginatedResult<User>>(API_ROUTES.users + '?page=' + page + '&limit=' + limit);

export const fetchUserById = (id: string) =>
  apiGet<User>(API_ROUTES.user(id));

export const updateUser = (id: string, data: Partial<Pick<User, 'name' | 'email' | 'role'>>) =>
  apiPatch<User>(API_ROUTES.user(id), data);

export const deleteUser = (id: string) =>
  apiDelete<{ ok: boolean }>(API_ROUTES.user(id));

export const changePassword = (id: string, currentPassword: string, newPassword: string) =>
  apiPatch<{ ok: boolean }>(API_ROUTES.userPassword(id), { currentPassword, newPassword });
