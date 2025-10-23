// src/core/auth/environment.ts

/**
 * ENVIRONMENT MANAGER
 * 
 * Detects environment from hostname (no API calls, instant)
 * Singleton pattern - initialized once on app load
 * 
 * Environments:
 * - development: localhost → http://localhost:8787
 * - staging: staging-app.oslira.com → api-staging.oslira.com
 * - production: app.oslira.com → api.oslira.com
 */

export type Environment = 'development' | 'staging' | 'production';

export interface EnvironmentConfig {
  environment: Environment;
  apiUrl: string;
  appUrl: string;
  isStaging: boolean;
  isProduction: boolean;
  isDevelopment: boolean;
}

class EnvironmentManager {
  private static instance: EnvironmentManager;
  private config: EnvironmentConfig;

  private constructor() {
    this.config = this.detectEnvironment();
  }

  /**
   * Detect environment from window.location.hostname
   * No API calls - instant detection
   */
  private detectEnvironment(): EnvironmentConfig {
    const hostname = window.location.hostname;

    // Development environment (localhost)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return {
        environment: 'development',
        apiUrl: 'http://localhost:8787',
        appUrl: 'http://localhost:5173',
        isStaging: false,
        isProduction: false,
        isDevelopment: true,
      };
    }

    // Staging environment
    if (hostname.includes('staging')) {
      return {
        environment: 'staging',
        apiUrl: 'https://api-staging.oslira.com',
        appUrl: 'https://staging-app.oslira.com',
        isStaging: true,
        isProduction: false,
        isDevelopment: false,
      };
    }

    // Production environment (default)
    return {
      environment: 'production',
      apiUrl: 'https://api.oslira.com',
      appUrl: 'https://app.oslira.com',
      isStaging: false,
      isProduction: true,
      isDevelopment: false,
    };
  }

  /**
   * Get singleton instance
   */
  static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  /**
   * Get current environment config
   */
  getConfig(): EnvironmentConfig {
    return this.config;
  }
}

// Export singleton instance
export const environment = EnvironmentManager.getInstance();

// Export config for convenience
export const env = environment.getConfig();
