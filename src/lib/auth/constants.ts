export const SESSION_COOKIE = 'mondas_session';

export const ROUTES = {
  home: '/',
  shop: '/shop',
  auth: '/auth',
  profile: '/profile',
  adminDashboard: '/admin/dashboard',
} as const;

export const ADMIN_ROLES = ['admin', 'moderator'] as const;
