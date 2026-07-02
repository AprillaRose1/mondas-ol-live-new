import type { SessionUser } from '@/lib/auth/types';
import { mockDelay } from '@/lib/api/_mock';

// Standalone demo identity. Session starts logged-out; login/register resolve
// this user so the auth flows work without a backend.
const DEMO_USER: SessionUser = {
  id: 'demo-user',
  email: 'demo@mondas.local',
  name: 'Demo Admin',
  role: 'admin' as SessionUser['role'],
};

export const fetchSession = (): Promise<{ user: SessionUser | null }> =>
  mockDelay({ user: null });

export const login = (payload: {
  email: string;
  password: string;
}): Promise<{ user: SessionUser }> =>
  mockDelay({ user: { ...DEMO_USER, email: payload.email } });

export const register = (payload: {
  email: string;
  password: string;
  name: string;
}): Promise<{ user: SessionUser }> =>
  mockDelay({ user: { ...DEMO_USER, email: payload.email, name: payload.name } });

export const logout = (): Promise<{ ok: boolean }> => mockDelay({ ok: true });
