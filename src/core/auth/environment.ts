// src/core/auth/environment.ts

/**
 * ENVIRONMENT MANAGER - Build-Time Configuration
 * 
 * Uses constants injected at build time by Vite (see vite.config.ts)
 * No runtime detection - environment is determined during build
 * 
 * Build commands:
 * - Staging: vite build --mode staging
 * - Production: vite build --mode production (default)
 * 
 * Architecture:
 * - Singleton pattern for consistency
 * - Type-safe environment access
 * - No API calls or hostname sniffing
 */

export type Environment = 'staging' | 'production';

export interface EnvironmentConfig {
  environment: Environment;
  apiUrl: string;
  appUrl: string;
  isStaging: boolean;
  isProduction: boolean;
}

class EnvironmentManager {
  private static instance: EnvironmentManager;
  private config: EnvironmentConfig;

  private constructor() {
    this.config = this.loadEnvironment();
  }

  /**
   * Load environment from build-time constants
   * These are injected by Vite during build (see vite.config.ts)
   */
  private loadEnvironment(): EnvironmentConfig {
    // Build-time constants (replaced during build)
    const environment = __APP_ENV__ as Environment;
    const apiUrl = __API_URL__;
    const appUrl = __APP_URL__;

    return {
      environment,
      apiUrl,
      appUrl,
      isStaging: environment === 'staging',
      isProduction: environment === 'production',
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

  /**
   * Validate environment on startup (development check)
   */
  validate(): void {
    const { environment, apiUrl, appUrl } = this.config;

    // Ensure required config is present
    if (!apiUrl || !appUrl) {
      console.error('❌ Environment configuration missing:', this.config);
      throw new Error('Invalid environment configuration');
    }

    // Log environment in non-production (debugging)
    if (environment === 'staging') {
      console.log('🔧 Running in STAGING environment');
      console.log('API:', apiUrl);
      console.log('App:', appUrl);
    }
  }
}

// Export singleton instance
export const environment = EnvironmentManager.getInstance();

// Export config for convenience
export const env = environment.getConfig();

// Validate on module load (fails fast if misconfigured)
environment.validate();
