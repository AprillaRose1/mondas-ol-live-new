import { NextResponse } from 'next/server';
import { isPaypalConfigured, paypalCaptureOrder } from '@/lib/server/paypal';

export async function POST(req: Request) {
  if (!isPaypalConfigured()) {
    return NextResponse.json({ error: 'PayPal unavailable' }, { status: 503 });
  }
  try {
    const body = (await req.json()) as { orderId?: string };
    if (!body.orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    const result = await paypalCaptureOrder(body.orderId);
    return NextResponse.json({ id: result.id, status: result.status });
  } catch (e) {
    console.error('[paypal] capture failed', e);
    return NextResponse.json({ error: 'Capture failed' }, { status: 400 });
  }
}
