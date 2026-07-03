import Stripe from 'stripe';

let client: Stripe | null = null;

export const isStripeServerConfigured = (): boolean => Boolean(process.env.STRIPE_SECRET_KEY);

export function getStripeServer(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY missing');
  client ??= new Stripe(key);
  return client;
}
