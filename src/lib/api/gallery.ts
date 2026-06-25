import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api/http';
import { API_ROUTES } from '@/lib/api/routes';
import type { GalleryImage } from '@/data/gallery';
import type { PaginatedResult } from '@/lib/types/common';

export type { GalleryImage } from '@/data/gallery';

const buildGalleryUrl = (page?: number, limit?: number, category?: string) => {
  const params = new URLSearchParams();
  if (page) params.set('page', String(page));
  if (limit) params.set('limit', String(limit));
  if (category) params.set('category', category);
  const qs = params.toString();
  return API_ROUTES.galleryItem + (qs ? '?' + qs : '');
};

export const fetchGallery = (page?: number, limit?: number, category?: string) =>
  apiGet<PaginatedResult<GalleryImage>>(buildGalleryUrl(page, limit, category));

export const createGalleryItem = (data: {
  url: string;
  title: { de: string; en: string; fr: string; ar: string };
  category: string;
}) => apiPost<GalleryImage>(API_ROUTES.galleryItem, data);

export const updateGalleryItem = (
  id: string,
  data: Partial<{
    url: string;
    title: { de: string; en: string; fr: string; ar: string };
    category: string;
  }>,
) => apiPatch<GalleryImage>(API_ROUTES.galleryItemById(id), data);

export const deleteGalleryItem = (id: string) =>
  apiDelete<{ ok: boolean }>(API_ROUTES.galleryItemById(id));
