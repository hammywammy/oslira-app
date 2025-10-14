/**
 * @file Supabase Client
 * @description Supabase client configuration with automatic token refresh
 * 
 * Features:
 * - Singleton Supabase client (lazy initialization)
 * - Automatic token refresh
 * - Session persistence
 * - Type-safe database access
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getConfig } from '@/core/config/env';
import { AUTH } from '@/core/config/constants';
import { logger } from '@/core/utils/logger';

// =============================================================================
// LAZY INITIALIZATION
// =============================================================================

let supabaseInstance: SupabaseClient | null = null;

/**
 * Get or create Supabase client
 * IMPORTANT: Config must be loaded before calling this
 */
function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Get config (will throw if not loaded - that's intentional)
  const config = getConfig();

  logger.info('Initializing Supabase client...', {
    url: config.supabaseUrl,
    hasAnonKey: !!config.supabaseAnonKey,
  });

  // Create client
  supabaseInstance = createClient(
    config.supabaseUrl,
    config.supabaseAnonKey,
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

  // Setup auth state monitoring
  setupAuthMonitoring(supabaseInstance);

  logger.info('Supabase client initialized successfully');

  return supabaseInstance;
}

/**
 * Setup auth state change monitoring
 */
function setupAuthMonitoring(client: SupabaseClient): void {
  client.auth.onAuthStateChange((event, session) => {
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
}

// =============================================================================
// EXPORTED SINGLETON (LAZY)
// =============================================================================

/**
 * Supabase client instance (lazy-loaded)
 * Will be created on first access after config is loaded
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const value = client[prop as keyof SupabaseClient];
    
    // Bind methods to maintain correct 'this' context
    if (typeof value === 'function') {
      return value.bind(client);
    }
    
    return value;
  },
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get current session
 * Replaces AuthManager.getCurrentSession()
 */
export async function getSession() {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.getSession();
  
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
  const client = getSupabaseClient();
  const { data, error } = await client.auth.getUser();
  
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
  const client = getSupabaseClient();
  const { error } = await client.auth.signOut();
  
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
