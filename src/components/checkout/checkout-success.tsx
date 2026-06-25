'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

type CheckoutSuccessProps = {
  orderId: string;
  email: string;
};

export function CheckoutSuccess({ orderId, email }: CheckoutSuccessProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="card-premium mx-auto max-w-lg space-y-8 p-10 text-center"
    >
      <motion.div variants={fadeInUp} className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle size={32} className="text-primary" strokeWidth={1.5} />
      </motion.div>
      <motion.div variants={fadeInUp} className="space-y-3">
        <p className="eyebrow justify-center">{t('checkout.steps.confirmation')}</p>
        <h2 className="page-title">{t('checkout.success_title')}</h2>
        <p className="page-subtitle">{t('checkout.success_desc', { email })}</p>
        <p className="label-caps text-primary">
          {t('checkout.order_number')}: {orderId}
        </p>
      </motion.div>
      <motion.div variants={fadeInUp} className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/shop" className="btn-mondas-outline justify-center gap-2">
          {t('checkout.continue_shopping')}
        </Link>
        <Link href="/" className="btn-mondas justify-center gap-2">
          {t('nav.home')} <ArrowRight size={16} />
        </Link>
      </motion.div>
    </motion.div>
  );
}
