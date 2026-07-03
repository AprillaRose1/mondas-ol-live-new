'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { clearCart } from '@/store/slices/cartSlice';
import { shippingSchema, type ShippingFormData } from '@/lib/schemas';
import { isStripeEnabled } from '@/lib/stripe';
import { StripePayment } from '@/components/checkout/stripe-payment';
import { fadeInUp, staggerContainer, scrollViewport } from '@/lib/animations';
import { PageHeader } from '@/components/ui/typography';
import { MondasButton } from '@/components/ui/mondas-button';
import { CheckoutEmpty } from '@/components/checkout/checkout-empty';
import { CheckoutSteps } from '@/components/checkout/checkout-steps';
import { ShippingStep } from '@/components/checkout/shipping-step';
import { PaymentStep, type PaymentMethod } from '@/components/checkout/payment-step';
import { OrderSummary } from '@/components/checkout/order-summary';
import { CheckoutSuccess } from '@/components/checkout/checkout-success';
import type { Language } from '@/lib/types';

const SHIPPING_FIELDS = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'city',
  'zip',
  'country',
] as const satisfies readonly (keyof ShippingFormData)[];

const FREE_SHIPPING_THRESHOLD = 0;

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? null;

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? 'Request failed');
  }
  return res.json() as Promise<T>;
}

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language.slice(0, 2) || 'en') as Language;
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 8;

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      country: 'Tunisia',
    },
  });

  // Order line items for the server (server recomputes prices from local data).
  const orderItems = () => items.map((item) => ({ productId: item.id, quantity: item.quantity }));

  const goToPayment = async () => {
    setIsAdvancing(true);
    try {
      const valid = await trigger([...SHIPPING_FIELDS]);
      if (!valid) return;
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsAdvancing(false);
    }
  };

  // Best-effort order email — payment is already captured, so a mail failure
  // must never block the buyer's confirmation.
  const sendOrderEmail = async (provider: string, paymentRef: string) => {
    const v = getValues();
    try {
      await postJson('/api/orders/email', {
        items: orderItems(),
        shipping: {
          firstName: v.firstName, lastName: v.lastName, email: v.email, phone: v.phone,
          address: v.address, city: v.city, zip: v.zip, country: v.country,
        },
        paymentProvider: provider,
        paymentRef,
      });
    } catch (e) {
      console.error('order email failed (non-blocking)', e);
    }
  };

  const completeOrder = async (provider: string, paymentRef: string) => {
    await sendOrderEmail(provider, paymentRef);
    setOrderId(paymentRef);
    toast.success(t('checkout.success'));
    dispatch(clearCart());
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Stripe: create a PaymentIntent, then mount the card Elements.
  const initStripe = async () => {
    setIsSubmitting(true);
    try {
      const res = await postJson<{ clientSecret: string }>('/api/checkout/stripe', { items: orderItems() });
      setClientSecret(res.clientSecret);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('checkout.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onStripeSuccess = (paymentIntentId: string) => {
    void completeOrder('stripe', paymentIntentId);
  };

  // PayPal: create + capture on the server, then finalize.
  const paypalCreate = async () => {
    const res = await postJson<{ id: string }>('/api/checkout/paypal/create', { items: orderItems() });
    return res.id;
  };

  const paypalApprove = async (paypalOrderId: string) => {
    try {
      const res = await postJson<{ id: string; status: string }>('/api/checkout/paypal/capture', { orderId: paypalOrderId });
      if (res.status === 'COMPLETED') await completeOrder('paypal', res.id);
      else toast.error(t('checkout.error'));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('checkout.error'));
    }
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-bg-page pb-24">
        <CheckoutEmpty />
      </div>
    );
  }

  if (step === 3 && orderId) {
    return (
      <div className="container-premium min-h-screen bg-bg-page py-16 md:py-24">
        <CheckoutSuccess orderId={orderId} email={getValues('email') ?? ''} />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-bg-page pb-24">
      <div className="container-premium max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-12 space-y-8 md:mb-16"
        >
          <motion.div variants={fadeInUp}>
            <PageHeader title={t('checkout.title')} align="center" className="mb-0" />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <CheckoutSteps step={step} />
          </motion.div>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-10 lg:col-span-3">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <ShippingStep register={register} errors={errors} />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <PaymentStep
                    method={method}
                    onMethodChange={setMethod}
                    paypalClientId={PAYPAL_CLIENT_ID}
                    onPaypalCreate={paypalCreate}
                    onPaypalApprove={paypalApprove}
                    cardSlot={
                      isStripeEnabled ? (
                        clientSecret ? (
                          <StripePayment clientSecret={clientSecret} onSuccess={onStripeSuccess} />
                        ) : (
                          <p className="text-sm text-text-muted">
                            {t('checkout.stripe_intro', 'Continue to enter your card securely via Stripe.')}
                          </p>
                        )
                      ) : (
                        <p className="text-sm text-text-muted">
                          {t('checkout.stripe_unavailable', 'Card payment is not configured.')}
                        </p>
                      )
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-8">
              {step === 2 ? (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="link-caps text-text-muted hover:text-primary"
                >
                  {t('checkout.buttons.back_to_shipping')}
                </button>
              ) : (
                <Link href="/cart" className="link-caps text-text-muted hover:text-primary">
                  {t('checkout.buttons.back_to_cart')}
                </Link>
              )}
              {step === 1 ? (
                <MondasButton
                  type="button"
                  loading={isAdvancing}
                  onClick={() => void goToPayment()}
                  className="gap-2 px-8 py-3 shadow-lg shadow-primary/10"
                >
                  {t('checkout.buttons.next')} <ArrowRight size={18} />
                </MondasButton>
              ) : method === 'card' && isStripeEnabled && !clientSecret ? (
                // Card path: mount Stripe Elements. Once mounted, its own Pay button takes over.
                <MondasButton
                  type="button"
                  loading={isSubmitting}
                  onClick={() => void initStripe()}
                  className="gap-2 px-8 py-3 shadow-lg shadow-primary/10"
                >
                  {t('checkout.buttons.continue_payment', 'Continue to payment')} <ArrowRight size={18} />
                </MondasButton>
              ) : null}
            </div>
          </form>

          <motion.aside variants={fadeInUp} initial="hidden" whileInView="visible" viewport={scrollViewport}
            className="lg:col-span-2"
          >
            <div className="lg:sticky lg:top-28">
              <OrderSummary items={items} lang={lang} subtotal={subtotal} shipping={shipping} />
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
