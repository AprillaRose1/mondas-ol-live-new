'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronDown, Plus } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { useProducts } from '@/lib/hooks/useProducts';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import type { Product } from '@/lib/types';
import { ButtonLoader } from '@/components/common/Loaders';

type Category = 'all' | 'premium' | 'extra-virgin' | 'infusions' | 'sets';
type SortKey = 'featured' | 'price-asc' | 'price-desc';

const LIMIT = 12;

export default function Shop() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [sortBy, setSortBy] = useState<SortKey>('featured');
  const [page, setPage] = useState(1);

  const { products, total, totalPages, loading } = useProducts({
    page,
    limit: LIMIT,
    ...(category !== 'all' ? { category } : {}),
    ...(search.trim() ? { search: search.trim() } : {}),
    ...(sortBy === 'featured' ? { featured: true } : {}),
  });

  const CATEGORIES: Category[] = ['all', 'premium', 'extra-virgin', 'infusions', 'sets'];

  // Accumulate pages for "load more" behaviour
  const [items, setItems] = useState<Product[]>([]);
  const filterKey = JSON.stringify({ category, search: search.trim(), sortBy });

  // Reset accumulation whenever filters change
  useEffect(() => { setPage(1); setItems([]); }, [filterKey]);

  // Append each freshly fetched page (replace on page 1, dedupe on later pages)
  useEffect(() => {
    if (loading) return;
    setItems((prev) => {
      if (page === 1) return products;
      const seen = new Set(prev.map((p) => p.id));
      return [...prev, ...products.filter((p) => !seen.has(p.id))];
    });
  }, [products, page, loading]);

  // Client-side sort on the accumulated list
  const sorted = [...items].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  const isInitialLoad = loading && items.length === 0;
  const isLoadingMore = loading && items.length > 0;
  const hasMore = page < totalPages;

  const handleSearch = (v: string) => setSearch(v);
  const handleCategory = (c: Category) => setCategory(c);
  const handleSort = (s: SortKey) => setSortBy(s);

  return (
    <div className="min-h-screen pt-12 pb-24 px-6 lg:px-12 bg-bg-page text-text-main">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-8 mb-16">
          <div className="max-w-7xl mx-auto text-center mb-8">
            <motion.span variants={fadeInUp} className="eyebrow">{t('shop.badge')}</motion.span>
            <motion.h1 variants={fadeInUp} className="display-title mb-4">{t('shop.title')}</motion.h1>
          </div>

          <motion.div variants={fadeInUp} className="flex flex-col lg:flex-row justify-between items-center gap-6 border-y border-border-subtle py-6">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={t('shop.search')}
                className="w-full bg-bg-card border border-border-subtle pl-12 pr-4 py-4 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">{t('shop.sortBy')}:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value as SortKey)}
                  className="appearance-none bg-bg-card border border-border-subtle px-4 pr-10 py-3 text-[10px] font-bold uppercase tracking-widest cursor-pointer outline-none focus:border-primary hover:border-primary transition-colors"
                >
                  {['featured', 'price-asc', 'price-desc'].map((s) => (
                    <option key={s} value={s}>{t(`shop.sortOptions.${s.replace('-','_')}`, s)}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted" />
              </div>
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div variants={fadeInUp} className="flex gap-3 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => handleCategory(c)}
                className={cn(
                  'px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest border transition-all',
                  category === c ? 'bg-primary text-primary-foreground border-primary' : 'border-border-subtle hover:border-primary hover:text-primary',
                )}
              >
                {t(`shop.categories.${c}`, c)}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Grid */}
        {isInitialLoad ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {[...Array(LIMIT)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-text-muted font-bold uppercase tracking-widest text-sm mb-4">{t('shop.no_results')}</p>
            <button onClick={() => { handleSearch(''); handleCategory('all'); }} className="text-primary text-[10px] font-bold uppercase tracking-widest hover:underline">
              {t('shop.reset_filters')}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {sorted.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>

            {/* Load more */}
            <div className="mt-16 flex flex-col items-center gap-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                {t('shop.showing', 'Showing')} {sorted.length} {t('shop.of', 'of')} {total}
              </p>
              {hasMore && (
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-4 border border-border-subtle text-[10px] font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all disabled:opacity-50"
                >
                  {isLoadingMore ? <ButtonLoader /> : <Plus size={14} />}
                  {t('shop.load_more', 'Load more')}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
