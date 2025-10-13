/**
 * @file Supabase Client
 * @description Supabase client configuration with automatic token refresh
 * 
 * Features:
 * - Singleton Supabase client
 * - Automatic token refresh
 * - Session persistence
 * - Type-safe database access
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENV, validateEnv } from '@/core/config/env';
import { AUTH } from '@/core/config/constants';
import { logger } from '@/core/utils/logger';

// Validate environment before creating client
validateEnv();

// =============================================================================
// CLIENT CONFIGURATION
// =============================================================================

/**
 * Create Supabase client with auto-refresh
 * Preserves AuthManager.js token refresh behavior
 */
export const supabase: SupabaseClient = createClient(
  ENV.supabaseUrl,
  ENV.supabaseAnonKey,
  {
    auth: {
      // Persist session in localStorage (like AuthManager.js)
      persistSession: true,
      storageKey: AUTH.STORAGE_KEY,
      
      // Auto-refresh tokens (preserves TokenRefresher.js logic)
      autoRefreshToken: true,
      
      // Detect session changes (preserves SessionValidator.js logic)
      detectSessionInUrl: true,
      
      // Flow type for OAuth
      flowType: 'pkce',
    },
    
    // Global options
    global: {
      headers: {
        'x-client-info': 'oslira-v2',
      },
    },
    
    // Database options
    db: {
      schema: 'public',
    },
    
    // Real-time options (for future use)
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// =============================================================================
// TOKEN REFRESH MONITORING (preserves TokenRefresher.js behavior)
// =============================================================================

/**
 * Monitor token refresh events
 * This replaces the manual TokenRefresher.js class
 */
supabase.auth.onAuthStateChange((event, session) => {
  logger.debug('Auth state changed', { event, hasSession: !!session });

  switch (event) {
    case 'SIGNED_IN':
      logger.info('User signed in', {
        userId: session?.user?.id,
        expiresAt: session?.expires_at,
      });
      break;

    case 'SIGNED_OUT':
      logger.info('User signed out');
      break;

    case 'TOKEN_REFRESHED':
      logger.info('Token refreshed', {
        expiresAt: session?.expires_at,
      });
      break;

    case 'USER_UPDATED':
      logger.info('User updated', {
        userId: session?.user?.id,
      });
      break;

    case 'PASSWORD_RECOVERY':
      logger.info('Password recovery initiated');
      break;
  }
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get current session
 * Replaces AuthManager.getCurrentSession()
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    logger.error('Failed to get session', error);
    return null;
  }
  
  return data.session;
}

/**
 * Get current user
 * Replaces AuthManager.getCurrentUser()
 */
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    logger.error('Failed to get user', error);
    return null;
  }
  
  return data.user;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

/**
 * Sign out user
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    logger.error('Sign out failed', error);
    throw error;
  }
  
  logger.info('User signed out successfully');
}

// =============================================================================
// EXPORTS
// =============================================================================

export default supabase;
