'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Bell, Tag, ShoppingBag } from 'lucide-react';
import { useAppSelector } from '@/lib/hooks/redux';

export const NotificationSimulator = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const cartCount = useAppSelector((s) => s.cart.items.length);

  // Promo — fires 30s after load for non-authenticated users
  useEffect(() => {
    const t1 = setTimeout(() => {
      toast(t('notifications.promo.title', 'Exclusive Offer'), {
        description: t('notifications.promo.desc', '10% off all sets — use code OLEA10 at checkout.'),
        icon: <Tag className="text-primary" size={16} />,
        duration: 8000,
        action: { label: 'Shop', onClick: () => { window.location.href = '/shop'; } },
        className: '!bg-bg-card !text-text-main !border-border-subtle font-sans',
      });
    }, 30_000);
    return () => clearTimeout(t1);
  }, [t]);

  // Order update — fires 45s after load for authenticated users
  useEffect(() => {
    if (!isAuthenticated) return;
    const t2 = setTimeout(() => {
      toast(t('notifications.order.title', 'Order Update'), {
        description: t('notifications.order.desc', 'Your recent order has been dispatched.'),
        icon: <ShoppingBag className="text-primary" size={16} />,
        duration: 6000,
        action: { label: 'Track', onClick: () => { window.location.href = '/profile'; } },
        className: '!bg-bg-card !text-text-main !border-border-subtle font-sans',
      });
    }, 45_000);
    return () => clearTimeout(t2);
  }, [isAuthenticated, t]);

  // Cart abandonment — 2 min after load when cart is non-empty and user is auth
  useEffect(() => {
    if (!isAuthenticated || cartCount === 0) return;
    const t3 = setTimeout(() => {
      toast('Items in your cart', {
        description: 'Complete your order before they sell out.',
        icon: <Bell className="text-primary" size={16} />,
        duration: 7000,
        action: { label: 'Checkout', onClick: () => { window.location.href = '/checkout'; } },
        className: '!bg-bg-card !text-text-main !border-border-subtle font-sans',
      });
    }, 120_000);
    return () => clearTimeout(t3);
  }, [isAuthenticated, cartCount]);

  return null;
};
