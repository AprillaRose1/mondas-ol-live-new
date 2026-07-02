import type { PaginatedResult } from '@/lib/types/common';
import fallback from '@/data/reviews-fallback.json';
import { mockDelay, mockId, paginate } from '@/lib/api/_mock';

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
  myReview: Review | null;
}

interface FallbackReview {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  text: string;
  rating: number;
  date: string;
}

const FALLBACK = fallback as FallbackReview[];

const toReview = (r: FallbackReview, productId: string): Review => ({
  id: r.id,
  productId,
  userId: r.userId,
  userName: r.userName,
  userAvatar: null,
  rating: r.rating,
  text: r.text,
  likes: 0,
  status: 'approved',
  verifiedPurchase: true,
  moderatedById: null,
  moderatedAt: null,
  createdAt: r.date,
  updatedAt: r.date,
});

export const fetchReviews = (productId: string): Promise<ReviewsResult> => {
  const reviews = FALLBACK.map((r) => toReview(r, productId));
  const averageRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;
  return mockDelay({ reviews, count: reviews.length, averageRating, myReview: null });
};

export const createReview = (
  productId: string,
  payload: { rating: number; text: string },
): Promise<Review> =>
  mockDelay(
    toReview(
      {
        id: mockId(),
        userId: 'me',
        userName: 'You',
        userRole: 'Verified Customer',
        text: payload.text,
        rating: payload.rating,
        date: new Date().toISOString(),
      },
      productId,
    ),
  );

export const likeReview = (productId: string, reviewId: string): Promise<Review> =>
  mockDelay({ ...toReview(FALLBACK[0], productId), id: reviewId, likes: 1 });

export const deleteReview = (
  _productId: string,
  _reviewId: string,
): Promise<{ ok: boolean }> => mockDelay({ ok: true });

export const fetchReviewQueue = (
  _status: ReviewStatus = 'pending',
  page = 1,
): Promise<PaginatedResult<Review>> => mockDelay(paginate([] as Review[], page, 20));

export const approveReview = (reviewId: string): Promise<Review> =>
  mockDelay({ ...toReview(FALLBACK[0], 'p1'), id: reviewId, status: 'approved' });

export const rejectReview = (reviewId: string): Promise<Review> =>
  mockDelay({ ...toReview(FALLBACK[0], 'p1'), id: reviewId, status: 'rejected' });
