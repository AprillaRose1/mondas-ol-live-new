'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ExternalLink, UtensilsCrossed } from 'lucide-react';
import { fadeInUp, staggerContainer, scrollViewport } from '@/lib/animations';

const RESTAURANT_URL = 'https://mondas-restaurant.de/reservierung';

export function HomeRestaurant() {
  const { t } = useTranslation();

  return (
    <section className="section-y-lg bg-bg-page">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        className="container-premium max-w-3xl text-center"
      >
        {/* Small long window — link banner to the restaurant */}
        <motion.div variants={fadeInUp}>
          <Link
            href={RESTAURANT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mx-auto flex w-full items-center justify-center gap-3 border border-primary/30 bg-primary/5 px-6 py-3.5 transition-colors hover:border-primary hover:bg-primary/10"
          >
            <UtensilsCrossed size={16} className="text-primary" strokeWidth={1.5} />
            <span className="label-caps text-primary">{t('home.restaurant.cta')}</span>
            <ExternalLink size={14} className="text-primary transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Body copy */}
        <motion.p variants={fadeInUp} className="body-lg mx-auto mt-8 max-w-2xl">
          {t('home.restaurant.body')}
        </motion.p>
      </motion.div>
    </section>
  );
}
