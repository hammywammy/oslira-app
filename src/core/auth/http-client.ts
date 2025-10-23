// src/core/auth/http-client.ts

/**
 * HTTP CLIENT
 * 
 * Fetch wrapper with automatic token injection and 401 handling
 * 
 * Features:
 * - Calls authManager.getAccessToken() before each request
 * - Adds Authorization header automatically
 * - On 401 → triggers refresh → retries request ONCE
 * - If retry fails → clears auth → redirects to login
 * 
 * Usage:
 * const data = await httpClient.get('/api/leads');
 * const result = await httpClient.post('/api/analyze', { username: 'nike' });
 */

import { authManager } from './auth-manager';
import { env } from './environment';

// =============================================================================
// TYPES
// =============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean; // Skip authorization header (for public endpoints)
}

// =============================================================================
// HTTP CLIENT
// =============================================================================

class HttpClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.apiUrl;
  }

  /**
   * Make HTTP request with automatic token injection
   */
  async request<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { skipAuth = false, ...fetchOptions } = options;

    // Get valid access token (auto-refreshes if expired)
    let token: string | null = null;
    if (!skipAuth) {
      token = await authManager.getAccessToken();
    }

    // Build headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    // Add authorization if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Build full URL
    const url = `${this.baseUrl}${endpoint}`;

    // Make request
    let response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Handle 401 Unauthorized
    if (response.status === 401 && token && !skipAuth) {
      console.warn('[HttpClient] 401 Unauthorized - refreshing token');

      // Force refresh (even if getAccessToken already tried)
      const refreshed = await authManager.getAccessToken();

      if (refreshed) {
        // Retry request with new token
        headers['Authorization'] = `Bearer ${refreshed}`;

        response = await fetch(url, {
          ...fetchOptions,
          headers,
        });

        // Still 401 after refresh? Force logout
        if (response.status === 401) {
          console.error('[HttpClient] Still 401 after refresh - forcing logout');
          await authManager.logout();
          window.location.href = '/auth/login';
          throw new Error('Authentication failed');
        }
      } else {
        // Refresh failed - force logout
        console.error('[HttpClient] Token refresh failed - forcing logout');
        await authManager.logout();
        window.location.href = '/auth/login';
        throw new Error('Authentication required');
      }
    }

    // Parse response
    const data = await response.json();

    // Handle non-2xx responses
    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }

    return data;
  }

  // ===========================================================================
  // CONVENIENCE METHODS
  // ===========================================================================

  /**
   * GET request
   */
  async get<T = unknown>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const httpClient = new HttpClient();

// Export for convenience
export const api = httpClient;
