import type { NextRequest } from 'next/server';
import type { SessionUser } from '@/lib/auth/types';
import { UserRole } from '@/lib/types/user';

/**
 * Decodes the JWT cookie in Next.js middleware (no signature verification —
 * used for routing decisions only). The backend always verifies on API calls.
 */
export function getSessionFromRequest(request: NextRequest): SessionUser | null {
  const token = request.cookies.get('mondas_session')?.value;
  if (!token) return null;
  try {
    // JWT is three base64url segments: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf8'),
    ) as { sub?: string; email?: string; name?: string; role?: string; exp?: number };

    // Check expiry
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;

    if (!payload.sub || !payload.email || !payload.role) return null;

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name ?? payload.email,
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}
