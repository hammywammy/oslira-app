/**
 * CREDITS STORE - FEATURE-ISOLATED STATE MANAGEMENT
 * 
 * Manages credit balance state independently from global store.
 * Integrates with /api/credits endpoints.
 * 
 * ARCHITECTURE:
 * - Feature-based isolation (recommended by Zustand maintainers 2024)
 * - Initialized on auth success
 * - Type-safe selectors
 * - DevTools integration
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CreditBalance {
  account_id: string;
  credit_balance: number;
  light_analyses_balance: number;
  last_transaction_at: string | null;
  created_at: string;
  updated_at: string;
}

interface CreditsState {
  // State
  balance: CreditBalance | null;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null;

  // Actions
  setBalance: (balance: CreditBalance) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearBalance: () => void;
  
  // Computed helpers
  getCurrentBalance: () => number;
  getLightBalance: () => number;
  getLastUpdated: () => string | null;
}

export const useCreditsStore = create<CreditsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      balance: null,
      isLoading: false,
      error: null,
      lastFetchedAt: null,

      // Actions
      setBalance: (balance: CreditBalance) =>
        set({
          balance,
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

      clearBalance: () =>
        set({
          balance: null,
          isLoading: false,
          error: null,
          lastFetchedAt: null,
        }),

      // Computed helpers
      getCurrentBalance: () => get().balance?.credit_balance ?? 0,
      getLightBalance: () => get().balance?.light_analyses_balance ?? 0,
      getLastUpdated: () => get().balance?.last_transaction_at ?? null,
    }),
    {
      name: 'OsliraCreditsStore',
    }
  )
);

// SELECTORS (for component consumption)
export const useCurrentBalance = () =>
  useCreditsStore((state) => state.balance?.credit_balance ?? 0);

export const useLightBalance = () => 
  useCreditsStore((state) => state.balance?.light_analyses_balance ?? 0);

export const useCreditsLoading = () => 
  useCreditsStore((state) => state.isLoading);

export const useCreditsError = () => 
  useCreditsStore((state) => state.error);

export const useFullBalance = () => 
  useCreditsStore((state) => state.balance);
