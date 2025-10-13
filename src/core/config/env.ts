/**
 * @file Environment Detection & Configuration
 * @description Migrated from EnvDetector.js - preserves all detection logic
 * 
 * Features:
 * - Auto-detect environment from hostname
 * - Environment-specific configuration
 * - Worker URL resolution
 * - Page detection for analytics
 * - Type-safe environment access
 */

// =============================================================================
// TYPES
// =============================================================================

export type Environment = 'development' | 'staging' | 'production';

export type Page = 
  | 'auth'
  | 'dashboard' 
  | 'leads'
  | 'analytics'
  | 'campaigns'
  | 'messages'
  | 'settings'
  | 'onboarding'
  | 'unknown';

interface EnvConfig {
  environment: Environment;
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  enableAnalytics: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  sentryDsn?: string;
}

// =============================================================================
// ENVIRONMENT DETECTION (from EnvDetector.js)
// =============================================================================

/**
 * Detect environment from hostname or Vite env
 * Preserves original logic from EnvDetector.js
 */
function detectEnvironment(): Environment {
  const hostname = window.location.hostname;
  
  // Check Vite environment variable first
  const viteEnv = import.meta.env.VITE_APP_ENV;
  if (viteEnv === 'production' || viteEnv === 'staging' || viteEnv === 'development') {
    return viteEnv;
  }
  
  // Detect from hostname (original EnvDetector logic)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  }
  
  if (hostname.includes('staging.oslira.com')) {
    return 'staging';
  }
  
  if (hostname.includes('oslira.com')) {
    return 'production';
  }
  
  // Default to development for unknown hosts
  return 'development';
}

/**
 * Get Worker URL based on environment
 * Preserves original EnvDetector logic
 */
function getWorkerUrl(env: Environment): string {
  // Check for explicit API URL first (allows override in .env)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Default URLs by environment
  switch (env) {
    case 'development':
      return 'http://localhost:8787';
    case 'staging':
      return 'https://staging-api.oslira.com';
    case 'production':
      return 'https://api.oslira.com';
    default:
      return 'http://localhost:8787';
  }
}

/**
 * Detect current page from pathname
 * Preserves original EnvDetector logic
 */
export function detectCurrentPage(): Page {
  const pathname = window.location.pathname;
  
  if (pathname.includes('/auth')) return 'auth';
  if (pathname.includes('/dashboard')) return 'dashboard';
  if (pathname.includes('/leads')) return 'leads';
  if (pathname.includes('/analytics')) return 'analytics';
  if (pathname.includes('/campaigns')) return 'campaigns';
  if (pathname.includes('/messages')) return 'messages';
  if (pathname.includes('/settings')) return 'settings';
  if (pathname.includes('/onboarding')) return 'onboarding';
  
  return 'unknown';
}

// =============================================================================
// CONFIGURATION OBJECT
// =============================================================================

const environment = detectEnvironment();

export const ENV: EnvConfig = {
  // Environment
  environment,
  isDevelopment: environment === 'development',
  isStaging: environment === 'staging',
  isProduction: environment === 'production',
  
  // API Configuration
  apiUrl: getWorkerUrl(environment),
  
  // Supabase Configuration
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  
  // Feature Flags
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true' || environment === 'production',
  
  // Logging
  logLevel: (import.meta.env.VITE_LOG_LEVEL as EnvConfig['logLevel']) || 'info',
  
  // Error Tracking
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
} as const;

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate required environment variables
 * Throws error if critical config is missing
 */
export function validateEnv(): void {
  const errors: string[] = [];
  
  if (!ENV.supabaseUrl) {
    errors.push('VITE_SUPABASE_URL is required');
  }
  
  if (!ENV.supabaseAnonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is required');
  }
  
  if (!ENV.apiUrl) {
    errors.push('VITE_API_URL is required or could not be detected');
  }
  
  if (errors.length > 0) {
    const errorMessage = `Environment configuration errors:\n${errors.join('\n')}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  
  // Log environment in development
  if (ENV.isDevelopment) {
    console.log('🔧 [ENV] Configuration loaded:', {
      environment: ENV.environment,
      apiUrl: ENV.apiUrl,
      supabaseUrl: ENV.supabaseUrl,
      enableAnalytics: ENV.enableAnalytics,
      logLevel: ENV.logLevel,
    });
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if running in browser (vs SSR)
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get full URL for a path
 */
export function getFullUrl(path: string): string {
  if (!isBrowser()) return path;
  
  const origin = window.location.origin;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${cleanPath}`;
}

/**
 * Get subdomain from hostname
 */
export function getSubdomain(): string | null {
  if (!isBrowser()) return null;
  
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // localhost or IP
  if (parts.length <= 2) return null;
  
  // Get first part (subdomain)
  return parts[0];
}

// =============================================================================
// EXPORTS
// =============================================================================

export default ENV;
