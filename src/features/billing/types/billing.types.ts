// src/features/billing/types/billing.types.ts

/**
 * BILLING TYPES
 * 
 * Type definitions for subscription, usage tracking, and billing operations.
 * Matches database schema from billing system document.
 */

import { TierName } from '@/config/pricing.config';

// =============================================================================
// SUBSCRIPTION
// =============================================================================

export interface Subscription {
  id: string;
  accountId: string;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  tier: TierName;
  status: SubscriptionStatus;
  currentPeriodStart: string; // ISO timestamp
  currentPeriodEnd: string; // ISO timestamp
  creditsRemaining: number;
  lightRemaining: number;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionStatus = 
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'unpaid'
  | 'trialing';

// =============================================================================
// USAGE TRACKING
// =============================================================================

export interface UsageStats {
  accountId: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  
  // Light analyses
  lightUsed: number;
  lightQuota: number;
  lightRemaining: number;
  
  // Credits
  creditsUsed: number;
  creditsAllocated: number;
  creditsRemaining: number;
  
  // Analysis breakdown
  deepCount: number;
  xrayCount: number;
}

// =============================================================================
// BILLING OPERATIONS
// =============================================================================

export interface UpgradeRequest {
  newTier: TierName;
  // Stripe will handle payment on backend
}

export interface UpgradeResponse {
  success: boolean;
  checkoutUrl?: string; // Stripe Checkout URL
  error?: string;
}

export interface DowngradeRequest {
  newTier: TierName;
  reason?: string;
}

export interface DowngradeResponse {
  success: boolean;
  effectiveDate: string; // When downgrade takes effect
  message: string;
}

// =============================================================================
// STRIPE RESPONSES
// =============================================================================

export interface StripeCheckoutSession {
  id: string;
  url: string;
  expiresAt: number;
}
