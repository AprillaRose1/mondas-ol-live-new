'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Clock, User as UserIcon, ArrowRight } from 'lucide-react';
import { fadeInUp, staggerContainer, scrollViewport } from '@/lib/animations';
import { AppImage } from '@/components/ui/app-image';
import { PageHeader } from '@/components/ui/typography';

interface Recipe {
  id: string;
  title: string;
  category: string;
  filterKey: 'technique' | 'knowledge' | 'pairing';
  image: string;
  date: string;
  author: string;
  readTime: string;
  excerpt: string;
}

const RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Die perfekte Vinaigrette mit Mondas OL',
    category: 'Technik',
    filterKey: 'technique',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=1200',
    date: '12. Mai 2026',
    author: 'Elena K.',
    readTime: '6 min',
    excerpt: 'Das richtige Verhältnis von Säure zu Öl entscheidet alles — so gelingt die Emulsion jedes Mal.',
  },
  {
    id: '2',
    title: 'Gebackener Feta mit Kräuteröl aus Dougga',
    category: 'Rezept',
    filterKey: 'pairing',
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&q=80&w=1200',
    date: '08. Mai 2026',
    author: 'Chef Marco',
    readTime: '25 min',
    excerpt: 'Cremiger Feta, knusprige Kruste und ein Finish aus unserem infundierten Kräuteröl.',
  },
  {
    id: '3',
    title: 'Warum der Erntezeitpunkt den Geschmack prägt',
    category: 'Wissen',
    filterKey: 'knowledge',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
    date: '01. Mai 2026',
    author: 'Mondas OL',
    readTime: '8 min',
    excerpt: 'Früh geerntete Oliven liefern mehr Polyphenole — und einen unverkennbar grünen Charakter.',
  },
  {
    id: '4',
    title: 'Olivenöl-Tasting: Aromen richtig erkennen',
    category: 'Technik',
    filterKey: 'technique',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=1200',
    date: '24. Apr 2026',
    author: 'Elena K.',
    readTime: '5 min',
    excerpt: 'Schlürfen, riechen, schmecken — eine kleine Sensorik-Anleitung für zu Hause.',
  },
];

const FILTERS = [
  { key: 'all', filterKey: null },
  { key: 'technique', filterKey: 'technique' },
  { key: 'knowledge', filterKey: 'knowledge' },
  { key: 'pairing', filterKey: 'pairing' },
] as const;

export default function RecipesPage() {
  const { t } = useTranslation();
  const [active, setActive] = React.useState<'all' | Recipe['filterKey']>('all');

  const filtered = active === 'all' ? RECIPES : RECIPES.filter((r) => r.filterKey === active);
  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen bg-bg-page px-6 pb-24 text-text-main lg:px-12">
      <div className="container-premium mx-auto max-w-7xl pt-4">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-12 md:mb-16">
          <PageHeader
            eyebrow={t('recipes.badge')}
            title={t('nav.recipes')}
            subtitle={t('recipes.subtitle')}
            align="center"
          />
        </motion.div>

        {/* Filters (top, functional) */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {FILTERS.map(({ key, filterKey }) => {
            const isActive = active === (filterKey ?? 'all');
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActive(filterKey ?? 'all')}
                className={`label-caps border px-5 py-2 transition-colors ${
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border-subtle text-text-muted hover:border-primary hover:text-text-main'
                }`}
              >
                {t('recipes.filters.' + key)}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="py-20 text-center text-text-muted">{t('recipes.empty', 'No articles in this category yet.')}</p>
        )}

        {/* Featured hero */}
        {featured && (
          <motion.article
            key={featured.id}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="group mb-16 grid cursor-pointer gap-8 md:grid-cols-2 md:items-center"
          >
            <div className="relative aspect-[16/11] overflow-hidden border border-border-subtle">
              <AppImage
                src={featured.image}
                alt={featured.title}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="transition-transform duration-[1.1s] ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute left-4 top-4">
                <span className="label-caps border border-border-subtle bg-bg-card px-3 py-1 text-text-main">{featured.category}</span>
              </div>
            </div>
            <div className="space-y-5">
              <div className="label-caps flex flex-wrap items-center gap-4 text-text-muted">
                <span className="flex items-center gap-1"><Clock size={12} /> {featured.date}</span>
                <span className="flex items-center gap-1"><UserIcon size={12} /> {featured.author}</span>
                <span>{featured.readTime}</span>
              </div>
              <h2 className="section-title text-3xl transition-colors group-hover:text-primary md:text-4xl">{featured.title}</h2>
              <p className="max-w-prose leading-relaxed text-text-muted">{featured.excerpt}</p>
              <Link href={`/recipes/${featured.id}`} className="link-caps inline-flex border-b border-primary/20 pb-1 group-hover:border-primary">
                {t('common.read_more')} <ArrowRight size={14} />
              </Link>
            </div>
          </motion.article>
        )}

        {/* Rest grid */}
        <motion.div variants={staggerContainer} className="grid gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-3" initial="hidden" whileInView="visible" viewport={scrollViewport}>
          {rest.map((recipe) => (
            <motion.article key={recipe.id} variants={fadeInUp} className="group cursor-pointer">
              <div className="relative mb-6 aspect-[16/10] overflow-hidden border border-border-subtle">
                <AppImage
                  src={recipe.image}
                  alt={recipe.title}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="transition-transform duration-[1.1s] ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute left-4 top-4">
                  <span className="label-caps border border-border-subtle bg-bg-card px-3 py-1 text-text-main">
                    {recipe.category}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="label-caps flex items-center gap-4 text-text-muted">
                  <span className="flex items-center gap-1"><Clock size={12} /> {recipe.date}</span>
                  <span className="flex items-center gap-1"><UserIcon size={12} /> {recipe.author}</span>
                </div>
                <h3 className="section-title text-xl transition-colors group-hover:text-primary">{recipe.title}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{recipe.excerpt}</p>
                <Link
                  href={`/recipes/${recipe.id}`}
                  className="link-caps inline-flex border-b border-primary/20 pb-1 group-hover:border-primary"
                >
                  {t('common.read_more')} <ArrowRight size={14} />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
