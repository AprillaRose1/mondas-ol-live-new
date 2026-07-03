export type Language = 'de' | 'en' | 'fr';

export interface Testimonial {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  text: string;
  rating: number;
  date: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
