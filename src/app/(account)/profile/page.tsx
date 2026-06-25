'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { logout as logoutAction, setUser } from '@/store/slices/authSlice';
import { logout as logoutApi } from '@/lib/api/auth';
import { fetchTestimonials, submitTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/api/testimonials';
import { changePassword, updateUser } from '@/lib/api/users';
import { fetchOrders } from '@/lib/api/orders';
import { ApiError } from '@/lib/api/http';
import { toReduxUser } from '@/lib/auth/credentials';
import { Package, Heart, Percent, User as UserIcon, Star, Trash2, Edit3, Save, Lock, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Testimonial } from '@/lib/types/common';
import type { Order } from '@/lib/types/user';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

type Tab = 'orders' | 'testimonial' | 'settings' | 'discounts';

const STATUS_COLORS: Record<string, string> = {
  delivered:   'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  shipped:     'text-blue-500 bg-blue-500/10 border-blue-500/20',
  processing:  'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  pending:     'text-amber-500 bg-amber-500/10 border-amber-500/20',
  cancelled:   'text-rose-500 bg-rose-500/10 border-rose-500/20',
};

export default function Profile() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const wishlistCount = useAppSelector((s) => s.wishlist.itemIds.length);

  const [tab, setTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [testimonialText, setTestimonialText] = useState('');
  const [testimonialRating, setTestimonialRating] = useState(5);
  const [isEditingTestimonial, setIsEditingTestimonial] = useState(false);
  const [savingTestimonial, setSavingTestimonial] = useState(false);

  // Settings state
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Load orders
  useEffect(() => {
    fetchOrders({ limit: 20 })
      .then((r) => setOrders(r.data))
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, []);

  // Load user's testimonial
  useEffect(() => {
    if (!user) return;
    fetchTestimonials(1, 100).then((r) => {
      const found = r.data.find((t) => t.userId === user.id);
      if (found) {
        setTestimonial(found);
        setTestimonialText(found.text);
        setTestimonialRating(found.rating);
      } else {
        setIsEditingTestimonial(true);
      }
    }).catch(() => {});
  }, [user]);

  const handleSaveTestimonial = async () => {
    if (testimonialText.length < 10) { toast.error('Minimum 10 characters.'); return; }
    setSavingTestimonial(true);
    try {
      if (testimonial) {
        const updated = await updateTestimonial(testimonial.id, { text: testimonialText, rating: testimonialRating });
        if (updated) setTestimonial(updated);
      } else {
        const created = await submitTestimonial({ text: testimonialText, rating: testimonialRating });
        setTestimonial(created);
      }
      setIsEditingTestimonial(false);
      toast.success('Review saved!');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save.');
    } finally {
      setSavingTestimonial(false);
    }
  };

  const handleDeleteTestimonial = async () => {
    if (!testimonial || !confirm('Delete your review?')) return;
    try {
      await deleteTestimonial(testimonial.id);
      setTestimonial(null);
      setTestimonialText('');
      setIsEditingTestimonial(true);
      toast.success('Review deleted.');
    } catch {
      toast.error('Failed to delete.');
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const updated = await updateUser(user.id, { name: name.trim(), email: email.trim() });
      dispatch(setUser(toReduxUser({ ...user, ...updated })));
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;
    if (newPassword !== confirmNewPassword) { toast.error("New passwords don't match"); return; }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setChangingPassword(true);
    try {
      await changePassword(user.id, currentPassword, newPassword);
      setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword('');
      toast.success('Password changed!');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to change password.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    try { await logoutApi(); } finally { dispatch(logoutAction()); }
  };

  const TABS: { id: Tab; icon: typeof Package; label: string }[] = [
    { id: 'orders', icon: Package, label: t('profile.orders', 'Orders') },
    { id: 'testimonial', icon: Star, label: 'My Review' },
    { id: 'settings', icon: UserIcon, label: t('profile.details', 'Profile') },
    { id: 'discounts', icon: Percent, label: t('profile.discounts', 'Discounts') },
  ];

  return (
    <div className="min-h-screen pt-12 pb-24 px-6 lg:px-12 bg-bg-page overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible"
          className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16"
        >
          <div className="space-y-4">
            <motion.span variants={fadeInUp} className="text-primary font-bold uppercase tracking-widest text-[10px] block">{t('auth.welcome')}</motion.span>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">{t('profile.title')}</motion.h1>
          </div>
          <motion.div variants={fadeInUp} className="flex items-center gap-4">
            {user && (user.role === 'admin' || user.role === 'moderator') && (
              <Link href="/admin/dashboard" className="text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/30 px-4 py-2 hover:bg-primary/5 transition-all">
                Dashboard
              </Link>
            )}
            <button onClick={handleLogout} className="text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-rose-500 transition-colors border-b border-transparent hover:border-rose-500 pb-1">
              {t('profile.logout')}
            </button>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-16">
          {/* Sidebar */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
            {TABS.map((item, i) => (
              <motion.button key={item.id} variants={fadeInUp}
                onClick={() => setTab(item.id)}
                className={cn('w-full flex items-center justify-between p-4 text-[10px] font-bold uppercase tracking-widest transition-all',
                  tab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-bg-card border border-border-subtle hover:bg-bg-page/50'
                )}
              >
                <div className="flex items-center gap-3"><item.icon size={16} />{item.label}</div>
                <ChevronRight size={14} />
              </motion.button>
            ))}
            <motion.div variants={fadeInUp} className="pt-4 text-center">
              <Link href="/wishlist" className="text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-primary transition-colors flex items-center justify-center gap-2">
                <Heart size={14} />
                {t('nav.wishlist')} ({wishlistCount})
              </Link>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:col-span-3 space-y-10">

            {/* ── ORDERS ── */}
            {tab === 'orders' && (
              <>
                <motion.h3 variants={fadeInUp} className="text-xl font-bold uppercase tracking-widest">{t('profile.orders')}</motion.h3>
                {ordersLoading ? (
                  <div className="text-text-muted text-sm">{t('common.loading')}</div>
                ) : orders.length === 0 ? (
                  <motion.div variants={fadeInUp} className="p-12 border border-border-subtle text-center text-text-muted">
                    <Package size={32} className="mx-auto mb-4 opacity-30" />
                    <p className="text-sm font-bold uppercase tracking-widest">No orders yet</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <motion.div key={order.id} variants={fadeInUp}
                        className="p-6 border border-border-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-primary transition-colors"
                      >
                        <div className="flex gap-8">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">{t('profile.order_id')}</p>
                            <p className="font-bold text-sm tracking-widest">{order.id}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">{t('profile.date')}</p>
                            <p className="font-bold text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Items</p>
                            <p className="font-bold text-sm">{order.items.length}</p>
                          </div>
                        </div>
                        <div className="flex gap-8 items-center">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">{t('profile.status')}</p>
                            <span className={cn('text-[9px] font-bold px-3 py-1 uppercase tracking-widest border rounded-full inline-block', STATUS_COLORS[order.status] ?? 'text-text-muted border-border-subtle')}>
                              {order.status}
                            </span>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">{t('profile.total')}</p>
                            <p className="font-bold text-sm text-primary">{order.total.toLocaleString(undefined, { style: 'currency', currency: 'EUR' })}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── TESTIMONIAL ── */}
            {tab === 'testimonial' && (
              <motion.div variants={fadeInUp} className="border border-border-subtle p-8 bg-bg-card/50">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-primary font-bold uppercase tracking-widest text-[10px]">{t('home.testimonials.badge', 'Reviews')}</span>
                    <h3 className="text-xl font-bold uppercase tracking-tighter mt-1">My Olea Story</h3>
                  </div>
                  {testimonial && !isEditingTestimonial && (
                    <div className="flex gap-2">
                      <button onClick={() => setIsEditingTestimonial(true)} className="p-2 text-text-muted hover:text-primary transition-colors"><Edit3 size={18} /></button>
                      <button onClick={handleDeleteTestimonial} className="p-2 text-text-muted hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  )}
                </div>

                {(isEditingTestimonial || !testimonial) ? (
                  <div className="space-y-5">
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map((s) => (
                        <button key={s} onClick={() => setTestimonialRating(s)} className="transition-transform hover:scale-110">
                          <Star size={24} className={cn(s <= testimonialRating ? 'text-primary' : 'text-border-subtle')} fill={s <= testimonialRating ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={testimonialText}
                      onChange={(e) => setTestimonialText(e.target.value)}
                      placeholder="Share your experience with Mondas OL..."
                      className="w-full bg-bg-page border border-border-subtle p-4 text-sm focus:ring-1 focus:ring-primary min-h-[120px] resize-none"
                      minLength={10}
                    />
                    <div className="flex gap-3">
                      <button onClick={handleSaveTestimonial} disabled={savingTestimonial}
                        className="btn-mondas inline-flex items-center gap-2 disabled:opacity-50"
                      >
                        {savingTestimonial ? <Save size={18} className="animate-pulse" /> : <Save size={18} />}
                        {t('home.testimonials.submit', 'Submit Review')}
                      </button>
                      {testimonial && (
                        <button onClick={() => setIsEditingTestimonial(false)} className="px-4 py-2 border border-border-subtle text-[10px] font-bold uppercase tracking-widest hover:border-primary transition-all">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-1 text-primary">
                      {[...Array(testimonial.rating)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                    </div>
                    <p className="text-lg italic text-text-main leading-relaxed font-serif">&ldquo;{testimonial.text}&rdquo;</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Submitted on {testimonial.date}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── SETTINGS ── */}
            {tab === 'settings' && (
              <>
                {/* Profile details */}
                <motion.div variants={fadeInUp} className="p-8 bg-bg-card border border-border-subtle space-y-6">
                  <h4 className="text-sm font-bold uppercase tracking-widest">{t('profile.details')}</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Name</label>
                      <input value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full bg-bg-page border border-border-subtle px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{t('auth.email')}</label>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"
                        className="w-full bg-bg-page border border-border-subtle px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={handleSaveProfile} disabled={savingProfile}
                      className="btn-mondas inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      {savingProfile ? <Save size={16} className="animate-pulse" /> : <Check size={16} />}
                      Save Changes
                    </button>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest">
                      {t('profile.since')}: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                    </p>
                  </div>
                </motion.div>

                {/* Change password */}
                <motion.div variants={fadeInUp} className="p-8 bg-bg-card border border-border-subtle space-y-6">
                  <div className="flex items-center gap-3">
                    <Lock size={16} className="text-primary" />
                    <h4 className="text-sm font-bold uppercase tracking-widest">Change Password</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Current Password</label>
                      <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-bg-page border border-border-subtle px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">New Password</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-bg-page border border-border-subtle px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Confirm New Password</label>
                        <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-bg-page border border-border-subtle px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <button onClick={handleChangePassword} disabled={changingPassword || !currentPassword || !newPassword}
                      className="btn-mondas inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      {changingPassword ? <Lock size={16} className="animate-pulse" /> : <Lock size={16} />}
                      Update Password
                    </button>
                  </div>
                </motion.div>
              </>
            )}

            {/* ── DISCOUNTS ── */}
            {tab === 'discounts' && (
              <motion.div variants={fadeInUp} className="bg-primary/5 border border-primary/20 p-8 flex items-center justify-between gap-8">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold uppercase tracking-tighter text-primary">{t('profile.premium_status')}</h4>
                  <p className="text-sm text-text-muted max-w-md">{t('profile.premium_desc')}</p>
                </div>
                <div className="hidden md:block shrink-0">
                  <span className="text-4xl font-bold text-primary">{t('profile.discount_value')}</span>
                </div>
              </motion.div>
            )}

          </motion.div>
        </div>
      </div>
    </div>
  );
}

