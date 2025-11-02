// src/shared/utils/validation.ts

/**
 * VALIDATION UTILITIES
 * 
 * Comprehensive validation for user inputs with detailed error messages
 * Based on Instagram's actual username rules and production patterns
 */

// =============================================================================
// TYPES
// =============================================================================

export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

// =============================================================================
// INSTAGRAM USERNAME VALIDATION
// =============================================================================

/**
 * Instagram username validation regex
 * Rules:
 * - 1-30 characters
 * - Letters, numbers, periods, underscores only
 * - Cannot start/end with period
 * - No consecutive periods
 */
const INSTAGRAM_USERNAME_REGEX = /^[a-zA-Z0-9._]{1,30}$/;

/**
 * Validate Instagram username with detailed feedback
 */
export function validateInstagramUsername(username: string): ValidationResult {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username is required' };
  }

  // Remove @ if present and trim
  const cleaned = username.replace(/^@/, '').trim();

  if (cleaned.length === 0) {
    return { valid: false, error: 'Username is required' };
  }

  if (cleaned.length > 30) {
    return { valid: false, error: 'Username must be 30 characters or less' };
  }

  // Check for invalid characters
  if (!INSTAGRAM_USERNAME_REGEX.test(cleaned)) {
    return { 
      valid: false, 
      error: 'Only letters, numbers, periods, and underscores allowed' 
    };
  }

  // Check period rules
  if (cleaned.startsWith('.') || cleaned.endsWith('.')) {
    return { valid: false, error: 'Username cannot start or end with a period' };
  }

  if (cleaned.includes('..')) {
    return { valid: false, error: 'Username cannot have consecutive periods' };
  }

  return { valid: true, error: null };
}

/**
 * Quick boolean check if username is valid
 */
export function isValidInstagramUsername(username: string): boolean {
  const result = validateInstagramUsername(username);
  return result.valid;
}

/**
 * Normalize Instagram username (remove @, trim, lowercase)
 */
export function normalizeInstagramUsername(username: string): string {
  if (!username) return '';
  return username.trim().replace(/^@/, '').toLowerCase();
}

/**
 * Format username with @ prefix for display
 */
export function formatInstagramUsername(username: string): string {
  if (!username) return '';
  const cleaned = normalizeInstagramUsername(username);
  return `@${cleaned}`;
}

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
