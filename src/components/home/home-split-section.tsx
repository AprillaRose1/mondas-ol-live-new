'use client';

import { motion } from 'framer-motion';
import { slideInLeft, slideInRight, slideInLeftImage, slideInRightImage, scrollViewport } from '@/lib/animations';
import { AppImage } from '@/components/ui/app-image';
import { cn } from '@/lib/utils';

type HomeSplitSectionProps = {
  imageSrc: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right';
  className?: string;
  children: React.ReactNode;
};

export function HomeSplitSection({
  imageSrc,
  imageAlt,
  imagePosition = 'left',
  className,
  children,
}: HomeSplitSectionProps) {
  const imageBlock = (
    <motion.div
      variants={imagePosition === 'left' ? slideInLeftImage : slideInRightImage}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      className="relative h-full min-h-[50vh] w-full overflow-hidden lg:min-h-[70vh]"
    >
      <AppImage
        src={imageSrc}
        alt={imageAlt}
        objectFit="cover"
        sizes="(min-width: 1024px) 50vw, 100vw"
        containerClassName="absolute inset-0 size-full bg-bg-page"
      />
    </motion.div>
  );

  const textBlock = (
    <motion.div
      variants={imagePosition === 'left' ? slideInRight : slideInLeft}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      className="flex min-h-[40vh] flex-col justify-center bg-bg-matte px-6 py-14 lg:px-14 lg:py-20"
    >
      {children}
    </motion.div>
  );

  return (
    <section className={cn('grid lg:grid-cols-2 lg:items-stretch', className)}>
      {imagePosition === 'left' ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imageBlock}
        </>
      )}
    </section>
  );
}
