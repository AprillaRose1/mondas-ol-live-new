export interface Product {
  id: string;
  name: { de: string; en: string; fr: string; ar: string };
  description: { de: string; en: string; fr: string; ar: string };
  price: number;
  images: string[];
  category: 'extra-virgin' | 'infusions' | 'premium' | 'sets';
  rating: number;
  reviewsCount: number;
  stock: number;
  isFeatured: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
