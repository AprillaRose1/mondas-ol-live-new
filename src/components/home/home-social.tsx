'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Facebook } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fadeInUp, staggerContainer, scrollViewport } from '@/lib/animations';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.11V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.18 8.18 0 0 0 4.77 1.52V6.82a4.84 4.84 0 0 1-1-.13z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { key: 'instagram', icon: Instagram, href: 'https://instagram.com' },
  { key: 'facebook', icon: Facebook, href: 'https://facebook.com' },
  { key: 'tiktok', icon: TikTokIcon, href: 'https://tiktok.com' },
] as const;

export function HomeSocial() {
  const { t } = useTranslation();

  return (
    <section className="section-y border-t border-border-subtle bg-bg-matte">
      <div className="container-premium">
        <motion.div variants={staggerContainer} className="mx-auto max-w-2xl text-center" initial="hidden" whileInView="visible" viewport={scrollViewport}>
          <motion.p variants={fadeInUp} className="eyebrow justify-center">
            {t('home.social.eyebrow')}
          </motion.p>
          <motion.h2 variants={fadeInUp} className="section-title">
            {t('home.social.title')}
          </motion.h2>
          <motion.p variants={fadeInUp} className="page-subtitle mx-auto mt-4">
            {t('home.social.subtitle')}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            {SOCIAL_LINKS.map(({ key, icon: Icon, href }) => (
              <Link
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-premium group flex min-w-[140px] flex-col items-center gap-3 px-8 py-6 transition-transform duration-500 ease-out hover:scale-105"
              >
                {key === 'tiktok' ? (
                  <Icon className="size-5 text-text-muted transition-all duration-500 group-hover:scale-110 group-hover:text-primary" />
                ) : (
                  <Icon
                    className="size-5 text-text-muted transition-all duration-500 group-hover:scale-110 group-hover:text-primary"
                    strokeWidth={1.25}
                  />
                )}
                <span className="label-caps">{t(`home.social.${key}`)}</span>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
