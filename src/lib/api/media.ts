import { apiDelete, apiGet, apiUpload } from '@/lib/api/http';
import { API_ROUTES } from '@/lib/api/routes';

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

export const fetchMediaList = (prefix?: string) =>
  apiGet<{ data: MediaObject[]; total: number }>(
    API_ROUTES.media + (prefix ? '?prefix=' + encodeURIComponent(prefix) : ''),
  );

export const uploadMedia = (file: File) => {
  const fd = new FormData();
  fd.append('file', file);
  return apiUpload<UploadResult>(API_ROUTES.mediaUpload, fd);
};

export const uploadMediaBatch = (files: File[]) => {
  const fd = new FormData();
  for (const file of files) {
    fd.append('files', file);
  }
  return apiUpload<UploadResult[]>(API_ROUTES.mediaUploadBatch, fd);
};

export const deleteMedia = (key: string) =>
  apiDelete<{ ok: boolean }>(API_ROUTES.mediaDelete(key));
