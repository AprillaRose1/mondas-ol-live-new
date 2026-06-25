import { Suspense } from 'react';
import AuthPageClient from './auth-form';

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-lg bg-bg-card" />}>
      <AuthPageClient />
    </Suspense>
  );
}
