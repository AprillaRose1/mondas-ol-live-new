import { useState, useEffect, useCallback } from 'react';
import { GalleryImage, fetchGallery } from '../api/gallery';

const PAGE_SIZE = 10;

export const useGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string | undefined>();

  const load = useCallback(async (pageNum: number, append: boolean, category?: string) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    try {
      const result = await fetchGallery(pageNum, PAGE_SIZE, category);
      if (append) {
        setImages((prev) => [...prev, ...result.data]);
      } else {
        setImages(result.data);
      }
      setTotalPages(result.totalPages);
      setPage(pageNum);
    } catch {
      setError('Failed to fetch gallery images');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    load(1, false, activeCategory);
  }, [activeCategory, load]);

  const loadMore = useCallback(() => {
    if (page < totalPages && !loadingMore) {
      load(page + 1, true, activeCategory);
    }
  }, [page, totalPages, loadingMore, load, activeCategory]);

  const setCategory = useCallback((cat: string) => {
    setActiveCategory(cat === 'all' ? undefined : cat);
  }, []);

  const hasMore = page < totalPages;

  return { images, loading, loadingMore, error, hasMore, loadMore, activeCategory, setCategory };
};
