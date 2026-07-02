import { mockDelay, mockId } from '@/lib/api/_mock';

export interface UploadResult {
  key: string;
  url: string;
}

export interface MediaObject {
  key: string;
  name: string;
  url: string;
  size: number;
  lastModified: string | null;
}

// No object storage in the standalone build. Uploads return a local blob URL so
// previews still work in-session; the list is always empty.
const blobUrl = (file: File): string =>
  typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function'
    ? URL.createObjectURL(file)
    : '';

export const fetchMediaList = (
  _prefix?: string,
): Promise<{ data: MediaObject[]; total: number }> =>
  mockDelay({ data: [], total: 0 });

export const uploadMedia = (file: File): Promise<UploadResult> =>
  mockDelay({ key: mockId(), url: blobUrl(file) });

export const uploadMediaBatch = (files: File[]): Promise<UploadResult[]> =>
  mockDelay(files.map((f) => ({ key: mockId(), url: blobUrl(f) })));

export const deleteMedia = (_key: string): Promise<{ ok: boolean }> =>
  mockDelay({ ok: true });
