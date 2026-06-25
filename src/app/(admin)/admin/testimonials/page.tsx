'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, Trash2, User, Quote, Search } from 'lucide-react';
import { toast } from 'sonner';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useTestimonials } from '@/lib/hooks/useTestimonials';
import { deleteTestimonial } from '@/lib/api/testimonials';
import { cn } from '@/lib/utils';

export default function TestimonialManagement() {
  const { testimonials, loading } = useTestimonials();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = testimonials.filter(
    (t) => t.userName.toLowerCase().includes(search.toLowerCase()) ||
            t.text.toLowerCase().includes(search.toLowerCase()),
  );

  const avgRating = testimonials.length
    ? (testimonials.reduce((a, t) => a + t.rating, 0) / testimonials.length).toFixed(1)
    : '—';

  const handleDelete = async (id: string, name: string) => {
    if (!confirm('Delete review from ' + name + '?')) return;
    setDeletingId(id);
    try {
      await deleteTestimonial(id);
      toast.success('Review deleted');
      window.location.reload();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-bg-page pt-32 pb-24 px-6 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="initial" animate="animate" variants={staggerContainer}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <motion.div variants={fadeInUp}>
            <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-2 block">Social Proof</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Review <span className="text-primary italic font-serif font-normal">Moderation</span>
            </h1>
          </motion.div>
          <motion.div variants={fadeInUp} className="bg-bg-card border border-border-subtle px-6 py-3 flex items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Total</p>
              <p className="text-xl font-bold">{testimonials.length}</p>
            </div>
            <div className="w-px h-8 bg-border-subtle" />
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Avg Rating</p>
              <p className="text-xl font-bold text-amber-500">{avgRating}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Search */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate" className="mb-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or content..."
              className="w-full bg-bg-card border border-border-subtle pl-12 pr-4 py-3 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="text-text-muted text-sm text-center py-12">Loading reviews...</div>
        ) : (
          <motion.div variants={staggerContainer} initial="initial" animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {filtered.map((testimonial) => (
              <motion.div key={testimonial.id} variants={fadeInUp}
                className="bg-bg-card border border-border-subtle p-8 relative group hover:border-primary transition-all duration-300"
              >
                <Quote className="absolute top-8 right-8 text-primary/10" size={40} />
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-full text-primary border border-primary/20 font-bold text-sm">
                    {testimonial.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold uppercase tracking-widest text-sm truncate">{testimonial.userName}</h3>
                    <p className="text-[10px] text-text-muted font-bold uppercase">{testimonial.userRole}</p>
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className={cn(i < testimonial.rating ? 'text-amber-500 fill-amber-500' : 'text-text-muted')} />
                    ))}
                  </div>
                </div>
                <p className="text-text-main text-sm leading-relaxed mb-6 italic">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center justify-between pt-5 border-t border-border-subtle">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{testimonial.date}</span>
                  <button
                    onClick={() => handleDelete(testimonial.id, testimonial.userName)}
                    disabled={deletingId === testimonial.id}
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:underline disabled:opacity-50 transition-opacity"
                  >
                    <Trash2 size={13} />
                    {deletingId === testimonial.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

