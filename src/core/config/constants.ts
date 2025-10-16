// src/core/config/constants.ts
/**
 * @file Application Constants
 * @description Centralized configuration constants
 */

// =============================================================================
// AUTHENTICATION CONFIGURATION
// =============================================================================

/**
 * Authentication Configuration
 * 
 * IMPORTANT: Configured for Cloudflare-style long sessions
 * - 30-day token expiry
 * - Auto-refresh enabled
 * - Cross-subdomain support
 */
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
  VALIDATION_INTERVAL: 5 * 60 * 1000, // 5 minutes
  
  // Retry configuration
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // Initial delay in ms
} as const;

// =============================================================================
// API CONFIGURATION
// =============================================================================

export const API = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // Rate limiting
  MAX_REQUESTS_PER_MINUTE: 60,
  
  // Cache
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
} as const;

// =============================================================================
// UI CONFIGURATION
// =============================================================================

export const UI = {
  // Sidebar
  SIDEBAR_WIDTH: 280,
  SIDEBAR_COLLAPSED_WIDTH: 80,
  
  // Toast notifications
  TOAST_DURATION: 5000,
  TOAST_MAX_COUNT: 3,
  
  // Pagination
  DEFAULT_PAGE_SIZE: 25,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  
  // Animations
  ANIMATION_DURATION: 200,
  STAGGER_DELAY: 50,
} as const;

// =============================================================================
// BUSINESS CONFIGURATION
// =============================================================================

export const BUSINESS = {
  // Industry options
  INDUSTRIES: [
    'Technology',
    'Healthcare',
    'Finance',
    'Retail',
    'Manufacturing',
    'Education',
    'Real Estate',
    'Professional Services',
    'Other',
  ] as const,
  
  // Business size options
  SIZES: [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+',
  ] as const,
} as const;

// =============================================================================
// LEAD CONFIGURATION
// =============================================================================

export const LEAD = {
  // Lead status options
  STATUSES: [
    'new',
    'contacted',
    'qualified',
    'proposal',
    'negotiation',
    'won',
    'lost',
  ] as const,
  
  // Lead score ranges
  SCORE_MIN: 0,
  SCORE_MAX: 100,
  
  // Priority levels
  PRIORITIES: ['low', 'medium', 'high', 'urgent'] as const,
} as const;

// =============================================================================
// SUBSCRIPTION CONFIGURATION
// =============================================================================

export const SUBSCRIPTION = {
  // Plan tiers
  PLANS: {
    FREE: {
      name: 'Free',
      credits: 25,
      price: 0,
      features: [
        'Up to 25 AI credits per month',
        'Basic lead management',
        'Email support',
      ],
    },
    STARTER: {
      name: 'Starter',
      credits: 100,
      price: 29,
      features: [
        'Up to 100 AI credits per month',
        'Advanced lead scoring',
        'Priority support',
        'Custom integrations',
      ],
    },
    PRO: {
      name: 'Pro',
      credits: 500,
      price: 99,
      features: [
        'Up to 500 AI credits per month',
        'Unlimited lead management',
        'Advanced analytics',
        'API access',
        'Dedicated support',
      ],
    },
    ENTERPRISE: {
      name: 'Enterprise',
      credits: -1, // Unlimited
      price: 299,
      features: [
        'Unlimited AI credits',
        'White-label options',
        'Custom integrations',
        'SLA guarantee',
        '24/7 premium support',
      ],
    },
  } as const,
  
  // Credit costs
  CREDIT_COSTS: {
    LEAD_SCORE: 1,
    LEAD_ENRICHMENT: 5,
    AI_INSIGHTS: 2,
    EMAIL_GENERATION: 3,
  } as const,
} as const;

// =============================================================================
// FILE UPLOAD CONFIGURATION
// =============================================================================

export const UPLOAD = {
  // Max file sizes (in bytes)
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  
  // Allowed file types
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
} as const;

// =============================================================================
// FEATURE FLAGS
// =============================================================================

export const FEATURES = {
  ENABLE_ANALYTICS: true,
  ENABLE_REAL_TIME: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: true,
  ENABLE_AI_INSIGHTS: true,
} as const;

// =============================================================================
// EXTERNAL LINKS
// =============================================================================

export const LINKS = {
  DOCUMENTATION: 'https://docs.oslira.com',
  SUPPORT: 'https://support.oslira.com',
  PRIVACY_POLICY: 'https://oslira.com/privacy',
  TERMS_OF_SERVICE: 'https://oslira.com/terms',
  STATUS_PAGE: 'https://status.oslira.com',
} as const;

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  AUTH,
  API,
  UI,
  BUSINESS,
  LEAD,
  SUBSCRIPTION,
  UPLOAD,
  FEATURES,
  LINKS,
} as const;
