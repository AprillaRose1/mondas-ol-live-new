'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Instagram, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, footerViewport, staggerContainer } from '@/lib/animations';
import { BRAND_ACCENTS, applyBrandAccent } from '@/lib/brand-themes';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';

function TikTokIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.11V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.18 8.18 0 0 0 4.77 1.52V6.82a4.84 4.84 0 0 1-1-.13z" />
    </svg>
  );
}

const SOCIAL = [
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: TikTokIcon, href: 'https://tiktok.com', label: 'TikTok' },
] as const;

export const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const scrollToTop = (e: React.MouseEvent) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative z-[1] border-t border-border-subtle bg-bg-nav px-6 pb-8 pt-16 lg:px-12">
      <motion.div
        variants={staggerContainer}
        className="mx-auto mb-16 grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4"
       initial="hidden" whileInView="visible" viewport={footerViewport}>
        <motion.div variants={fadeInUp} className="flex flex-col gap-8 lg:col-span-1">
          <Link href="/" onClick={scrollToTop} className="group inline-block">
            <Logo variant="footer" />
          </Link>
          <div className="hidden w-fit items-center gap-3 rounded-full border border-border-subtle bg-bg-card/30 px-3 py-1.5 md:flex">
            {BRAND_ACCENTS.map((accent) => (
              <button
                key={accent.color}
                type="button"
                onClick={() => applyBrandAccent(accent)}
                className={cn(
                  'size-3 rounded-full transition-shadow hover:shadow-[0_0_8px_rgba(184,148,79,0.35)]',
                  accent.bordered && 'ring-1 ring-border-strong ring-offset-1 ring-offset-bg-nav',
                )}
                style={{ backgroundColor: accent.color }}
                title={accent.name}
                aria-label={accent.name}
              />
            ))}
          </div>
          <p className="body-lg max-w-xs">{t('footer.description')}</p>
          <div className="flex gap-6">
            {SOCIAL.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted transition-all duration-500 hover:scale-110 hover:text-primary"
                aria-label={social.label}
              >
                {social.label === 'TikTok' ? (
                  <TikTokIcon size={22} />
                ) : (
                  <social.icon size={22} strokeWidth={1.5} />
                )}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <h4 className="footer-heading">{t('footer.navigation')}</h4>
          <ul className="flex flex-col gap-5">
            {[
              { to: '/', label: t('nav.home'), onClick: scrollToTop },
              { to: '/shop', label: t('nav.shop') },
              { to: '/gallery', label: t('nav.gallery', 'Gallery') },
              { to: '/story', label: t('nav.story') },
              { to: '/recipes', label: t('nav.recipes') },
            ].map((link) => (
              <li key={link.to}>
                <Link href={link.to} onClick={(e) => link.onClick?.(e)} className="footer-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <h4 className="footer-heading">{t('footer.support')}</h4>
          <ul className="flex flex-col gap-5">
            {[
              { to: '/faq', label: t('nav.faq') },
              { to: '/contact', label: t('nav.contact') },
              { to: '/privacy', label: t('footer.privacy') },
            ].map((link) => (
              <li key={link.to}>
                <Link href={link.to} className="footer-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <h4 className="footer-heading mb-6">{t('footer.newsletter.title')}</h4>
          <p className="body-lg mb-6">{t('footer.newsletter.subtitle')}</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder={t('auth.placeholders.email')}
              className="h-[45px] w-full rounded-sm bg-bg-card px-4 py-2 text-text-main"
            />
            <button type="button" className="btn-mondas shrink-0 px-6">
              {t('footer.newsletter.button')}
            </button>
          </div>
        </motion.div>
      </motion.div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-border-subtle pt-8 text-text-muted md:flex-row">
        <p className="label-caps">© {year} {t('footer.rights')}</p>
        <p className="label-caps text-primary/50">{t('footer.designed_by')}</p>
      </div>
    </footer>
  );
};
