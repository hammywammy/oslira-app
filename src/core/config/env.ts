/**
 * @file Environment Configuration (AWS Version)
 * @description Fetches config from backend API (which reads AWS Secrets Manager)
 * 
 * YOUR SETUP:
 * - Frontend calls: GET /api/public-config?env={environment}
 * - Backend worker reads AWS Secrets Manager
 * - Frontend caches response in localStorage (24hr TTL)
 * 
 * Features Preserved from ConfigProvider.js:
 * - Async config loading from Worker → AWS
 * - LocalStorage caching with expiration
 * - Fallback to cached config on failure
 * - Retry logic with exponential backoff
 */

import { logger } from '@/core/utils/logger';

// =============================================================================
// TYPES
// =============================================================================

export type Environment = 'development' | 'staging' | 'production';

interface EnvConfig {
  environment: Environment;
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  stripePublishableKey: string;
  frontendUrl: string;
}

// =============================================================================
// ENVIRONMENT DETECTION (from EnvDetector.js)
// =============================================================================

function detectEnvironment(): Environment {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  }
  
  if (hostname.includes('staging.oslira.com')) {
    return 'staging';
  }
  
  if (hostname.includes('oslira.com')) {
    return 'production';
  }
  
  return 'development';
}

function getWorkerUrl(env: Environment): string {
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

// =============================================================================
// CONFIG FETCHING (from ConfigProvider.js)
// =============================================================================

const CACHE_KEY = 'oslira-config-cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const MAX_RETRIES = 3;

/**
 * Load config from localStorage cache
 */
function loadFromCache(): EnvConfig | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { timestamp, data } = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age > CACHE_TTL) {
      logger.info('Config cache expired');
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    logger.info('Config loaded from cache', { ageMinutes: Math.round(age / 60000) });
    return data as EnvConfig;
  } catch (error) {
    logger.error('Failed to load config from cache', error as Error);
    return null;
  }
}

/**
 * Save config to localStorage cache
 */
function saveToCache(config: EnvConfig): void {
  try {
    const cacheData = {
      timestamp: Date.now(),
      data: config,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    logger.info('Config cached');
  } catch (error) {
    logger.error('Failed to cache config', error as Error);
  }
}

/**
 * Fetch config from backend (which reads AWS Secrets Manager)
 * Preserves ALL ConfigProvider.js logic
 */
async function fetchFromBackend(environment: Environment, workerUrl: string): Promise<EnvConfig> {
  const url = `${workerUrl}/api/public-config?env=${environment}`;
  
  logger.info('Fetching config from backend', { environment, workerUrl });

  let lastError: Error | null = null;

  // Retry logic (from ConfigProvider.js)
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Config fetch failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(`Invalid config response: ${result.error || 'missing data'}`);
      }

      // Build EnvConfig from backend response
      const config: EnvConfig = {
        environment: result.data.environment || environment,
        isDevelopment: environment === 'development',
        isStaging: environment === 'staging',
        isProduction: environment === 'production',
        apiUrl: workerUrl,
        supabaseUrl: result.data.supabaseUrl || '',
        supabaseAnonKey: result.data.supabaseAnonKey || '',
        stripePublishableKey: result.data.stripePublishableKey || '',
        frontendUrl: result.data.frontendUrl || window.location.origin,
      };

      // Cache config
      saveToCache(config);

      logger.info('Config fetched from backend successfully');
      return config;
    } catch (error) {
      lastError = error as Error;
      logger.warn(`Config fetch attempt ${attempt + 1}/${MAX_RETRIES} failed`, {
        error: (error as Error).message,
      });

      // Wait before retry (exponential backoff)
      if (attempt < MAX_RETRIES - 1) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed - try cache as fallback
  const cachedConfig = loadFromCache();
  if (cachedConfig) {
    logger.warn('Using cached config as fallback after fetch failure');
    return cachedConfig;
  }

  throw new Error(`Failed to fetch config after ${MAX_RETRIES} attempts: ${lastError?.message}`);
}

// =============================================================================
// INITIALIZE CONFIG
// =============================================================================

let configPromise: Promise<EnvConfig> | null = null;
let cachedConfig: EnvConfig | null = null;

/**
 * Initialize and load config
 * MUST be called before using ENV
 */
export async function initializeConfig(): Promise<EnvConfig> {
  // Return existing promise if already initializing
  if (configPromise) {
    return configPromise;
  }

  // Return cached config if already loaded
  if (cachedConfig) {
    return cachedConfig;
  }

  const environment = detectEnvironment();
  const workerUrl = getWorkerUrl(environment);

  // Try cache first for fast startup
  const cached = loadFromCache();
  if (cached) {
    cachedConfig = cached;
    
    // Refresh in background
    setTimeout(() => {
      fetchFromBackend(environment, workerUrl)
        .then((freshConfig) => {
          cachedConfig = freshConfig;
          logger.info('Config refreshed in background');
        })
        .catch((error) => {
          logger.warn('Background config refresh failed', { error: error.message });
        });
    }, 100);

    return cached;
  }

  // Fetch from backend
  configPromise = fetchFromBackend(environment, workerUrl).then((config) => {
    cachedConfig = config;
    configPromise = null;
    return config;
  });

  return configPromise;
}

/**
 * Get config (must call initializeConfig first)
 */
export function getConfig(): EnvConfig {
  if (!cachedConfig) {
    throw new Error('Config not loaded. Call await initializeConfig() first');
  }
  return cachedConfig;
}

/**
 * Validate required config fields
 */
export function validateConfig(): void {
  const config = getConfig();
  const errors: string[] = [];

  if (!config.supabaseUrl) {
    errors.push('supabaseUrl is required');
  }

  if (!config.supabaseAnonKey) {
    errors.push('supabaseAnonKey is required');
  }

  if (errors.length > 0) {
    const errorMessage = `Configuration errors:\n${errors.join('\n')}`;
    logger.error('Config validation failed', new Error(errorMessage));
    throw new Error(errorMessage);
  }

  logger.info('Config validation passed');
}

// =============================================================================
// CONVENIENCE EXPORT (after initialization)
// =============================================================================

/**
 * ENV object - use getConfig() to access after initialization
 * This is exported for backward compatibility but will throw if not initialized
 */
export const ENV = new Proxy({} as EnvConfig, {
  get(_target, prop) {
    const config = getConfig();
    return config[prop as keyof EnvConfig];
  },
});

// =============================================================================
// UTILITY FUNCTIONS (from EnvDetector.js)
// =============================================================================

export function detectCurrentPage(): string {
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

export function getSubdomain(): string | null {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  if (parts.length <= 2) return null;
  return parts[0] ?? null; // Handle undefined case
}

export default { initializeConfig, getConfig, validateConfig, ENV };
