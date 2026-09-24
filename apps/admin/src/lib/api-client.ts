import type { ApiError } from "@ecommerce/contracts";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export class ApiRequestError extends Error {
  status: number;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let error: ApiError | undefined;

    try {
      error = (await response.json()) as ApiError;
    } catch {
      // Ignore invalid/non-JSON responses.
    }

    throw new ApiRequestError(
      error?.message ?? `Request failed with status ${response.status}.`,
      response.status,
      error?.details,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}