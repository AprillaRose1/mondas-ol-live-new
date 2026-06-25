'use client';

import { motion } from 'framer-motion';
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
        <motion.p variants={fadeInUp} className="font-serif text-lg leading-[1.85] text-text-secondary md:text-xl">
          {t('home.intro.body')}
        </motion.p>
      </motion.div>
    </section>
  );
}
