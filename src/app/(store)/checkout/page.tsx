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
import { checkoutFormSchema, type CheckoutFormData } from '@/lib/schemas';
import { submitCheckout, createPaymentIntent, type CheckoutPayload } from '@/lib/api/checkout';
import { isStripeEnabled } from '@/lib/stripe';
import { StripePayment } from '@/components/checkout/stripe-payment';
import { fadeInUp, staggerContainer, scrollViewport } from '@/lib/animations';
import { PageHeader } from '@/components/ui/typography';
import { MondasButton } from '@/components/ui/mondas-button';
import { CheckoutEmpty } from '@/components/checkout/checkout-empty';
import { CheckoutSteps } from '@/components/checkout/checkout-steps';
import { ShippingStep } from '@/components/checkout/shipping-step';
import { PaymentStep } from '@/components/checkout/payment-step';
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
] as const satisfies readonly (keyof CheckoutFormData)[];

const PAYMENT_FIELDS = ['paymentMethod', 'cardName', 'cardNumber', 'expiry', 'cvc'] as const satisfies readonly (keyof CheckoutFormData)[];

const FREE_SHIPPING_THRESHOLD = 0;

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language.slice(0, 2) || 'en') as Language;
  const dispatch = useAppDispatch();
  const { items, appliedCoupon } = useAppSelector((state) => state.cart);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 8;

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      country: 'Tunisia',
      paymentMethod: 'card',
    },
  });

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

  const placeOrder = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      const result = await submitCheckout({
        ...data,
        shipping: { firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone, address: data.address, city: data.city, zip: data.zip, country: data.country },
      items: items.map((item) => ({ productId: item.id, productName: item.name.en || item.name.de, quantity: item.quantity, price: item.price })),
      subtotal,
      shippingCost: shipping,
      couponCode: appliedCoupon?.code,
      });

      if (result.clientSecret) {
        // TODO: Stripe â€” stripe.confirmCardPayment(result.clientSecret, { payment_method: { card: elements } })
        toast.message(t('checkout.payment_pending'));
      }

      setOrderId(result.orderId);
      toast.success(t('checkout.success'));
      dispatch(clearCart());
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      toast.error(t('checkout.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const buildPayload = (data: CheckoutFormData): CheckoutPayload => ({
    shipping: { firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone, address: data.address, city: data.city, zip: data.zip, country: data.country },
    items: items.map((item) => ({ productId: item.id, productName: item.name.en || item.name.de, quantity: item.quantity, price: item.price })),
    subtotal,
    shippingCost: shipping,
    couponCode: appliedCoupon?.code,
  });

  // Stripe Elements path: create a PaymentIntent, then render the card element
  const initStripePayment = async () => {
    setIsSubmitting(true);
    try {
      const res = await createPaymentIntent(buildPayload(getValues()));
      if (!res.clientSecret) { toast.error(t('checkout.error')); return; }
      setOrderId(res.orderId);
      setClientSecret(res.clientSecret);
    } catch {
      toast.error(t('checkout.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalizeStripePayment = () => {
    toast.success(t('checkout.success'));
    dispatch(clearCart());
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = handleSubmit(async (data) => {
    const valid = await trigger([...PAYMENT_FIELDS]);
    if (!valid) return;
    await placeOrder(data);
  });

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
          <form onSubmit={onSubmit} className="space-y-10 lg:col-span-3">
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
                  {isStripeEnabled ? (
                    clientSecret ? (
                      <StripePayment clientSecret={clientSecret} onSuccess={finalizeStripePayment} />
                    ) : (
                      <div className="space-y-4 border border-border-subtle p-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest">{t('checkout.payment', 'Payment')}</h3>
                        <p className="text-sm text-text-muted">{t('checkout.stripe_intro', 'Click below to enter your card details securely via Stripe.')}</p>
                      </div>
                    )
                  ) : (
                    <PaymentStep register={register} errors={errors} />
                  )}
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
              ) : isStripeEnabled ? (
                // Stripe path: show "continue to payment" until the card element is mounted; then its own Pay button takes over
                !clientSecret && (
                  <MondasButton
                    type="button"
                    loading={isSubmitting}
                    onClick={() => void initStripePayment()}
                    className="gap-2 px-8 py-3 shadow-lg shadow-primary/10"
                  >
                    {t('checkout.buttons.continue_payment', 'Continue to payment')} <ArrowRight size={18} />
                  </MondasButton>
                )
              ) : (
                <MondasButton
                  type="submit"
                  loading={isSubmitting}
                  className="gap-2 px-8 py-3 shadow-lg shadow-primary/10"
                >
                  {t('checkout.buttons.confirm')} <ArrowRight size={18} />
                </MondasButton>
              )}
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

