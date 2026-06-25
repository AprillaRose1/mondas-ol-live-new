import type { Order } from '@/lib/types';

// Static mock data — only used for Storybook / tests.
// Real data comes from GET /api/orders via useOrders() hook.
export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-7429', userId: 'user-customer', customerEmail: 'customer@example.com',
    items: [
      { productId: 'p1', productName: 'Golden Harvest Extra Virgin', quantity: 2, priceAtPurchase: 34.99 },
      { productId: 'p2', productName: 'Lemon Infusion', quantity: 1, priceAtPurchase: 15.02 },
    ],
    shipping: { firstName: 'Demo', lastName: 'Customer', email: 'customer@example.com', phone: '+1234567890', address: '1 Demo St', city: 'Tunis', zip: '1000', country: 'Tunisia' },
    subtotal: 84.99, shippingCost: 5, total: 89.99,
    status: 'delivered', createdAt: '2024-03-20T10:00:00Z', updatedAt: '2024-03-22T10:00:00Z',
  },
  {
    id: 'ORD-7428', userId: 'user-customer', customerEmail: 'customer@example.com',
    items: [{ productId: 'p3', productName: 'Early Harvest', quantity: 3, priceAtPurchase: 42 }],
    shipping: { firstName: 'Demo', lastName: 'Customer', email: 'customer@example.com', phone: '+1234567890', address: '1 Demo St', city: 'Tunis', zip: '1000', country: 'Tunisia' },
    subtotal: 126, shippingCost: 0, total: 126,
    status: 'shipped', createdAt: '2024-03-19T10:00:00Z', updatedAt: '2024-03-21T10:00:00Z',
  },
];
