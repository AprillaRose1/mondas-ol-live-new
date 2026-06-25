'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks/redux';
import { ROUTES } from '@/lib/auth/constants';
import { UserRole } from '@/lib/types/user';
import { PageLoader } from '@/components/common/Loaders';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace(`${ROUTES.auth}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (user && !allowedRoles.includes(user.role)) {
      router.replace(ROUTES.home);
    }
  }, [isAuthenticated, user, allowedRoles, router, loading, pathname]);

  if (loading || !isAuthenticated) {
    return <PageLoader />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
