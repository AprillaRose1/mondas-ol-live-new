import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOCK_PRODUCTS } from '@/data/products';
import { ProductDetailClient } from './product-detail-client';

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = MOCK_PRODUCTS.find((x) => x.id === id);
  if (!p) return { title: 'Product not found' };
  const description = p.description.en.slice(0, 160);
  return {
    title: `${p.name.en} — Mondas`,
    description,
    openGraph: {
      title: p.name.en,
      description,
      images: p.images?.[0] ? [{ url: p.images[0] }] : undefined,
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  if (!product) notFound();
  const related = MOCK_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  return <ProductDetailClient product={product} related={related} />;
}
