/// <reference types="vite/client" />

/**
 * ENVIRONMENT CONFIGURATION
 * 
 * Build-time constants (injected by Vite during build):
 * - Defined in vite.config.ts using `define`
 * - Values are BAKED INTO the bundle
 * - Change requires rebuild
 * 
 * Runtime secrets (from Cloudflare Pages environment variables):
 * - Accessed via import.meta.env.VITE_*
 * - Values stay in environment, not in bundle
 * - Can change without rebuild
 */

// =============================================================================
// BUILD-TIME CONSTANTS (from vite.config.ts)
// =============================================================================

/**
 * Application environment
 * Values: 'staging' | 'production'
 * Set by: npm run build:staging or npm run build:production
 */
declare const __APP_ENV__: 'staging' | 'production';

/**
 * API base URL
 * Staging: https://api-staging.oslira.com
 * Production: https://api.oslira.com
 */
declare const __API_URL__: string;

/**
 * App base URL  
 * Staging: https://staging-app.oslira.com
 * Production: https://app.oslira.com
 */
declare const __APP_URL__: string;

/**
 * Marketing site URL
 * Staging: https://staging.oslira.com
 * Production: https://oslira.com
 */
declare const __MARKETING_URL__: string;

// =============================================================================
// RUNTIME ENVIRONMENT VARIABLES (from Cloudflare Pages)
// =============================================================================

interface ImportMetaEnv {
  // Vite built-ins
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;
  
  // Oslira runtime secrets (set in Cloudflare Pages dashboard)
  readonly VITE_GOOGLE_OAUTH_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
