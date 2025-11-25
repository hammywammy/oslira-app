// src/features/dashboard/components/LeadsTable/LeadDetailModal.tsx

/**
 * LEAD DETAIL MODAL - V3.0 (Stripe-Level Polish)
 *
 * Professional modal for displaying complete lead information
 * Triggered by clicking the eye icon in the leads table
 *
 * FEATURES:
 * - Centered header content with prominent score badge
 * - Tab navigation (Overview/Analytics)
 * - 4-category score breakdown
 * - Niche badge placeholder
 * - Enhanced summary card with score-based indicators
 * - Compact analysis meta cards
 * - Dark mode support
 *
 * DESIGN PHILOSOPHY:
 * "Stripe-level polish"
 * - Clean, not cluttered
 * - Visual interest through hierarchy
 * - Subtle animations
 * - Everything has purpose
 */

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/shared/components/ui/Modal';
import { LeadAvatar } from '@/shared/components/ui/LeadAvatar';
import type { Lead } from '@/shared/types/leads.types';

import { TabNavigation, type TabType } from './TabNavigation';
import { ScoreBreakdown } from './ScoreBreakdown';
import { AnalysisMetaCards } from './AnalysisMetaCards';
import { SummaryCard } from './SummaryCard';
import { AnalyticsTab } from './AnalyticsTab';

// =============================================================================
// TYPES
// =============================================================================

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatFollowers(count: number | null): string {
  if (!count) return '0';
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

function getScoreColor(score: number | null): string {
  if (score === null) return 'text-gray-400';
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-blue-500';
  return 'text-amber-500';
}

function extractNiche(lead: Lead): string {
  // Placeholder: In the future, this would extract from bio or category
  // For now, return a default based on analysis existence
  if (!lead.analysis_type) return 'Not Classified';
  return 'Copywriting';
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function NicheBadge({ niche }: { niche: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
      <Icon icon="mdi:target" className="w-3.5 h-3.5" />
      {niche}
    </span>
  );
}

function StatItem({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon icon={icon} className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      <span className="text-sm">
        <span className="font-semibold text-gray-900 dark:text-gray-100">{value}</span>
        <span className="text-gray-500 dark:text-gray-400 ml-1">{label}</span>
      </span>
    </div>
  );
}

function ScoreCircle({ score }: { score: number | null }) {
  const scoreColor = getScoreColor(score);
  const strokeDasharray = score !== null ? `${score * 2.51} 251` : '0 251';

  return (
    <div className="absolute top-4 right-12 flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="34"
            stroke="currentColor"
            strokeWidth="5"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {score !== null && (
            <circle
              cx="40"
              cy="40"
              r="34"
              stroke="currentColor"
              strokeWidth="5"
              fill="none"
              strokeDasharray={strokeDasharray}
              className={scoreColor}
              strokeLinecap="round"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {score !== null ? score : '--'}
          </span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// OVERVIEW TAB CONTENT
// =============================================================================

function OverviewTab({ lead }: { lead: Lead }) {
  // For now, we'll simulate score breakdown since the actual breakdown
  // isn't in the Lead type yet. This can be connected to real data later.
  const scoreBreakdown = {
    profileFit: lead.overall_score !== null ? Math.round(lead.overall_score * 0.25) : null,
    engagement: null, // Placeholder - available in deep analysis
    authority: lead.overall_score !== null ? Math.round(lead.overall_score * 0.22) : null,
    readiness: null, // Placeholder - available in deep analysis
  };

  return (
    <div className="space-y-5">
      {/* Analysis Meta Cards */}
      <AnalysisMetaCards
        analysisType={lead.analysis_type}
        status={lead.analysis_status}
        analyzedAt={lead.analysis_completed_at}
      />

      {/* Score Breakdown */}
      {lead.overall_score !== null && (
        <ScoreBreakdown
          scores={scoreBreakdown}
          overallScore={lead.overall_score}
        />
      )}

      {/* Summary Card */}
      {lead.summary && (
        <SummaryCard
          summary={lead.summary}
          score={lead.overall_score}
        />
      )}

      {/* Empty State for Unanalyzed Leads */}
      {!lead.analysis_type && (
        <div className="flex flex-col items-center justify-center py-12 px-8 text-center bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
          <Icon icon="mdi:chart-line-variant" className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Not Analyzed Yet
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            Run an analysis on this lead to see detailed insights and scores.
          </p>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function LeadDetailModal({ isOpen, onClose, lead }: LeadDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  if (!lead) return null;

  const niche = extractNiche(lead);
  const isLightAnalysis = lead.analysis_type === 'light' || lead.analysis_type === null;

  return (
    <Modal open={isOpen} onClose={onClose} size="3xl" closeable>
      {/* ========================================================================
          HEADER - CENTERED PROFILE OVERVIEW
          ======================================================================== */}
      <div className="relative bg-gradient-to-br from-blue-50/80 via-gray-50/50 to-white dark:from-blue-900/10 dark:via-gray-900/50 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
        {/* Score Circle - Absolute positioned top-right */}
        {lead.overall_score !== null && <ScoreCircle score={lead.overall_score} />}

        <div className="px-8 py-8">
          {/* Centered Content */}
          <div className="flex flex-col items-center text-center">
            {/* Avatar with Platform Badge */}
            <div className="relative mb-4">
              <LeadAvatar
                url={lead.profile_pic_url}
                username={lead.username}
                displayName={lead.display_name}
                size="xl"
                className="shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-sm">
                <Icon icon="mdi:instagram" className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            {/* Name */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {lead.display_name || lead.username}
            </h2>

            {/* Username Link */}
            <a
              href={lead.profile_url || `https://instagram.com/${lead.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mb-3"
            >
              <span className="text-sm font-medium">@{lead.username}</span>
              <Icon icon="mdi:open-in-new" width={12} />
            </a>

            {/* Niche Badge */}
            <div className="mb-4">
              <NicheBadge niche={niche} />
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-6">
              <StatItem
                icon="mdi:account-group"
                value={formatFollowers(lead.follower_count)}
                label="followers"
              />
              <StatItem
                icon="mdi:account-multiple"
                value={formatFollowers(lead.following_count)}
                label="following"
              />
              <StatItem
                icon="mdi:grid"
                value={String(lead.post_count || 0)}
                label="posts"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================
          TAB NAVIGATION
          ======================================================================== */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isLightAnalysis={isLightAnalysis}
      />

      {/* ========================================================================
          TAB CONTENT
          ======================================================================== */}
      <div className="px-8 py-6 max-h-[50vh] overflow-y-auto">
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
              <AnalyticsTab analysisType={lead.analysis_type} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Modal>
  );
}
