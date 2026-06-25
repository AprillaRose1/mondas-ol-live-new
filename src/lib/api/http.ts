import { API_BASE } from '@/lib/api/routes';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  cache?: RequestCache;
};

async function parseErrorResponse(res: Response): Promise<ApiError> {
  const fallback = res.statusText || 'Request failed (' + res.status + ')';
  try {
    const body = await res.json() as { error?: string; code?: string; details?: unknown };
    return new ApiError(res.status, body.error ?? fallback, body.code, body.details);
  } catch {
    const text = await res.text().catch(() => fallback);
    return new ApiError(res.status, text || fallback);
  }
}

export const UNAUTHORIZED_EVENT = 'mondas:unauthorized';

const CSRF_HEADER = 'X-CSRF-Token';
const SAFE_METHODS = new Set(['GET', 'HEAD']);

// Cached CSRF token. The cookie lives on the API origin (unreadable here), so we
// fetch the value once via /api/csrf and echo it back in the header.
let csrfToken: string | null = null;
let csrfInFlight: Promise<string | null> | null = null;

async function fetchCsrfToken(): Promise<string | null> {
  try {
    const res = await fetch(API_BASE + '/api/csrf', { credentials: 'include' });
    if (!res.ok) return null;
    const data = (await res.json()) as { csrfToken?: string | null };
    csrfToken = data.csrfToken ?? null;
    return csrfToken;
  } catch {
    return null;
  }
}

async function ensureCsrfToken(): Promise<string | null> {
  if (csrfToken) return csrfToken;
  csrfInFlight ??= fetchCsrfToken().finally(() => { csrfInFlight = null; });
  return csrfInFlight;
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, cache } = options;
  const isMutation = !SAFE_METHODS.has(method);

  const buildHeaders = async (): Promise<Record<string, string>> => {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (isMutation) {
      const token = await ensureCsrfToken();
      if (token) headers[CSRF_HEADER] = token;
    }
    return headers;
  };

  const doFetch = async () =>
    fetch(path, {
      method,
      cache,
      credentials: 'include',
      headers: await buildHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  let res = await doFetch();

  // A stale/missing CSRF token yields 403 — refresh once and retry.
  if (res.status === 403 && isMutation) {
    csrfToken = null;
    await ensureCsrfToken();
    res = await doFetch();
  }

  if (!res.ok) {
    const err = await parseErrorResponse(res);
    // Fire global event so AuthHydrator can logout on 401
    if (err.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
    }
    throw err;
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** Multipart upload helper — sends FormData (no JSON content-type) with CSRF + credentials. */
export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const send = async () => {
    const headers: Record<string, string> = {};
    const token = await ensureCsrfToken();
    if (token) headers[CSRF_HEADER] = token;
    return fetch(path, { method: 'POST', credentials: 'include', headers, body: formData });
  };

  let res = await send();
  if (res.status === 403) {
    csrfToken = null;
    await ensureCsrfToken();
    res = await send();
  }
  if (!res.ok) {
    const err = await parseErrorResponse(res);
    if (err.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
    }
    throw err;
  }
  return res.json() as Promise<T>;
}

export const apiGet    = <T>(path: string, cache?: RequestCache) => api<T>(path, { cache });
export const apiPost   = <T>(path: string, body: unknown) => api<T>(path, { method: 'POST', body });
export const apiPatch  = <T>(path: string, body: unknown) => api<T>(path, { method: 'PATCH', body });
export const apiDelete = <T>(path: string) => api<T>(path, { method: 'DELETE' });
