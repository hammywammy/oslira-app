// src/features/credits/hooks/useCreditsService.ts

/**
 * CREDITS SERVICE HOOK
 * 
 * Fetches balance from API and updates store.
 * Call this on auth success to initialize balance.
 */

import { useCallback } from 'react';
import { useCreditsStore } from '../store/creditsStore';
import { httpClient } from '@/core/auth/http-client';

interface CreditBalance {
  account_id: string;
  credit_balance: number;
  light_analyses_balance: number;
  last_transaction_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useCreditsService() {
  const { setBalance, setLoading, setError, clearBalance } = useCreditsStore();

  /**
   * Fetch current balance from API
   */
  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await httpClient.get<{ data: CreditBalance }>('/api/credits/balance');
      setBalance(data.data);

    } catch (error: any) {
      // Handle 403 "onboarding not completed" silently - this is an expected flow state
      const errorMessage = error?.message || '';
      if (errorMessage.toLowerCase().includes('onboarding')) {
        console.warn('[useCreditsService] Skipping fetch - onboarding not completed');
        setLoading(false);
        return;
      }

      // All other errors are unexpected and should be logged
      console.error('[useCreditsService] Fetch error:', error);
      setError(error.message || 'Failed to load balance');
    }
  }, [setBalance, setLoading, setError]);

  /**
   * Clear balance (call on logout)
   */
  const clearCreditsBalance = useCallback(() => {
    clearBalance();
  }, [clearBalance]);

  return {
    fetchBalance,
    clearCreditsBalance,
  };
}
