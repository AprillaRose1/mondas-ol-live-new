'use client';

import React, { useEffect, useState } from 'react';
import { Star, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchReviews, type Review, type ReviewsResult } from '@/lib/api/reviews';
import { AppImage } from '@/components/ui/app-image';

interface Props { productId: string }

const EMPTY: ReviewsResult = { reviews: [], count: 0, averageRating: 0, myReview: null };

function Avatar({ name, src, size = 40 }: { name: string; src: string | null; size?: number }) {
  return (
    <div
      className="rounded-full overflow-hidden bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0 uppercase"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {src ? <AppImage src={src} alt={name} sizes={`${size}px`} className="object-cover" /> : name.charAt(0)}
    </div>
  );
}

function Stars({ value, size = 11 }: { value: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={size} className={cn(s <= value ? 'text-primary fill-primary' : 'text-border-subtle')} />
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: Props) {
  const [data, setData] = useState<ReviewsResult>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchReviews(productId)
      .then((r) => { if (active) setData(r); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [productId]);

  return (
    <div className="space-y-10">
      {data.count > 0 && (
        <div className="flex items-center gap-6 p-6 bg-bg-card border border-border-subtle">
          <div className="text-center">
            <p className="text-5xl font-bold text-primary">{data.averageRating.toFixed(1)}</p>
            <div className="mt-1 flex justify-center"><Stars value={Math.round(data.averageRating)} size={14} /></div>
            <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest">
              {data.count} review{data.count !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-text-muted text-sm">Loading reviews...</div>
      ) : data.reviews.length === 0 ? (
        <p className="text-text-muted text-sm italic py-4">No reviews yet.</p>
      ) : (
        <div className="space-y-6">
          {data.reviews.map((review: Review) => (
            <div key={review.id} className="border-b border-border-subtle pb-6 last:border-0">
              <div className="flex items-start gap-4">
                <Avatar name={review.userName} src={review.userAvatar} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm">{review.userName}</p>
                    {review.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-emerald-500">
                        <BadgeCheck size={12} /> Verified
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5"><Stars value={review.rating} /></div>
                  <p className="text-sm text-text-main mt-2 leading-relaxed">{review.text}</p>
                  <span className="text-[10px] text-text-muted">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
