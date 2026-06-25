/**
 * WhatsApp click-to-chat. Set NEXT_PUBLIC_WHATSAPP_NUMBER in .env (digits only, with country code).
 * Example Tunisia: 21620123456
 */
export function getWhatsAppNumber(): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';
  const digits = raw.replace(/\D/g, '');
  return digits || '21600000000';
}

export function buildWhatsAppUrl(message?: string): string {
  const number = getWhatsAppNumber();
  const base = `https://wa.me/${number}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}
