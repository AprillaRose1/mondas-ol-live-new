'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink } from 'lucide-react';
import { fadeInUp, scrollViewport } from '@/lib/animations';

/** Königswinter storefront. Keyless Google Maps embed geocodes the address —
 * no API key required. */
const MAP_ADDRESS = 'Hauptstraße 332, 53639 Königswinter';
const MAP_QUERY = encodeURIComponent(MAP_ADDRESS);
const MAPS_EMBED = `https://www.google.com/maps?q=${MAP_QUERY}&z=16&output=embed`;
const MAPS_DIRECTIONS = `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`;

export function ContactMapCard() {
  const { t } = useTranslation();

  return (
    <motion.aside
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      className="card-premium sticky top-28 overflow-hidden p-0"
    >
      <div className="border-b border-border-subtle p-6">
        <p className="eyebrow">{t('contact.map_eyebrow')}</p>
        <h2 className="section-title mt-2 text-xl">{t('contact.map_title')}</h2>
        <p className="body-lg mt-3 flex items-start gap-2 text-sm">
          <MapPin size={16} className="mt-0.5 shrink-0 text-primary" strokeWidth={1.5} />
          {t('contact.info.location_detail')}
        </p>
      </div>

      <div className="relative aspect-[4/3] w-full bg-bg-matte">
        <iframe
          title={t('contact.map_title')}
          src={MAPS_EMBED}
          className="absolute inset-0 h-full w-full border-0 grayscale-[0.2] contrast-[1.05]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="p-6">
        <Link
          href={MAPS_DIRECTIONS}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-mondas-outline w-full justify-center gap-2 py-3"
        >
          {t('contact.open_maps')} <ExternalLink size={14} />
        </Link>
      </div>
    </motion.aside>
  );
}
