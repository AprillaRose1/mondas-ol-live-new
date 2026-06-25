'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Download, ChevronRight, Calendar, Clock, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useOrders } from '@/lib/hooks/useOrders';
import { updateOrderStatus } from '@/lib/api/orders';
import type { OrderStatus } from '@/lib/types/user';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  delivered:  'border-emerald-500/30 text-emerald-500 bg-emerald-500/5',
  shipped:    'border-blue-500/30 text-blue-500 bg-blue-500/5',
  processing: 'border-indigo-500/30 text-indigo-500 bg-indigo-500/5',
  pending:    'border-amber-500/30 text-amber-500 bg-amber-500/5',
  cancelled:  'border-rose-500/30 text-rose-500 bg-rose-500/5',
};

const ALL_STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderManagement() {
  const { orders, loading } = useOrders();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const filtered = orders.filter((o) => {
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.customerEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    setUpdatingId(id);
    try {
      await updateOrderStatus(id, newStatus);
      toast.success('Order status updated to ' + newStatus);
      window.location.reload();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-bg-page pt-32 pb-24 px-6 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="initial" animate="animate" variants={staggerContainer}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <motion.div variants={fadeInUp}>
            <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-2 block">Sales History</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Order <span className="text-primary italic font-serif font-normal">Fulfillment</span>
            </h1>
          </motion.div>
          <motion.div variants={fadeInUp} className="flex gap-4">
            <button onClick={() => toast.success('Export coming soon')} className="flex items-center gap-2 border border-border-subtle px-6 py-3 font-bold uppercase tracking-widest text-[10px] hover:border-primary transition-all">
              <Download size={14} /> Export
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 bg-text-main text-bg-page px-6 py-3 font-bold uppercase tracking-widest text-[10px] hover:bg-primary transition-all">
              <Printer size={14} /> Print
            </button>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex flex-wrap gap-4 mb-8">
          <div className="relative flex-grow min-w-[260px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID or email..."
              className="w-full bg-bg-card border border-border-subtle pl-12 pr-4 py-4 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex bg-bg-card border border-border-subtle p-1">
            {(['all', ...ALL_STATUSES] as const).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={cn('px-5 py-2.5 text-[10px] uppercase font-bold tracking-widest transition-all',
                  statusFilter === s ? 'bg-text-main text-bg-page' : 'hover:bg-primary/5'
                )}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate"
          className="bg-bg-card border border-border-subtle overflow-hidden"
        >
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="bg-bg-page border-b border-border-subtle text-[10px] uppercase font-bold tracking-[0.2em] text-text-muted">
                  <th className="px-8 py-5">Order</th>
                  <th className="px-8 py-5">Customer</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Total</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Items</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {loading ? (
                  <tr><td colSpan={6} className="px-8 py-12 text-center text-text-muted">Loading orders...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-8 py-12 text-center text-text-muted">No orders found</td></tr>
                ) : filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-bold text-sm tracking-widest">{order.id}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm">{order.customerEmail}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <Calendar size={12} className="text-text-muted" />
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'n/a'}
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-sm">
                      {order.total.toLocaleString(undefined, { style: 'currency', currency: 'EUR' })}
                    </td>
                    <td className="px-8 py-6">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        disabled={updatingId === order.id}
                        className={cn(
                          'text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 border rounded-full cursor-pointer outline-none appearance-none transition-all disabled:opacity-50',
                          STATUS_COLORS[order.status] ?? 'border-border-subtle text-text-muted'
                        )}
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-8 py-6 text-sm text-text-muted">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 border-t border-border-subtle bg-bg-page/30">
            <p className="text-xs text-text-muted">
              Showing <span className="font-bold text-text-main">{filtered.length}</span> orders
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
