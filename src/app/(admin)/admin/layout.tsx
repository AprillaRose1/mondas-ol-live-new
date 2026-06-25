import { Toaster } from 'sonner';
import { RoleGuard } from '@/lib/guards/RoleGuard';
import { AdminShell } from '@/components/layouts/admin-shell';
import { UserRole } from '@/lib/types/user';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR]}>
      <Toaster position="top-right" richColors closeButton />
      <AdminShell>{children}</AdminShell>
    </RoleGuard>
  );
}
