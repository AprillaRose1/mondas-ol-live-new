'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { HomeSplitSection } from '@/components/home/home-split-section';
import { AccentTitle } from '@/components/ui/typography';

export function HomeTraditionSplit() {
  const { t } = useTranslation();

  return (
    <HomeSplitSection
      className="mt-12 pt-10 md:mt-20 md:pt-14"
      imageSrc="/hero/hero3.png"
      imageAlt={t('home.tradition.image_alt')}
      imagePosition="left"
    >
      <p className="eyebrow">{t('home.tradition.eyebrow')}</p>
      <AccentTitle i18nKey="home.tradition.title" as="h2" className="mb-5" />
      <p className="body-lg mb-4 text-text-secondary">{t('home.tradition.body1')}</p>
      <p className="body-lg mb-6">{t('home.tradition.body2')}</p>
      <Link href="/story" className="link-caps">
        {t('story.more')} <ChevronRight size={16} />
      </Link>
    </HomeSplitSection>
  );
}
