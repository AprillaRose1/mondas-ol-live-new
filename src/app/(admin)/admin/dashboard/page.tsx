'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Settings, 
  BarChart3,
  Bell,
  Search,
  MessageSquare,
  ArrowUpRight,
  AlertTriangle
} from 'lucide-react';
import { fadeInUp, staggerContainer, scrollViewport } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { ElegantSeparator } from '@/components/common/ElegantSeparator';
import { useOrders } from '@/lib/hooks/useOrders';
import { useAnalytics } from '@/lib/hooks/useAnalytics';

const eur = (n: number) => n.toLocaleString(undefined, { style: 'currency', currency: 'EUR' });

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { orders } = useOrders();
  const { data, loading } = useAnalytics();

  const summary = data?.summary;
  const topProducts = data?.topProducts ?? [];
  const lowStock = data?.lowStockAlerts ?? [];

  // 7-day revenue series (derived from orders — analytics summary has no daily breakdown)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyRevenue = Array(7).fill(0).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const dayTotal = orders
      .filter(o => o.createdAt?.startsWith(dateStr))
      .reduce((acc, o) => acc + o.total, 0);
    return { day: days[date.getDay()], total: dayTotal };
  });

  const maxDailyRevenue = Math.max(...dailyRevenue.map(d => d.total), 1);
  const maxProductSales = Math.max(...topProducts.map(p => p.sales), 1);

  const STATS = [
    { label: 'Total Revenue', value: summary ? eur(summary.totalRevenue) : '—', icon: DollarSign, color: 'text-primary' },
    { label: 'Total Orders', value: summary?.totalOrders ?? '—', icon: ShoppingBag, color: 'text-emerald-500' },
    { label: 'Total Products', value: summary?.totalProducts ?? '—', icon: Package, color: 'text-blue-500' },
    { label: 'Customers', value: summary?.totalCustomers ?? '—', icon: Users, color: 'text-amber-500' },
    { label: 'Avg Rating', value: summary ? summary.avgRating.toFixed(1) : '—', icon: TrendingUp, color: 'text-rose-500' },
  ];

  const RECENT_ORDERS = data?.recentOrders ?? orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-bg-page pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
        >
          <motion.div variants={fadeInUp}>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-2">
              Admin <span className="text-primary italic font-serif font-normal">Dashboard</span>
            </h1>
            <p className="text-text-muted">
              {"Welcome back, Administrator. Here's what's happening today."}
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Search analytics..." 
                className="bg-bg-card border border-border-subtle rounded-none px-10 py-2 text-sm focus:ring-1 focus:ring-primary outline-none w-full md:w-64 transition-all"
              />
            </div>
            <button className="p-2 bg-bg-card border border-border-subtle hover:border-primary transition-colors relative flex-shrink-0">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
            </button>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bg-bg-card border border-border-subtle p-6 hover:border-primary/30 transition-all group cursor-default"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <stat.icon size={20} />
                </div>
              </div>
              <h3 className="text-text-muted text-[10px] uppercase tracking-[0.15em] font-bold mb-1 truncate">{stat.label}</h3>
              <p className={cn('text-2xl sm:text-3xl font-bold tracking-tight break-all', loading && 'animate-pulse text-text-muted')}>{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Chart Placeholder */}
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="lg:col-span-2 bg-bg-card border border-border-subtle p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <BarChart3 size={20} className="text-primary" />
                Revenue Analytics
              </h3>
              <select className="bg-transparent border border-border-subtle rounded-none text-[10px] font-bold text-primary uppercase tracking-widest px-3 py-1 cursor-pointer outline-none hover:border-primary transition-colors">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>All Time</option>
              </select>
            </div>
            
            <div className="h-[300px] w-full border-b border-l border-border-subtle relative flex items-end justify-between px-2 sm:px-4 pb-4">
              {dailyRevenue.map((d, i) => {
                const height = (d.total / maxDailyRevenue) * 100;
                return (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, 5)}%` }} // Minimum height for visibility
                    transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full mx-0.5 sm:mx-2 bg-gradient-to-t from-primary/5 via-primary/20 to-primary/40 relative group"
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-text-main text-bg-page text-[10px] font-bold px-2 py-1 opacity-0 group-hover:opacity-100 transition-all pointer-events-none transform translate-y-2 group-hover:translate-y-0 z-10 whitespace-nowrap">
                      {eur(d.total)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex justify-between mt-4 px-2 sm:px-4">
              {dailyRevenue.map((d, i) => (
                <span key={i} className="text-[9px] sm:text-[10px] text-text-muted font-bold uppercase tracking-widest">{d.day}</span>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions & Recent */}
          <div className="space-y-8">
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="bg-bg-card border border-border-subtle p-8"
            >
              <h3 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-2">
                <Package size={20} className="text-primary" />
                Management
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Products', icon: Package, link: '/admin/products' },
                  { label: 'Orders', icon: ShoppingBag, link: '/admin/orders' },
                  { label: 'Users', icon: Users, link: '/admin/users' },
                  { label: 'Reviews', icon: MessageSquare, link: '/admin/testimonials' },
                  { label: 'Store', icon: ArrowUpRight, link: '/' },
                  { label: 'Settings', icon: Settings, link: '#' },
                ].map((action, i) => (
                  <Link 
                    key={i} 
                    href={action.link}
                    className="flex flex-col items-center justify-center p-4 border border-border-subtle hover:border-primary hover:bg-primary/5 transition-all gap-2 group text-center"
                  >
                    <action.icon size={20} className="text-text-muted group-hover:text-primary transition-colors" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">{action.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="bg-bg-card border border-border-subtle p-8"
            >
              <h3 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Top Products
              </h3>
              <div className="space-y-5">
                {topProducts.length === 0 && (
                  <p className="text-[11px] text-text-muted uppercase tracking-widest">{loading ? 'Loading…' : 'No sales yet'}</p>
                )}
                {topProducts.map((p) => (
                  <div key={p.id} className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold gap-2">
                      <span className="text-text-muted truncate">{p.name}</span>
                      <span className="flex-shrink-0">{p.sales} sold</span>
                    </div>
                    <div className="w-full h-1 bg-primary/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(p.sales / maxProductSales) * 100}%` }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {lowStock.length > 0 && (
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="bg-bg-card border border-border-subtle p-8"
              >
                <h3 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-2">
                  <AlertTriangle size={20} className="text-amber-500" />
                  Low Stock Alerts
                </h3>
                <div className="space-y-3">
                  {lowStock.map((p) => (
                    <div key={p.id} className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                      <span className="text-text-muted truncate">{p.name}</span>
                      <span className={cn('px-2 py-0.5 rounded-full border flex-shrink-0', p.stock === 0 ? 'border-rose-500/30 text-rose-500 bg-rose-500/5' : 'border-amber-500/30 text-amber-500 bg-amber-500/5')}>
                        {p.stock} left
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <ElegantSeparator />

        {/* Recent Orders Table */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          className="bg-bg-card border border-border-subtle overflow-hidden shadow-sm"
        >
          <div className="p-8 border-b border-border-subtle flex items-center justify-between">
            <h3 className="text-2xl font-bold tracking-tighter italic font-serif">Recent <span className="text-primary not-italic font-sans font-bold">Orders</span></h3>
            <Link href="/admin/orders" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="bg-bg-page border-b border-border-subtle text-[10px] uppercase font-bold tracking-[0.2em] text-text-muted">
                  <th className="px-8 py-4">Order ID</th>
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <motion.tbody variants={staggerContainer} initial="hidden" whileInView="visible" viewport={scrollViewport}
                className="divide-y divide-border-subtle"
              >
                {RECENT_ORDERS.map((order, i) => (
                  <motion.tr 
                    key={i} 
                    variants={fadeInUp}
                    className="hover:bg-primary/[0.02] transition-colors group"
                  >
                    <td className="px-8 py-6 text-xs font-mono font-bold text-primary">{order.id}</td>
                    <td className="px-8 py-6 text-xs text-text-muted">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}</td>
                    <td className="px-8 py-6 text-xs font-bold">{eur(order.total)}</td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "text-[9px] uppercase font-bold tracking-widest px-3 py-1 border rounded-full",
                        order.status === 'delivered' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' :
                        order.status === 'pending' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' :
                        order.status === 'cancelled' ? 'border-rose-500/30 text-rose-500 bg-rose-500/5' :
                        'border-blue-500/30 text-blue-500 bg-blue-500/5'
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-[10px] uppercase font-bold tracking-widest text-primary hover:underline transition-all">Details</button>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
          <div className="p-6 bg-bg-page/50 text-center">
            <button className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors text-text-muted">
              Download Sales Report (CSV)
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;

