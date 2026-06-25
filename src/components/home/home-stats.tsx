'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { fadeInUp, staggerContainer, scrollViewport } from '@/lib/animations';
import { CountUpStat } from '@/components/ui/count-up-stat';

const STATS = ['trees', 'hectares', 'countries', 'years'] as const;

const STAT_DURATIONS: Record<(typeof STATS)[number], number> = {
  trees: 1.5,
  hectares: 1.1,
  countries: 1.8,
  years: 2.2,
};

export function HomeStats() {
  const { t } = useTranslation();

  return (
    <section className="border-y border-border-subtle bg-bg-card py-14 md:py-16">
      <motion.div
        variants={staggerContainer}
        className="container-premium grid grid-cols-2 gap-8 md:grid-cols-4"
       initial="hidden" whileInView="visible" viewport={scrollViewport}>
        {STATS.map((key) => (
          <motion.div key={key} variants={fadeInUp} className="text-center">
            <p className="font-serif text-3xl text-primary md:text-4xl">
              <CountUpStat value={t(`home.stats.${key}.value`)} duration={STAT_DURATIONS[key]} />
            </p>
            <p className="label-caps mt-2">{t(`home.stats.${key}.label`)}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
