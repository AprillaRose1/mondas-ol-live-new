'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Receipt } from 'lucide-react';
import { AppImage } from '@/components/ui/app-image';
import type { CartItem } from '@/lib/types';
import type { Language } from '@/lib/types';

type OrderSummaryProps = {
  items: CartItem[];
  lang: Language;
  subtotal: number;
  shipping: number;
};

export function OrderSummary({ items, lang, subtotal, shipping }: OrderSummaryProps) {
  const { t } = useTranslation();
  const total = subtotal + shipping;

  return (
    <div className="card-premium space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <h2 className="section-title text-lg">{t('cart.summary')}</h2>
        <Link href="/cart" className="link-caps text-[10px]">
          {t('cart.summary')}
        </Link>
      </div>

      <ul className="max-h-[280px] space-y-4 overflow-y-auto pr-1">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden border border-border-subtle bg-bg-page">
              <AppImage src={item.images[0]} alt={item.name[lang]} sizes="64px" showSpinner={false} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <p className="truncate font-sans text-[11px] font-semibold uppercase tracking-wide text-text-main">
                {item.name[lang]}
              </p>
              <p className="label-caps mt-1">
                {item.quantity}× {item.price.toLocaleString(undefined, { style: 'currency', currency: 'EUR' })}
              </p>
            </div>
            <p className="self-center font-sans text-xs font-semibold text-text-main">
              {(item.price * item.quantity).toLocaleString(undefined, { style: 'currency', currency: 'EUR' })}
            </p>
          </li>
        ))}
      </ul>

      <div className="space-y-3 border-t border-border-subtle pt-4">
        <div className="flex justify-between">
          <span className="label-caps">{t('cart.subtotal')}</span>
          <span className="text-sm text-text-main">
            {subtotal.toLocaleString(undefined, { style: 'currency', currency: 'EUR' })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="label-caps">{t('cart.shipping')}</span>
          <span className="text-sm text-text-main">
            {shipping === 0
              ? t('cart.free')
              : shipping.toLocaleString(undefined, { style: 'currency', currency: 'EUR' })}
          </span>
        </div>
        <div className="flex justify-between border-t border-border-subtle pt-3">
          <span className="label-caps text-text-main">{t('cart.total')}</span>
          <span className="font-serif text-2xl text-primary">
            {total.toLocaleString(undefined, { style: 'currency', currency: 'EUR' })}
          </span>
        </div>
      </div>

      <p className="text-center text-[10px] italic text-text-muted">{t('cart.tax_notice')}</p>

      <div className="flex items-start gap-3 border-t border-border-subtle pt-4">
        <Receipt size={18} className="mt-0.5 shrink-0 text-primary" strokeWidth={1.5} />
        <div>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-text-main">
            {t('checkout.invoice_title')}
          </p>
          <p className="body-lg mt-1 text-xs">{t('checkout.invoice_desc')}</p>
        </div>
      </div>
    </div>
  );
}
