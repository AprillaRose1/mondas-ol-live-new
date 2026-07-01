'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { HomeSplitSection } from '@/components/home/home-split-section';
import { AccentTitle } from '@/components/ui/typography';

export function HomeAncientTree() {
  const { t } = useTranslation();

  return (
    <HomeSplitSection
      imageSrc="/olive_tree.png"
      imageAlt={t('home.ancient_tree.image_alt')}
      imagePosition="right"
    >
      <p className="eyebrow">{t('home.ancient_tree.eyebrow')}</p>
      <AccentTitle i18nKey="home.ancient_tree.title" as="h2" className="mb-5" />
      <p className="body-lg mb-4 text-text-secondary">{t('home.ancient_tree.body1')}</p>
      <p className="body-lg mb-4 text-text-secondary">{t('home.ancient_tree.body2')}</p>
      <Link href="/story" className="link-caps">
        {t('home.ancient_tree.cta')} <ChevronRight size={16} />
      </Link>
    </HomeSplitSection>
  );
}
