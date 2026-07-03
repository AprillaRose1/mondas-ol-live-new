'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, ShieldCheck, Truck, RotateCcw, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { addItem } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import type { Language } from '@/lib/types';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/components/product/ProductCard';
import { MondasButton } from '@/components/ui/mondas-button';
import { fadeInUp, staggerContainer, fadeIn, scrollViewport } from '@/lib/animations';
import { AppImage } from '@/components/ui/app-image';
import { ProductReviews } from '@/components/product/ProductReviews';

export function ProductDetailClient({ product: prod, related }: { product: Product; related: Product[] }) {
  const dispatch = useAppDispatch();
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language.slice(0, 2) as Language;
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [isAdding, setIsAdding] = useState(false);
  const isInWishlist = useAppSelector((s) => s.wishlist.itemIds.includes(prod.id));
  const id = prod.id;
  const relatedProducts = related;

  const handleAddToCart = async () => {
    if (prod.stock < quantity) { toast.error('Not enough stock'); return; }
    setIsAdding(true);
    await new Promise((r) => setTimeout(r, 600));
    for (let i = 0; i < quantity; i++) dispatch(addItem(prod));
    toast.success(t('common.addedToCart'));
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen pt-6 pb-24 bg-bg-page text-text-main lg:pt-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Breadcrumbs */}
        <nav className="py-8 flex gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">
          <Link href="/" className="hover:text-primary">{t('nav.home')}</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-primary">{t('nav.shop')}</Link>
          <span>/</span>
          <span className="text-text-main">{prod.name[currentLang]}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Gallery */}
          <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-4">
            <div className="relative aspect-square overflow-hidden bg-bg-card group">
              <AnimatePresence mode="wait">
                <motion.div key={currentImage} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AppImage src={prod.images[currentImage]} alt={prod.name[currentLang]} objectFit="contain" sizes="(max-width: 1024px) 100vw, 50vw" priority={currentImage === 0} className="transition-transform duration-700 hover:scale-105" />
                </motion.div>
              </AnimatePresence>
              {prod.images.length > 1 && (
                <>
                  <button onClick={() => setCurrentImage((p) => (p - 1 + prod.images.length) % prod.images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-bg-card/80 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={() => setCurrentImage((p) => (p + 1) % prod.images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-bg-card/80 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {prod.images.map((img, idx) => (
                <button key={idx} onClick={() => setCurrentImage(idx)} className={cn('aspect-square overflow-hidden border-2 transition-all', currentImage === idx ? 'border-primary' : 'border-border-subtle opacity-50 hover:opacity-100')}>
                  <AppImage src={img} alt="" objectFit="contain" sizes="80px" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col">
            <motion.div variants={fadeInUp} className="space-y-2 mb-8">
              <span className="text-primary font-bold uppercase tracking-widest text-[10px] block">{t(`shop.categories.${prod.category}`, prod.category)}</span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">{prod.name[currentLang]}</h1>
              <div className="flex items-center gap-4">
                <div className="flex gap-1 text-primary">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < Math.floor(prod.rating) ? 'currentColor' : 'none'} />)}
                </div>
                <span className="text-xs text-text-muted">({prod.reviewsCount} {t('product.reviews_label')})</span>
              </div>
            </motion.div>

            <motion.p variants={fadeInUp} className="text-3xl font-bold text-primary mb-8">
              {prod.price.toLocaleString(undefined, { style: 'currency', currency: 'EUR' })}
            </motion.p>

            <motion.p variants={fadeInUp} className="text-text-muted leading-[1.8] mb-8 text-sm max-w-lg">
              {prod.description[currentLang]}
            </motion.p>

            {/* Stock indicator */}
            {prod.stock <= 5 && prod.stock > 0 && (
              <motion.p variants={fadeInUp} className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-6">
                Only {prod.stock} left in stock
              </motion.p>
            )}
            {prod.stock === 0 && (
              <motion.p variants={fadeInUp} className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mb-6">
                Out of stock
              </motion.p>
            )}

            <motion.div variants={fadeInUp} className="flex gap-4 mb-12">
              <div className="flex items-center border border-border-subtle bg-bg-card">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-bg-page transition-colors">-</button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(prod.stock, quantity + 1))} className="px-4 py-3 hover:bg-bg-page transition-colors">+</button>
              </div>
              <MondasButton type="button" loading={isAdding} onClick={handleAddToCart} disabled={prod.stock === 0} className="flex-grow gap-2 shadow-lg shadow-primary/10">
                {t('common.addToCart')}
              </MondasButton>
              <button onClick={() => dispatch(toggleWishlist(prod.id))} className={cn('px-4 border border-border-subtle transition-all bg-bg-card hover:border-primary', isInWishlist ? 'text-rose-500 bg-rose-50/10' : 'text-text-muted hover:text-primary')}>
                <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
              </button>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-6 pt-8 border-t border-border-subtle">
              {[
                { icon: <Truck size={22} />, label: t('checkout.fast_shipping') },
                { icon: <ShieldCheck size={22} />, label: t('checkout.secure_payment') },
                { icon: <RotateCcw size={22} />, label: t('checkout.returns') },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2 text-primary">
                  {item.icon}
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-24">
          <div className="flex border-b border-border-subtle overflow-x-auto">
            {[
              { id: 'desc', label: t('product.tabs.description') },
              { id: 'specs', label: t('product.tabs.specs') },
              { id: 'reviews', label: `${t('product.tabs.reviews')} (${prod.reviewsCount})` },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn('px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-all',
                  activeTab === tab.id ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-main'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="py-12 px-2 max-w-3xl">
            {activeTab === 'desc' && <p className="text-text-muted leading-[1.8]">{prod.description[currentLang]}</p>}
            {activeTab === 'specs' && (
              <div className="space-y-3">
                {[
                  { label: t('product.specs.origin'), value: 'Dougga, Tunisia' },
                  { label: t('product.specs.variety'), value: 'Chemlali' },
                  { label: t('product.specs.acidity'), value: '< 0.3%' },
                  { label: t('product.specs.harvest'), value: 'October – November' },
                ].map((spec, i) => (
                  <div key={i} className="flex justify-between py-3 border-b border-border-subtle">
                    <span className="text-xs uppercase font-bold text-text-muted tracking-widest">{spec.label}</span>
                    <span className="text-sm font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'reviews' && <ProductReviews productId={id} />}
          </div>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <motion.div variants={staggerContainer} className="mt-24" initial="hidden" whileInView="visible" viewport={scrollViewport}>
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold tracking-tighter uppercase mb-12">{t('product.related')}</motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {relatedProducts.map((p) => (
                <motion.div key={p.id} variants={fadeInUp}><ProductCard product={p} /></motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
