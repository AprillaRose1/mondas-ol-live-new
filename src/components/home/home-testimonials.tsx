'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TestimonialSkeleton } from '@/components/ui/Skeleton';
import { useTestimonials } from '@/lib/hooks/useTestimonials';
import { fadeInUp, scrollViewport } from '@/lib/animations';
import { cn } from '@/lib/utils';

export function HomeTestimonials() {
  const { t } = useTranslation();
  const { testimonials, loading } = useTestimonials();
  const [currentSlide, setCurrentSlide] = useState(0);

  const perView = typeof window !== 'undefined' && window.innerWidth >= 768 ? 3 : 1;
  const slideCount = Math.max(1, Math.ceil(testimonials.length / perView));

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slideCount);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);

  return (
    <section className="section-y-lg overflow-hidden bg-bg-page">
      <div className="container-premium">
        <motion.div variants={fadeInUp} className="mb-14 text-center" initial="hidden" whileInView="visible" viewport={scrollViewport}>
          <p className="eyebrow justify-center">{t('home.testimonials.badge')}</p>
          <h2 className="section-title">{t('home.testimonials.title')}</h2>
        </motion.div>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <TestimonialSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden px-1">
              <motion.div
                className="flex gap-8"
                animate={{ x: `calc(-${currentSlide * 100}% - ${currentSlide * 2}rem)` }}
                transition={{ type: 'spring', damping: 28, stiffness: 120, duration: 0.6 }}
              >
                {testimonials.map((item) => (
                  <article
                    key={item.id}
                    className="card-premium group relative min-w-full space-y-6 p-8 md:min-w-[calc(33.333%-1.33rem)]"
                  >
                    <div className="absolute left-0 top-0 h-0 w-px bg-primary transition-all duration-[1.4s] group-hover:h-full" />
                    <Quote className="absolute right-6 top-6 h-14 w-14 -rotate-12 text-primary/10" />
                    <div className="flex gap-1 text-primary">
                      {[...Array(item.rating)].map((_, j) => (
                        <Star key={j} size={12} fill="currentColor" />
                      ))}
                    </div>
                    <p className="relative z-10 font-serif text-lg italic leading-relaxed text-text-main">
                      &ldquo;{item.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-4 border-t border-border-subtle pt-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-card font-serif text-lg text-primary">
                        {item.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium tracking-wide text-text-main">{item.userName}</p>
                        <p className="label-caps mt-0.5">{item.userRole}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </motion.div>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevSlide}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border-subtle bg-bg-card/60 transition-colors hover:border-primary hover:text-primary"
                aria-label="Previous"
              >
                <ChevronLeft size={22} strokeWidth={1.2} />
              </motion.button>
              <div className="flex gap-2">
                {[...Array(slideCount)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentSlide(i)}
                    className={cn(
                      'h-px transition-all duration-700',
                      currentSlide === i ? 'w-8 bg-primary' : 'w-4 bg-border-subtle',
                    )}
                  />
                ))}
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextSlide}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border-subtle bg-bg-card/60 transition-colors hover:border-primary hover:text-primary"
                aria-label="Next"
              >
                <ChevronRight size={22} strokeWidth={1.2} />
              </motion.button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
