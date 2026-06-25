'use client';

import { useTranslation } from 'react-i18next';
import { Truck } from 'lucide-react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FormLabel } from '@/components/ui/typography';
import type { CheckoutFormData } from '@/lib/schemas';

type ShippingStepProps = {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
};

const inputClass =
  'w-full bg-bg-card border border-border-subtle px-4 py-3 text-sm text-text-main focus:ring-1 focus:ring-primary h-[50px] rounded-sm';

export function ShippingStep({ register, errors }: ShippingStepProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <h3 className="section-title flex items-center gap-3 text-xl">
        <Truck size={20} className="text-primary" strokeWidth={1.5} />
        {t('checkout.address_title')}
      </h3>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <FormLabel>{t('checkout.first_name')}</FormLabel>
          <input {...register('firstName')} className={inputClass} autoComplete="given-name" />
          {errors.firstName && (
            <p className="mt-1 text-[10px] font-semibold uppercase text-red-500">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <FormLabel>{t('profile.last_name', 'Last Name')}</FormLabel>
          <input {...register('lastName')} className={inputClass} autoComplete="family-name" />
          {errors.lastName && (
            <p className="mt-1 text-[10px] font-semibold uppercase text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <FormLabel>{t('auth.email')}</FormLabel>
          <input {...register('email')} type="email" className={inputClass} autoComplete="email" />
          {errors.email && (
            <p className="mt-1 text-[10px] font-semibold uppercase text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div>
          <FormLabel>{t('checkout.phone')}</FormLabel>
          <input {...register('phone')} type="tel" className={inputClass} autoComplete="tel" />
          {errors.phone && (
            <p className="mt-1 text-[10px] font-semibold uppercase text-red-500">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div>
        <FormLabel>{t('profile.addresses')}</FormLabel>
        <input {...register('address')} className={inputClass} autoComplete="street-address" />
        {errors.address && (
          <p className="mt-1 text-[10px] font-semibold uppercase text-red-500">{errors.address.message}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <FormLabel>{t('checkout.city')}</FormLabel>
          <input {...register('city')} className={inputClass} autoComplete="address-level2" />
          {errors.city && (
            <p className="mt-1 text-[10px] font-semibold uppercase text-red-500">{errors.city.message}</p>
          )}
        </div>
        <div>
          <FormLabel>{t('checkout.zip')}</FormLabel>
          <input {...register('zip')} className={inputClass} autoComplete="postal-code" />
          {errors.zip && (
            <p className="mt-1 text-[10px] font-semibold uppercase text-red-500">{errors.zip.message}</p>
          )}
        </div>
        <div>
          <FormLabel>{t('checkout.country')}</FormLabel>
          <input {...register('country')} className={inputClass} autoComplete="country-name" />
          {errors.country && (
            <p className="mt-1 text-[10px] font-semibold uppercase text-red-500">{errors.country.message}</p>
          )}
        </div>
      </div>

      <p className="body-lg text-sm">{t('checkout.shipping_note')}</p>
    </div>
  );
}
