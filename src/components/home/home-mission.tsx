'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { HomeSplitSection } from '@/components/home/home-split-section';

export function HomeMission() {
  const { t } = useTranslation();

  return (
    <HomeSplitSection
      imageSrc="/home/cult.png"
      imageAlt={t('home.mission.image_alt')}
      imagePosition="right"
    >
      <p className="eyebrow">{t('home.mission.eyebrow')}</p>
      <h2 className="section-title mb-5">{t('home.mission.title')}</h2>
      <p className="body-lg mb-6 text-text-secondary">{t('home.mission.body')}</p>
      <Link href="/story" className="link-caps">
        {t('story.more')} <ChevronRight size={16} />
      </Link>
    </HomeSplitSection>
  );
}
