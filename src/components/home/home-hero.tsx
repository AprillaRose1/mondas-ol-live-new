'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { HeroCarousel } from '@/components/ui/hero-carousel';
import { HOME_HERO_IMAGES } from '@/lib/hero-images';
import { AccentTitle } from '@/components/ui/typography';
import { fadeInUp, staggerContainer, scrollViewport } from '@/lib/animations';
import { HEADER_OFFSET_CLASS } from '@/lib/layout';

export function HomeHero() {
  const { t } = useTranslation();

  return (
    <section className="relative isolate flex min-h-svh w-full items-end overflow-hidden">
      <HeroCarousel images={HOME_HERO_IMAGES} alt={t('home.hero.image_alt')} />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-bg-page from-10% via-transparent to-transparent" />

      <div
        className={`pointer-events-none container-premium relative z-10 w-full pb-16 md:pb-24 ${HEADER_OFFSET_CLASS}`}
      >
        <motion.div variants={staggerContainer} className="pointer-events-none max-w-2xl" initial="hidden" whileInView="visible" viewport={scrollViewport}>
          <motion.p variants={fadeInUp} className="eyebrow text-white">
            {t('home.hero.eyebrow')}
          </motion.p>
          <motion.div variants={fadeInUp}>
            <AccentTitle i18nKey="home.hero.title" className="mb-5" accentClassName="hero-gold-accent" />
          </motion.div>
          <motion.p variants={fadeInUp} className="body-lg mb-8 max-w-lg text-text-secondary">
            {t('home.hero.tagline')}
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
            <Link href="/shop" className="btn-mondas gap-2">
              {t('hero.cta')} <ArrowRight size={16} />
            </Link>
            <Link href="/story" className="btn-mondas-outline gap-2">
              <Play size={14} />
              {t('home.hero.video_cta')}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
