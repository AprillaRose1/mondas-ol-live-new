import type { Testimonial, PaginatedResult } from '@/lib/types/common';
import { MOCK_TESTIMONIALS } from '@/data/testimonials';
import { mockDelay, mockId, paginate } from '@/lib/api/_mock';

export const fetchTestimonials = (
  page = 1,
  limit = 20,
): Promise<PaginatedResult<Testimonial>> =>
  mockDelay(paginate(MOCK_TESTIMONIALS, page, limit));

export const submitTestimonial = (payload: {
  text: string;
  rating: number;
}): Promise<Testimonial> =>
  mockDelay({
    id: mockId(),
    userId: 'me',
    userName: 'You',
    userRole: 'Verified Customer',
    text: payload.text,
    rating: payload.rating,
    date: new Date().toISOString().slice(0, 10),
  });

export const updateTestimonial = (
  id: string,
  payload: { text?: string; rating?: number },
): Promise<Testimonial> => {
  const base = MOCK_TESTIMONIALS.find((t) => t.id === id) ?? MOCK_TESTIMONIALS[0];
  return mockDelay({ ...base, ...payload, id });
};

export const deleteTestimonial = (_id: string): Promise<{ ok: boolean }> =>
  mockDelay({ ok: true });
