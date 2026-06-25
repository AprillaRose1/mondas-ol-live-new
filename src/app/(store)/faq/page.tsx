'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Minus, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { fadeInUp, staggerContainer, scrollViewport } from '@/lib/animations';
import { PageHeader } from '@/components/ui/typography';

const FAQ_KEYS = ['shelf_life', 'cold_pressed', 'storage'] as const;

const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-bg-page px-6 pb-24 lg:px-12">
      <div className="container-premium mx-auto max-w-3xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="page-header page-header--center mb-16"
        >
          <PageHeader
            eyebrow={t('faq.badge')}
            title={t('nav.faq')}
            align="center"
          />
          <motion.div variants={fadeInUp} className="relative mx-auto mt-8 max-w-sm">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
            <input placeholder={t('shop.search')} className="w-full rounded-full pl-12" />
          </motion.div>
        </motion.div>

        <motion.div variants={staggerContainer} className="space-y-3" initial="hidden" whileInView="visible" viewport={scrollViewport}>
          {FAQ_KEYS.map((key, i) => (
            <motion.div key={key} variants={fadeInUp} className="card-premium overflow-hidden p-0">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-bg-page"
              >
                <span className="font-serif text-base text-text-main">{t(`faq.${key}.q`)}</span>
                {openIndex === i ? (
                  <Minus size={18} className="shrink-0 text-primary" />
                ) : (
                  <Plus size={18} className="shrink-0 text-text-muted" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="body-lg border-t border-border-subtle px-6 pb-6 pt-2">
                      {t(`faq.${key}.a`)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        <div className="card-premium mt-16 border-primary/15 p-10 text-center">
          <h3 className="section-title mb-3 text-xl">{t('contact.still_questions')}</h3>
          <p className="body-lg mb-8">{t('contact.still_questions_desc')}</p>
          <Link href="/contact" className="btn-mondas">
            {t('contact.form_title')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
