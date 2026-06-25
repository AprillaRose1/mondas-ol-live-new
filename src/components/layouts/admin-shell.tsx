'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BarChart3, LayoutDashboard, MessageSquare, Package,
  ShoppingBag, Users, LogOut, Store, Ticket, Star, Image,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Logo } from '@/components/common/Logo';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { logout as logoutAction } from '@/store/slices/authSlice';
import { logout as logoutApi } from '@/lib/api/auth';

const NAV = [
  { href: '/admin/dashboard',   label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/admin/products',    label: 'Products',     icon: Package },
  { href: '/admin/orders',      label: 'Orders',       icon: ShoppingBag },
  { href: '/admin/users',       label: 'Users',        icon: Users },
  { href: '/admin/reviews',     label: 'Reviews',      icon: Star },
  { href: '/admin/testimonials',label: 'Testimonials', icon: MessageSquare },
  { href: '/admin/gallery',     label: 'Gallery',      icon: Image },
  { href: '/admin/discounts',   label: 'Discounts',    icon: Ticket },
  { href: '/admin/audit-logs',  label: 'Audit Log',    icon: BarChart3 },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);

  const handleLogout = async () => {
    try { await logoutApi(); } catch {}
    dispatch(logoutAction());
    toast.success('Logged out');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-bg-page text-text-main">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-shrink-0 border-r border-border-subtle bg-bg-nav lg:flex lg:flex-col">
          <div className="border-b border-border-subtle p-6">
            <Logo />
            <p className="mt-1 text-[10px] uppercase tracking-widest text-text-muted">Admin Panel</p>
          </div>

          <nav className="flex flex-1 flex-col gap-1 p-4">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link key={href} href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active ? 'bg-primary text-primary-foreground' : 'text-text-muted hover:bg-bg-card hover:text-text-main',
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border-subtle p-4 space-y-2">
            {/* Current user */}
            {user && (
              <div className="flex items-center gap-3 px-3 py-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold uppercase shrink-0">
                  {user.name?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{user.name}</p>
                  <p className="text-[10px] text-text-muted uppercase tracking-widest">{user.role}</p>
                </div>
              </div>
            )}
            <Link href="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted hover:text-primary hover:bg-bg-card transition-colors">
              <Store size={16} />Back to store
            </Link>
            <button onClick={handleLogout}
              className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted hover:text-rose-500 hover:bg-rose-500/5 transition-colors"
            >
              <LogOut size={16} />Log out
            </button>
          </div>
        </aside>

        <motion.div className="flex flex-1 flex-col" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.header variants={fadeInUp} className="border-b border-border-subtle bg-bg-card px-6 py-4 lg:hidden flex items-center justify-between">
            <Logo />
            <button onClick={handleLogout} className="p-2 text-text-muted hover:text-rose-500 transition-colors">
              <LogOut size={18} />
            </button>
          </motion.header>
          <motion.main variants={fadeInUp} className="flex-1 p-6 lg:p-10">
            {children}
          </motion.main>
        </motion.div>
      </div>
    </div>
  );
}
