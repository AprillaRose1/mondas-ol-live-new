import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api/http';
import { API_BASE } from '@/lib/api/routes';
import type { PaginatedResult } from '@/lib/types/common';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  rating: number;
  text: string;
  likes: number;
  status: ReviewStatus;
  verifiedPurchase: boolean;
  moderatedById: string | null;
  moderatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResult {
  reviews: Review[];
  count: number;
  averageRating: number;
  /** The caller's own review in any state (null when unauthenticated / none). */
  myReview: Review | null;
}

// ── Public / storefront ──────────────────────────────────────────────────────

export const fetchReviews = (productId: string) =>
  apiGet<ReviewsResult>(API_BASE + '/api/products/' + productId + '/reviews');

export const createReview = (
  productId: string,
  payload: { rating: number; text: string },
) =>
  apiPost<Review>(
    API_BASE + '/api/products/' + productId + '/reviews',
    payload,
  );

export const likeReview = (productId: string, reviewId: string) =>
  apiPatch<Review>(
    API_BASE + '/api/products/' + productId + '/reviews/' + reviewId + '/like',
    {},
  );

export const deleteReview = (productId: string, reviewId: string) =>
  apiDelete<{ ok: boolean }>(
    API_BASE + '/api/products/' + productId + '/reviews/' + reviewId,
  );

// ── Admin moderation ─────────────────────────────────────────────────────────

export const fetchReviewQueue = (status: ReviewStatus = 'pending', page = 1) =>
  apiGet<PaginatedResult<Review>>(
    API_BASE + '/api/reviews?status=' + status + '&page=' + page,
  );

export const approveReview = (reviewId: string) =>
  apiPatch<Review>(API_BASE + '/api/reviews/' + reviewId + '/approve', {});

export const rejectReview = (reviewId: string) =>
  apiPatch<Review>(API_BASE + '/api/reviews/' + reviewId + '/reject', {});
