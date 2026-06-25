'use client';

import { useTranslation } from 'react-i18next';
import { CreditCard, CheckCircle, ShieldCheck } from 'lucide-react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FormLabel } from '@/components/ui/typography';
import type { CheckoutFormData } from '@/lib/schemas';

type PaymentStepProps = {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
};

const inputClass =
  'w-full bg-bg-card border border-border-subtle px-4 py-3 text-sm text-text-main focus:ring-1 focus:ring-primary h-[50px] rounded-sm';

export function PaymentStep({ register, errors }: PaymentStepProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <h3 className="section-title flex items-center gap-3 text-xl">
          <CreditCard size={20} className="text-primary" strokeWidth={1.5} />
          {t('checkout.payment_title')}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div
            className="relative flex cursor-default items-center gap-4 border-2 border-primary bg-primary/5 p-5"
            aria-current="true"
          >
            <CreditCard className="text-primary" size={22} strokeWidth={1.5} />
            <div className="flex-grow">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-text-main">
                {t('checkout.payment_options.card')}
              </p>
              <p className="body-lg mt-1 text-[10px]">Visa, Mastercard, AMEX</p>
            </div>
            <CheckCircle size={16} className="text-primary" />
          </div>
          <div className="relative flex items-center gap-4 border border-border-subtle p-5 opacity-40 grayscale">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-text-muted">
              {t('checkout.payment_options.paypal')}
            </p>
            <span className="label-caps ml-auto">{t('checkout.coming_soon')}</span>
          </div>
        </div>
      </div>

      <div className="card-premium space-y-5 p-6 md:p-8">
        <p className="label-caps">{t('checkout.card_details')}</p>
        <div>
          <FormLabel>{t('checkout.card.holder')}</FormLabel>
          <input {...register('cardName')} className={inputClass} autoComplete="cc-name" />
          {errors.cardName && (
            <p className="mt-1 text-[10px] font-semibold uppercase text-red-500">{errors.cardName.message}</p>
          )}
        </div>
        <div>
          <FormLabel>{t('checkout.card.number')}</FormLabel>
          <input
            {...register('cardNumber')}
            className={inputClass}
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="0000 0000 0000 0000"
          />
          {errors.cardNumber && (
            <p className="mt-1 text-[10px] font-semibold uppercase text-red-500">{errors.cardNumber.message}</p>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <FormLabel>{t('checkout.card.expiry')}</FormLabel>
            <input {...register('expiry')} className={inputClass} placeholder="MM/YY" autoComplete="cc-exp" />
            {errors.expiry && (
              <p className="mt-1 text-[10px] font-semibold uppercase text-red-500">{errors.expiry.message}</p>
            )}
          </div>
          <div>
            <FormLabel>{t('checkout.card.cvc')}</FormLabel>
            <input
              {...register('cvc')}
              className={inputClass}
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="•••"
            />
            {errors.cvc && (
              <p className="mt-1 text-[10px] font-semibold uppercase text-red-500">{errors.cvc.message}</p>
            )}
          </div>
        </div>
        <p className="body-lg text-xs">{t('checkout.demo_notice')}</p>
      </div>

      <div className="card-premium space-y-3 p-6">
        <div className="flex items-center gap-2 text-primary">
          <ShieldCheck size={20} strokeWidth={1.5} />
          <span className="label-caps text-primary">{t('checkout.secure_connection')}</span>
        </div>
        <p className="body-lg text-xs">{t('checkout.gdpr_notice')}</p>
      </div>
    </div>
  );
}
