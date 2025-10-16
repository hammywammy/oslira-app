/**
 * @file Application Constants
 * @description Global constants used throughout the application
 */

// =============================================================================
// API CONSTANTS
// =============================================================================

export const API = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  MAX_CONCURRENT_REQUESTS: 6,
} as const;

// =============================================================================
// CACHE CONSTANTS
// =============================================================================

export const CACHE = {
  TTL: {
    SHORT: 1 * 60 * 1000, // 1 minute
    MEDIUM: 5 * 60 * 1000, // 5 minutes
    LONG: 30 * 60 * 1000, // 30 minutes
    VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
  },
} as const;

// =============================================================================
// AUTH CONSTANTS
// =============================================================================

export const AUTH = {
  // Storage keys
  STORAGE_KEY: 'oslira-auth', // localStorage key for auth session
  BUSINESS_STORAGE_KEY: 'oslira-selected-business',
  
  // Session configuration
  SESSION_TIMEOUT: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // Refresh 5 minutes before expiry
  
  // OAuth configuration
  OAUTH_REDIRECT_URL: '/auth/callback',
  OAUTH_SCOPES: 'email profile',
  
  // Session validation (check every 5 minutes)
  VALIDATION_INTERVAL: 5 * 60 * 1000,
  
  // Retry configuration
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // Initial delay in ms
} as const;

// =============================================================================
// LOCAL STORAGE KEYS
// =============================================================================

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'oslira-auth',
  SELECTED_BUSINESS: 'oslira-selected-business',
  UI_PREFERENCES: 'oslira-ui-preferences',
  CONFIG_CACHE: 'oslira-config-cache',
} as const;

// =============================================================================
// QUERY KEYS (React Query)
// =============================================================================

export const QUERY_KEYS = {
  AUTH: {
    SESSION: ['auth', 'session'] as const,
    USER: ['auth', 'user'] as const,
  },
  BUSINESS: {
    ALL: ['business', 'all'] as const,
    DETAIL: (id: string) => ['business', 'detail', id] as const,
  },
  LEADS: {
    ALL: (businessId: string) => ['leads', 'all', businessId] as const,
    DETAIL: (id: string) => ['leads', 'detail', id] as const,
    STATS: (businessId: string) => ['leads', 'stats', businessId] as const,
  },
  ANALYTICS: {
    DASHBOARD: (businessId: string) => ['analytics', 'dashboard', businessId] as const,
    STATS: (businessId: string) => ['analytics', 'stats', businessId] as const,
  },
} as const;

// =============================================================================
// UI CONSTANTS
// =============================================================================

export const UI = {
  DEBOUNCE_DELAY: 300, // 300ms
  TOAST_DURATION: 5000, // 5 seconds
  MODAL_ANIMATION_DURATION: 200, // 200ms
  SIDEBAR_COLLAPSED_WIDTH: 64, // pixels
  SIDEBAR_EXPANDED_WIDTH: 256, // pixels
} as const;

// =============================================================================
// VALIDATION CONSTANTS
// =============================================================================

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  URL_REGEX: /^https?:\/\/.+/,
  MIN_PASSWORD_LENGTH: 8,
  MAX_BUSINESS_NAME_LENGTH: 100,
  MAX_LEAD_NAME_LENGTH: 200,
} as const;

// =============================================================================
// PAGINATION CONSTANTS
// =============================================================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [25, 50, 100] as const,
} as const;

// =============================================================================
// ERROR CODES
// =============================================================================

export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

// =============================================================================
// HTTP STATUS CODES
// =============================================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// =============================================================================
// LEAD STATUS
// =============================================================================

export const LEAD_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  NURTURING: 'nurturing',
  CONVERTED: 'converted',
  LOST: 'lost',
} as const;

// =============================================================================
// ANALYSIS TYPES
// =============================================================================

export const ANALYSIS_TYPES = {
  LIGHT: 'light',
  DEEP: 'deep',
  XRAY: 'xray',
} as const;

export type AnalysisType = typeof ANALYSIS_TYPES[keyof typeof ANALYSIS_TYPES];
export type LeadStatus = typeof LEAD_STATUS[keyof typeof LEAD_STATUS];
