export function buildWhatsAppUrl(orderText: string, phone?: string) {
  const target = (phone || process.env.NEXT_PUBLIC_WHATSAPP || '').replace(/[^0-9]/g, '');
  const base = target ? `https://wa.me/${target}` : `https://wa.me/`;
  const url = new URL(base);
  url.searchParams.set('text', orderText);
  return url.toString();
}
