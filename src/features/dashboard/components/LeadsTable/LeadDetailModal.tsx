// src/features/dashboard/components/LeadsTable/LeadDetailModal.tsx

/**
 * LEAD DETAIL MODAL - V4.2 (Professional B2B Intelligence)
 *
 * Professional modal for displaying complete lead information
 * Triggered by clicking the eye icon in the leads table
 *
 * FEATURES:
 * - Compact horizontal header with dense profile metadata
 * - Score inside circular progress ring (top-right, below close button)
 * - Verification badge inline with name
 * - Platform, niche, business badges on same row as stats (right side)
 * - Plain text stats with bullet separators
 * - Refined tab navigation
 * - Dark mode support
 */

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/shared/components/ui/Modal';
import { LeadAvatar } from '@/shared/components/ui/LeadAvatar';
import type { Lead } from '@/shared/types/leads.types';

import { ScoreBreakdown } from './ScoreBreakdown';
import { AnalysisMetaCards } from './AnalysisMetaCards';
import { SummaryCard } from './SummaryCard';
import { AnalyticsTab } from './AnalyticsTab';
import { ExternalLinksSection } from './ExternalLinksSection';

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
  return count.toLocaleString();
}

function getScoreColor(score: number | null): string {
  if (score === null) return 'text-gray-400';
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-blue-500';
  return 'text-amber-500';
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Instagram-style verification badge (blue checkmark)
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
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-full">
      <Icon icon="mdi:instagram" className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
      <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Instagram</span>
    </span>
  );
}

/**
 * Niche badge placeholder
 */
function NicheBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full">
      <span className="text-xs font-medium text-blue-700 dark:text-blue-300">NICHE BADGE</span>
    </span>
  );
}

/**
 * Business account badge (purple)
 */
function BusinessBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-full">
      <span>💼</span>
      <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Business</span>
    </span>
  );
}

/**
 * Score display with number INSIDE circular progress ring
 * Positioned below the close button
 */
function ScoreDisplay({ score }: { score: number | null }) {
  const scoreColor = getScoreColor(score);
  const percentage = score !== null ? score : 0;
  const circumference = 2 * Math.PI * 36; // radius = 36
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="absolute top-14 right-4 flex flex-col items-center">
      {/* Circular Progress Ring with Score Inside */}
      <div className="relative w-20 h-20">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background track */}
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="currentColor"
            strokeWidth="5"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress stroke */}
          {score !== null && (
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={scoreColor}
            />
          )}
        </svg>
        {/* Score Number Inside */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${score !== null ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}`}>
            {score !== null ? score : '--'}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Tab Navigation
 */
function TabNav({
  activeTab,
  onTabChange,
  isLightAnalysis
}: {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isLightAnalysis: boolean;
}) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex gap-1 px-6 -mb-px" aria-label="Tabs">
        <button
          type="button"
          onClick={() => onTabChange('overview')}
          className={`
            px-4 py-3 text-sm font-medium border-b-2 transition-all duration-100
            ${activeTab === 'overview'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }
          `}
        >
          Overview
        </button>

        <button
          type="button"
          onClick={() => onTabChange('analytics')}
          className={`
            inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-100
            ${activeTab === 'analytics'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : isLightAnalysis
                ? 'border-transparent text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }
          `}
        >
          Analytics
          {isLightAnalysis && (
            <Icon icon="mdi:lock" className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          )}
        </button>
      </nav>
    </div>
  );
}

// =============================================================================
// OVERVIEW TAB CONTENT
// =============================================================================

function OverviewTab({ lead }: { lead: Lead }) {
  const scoreBreakdown = {
    profileFit: lead.overall_score !== null ? Math.round(lead.overall_score * 0.25) : null,
    engagement: null,
    authority: lead.overall_score !== null ? Math.round(lead.overall_score * 0.22) : null,
    readiness: null,
  };

  return (
    <div className="space-y-5">
      <AnalysisMetaCards
        analysisType={lead.analysis_type}
        status={lead.analysis_status}
        analyzedAt={lead.analysis_completed_at}
      />

      {lead.overall_score !== null && (
        <ScoreBreakdown
          scores={scoreBreakdown}
          overallScore={lead.overall_score}
        />
      )}

      {lead.summary && (
        <SummaryCard
          summary={lead.summary}
          score={lead.overall_score}
        />
      )}

      {lead.external_urls && lead.external_urls.length > 0 && (
        <ExternalLinksSection links={lead.external_urls} />
      )}

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

  const isLightAnalysis = lead.analysis_type === 'light' || lead.analysis_type === null;

  return (
    <Modal open={isOpen} onClose={onClose} size="3xl" closeable>
      {/* ========================================================================
          HEADER - PROFESSIONAL HORIZONTAL LAYOUT
          ======================================================================== */}
      <div className="relative p-6 border-b border-gray-200 dark:border-gray-800">
        {/* Score Display - Below close button */}
        {lead.overall_score !== null && <ScoreDisplay score={lead.overall_score} />}

        {/* Main Profile Content - Horizontal Flexbox */}
        <div className="flex items-start gap-4 pr-28">
          {/* Avatar */}
          <div className="shrink-0">
            <LeadAvatar
              url={lead.profile_pic_url}
              username={lead.username}
              displayName={lead.display_name}
              size="lg"
              className="w-16 h-16"
            />
          </div>

          {/* Profile Information Column */}
          <div className="flex-1 min-w-0 space-y-1.5">
            {/* Row 1: Name + Verification Badge */}
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {lead.display_name || lead.username}
              </h2>
              {lead.is_verified && <VerificationBadge />}
            </div>

            {/* Row 2: Username Link */}
            <a
              href={lead.profile_url || `https://instagram.com/${lead.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-150"
            >
              <span>@{lead.username}</span>
              <Icon
                icon="mdi:open-in-new"
                className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
              />
            </a>

            {/* Row 3: Stats + Badges (same row, badges on right) */}
            <div className="flex items-center justify-between pt-2">
              {/* Stats on left */}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatNumber(lead.follower_count)} followers
                <span className="mx-2">•</span>
                {formatNumber(lead.following_count)} following
                <span className="mx-2">•</span>
                {lead.post_count || 0} posts
              </p>

              {/* Badges on right */}
              <div className="flex items-center gap-2 shrink-0">
                <PlatformBadge />
                <NicheBadge />
                <BusinessBadge />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================
          TAB NAVIGATION
          ======================================================================== */}
      <TabNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isLightAnalysis={isLightAnalysis}
      />

      {/* ========================================================================
          TAB CONTENT
          ======================================================================== */}
      <div className="px-6 py-5 max-h-[50vh] overflow-y-auto">
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
