// src/core/auth/environment.ts

/**
 * ENVIRONMENT MANAGER - Build-Time Configuration
 * 
 * Uses constants injected at build time by Vite (see vite.config.ts)
 * No runtime detection - environment is determined during build
 * 
 * Build commands:
 * - Staging: npm run build:staging
 * - Production: npm run build:production (default)
 * 
 * Architecture:
 * - Singleton pattern for consistency
 * - Type-safe environment access
 * - No API calls or hostname sniffing
 * - Supports runtime secrets via import.meta.env
 */

export type Environment = 'staging' | 'production';

export interface EnvironmentConfig {
  environment: Environment;
  apiUrl: string;
  appUrl: string;
  marketingUrl: string;
  googleClientId: string; // Runtime secret from Cloudflare Pages
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
   * Load environment from build-time constants + runtime secrets
   * Build-time: Injected by Vite during build (see vite.config.ts)
   * Runtime: From Cloudflare Pages environment variables
   */
  private loadEnvironment(): EnvironmentConfig {
    // Build-time constants (replaced during build)
    const environment = __APP_ENV__ as Environment;
    const apiUrl = __API_URL__;
    const appUrl = __APP_URL__;
    const marketingUrl = __MARKETING_URL__;

    // Runtime secret (from Cloudflare Pages)
    const googleClientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID || '';

    return {
      environment,
      apiUrl,
      appUrl,
      marketingUrl,
      googleClientId,
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
    const { environment, apiUrl, appUrl, googleClientId } = this.config;

    // Ensure required config is present
    if (!apiUrl || !appUrl) {
      console.error('❌ Environment configuration missing:', this.config);
      throw new Error('Invalid environment configuration');
    }

    // Warn if Google OAuth not configured (non-blocking)
    if (!googleClientId) {
      console.warn('⚠️ Google OAuth Client ID not configured');
    }

    // Log environment in staging (debugging)
    if (environment === 'staging') {
      console.log('🔧 Running in STAGING environment');
      console.log('API:', apiUrl);
      console.log('App:', appUrl);
      console.log('Google OAuth:', googleClientId ? '✅ Configured' : '❌ Missing');
    }
  }
}

// Export singleton instance
export const environment = EnvironmentManager.getInstance();

// Export config for convenience
export const env = environment.getConfig();

// Validate on module load (fails fast if misconfigured)
environment.validate();
