'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, storyRevealFromLeft, storyRevealFromRight, storyRevealFromLeftDelayed, storyRevealFromRightDelayed, zoomIn, scrollViewport } from '@/lib/animations';
import { AppImage } from '@/components/ui/app-image';
import { HeroCarousel } from '@/components/ui/hero-carousel';
import { STORY_HERO_IMAGES } from '@/lib/hero-images';
import { HEADER_OFFSET_CLASS } from '@/lib/layout';
import { cn } from '@/lib/utils';

const STORY_IMAGE_SIZES = '(min-width: 1024px) 50vw, 100vw';

type StorySplitSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right';
};

function StorySplitSection({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  imagePosition = 'right',
}: StorySplitSectionProps) {
  const imageOnRight = imagePosition === 'right';

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2">
      <motion.div
        variants={imageOnRight ? storyRevealFromLeft : storyRevealFromRight}
        className={cn(
          'order-1 flex min-h-[50vh] flex-col justify-center px-6 py-16 lg:min-h-screen lg:px-14 lg:py-24 xl:px-20',
          imageOnRight ? 'lg:order-1' : 'lg:order-2',
        )}
       initial="hidden" whileInView="visible" viewport={scrollViewport}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title mt-4">{title}</h2>
        <p className="body-lg mt-6 max-w-xl">{description}</p>
      </motion.div>

      <motion.div
        variants={imageOnRight ? storyRevealFromRightDelayed : storyRevealFromLeftDelayed}
        className={cn(
          'order-2 group relative min-h-[50vh] overflow-hidden lg:min-h-screen',
          imageOnRight ? 'lg:order-2' : 'lg:order-1',
        )}
       initial="hidden" whileInView="visible" viewport={scrollViewport}>
        <AppImage
          src={imageSrc}
          alt={imageAlt}
          objectFit="contain"
          sizes={STORY_IMAGE_SIZES}
          containerClassName="absolute inset-0 bg-bg-page"
        />
      </motion.div>
    </section>
  );
}

const Story = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen overflow-x-hidden bg-bg-page selection:bg-primary/20">
      <section className="relative isolate flex min-h-svh w-full items-center justify-center overflow-hidden">
        <HeroCarousel images={STORY_HERO_IMAGES} alt={t('story.history.image_alt')} />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-bg-page from-15% via-transparent to-transparent" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className={cn(
            'pointer-events-none relative z-10 mx-auto w-full max-w-5xl px-6 text-center',
            HEADER_OFFSET_CLASS,
          )}
        >
          <motion.p variants={fadeInUp} className="eyebrow justify-center">
            {t('story.badge')}
          </motion.p>
          <motion.h1 variants={fadeInUp} className="page-title mt-4 text-text-main">
            {t('story.title')}
          </motion.h1>
          <motion.p variants={fadeInUp} className="page-subtitle mx-auto mt-6">
            {t('story.subtitle')}
          </motion.p>
        </motion.div>
      </section>

      <StorySplitSection
        eyebrow="since 1924"
        title={t('story.history.title')}
        description={t('story.history.description')}
        imageSrc="/story/story2.png"
        imageAlt={t('story.history.image_alt')}
        imagePosition="right"
      />

      <StorySplitSection
        eyebrow="the legacy"
        title={t('story.heritage.title')}
        description={t('story.heritage.description')}
        imageSrc="/story/story3.png"
        imageAlt={t('story.heritage.image_alt')}
        imagePosition="left"
      />

      <StorySplitSection
        eyebrow="handcrafted"
        title={t('story.process.title')}
        description={t('story.process.description')}
        imageSrc="/story/story4.png"
        imageAlt={t('story.process.image_alt')}
        imagePosition="right"
      />

      <section className="section-y-lg space-y-16 overflow-x-hidden">
        <motion.div variants={staggerContainer} className="page-header page-header--center container-premium" initial="hidden" whileInView="visible" viewport={scrollViewport}>
          <motion.h2 variants={fadeInUp} className="section-title">
            {t('story.terroir.title')}
          </motion.h2>
          <motion.p variants={fadeInUp} className="page-subtitle mt-6">
            {t('story.terroir.description')}
          </motion.p>
        </motion.div>

        <motion.div
          variants={zoomIn}
          className="group relative mx-auto w-full max-w-6xl overflow-hidden border border-border-subtle bg-bg-page shadow-2xl"
         initial="hidden" whileInView="visible" viewport={scrollViewport}>
          <div className="relative h-[min(55vh,520px)] w-full md:h-[min(72vh,760px)]">
            <AppImage
              src="/story/story6.jpg"
              alt={t('story.terroir.image_alt')}
              objectFit="cover"
              sizes="(max-width: 1152px) 100vw, 1152px"
              containerClassName="absolute inset-0 h-full w-full"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-black/15 transition-colors duration-500 group-hover:bg-black/5" />
          {/* <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden px-4">
            <span className="max-w-full truncate font-serif text-[clamp(1.75rem,8vw,5rem)] font-medium uppercase tracking-tight text-white/10">
              GOLD OF DOUGGA
            </span>
          </div> */}
        </motion.div>
      </section>

      <section className="section-y-lg relative overflow-hidden bg-primary">
        <div className="container-premium relative z-10 text-center">
          <h2 className="section-title text-[var(--btn-text)]">{t('home.contact_cta.title')}</h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-6 md:flex-row md:gap-8">
            <Link href="/shop" className="btn-mondas bg-bg-page text-primary hover:brightness-100">
              {t('hero.cta')}
            </Link>
            <Link href="/contact" className="link-caps border-b border-[var(--btn-text)] pb-1 text-[var(--btn-text)]">
              {t('home.contact_cta.button')}
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <span className="absolute top-1/2 left-1/2 w-full max-w-full -translate-x-1/2 -translate-y-1/2 select-none text-center font-serif text-[clamp(2.5rem,22vw,14rem)] font-medium uppercase leading-none text-black/5">
            MONDAS
          </span>
        </div>
      </section>
    </div>
  );
};

export default Story;
