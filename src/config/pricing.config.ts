// src/config/pricing.config.ts

/**
 * PRICING CONFIGURATION - SINGLE SOURCE OF TRUTH
 * 
 * Central definition of all pricing tiers, features, and costs.
 * Used by both marketing and in-app pricing pages.
 * 
 * DESIGN PHILOSOPHY:
 * - Type-safe tier definitions
 * - Feature flags for easy updates
 * - Cost constants for margin tracking
 * - Queue priorities for system behavior
 * 
 * MAINTENANCE:
 * - Update prices here ONLY
 * - All UI components derive from this config
 * - Backend should sync from database (pricing_tiers table)
 */

// =============================================================================
// TYPES
// =============================================================================

export type TierName = 'free' | 'growth' | 'pro' | 'agency' | 'enterprise';

export interface PricingTier {
  id: TierName;
  name: string;
  displayName: string;
  price: number;
  credits: number;
  lightQuota: number;
  
  // System limits
  lightRateLimit: number;
  concurrentSlots: number;
  queuePriority: number;
  bulkMax: number;
  
  // Features
  features: {
    support: string[];
    dataExport: string[];
    historyDays: number;
    bulkUpload: boolean;
    priorityQueue: boolean;
    apiAccess: boolean;
  };
  
  // UI presentation
  description: string;
  highlighted?: boolean;
  badge?: string;
  ctaText: string;
}

// =============================================================================
// PRICING TIERS
// =============================================================================

export const PRICING_TIERS: Record<TierName, PricingTier> = {
  free: {
    id: 'free',
    name: 'Free',
    displayName: 'Free',
    price: 0,
    credits: 10,
    lightQuota: 10,
    lightRateLimit: 5,
    concurrentSlots: 1,
    queuePriority: 4,
    bulkMax: 5,
    features: {
      support: ['Community'],
      dataExport: ['CSV'],
      historyDays: 30,
      bulkUpload: false,
      priorityQueue: false,
      apiAccess: false,
    },
    description: 'Perfect for testing and small projects',
    ctaText: 'Start Free',
  },

  growth: {
    id: 'growth',
    name: 'Growth',
    displayName: 'Growth',
    price: 29,
    credits: 250,
    lightQuota: 250,
    lightRateLimit: 25,
    concurrentSlots: 2,
    queuePriority: 3,
    bulkMax: 25,
    features: {
      support: ['Email Support'],
      dataExport: ['CSV'],
      historyDays: 60,
      bulkUpload: true,
      priorityQueue: false,
      apiAccess: false,
    },
    description: 'For solopreneurs scaling their outreach',
    ctaText: 'Start Growth',
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    displayName: 'Pro',
    price: 99,
    credits: 1500,
    lightQuota: 1500,
    lightRateLimit: 150,
    concurrentSlots: 5,
    queuePriority: 2,
    bulkMax: 100,
    features: {
      support: ['Priority Email'],
      dataExport: ['CSV', 'JSON'],
      historyDays: 180,
      bulkUpload: true,
      priorityQueue: true,
      apiAccess: false,
    },
    description: 'Most popular for growing businesses',
    highlighted: true,
    badge: 'Most Popular',
    ctaText: 'Start Pro',
  },

  agency: {
    id: 'agency',
    name: 'Agency',
    displayName: 'Agency',
    price: 299,
    credits: 5000,
    lightQuota: 5000,
    lightRateLimit: 500,
    concurrentSlots: 10,
    queuePriority: 2,
    bulkMax: 250,
    features: {
      support: ['Priority Support'],
      dataExport: ['CSV', 'JSON'],
      historyDays: 365,
      bulkUpload: true,
      priorityQueue: true,
      apiAccess: false,
    },
    description: 'Built for agencies and teams',
    ctaText: 'Start Agency',
  },

  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    displayName: 'Enterprise',
    price: 999,
    credits: 20000,
    lightQuota: 20000,
    lightRateLimit: 2000,
    concurrentSlots: 20,
    queuePriority: 1,
    bulkMax: 500,
    features: {
      support: ['Dedicated Support', 'Slack Connect'],
      dataExport: ['CSV', 'JSON', 'API'],
      historyDays: -1, // unlimited
      bulkUpload: true,
      priorityQueue: true,
      apiAccess: true,
    },
    description: 'Maximum performance and priority',
    badge: 'Premium',
    ctaText: 'Start Enterprise',
  },
};

// =============================================================================
// ANALYSIS COSTS
// =============================================================================

export const ANALYSIS_COSTS = {
  light: 0,
  deep: 1,
  xray: 2,
} as const;

// =============================================================================
// TIER ARRAYS (for iteration)
// =============================================================================

// All tiers (for marketing page)
export const ALL_TIERS: TierName[] = ['free', 'growth', 'pro', 'agency', 'enterprise'];

// Paid tiers only (for upgrade page)
export const PAID_TIERS: TierName[] = ['growth', 'pro', 'agency', 'enterprise'];

// =============================================================================
// FEATURE DEFINITIONS (for feature comparison)
// =============================================================================

export interface FeatureDefinition {
  id: string;
  label: string;
  tooltip?: string;
  getValue: (tier: PricingTier) => string | number | boolean;
}

export const FEATURE_LIST: FeatureDefinition[] = [
  {
    id: 'credits',
    label: 'Monthly Credits',
    tooltip: 'Credits for Deep and X-Ray analyses',
    getValue: (tier) => `${tier.credits.toLocaleString()} credits`,
  },
  {
    id: 'light',
    label: 'Light Analyses',
    tooltip: 'Fast profile scans included free',
    getValue: (tier) => `${tier.lightQuota.toLocaleString()} analyses`,
  },
  {
    id: 'bulk',
    label: 'Bulk Upload',
    tooltip: 'Maximum profiles per bulk upload',
    getValue: (tier) => tier.bulkMax > 0 ? `Up to ${tier.bulkMax}` : 'Not available',
  },
  {
    id: 'history',
    label: 'Analysis History',
    tooltip: 'How long we store your analysis results',
    getValue: (tier) => tier.features.historyDays === -1 ? 'Unlimited' : `${tier.features.historyDays} days`,
  },
  {
    id: 'support',
    label: 'Support',
    getValue: (tier) => tier.features.support.join(', '),
  },
  {
    id: 'priority',
    label: 'Priority Queue',
    tooltip: 'Faster analysis processing',
    getValue: (tier) => tier.features.priorityQueue,
  },
  {
    id: 'export',
    label: 'Data Export',
    getValue: (tier) => tier.features.dataExport.join(', '),
  },
];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get tier by ID
 */
export function getTier(tierId: TierName): PricingTier {
  return PRICING_TIERS[tierId];
}

/**
 * Get price per credit (for value comparison)
 */
export function getPricePerCredit(tierId: TierName): number {
  const tier = PRICING_TIERS[tierId];
  if (tier.price === 0) return 0;
  return tier.price / tier.credits;
}

/**
 * Calculate savings vs Growth tier
 */
export function getSavingsVsGrowth(tierId: TierName): number {
  if (tierId === 'free' || tierId === 'growth') return 0;
  
  const growthCostPerCredit = getPricePerCredit('growth');
  const tierCostPerCredit = getPricePerCredit(tierId);
  
  return Math.round((1 - tierCostPerCredit / growthCostPerCredit) * 100);
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return price === 0 ? 'Free' : `$${price}`;
}

/**
 * Get tier order index (for comparisons)
 */
export function getTierOrder(tierId: TierName): number {
  return ALL_TIERS.indexOf(tierId);
}

/**
 * Check if upgrade (tier order increases)
 */
export function isUpgrade(fromTier: TierName, toTier: TierName): boolean {
  return getTierOrder(toTier) > getTierOrder(fromTier);
}
