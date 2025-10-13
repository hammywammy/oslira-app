/**
 * @file Crypto Utilities
 * @description Migrated from CryptoUtils.js - preserves ALL crypto logic
 * 
 * Features:
 * - UUID generation
 * - Random ID generation
 * - SHA-256 hashing
 * - Base64 encoding/decoding
 * - Secure random strings
 */

// =============================================================================
// UUID GENERATION
// =============================================================================

/**
 * Generate UUID v4
 * Uses native crypto.randomUUID() if available, otherwise fallback
 */
export function uuid(): string {
  // Use native implementation if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// =============================================================================
// RANDOM ID GENERATION
// =============================================================================

/**
 * Generate random alphanumeric ID
 * Example: "a3f9c2" (length 6)
 */
export function randomId(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
for (let i = 0; i < length; i++) {
  const value = randomValues[i];
  if (value !== undefined) {
    result += chars[value % chars.length] ?? ''; // Nullish coalescing
  }
}
  
  return result;
}

/**
 * Generate random hex string
 * Example: "a3f9c2e1" (length 8)
 */
export function randomHex(length = 16): string {
  const bytes = new Uint8Array(Math.ceil(length / 2));
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length);
}

/**
 * Generate secure random string with custom charset
 */
export function randomString(length: number, charset?: string): string {
  const defaultCharset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const chars = charset || defaultCharset;
  
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  let result = '';
  for (let i = 0; i < length; i++) {
    const value = randomValues[i];
    if (value !== undefined) {
      result += chars[value % chars.length] || '';
    }
  }
  
  return result;
}

/**
 * Generate random number within range
 */
export function randomInt(min: number, max: number): number {
  const range = max - min + 1;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const maxValid = Math.floor(256 ** bytesNeeded / range) * range - 1;
  
  const randomBytes = new Uint8Array(bytesNeeded);
  
  let result: number;
  do {
    crypto.getRandomValues(randomBytes);
    result = randomBytes.reduce((acc, byte, i) => {
      const value = byte ?? 0; // Handle undefined
      return acc + value * 256 ** i;
    }, 0);
  } while (result > maxValid);
  
  return min + (result % range);
}

// =============================================================================
// HASHING
// =============================================================================

/**
 * Generate SHA-256 hash
 * Returns hex string
 */
export async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate simple hash (non-cryptographic, for cache keys)
 */
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

// =============================================================================
// BASE64 ENCODING/DECODING
// =============================================================================

/**
 * Encode string to Base64
 */
export function toBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

/**
 * Decode Base64 to string
 */
export function fromBase64(base64: string): string {
  return decodeURIComponent(escape(atob(base64)));
}

/**
 * Encode array buffer to Base64
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decode Base64 to array buffer
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// =============================================================================
// URL-SAFE BASE64
// =============================================================================

/**
 * Encode to URL-safe Base64
 */
export function toBase64Url(str: string): string {
  return toBase64(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Decode from URL-safe Base64
 */
export function fromBase64Url(base64url: string): string {
  // Add padding
  let base64 = base64url;
  while (base64.length % 4) {
    base64 += '=';
  }
  
  // Replace URL-safe characters
  base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
  
  return fromBase64(base64);
}

// =============================================================================
// PASSWORD GENERATION
// =============================================================================

/**
 * Generate secure random password
 */
export function generatePassword(length = 16): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const all = lowercase + uppercase + numbers + symbols;
  
// Ensure at least one of each type
  let password = '';
  const lowerIndex = randomInt(0, lowercase.length - 1);
  const upperIndex = randomInt(0, uppercase.length - 1);
  const numberIndex = randomInt(0, numbers.length - 1);
  const symbolIndex = randomInt(0, symbols.length - 1);
  
  password += lowercase[lowerIndex] ?? 'a';
  password += uppercase[upperIndex] ?? 'A';
  password += numbers[numberIndex] ?? '0';
  password += symbols[symbolIndex] ?? '!';
  
  // Fill rest with random characters
  for (let i = password.length; i < length; i++) {
    const randomIndex = randomInt(0, all.length - 1);
    password += all[randomIndex] ?? 'x';
  }
  
  // Shuffle password
  return password
    .split('')
    .sort(() => randomInt(0, 1) - 0.5)
    .join('');
}

/**
 * Generate memorable password (easier to type)
 */
export function generateMemorablePassword(wordCount = 4): string {
  const words = [
    'alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel',
    'india', 'juliet', 'kilo', 'lima', 'mike', 'november', 'oscar', 'papa',
    'quebec', 'romeo', 'sierra', 'tango', 'uniform', 'victor', 'whiskey',
    'xray', 'yankee', 'zulu',
  ];
  
  let password = '';
  for (let i = 0; i < wordCount; i++) {
    const word = words[randomInt(0, words.length - 1)];
    if (word) { // Handle undefined
      const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
      password += capitalized;
      
      if (i < wordCount - 1) {
        password += randomInt(0, 9).toString();
      }
    }
  }
  
  return password;
}

// =============================================================================
// TOKEN GENERATION
// =============================================================================

/**
 * Generate secure token (for API keys, reset tokens, etc.)
 */
export function generateToken(length = 32): string {
  return randomHex(length);
}

/**
 * Generate short code (for verification, OTP, etc.)
 */
export function generateCode(length = 6): string {
  const digits = '0123456789';
  let code = '';
  
  for (let i = 0; i < length; i++) {
    code += digits[randomInt(0, digits.length - 1)];
  }
  
  return code;
}

/**
 * Generate alphanumeric code (easier to type than hex)
 */
export function generateAlphanumericCode(length = 8): string {
  return randomString(length, 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'); // Excludes similar looking chars
}

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Check if browser supports Web Crypto API
 */
export function isWebCryptoSupported(): boolean {
  return typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined';
}

/**
 * Generate checksum for data integrity
 */
export async function generateChecksum(data: string): Promise<string> {
  return await sha256(data);
}

/**
 * Verify checksum
 */
export async function verifyChecksum(data: string, checksum: string): Promise<boolean> {
  const computed = await generateChecksum(data);
  return computed === checksum;
}
