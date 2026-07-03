'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Heart, ShoppingBag, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Product, Language } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { addItem } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { cn } from '@/lib/utils';
import { ButtonLoader } from '../common/Loaders';
import { AppImage } from '@/components/ui/app-image';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language.slice(0, 2) as Language;
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const dispatch = useAppDispatch();
  const isInWishlist = useAppSelector(state => state.wishlist.itemIds.includes(product.id));

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    dispatch(addItem(product));
    toast.success(t('common.addedToCart', 'Zum Warenkorb hinzugefügt!'), {
      position: 'bottom-right',
      className: 'bg-primary text-white border-none'
    });
    setIsAdding(false);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleWishlist(product.id));
    if (!isInWishlist) {
      toast.info(t('common.addedToWishlist', 'Zur Wunschliste hinzugefügt!'), {
        position: 'bottom-right'
      });
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
        }
      }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -10 }}
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-bg-page mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500 ring-0 hover:ring-1 hover:ring-primary/40">
          {/* Gold Decorative Corner */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
          
          {/* Images */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: isHovered ? 1.08 : 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <AppImage
                src={product.images[currentImageIndex]}
                alt={product.name[currentLang]}
                objectFit="contain"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Controls Overlay */}
          {product.images.length > 1 && (
            <div className={cn(
              "absolute inset-0 flex items-center justify-between px-2 transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}>
            <button 
              onClick={prevImage}
              className="p-2 bg-bg-card/80 text-text-main rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={nextImage}
              className="p-2 bg-bg-card/80 text-text-main rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            </div>
          )}

          {/* Quick Actions */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-300 bg-gradient-to-t from-black/20 to-transparent",
            isHovered ? "translate-y-0" : ""
          )}>
            <div className="flex gap-2">
              <button 
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-grow bg-bg-card text-text-main py-2 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-2 min-h-[40px] shadow-lg"
              >
                {isAdding ? <ButtonLoader /> : (
                  <>
                    <ShoppingBag size={14} />
                    {t('common.addToCart')}
                  </>
                )}
              </button>
              <button 
                onClick={handleWishlist}
                className={cn(
                  "p-2 bg-bg-card text-text-main transition-colors shadow-lg",
                  isInWishlist ? "text-red-500" : "hover:text-primary"
                )}
              >
                <Heart size={16} fill={isInWishlist ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          {/* Category Tag */}
          <div className="absolute top-4 left-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-primary text-white px-2 py-1">
              {t(`shop.categories.${product.category}`)}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-main/90 transition-colors group-hover:text-primary">
            {product.name[currentLang]}
          </h3>
          <p className="text-sm font-semibold text-primary">
            {product.price.toLocaleString(undefined, { style: 'currency', currency: 'EUR' })}
          </p>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={cn("w-1 h-1 rounded-full", i < Math.floor(product.rating) ? "bg-primary" : "bg-border-subtle")}
              />
            ))}
            <span className="text-[10px] text-text-muted ml-1">{product.reviewsCount} {t('product.reviews_label', 'reviews')}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
