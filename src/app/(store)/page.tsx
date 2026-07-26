'use client';

import {
  HomeHero,
  HomeRestaurant,
  HomeIntro,
  HomeGallery,
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
      <HomeGallery />
      <HomeRestaurant />
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
