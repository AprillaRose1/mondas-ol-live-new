import { loadStripe, type Stripe } from '@stripe/stripe-js';

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';

/** Whether Stripe Elements payment is configured (publishable key present). */
export const isStripeEnabled = Boolean(PUBLISHABLE_KEY);

let stripePromise: Promise<Stripe | null> | null = null;

/** Lazily load the Stripe.js singleton. Returns null if not configured. */
export const getStripe = (): Promise<Stripe | null> => {
  if (!PUBLISHABLE_KEY) return Promise.resolve(null);
  stripePromise ??= loadStripe(PUBLISHABLE_KEY);
  return stripePromise;
};
