/**
 * CREDITS SERVICE HOOK
 *
 * Provides explicit refetch functionality for credit balance.
 *
 * IMPORTANT: Credits are initialized via /api/auth/bootstrap in AuthProvider.
 * This hook is ONLY for explicit refetches after:
 * - Credit purchase
 * - Subscription upgrade
 * - Manual refresh requests
 *
 * DO NOT USE for initialization - AuthProvider handles that.
 */

import { useCallback } from 'react';
import { useCreditsStore } from '../store/creditsStore';
import { httpClient } from '@/core/auth/http-client';
import { logger } from '@/core/utils/logger';

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
   * Refetch current balance from API
   *
   * USE CASES:
   * - After credit purchase (to reflect new balance)
   * - After subscription upgrade (to reflect new credits)
   * - Manual refresh requests
   *
   * NOT FOR INITIALIZATION - AuthProvider handles that via bootstrap
   */
  const refetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await httpClient.get<{ data: CreditBalance }>('/api/credits/balance');
      setBalance(data.data);

    } catch (error) {
      const err = error as Error;
      const errorMessage = err?.message || '';
      if (errorMessage.toLowerCase().includes('onboarding')) {
        logger.warn('[useCreditsService] Skipping fetch - onboarding not completed');
        setLoading(false);
        return;
      }

      logger.error('[useCreditsService] Fetch error', err);
      setError(err.message || 'Failed to load balance');
    }
  }, [setBalance, setLoading, setError]);

  /**
   * Clear balance (call on logout)
   */
  const clearCreditsBalance = useCallback(() => {
    clearBalance();
  }, [clearBalance]);

  return {
    refetchBalance,
    clearCreditsBalance,
  };
}
