'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { fadeInUp, staggerContainer, scrollViewport } from '@/lib/animations';

const STEPS = ['harvest', 'press', 'rest', 'acidity'] as const;

export function HomeProcess() {
  const { t } = useTranslation();

  return (
    <section className="section-y-lg border-t border-border-subtle bg-bg-matte">
      <div className="container-premium">
        <motion.div variants={fadeInUp} className="eyebrow" initial="hidden" whileInView="visible" viewport={scrollViewport}>
          {t('home.process.eyebrow', 'How we craft uniqueness')}
        </motion.div>
        <motion.div variants={fadeInUp} className="section-title mb-14 max-w-xl" initial="hidden" whileInView="visible" viewport={scrollViewport}>
          {t('home.process.title', 'From grove to bottle')}
        </motion.div>

        <motion.div variants={staggerContainer} className="grid gap-8 md:grid-cols-2 lg:grid-cols-4" initial="hidden" whileInView="visible" viewport={scrollViewport}>
          {STEPS.map((step, i) => (
            <motion.div
              key={step}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              className="border-t border-primary/40 pt-6 transition-shadow duration-300 hover:shadow-[0_10px_32px_rgba(0,0,0,0.28)]"
            >
              <span className="font-serif text-3xl text-primary/80">0{i + 1}</span>
              <h3 className="mt-4 font-serif text-lg text-text-main">{t(`home.process.steps.${step}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {t(`home.process.steps.${step}.desc`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
