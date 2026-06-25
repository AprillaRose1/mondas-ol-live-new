'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { slideInLeft, slideInRight, scrollViewport } from '@/lib/animations';

export function HomeContactCta() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden border-t border-border-subtle bg-bg-matte py-20 md:py-28">
      <div className="container-premium grid items-center gap-16 lg:grid-cols-2">
        <motion.div variants={slideInLeft} className="space-y-6" initial="hidden" whileInView="visible" viewport={scrollViewport}>
          <p className="eyebrow">{t('home.contact_cta.eyebrow', 'Contact')}</p>
          <h2 className="section-title">{t('home.contact_cta.title')}</h2>
          <p className="body-lg max-w-md text-text-secondary">{t('home.contact_cta.desc')}</p>
          <Link href="/contact" className="btn-mondas inline-flex items-center gap-2">
            {t('home.contact_cta.button')} <MessageSquare size={16} />
          </Link>
        </motion.div>

        <motion.div variants={slideInRight} className="card-premium space-y-8 border-primary/20 p-8 md:p-10" initial="hidden" whileInView="visible" viewport={scrollViewport}>
          <div>
            <p className="label-caps mb-2">{t('common.location')}</p>
            <p className="font-serif text-xl text-text-main">
              {t('contact.info.location_detail')}
            </p>
          </div>
          <div>
            <p className="label-caps mb-2">{t('common.phone')}</p>
            <p className="font-serif text-xl text-text-main">{t('contact.info.phone_value')}</p>
          </div>
          <div>
            <p className="label-caps mb-2">{t('common.email')}</p>
            <p className="font-serif text-xl text-text-main">{t('contact.info.email_value')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
