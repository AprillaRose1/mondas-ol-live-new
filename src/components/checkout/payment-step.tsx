'use client';

import { useTranslation } from 'react-i18next';
import { CreditCard, CheckCircle, ShieldCheck } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { cn } from '@/lib/utils';

export type PaymentMethod = 'card' | 'paypal';

type PaymentStepProps = {
  method: PaymentMethod;
  onMethodChange: (m: PaymentMethod) => void;
  paypalClientId: string | null;
  onPaypalCreate: () => Promise<string>;
  onPaypalApprove: (orderId: string) => Promise<void>;
  /** Stripe Elements UI, rendered by the parent (card data never touches our form). */
  cardSlot: React.ReactNode;
};

export function PaymentStep({
  method,
  onMethodChange,
  paypalClientId,
  onPaypalCreate,
  onPaypalApprove,
  cardSlot,
}: PaymentStepProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <h3 className="section-title flex items-center gap-3 text-xl">
          <CreditCard size={20} className="text-primary" strokeWidth={1.5} />
          {t('checkout.payment_title')}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => onMethodChange('card')}
            className={cn(
              'relative flex items-center gap-4 border-2 p-5 text-left transition-colors',
              method === 'card' ? 'border-primary bg-primary/5' : 'border-border-subtle hover:border-primary/50',
            )}
          >
            <CreditCard className="text-primary" size={22} strokeWidth={1.5} />
            <div className="flex-grow">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-text-main">
                {t('checkout.payment_options.card')}
              </p>
              <p className="body-lg mt-1 text-[10px]">Visa, Mastercard, AMEX</p>
            </div>
            {method === 'card' && <CheckCircle size={16} className="text-primary" />}
          </button>
          <button
            type="button"
            onClick={() => onMethodChange('paypal')}
            className={cn(
              'relative flex items-center gap-4 border-2 p-5 text-left transition-colors',
              method === 'paypal' ? 'border-primary bg-primary/5' : 'border-border-subtle hover:border-primary/50',
            )}
          >
            <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-text-main">
              {t('checkout.payment_options.paypal')}
            </p>
            {method === 'paypal' && <CheckCircle size={16} className="ml-auto text-primary" />}
          </button>
        </div>
      </div>

      {method === 'card' && <div className="card-premium p-6 md:p-8">{cardSlot}</div>}

      {method === 'paypal' &&
        (paypalClientId ? (
          <PayPalScriptProvider options={{ clientId: paypalClientId, currency: 'EUR', intent: 'capture' }}>
            <PayPalButtons
              style={{ layout: 'vertical' }}
              createOrder={() => onPaypalCreate()}
              onApprove={(data) => onPaypalApprove(data.orderID)}
            />
          </PayPalScriptProvider>
        ) : (
          <p className="text-sm text-text-muted border border-border-subtle p-6">
            {t('checkout.paypal_unavailable', 'PayPal is not configured.')}
          </p>
        ))}

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
