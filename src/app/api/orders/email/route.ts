import { NextResponse } from 'next/server';
import { getTransporter, isMailConfigured } from '@/lib/mail';
import { buildOrder } from '@/lib/server/order';

interface Shipping {
  firstName?: string; lastName?: string; email?: string; phone?: string;
  address?: string; city?: string; zip?: string; country?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      items?: { productId: string; quantity: number }[];
      shipping?: Shipping;
      paymentProvider?: string;
      paymentRef?: string;
    };
    const { lines, subtotal, shipping, total } = buildOrder(body.items ?? []);
    const to = process.env.ORDER_EMAIL_TO;
    const from = process.env.ORDER_EMAIL_FROM ?? process.env.SMTP_USER;

    if (!isMailConfigured() || !to) {
      console.error('[orders/email] mail not configured — order NOT emailed', { total });
      return NextResponse.json({ ok: true, mailed: false });
    }

    const s = body.shipping ?? {};
    const rows = lines.map((l) => `${l.quantity}× ${l.name} — €${l.lineTotal.toFixed(2)}`).join('\n');
    const text =
      `NEW ORDER (${body.paymentProvider ?? 'unknown'})\n\n` +
      `${rows}\n\n` +
      `Subtotal: €${subtotal.toFixed(2)}\nShipping: €${shipping.toFixed(2)}\nTotal: €${total.toFixed(2)}\n\n` +
      `Ship to:\n${s.firstName ?? ''} ${s.lastName ?? ''}\n${s.address ?? ''}\n${s.city ?? ''} ${s.zip ?? ''}\n${s.country ?? ''}\n` +
      `${s.email ?? ''} / ${s.phone ?? ''}\n\n` +
      `Payment ref: ${body.paymentRef ?? '—'}`;
    const html =
      `<h2>New order (${body.paymentProvider ?? 'unknown'})</h2>` +
      `<ul>${lines.map((l) => `<li>${l.quantity}× ${l.name} — €${l.lineTotal.toFixed(2)}</li>`).join('')}</ul>` +
      `<p><b>Subtotal:</b> €${subtotal.toFixed(2)}<br/><b>Shipping:</b> €${shipping.toFixed(2)}<br/><b>Total:</b> €${total.toFixed(2)}</p>` +
      `<h3>Ship to</h3><p>${s.firstName ?? ''} ${s.lastName ?? ''}<br/>${s.address ?? ''}<br/>${s.city ?? ''} ${s.zip ?? ''}<br/>${s.country ?? ''}<br/>${s.email ?? ''} / ${s.phone ?? ''}</p>` +
      `<p><b>Payment ref:</b> ${body.paymentRef ?? '—'}</p>`;

    await getTransporter().sendMail({
      from,
      to,
      replyTo: s.email || undefined,
      subject: `New order — €${total.toFixed(2)} (${body.paymentProvider ?? 'unknown'})`,
      text,
      html,
    });
    return NextResponse.json({ ok: true, mailed: true });
  } catch (e) {
    console.error('[orders/email] send failed', e);
    return NextResponse.json({ ok: true, mailed: false });
  }
}
