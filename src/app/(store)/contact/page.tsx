'use client';

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { fadeInUp, staggerContainer, scrollViewport } from '@/lib/animations';
import { PageHeader } from '@/components/ui/typography';
import { ContactMapCard } from '@/components/contact/contact-map-card';
import { ContactForm } from '@/components/contact/contact-form';

const Contact = () => {
  const { t } = useTranslation();

  const infoItems = [
    { icon: Mail, label: t('contact.info.email'), value: t('contact.info.email_value') },
    { icon: Phone, label: t('contact.info.phone'), value: t('contact.info.phone_value') },
    { icon: MapPin, label: t('contact.info.location'), value: t('contact.info.location_detail') },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-bg-page pb-24 text-text-main">
      <div className="container-premium max-w-7xl py-8 md:py-12">
        <motion.div variants={staggerContainer} className="grid gap-12 lg:grid-cols-3 lg:gap-16" initial="hidden" whileInView="visible" viewport={scrollViewport}>
          <div className="space-y-12 lg:col-span-2">
            <motion.div variants={fadeInUp}>
              <PageHeader
                eyebrow={t('contact.badge')}
                title={t('contact.title')}
                subtitle={t('contact.subtitle')}
                align="left"
              />
            </motion.div>

            <div className="grid gap-6">
              {infoItems.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="card-premium group flex items-center gap-6 p-6"
                >
                  <div className="flex size-12 items-center justify-center border border-border-subtle bg-bg-page transition-colors group-hover:border-primary group-hover:bg-primary">
                    <item.icon size={18} className="text-text-muted group-hover:text-primary-foreground" />
                  </div>
                  <div>
                    <p className="label-caps mb-1">{item.label}</p>
                    <p className="font-serif text-lg text-text-main">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <ContactForm />
          </div>

          <div className="lg:col-span-1">
            <ContactMapCard />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
