import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_ROLES, ROUTES } from '@/lib/auth/constants';
import { getSessionFromRequest } from '@/lib/auth/session';
import { UserRole } from '@/lib/types/user';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = getSessionFromRequest(request);

  // ── Admin routes ─────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (!session) {
      const url = new URL(ROUTES.auth, request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    if (!ADMIN_ROLES.includes(session.role as (typeof ADMIN_ROLES)[number])) {
      return NextResponse.redirect(new URL(ROUTES.home, request.url));
    }
  }

  // ── Protected account routes ──────────────────────────────────────────────
  if (pathname.startsWith('/profile') && !session) {
    const url = new URL(ROUTES.auth, request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // ── Already logged in → skip auth page ───────────────────────────────────
  if (pathname === ROUTES.auth && session) {
    const redirect = request.nextUrl.searchParams.get('redirect');
    const fallback =
      session.role === UserRole.ADMIN || session.role === UserRole.MODERATOR
        ? ROUTES.adminDashboard
        : ROUTES.shop;
    return NextResponse.redirect(new URL(redirect ?? fallback, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/auth'],
};
