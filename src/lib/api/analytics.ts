import type { Order } from '@/lib/types/user';
import { MOCK_ORDERS } from '@/data/orders';
import { MOCK_PRODUCTS } from '@/data/products';
import { mockDelay } from '@/lib/api/_mock';

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

export const fetchDashboard = (): Promise<AnalyticsDashboard> =>
  mockDelay({
    summary: {
      totalRevenue: MOCK_ORDERS.reduce((s, o) => s + o.total, 0),
      totalOrders: MOCK_ORDERS.length,
      totalProducts: MOCK_PRODUCTS.length,
      totalCustomers: 0,
      totalUsers: 0,
      avgRating: 4.8,
    },
    revenueByStatus: [],
    topProducts: MOCK_PRODUCTS.slice(0, 5).map((p) => ({
      id: p.id,
      name: p.name.en,
      category: p.category,
      sales: 0,
      stock: p.stock,
    })),
    lowStockAlerts: MOCK_PRODUCTS.filter((p) => p.stock < 10).map((p) => ({
      id: p.id,
      name: p.name.en,
      stock: p.stock,
    })),
    recentOrders: MOCK_ORDERS.slice(0, 5),
  });
