// src/shared/utils/platformValidation.ts

/**
 * PLATFORM VALIDATION SYSTEM
 *
 * Modular validation system for platform-specific username rules.
 * Easily expandable for different platforms (Instagram, LinkedIn, TikTok, etc.)
 */

// =============================================================================
// TYPES
// =============================================================================

export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

export interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

export interface PlatformValidationConfig {
  name: string;
  displayName: string;
  /** Main regex pattern for the username */
  pattern: RegExp;
  /** Individual validation rules with specific error messages */
  rules: ValidationRule[];
  /** Normalizes the username (e.g., removes @ prefix) */
  normalize: (value: string) => string;
  /** Formats the username for display (e.g., adds @ prefix) */
  format: (value: string) => string;
}

// =============================================================================
// PLATFORM CONFIGURATIONS
// =============================================================================

/**
 * Instagram Username Rules:
 * - 3-30 characters
 * - First character: letter, digit, or underscore (no period)
 * - Last character: letter, digit, or underscore (no period)
 * - Allowed characters: letters, digits, periods, underscores
 * - No consecutive periods
 */
export const instagramConfig: PlatformValidationConfig = {
  name: 'instagram',
  displayName: 'Instagram',
  // Main pattern: 3-30 chars, starts/ends with letter/digit/underscore, no consecutive dots
  pattern: /^(?=.{3,30}$)[A-Za-z0-9_](?!.*\.\.)[A-Za-z0-9._]*[A-Za-z0-9_]$/,
  rules: [
    {
      test: (v) => v.length >= 3,
      message: 'Username must be at least 3 characters',
    },
    {
      test: (v) => v.length <= 30,
      message: 'Username must be 30 characters or less',
    },
    {
      test: (v) => /^[A-Za-z0-9_]/.test(v),
      message: 'Username cannot start with a period',
    },
    {
      test: (v) => /[A-Za-z0-9_]$/.test(v),
      message: 'Username cannot end with a period',
    },
    {
      test: (v) => !/\.\./.test(v),
      message: 'Username cannot have consecutive periods',
    },
    {
      test: (v) => /^[A-Za-z0-9._]+$/.test(v),
      message: 'Only letters, numbers, periods, and underscores allowed',
    },
  ],
  normalize: (value: string) => {
    if (!value) return '';
    return value.trim().replace(/^@/, '').toLowerCase();
  },
  format: (value: string) => {
    if (!value) return '';
    const normalized = value.trim().replace(/^@/, '').toLowerCase();
    return `@${normalized}`;
  },
};

/**
 * LinkedIn Username Rules (for future use):
 * - 3-100 characters
 * - Letters, numbers, and hyphens only
 * - Cannot start or end with a hyphen
 * - No consecutive hyphens
 */
export const linkedinConfig: PlatformValidationConfig = {
  name: 'linkedin',
  displayName: 'LinkedIn',
  pattern: /^(?=.{3,100}$)[A-Za-z0-9](?!.*--)[A-Za-z0-9-]*[A-Za-z0-9]$/,
  rules: [
    {
      test: (v) => v.length >= 3,
      message: 'Username must be at least 3 characters',
    },
    {
      test: (v) => v.length <= 100,
      message: 'Username must be 100 characters or less',
    },
    {
      test: (v) => /^[A-Za-z0-9]/.test(v),
      message: 'Username cannot start with a hyphen',
    },
    {
      test: (v) => /[A-Za-z0-9]$/.test(v),
      message: 'Username cannot end with a hyphen',
    },
    {
      test: (v) => !/--/.test(v),
      message: 'Username cannot have consecutive hyphens',
    },
    {
      test: (v) => /^[A-Za-z0-9-]+$/.test(v),
      message: 'Only letters, numbers, and hyphens allowed',
    },
  ],
  normalize: (value: string) => {
    if (!value) return '';
    return value.trim().toLowerCase();
  },
  format: (value: string) => {
    if (!value) return '';
    return value.trim().toLowerCase();
  },
};

/**
 * TikTok Username Rules (for future use):
 * - 2-24 characters
 * - Letters, numbers, underscores, and periods
 * - Cannot start with a period
 */
export const tiktokConfig: PlatformValidationConfig = {
  name: 'tiktok',
  displayName: 'TikTok',
  pattern: /^(?=.{2,24}$)[A-Za-z0-9_][A-Za-z0-9._]*$/,
  rules: [
    {
      test: (v) => v.length >= 2,
      message: 'Username must be at least 2 characters',
    },
    {
      test: (v) => v.length <= 24,
      message: 'Username must be 24 characters or less',
    },
    {
      test: (v) => /^[A-Za-z0-9_]/.test(v),
      message: 'Username cannot start with a period',
    },
    {
      test: (v) => /^[A-Za-z0-9._]+$/.test(v),
      message: 'Only letters, numbers, periods, and underscores allowed',
    },
  ],
  normalize: (value: string) => {
    if (!value) return '';
    return value.trim().replace(/^@/, '').toLowerCase();
  },
  format: (value: string) => {
    if (!value) return '';
    const normalized = value.trim().replace(/^@/, '').toLowerCase();
    return `@${normalized}`;
  },
};

// =============================================================================
// PLATFORM REGISTRY
// =============================================================================

export type PlatformType = 'instagram' | 'linkedin' | 'tiktok';

const platformConfigs: Record<PlatformType, PlatformValidationConfig> = {
  instagram: instagramConfig,
  linkedin: linkedinConfig,
  tiktok: tiktokConfig,
};

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validate a username for a specific platform.
 * Returns detailed error messages for specific validation failures.
 */
export function validatePlatformUsername(
  platform: PlatformType,
  username: string
): ValidationResult {
  const config = platformConfigs[platform];

  if (!config) {
    return { valid: false, error: `Unknown platform: ${platform}` };
  }

  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username is required' };
  }

  // Normalize the username first
  const normalized = config.normalize(username);

  if (normalized.length === 0) {
    return { valid: false, error: 'Username is required' };
  }

  // Check individual rules for specific error messages
  for (const rule of config.rules) {
    if (!rule.test(normalized)) {
      return { valid: false, error: rule.message };
    }
  }

  // Final check with main pattern
  if (!config.pattern.test(normalized)) {
    return { valid: false, error: `Invalid ${config.displayName} username format` };
  }

  return { valid: true, error: null };
}

/**
 * Quick boolean check if username is valid for a platform
 */
export function isValidPlatformUsername(
  platform: PlatformType,
  username: string
): boolean {
  return validatePlatformUsername(platform, username).valid;
}

/**
 * Normalize a username for a specific platform
 */
export function normalizePlatformUsername(
  platform: PlatformType,
  username: string
): string {
  const config = platformConfigs[platform];
  if (!config) return username;
  return config.normalize(username);
}

/**
 * Format a username for display on a specific platform
 */
export function formatPlatformUsername(
  platform: PlatformType,
  username: string
): string {
  const config = platformConfigs[platform];
  if (!config) return username;
  return config.format(username);
}

/**
 * Get the validation config for a platform
 */
export function getPlatformConfig(platform: PlatformType): PlatformValidationConfig | undefined {
  return platformConfigs[platform];
}

/**
 * Get all available platforms
 */
export function getAvailablePlatforms(): PlatformType[] {
  return Object.keys(platformConfigs) as PlatformType[];
}

// =============================================================================
// CONVENIENCE EXPORTS FOR INSTAGRAM (most common use case)
// =============================================================================

export const validateInstagramUsername = (username: string) =>
  validatePlatformUsername('instagram', username);

export const isValidInstagramUsername = (username: string) =>
  isValidPlatformUsername('instagram', username);

export const normalizeInstagramUsername = (username: string) =>
  normalizePlatformUsername('instagram', username);

export const formatInstagramUsername = (username: string) =>
  formatPlatformUsername('instagram', username);
