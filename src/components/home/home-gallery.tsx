'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Images } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppImage } from '@/components/ui/app-image';
import { fadeInUp, scaleIn, staggerContainer, scrollViewport } from '@/lib/animations';

const HOME_GALLERY_IMAGES = [
  { src: '/gallery/dougga/IMG_3903.jpg', className: 'col-span-12 row-span-2 h-[360px] md:col-span-6 md:h-full' },
  { src: '/gallery/dougga/IMG_3964.jpg', className: 'col-span-6 h-[170px] md:col-span-3 md:h-[210px]' },
  { src: '/gallery/dougga/IMG_3986.jpg', className: 'col-span-6 h-[170px] md:col-span-3 md:h-[210px]' },
  { src: '/gallery/dougga/IMG_3920.jpg', className: 'col-span-12 h-[220px] md:col-span-2 md:h-[250px]' },
  { src: '/gallery/dougga/IMG_4055.jpg', className: 'col-span-6 h-[170px] md:col-span-2 md:h-[250px]' },
  { src: '/gallery/dougga/IMG_3944.jpg', className: 'col-span-6 h-[170px] md:col-span-2 md:h-[250px]' },
] as const;

export function HomeGallery() {
  const { t } = useTranslation();

  return (
    <section className="section-y-lg border-b border-border-subtle bg-bg-page">
      <div className="container-premium">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end"
        >
          <div className="max-w-2xl">
            <motion.p variants={fadeInUp} className="eyebrow">
              {t('home.gallery.eyebrow')}
            </motion.p>
            <motion.h2 variants={fadeInUp} className="section-title">
              {t('home.gallery.title')}
            </motion.h2>
            <motion.p variants={fadeInUp} className="body-lg mt-4 max-w-xl text-text-secondary">
              {t('home.gallery.subtitle')}
            </motion.p>
          </div>
          <motion.div variants={fadeInUp}>
            <Link href="/gallery" className="btn-mondas-outline gap-2">
              <Images size={15} strokeWidth={1.5} />
              {t('home.gallery.cta')}
              <ArrowRight size={15} strokeWidth={1.5} />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          className="grid grid-cols-12 gap-px border border-border-subtle bg-border-subtle md:grid-rows-[210px_250px]"
        >
          {HOME_GALLERY_IMAGES.map((image, index) => (
            <motion.div
              key={image.src}
              variants={scaleIn}
              className={`group relative overflow-hidden bg-bg-card ${image.className}`}
            >
              <AppImage
                src={image.src}
                alt={t('home.gallery.image_alt', { number: index + 1 })}
                sizes={index === 0 ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 50vw'}
                hoverZoom
                className="brightness-[1.03] contrast-[1.04] saturate-[1.08]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/5 opacity-80" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
