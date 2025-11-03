// src/features/credits/hooks/useCreditsService.ts

/**
 * CREDITS SERVICE HOOK
 * 
 * Fetches balance from API and updates store.
 * Call this on auth success to initialize balance.
 */

import { useCallback } from 'react';
import { useCreditsStore } from '../store/creditsStore';
import { apiClient } from '@/shared/services/api-client';

export function useCreditsService() {
  const { setBalance, setLoading, setError, clearBalance } = useCreditsStore();

  /**
   * Fetch current balance from API
   */
  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/api/credits/balance');
      
      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }

      const data = await response.json();
      setBalance(data.data);
      
    } catch (error: any) {
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
