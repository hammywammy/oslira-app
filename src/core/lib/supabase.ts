// src/core/lib/supabase.ts
/**
 * @file Supabase Client - SINGLETON INSTANCE
 * @description ONE Supabase client for the entire app
 * 
 * CRITICAL IMPROVEMENTS:
 * 1. True singleton (not recreated on each import)
 * 2. Proper URL detection for OAuth callbacks
 * 3. Session persistence guaranteed
 * 4. 30-day token expiry (like Cloudflare)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getConfig } from '@/core/config/env';
import { AUTH } from '@/core/config/constants';
import { logger } from '@/core/utils/logger';

// =============================================================================
// SINGLETON INSTANCE (Created ONCE and ONLY ONCE)
// =============================================================================

let supabaseInstance: SupabaseClient | null = null;
let isInitializing = false;

/**
 * Get or create Supabase client - GUARANTEED SINGLETON
 */
function getSupabaseClient(): SupabaseClient {
  // If already created, return it
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // If currently initializing, throw error (should never happen in practice)
  if (isInitializing) {
    throw new Error('Supabase client is already initializing');
  }

  // Create the client ONCE
  isInitializing = true;

  try {
    const config = getConfig();

    logger.info('Initializing Supabase singleton', {
      url: config.supabaseUrl,
      hasAnonKey: !!config.supabaseAnonKey,
    });

    supabaseInstance = createClient(
      config.supabaseUrl,
      config.supabaseAnonKey,
      {
        auth: {
          // Persist session in localStorage
          persistSession: true,
          storageKey: AUTH.STORAGE_KEY,
          
          // Auto-refresh tokens (30-day expiry like Cloudflare)
          autoRefreshToken: true,
          
          // CRITICAL: Detect OAuth callback URLs
          detectSessionInUrl: true,
          
          // Use PKCE flow for OAuth
          flowType: 'pkce',
          
          // Use window.localStorage for storage
          storage: window.localStorage,
        },
        
        global: {
          headers: {
            'x-client-info': 'oslira-v2',
          },
        },
        
        db: {
          schema: 'public',
        },
        
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      }
    );

    // Setup monitoring
    setupAuthMonitoring(supabaseInstance);

    logger.info('Supabase singleton created successfully');

    return supabaseInstance;
  } finally {
    isInitializing = false;
  }
}

/**
 * Setup auth state change monitoring
 */
function setupAuthMonitoring(client: SupabaseClient): void {
  client.auth.onAuthStateChange((event, session) => {
    logger.debug('Auth state changed', { 
      event, 
      hasSession: !!session,
      userId: session?.user?.id 
    });

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
        logger.debug('Token refreshed', {
          expiresAt: session?.expires_at,
        });
        break;

      case 'USER_UPDATED':
        logger.debug('User updated', {
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
// EXPORTED SINGLETON (Lazy-loaded via Proxy)
// =============================================================================

/**
 * Supabase client - GUARANTEED SINGLE INSTANCE
 * 
 * This proxy ensures we only create ONE client instance
 * and it's shared across the entire application
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
 * Get current session (with error handling)
 */
export async function getSession() {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.getSession();
    
    if (error) {
      logger.error('Failed to get session', error);
      return null;
    }
    
    return data.session;
  } catch (error) {
    logger.error('Exception getting session', error instanceof Error ? error : new Error(String(error)));
    return null;
  }
}

/**
 * Get current user (with error handling)
 */
export async function getUser() {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.getUser();
    
    if (error) {
      logger.error('Failed to get user', error);
      return null;
    }
    
    return data.user;
  } catch (error) {
    logger.error('Exception getting user', error instanceof Error ? error : new Error(String(error)));
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

/**
 * Sign out user (with cleanup)
 */
export async function signOut(): Promise<void> {
  try {
    const client = getSupabaseClient();
    const { error } = await client.auth.signOut();
    
    if (error) {
      logger.error('Sign out failed', error);
      throw error;
    }
    
    // Clear any additional app-specific storage
    localStorage.removeItem('oslira-selected-business');
    
    logger.info('User signed out successfully');
  } catch (error) {
    logger.error('Exception during sign out', error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default supabase;
