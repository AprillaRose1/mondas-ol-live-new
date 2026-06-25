'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { addItem } from '@/store/slices/cartSlice';
import { fetchProducts } from '@/lib/api/products';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/lib/types';
import { ShoppingBag, Heart, Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, scaleIn } from '@/lib/animations';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export default function Wishlist() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const itemIds = useAppSelector((s) => s.wishlist.itemIds);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    // Fetch enough products to cover wishlist IDs
    if (itemIds.length === 0) { setLoading(false); return; }
    fetchProducts({ limit: 100 })
      .then((r) => setAllProducts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [itemIds.length]);

  const wishlistItems = allProducts.filter((p) => itemIds.includes(p.id));
  const visibleItems = wishlistItems.slice(0, visibleCount);
  const hasMore = wishlistItems.length > visibleCount;

  if (!loading && itemIds.length === 0) {
    return (
      <motion.div initial="hidden" animate="visible" variants={staggerContainer}
        className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 px-6"
      >
        <motion.div variants={scaleIn} className="w-24 h-24 bg-bg-card rounded-full flex items-center justify-center border border-border-subtle">
          <Heart size={40} className="text-border-subtle" />
        </motion.div>
        <div className="text-center space-y-2">
          <motion.h2 variants={fadeInUp} className="text-3xl font-bold tracking-tighter uppercase">{t('wishlist.empty')}</motion.h2>
          <motion.p variants={fadeInUp} className="text-text-muted max-w-xs mx-auto text-sm">{t('wishlist.empty_desc')}</motion.p>
        </div>
        <motion.div variants={fadeInUp}>
          <Link href="/shop" className="btn-mondas">{t('wishlist.find_favorites', 'Find Favorites')}</Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-24 px-6 lg:px-12 bg-bg-page">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">
            {t('nav.wishlist')} <span className="text-primary text-2xl">({itemIds.length})</span>
          </h1>
          {wishlistItems.length > 0 && (
            <button
              onClick={() => {
                wishlistItems.forEach((p) => dispatch(addItem(p)));
                toast.success('All items added to cart!');
              }}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              <ShoppingBag size={14} /> Add All to Cart
            </button>
          )}
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[...Array(itemIds.length || 4)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : (
          <>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
            >
              {visibleItems.map((p) => (
                <motion.div key={p.id} variants={fadeInUp} className="relative group">
                  <button
                    onClick={() => { dispatch(toggleWishlist(p.id)); toast.info('Removed from wishlist'); }}
                    className="absolute top-3 right-3 z-10 p-2 bg-bg-card/90 rounded-full text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                    title="Remove from wishlist"
                  >
                    <Heart size={16} fill="currentColor" />
                  </button>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>

            {hasMore && (
              <div className="mt-16 flex justify-center">
                <button
                  onClick={() => setVisibleCount((c) => c + 8)}
                  className="flex items-center gap-2 px-8 py-4 border border-border-subtle text-[10px] font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all"
                >
                  <Plus size={14} /> {t('shop.load_more', 'Load more')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
