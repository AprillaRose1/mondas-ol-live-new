'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { fadeInUp, staggerContainer, scrollViewport } from '@/lib/animations';

const RESTAURANT_URL = 'https://mondas-restaurant.de/reservierung';
const RESTAURANT_HOME_URL = 'https://mondas-restaurant.de';

export function HomeRestaurant() {
  const { t } = useTranslation();

  return (
    <section className="section-y-lg border-y border-border-subtle bg-bg-matte">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        className="container-premium"
      >
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div variants={fadeInUp} className="flex justify-center lg:justify-start">
            <div className="flex min-h-[260px] w-full max-w-md items-center justify-center border border-border-subtle bg-bg-page px-8 py-12 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              <Image
                src="/brand/mondas-restaurant-logo.png"
                alt={t('home.restaurant.logo_alt')}
                width={640}
                height={260}
                className="h-auto w-full max-w-[320px]"
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
