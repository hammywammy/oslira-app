/**
 * BUSINESS PROFILE PROVIDER
 *
 * PURPOSE:
 * Manages global business profile state and persists user's selected profile
 *
 * INITIALIZATION FLOW:
 * 1. Wait for user authentication (watches AuthContext.isAuthenticated)
 * 2. Fetch business profiles from API
 * 3. Populate global store (appStore.setBusinesses)
 * 4. Restore previously selected profile from localStorage
 * 5. If no saved selection or invalid → select first profile
 * 6. Persist selection to localStorage and global store
 *
 * PERSISTENCE:
 * - localStorage key: 'oslira-selected-business'
 * - Stores profile ID (UUID string)
 * - Cleared on logout (handled by authManager)
 *
 * INTEGRATION:
 * - Wraps app after AuthProvider
 * - Provides context for manual profile selection
 * - Components read from global store via selectors
 */

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { httpClient } from '@/core/auth/http-client';
import { logger } from '@/core/utils/logger';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { useAppStore } from '@/core/store/appStore';
import type { BusinessProfile, BusinessProfilesResponse } from '@/shared/types/business.types';

// =============================================================================
// CONSTANTS
// =============================================================================

const STORAGE_KEY = 'oslira-selected-business';
const DEFAULT_PAGE_SIZE = 50;

// =============================================================================
// TYPES
// =============================================================================

interface BusinessProfileContextValue {
  profiles: BusinessProfile[];
  selectedProfile: BusinessProfile | null;
  isLoading: boolean;
  error: Error | null;
  selectProfile: (profileId: string) => void;
  refreshProfiles: () => Promise<void>;
}

// =============================================================================
// CONTEXT
// =============================================================================

const BusinessProfileContext = createContext<BusinessProfileContextValue | undefined>(undefined);

// =============================================================================
// PROVIDER
// =============================================================================

export function BusinessProfileProvider({ children }: { children: ReactNode }) {
  const { isFullyReady } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get state and actions from global store
  const profiles = useAppStore((state) => state.business.all);
  const selectedProfile = useAppStore((state) => state.business.selected);
  const setBusinesses = useAppStore((state) => state.setBusinesses);
  const selectBusiness = useAppStore((state) => state.selectBusiness);

  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================

  useEffect(() => {
    // Don't fetch during OAuth callback - wait for navigation to complete
    const isOAuthCallback = window.location.pathname === '/auth/callback';

    if (isOAuthCallback) {
      return; // OAuthCallbackPage will navigate away after login()
    }

    if (isFullyReady && profiles.length === 0 && !isLoading) {
      logger.info('[BusinessProfileProvider] User authenticated and auth ready, fetching profiles');
      fetchProfiles();
    }
  }, [isFullyReady]);

  // ===========================================================================
  // API CALLS
  // ===========================================================================

  /**
   * Fetch business profiles from API and populate global store
   */
  const fetchProfiles = useCallback(async () => {
    if (!isFullyReady) {
      logger.warn('[BusinessProfileProvider] Cannot fetch profiles - not fully ready');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      logger.info('[BusinessProfileProvider] Fetching business profiles from API');

      const response = await httpClient.get<BusinessProfilesResponse>(
        `/api/business-profiles?page=1&pageSize=${DEFAULT_PAGE_SIZE}`
      );

      if (!response.success || !response.data) {
        throw new Error('Failed to fetch business profiles');
      }

      const fetchedProfiles = response.data;

      logger.info('[BusinessProfileProvider] Profiles fetched successfully', {
        count: fetchedProfiles.length,
        total: response.pagination?.total,
      });

      // Handle edge case: no profiles (shouldn't happen if onboarding completed)
      if (fetchedProfiles.length === 0) {
        logger.warn('[BusinessProfileProvider] No business profiles found - user may need to complete onboarding');
        setError(new Error('No business profiles found. Please complete onboarding.'));
        setIsLoading(false);
        return;
      }

      // Populate global store
      setBusinesses(fetchedProfiles);

      // Restore or select profile
      restoreSelection(fetchedProfiles);

    } catch (err) {
      const error = err as Error;
      logger.error('[BusinessProfileProvider] Failed to fetch profiles', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [isFullyReady, setBusinesses]);

  /**
   * Restore previously selected profile from localStorage
   * Falls back to first profile if no saved selection or invalid ID
   */
  const restoreSelection = useCallback((fetchedProfiles: BusinessProfile[]) => {
    try {
      // Read persisted selection
      const savedProfileId = localStorage.getItem(STORAGE_KEY);

      if (savedProfileId) {
        logger.info('[BusinessProfileProvider] Found saved profile ID in localStorage', {
          profileId: savedProfileId,
        });

        // Check if saved ID still exists in fetched profiles
        const savedProfile = fetchedProfiles.find((p) => p.id === savedProfileId);

        if (savedProfile) {
          logger.info('[BusinessProfileProvider] Restoring saved profile selection');
          selectBusiness(savedProfile);
          return;
        } else {
          logger.warn('[BusinessProfileProvider] Saved profile ID no longer exists, falling back to first profile');
        }
      }

      // No saved selection or invalid → select first profile
      const firstProfile = fetchedProfiles[0];
      if (firstProfile) {
        logger.info('[BusinessProfileProvider] No valid saved selection, selecting first profile');
        selectBusiness(firstProfile);
        localStorage.setItem(STORAGE_KEY, firstProfile.id);
      }

    } catch (err) {
      const error = err as Error;
      logger.error('[BusinessProfileProvider] Error restoring selection', error);

      // Fallback to first profile on any error
      const firstProfile = fetchedProfiles[0];
      if (firstProfile) {
        selectBusiness(firstProfile);
        localStorage.setItem(STORAGE_KEY, firstProfile.id);
      }
    }
  }, [selectBusiness]);

  // ===========================================================================
  // PUBLIC METHODS
  // ===========================================================================

  /**
   * Manually select a business profile
   * Updates global store and persists to localStorage
   */
  const selectProfile = useCallback((profileId: string) => {
    logger.info('[BusinessProfileProvider] Manually selecting profile', { profileId });

    const profile = profiles.find((p) => p.id === profileId);

    if (!profile) {
      logger.error(
        '[BusinessProfileProvider] Profile not found',
        new Error(`Profile not found: ${profileId}`)
      );
      return;
    }

    // Update global store
    selectBusiness(profile);

    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, profileId);
      logger.info('[BusinessProfileProvider] Profile selection persisted to localStorage');
    } catch (err) {
      const error = err as Error;
      logger.error('[BusinessProfileProvider] Failed to persist selection to localStorage', error);
    }
  }, [profiles, selectBusiness]);

  /**
   * Manually refresh profiles from API
   * Useful for components that create new profiles
   */
  const refreshProfiles = useCallback(async () => {
    logger.info('[BusinessProfileProvider] Manually refreshing profiles');
    await fetchProfiles();
  }, [fetchProfiles]);

  // ===========================================================================
  // CONTEXT VALUE
  // ===========================================================================

  const value: BusinessProfileContextValue = {
    profiles,
    selectedProfile,
    isLoading,
    error,
    selectProfile,
    refreshProfiles,
  };

  return (
    <BusinessProfileContext.Provider value={value}>
      {children}
    </BusinessProfileContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useBusinessProfile(): BusinessProfileContextValue {
  const context = useContext(BusinessProfileContext);

  if (!context) {
    throw new Error('useBusinessProfile must be used within BusinessProfileProvider');
  }

  return context;
}
