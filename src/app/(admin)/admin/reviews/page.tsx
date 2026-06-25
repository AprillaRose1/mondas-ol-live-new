'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Check, X, BadgeCheck, MessageSquareText } from 'lucide-react';
import { toast } from 'sonner';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import {
  fetchReviewQueue,
  approveReview,
  rejectReview,
  type Review,
  type ReviewStatus,
} from '@/lib/api/reviews';
import { ApiError } from '@/lib/api/http';
import { AppImage } from '@/components/ui/app-image';
import { cn } from '@/lib/utils';

const TABS: { key: ReviewStatus; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

export default function ReviewModeration() {
  const [status, setStatus] = useState<ReviewStatus>('pending');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchReviewQueue(status)
      .then((r) => { setReviews(r.data); setTotal(r.total); })
      .catch(() => toast.error('Failed to load reviews'))
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(() => { load(); }, [load]);

  const act = async (
    id: string,
    fn: (id: string) => Promise<Review>,
    okMsg: string,
  ) => {
    setActionId(id);
    try {
      await fn(id);
      toast.success(okMsg);
      // Drop the row locally — it has left the current filter
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setTotal((t) => Math.max(0, t - 1));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Action failed');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-bg-page pt-32 pb-24 px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <motion.div initial="initial" animate="animate" variants={staggerContainer} className="mb-10">
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold tracking-tighter mb-2 flex items-center gap-3">
            <MessageSquareText className="text-primary" size={36} />
            Review <span className="text-primary italic font-serif font-normal">Moderation</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-text-muted">
            Approve or reject customer reviews. Only approved reviews appear on the storefront and count toward product ratings.
          </motion.p>
        </motion.div>

        {/* Status tabs */}
        <div className="mb-8 inline-flex border border-border-subtle bg-bg-card p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatus(tab.key)}
              className={cn(
                'px-5 py-2 text-[10px] font-bold uppercase tracking-widest transition-all',
                status === tab.key ? 'bg-primary text-primary-foreground' : 'text-text-muted hover:text-text-main',
              )}
            >
              {tab.label}
              {status === tab.key && ` (${total})`}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="text-text-muted text-sm py-10">Loading…</div>
        ) : reviews.length === 0 ? (
          <div className="bg-bg-card border border-border-subtle p-12 text-center text-text-muted text-sm">
            No {status} reviews.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-card border border-border-subtle p-5 flex items-start gap-4"
              >
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center text-primary font-bold uppercase shrink-0">
                  {r.userAvatar ? (
                    <AppImage src={r.userAvatar} alt={r.userName} sizes="44px" className="object-cover" />
                  ) : (
                    r.userName.charAt(0)
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm">{r.userName}</p>
                    {r.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-emerald-500">
                        <BadgeCheck size={12} /> Verified purchase
                      </span>
                    )}
                    <span className="text-[10px] text-text-muted">· {new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} className={cn(s <= r.rating ? 'text-primary fill-primary' : 'text-border-subtle')} />
                    ))}
                  </div>
                  <p className="text-sm text-text-main mt-2 leading-relaxed">{r.text}</p>
                  <p className="text-[10px] text-text-muted font-mono mt-2">product: {r.productId}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  {status !== 'approved' && (
                    <button
                      onClick={() => act(r.id, approveReview, 'Review approved')}
                      disabled={actionId === r.id}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20 transition disabled:opacity-40"
                    >
                      <Check size={14} /> Approve
                    </button>
                  )}
                  {status !== 'rejected' && (
                    <button
                      onClick={() => act(r.id, rejectReview, 'Review rejected')}
                      disabled={actionId === r.id}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest bg-rose-500/10 text-rose-500 border border-rose-500/30 hover:bg-rose-500/20 transition disabled:opacity-40"
                    >
                      <X size={14} /> Reject
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
