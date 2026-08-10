import { RpcError } from "./errors.js";

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

/**
 * Thin fetch wrapper shared by every backend-facing module (gateway, arbiter).
 * Centralizing this keeps error shapes, JSON parsing and timeouts consistent
 * across the whole SDK instead of each module re-implementing fetch().
 */
export async function request<T>(baseUrl: string, path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(path, baseUrl).toString();
  const method = options.method ?? "GET";

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        "content-type": "application/json",
        ...options.headers,
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    });
  } catch (cause) {
    throw new RpcError(`Network request to ${url} failed`, undefined, cause);
  }

  if (!response.ok) {
    let detail: string;
    try {
      detail = await response.text();
    } catch {
      detail = response.statusText;
    }
    throw new RpcError(`${method} ${url} returned ${response.status}: ${detail}`, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  try {
    return (await response.json()) as T;
  } catch (cause) {
    throw new RpcError(`${method} ${url} returned a non-JSON body`, response.status, cause);
  }
}

export function withTimeout(ms: number): AbortSignal {
  return AbortSignal.timeout(ms);
}
