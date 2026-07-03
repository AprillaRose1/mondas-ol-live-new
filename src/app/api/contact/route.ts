import { NextResponse } from 'next/server';
import { getTransporter, isMailConfigured } from '@/lib/mail';
import { contactFormSchema } from '@/lib/schemas';

export async function POST(req: Request) {
  try {
    const parsed = contactFormSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const to = process.env.ORDER_EMAIL_TO;
    const from = process.env.ORDER_EMAIL_FROM ?? process.env.SMTP_USER;
    if (!isMailConfigured() || !to) {
      console.error('[contact] mail not configured');
      return NextResponse.json({ error: 'Mail unavailable' }, { status: 503 });
    }
    const { name, email, subject, message } = parsed.data;
    await getTransporter().sendMail({
      from,
      to,
      replyTo: email,
      subject: `Contact form — ${subject}`,
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[contact] send failed', e);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
