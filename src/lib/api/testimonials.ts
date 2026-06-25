import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api/http';
import { API_ROUTES } from '@/lib/api/routes';
import type { Testimonial, PaginatedResult } from '@/lib/types/common';

export const fetchTestimonials = (page = 1, limit = 20) =>
  apiGet<PaginatedResult<Testimonial>>(API_ROUTES.testimonials + '?page=' + page + '&limit=' + limit);

// userId is NOT sent — backend reads it from the JWT cookie
export const submitTestimonial = (payload: { text: string; rating: number }) =>
  apiPost<Testimonial>(API_ROUTES.testimonials, payload);

export const updateTestimonial = (id: string, payload: { text?: string; rating?: number }) =>
  apiPatch<Testimonial>(API_ROUTES.testimonial(id), payload);

export const deleteTestimonial = (id: string) =>
  apiDelete<{ ok: boolean }>(API_ROUTES.testimonial(id));
