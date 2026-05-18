import { toast } from 'sonner';
import { FAKE_API_DELAY_MS } from '@/config/general.config';

/**
 * Generic API response wrapper — matches the shape returned by all endpoints.
 *
 * {
 *   "success": true,
 *   "message": "...",
 *   "errors": [],
 *   "data": { ... },
 *   "meta": { "itemCount": 1, "timestamp": "..." }
 * }
 */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  errors: string[];
  data: T;
  meta?: {
    itemCount: number;
    timestamp: string;
  };
}

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly errors: string[],
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Unwraps the standard API envelope.
 * - On HTTP error: throws an `ApiError` with the status code.
 * - On `success: false`: throws an `ApiError` with the server-provided errors.
 * - On success: returns `response.data`.
 */
export async function unwrapApiResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errors: string[] = [];
    let message = `HTTP ${res.status} ${res.statusText}`;
    try {
      const body = (await res.json()) as Partial<ApiResponse<unknown>>;
      if (body.errors?.length) errors = body.errors;
      if (body.message) message = body.message;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(res.status, errors, message);
  }

  const body = (await res.json()) as ApiResponse<T>;

  if (!body.success) {
    throw new ApiError(
      res.status,
      body.errors ?? [],
      body.message ?? 'Request failed',
    );
  }

  return body.data;
}

/** Base URL — override via VITE_API_BASE_URL env var */
export const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'https://localhost:7189';

/** Simulated network delay — applied to every apiFetch call. Set FAKE_API_DELAY_MS to 0 in production. */
export const fakeDelay = () => new Promise<void>((resolve) => setTimeout(resolve, FAKE_API_DELAY_MS));

/**
 * Drop-in replacement for `fetch` + `unwrapApiResponse`.
 * Automatically shows a Sonner toast whenever the request fails —
 * either an HTTP error, a `success: false` body, or a network failure.
 * Still re-throws so calling code can handle the error if needed.
 *
 * Usage:
 *   const data = await apiFetch<MyType>(`${API_BASE}/api/my-endpoint`);
 */
export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    await fakeDelay();
    const res = await fetch(url, options);
    return await unwrapApiResponse<T>(res);
  } catch (err) {
    if (err instanceof ApiError) {
      const description = err.errors.length > 0 ? err.errors.join('\n') : undefined;
      toast.error(err.message, { description });
    } else {
      toast.error('Network error', {
        description: err instanceof Error ? err.message : String(err),
      });
    }
    throw err;
  }
}
