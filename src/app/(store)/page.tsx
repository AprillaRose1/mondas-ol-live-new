'use client';

import {
  HomeHero,
  HomeIntro,
  HomeTraditionSplit,
  HomeAncientTree,
  HomeValues,
  HomeMission,
  HomeProcess,
  HomeExperiences,
  HomeProducts,
  HomeTestimonials,
  HomeStats,
  HomeSocial,
  HomeContactCta,
} from '@/components/home';

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-bg-page text-text-main">
      <HomeHero />
      <HomeIntro />
      <HomeTraditionSplit />
      <HomeAncientTree />
      <HomeValues />
      <HomeMission />
      <HomeProcess />
      <HomeExperiences />
      <HomeProducts />
      <HomeTestimonials />
      <HomeStats />
      <HomeSocial />
      <HomeContactCta />
    </div>
  );
}
