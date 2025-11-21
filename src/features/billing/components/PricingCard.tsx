// src/features/billing/components/PricingCard.tsx

/**
 * PRICING CARD - PRODUCTION GRADE
 * 
 * Reusable tier card component used by both marketing and in-app pages.
 * Design inspired by Claude.ai's "concert hall" aesthetic.
 * 
 * FEATURES:
 * - Highlighted state for "Most Popular" tier
 * - Current tier badge for authenticated users
 * - Responsive hover states
 * - CTA button with loading state
 * - Feature list with checkmarks
 * 
 * DESIGN PHILOSOPHY:
 * "Concert hall, not arcade"
 * - Subtle depth via shadows
 * - Clean typography hierarchy
 * - Purposeful color accents
 * - No flashy animations
 */

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { PricingTier } from '@/config/pricing.config';
import { Button } from '@/shared/components/ui/Button';

// =============================================================================
// TYPES
// =============================================================================

interface PricingCardProps {
  tier: PricingTier;
  isCurrentTier?: boolean;
  onSelect: (tierId: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function PricingCard({
  tier,
  isCurrentTier = false,
  onSelect,
  loading = false,
  disabled = false,
}: PricingCardProps) {
  
  // Determine if this card should be highlighted
  const isHighlighted = tier.highlighted && !isCurrentTier;
  
  // Determine button variant
  const getButtonVariant = () => {
    if (isCurrentTier) return 'secondary';
    if (isHighlighted) return 'primary';
    return 'secondary';
  };
  
  // Determine button text
  const getButtonText = () => {
    if (isCurrentTier) return 'Current Plan';
    return tier.ctaText;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`
        relative rounded-2xl border transition-all duration-300
        ${isHighlighted 
          ? 'border-primary shadow-xl shadow-primary/10 scale-105' 
          : 'border-border hover:border-primary/30 shadow-lg hover:shadow-xl'
        }
        ${isCurrentTier ? 'ring-2 ring-primary ring-offset-2' : ''}
        bg-card
      `}
    >
      {/* Badge (Most Popular / Premium / Current) */}
      {(tier.badge || isCurrentTier) && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className={`
            px-4 py-1 rounded-full text-xs font-semibold
            ${isCurrentTier 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-gradient-to-r from-primary to-secondary text-white'
            }
          `}>
            {isCurrentTier ? 'Current Plan' : tier.badge}
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {tier.displayName}
          </h3>
          <p className="text-sm text-muted-foreground">
            {tier.description}
          </p>
        </div>

        {/* Price */}
        <div className="text-center mb-8">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl font-bold text-foreground">
              ${tier.price}
            </span>
            {tier.price > 0 && (
              <span className="text-muted-foreground">/month</span>
            )}
          </div>
          
          {/* Price per credit (value comparison) */}
          {tier.price > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              ${(tier.price / tier.credits).toFixed(3)} per credit
            </p>
          )}
        </div>

        {/* CTA Button */}
        <Button
          variant={getButtonVariant()}
          size="lg"
          fullWidth
          onClick={() => onSelect(tier.id)}
          disabled={disabled || isCurrentTier}
          loading={loading}
          className="mb-8"
        >
          {getButtonText()}
        </Button>

        {/* Key Stats */}
        <div className="space-y-3 mb-8 pb-8 border-b border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Monthly Credits</span>
            <span className="font-semibold text-foreground">
              {tier.credits.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Light Analyses</span>
            <span className="font-semibold text-foreground">
              {tier.lightQuota.toLocaleString()}
            </span>
          </div>
          {tier.bulkMax > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Bulk Upload</span>
              <span className="font-semibold text-foreground">
                Up to {tier.bulkMax}
              </span>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            What's Included
          </p>
          
          <ul className="space-y-2.5">
            {/* Credits */}
            <FeatureItem>
              {tier.credits.toLocaleString()} analysis credits/month
            </FeatureItem>

            {/* Light analyses */}
            <FeatureItem>
              {tier.lightQuota.toLocaleString()} light analyses/month
            </FeatureItem>

            {/* Bulk upload */}
            {tier.features.bulkUpload && (
              <FeatureItem>
                Bulk upload (up to {tier.bulkMax} profiles)
              </FeatureItem>
            )}

            {/* History */}
            <FeatureItem>
              {tier.features.historyDays === -1 
                ? 'Unlimited analysis history' 
                : `${tier.features.historyDays}-day analysis history`
              }
            </FeatureItem>

            {/* Support */}
            <FeatureItem>
              {tier.features.support.join(' + ')}
            </FeatureItem>

            {/* Priority queue */}
            {tier.features.priorityQueue && (
              <FeatureItem>
                Priority queue processing
              </FeatureItem>
            )}

            {/* Export formats */}
            <FeatureItem>
              Export: {tier.features.dataExport.join(', ')}
            </FeatureItem>

            {/* API access */}
            {tier.features.apiAccess && (
              <FeatureItem>
                API access
              </FeatureItem>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// FEATURE ITEM
// =============================================================================

function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <Icon 
        icon="ph:check-circle-fill" 
        className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
      />
      <span className="text-sm text-foreground/90">
        {children}
      </span>
    </li>
  );
}
