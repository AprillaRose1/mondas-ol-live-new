'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string | null;
  userEmail: string | null;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

const ACTION_COLORS: Record<string, string> = {
  CREATE:        'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  UPDATE:        'text-blue-500 bg-blue-500/10 border-blue-500/20',
  DELETE:        'text-rose-500 bg-rose-500/10 border-rose-500/20',
  LOGIN:         'text-primary bg-primary/10 border-primary/20',
  LOGOUT:        'text-text-muted bg-border-subtle/20 border-border-subtle',
  REGISTER:      'text-violet-500 bg-violet-500/10 border-violet-500/20',
  STATUS_CHANGE: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  UPLOAD:        'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
};

const LIMIT = 20;

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('');

  useEffect(() => {
    // Standalone build: no audit backend — render an empty log.
    setLoading(true);
    setLogs([]);
    setTotal(0);
    setLoading(false);
  }, [page, entityFilter]);

  const filtered = search
    ? logs.filter((l) =>
        l.entity.toLowerCase().includes(search.toLowerCase()) ||
        l.action.toLowerCase().includes(search.toLowerCase()) ||
        (l.userEmail ?? '').toLowerCase().includes(search.toLowerCase()) ||
        l.entityId.toLowerCase().includes(search.toLowerCase()),
      )
    : logs;

  const totalPages = Math.ceil(total / LIMIT);

  const ENTITIES = ['', 'Product', 'Order', 'User', 'Testimonial', 'GalleryImage', 'Media'];

  return (
    <div className="min-h-screen bg-bg-page pt-32 pb-24 px-6 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="initial" animate="animate" variants={staggerContainer}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <motion.div variants={fadeInUp}>
            <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-2 block">
              <Activity size={10} className="inline mr-1" />Security
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Audit <span className="text-primary italic font-serif font-normal">Log</span>
            </h1>
          </motion.div>
          <motion.div variants={fadeInUp} className="text-sm text-text-muted">{total} events total</motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex flex-wrap gap-4 mb-8">
          <div className="relative flex-grow min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by action, entity, user..."
              className="w-full bg-bg-card border border-border-subtle pl-12 pr-4 py-3 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {ENTITIES.map((e) => (
              <button key={e} onClick={() => { setEntityFilter(e); setPage(1); }}
                className={cn('px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all',
                  entityFilter === e ? 'bg-primary text-primary-foreground border-primary' : 'border-border-subtle hover:border-primary'
                )}
              >
                {e || 'All'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate"
          className="bg-bg-card border border-border-subtle overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-border-subtle text-[10px] uppercase font-bold tracking-[0.2em] text-text-muted bg-bg-page">
                  <th className="px-6 py-4">When</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Entity</th>
                  <th className="px-6 py-4">Entity ID</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-sm">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-text-muted">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-text-muted">No events found</td></tr>
                ) : filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-primary/[0.02] transition-colors">
                    <td className="px-6 py-4 text-[11px] text-text-muted whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn('text-[9px] font-bold uppercase tracking-widest px-2 py-1 border rounded-full', ACTION_COLORS[log.action] ?? 'text-text-muted border-border-subtle')}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{log.entity}</td>
                    <td className="px-6 py-4 font-mono text-[11px] text-text-muted truncate max-w-[160px]">{log.entityId}</td>
                    <td className="px-6 py-4 text-[11px]">{log.userEmail ?? <span className="text-text-muted italic">guest</span>}</td>
                    <td className="px-6 py-4 text-[11px] text-text-muted">
                      {log.metadata ? JSON.stringify(log.metadata).slice(0, 60) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-between bg-bg-page/30">
              <p className="text-[10px] text-text-muted">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="flex items-center gap-1 px-4 py-2 border border-border-subtle text-[10px] font-bold uppercase disabled:opacity-40 hover:border-primary transition-all"
                >
                  <ChevronLeft size={12} /> Prev
                </button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="flex items-center gap-1 px-4 py-2 border border-border-subtle text-[10px] font-bold uppercase disabled:opacity-40 hover:border-primary transition-all"
                >
                  Next <ChevronRight size={12} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
