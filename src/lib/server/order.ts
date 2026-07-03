import { MOCK_PRODUCTS } from '@/data/products';

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface OrderLine {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  lineTotal: number;
}

const SHIPPING_FLAT = 0;

export function buildOrder(items: OrderItemInput[]) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Empty order');
  }
  const lines: OrderLine[] = items.map((it) => {
    const p = MOCK_PRODUCTS.find((x) => x.id === it.productId);
    if (!p) throw new Error(`Unknown product ${it.productId}`);
    const quantity = Math.max(1, Math.floor(Number(it.quantity) || 1));
    return { productId: p.id, name: p.name.en, quantity, price: p.price, lineTotal: p.price * quantity };
  });
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const shipping = SHIPPING_FLAT;
  return { lines, subtotal, shipping, total: subtotal + shipping };
}
