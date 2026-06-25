'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fadeInUp } from '@/lib/animations';

const NAV = [
  { href: '/profile', label: 'Overview', icon: User },
  { href: '/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/cart', label: 'Cart', icon: ShoppingBag },
] as const;

export function AccountShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      className="mx-auto max-w-6xl px-6 py-12"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <nav className="mb-10 flex flex-wrap gap-2 border-b border-border-subtle pb-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-bg-card text-text-muted hover:text-text-main',
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
      {children}
    </motion.div>
  );
}
