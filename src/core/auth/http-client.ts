/**
 * HTTP CLIENT - INDUSTRY STANDARD (2025)
 * 
 * ARCHITECTURE:
 * Fetch wrapper with automatic token injection and smart 401 handling
 * 
 * FEATURES:
 * - Calls authManager.getAccessToken() before each request
 * - Auto-adds Authorization: Bearer <token> header
 * - On 401 → attempts token refresh → retries request ONCE
 * - If retry fails → clears auth → redirects to login
 * - Comprehensive logging for debugging
 * 
 * TOKEN REFRESH FLOW:
 * 1. Request fails with 401
 * 2. Call auth-manager to refresh tokens
 * 3. Auth-manager calls /api/auth/refresh with refresh token
 * 4. If successful → retry original request with new access token
 * 5. If fails → clear auth, redirect to login
 * 
 * WHY THIS WORKS:
 * - auth-manager handles refresh logic (calls /refresh endpoint)
 * - httpClient just retries with whatever token auth-manager returns
 * - Single responsibility: httpClient = requests, auth-manager = tokens
 * 
 * USAGE:
 * const data = await httpClient.get('/api/leads');
 * const result = await httpClient.post('/api/analyze', { username: 'nike' });
 * 
 * PUBLIC ENDPOINTS (skip auth):
 * const data = await httpClient.get('/api/public/pricing', { skipAuth: true });
 * 
 * REFERENCES:
 * - Auth0 SDK: Similar pattern with auto-refresh
 * - Clerk SDK: Similar pattern with auto-refresh
 * - Axios interceptors: Same concept, different implementation
 */

import { authManager } from './auth-manager';
import { env } from './environment';
import { logger } from '@/core/utils/logger';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean; // Skip authorization header (for public endpoints)
}

// HTTP CLIENT
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
   * 
   * TOKEN FLOW:
   * 1. Check if auth required (skipAuth flag)
   * 2. If auth required → call auth-manager.getAccessToken()
   * 3. Auth-manager checks if token expired → auto-refreshes if needed
   * 4. Add Authorization header with token
   * 5. Make request
   * 6. If 401 → token might be expired → try refresh → retry once
   * 
   * ERROR HANDLING:
   * - Network errors → throw error
   * - 401 (Unauthorized) → attempt refresh → retry → logout if fails
   * - Other HTTP errors → return response for caller to handle
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

    // Get valid access token (auth-manager handles refresh if expired)
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

    // Build headers
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

    // Handle 401 Unauthorized - Try token refresh once
    if (response.status === 401 && token && !skipAuth) {
      logger.warn(`[HttpClient][${requestId}] 401 Unauthorized - attempting token refresh`);

      // Force token refresh via auth-manager
      // auth-manager will call /refresh endpoint internally
      const newToken = await authManager.forceRefresh();

      if (newToken) {
        logger.info(`[HttpClient][${requestId}] Token refreshed - retrying request`);

        // Retry request with new token
        headers['Authorization'] = `Bearer ${newToken}`;

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

        // Still 401 after refresh? User session is truly invalid
        if (response.status === 401) {
          logger.error(`[HttpClient][${requestId}] Still 401 after refresh - forcing logout`);
          await authManager.logout();
          window.location.href = '/auth/login';
          throw new Error('Authentication failed');
        }
      } else {
        // Refresh failed - clear auth and redirect
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

        logger.debug(`[HttpClient][${requestId}] Response data`, {
          success: data.success,
          hasData: !!data.data,
          hasError: !!data.error,
          dataKeys: data.data ? Object.keys(data.data) : []
        });
      }
    } catch (error) {
      logger.error(`[HttpClient][${requestId}] Failed to parse response`, error as Error);
      throw new Error('Invalid response format');
    }

    // Handle non-2xx responses
    if (!response.ok) {
      const errorMessage = data?.error || data?.message || response.statusText;
      logger.error(`[HttpClient][${requestId}] Request failed`, {
        status: response.status,
        statusText: response.statusText,
        error: errorMessage,
        message: data?.message
      } as any);

      throw new Error(errorMessage);
    }

    logger.info(`[HttpClient][${requestId}] Request completed successfully`);
    return data as T;
  }

  /**
   * GET request
   */
  async get<T = unknown>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
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
      body: JSON.stringify(body),
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
      body: JSON.stringify(body),
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
      body: JSON.stringify(body),
    });
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const httpClient = new HttpClient();
