import { apiGet, apiPost } from '@/lib/api/http';
import { API_ROUTES } from '@/lib/api/routes';
import type { SessionUser } from '@/lib/auth/types';

export const fetchSession = () =>
  apiGet<{ user: SessionUser | null }>(API_ROUTES.auth.session);

export const login = (payload: { email: string; password: string }) =>
  apiPost<{ user: SessionUser }>(API_ROUTES.auth.login, payload);

export const register = (payload: { email: string; password: string; name: string }) =>
  apiPost<{ user: SessionUser }>(API_ROUTES.auth.register, payload);

export const logout = () =>
  apiPost<{ ok: boolean }>(API_ROUTES.auth.logout, {});
