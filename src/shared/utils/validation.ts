// src/shared/utils/validation.ts

/**
 * VALIDATION UTILITIES
 *
 * Comprehensive validation for user inputs with detailed error messages
 * Re-exports platform-specific validation from the modular system
 */

// =============================================================================
// TYPES
// =============================================================================

export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

// =============================================================================
// PLATFORM VALIDATION RE-EXPORTS
// =============================================================================

// Re-export everything from platformValidation for backwards compatibility
// and to provide a single import point for validation utilities
export {
  validateInstagramUsername,
  isValidInstagramUsername,
  normalizeInstagramUsername,
  formatInstagramUsername,
  validatePlatformUsername,
  isValidPlatformUsername,
  normalizePlatformUsername,
  formatPlatformUsername,
  getPlatformConfig,
  getAvailablePlatforms,
} from './platformValidation';

export type { PlatformType, PlatformValidationConfig, ValidationRule } from './platformValidation';

// =============================================================================
// EMAIL VALIDATION
// =============================================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const trimmed = email.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Email is required' };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: 'Invalid email format' };
  }

  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return { valid: false, error: 'Invalid email format' };
  }

  const local = parts[0];
  const domain = parts[1];

  if (!local || !domain) {
    return { valid: false, error: 'Invalid email format' };
  }

  if (local.length > 64) {
    return { valid: false, error: 'Email local part too long' };
  }

  if (domain.length > 255) {
    return { valid: false, error: 'Email domain too long' };
  }

  return { valid: true, error: null };
}

// =============================================================================
// COMMON VALIDATIONS
// =============================================================================

/**
 * Check if value is empty
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim().length === 0) return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
}

/**
 * Validate required field
 */
export function validateRequired(value: unknown, fieldName = 'Field'): ValidationResult {
  if (isEmpty(value)) {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true, error: null };
}

/**
 * Validate minimum length
 */
export function validateMinLength(
  value: string,
  min: number,
  fieldName = 'Field'
): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { valid: false, error: `${fieldName} is required` };
  }

  if (value.length < min) {
    return { valid: false, error: `${fieldName} must be at least ${min} characters` };
  }

  return { valid: true, error: null };
}

/**
 * Validate maximum length
 */
export function validateMaxLength(
  value: string,
  max: number,
  fieldName = 'Field'
): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { valid: true, error: null };
  }

  if (value.length > max) {
    return { valid: false, error: `${fieldName} must be less than ${max} characters` };
  }

  return { valid: true, error: null };
}

/**
 * Validate number range
 */
export function validateRange(
  value: number | string,
  min: number,
  max: number,
  fieldName = 'Value'
): ValidationResult {
  const num = Number(value);

  if (isNaN(num)) {
    return { valid: false, error: `${fieldName} must be a number` };
  }

  if (num < min || num > max) {
    return { valid: false, error: `${fieldName} must be between ${min} and ${max}` };
  }

  return { valid: true, error: null };
}

// =============================================================================
// SANITIZATION
// =============================================================================

/**
 * Sanitize string (remove HTML tags)
 */
export function sanitize(value: string): string {
  if (!value || typeof value !== 'string') return '';
  return value.replace(/<[^>]*>/g, '').trim();
}

/**
 * Normalize whitespace
 */
export function normalizeWhitespace(value: string): string {
  if (!value || typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim();
}
