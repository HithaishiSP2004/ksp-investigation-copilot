/**
 * KSP Investigation Copilot — Shared HTTP Client
 * Manages all network requests to the Catalyst backend function.
 * Handles:
 *   - Dynamic base URL (local dev env vs. relative production path)
 *   - Unified headers and content parsing
 *   - Standardized error processing
 *   - Network timeouts
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "/server/ksp_investigation_copilot";

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  error: {
    code: string;
    details: string;
  } | null;
}

export class ApiError extends Error {
  code: string;
  details: string;

  constructor(message: string, code: string, details: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.details = details;
  }
}

export const client = {
  /**
   * Performs an HTTP request and parses the standardized response envelope.
   */
  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
    
    const headers = new Headers(options.headers);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const fetchOptions: RequestInit = {
      ...options,
      headers,
      signal: controller.signal,
    };

    try {
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      let payload: ApiResponse<T>;
      try {
        payload = await response.json();
      } catch (jsonErr) {
        throw new ApiError(
          "Invalid JSON response received from API server.",
          "INVALID_JSON",
          response.statusText
        );
      }

      if (!response.ok || !payload.success) {
        const errObj = payload.error || { code: "HTTP_ERROR", details: "Request failed" };
        throw new ApiError(
          payload.message || `Request failed with status ${response.status}`,
          errObj.code,
          errObj.details
        );
      }

      if (payload.data === null || payload.data === undefined) {
        throw new ApiError(
          "API returned empty payload data.",
          "EMPTY_DATA",
          "Payload data is null or undefined"
        );
      }

      return payload.data;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        throw new ApiError("Network request timed out.", "TIMEOUT", "Timeout limit reached (15s)");
      }
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error.message || "Network connection failed.",
        "NETWORK_FAILURE",
        error.toString()
      );
    }
  },

  /**
   * HTTP GET convenience helper.
   */
  async get<T>(path: string, options: Omit<RequestInit, "method" | "body"> = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET" });
  },

  /**
   * HTTP POST convenience helper.
   */
  async post<T>(path: string, body: any, options: Omit<RequestInit, "method" | "body"> = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  /**
   * HTTP PUT convenience helper.
   */
  async put<T>(path: string, body: any, options: Omit<RequestInit, "method" | "body"> = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  /**
   * HTTP DELETE convenience helper.
   */
  async delete<T>(path: string, options: Omit<RequestInit, "method"> = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" });
  },
};
