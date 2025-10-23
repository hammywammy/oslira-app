// src/core/config/environment.ts

class EnvironmentManager {
  private static instance: EnvironmentManager;
  
  public readonly environment: 'development' | 'staging' | 'production';
  public readonly apiUrl: string;
  public readonly appUrl: string;
  public readonly googleClientId: string;
  
  private constructor() {
    const hostname = window.location.hostname;
    
    // Detect environment from hostname (INSTANT, no API call)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      this.environment = 'development';
      this.apiUrl = 'http://localhost:8787';
      this.appUrl = 'http://localhost:5173';
      this.googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID_DEV;
    } 
    else if (hostname.includes('staging')) {
      this.environment = 'staging';
      this.apiUrl = 'https://api-staging.oslira.com';
      this.appUrl = 'https://staging-app.oslira.com';
      this.googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID_STAGING;
    } 
    else {
      this.environment = 'production';
      this.apiUrl = 'https://api.oslira.com';
      this.appUrl = 'https://app.oslira.com';
      this.googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID_PROD;
    }
  }
  
  static getInstance(): EnvironmentManager {
    if (!this.instance) {
      this.instance = new EnvironmentManager();
    }
    return this.instance;
  }
}

export const env = EnvironmentManager.getInstance();
