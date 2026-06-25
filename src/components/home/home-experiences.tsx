'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AppImage } from '@/components/ui/app-image';
import { fadeInUp, staggerContainer, scrollViewport } from '@/lib/animations';

const EXPERIENCES = [
  { key: 'walk', image: '/story/hero/story_hero2.png' },
  { key: 'sunset', image: '/home/exp/xp2.png' },
  { key: 'harvest', image: '/home/exp/exp3.jpeg' },
] as const;

export function HomeExperiences() {
  const { t } = useTranslation();

  return (
    <section className="section-y-lg bg-bg-page">
      <div className="container-premium">
        <motion.div variants={fadeInUp} className="mb-12 max-w-2xl" initial="hidden" whileInView="visible" viewport={scrollViewport}>
          <p className="eyebrow">{t('home.experiences.eyebrow', 'Experiences in our grove')}</p>
          <h2 className="section-title">{t('home.experiences.title')}</h2>
          <p className="body-lg mt-4">{t('home.experiences.subtitle')}</p>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid gap-6 md:grid-cols-3" initial="hidden" whileInView="visible" viewport={scrollViewport}>
          {EXPERIENCES.map(({ key, image }) => (
            <motion.article
              key={key}
              variants={fadeInUp}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              className="group card-premium overflow-hidden p-0 transition-shadow duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <AppImage
                  src={image}
                  alt={t(`home.experiences.items.${key}.title`)}
                  sizes="33vw"
                  hoverZoom
                />
              </div>
              <div className="space-y-3 p-5">
                <h3 className="font-serif text-lg text-text-main">{t(`home.experiences.items.${key}.title`)}</h3>
                <p className="text-sm leading-relaxed text-text-muted">
                  {t(`home.experiences.items.${key}.desc`)}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-10 text-center" initial="hidden" whileInView="visible" viewport={scrollViewport}>
          <Link href="/contact" className="btn-mondas-outline">
            {t('home.experiences.cta', 'Contact us for details')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
