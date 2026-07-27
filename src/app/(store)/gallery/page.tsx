'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useGallery } from '@/lib/hooks/useGallery';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import { Language } from '@/lib/types';
import { X } from 'lucide-react';
import Image from 'next/image';
import { GalleryBentoGrid } from '@/components/gallery/gallery-bento-grid';
import { PageHeader } from '@/components/ui/typography';

const Gallery = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.slice(0, 2) as Language;
  const { images, loading, loadingMore, error, hasMore, loadMore, activeCategory, setCategory } = useGallery();
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  // derive categories from first load (all items)
  const categories = React.useMemo(
    () => ['all', 'nature', 'product', 'tradition', 'lifestyle'],
    [],
  );

  return (
    <div className="min-h-screen bg-bg-page px-6 pt-12 pb-24 text-text-main lg:px-12 lg:pt-16">
      <div className="container-premium mx-auto max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-16 md:mb-20"
        >
          <PageHeader
            eyebrow={t('gallery.badge', 'Galerie')}
            title={t('nav.gallery', 'Galerie')}
            subtitle={t('gallery.subtitle', 'Eine visuelle Reise durch unsere Haine in Dougga und das Handwerk von Mondas ÖL.')}
            align="center"
          />
        </motion.div>

        {!loading && (
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`label-caps border px-4 py-2 transition-colors ${
                  (cat === 'all' ? !activeCategory : activeCategory === cat)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border-subtle text-text-muted hover:border-primary hover:text-text-main'
                }`}
              >
                {t('gallery.categories.' + cat, cat)}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-12 gap-0 overflow-hidden border border-border-subtle lg:grid-rows-[200px_200px_200px]">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="col-span-12 h-[180px] animate-pulse bg-bg-card lg:col-span-4"
              />
            ))}
          </div>
        ) : images.length === 0 ? (
          <p className="py-20 text-center text-text-muted">{t('gallery.empty', 'No images in this category yet.')}</p>
        ) : (
          <>
            <GalleryBentoGrid
              images={images}
              lang={currentLang}
              onSelect={setSelectedImage}
            />
            {hasMore && (
              <motion.div variants={fadeInUp} className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 border border-border-subtle px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all disabled:opacity-50"
                >
                  {loadingMore ? (
                    <><Loader2 size={14} className="animate-spin" /> {t('gallery.loading_more', 'Lädt…')}</>
                  ) : (
                    t('gallery.load_more', 'Mehr zeigen')
                  )}
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-page/95 p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-6 top-6 z-[110] text-text-main md:right-10 md:top-10"
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
            >
              <X size={36} strokeWidth={1.25} />
            </motion.button>
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="relative h-[80vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt=""
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
