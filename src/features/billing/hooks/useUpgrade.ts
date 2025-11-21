// src/features/billing/hooks/useUpgrade.ts

/**
 * USE UPGRADE HOOK
 * 
 * Handles tier upgrade flow with Stripe Checkout.
 * 
 * FLOW:
 * 1. User clicks "Upgrade to Pro"
 * 2. Call backend /api/billing/upgrade with newTier
 * 3. Backend creates Stripe Checkout session
 * 4. Redirect user to Stripe Checkout URL
 * 5. After payment → Stripe webhook updates subscription
 * 6. User redirected back to /dashboard/upgrade?success=true
 * 
 * ERROR HANDLING:
 * - Network errors
 * - Backend validation errors (e.g., can't downgrade via upgrade endpoint)
 * - Stripe errors
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpClient } from '@/core/http/http-client';
import { UpgradeRequest, UpgradeResponse } from '../types/billing.types';
import { TierName } from '@/config/pricing.config';
import { logger } from '@/core/utils/logger';

// =============================================================================
// HOOK
// =============================================================================

export function useUpgrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTier: TierName) => {
      logger.info('[Upgrade] Initiating upgrade', { newTier });

      const response = await httpClient.post<UpgradeResponse>(
        '/api/billing/upgrade',
        { newTier } as UpgradeRequest
      );

      if (!response.success) {
        throw new Error(response.error || 'Upgrade failed');
      }

      // Redirect to Stripe Checkout
      if (response.checkoutUrl) {
        logger.info('[Upgrade] Redirecting to Stripe Checkout');
        window.location.href = response.checkoutUrl;
      }

      return response;
    },

    onSuccess: () => {
      // Invalidate subscription cache (will refresh after Stripe redirect)
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      logger.info('[Upgrade] Success, redirecting to checkout');
    },

    onError: (error: any) => {
      logger.error('[Upgrade] Failed', { error: error.message });
    },
  });
}
