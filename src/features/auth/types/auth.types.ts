/**
 * @file Auth Types
 * @description Type definitions for authentication system
 */

import { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

// =============================================================================
// USER TYPES
// =============================================================================

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  account_id: string;
  plan_type: 'free' | 'growth' | 'pro' | 'agency' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  current_period_start: string;
  current_period_end: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
}

export interface User extends SupabaseUser {
  profile?: UserProfile;
  subscription?: UserSubscription;
}

// =============================================================================
// SESSION TYPES
// =============================================================================

export type Session = SupabaseSession;

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// =============================================================================
// AUTH FORM TYPES
// =============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  full_name?: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  password: string;
}

// =============================================================================
// AUTH EVENTS
// =============================================================================

export type AuthEvent =
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'TOKEN_REFRESHED'
  | 'USER_UPDATED'
  | 'PASSWORD_RECOVERY';

export interface AuthEventPayload {
  event: AuthEvent;
  session: Session | null;
  user: User | null;
}

// =============================================================================
// OAUTH TYPES
// =============================================================================

export type OAuthProvider = 'google' | 'github' | 'azure';

export interface OAuthOptions {
  provider: OAuthProvider;
  redirectTo?: string;
  scopes?: string;
}

// =============================================================================
// TOKEN TYPES
// =============================================================================

export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  expiresIn: number;
}

// =============================================================================
// AUTH ERROR TYPES
// =============================================================================

export interface AuthError {
  code: string;
  message: string;
  status?: number;
}

export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'invalid_credentials',
  EMAIL_NOT_CONFIRMED: 'email_not_confirmed',
  USER_NOT_FOUND: 'user_not_found',
  WEAK_PASSWORD: 'weak_password',
  EMAIL_ALREADY_EXISTS: 'email_already_exists',
  SESSION_EXPIRED: 'session_expired',
  NETWORK_ERROR: 'network_error',
  UNKNOWN_ERROR: 'unknown_error',
} as const;

export type AuthErrorCode = typeof AUTH_ERROR_CODES[keyof typeof AUTH_ERROR_CODES];
