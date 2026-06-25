'use client';

import React, { useState } from 'react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { MondasButton } from '@/components/ui/mondas-button';
import { getStripe } from '@/lib/stripe';

interface StripePaymentProps {
  clientSecret: string;
  onSuccess: () => void;
}

function PaymentInner({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setSubmitting(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });
      if (error) {
        toast.error(error.message ?? 'Payment failed');
        return;
      }
      if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing')) {
        onSuccess();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PaymentElement />
      <MondasButton type="button" loading={submitting} onClick={handlePay} className="w-full min-h-[50px]">
        Pay securely
      </MondasButton>
      <p className="text-center text-[10px] text-text-muted">Card details are sent directly to Stripe and never touch our servers.</p>
    </div>
  );
}

export function StripePayment({ clientSecret, onSuccess }: StripePaymentProps) {
  return (
    <Elements stripe={getStripe()} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
      <PaymentInner onSuccess={onSuccess} />
    </Elements>
  );
}
