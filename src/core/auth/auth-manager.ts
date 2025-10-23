// src/core/auth/auth-manager.ts

class AuthManager {
  private static instance: AuthManager;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number | null = null;
  private refreshPromise: Promise<boolean> | null = null; // Race condition lock
  
  private constructor() {
    this.loadFromStorage();
  }
  
  static getInstance(): AuthManager {
    if (!this.instance) {
      this.instance = new AuthManager();
    }
    return this.instance;
  }
  
  // Returns valid access token (auto-refreshes if expired)
  async getAccessToken(): Promise<string | null> {
    // Token valid? Return it
    if (this.accessToken && this.expiresAt && Date.now() < this.expiresAt) {
      return this.accessToken;
    }
    
    // Token expired? Refresh it
    if (this.refreshToken) {
      const refreshed = await this.refresh();
      return refreshed ? this.accessToken : null;
    }
    
    return null;
  }
  
  // Refresh with race-condition protection
  private async refresh(): Promise<boolean> {
    // If refresh already in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }
    
    // Start refresh
    this.refreshPromise = this._doRefresh();
    const result = await this.refreshPromise;
    this.refreshPromise = null; // Reset lock
    
    return result;
  }
  
  private async _doRefresh(): Promise<boolean> {
    try {
      const response = await fetch(`${env.apiUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken })
      });
      
      if (!response.ok) return false;
      
      const data = await response.json();
      this.setTokens(data.accessToken, data.refreshToken, data.expiresAt);
      return true;
    } catch {
      return false;
    }
  }
  
  setTokens(access: string, refresh: string, expires: number) {
    this.accessToken = access;
    this.refreshToken = refresh;
    this.expiresAt = expires;
    localStorage.setItem('auth_access', access);
    localStorage.setItem('auth_refresh', refresh);
    localStorage.setItem('auth_expires', expires.toString());
  }
  
  clear() {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = null;
    localStorage.removeItem('auth_access');
    localStorage.removeItem('auth_refresh');
    localStorage.removeItem('auth_expires');
  }
  
  private loadFromStorage() {
    this.accessToken = localStorage.getItem('auth_access');
    this.refreshToken = localStorage.getItem('auth_refresh');
    const expires = localStorage.getItem('auth_expires');
    this.expiresAt = expires ? parseInt(expires) : null;
  }
  
  isAuthenticated(): boolean {
    return !!this.refreshToken;
  }
}

export const authManager = AuthManager.getInstance();
