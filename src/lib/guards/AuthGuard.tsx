'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks/redux';
import { ROUTES } from '@/lib/auth/constants';
import { PageLoader } from '@/components/common/Loaders';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`${ROUTES.auth}?redirect=/profile`);
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return <PageLoader />;
  }

  return <>{children}</>;
}
