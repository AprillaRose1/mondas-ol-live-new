import { useState, useEffect } from 'react';
import type { Testimonial } from '../types/common';
import { fetchTestimonials } from '../api/testimonials';
import fallbackReviews from '@/data/reviews-fallback.json';

// Shown when the API has no testimonials yet (or is unreachable) so the
// social-proof section is never empty.
const FALLBACK: Testimonial[] = fallbackReviews as Testimonial[];

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials()
      .then((r) => setTestimonials(r.data.length > 0 ? r.data : FALLBACK))
      .catch(() => {
        setError('Failed to fetch testimonials');
        setTestimonials(FALLBACK);
      })
      .finally(() => setLoading(false));
  }, []);

  return { testimonials, loading, error };
};
