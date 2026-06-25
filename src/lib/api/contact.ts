import { apiPost } from '@/lib/api/http';
import { API_ROUTES } from '@/lib/api/routes';
import type { ContactFormData } from '@/lib/schemas';

export type ContactMessageResponse = {
  id: string;
  receivedAt: string;
};

export const submitContactMessage = (payload: ContactFormData) =>
  apiPost<ContactMessageResponse>(API_ROUTES.contact, payload);
