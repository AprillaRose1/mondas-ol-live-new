import type { GalleryImage } from '@/data/gallery';
import { MOCK_GALLERY } from '@/data/gallery';
import type { PaginatedResult } from '@/lib/types/common';
import { mockDelay, mockId, paginate } from '@/lib/api/_mock';

export type { GalleryImage } from '@/data/gallery';

export const fetchGallery = (
  page = 1,
  limit = 20,
  category?: string,
): Promise<PaginatedResult<GalleryImage>> => {
  const all = category
    ? MOCK_GALLERY.filter((g) => g.category === category)
    : MOCK_GALLERY;
  return mockDelay(paginate(all, page, limit));
};

export const createGalleryItem = (data: {
  url: string;
  title: { de: string; en: string; fr: string; ar: string };
  category: string;
}): Promise<GalleryImage> => mockDelay({ id: mockId(), ...data });

export const updateGalleryItem = (
  id: string,
  data: Partial<{
    url: string;
    title: { de: string; en: string; fr: string; ar: string };
    category: string;
  }>,
): Promise<GalleryImage> => {
  const base = MOCK_GALLERY.find((g) => g.id === id) ?? MOCK_GALLERY[0];
  return mockDelay({ ...base, ...data, id });
};

export const deleteGalleryItem = (_id: string): Promise<{ ok: boolean }> =>
  mockDelay({ ok: true });
