'use client';

import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

type CheckoutStepsProps = {
  step: 1 | 2 | 3;
};

export function CheckoutSteps({ step }: CheckoutStepsProps) {
  const { t } = useTranslation();
  const steps = [
    { n: 1 as const, label: t('checkout.steps.shipping') },
    { n: 2 as const, label: t('checkout.steps.payment') },
    { n: 3 as const, label: t('checkout.steps.confirmation') },
  ];

  return (
    <ol className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
      {steps.map(({ n, label }, i) => (
        <li key={n} className="flex items-center gap-3 md:gap-4">
          <span
            className={cn(
              'label-caps transition-colors',
              step >= n ? 'text-primary' : 'text-text-subtle',
            )}
          >
            <span className="mr-2 inline-flex size-6 items-center justify-center border border-current font-sans text-[10px]">
              {n}
            </span>
            {label}
          </span>
          {i < steps.length - 1 && <span className="hidden h-px w-8 bg-border-subtle sm:block" aria-hidden />}
        </li>
      ))}
    </ol>
  );
}
