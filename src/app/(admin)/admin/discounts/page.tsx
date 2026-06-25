'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Plus, Trash2, Power, PowerOff } from 'lucide-react';
import { toast } from 'sonner';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useDiscounts } from '@/lib/hooks/useDiscounts';
import { createDiscount, toggleDiscount, deleteDiscount, type CreateDiscountInput } from '@/lib/api/discounts';
import { ApiError } from '@/lib/api/http';
import { cn } from '@/lib/utils';

const EMPTY_FORM: CreateDiscountInput = {
  code: '',
  type: 'percentage',
  value: 10,
  minOrderAmount: 0,
  maxUses: null,
  active: true,
};

export default function DiscountsAdmin() {
  const { discounts, loading, refetch } = useDiscounts();
  const [form, setForm] = useState<CreateDiscountInput>(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) { toast.error('Code is required'); return; }
    if (form.value <= 0) { toast.error('Value must be greater than 0'); return; }
    setCreating(true);
    try {
      await createDiscount({ ...form, code: form.code.toUpperCase().trim() });
      toast.success('Coupon created');
      setForm(EMPTY_FORM);
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to create coupon');
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (id: string) => {
    setActionId(id);
    try {
      await toggleDiscount(id);
      refetch();
    } catch {
      toast.error('Failed to toggle coupon');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm('Delete coupon ' + code + '?')) return;
    setActionId(id);
    try {
      await deleteDiscount(id);
      toast.success('Coupon deleted');
      refetch();
    } catch {
      toast.error('Failed to delete coupon');
    } finally {
      setActionId(null);
    }
  };

  const inputCls = 'bg-bg-page border border-border-subtle px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none w-full';

  return (
    <div className="min-h-screen bg-bg-page pt-32 pb-24 px-6 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="initial" animate="animate" variants={staggerContainer} className="mb-12">
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold tracking-tighter mb-2 flex items-center gap-3">
            <Ticket className="text-primary" size={36} />
            Discount <span className="text-primary italic font-serif font-normal">Codes</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-text-muted">Create and manage coupon codes customers can apply at checkout.</motion.p>
        </motion.div>

        {/* Create form */}
        <motion.form
          variants={fadeInUp} initial="initial" animate="animate"
          onSubmit={handleCreate}
          className="bg-bg-card border border-border-subtle p-6 mb-10 grid grid-cols-1 md:grid-cols-6 gap-4 items-end"
        >
          <div className="md:col-span-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-text-muted block mb-1">Code</label>
            <input className={inputCls} value={form.code} placeholder="SUMMER10"
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-text-muted block mb-1">Type</label>
            <select className={inputCls} value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as CreateDiscountInput['type'] })}>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed (€)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-text-muted block mb-1">Value</label>
            <input type="number" min={0} className={inputCls} value={form.value}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-text-muted block mb-1">Min order (€)</label>
            <input type="number" min={0} className={inputCls} value={form.minOrderAmount ?? 0}
              onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })} />
          </div>
          <button type="submit" disabled={creating}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition disabled:opacity-50">
            <Plus size={16} />{creating ? 'Saving…' : 'Add'}
          </button>
        </motion.form>

        {/* Table */}
        <div className="bg-bg-card border border-border-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[760px]">
              <thead>
                <tr className="bg-bg-page border-b border-border-subtle text-[10px] uppercase font-bold tracking-[0.2em] text-text-muted">
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Min order</th>
                  <th className="px-6 py-4">Usage</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {loading && (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-text-muted text-sm">Loading…</td></tr>
                )}
                {!loading && discounts.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-text-muted text-sm">No coupon codes yet.</td></tr>
                )}
                {discounts.map((d) => (
                  <tr key={d.id} className="hover:bg-primary/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-primary">{d.code}</td>
                    <td className="px-6 py-4 text-sm font-bold">
                      {d.type === 'percentage' ? `${d.value}%` : `€${d.value}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">{d.minOrderAmount > 0 ? `€${d.minOrderAmount}` : '—'}</td>
                    <td className="px-6 py-4 text-sm text-text-muted">{d.usedCount}{d.maxUses !== null ? ` / ${d.maxUses}` : ''}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'text-[9px] uppercase font-bold tracking-widest px-3 py-1 border rounded-full',
                        d.active ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 'border-text-muted/30 text-text-muted bg-text-muted/5',
                      )}>
                        {d.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleToggle(d.id)} disabled={actionId === d.id}
                          title={d.active ? 'Deactivate' : 'Activate'}
                          className="p-2 text-text-muted hover:text-primary transition-colors disabled:opacity-40">
                          {d.active ? <PowerOff size={16} /> : <Power size={16} />}
                        </button>
                        <button onClick={() => handleDelete(d.id, d.code)} disabled={actionId === d.id}
                          title="Delete"
                          className="p-2 text-text-muted hover:text-rose-500 transition-colors disabled:opacity-40">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
