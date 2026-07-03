import { NextResponse } from 'next/server';
import { isPaypalConfigured, paypalCreateOrder } from '@/lib/server/paypal';
import { buildOrder } from '@/lib/server/order';

export async function POST(req: Request) {
  if (!isPaypalConfigured()) {
    return NextResponse.json({ error: 'PayPal unavailable' }, { status: 503 });
  }
  try {
    const body = (await req.json()) as { items?: { productId: string; quantity: number }[] };
    const { total } = buildOrder(body.items ?? []);
    if (total <= 0) return NextResponse.json({ error: 'Empty order' }, { status: 400 });
    const order = await paypalCreateOrder(total, 'EUR');
    return NextResponse.json({ id: order.id });
  } catch (e) {
    console.error('[paypal] create failed', e);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 400 });
  }
}
