'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fadeInUp, staggerContainer, scrollViewport } from '@/lib/animations';

export function HomeIntro() {
  const { t } = useTranslation();

  return (
    <section className="section-y border-y border-border-subtle bg-bg-matte">
      <motion.div variants={staggerContainer} className="container-premium mx-auto max-w-3xl text-center" initial="hidden" whileInView="visible" viewport={scrollViewport}>
        <motion.p variants={fadeInUp} className="eyebrow justify-center">
          {t('home.intro.eyebrow', 'Our EVO oil')}
        </motion.p>
        <motion.p variants={fadeInUp} className="font-serif text-lg leading-[1.75] text-text-secondary md:text-xl">
          {t('home.intro.body')}
        </motion.p>
        <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/shop" className="btn-mondas gap-2">
            <ShoppingBag size={15} strokeWidth={1.5} />
            {t('home.intro.primary_cta')}
          </Link>
          <Link href="/story" className="btn-mondas-outline gap-2">
            {t('home.intro.secondary_cta')}
            <ArrowRight size={15} strokeWidth={1.5} />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
