// src/core/api/http-client.ts

class HttpClient {
  async request(url: string, options: RequestInit = {}): Promise<Response> {
    // Get valid token (auto-refreshes if needed)
    const token = await authManager.getAccessToken();
    
    // Inject token
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };
    
    // Make request
    let response = await fetch(`${env.apiUrl}${url}`, {
      ...options,
      headers,
    });
    
    // If 401, refresh and retry ONCE
    if (response.status === 401 && token) {
      const refreshed = await authManager.refresh();
      
      if (refreshed) {
        // Retry with new token
        const newToken = await authManager.getAccessToken();
        headers.Authorization = `Bearer ${newToken}`;
        response = await fetch(`${env.apiUrl}${url}`, {
          ...options,
          headers,
        });
      } else {
        // Refresh failed - logout
        authManager.clear();
        window.location.href = '/auth/login';
      }
    }
    
    return response;
  }
}

export const httpClient = new HttpClient();
