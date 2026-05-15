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
