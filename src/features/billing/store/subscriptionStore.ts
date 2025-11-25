// src/features/billing/store/subscriptionStore.ts

/**
 * SUBSCRIPTION STORE - FEATURE-ISOLATED STATE MANAGEMENT
 *
 * Manages subscription state independently from global store.
 * Hydrated by AuthProvider via bootstrap endpoint.
 *
 * ARCHITECTURE:
 * - Feature-based isolation (recommended by Zustand maintainers 2024)
 * - Initialized on auth success via bootstrap
 * - Type-safe selectors
 * - DevTools integration
 * - Mirrors credits store pattern
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TierName } from '@/config/pricing.config';

// =============================================================================
// TYPES
// =============================================================================

export interface Subscription {
  id: string;
  tier: TierName;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
}

interface SubscriptionState {
  // State
  subscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null;

  // Actions
  setSubscription: (subscription: Subscription | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSubscription: () => void;

  // Computed helpers
  getCurrentTier: () => TierName;
  getStatus: () => string;
}

// =============================================================================
// STORE
// =============================================================================

export const useSubscriptionStore = create<SubscriptionState>()(
  devtools(
    (set, get) => ({
      // Initial state
      subscription: null,
      isLoading: false,
      error: null,
      lastFetchedAt: null,

      // Actions
      setSubscription: (subscription: Subscription | null) =>
        set({
          subscription,
          isLoading: false,
          error: null,
          lastFetchedAt: Date.now(),
        }),

      setLoading: (loading: boolean) =>
        set({ isLoading: loading }),

      setError: (error: string | null) =>
        set({
          error,
          isLoading: false,
        }),

      clearSubscription: () =>
        set({
          subscription: null,
          isLoading: false,
          error: null,
          lastFetchedAt: null,
        }),

      // Computed helpers
      getCurrentTier: () => get().subscription?.tier ?? 'free',
      getStatus: () => get().subscription?.status ?? 'active',
    }),
    {
      name: 'OsliraSubscriptionStore',
    }
  )
);

// =============================================================================
// SELECTORS (for component consumption)
// =============================================================================

export const useCurrentTier = () =>
  useSubscriptionStore((state) => state.subscription?.tier ?? 'free');

export const useSubscriptionStatus = () =>
  useSubscriptionStore((state) => state.subscription?.status ?? 'active');

export const useCurrentPeriodEnd = () =>
  useSubscriptionStore((state) => state.subscription?.current_period_end ?? null);

export const useSubscriptionLoading = () =>
  useSubscriptionStore((state) => state.isLoading);

export const useSubscriptionError = () =>
  useSubscriptionStore((state) => state.error);

export const useFullSubscription = () =>
  useSubscriptionStore((state) => state.subscription);
