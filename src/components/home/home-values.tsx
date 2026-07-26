'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, Leaf, Snowflake, Sprout } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fadeInUp, staggerContainer, scrollViewport } from '@/lib/animations';

const ITEMS = [
  { key: 'climate', icon: Sprout },
  { key: 'variety', icon: Leaf },
  { key: 'origin', icon: BadgeCheck },
  { key: 'cold_press', icon: Snowflake },
] as const;

export function HomeValues() {
  const { t } = useTranslation();

  return (
    <section className="section-y bg-bg-page">
      <motion.div variants={staggerContainer} className="container-premium" initial="hidden" whileInView="visible" viewport={scrollViewport}>
        <motion.p variants={fadeInUp} className="eyebrow text-center">
          {t('home.values.eyebrow', 'A journey in flavor')}
        </motion.p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ key, icon: Icon }) => (
            <motion.div
              key={key}
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              className="relative min-h-[260px] overflow-hidden rounded-[6px] border border-border-subtle bg-bg-card px-7 py-10 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-[0_18px_55px_rgba(0,0,0,0.42)]"
            >
              <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.32)_0_1px,transparent_2px),radial-gradient(circle_at_78%_15%,rgba(255,255,255,0.22)_0_1px,transparent_2px),radial-gradient(circle_at_88%_82%,rgba(184,148,79,0.35)_0_1px,transparent_2px),radial-gradient(circle_at_36%_92%,rgba(255,255,255,0.18)_0_1px,transparent_2px)]" />
              <div className="relative z-10">
                <div className="mb-7 flex items-center justify-center gap-2 text-primary">
                  <Icon size={22} strokeWidth={1.35} />
                  <h3 className="label-caps max-w-[12rem] text-text-main">
                    {t(`home.values.items.${key}.title`)}
                  </h3>
                </div>
                <p className="mx-auto max-w-[15rem] font-serif text-base leading-relaxed text-text-secondary">
                  {t(`home.values.items.${key}.body`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
