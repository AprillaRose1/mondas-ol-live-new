'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { useProducts } from '@/lib/hooks/useProducts';
import { fadeInUp, staggerContainer, scrollViewport } from '@/lib/animations';

export function HomeProducts() {
  const { t } = useTranslation();
  const { products, loading } = useProducts();
  const featured = products.filter((p) => p.isFeatured);

  return (
    <section className="section-y-lg bg-bg-card">
      <div className="container-premium">
        <motion.div variants={fadeInUp} className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row" initial="hidden" whileInView="visible" viewport={scrollViewport}>
          <div>
            <p className="eyebrow">{t('shop.badge')}</p>
            <h2 className="section-title">{t('shop.title')}</h2>
          </div>
          <Link href="/shop" className="btn-mondas-outline">
            {t('cart.continue_shopping')}
          </Link>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3" initial="hidden" whileInView="visible" viewport={scrollViewport}>
          {loading
            ? [...Array(3)].map((_, i) => <ProductCardSkeleton key={i} />)
            : featured.map((product) => (
                <motion.div key={product.id} variants={fadeInUp}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
        </motion.div>
      </div>
    </section>
  );
}
