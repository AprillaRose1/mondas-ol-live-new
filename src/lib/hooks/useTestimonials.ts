import { useState, useEffect } from 'react';
import type { Testimonial } from '../types/common';
import { fetchTestimonials } from '../api/testimonials';

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials()
      .then((r) => setTestimonials(r.data))
      .catch(() => setError('Failed to fetch testimonials'))
      .finally(() => setLoading(false));
  }, []);

  return { testimonials, loading, error };
};
