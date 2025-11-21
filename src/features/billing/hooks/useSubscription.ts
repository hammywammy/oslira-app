// src/features/billing/hooks/useSubscription.ts

/**
 * USE SUBSCRIPTION HOOK
 * 
 * Fetches current subscription data for authenticated user.
 * Used by UpgradePage to show current tier and enable/disable actions.
 * 
 * BACKEND ENDPOINT:
 * GET /api/billing/subscription
 * 
 * RETURNS:
 * - Current tier
 * - Credits remaining
 * - Light analyses remaining
 * - Billing period dates
 * - Stripe subscription status
 */

import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@/core/auth/http-client';
import { Subscription } from '../types/billing.types';

// =============================================================================
// HOOK
// =============================================================================

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const response = await httpClient.get<Subscription>('/api/billing/subscription');
      return response;
    },
    staleTime: 60 * 1000, // 1 minute (billing data changes infrequently)
    retry: 1,
  });
}
