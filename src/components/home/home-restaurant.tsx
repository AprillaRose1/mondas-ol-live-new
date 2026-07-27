'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { fadeInUp, staggerContainer, scrollViewport } from '@/lib/animations';
import { AppImage } from '@/components/ui/app-image';

const RESTAURANT_URL = 'https://mondas-restaurant.de/reservierung';
const RESTAURANT_HOME_URL = 'https://mondas-restaurant.de';

export function HomeRestaurant() {
  const { t } = useTranslation();

  return (
    <section className="section-y-lg border-y border-border-subtle bg-bg-page">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        className="container-premium"
      >
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div variants={fadeInUp} className="flex justify-center lg:justify-start">
            <div className="relative aspect-[9/16] w-full max-w-[320px] bg-bg-page">
              <AppImage
                src="/brand/mondas-restaurant-card.jpeg"
                alt={t('home.restaurant.logo_alt')}
                sizes="(min-width: 1024px) 320px, 82vw"
                objectFit="cover"
                showSpinner={false}
              />
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="text-center lg:text-left">
            <p className="eyebrow lg:text-left">{t('home.restaurant.eyebrow')}</p>
            <h2 className="section-title">{t('home.restaurant.title')}</h2>
            <p className="body-lg mt-5 max-w-xl text-text-secondary lg:mx-0">
              {t('home.restaurant.body')}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link
                href={RESTAURANT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-mondas gap-2"
              >
                {t('home.restaurant.primary_cta')}
                <ExternalLink size={15} strokeWidth={1.5} />
              </Link>
              <Link
                href={RESTAURANT_HOME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-mondas-outline gap-2"
              >
                {t('home.restaurant.secondary_cta')}
                <ArrowRight size={15} strokeWidth={1.5} />
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
