'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { fadeInUp, staggerContainer, scrollViewport } from '@/lib/animations';

const KEYS = ['authentic', 'emotional', 'unforgettable', 'terroir'] as const;

export function HomeValues() {
  const { t } = useTranslation();

  return (
    <section className="section-y bg-bg-page">
      <motion.div variants={staggerContainer} className="container-premium" initial="hidden" whileInView="visible" viewport={scrollViewport}>
        <motion.p variants={fadeInUp} className="eyebrow text-center">
          {t('home.values.eyebrow', 'A journey in flavor')}
        </motion.p>
        <div className="mt-10 grid grid-cols-2 gap-px border border-border-subtle bg-border-subtle md:grid-cols-4">
          {KEYS.map((key) => (
            <motion.div
              key={key}
              variants={fadeInUp}
              whileHover={{ scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              className="bg-bg-card px-4 py-10 text-center transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] md:py-14"
            >
              <p className="font-serif text-xl italic text-primary md:text-2xl">
                {t(`home.values.items.${key}.title`)}
              </p>
              <p className="label-caps mt-3">{t(`home.values.items.${key}.subtitle`)}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
