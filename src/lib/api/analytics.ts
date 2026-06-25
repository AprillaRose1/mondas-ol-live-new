import { apiGet } from '@/lib/api/http';
import { API_BASE } from '@/lib/api/routes';
import type { Order } from '@/lib/types/user';

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalUsers: number;
  avgRating: number;
}

export interface RevenueByStatus {
  status: string;
  count: number;
  revenue: number;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  sales: number;
  stock: number;
}

export interface LowStockAlert {
  id: string;
  name: string;
  stock: number;
}

export interface AnalyticsDashboard {
  summary: AnalyticsSummary;
  revenueByStatus: RevenueByStatus[];
  topProducts: TopProduct[];
  lowStockAlerts: LowStockAlert[];
  recentOrders: Order[];
}

export const fetchDashboard = () =>
  apiGet<AnalyticsDashboard>(API_BASE + '/api/analytics/dashboard');
