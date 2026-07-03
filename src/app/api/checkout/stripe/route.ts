import { NextResponse } from 'next/server';
import { getStripeServer, isStripeServerConfigured } from '@/lib/server/stripe';
import { buildOrder } from '@/lib/server/order';

export async function POST(req: Request) {
  if (!isStripeServerConfigured()) {
    return NextResponse.json({ error: 'Payments unavailable' }, { status: 503 });
  }
  try {
    const body = (await req.json()) as { items?: { productId: string; quantity: number }[] };
    const { total } = buildOrder(body.items ?? []);
    if (total <= 0) return NextResponse.json({ error: 'Empty order' }, { status: 400 });
    const stripe = getStripeServer();
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
    });
    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (e) {
    console.error('[stripe] intent failed', e);
    return NextResponse.json({ error: 'Failed to init payment' }, { status: 400 });
  }
}
