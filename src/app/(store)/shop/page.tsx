import type { Metadata } from 'next';
import { MOCK_PRODUCTS } from '@/data/products';
import { ShopClient } from './shop-client';

export const metadata: Metadata = {
  title: 'Shop — Mondas',
  description: 'Browse Mondas premium olive oils and infusions from Dougga, Tunisia.',
};

export default function ShopPage() {
  const initialProducts = MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, 12);
  return <ShopClient initialProducts={initialProducts} />;
}
