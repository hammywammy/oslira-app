// src/features/dashboard/components/LeadsTable/LeadDetailModal.tsx

/**
 * LEAD DETAIL MODAL - ENTERPRISE EDITION V5.0
 *
 * Premium modal for displaying complete lead intelligence
 * Built to Stripe/Linear quality standards
 *
 * DESIGN PRINCIPLES:
 * - Sophisticated visual hierarchy with purposeful spacing (8px grid)
 * - Enterprise color system with semantic meaning
 * - Smooth micro-interactions (150-200ms, hardware-accelerated)
 * - Progressive information disclosure
 * - Accessibility-first (keyboard nav, ARIA labels, WCAG AA)
 * - Production-ready states (loading, error, empty, success)
 * - Premium dark mode (intentional, not afterthought)
 *
 * FEATURES:
 * - Hero insight section (key takeaway at-a-glance)
 * - Premium score visualization
 * - Clean header with identity + metadata
 * - Smooth tab transitions with maintained scroll
 * - Professional card design with depth system
 * - Responsive to content (smart empty states)
 */

import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/shared/components/ui/Modal';
import { LeadAvatar } from '@/shared/components/ui/LeadAvatar';
import type { Lead } from '@/shared/types/leads.types';

import { ScoreBreakdown } from './ScoreBreakdown';
import { SummaryCard } from './SummaryCard';
import { AnalyticsTab } from './AnalyticsTab';
import { ExternalLinksSection } from './ExternalLinksSection';
import { AIAnalysisSection } from './AIAnalysisSection';
import { FitReasoningSection } from './FitReasoningSection';
import { OpportunitiesSection } from './OpportunitiesSection';
import { RecommendedActionsSection } from './RecommendedActionsSection';

// =============================================================================
// TYPES
// =============================================================================

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

type TabType = 'overview' | 'analytics';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatNumber(count: number | null): string {
  if (!count) return '0';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toLocaleString();
}

function getScoreColor(score: number | null): {
  text: string;
  bg: string;
  border: string;
  icon: string;
} {
  if (score === null)
    return {
      text: 'text-gray-600 dark:text-gray-400',
      bg: 'bg-gray-50 dark:bg-gray-800/30',
      border: 'border-gray-200 dark:border-gray-700',
      icon: 'mdi:help-circle-outline',
    };
  if (score >= 80)
    return {
      text: 'text-emerald-700 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      icon: 'mdi:check-circle',
    };
  if (score >= 60)
    return {
      text: 'text-blue-700 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'mdi:lightbulb-on',
    };
  if (score >= 40)
    return {
      text: 'text-amber-700 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      icon: 'mdi:alert-circle',
    };
  return {
    text: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    icon: 'mdi:close-circle',
  };
}

function getScoreLabel(score: number | null): string {
  if (score === null) return 'Not Analyzed';
  if (score >= 80) return 'Excellent Match';
  if (score >= 60) return 'Strong Potential';
  if (score >= 40) return 'Moderate Fit';
  return 'Needs Review';
}

function getActionRecommendation(score: number | null, analysisType: string | null): string {
  if (!analysisType) return 'Run an analysis to get partnership insights';
  if (score === null) return 'Analysis in progress...';
  if (score >= 80) return 'Priority outreach recommended - strong alignment detected';
  if (score >= 60) return 'Review detailed metrics and consider outreach';
  if (score >= 40) return 'Evaluate gaps before proceeding with partnership';
  return 'Explore other leads with stronger alignment';
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Verification badge (Instagram-style blue checkmark)
 */
function VerificationBadge() {
  return (
    <svg
      className="w-5 h-5 text-blue-500 shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label="Verified account"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

/**
 * Platform badge (Instagram) with gradient
 */
function PlatformBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-full transition-all duration-200 hover:shadow-sm">
      <Icon icon="mdi:instagram" className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
      <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Instagram</span>
    </span>
  );
}

/**
 * Niche badge
 */
function NicheBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full transition-all duration-200 hover:shadow-sm">
      <span className="text-xs font-medium text-blue-700 dark:text-blue-300">NICHE</span>
    </span>
  );
}

/**
 * Business account badge
 */
function BusinessBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-full transition-all duration-200 hover:shadow-sm">
      <Icon icon="mdi:briefcase" className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
      <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Business</span>
    </span>
  );
}

/**
 * Hero Insight Section - Key takeaway at top of overview
 * Refined for Stripe-level sophistication
 */
function HeroInsight({ lead }: { lead: Lead }) {
  const { text, bg, border, icon } = getScoreColor(lead.overall_score);
  const label = getScoreLabel(lead.overall_score);
  const action = getActionRecommendation(lead.overall_score, lead.analysis_type);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border bg-white p-8 shadow-sm transition-all duration-200 hover:shadow-md border-gray-200"
    >
      <div className="flex items-start gap-5">
        {/* Icon with subtle background */}
        <div className={`p-3 rounded-lg ${bg} border ${border} shrink-0`}>
          <Icon icon={icon} className={`w-6 h-6 ${text}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
            {lead.overall_score !== null && (
              <span className={`text-3xl font-bold ${text} tracking-tight`}>
                {lead.overall_score}
                <span className="text-lg font-medium text-gray-400">/100</span>
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{action}</p>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Quick Stats Grid - Engaging visual cards with progress indicators
 */
function QuickStatsGrid({ lead }: { lead: Lead }) {
  const metrics = lead.calculated_metrics;

  const stats = [
    {
      label: 'Engagement Rate',
      value: metrics?.engagement_rate ? metrics.engagement_rate.toFixed(2) : '0',
      displayValue: metrics?.engagement_rate ? `${metrics.engagement_rate.toFixed(2)}%` : '—',
      max: 10, // 10% is excellent engagement
      icon: 'mdi:trending-up',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      barColor: 'bg-green-500',
    },
    {
      label: 'Profile Health',
      value: metrics?.profile_health_score?.toString() || '0',
      displayValue: metrics?.profile_health_score ? `${metrics.profile_health_score}/100` : '—',
      max: 100,
      icon: 'mdi:heart-pulse',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      barColor: 'bg-blue-500',
    },
    {
      label: 'Content Quality',
      value: metrics?.content_sophistication?.toString() || '0',
      displayValue: metrics?.content_sophistication ? `${metrics.content_sophistication}/100` : '—',
      max: 100,
      icon: 'mdi:star',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      barColor: 'bg-purple-500',
    },
    {
      label: 'Posting Frequency',
      value: metrics?.posting_frequency ? metrics.posting_frequency.toFixed(1) : '0',
      displayValue: metrics?.posting_frequency ? `${metrics.posting_frequency.toFixed(1)}/mo` : '—',
      max: 30, // 30 posts per month is very active
      icon: 'mdi:calendar-clock',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      barColor: 'bg-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const percentage = Math.min(100, (parseFloat(stat.value) / stat.max) * 100);

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: idx * 0.05 }}
            className="group bg-white rounded-lg border border-gray-200 p-5 transition-all duration-200 hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5"
          >
            {/* Icon */}
            <div className={`inline-flex p-2.5 rounded-lg ${stat.bgColor} mb-4 transition-transform duration-200 group-hover:scale-105`}>
              <Icon icon={stat.icon} className={`w-5 h-5 ${stat.color}`} />
            </div>

            {/* Value */}
            <div className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
              {stat.displayValue}
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
                  className={`h-full ${stat.barColor} rounded-full`}
                />
              </div>
            </div>

            {/* Label */}
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {stat.label}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * Tab Navigation with smooth indicator animation
 */
function TabNav({
  activeTab,
  onTabChange,
  isLightAnalysis,
}: {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isLightAnalysis: boolean;
}) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = activeTab === 'overview' ? 0 : 1;
    const activeEl = tabRefs.current[activeIndex];
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
      });
    }
  }, [activeTab]);

  const handleKeyDown = (e: React.KeyboardEvent, tab: TabType) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTabChange(tab);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onTabChange('overview');
      tabRefs.current[0]?.focus();
    }
    if (e.key === 'ArrowRight' && !isLightAnalysis) {
      e.preventDefault();
      onTabChange('analytics');
      tabRefs.current[1]?.focus();
    }
  };

  return (
    <div className="relative border-b border-gray-200 dark:border-gray-700">
      <nav className="flex gap-1 px-6" role="tablist" aria-label="Lead details tabs">
        <button
          ref={(el) => (tabRefs.current[0] = el)}
          type="button"
          role="tab"
          aria-selected={activeTab === 'overview'}
          aria-controls="overview-panel"
          onClick={() => onTabChange('overview')}
          onKeyDown={(e) => handleKeyDown(e, 'overview')}
          className={`
            relative px-4 py-3 text-sm font-medium transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-t-lg
            ${
              activeTab === 'overview'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }
          `}
        >
          Overview
        </button>

        <button
          ref={(el) => (tabRefs.current[1] = el)}
          type="button"
          role="tab"
          aria-selected={activeTab === 'analytics'}
          aria-controls="analytics-panel"
          onClick={() => !isLightAnalysis && onTabChange('analytics')}
          onKeyDown={(e) => handleKeyDown(e, 'analytics')}
          disabled={isLightAnalysis}
          className={`
            relative inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-t-lg
            ${
              activeTab === 'analytics'
                ? 'text-blue-600 dark:text-blue-400'
                : isLightAnalysis
                  ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }
          `}
        >
          Analytics
          {isLightAnalysis && (
            <Icon icon="mdi:lock" className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          )}
        </button>
      </nav>

      {/* Animated indicator */}
      <motion.div
        className="absolute bottom-0 h-0.5 bg-blue-500"
        animate={indicatorStyle}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </div>
  );
}

// =============================================================================
// BOTTOM METADATA BAR
// =============================================================================

/**
 * Bottom metadata bar - Shows analysis type, status, and extraction metadata
 * Appears at bottom of all tabs
 */
function BottomMetadataBar({ lead }: { lead: Lead }) {
  const metadata = lead.extracted_data?.metadata;

  // Analysis type config
  const typeConfig = {
    light: { icon: 'mdi:lightning-bolt', label: 'Light Analysis', color: 'text-amber-600' },
    deep: { icon: 'mdi:brain', label: 'Deep Analysis', color: 'text-blue-600' },
    xray: { icon: 'mdi:atom', label: 'X-Ray Analysis', color: 'text-purple-600' },
  };

  // Status config
  const statusConfig = {
    pending: { icon: 'mdi:clock-outline', label: 'Pending', color: 'text-gray-600' },
    processing: { icon: 'mdi:loading', label: 'Processing', color: 'text-amber-600' },
    complete: { icon: 'mdi:check-circle', label: 'Complete', color: 'text-green-600' },
    failed: { icon: 'mdi:alert-circle', label: 'Failed', color: 'text-red-600' },
  };

  const typeInfo = lead.analysis_type && typeConfig[lead.analysis_type];
  const statusInfo = lead.analysis_status && statusConfig[lead.analysis_status];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 mt-6">
      <div className="flex items-center justify-between">
        {/* Left: Analysis Type & Status */}
        <div className="flex items-center gap-3">
          {typeInfo && (
            <div className="flex items-center gap-1.5 text-sm">
              <Icon icon={typeInfo.icon} className={`w-4 h-4 ${typeInfo.color}`} />
              <span className="font-medium text-gray-700">{typeInfo.label}</span>
            </div>
          )}
          {typeInfo && statusInfo && (
            <span className="text-gray-300">•</span>
          )}
          {statusInfo && (
            <div className="flex items-center gap-1.5 text-sm">
              <Icon icon={statusInfo.icon} className={`w-4 h-4 ${statusInfo.color}`} />
              <span className="font-medium text-gray-700">{statusInfo.label}</span>
            </div>
          )}
        </div>

        {/* Right: Extraction Metadata */}
        {metadata && (
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <Icon icon="mdi:code-tags" className="w-3.5 h-3.5" />
              <span>v{metadata.version}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon icon="mdi:database" className="w-3.5 h-3.5" />
              <span>{metadata.sampleSize} posts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon icon="mdi:clock-outline" className="w-3.5 h-3.5" />
              <span>{formatDate(metadata.extractedAt)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// OVERVIEW TAB CONTENT
// =============================================================================

function OverviewTab({ lead }: { lead: Lead }) {
  // Calculate score breakdown from extracted_data (each component is out of 25)
  const extractedCalc = lead.extracted_data?.calculated;

  const scoreBreakdown = {
    // Profile Fit: Use AI assessment score (scaled to /25)
    profileFit: lead.ai_response?.score !== null && lead.ai_response?.score !== undefined
      ? Math.round((lead.ai_response.score / 100) * 25)
      : null,

    // Engagement: Use engagement_health (0-100 → 0-25)
    engagement: extractedCalc?.engagementHealth !== null && extractedCalc?.engagementHealth !== undefined
      ? Math.round((extractedCalc.engagementHealth / 100) * 25)
      : null,

    // Authority: Use account_maturity (0-100 → 0-25)
    authority: extractedCalc?.accountMaturity !== null && extractedCalc?.accountMaturity !== undefined
      ? Math.round((extractedCalc.accountMaturity / 100) * 25)
      : null,

    // Readiness: Use content_sophistication (0-100 → 0-25)
    readiness: extractedCalc?.contentSophistication !== null && extractedCalc?.contentSophistication !== undefined
      ? Math.round((extractedCalc.contentSophistication / 100) * 25)
      : null,
  };

  return (
    <div className="space-y-5" role="tabpanel" id="overview-panel" aria-labelledby="overview-tab">
      {/* Hero Insight */}
      <HeroInsight lead={lead} />

      {/* Quick Stats Grid */}
      {lead.calculated_metrics && <QuickStatsGrid lead={lead} />}

      {/* ICP Fit Assessment - Moved above Key Strengths */}
      {lead.ai_response?.fitReasoning && (
        <FitReasoningSection
          fitReasoning={lead.ai_response.fitReasoning}
          leadTier={lead.ai_response.leadTier}
        />
      )}

      {/* AI Analysis Section - Strengths, Weaknesses, Risk Factors */}
      {lead.ai_response && (
        <AIAnalysisSection
          strengths={lead.ai_response.strengths}
          weaknesses={lead.ai_response.weaknesses}
          riskFactors={lead.ai_response.riskFactors}
        />
      )}

      {/* Partnership Opportunities */}
      {lead.ai_response?.opportunities && (
        <OpportunitiesSection opportunities={lead.ai_response.opportunities} />
      )}

      {/* Recommended Next Steps */}
      {lead.ai_response?.recommendedActions && (
        <RecommendedActionsSection recommendedActions={lead.ai_response.recommendedActions} />
      )}

      {/* Score Breakdown */}
      {lead.overall_score !== null && (
        <ScoreBreakdown scores={scoreBreakdown} overallScore={lead.overall_score} />
      )}

      {/* Partnership Summary */}
      {lead.summary && <SummaryCard summary={lead.summary} score={lead.overall_score} />}

      {/* External Links */}
      {lead.external_urls && lead.external_urls.length > 0 && (
        <ExternalLinksSection links={lead.external_urls} />
      )}

      {/* Empty State */}
      {!lead.analysis_type && (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center mb-4">
            <Icon
              icon="mdi:chart-line-variant"
              className="w-8 h-8 text-gray-400 dark:text-gray-500"
            />
          </div>
          <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Analysis Data Yet
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            Run a deep analysis on this lead to unlock partnership insights, engagement metrics, and
            quality scores.
          </p>
        </div>
      )}

      {/* Bottom Metadata Bar */}
      <BottomMetadataBar lead={lead} />
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function LeadDetailModal({ isOpen, onClose, lead }: LeadDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const hasLoggedRef = useRef<string | null>(null);

  // Reset to overview tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('overview');
    }
  }, [isOpen]);

  if (!lead) return null;

  // DEBUG LOGGING - Check what data we're receiving (only log once per lead)
  if (isOpen && lead && hasLoggedRef.current !== lead.id) {
    hasLoggedRef.current = lead.id;
    console.group('🔍 Lead Detail Modal - Data Check');
    console.log('Full lead object:', lead);
    console.log('ai_response:', lead.ai_response);
    console.log('extracted_data:', lead.extracted_data);
    console.log('calculated_metrics:', lead.calculated_metrics);
    console.log('analysis_type:', lead.analysis_type);
    console.log('analysis_status:', lead.analysis_status);
    console.groupEnd();
  }

  const isLightAnalysis = lead.analysis_type === 'light' || lead.analysis_type === null;

  return (
    <Modal open={isOpen} onClose={onClose} size="3xl" closeable>
      {/* ========================================================================
          HEADER - ENTERPRISE-GRADE LAYOUT
          ======================================================================== */}
      <div className="relative px-6 py-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40">
        {/* Main Profile Content */}
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="shrink-0">
            <LeadAvatar
              url={lead.profile_pic_url}
              username={lead.username}
              displayName={lead.display_name}
              size="lg"
              className="w-20 h-20 ring-4 ring-white dark:ring-gray-800 shadow-lg"
            />
          </div>

          {/* Profile Information */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Name + Verification */}
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {lead.display_name || lead.username}
              </h2>
              {lead.is_verified && <VerificationBadge />}
            </div>

            {/* Username */}
            <a
              href={lead.profile_url || `https://instagram.com/${lead.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-150 font-medium"
            >
              <span>@{lead.username}</span>
              <Icon
                icon="mdi:open-in-new"
                className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
              />
            </a>

            {/* Stats */}
            <div className="pt-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatNumber(lead.follower_count)}
                </span>{' '}
                followers
                <span className="mx-2 text-gray-400">•</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatNumber(lead.following_count)}
                </span>{' '}
                following
                <span className="mx-2 text-gray-400">•</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {lead.post_count || 0}
                </span>{' '}
                posts
              </p>
            </div>
          </div>
        </div>

        {/* Badges - Top Right */}
        <div className="absolute top-6 right-4 flex items-center gap-2">
          <PlatformBadge />
          <NicheBadge />
          <BusinessBadge />
        </div>
      </div>

      {/* ========================================================================
          TAB NAVIGATION
          ======================================================================== */}
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} isLightAnalysis={isLightAnalysis} />

      {/* ========================================================================
          TAB CONTENT
          ======================================================================== */}
      <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'overview' ? (
              <OverviewTab lead={lead} />
            ) : (
              <AnalyticsTab lead={lead} analysisType={lead.analysis_type} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Modal>
  );
}
