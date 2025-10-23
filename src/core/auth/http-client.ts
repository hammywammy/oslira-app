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
 * - Comprehensive logging for debugging
 * 
 * Usage:
 * const data = await httpClient.get('/api/leads');
 * const result = await httpClient.post('/api/analyze', { username: 'nike' });
 */

import { authManager } from './auth-manager';
import { env } from './environment';
import { logger } from '@/core/utils/logger';

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
  private requestCounter = 0; // For tracking individual requests

  constructor() {
    this.baseUrl = env.apiUrl;
    logger.info('[HttpClient] Initialized', { 
      baseUrl: this.baseUrl,
      environment: env.environment 
    });
  }

  /**
   * Make HTTP request with automatic token injection
   */
  async request<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const requestId = ++this.requestCounter;
    const { skipAuth = false, ...fetchOptions } = options;

    logger.info(`[HttpClient][${requestId}] Starting request`, {
      endpoint,
      method: fetchOptions.method || 'GET',
      skipAuth,
      hasBody: !!fetchOptions.body
    });

    // Get valid access token (auto-refreshes if expired)
    let token: string | null = null;
    if (!skipAuth) {
      logger.debug(`[HttpClient][${requestId}] Getting access token...`);
      token = await authManager.getAccessToken();
      logger.debug(`[HttpClient][${requestId}] Token retrieved`, { 
        hasToken: !!token,
        tokenLength: token?.length 
      });
    } else {
      logger.debug(`[HttpClient][${requestId}] Skipping auth (public endpoint)`);
    }

    // Build headers with proper typing (Record instead of HeadersInit)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Merge existing headers if provided
    if (fetchOptions.headers) {
      const existingHeaders = fetchOptions.headers as Record<string, string>;
      Object.assign(headers, existingHeaders);
      logger.debug(`[HttpClient][${requestId}] Custom headers added`, { 
        headers: Object.keys(existingHeaders) 
      });
    }

    // Add authorization if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      logger.debug(`[HttpClient][${requestId}] Authorization header added`);
    }

    // Build full URL
    const url = `${this.baseUrl}${endpoint}`;
    logger.debug(`[HttpClient][${requestId}] Full URL`, { url });

    // Log request body (if exists)
    if (fetchOptions.body) {
      try {
        const bodyPreview = JSON.parse(fetchOptions.body as string);
        // Redact sensitive fields
        const safeBody = { ...bodyPreview };
        if (safeBody.code) safeBody.code = '[REDACTED]';
        if (safeBody.refreshToken) safeBody.refreshToken = '[REDACTED]';
        logger.debug(`[HttpClient][${requestId}] Request body`, { body: safeBody });
      } catch {
        logger.debug(`[HttpClient][${requestId}] Request body (non-JSON)`);
      }
    }

    // Make request
    logger.info(`[HttpClient][${requestId}] Sending request...`);
    const startTime = performance.now();
    
    let response: Response;
    try {
      response = await fetch(url, {
        ...fetchOptions,
        headers,
      });
      
      const duration = performance.now() - startTime;
      logger.info(`[HttpClient][${requestId}] Response received`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        duration: `${duration.toFixed(2)}ms`
      });
    } catch (error) {
      const duration = performance.now() - startTime;
      logger.error(`[HttpClient][${requestId}] Network error`, error as Error, {
        duration: `${duration.toFixed(2)}ms`,
        endpoint,
        method: fetchOptions.method || 'GET'
      });
      throw new Error('Network request failed');
    }

    // Handle 401 Unauthorized
    if (response.status === 401 && token && !skipAuth) {
      logger.warn(`[HttpClient][${requestId}] 401 Unauthorized - attempting token refresh`);

      // Force refresh (even if getAccessToken already tried)
      const refreshed = await authManager.getAccessToken();

      if (refreshed) {
        logger.info(`[HttpClient][${requestId}] Token refreshed - retrying request`);
        
        // Retry request with new token
        headers['Authorization'] = `Bearer ${refreshed}`;

        const retryStartTime = performance.now();
        response = await fetch(url, {
          ...fetchOptions,
          headers,
        });
        
        const retryDuration = performance.now() - retryStartTime;
        logger.info(`[HttpClient][${requestId}] Retry response received`, {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          duration: `${retryDuration.toFixed(2)}ms`
        });

        // Still 401 after refresh? Force logout
        if (response.status === 401) {
          logger.error(`[HttpClient][${requestId}] Still 401 after refresh - forcing logout`);
          await authManager.logout();
          window.location.href = '/auth/login';
          throw new Error('Authentication failed');
        }
      } else {
        // Refresh failed - force logout
        logger.error(`[HttpClient][${requestId}] Token refresh failed - forcing logout`);
        await authManager.logout();
        window.location.href = '/auth/login';
        throw new Error('Authentication required');
      }
    }

    // Parse response
    logger.debug(`[HttpClient][${requestId}] Parsing response...`);
    let data: any;
    try {
      const responseText = await response.text();
      logger.debug(`[HttpClient][${requestId}] Response text length: ${responseText.length}`);
      
      data = responseText ? JSON.parse(responseText) : null;
      
      // Log response (redact sensitive data)
      if (data) {
        const safeData = { ...data };
        if (safeData.accessToken) safeData.accessToken = '[REDACTED]';
        if (safeData.refreshToken) safeData.refreshToken = '[REDACTED]';
        if (safeData.data?.accessToken) safeData.data.accessToken = '[REDACTED]';
        if (safeData.data?.refreshToken) safeData.data.refreshToken = '[REDACTED]';
        
        logger.debug(`[HttpClient][${requestId}] Response data`, { 
          success: data.success,
          hasData: !!data.data,
          hasError: !!data.error,
          dataKeys: data.data ? Object.keys(data.data) : []
        });
      }
    } catch (parseError) {
      logger.error(`[HttpClient][${requestId}] Failed to parse response`, parseError as Error, {
        status: response.status,
        contentType: response.headers.get('content-type')
      });
      throw new Error('Invalid response format');
    }

    // Handle non-2xx responses
    if (!response.ok) {
      const errorMessage = data?.error || data?.message || `HTTP ${response.status}`;
      logger.error(`[HttpClient][${requestId}] Request failed`, new Error(errorMessage), {
        status: response.status,
        statusText: response.statusText,
        error: data?.error,
        message: data?.message,
        details: data?.details
      });
      throw new Error(errorMessage);
    }

    logger.info(`[HttpClient][${requestId}] Request completed successfully`);
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
