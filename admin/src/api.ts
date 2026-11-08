/**
 * Client fetch same-origin pour /api/admin/*.
 * - credentials: 'include' : cookie de session HttpOnly.
 * - CSRF double-submit : le cookie `haythi_csrf` (lisible JS) est renvoyé
 *   dans l'en-tête `X-CSRF-Token` sur les méthodes mutantes.
 */

const BASE = '/api/admin';
const CSRF_COOKIE = 'haythi_csrf';
const CSRF_HEADER = 'X-CSRF-Token';
const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    const code =
      body && typeof body === 'object' && 'error' in body
        ? String((body as { error: unknown }).error)
        : `HTTP ${status}`;
    super(code);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export function readCsrfToken(): string | undefined {
  for (const part of document.cookie.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === CSRF_COOKIE) {
      try {
        return decodeURIComponent(part.slice(idx + 1).trim());
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (MUTATING.has(method)) {
    const token = readCsrfToken();
    if (token) headers[CSRF_HEADER] = token;
  }

  const res = await fetch(`${BASE}${path.startsWith('/') ? path : `/${path}`}`, {
    method,
    headers,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
}

export const apiGet = <T>(path: string) => request<T>('GET', path);
export const apiPost = <T>(path: string, body?: unknown) => request<T>('POST', path, body);
export const apiPatch = <T>(path: string, body?: unknown) => request<T>('PATCH', path, body);
export const apiPut = <T>(path: string, body?: unknown) => request<T>('PUT', path, body);
export const apiDelete = <T>(path: string) => request<T>('DELETE', path);
