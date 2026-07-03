'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingBasket, ArrowRight, Minus, Plus, Tag, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { removeItem, updateQuantity, clearCoupon } from '@/store/slices/cartSlice';
import { toast } from 'sonner';
import { Language } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { MondasButton } from '@/components/ui/mondas-button';
import { ButtonLoader } from '@/components/common/Loaders';

import { fadeInUp, staggerContainer, scaleIn } from '@/lib/animations';
import { AppImage } from '@/components/ui/app-image';
import Image from 'next/image';

const Cart = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentLang = i18n.language.slice(0, 2) as Language;
  const [isNavigating, setIsNavigating] = React.useState(false);
  const [couponInput, setCouponInput] = React.useState('');
  const [couponLoading, setCouponLoading] = React.useState(false);

  const items = useAppSelector(state => state.cart.items);
  const appliedCoupon = useAppSelector(state => state.cart.appliedCoupon);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = appliedCoupon?.discountAmount ?? 0;
  const totalPrice = Math.max(0, subtotal - discount);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      // Coupons are disabled in the standalone demo.
      toast.error('Coupons are disabled in the standalone demo.');
    } catch { toast.error('Could not validate coupon'); }
    finally { setCouponLoading(false); }
  };

  const handleCheckout = () => {
    setIsNavigating(true);
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 px-6"
      >
        <motion.div variants={scaleIn} className="w-24 h-24 bg-bg-card rounded-full flex items-center justify-center border border-border-subtle">
          <ShoppingBasket size={40} className="text-border-subtle" />
        </motion.div>
        <div className="text-center space-y-2">
          <motion.h2 variants={fadeInUp} className="text-3xl font-bold tracking-tighter uppercase">{t('cart.empty')}</motion.h2>
          <motion.p variants={fadeInUp} className="text-text-muted max-w-xs mx-auto text-sm leading-relaxed">
            {t('cart.empty_desc')}
          </motion.p>
        </div>
        <motion.div variants={fadeInUp}>
          <Link href="/shop" className="btn-mondas">
            {t('cart.continue_shopping')}
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-24 px-6 lg:px-12 bg-bg-page overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-16"
        >
          {t('common.cart')}
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-16">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-8 border-t border-border-subtle"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div 
                  key={item.id}
                  variants={fadeInUp}
                  layout
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-6 py-8 border-b border-border-subtle group bg-bg-page"
                >
                  <div className="w-24 h-32 md:w-32 md:h-40 bg-bg-card overflow-hidden border border-border-subtle">
                    <AppImage
                      src={item.images[0]}
                      alt={item.name[currentLang]}
                      sizes="128px"
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 block">
                          {item.category}
                        </span>
                        <Link href={`/product/${item.id}`} className="text-lg font-bold uppercase hover:text-primary transition-colors">
                          {item.name[currentLang]}
                        </Link>
                      </div>
                      <button 
                        onClick={() => dispatch(removeItem(item.id))}
                        className="text-text-muted hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-border-subtle">
                        <button 
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                          className="px-3 py-1 hover:bg-bg-page transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-bold text-sm tracking-widest">{item.quantity}</span>
                        <button 
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                          className="px-3 py-1 hover:bg-bg-page transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="font-bold text-primary">
                        {(item.price * item.quantity).toLocaleString(undefined, { style: 'currency', currency: 'EUR' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="lg:sticky lg:top-32 h-fit bg-bg-card p-8 border border-border-subtle space-y-8">
            <h3 className="text-xl font-bold uppercase tracking-widest border-b border-border-subtle pb-4">{t('cart.summary')}</h3>
            
            {/* Coupon */}
            <div className="space-y-2">
              {appliedCoupon ? (
                <div className="flex items-center justify-between py-2 px-3 bg-emerald-500/10 border border-emerald-500/20 rounded">
                  <div className="flex items-center gap-2">
                    <Tag size={13} className="text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase text-emerald-600">{appliedCoupon.code} — {appliedCoupon.message}</span>
                  </div>
                  <button onClick={() => { dispatch(clearCoupon()); setCouponInput(''); }} className="text-text-muted hover:text-rose-500 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    placeholder="COUPON CODE"
                    className="flex-1 bg-bg-page border border-border-subtle px-3 py-2 text-[11px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-primary outline-none"
                  />
                  <button onClick={handleApplyCoupon} disabled={couponLoading}
                    className="px-4 py-2 bg-text-main text-bg-page text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    {couponLoading ? <ButtonLoader /> : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted font-medium uppercase tracking-widest text-[10px]">{t('cart.subtotal')}</span>
                <span className="font-bold">{subtotal.toLocaleString(undefined, { style: 'currency', currency: 'EUR' })}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">Discount</span>
                  <span className="font-bold text-emerald-500">-{appliedCoupon.discountAmount.toLocaleString(undefined, { style: 'currency', currency: 'EUR' })}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-text-muted font-medium uppercase tracking-widest text-[10px]">{t('cart.shipping')}</span>
                <span className="font-bold">{t('cart.free')}</span>
              </div>
              <div className="pt-4 border-t border-border-subtle flex justify-between">
                <span className="font-bold uppercase tracking-widest text-xs">{t('cart.total')}</span>
                <span className="text-2xl font-bold text-primary">{totalPrice.toLocaleString(undefined, { style: 'currency', currency: 'EUR' })}</span>
              </div>
            </div>

            <p className="text-[10px] text-text-muted text-center italic">{t('cart.tax_notice')}</p>

            <MondasButton
              type="button"
              loading={isNavigating}
              onClick={handleCheckout}
              className="group min-h-[50px] w-full gap-2"
            >
              {t('checkout.buttons.next')}{' '}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </MondasButton>

            <div className="pt-4 flex flex-col gap-3">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal"
                width={80}
                height={16}
                className="mx-auto h-4 w-auto cursor-not-allowed opacity-50 grayscale transition-all hover:grayscale-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
