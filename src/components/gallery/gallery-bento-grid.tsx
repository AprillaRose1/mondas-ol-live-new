'use client';

import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { AppImage } from '@/components/ui/app-image';
import { scaleIn, staggerContainer, scrollViewport } from '@/lib/animations';
import type { GalleryImage } from '@/data/gallery';
import type { Language } from '@/lib/types';
import { cn } from '@/lib/utils';

/**
 * Desktop (lg): 6-tile mosaic — 7+5 / 7+5 / 4+4+4, flush (gap-0, no inner borders).
 * Mobile: 2-column stack.
 */
const DESKTOP_LAYOUT = [
  'lg:col-span-7 lg:row-span-2 lg:row-start-1 lg:col-start-1 lg:min-h-[400px]',
  'lg:col-span-5 lg:row-start-1 lg:col-start-8 lg:h-[200px]',
  'lg:col-span-5 lg:row-start-2 lg:col-start-8 lg:h-[200px]',
  'lg:col-span-4 lg:row-start-3 lg:col-start-1 lg:h-[200px]',
  'lg:col-span-4 lg:row-start-3 lg:col-start-5 lg:h-[200px]',
  'lg:col-span-4 lg:row-start-3 lg:col-start-9 lg:h-[200px]',
] as const;

const MOBILE_LAYOUT = [
  'col-span-12 h-[240px]',
  'col-span-6 h-[180px]',
  'col-span-6 h-[180px]',
  'col-span-12 h-[200px]',
  'col-span-6 h-[180px]',
  'col-span-6 h-[180px]',
] as const;

type GalleryBentoGridProps = {
  images: GalleryImage[];
  lang: Language;
  onSelect: (url: string) => void;
};

export function GalleryBentoGrid({ images, lang, onSelect }: GalleryBentoGridProps) {
  return (
    <motion.div
      variants={staggerContainer}
      className="grid grid-cols-12 gap-0 overflow-visible rounded-sm border border-border-subtle lg:grid-rows-[200px_200px_200px]"
     initial="hidden" whileInView="visible" viewport={scrollViewport}>
      {images.map((image, index) => {
        const layoutIndex = index % 6;
        return (
          <motion.button
            key={image.id}
            type="button"
            variants={scaleIn}
            onClick={() => onSelect(image.url)}
            className={cn(
              'group relative z-0 cursor-pointer bg-bg-card p-0 text-left',
              'overflow-hidden group-hover:overflow-visible',
              'transition-[z-index] duration-300 hover:z-50',
              MOBILE_LAYOUT[layoutIndex],
              DESKTOP_LAYOUT[layoutIndex],
            )}
          >
            <div className="absolute inset-0">
              <div className="absolute inset-0 origin-center transition-transform duration-[0.9s] ease-out will-change-transform group-hover:scale-[1.15] group-hover:shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
                <AppImage
                  src={image.url}
                  alt={image.title[lang]}
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="h-full w-full"
                />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex translate-y-3 items-end justify-between gap-3 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <p className="label-caps max-w-[75%] text-text-main drop-shadow-lg">{image.title[lang]}</p>
              <span className="flex size-9 shrink-0 items-center justify-center border border-white/30 bg-black/50 text-white backdrop-blur-sm">
                <Eye size={16} strokeWidth={1.25} />
              </span>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
