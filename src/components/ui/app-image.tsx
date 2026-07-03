'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type AppImageProps = Omit<ImageProps, 'onLoad' | 'onLoadingComplete'> & {
  containerClassName?: string;
  /** Framer Motion props applied to the wrapper (not the img). */
  wrapperMotion?: HTMLMotionProps<'div'>;
  showSpinner?: boolean;
  /** Scale image inside overflow-hidden wrapper on hover (no layout shift). */
  hoverZoom?: boolean;
  /** `contain` shows the full image (no crop); `cover` fills the frame. */
  objectFit?: 'cover' | 'contain';
};

const DEFAULT_FILL_SIZES = '(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw';

export function AppImage({
  alt,
  className,
  containerClassName,
  wrapperMotion,
  showSpinner = true,
  hoverZoom = false,
  objectFit = 'cover',
  fill = true,
  sizes,
  priority,
  quality = 100,
  src,
  unoptimized: unoptimizedProp,
  ...props
}: AppImageProps) {
  const [loaded, setLoaded] = useState(false);
  const isLocalStatic = typeof src === 'string' && src.startsWith('/');
  const unoptimized = unoptimizedProp ?? isLocalStatic;

  const spinner = showSpinner && !loaded && (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg-card/40">
      <div className="size-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
    </div>
  );

  const image = (
    <Image
      alt={alt}
      src={src}
      fill={fill}
      sizes={sizes ?? (fill ? DEFAULT_FILL_SIZES : undefined)}
      quality={quality}
      unoptimized={unoptimized}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      onLoad={() => setLoaded(true)}
      className={cn(
        objectFit === 'contain' ? 'object-contain object-center' : 'object-cover object-center',
        hoverZoom && 'transition-transform duration-700 ease-out will-change-transform group-hover:scale-110',
        className,
      )}
      {...props}
    />
  );

  if (wrapperMotion) {
    return (
      <motion.div
        className={cn(
          'relative overflow-hidden bg-bg-card/50',
          hoverZoom && 'group',
          fill && 'h-full w-full',
          containerClassName,
        )}
        {...wrapperMotion}
      >
        {spinner}
        {image}
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-bg-card/50',
        hoverZoom && 'group',
        fill && 'h-full w-full',
        containerClassName,
      )}
    >
      {spinner}
      {image}
    </div>
  );
}
