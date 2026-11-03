/**
 * Base API Client for TRY IT OUT
 * Connects with backend endpoints specified by VITE_API_BASE_URL
 * Automatically attaches Supabase session Bearer token when available
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');

export interface RequestOptions extends RequestInit {
  timeout?: number;
}

export interface ApiError extends Error {
  status?: number;
  data?: unknown;
  code?: string;
}

class ApiClient {
  public baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  private async getAuthHeader(): Promise<Record<string, string>> {
    try {
      if (isSupabaseConfigured()) {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (token) {
          return { Authorization: `Bearer ${token}` };
        }
      }
    } catch {
      // Ignore if Supabase auth is not available
    }
    return {};
  }

  async request<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const authHeaders = await this.getAuthHeader();

    const headers: Record<string, string> = {
      ...authHeaders,
      ...(options.headers as Record<string, string>),
    };

    // If body is not FormData, default to application/json
    if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeout || 30000);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeout);

      // Handle HTTP errors
      if (!response.ok) {
        let errorData: { message?: string } | null = null;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText || 'Network request failed' };
        }
        const error = new Error(errorData?.message || `Request failed with status ${response.status}`) as ApiError;
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return (await response.json()) as T;
      }
      return (await response.text()) as unknown as T;
    } catch (err: unknown) {
      clearTimeout(timeout);
      const apiErr = err as ApiError;
      if (apiErr.name === 'AbortError') {
        const timeoutError = new Error('Request timed out. Please check your backend connection.') as ApiError;
        timeoutError.code = 'TIMEOUT';
        throw timeoutError;
      }
      throw err;
    }
  }

  get<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = unknown>(endpoint: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined
    });
  }

  put<T = unknown>(endpoint: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined
    });
  }

  delete<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export { API_BASE_URL };

