import type { ContactFormData } from '@/lib/schemas';
import { mockDelay, mockId } from '@/lib/api/_mock';

export type ContactMessageResponse = {
  id: string;
  receivedAt: string;
};

export const submitContactMessage = (
  _payload: ContactFormData,
): Promise<ContactMessageResponse> =>
  mockDelay({ id: mockId(), receivedAt: new Date().toISOString() });
