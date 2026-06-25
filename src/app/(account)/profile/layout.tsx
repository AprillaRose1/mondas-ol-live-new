import { AuthGuard } from '@/lib/guards/AuthGuard';
import { AccountShell } from '@/components/layouts/account-shell';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AccountShell>{children}</AccountShell>
    </AuthGuard>
  );
}
