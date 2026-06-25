'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ShoppingBasket } from 'lucide-react';
import { PageHeader } from '@/components/ui/typography';

export function CheckoutEmpty() {
  const { t } = useTranslation();

  return (
    <div className="container-premium flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="mb-8 flex size-24 items-center justify-center rounded-full border border-border-subtle bg-bg-card">
        <ShoppingBasket size={40} className="text-text-muted" strokeWidth={1.25} />
      </div>
      <PageHeader
        title={t('checkout.empty_title')}
        subtitle={t('checkout.empty_desc')}
        align="center"
        className="mb-10"
      />
      <Link href="/shop" className="btn-mondas">
        {t('checkout.continue_shopping')}
      </Link>
    </div>
  );
}
