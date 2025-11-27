/**
 * ENVIRONMENT MANAGER
 * 
 * Centralized configuration and runtime detection for the entire application.
 * This is the ONLY place where environment logic should live.
 * 
 * Architecture:
 * - Build-time constants (injected by Vite)
 * - Runtime domain detection (subdomain routing)
 * - Extensible for future features (RBAC, feature flags, tenant detection)
 * 
 * Usage:
 * - Routes: Use domain detection helpers
 * - API clients: Use environment URLs
 * - Feature flags: Extend with permission checks
 * - Analytics: Use environment context
 */

export type Environment = 'staging' | 'production';
export type DomainType = 'app' | 'marketing' | 'unknown';

export interface EnvironmentConfig {
  environment: Environment;
  apiUrl: string;
  appUrl: string;
  marketingUrl: string;
  isStaging: boolean;
  isProduction: boolean;
}

export interface DomainInfo {
  type: DomainType;
  hostname: string;
  isApp: boolean;
  isMarketing: boolean;
}

// ENVIRONMENT MANAGER CLASS
class EnvironmentManager {
  private static instance: EnvironmentManager;
  private config: EnvironmentConfig;

  private constructor() {
    this.config = this.loadEnvironment();
  }

  // ===========================================================================
  // SECTION 1: BUILD-TIME CONFIGURATION (Production vs Staging)
  // ===========================================================================

  /**
   * Load environment configuration from build-time constants
   * 
   * These values are injected by Vite during build:
   * - npm run build:staging → staging config
   * - npm run build:production → production config
   * 
   * See: vite.config.ts for constant definitions
   */
  private loadEnvironment(): EnvironmentConfig {
    const environment = __APP_ENV__ as Environment;
    const apiUrl = __API_URL__;
    const appUrl = __APP_URL__;
    const marketingUrl = __MARKETING_URL__;

    return {
      environment,
      apiUrl,
      appUrl,
      marketingUrl,
      isStaging: environment === 'staging',
      isProduction: environment === 'production',
    };
  }

  /**
   * Get current environment configuration
   */
  getConfig(): EnvironmentConfig {
    return this.config;
  }

  /**
   * Check if running in staging environment
   */
  isStaging(): boolean {
    return this.config.isStaging;
  }

  /**
   * Check if running in production environment
   */
  isProduction(): boolean {
    return this.config.isProduction;
  }

  // ===========================================================================
  // SECTION 2: DOMAIN DETECTION (Subdomain Routing)
  // ===========================================================================

  /**
   * Detect current domain type from browser hostname
   * 
   * Used by routes to enforce domain boundaries:
   * - app.oslira.com → Application domain
   * - oslira.com → Marketing domain
   * - localhost variations → Detected automatically
   */
  getCurrentDomain(): DomainInfo {
    const hostname = window.location.hostname;

    // App subdomain patterns
    const isApp = 
      hostname === 'app.oslira.com' ||
      hostname === 'staging-app.oslira.com' ||
      hostname === 'app.localhost' ||
      hostname.startsWith('oslira-app'); // Cloudflare Pages preview URLs

    // Marketing domain patterns
    const isMarketing = 
      hostname === 'oslira.com' ||
      hostname === 'www.oslira.com' ||
      hostname === 'staging.oslira.com' ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1';

    return {
      type: isApp ? 'app' : isMarketing ? 'marketing' : 'unknown',
      hostname,
      isApp,
      isMarketing,
    };
  }

  /**
   * Check if currently on app subdomain
   */
  isAppDomain(): boolean {
    return this.getCurrentDomain().isApp;
  }

  /**
   * Check if currently on marketing domain
   */
  isMarketingDomain(): boolean {
    return this.getCurrentDomain().isMarketing;
  }

  /**
   * Get the correct URL for a given domain type
   *
   * Accounts for environment (staging vs production)
   * Used for cross-domain redirects
   */
  getUrlForDomain(domainType: 'app' | 'marketing'): string {
    if (domainType === 'app') {
      return this.config.appUrl;
    } else {
      return this.config.marketingUrl;
    }
  }

  // ===========================================================================
  // SECTION 3: FEATURE DETECTION (Extensible for Future Features)
  // ===========================================================================

  /**
   * FUTURE: Check if user has admin privileges
   * 
   * Placeholder for future RBAC implementation
   * 
   * Example usage:
   * - Admin-only routes
   * - Feature access control
   * - UI element visibility
   * 
   * @param userId - User ID to check permissions for
   * @returns true if user is admin
   */
  // isAdmin(userId?: string): boolean {
  //   // TODO: Implement with user role from auth context
  //   return false;
  // }

  /**
   * FUTURE: Check if feature flag is enabled
   * 
   * Placeholder for feature flag system
   * 
   * Example usage:
   * - A/B testing
   * - Gradual rollouts
   * - Beta features
   * 
   * @param flagName - Feature flag identifier
   * @returns true if feature is enabled
   */
  // isFeatureEnabled(flagName: string): boolean {
  //   // TODO: Implement with LaunchDarkly/Posthog/etc
  //   return false;
  // }

  /**
   * FUTURE: Check if user has premium subscription
   * 
   * Placeholder for subscription tier detection
   * 
   * Example usage:
   * - Premium feature access
   * - Usage limits
   * - UI upsells
   * 
   * @param userId - User ID to check subscription for
   * @returns true if user has premium access
   */
  // isPremiumUser(userId?: string): boolean {
  //   // TODO: Implement with subscription data from API
  //   return false;
  // }

  /**
   * FUTURE: Get tenant/organization ID
   * 
   * Placeholder for multi-tenant SaaS architecture
   * 
   * Example usage:
   * - Data isolation
   * - Tenant-specific routing
   * - Custom branding
   * 
   * @returns Tenant ID if applicable
   */
  // getTenantId(): string | null {
  //   // TODO: Implement tenant detection from subdomain or auth context
  //   return null;
  // }

  // ===========================================================================
  // SECTION 4: VALIDATION & DEBUGGING
  // ===========================================================================

  /**
   * Validate environment configuration on startup
   * Fails fast if misconfigured
   */
  validate(): void {
    const { environment, apiUrl, appUrl } = this.config;

    // Ensure required config is present
    if (!apiUrl || !appUrl) {
      console.error('❌ Environment configuration missing:', this.config);
      throw new Error('Invalid environment configuration');
    }

    // Environment validation complete (removed verbose staging logs)
  }

  // ===========================================================================
  // SINGLETON PATTERN
  // ===========================================================================

  /**
   * Get singleton instance
   */
  static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }
}

// Singleton instance
export const environment = EnvironmentManager.getInstance();

// Convenience exports for build-time config
export const env = environment.getConfig();

// Convenience exports for domain detection
export const getDomainInfo = () => environment.getCurrentDomain();
export const isAppDomain = () => environment.isAppDomain();
export const isMarketingDomain = () => environment.isMarketingDomain();
export const getUrlForDomain = (type: 'app' | 'marketing') => environment.getUrlForDomain(type);

// Validate on module load (fails fast if misconfigured)
environment.validate();
