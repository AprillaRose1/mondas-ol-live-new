'use client';

import React, { useEffect, useState } from 'react';
import { Star, ThumbsUp, Trash2, Send, BadgeCheck, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/lib/hooks/redux';
import {
  fetchReviews,
  createReview,
  likeReview,
  deleteReview,
  type Review,
  type ReviewsResult,
} from '@/lib/api/reviews';
import { ApiError } from '@/lib/api/http';
import { AppImage } from '@/components/ui/app-image';
import { ButtonLoader } from '@/components/common/Loaders';
import { reviewSchema } from '@/lib/schemas';

interface Props { productId: string }

const EMPTY: ReviewsResult = { reviews: [], count: 0, averageRating: 0, myReview: null };

// Round avatar — image when available, else the user's initial.
function Avatar({ name, src, size = 40 }: { name: string; src: string | null; size?: number }) {
  return (
    <div
      className="rounded-full overflow-hidden bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0 uppercase"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {src ? (
        <AppImage src={src} alt={name} sizes={`${size}px`} className="object-cover" />
      ) : (
        name.charAt(0)
      )}
    </div>
  );
}

function Stars({ value, size = 11 }: { value: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={cn(s <= value ? 'text-primary fill-primary' : 'text-border-subtle')}
        />
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: Props) {
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const [data, setData] = useState<ReviewsResult>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const reload = () => {
    fetchReviews(productId)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, [productId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = reviewSchema.safeParse({ rating, text });
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? 'Invalid review';
      setFieldError(msg);
      toast.error(msg);
      return;
    }
    setFieldError(null);
    setSubmitting(true);
    try {
      await createReview(productId, parsed.data);
      setText('');
      setRating(5);
      toast.success('Review submitted — it will appear once approved.');
      reload(); // brings back myReview in pending state
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (reviewId: string) => {
    try {
      await likeReview(productId, reviewId);
      reload();
    } catch {
      toast.error('Failed to like review');
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      await deleteReview(productId, reviewId);
      toast.success('Review deleted');
      reload();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete');
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';
  const myReview = data.myReview;

  return (
    <div className="space-y-10">
      {/* Summary */}
      {data.count > 0 && (
        <div className="flex items-center gap-6 p-6 bg-bg-card border border-border-subtle">
          <div className="text-center">
            <p className="text-5xl font-bold text-primary">{data.averageRating.toFixed(1)}</p>
            <div className="mt-1 flex justify-center">
              <Stars value={Math.round(data.averageRating)} size={14} />
            </div>
            <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest">
              {data.count} review{data.count !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* The caller's own pending/rejected review status */}
      {myReview && myReview.status !== 'approved' && (
        <div
          className={cn(
            'flex items-start gap-3 border p-4 text-sm',
            myReview.status === 'pending'
              ? 'border-amber-500/30 bg-amber-500/5'
              : 'border-rose-500/30 bg-rose-500/5',
          )}
        >
          <Clock size={16} className={myReview.status === 'pending' ? 'text-amber-500 mt-0.5' : 'text-rose-500 mt-0.5'} />
          <div className="flex-1">
            <p className="font-bold">
              {myReview.status === 'pending'
                ? 'Your review is awaiting approval'
                : 'Your review was not approved'}
            </p>
            <p className="text-text-muted text-xs mt-1">
              {myReview.status === 'pending'
                ? 'A moderator will review it shortly. Only you can see it here for now.'
                : 'It does not meet our review guidelines and is not shown publicly.'}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <Stars value={myReview.rating} />
              <button
                onClick={() => handleDelete(myReview.id)}
                className="text-[10px] uppercase tracking-widest text-text-muted hover:text-rose-500 transition-colors"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Write a review — only when authenticated and the user has none yet */}
      {isAuthenticated && !myReview && (
        <form onSubmit={handleSubmit} className="border border-border-subtle p-6 space-y-5 bg-bg-card/50">
          <h4 className="text-sm font-bold uppercase tracking-widest">Write a Review</h4>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                onMouseEnter={() => setHoveredStar(s)}
                onMouseLeave={() => setHoveredStar(0)}
              >
                <Star
                  size={24}
                  className={cn(
                    'transition-colors',
                    s <= (hoveredStar || rating) ? 'text-primary fill-primary' : 'text-border-subtle',
                  )}
                />
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); if (fieldError) setFieldError(null); }}
            placeholder="Share your experience (min. 10 characters)..."
            minLength={10}
            maxLength={1000}
            rows={3}
            className={cn(
              'w-full bg-bg-page border p-4 text-sm focus:ring-1 focus:ring-primary resize-none',
              fieldError ? 'border-rose-500' : 'border-border-subtle',
            )}
          />
          {fieldError && <p className="text-[11px] text-rose-500 -mt-3">{fieldError}</p>}
          <button type="submit" disabled={submitting} className="btn-mondas inline-flex items-center gap-2 disabled:opacity-50">
            {submitting ? <ButtonLoader /> : <Send size={14} />}
            Submit Review
          </button>
        </form>
      )}
      {!isAuthenticated && (
        <p className="text-[11px] text-text-muted border border-border-subtle p-4 text-center">
          <a href="/auth" className="text-primary font-bold hover:underline">Sign in</a> to write a review
        </p>
      )}

      {/* Reviews list (approved only) */}
      {loading ? (
        <div className="text-text-muted text-sm">Loading reviews...</div>
      ) : data.reviews.length === 0 ? (
        <p className="text-text-muted text-sm italic py-4">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-6">
          {data.reviews.map((review: Review) => (
            <div key={review.id} className="border-b border-border-subtle pb-6 last:border-0">
              <div className="flex items-start gap-4">
                <Avatar name={review.userName} src={review.userAvatar} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm">{review.userName}</p>
                        {review.verifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-emerald-500">
                            <BadgeCheck size={12} /> Verified
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5"><Stars value={review.rating} /></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-text-muted">{new Date(review.createdAt).toLocaleDateString()}</span>
                      {(isAdmin || review.userId === user?.id) && (
                        <button onClick={() => handleDelete(review.id)} className="p-1 text-text-muted hover:text-rose-500 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-text-main mt-2 leading-relaxed">{review.text}</p>
                  <button onClick={() => handleLike(review.id)} className="flex items-center gap-1.5 mt-3 text-[10px] text-text-muted hover:text-primary transition-colors">
                    <ThumbsUp size={12} /> {review.likes} {review.likes === 1 ? 'like' : 'likes'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
