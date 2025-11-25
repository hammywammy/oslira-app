// src/features/dashboard/components/LeadsTable/LeadDetailModal.tsx

/**
 * LEAD DETAIL MODAL - PRODUCTION GRADE V2.0
 *
 * Beautiful modal for displaying complete lead information
 * Triggered by clicking the eye icon in the leads table
 *
 * FEATURES:
 * ✅ Large modal that takes up significant screen space (3xl)
 * ✅ Colored header with profile pic, name, username, and score
 * ✅ Organized sections with clear visual hierarchy
 * ✅ Responsive design with natural dark mode support
 * ✅ TypeScript strict compliance
 * ✅ Full backdrop blur that covers sidebar and topbar
 *
 * DESIGN PHILOSOPHY:
 * "Concert hall, not arcade"
 * - Professional layout with clear sections
 * - Subtle use of color for emphasis
 * - Clean typography and spacing
 * - No excessive gradients
 */

import type { ReactNode } from 'react';
import { Icon } from '@iconify/react';
import { Modal } from '@/shared/components/ui/Modal';
import { LeadAvatar } from '@/shared/components/ui/LeadAvatar';
import type { Lead } from '@/shared/types/leads.types';

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

function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getScoreColor(score: number | null): string {
  if (score === null) return 'bg-neutral-100 dark:bg-neutral-800';
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-blue-500';
  return 'bg-amber-500';
}

function getScoreTextColor(score: number | null): string {
  if (score === null) return 'text-muted-foreground';
  if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 60) return 'text-blue-600 dark:text-blue-400';
  return 'text-amber-600 dark:text-amber-400';
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function SectionTitle({ children, icon }: { children: ReactNode; icon?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
      {icon && <Icon icon={icon} className="w-5 h-5 text-primary" />}
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
        {children}
      </h3>
    </div>
  );
}

function InfoCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`p-4 bg-muted/30 dark:bg-muted/10 rounded-lg border border-border ${className}`}>
      {children}
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score: number | null }) {
  const scoreColor = getScoreColor(score);
  const textColor = getScoreTextColor(score);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={`text-lg font-bold ${textColor}`}>
          {score !== null ? score : 'N/A'}
        </span>
      </div>
      {score !== null && (
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${scoreColor}`}
            style={{ width: `${score}%` }}
          />
        </div>
      )}
    </div>
  );
}

function AnalysisTypeBadge({ type }: { type: 'light' | 'deep' | 'xray' | null }) {
  if (!type) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-muted/50 text-muted-foreground border border-border">
        <Icon icon="mdi:minus-circle-outline" width={14} />
        Not Analyzed
      </span>
    );
  }

  const config = {
    light: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-300 dark:border-amber-700',
      icon: 'mdi:lightning-bolt',
    },
    deep: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-300 dark:border-blue-700',
      icon: 'mdi:brain',
    },
    xray: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-300 dark:border-emerald-700',
      icon: 'mdi:atom',
    },
  }[type];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      <Icon icon={config.icon} width={14} />
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function LeadDetailModal({ isOpen, onClose, lead }: LeadDetailModalProps) {
  if (!lead) return null;

  const overallScore = lead.overall_score;
  const scoreColor = getScoreColor(overallScore);

  return (
    <Modal open={isOpen} onClose={onClose} size="3xl" closeable>
      {/* ========================================================================
          HEADER - PROFILE OVERVIEW WITH COLORED BACKGROUND
          ======================================================================== */}

      <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border">
        <div className="px-8 py-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <LeadAvatar
                url={lead.profile_pic_url}
                username={lead.username}
                displayName={lead.display_name}
                size="xl"
                className="shadow-lg"
              />
              {/* Platform Badge */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center border-2 border-background">
                <Icon icon="mdi:instagram" className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-foreground mb-1 truncate">
                {lead.display_name || lead.username}
              </h2>
              <a
                href={lead.profile_url || `https://instagram.com/${lead.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors mb-3"
              >
                <span className="text-sm font-medium">{lead.username}</span>
                <Icon icon="mdi:open-in-new" width={14} />
              </a>

              {/* Key Metrics */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:account-group" className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-semibold text-foreground">{formatFollowers(lead.follower_count)}</span>
                    <span className="text-muted-foreground ml-1">followers</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:account-multiple" className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-semibold text-foreground">{formatFollowers(lead.following_count)}</span>
                    <span className="text-muted-foreground ml-1">following</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:grid" className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-semibold text-foreground">{lead.post_count || 0}</span>
                    <span className="text-muted-foreground ml-1">posts</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Score Circle Badge */}
            {overallScore !== null && (
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-muted/30"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${overallScore * 2.51} 251`}
                      className={scoreColor.replace('bg-', 'text-')}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">{overallScore}</span>
                  </div>
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Overall Score
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================
          BODY - DETAILED INFORMATION
          ======================================================================== */}

      <div className="px-8 py-6 max-h-[60vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-6">

          {/* LEFT COLUMN */}
          <div className="space-y-6">

            {/* Analysis Info */}
            <div>
              <SectionTitle icon="mdi:information">Analysis Details</SectionTitle>
              <div className="space-y-3">
                <InfoCard>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Type</span>
                    <AnalysisTypeBadge type={lead.analysis_type} />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Status</span>
                    <span className="text-sm text-foreground capitalize">
                      {lead.analysis_status || 'Not Started'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Analyzed</span>
                    <span className="text-sm text-foreground">{formatDate(lead.analysis_completed_at)}</span>
                  </div>
                </InfoCard>
              </div>
            </div>

            {/* Scores Section */}
            {lead.overall_score !== null && (
              <div>
                <SectionTitle icon="mdi:chart-bar">Performance Scores</SectionTitle>
                <div className="space-y-4">
                  <InfoCard>
                    <ScoreBar label="Overall Score" score={lead.overall_score} />
                  </InfoCard>
                </div>
              </div>
            )}

            {/* Profile Dates */}
            <div>
              <SectionTitle icon="mdi:calendar">Timeline</SectionTitle>
              <InfoCard>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Added</span>
                  <span className="text-sm text-foreground">{formatDate(lead.created_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                  <span className="text-sm text-foreground">{formatDate(lead.updated_at)}</span>
                </div>
              </InfoCard>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            {/* Summary Section */}
            {lead.summary && (
              <div>
                <SectionTitle icon="mdi:file-document">Analysis Summary</SectionTitle>
                <InfoCard className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {lead.summary}
                  </p>
                </InfoCard>
              </div>
            )}

            {/* Empty State for Unanalyzed Leads */}
            {!lead.analysis_type && (
              <div>
                <InfoCard className="text-center py-8">
                  <Icon icon="mdi:chart-line-variant" className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h4 className="text-sm font-semibold text-foreground mb-2">Not Analyzed Yet</h4>
                  <p className="text-xs text-muted-foreground">
                    Run an analysis on this lead to see detailed insights and scores
                  </p>
                </InfoCard>
              </div>
            )}

          </div>

        </div>
      </div>
    </Modal>
  );
}
