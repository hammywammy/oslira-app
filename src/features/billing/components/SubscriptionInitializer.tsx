// src/features/billing/components/SubscriptionInitializer.tsx

/**
 * SUBSCRIPTION INITIALIZER
 *
 * Initializes the subscription store when user is authenticated.
 * Fetches subscription data from backend and populates Zustand store.
 *
 * ARCHITECTURE:
 * - Mirrors CreditsInitializer pattern for consistency
 * - Fetches from /api/billing/subscription
 * - Populates appStore.subscription with plan_type, status, etc.
 *
 * USAGE:
 * Place this component inside AuthProvider in App.tsx
 */

import { useEffect, useRef } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { useAppStore } from '@/core/store/appStore';
import { httpClient } from '@/core/auth/http-client';
import { logger } from '@/core/utils/logger';

interface SubscriptionResponse {
  id: string;
  accountId: string;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  tier: 'free' | 'growth' | 'pro' | 'agency' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  creditsRemaining: number;
  lightRemaining: number;
  createdAt: string;
  updatedAt: string;
}

export function SubscriptionInitializer() {
  const { isFullyReady, isAuthenticated, user } = useAuth();
  const setSubscription = useAppStore((state) => state.setSubscription);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchSubscription() {
      try {
        const data = await httpClient.get<SubscriptionResponse>('/api/billing/subscription');

        if (!cancelled) {
          // Map API response to Zustand store format
          setSubscription({
            id: data.id,
            account_id: data.accountId,
            plan_type: data.tier,
            status: data.status,
            current_period_start: data.currentPeriodStart,
            current_period_end: data.currentPeriodEnd,
            stripe_customer_id: data.stripeCustomerId || undefined,
            stripe_subscription_id: data.stripeSubscriptionId || undefined,
          });

          logger.info('[SubscriptionInit] Subscription loaded', { tier: data.tier });
        }
      } catch (error: any) {
        // Don't log error for expected cases (onboarding not completed, etc.)
        if (error?.status !== 403) {
          logger.error('[SubscriptionInit] Failed to fetch subscription', error);
        }

        // Set default free plan on error
        if (!cancelled) {
          setSubscription({
            id: 'default',
            account_id: user?.id || '',
            plan_type: 'free',
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          });
        }
      }
    }

    // Guard: Only fetch when fully ready AND user has completed onboarding
    if (isFullyReady && user?.onboarding_completed && !hasFetchedRef.current) {
      fetchSubscription().then(() => {
        if (!cancelled) {
          hasFetchedRef.current = true;
        }
      });
    }

    // Reset the ref when user logs out
    if (!isAuthenticated) {
      hasFetchedRef.current = false;
      setSubscription(null);
    }

    return () => {
      cancelled = true;
    };
  }, [isFullyReady, isAuthenticated, user?.onboarding_completed, user?.id, setSubscription]);

  return null;
}
