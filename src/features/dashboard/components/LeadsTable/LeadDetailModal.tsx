// src/features/dashboard/components/LeadsTable/LeadDetailModal.tsx

/**
 * LEAD DETAIL MODAL - PRODUCTION GRADE V1.0
 *
 * Beautiful modal for displaying complete lead information
 * Triggered by clicking the eye icon in the leads table
 *
 * FEATURES:
 * ✅ Header with profile pic, name, username, and key metrics
 * ✅ Body with organized sections (profile, scores, analysis, psychographics)
 * ✅ Responsive design with natural dark mode support
 * ✅ TypeScript strict compliance
 * ✅ Clean visual hierarchy
 *
 * DESIGN PHILOSOPHY:
 * "Concert hall, not arcade"
 * - Professional layout with clear sections
 * - Visual badges and indicators
 * - Smooth animations and hover states
 */

import type { ReactNode } from 'react';
import { Icon } from '@iconify/react';
import { Modal } from '@/shared/components/ui/Modal';
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
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getScoreColor(score: number | null): string {
  if (score === null) return 'text-muted-foreground';
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-blue-600';
  return 'text-amber-600';
}

function getScoreBgColor(score: number | null): string {
  if (score === null) return 'bg-muted/30';
  if (score >= 80) return 'bg-emerald-50 dark:bg-emerald-900/20';
  if (score >= 60) return 'bg-blue-50 dark:bg-blue-900/20';
  return 'bg-amber-50 dark:bg-amber-900/20';
}

function getScoreBorderColor(score: number | null): string {
  if (score === null) return 'border-border';
  if (score >= 80) return 'border-emerald-200 dark:border-emerald-800';
  if (score >= 60) return 'border-blue-200 dark:border-blue-800';
  return 'border-amber-200 dark:border-amber-800';
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function ScoreDisplay({
  label,
  score
}: {
  label: string;
  score: number | null;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={`text-lg font-bold ${getScoreColor(score)}`}>
          {score !== null ? score : 'N/A'}
        </span>
      </div>
      {score !== null && (
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-blue-500' : 'bg-amber-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      )}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value
}: {
  icon: string;
  label: string;
  value: string | number | null;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon icon={icon} className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-muted-foreground mb-0.5">{label}</div>
        <div className="text-sm text-foreground break-words">
          {value !== null && value !== undefined ? value : 'N/A'}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
      {children}
    </h3>
  );
}

function AnalysisTypeBadge({ type }: { type: 'light' | 'deep' | 'xray' | null }) {
  if (!type) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border bg-muted/30 text-muted-foreground border-border">
        <Icon icon="mdi:minus-circle-outline" width={14} />
        Not Analyzed
      </span>
    );
  }

  const config = {
    light: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      icon: 'mdi:lightning-bolt',
    },
    deep: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'mdi:brain',
    },
    xray: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      icon: 'mdi:atom',
    },
  }[type];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${config.bg} ${config.text} ${config.border}`}>
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

  return (
    <Modal open={isOpen} onClose={onClose} size="xl" closeable>
      {/* ========================================================================
          HEADER - LEAD PROFILE OVERVIEW
          ======================================================================== */}

      <div className="px-6 py-5 border-b border-border bg-muted/30 dark:bg-muted/10">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0 text-white text-2xl font-bold shadow-lg">
            {lead.avatar_url ? (
              <img
                src={lead.avatar_url}
                alt={lead.full_name || lead.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span>{lead.full_name?.charAt(0) || lead.username.charAt(0).toUpperCase()}</span>
            )}
          </div>

          {/* Name and Username */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-foreground truncate mb-1">
                  {lead.full_name || lead.username}
                </h2>
                <a
                  href={lead.profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <Icon icon="mdi:instagram" width={16} />
                  {lead.username}
                  <Icon icon="mdi:open-in-new" width={14} />
                </a>
              </div>

              {/* Overall Score Badge */}
              {overallScore !== null && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getScoreBgColor(overallScore)} ${getScoreBorderColor(overallScore)}`}>
                  <Icon icon="ph:star-fill" className={`w-5 h-5 ${getScoreColor(overallScore)}`} />
                  <div className="text-right">
                    <div className="text-xs font-medium text-muted-foreground">Overall Score</div>
                    <div className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                      {overallScore}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Key Metrics */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-sm">
                <Icon icon="mdi:account-group" className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-foreground">
                  {formatFollowers(lead.followers_count)}
                </span>
                <span className="text-muted-foreground">followers</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Icon icon="mdi:account-multiple" className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-foreground">
                  {formatFollowers(lead.following_count)}
                </span>
                <span className="text-muted-foreground">following</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Icon icon="mdi:grid" className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-foreground">
                  {lead.posts_count || 0}
                </span>
                <span className="text-muted-foreground">posts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================
          BODY - DETAILED INFORMATION
          ======================================================================== */}

      <div className="px-6 py-5 max-h-[600px] overflow-y-auto">
        <div className="space-y-6">

          {/* Bio Section */}
          {lead.bio && (
            <div>
              <SectionTitle>Bio</SectionTitle>
              <div className="p-4 bg-muted/30 dark:bg-muted/10 rounded-lg border border-border">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {lead.bio}
                </p>
              </div>
            </div>
          )}

          {/* Analysis Information */}
          <div>
            <SectionTitle>Analysis Information</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <div className="flex items-center justify-between p-4 bg-muted/30 dark:bg-muted/10 rounded-lg border border-border">
                  <span className="text-sm font-medium text-muted-foreground">Analysis Type</span>
                  <AnalysisTypeBadge type={lead.analysis_type} />
                </div>
              </div>

              <InfoRow
                icon="mdi:clock-outline"
                label="Analyzed At"
                value={formatDate(lead.analysis_completed_at)}
              />

              <InfoRow
                icon="mdi:speedometer"
                label="Confidence Level"
                value={lead.confidence_level !== null ? `${lead.confidence_level}%` : null}
              />

              <InfoRow
                icon="mdi:credit-card-outline"
                label="Credits Charged"
                value={lead.credits_charged}
              />

              <InfoRow
                icon="mdi:cached"
                label="Cache Hit"
                value={lead.cache_hit ? 'Yes' : 'No'}
              />
            </div>
          </div>

          {/* Scores Section */}
          {(lead.overall_score !== null || lead.niche_fit_score !== null || lead.engagement_score !== null) && (
            <div>
              <SectionTitle>Detailed Scores</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/30 dark:bg-muted/10 rounded-lg border border-border">
                  <ScoreDisplay label="Overall Score" score={lead.overall_score} />
                </div>
                <div className="p-4 bg-muted/30 dark:bg-muted/10 rounded-lg border border-border">
                  <ScoreDisplay label="Niche Fit" score={lead.niche_fit_score} />
                </div>
                <div className="p-4 bg-muted/30 dark:bg-muted/10 rounded-lg border border-border">
                  <ScoreDisplay label="Engagement" score={lead.engagement_score} />
                </div>
              </div>
            </div>
          )}

          {/* Summary Section */}
          {lead.summary_text && (
            <div>
              <SectionTitle>Analysis Summary</SectionTitle>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {lead.summary_text}
                </p>
              </div>
            </div>
          )}

          {/* Outreach Message Section */}
          {lead.outreach_message && (
            <div>
              <SectionTitle>Suggested Outreach Message</SectionTitle>
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-medium">
                  {lead.outreach_message}
                </p>
              </div>
            </div>
          )}

          {/* Psychographics Section */}
          {lead.psychographics && (
            <div>
              <SectionTitle>Psychographic Profile</SectionTitle>
              <div className="space-y-4">

                {/* DISC Profile */}
                {lead.psychographics.disc_profile && (
                  <div className="p-4 bg-muted/30 dark:bg-muted/10 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon icon="mdi:account-details" className="w-5 h-5 text-primary" />
                      <h4 className="text-sm font-semibold text-foreground">
                        DISC Profile - {lead.psychographics.disc_profile.primary_type} Type
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <ScoreDisplay
                        label="Dominance"
                        score={lead.psychographics.disc_profile.dominance}
                      />
                      <ScoreDisplay
                        label="Influence"
                        score={lead.psychographics.disc_profile.influence}
                      />
                      <ScoreDisplay
                        label="Steadiness"
                        score={lead.psychographics.disc_profile.steadiness}
                      />
                      <ScoreDisplay
                        label="Conscientiousness"
                        score={lead.psychographics.disc_profile.conscientiousness}
                      />
                    </div>
                  </div>
                )}

                {/* Communication Style */}
                {lead.psychographics.communication_style && (
                  <div className="p-4 bg-muted/30 dark:bg-muted/10 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon icon="mdi:message-text" className="w-5 h-5 text-primary" />
                      <h4 className="text-sm font-semibold text-foreground">Communication Style</h4>
                    </div>
                    <p className="text-sm text-foreground">{lead.psychographics.communication_style}</p>
                  </div>
                )}

                {/* Motivation Drivers */}
                {lead.psychographics.motivation_drivers && lead.psychographics.motivation_drivers.length > 0 && (
                  <div className="p-4 bg-muted/30 dark:bg-muted/10 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon icon="mdi:lightbulb-on" className="w-5 h-5 text-primary" />
                      <h4 className="text-sm font-semibold text-foreground">Motivation Drivers</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {lead.psychographics.motivation_drivers.map((driver, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                        >
                          {driver}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Outreach Strategy */}
                {lead.psychographics.outreach_strategy && (
                  <div className="p-4 bg-muted/30 dark:bg-muted/10 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon icon="mdi:strategy" className="w-5 h-5 text-primary" />
                      <h4 className="text-sm font-semibold text-foreground">Outreach Strategy</h4>
                    </div>
                    <p className="text-sm text-foreground">{lead.psychographics.outreach_strategy}</p>
                  </div>
                )}

                {/* Copywriter Profile */}
                {lead.psychographics.copywriter_profile && lead.psychographics.copywriter_profile.is_copywriter && (
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon icon="mdi:pencil" className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <h4 className="text-sm font-semibold text-foreground">Copywriter Profile</h4>
                    </div>
                    <div className="space-y-1 text-sm">
                      {lead.psychographics.copywriter_profile.specialization && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Specialization:</span>
                          <span className="text-foreground font-medium">
                            {lead.psychographics.copywriter_profile.specialization}
                          </span>
                        </div>
                      )}
                      {lead.psychographics.copywriter_profile.experience_level && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Experience:</span>
                          <span className="text-foreground font-medium capitalize">
                            {lead.psychographics.copywriter_profile.experience_level}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata Section */}
          <div>
            <SectionTitle>Metadata</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow
                icon="mdi:calendar-plus"
                label="Created At"
                value={formatDate(lead.created_at)}
              />
              <InfoRow
                icon="mdi:identifier"
                label="Lead ID"
                value={lead.id}
              />
              {lead.run_id && (
                <InfoRow
                  icon="mdi:run"
                  label="Run ID"
                  value={lead.run_id}
                />
              )}
            </div>
          </div>

        </div>
      </div>
    </Modal>
  );
}
