// src/features/dashboard/components/LeadsTable/AnalyticsTab.tsx

/**
 * ANALYTICS TAB - COMPREHENSIVE METRICS DASHBOARD
 *
 * Displays all 80+ calculated metrics from deep analysis
 * Shows locked state for light analysis
 */

import { Icon } from '@iconify/react';
import type { Lead, AnalysisType } from '@/shared/types/leads.types';
import {
  ScoreCard,
  MetricsSection,
  Metric,
  HashtagBadge,
  MentionBadge,
  RiskScoreCard,
  GapAnalysis,
  ViralPostIndicator,
} from './analytics';

interface AnalyticsTabProps {
  lead: Lead;
  analysisType: AnalysisType | null;
}

export function AnalyticsTab({ lead, analysisType }: AnalyticsTabProps) {
  // Light analysis or no analysis - show locked state
  if (analysisType === 'light' || analysisType === null) {
    return <LockedState />;
  }

  // Deep analysis - show full metrics
  return (
    <div className="space-y-6">
      {/* Score Cards Section */}
      <ScoreCardsSection lead={lead} />

      {/* Engagement Metrics */}
      <EngagementSection lead={lead} />

      {/* Content Strategy */}
      <ContentStrategySection lead={lead} />

      {/* Posting Behavior */}
      <PostingBehaviorSection lead={lead} />

      {/* Video Performance (conditional) */}
      {(lead.video_post_count || 0) > 0 && <VideoPerformanceSection lead={lead} />}

      {/* Risk & Signals */}
      <RiskAndSignalsSection lead={lead} />
    </div>
  );
}

// =============================================================================
// LOCKED STATE
// =============================================================================

function LockedState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <Icon icon="mdi:lock" className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Unlock Deep Analysis
      </h3>

      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        View 80+ engagement metrics, content strategy breakdown, and partnership readiness signals.
      </p>

      <button
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <Icon icon="mdi:arrow-up-circle" className="w-4 h-4" />
        Upgrade to Deep Analysis
      </button>
    </div>
  );
}

// =============================================================================
// SCORE CARDS SECTION
// =============================================================================

function ScoreCardsSection({ lead }: { lead: Lead }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <ScoreCard
        label="Profile Health"
        score={lead.profile_health_score}
        maxScore={100}
        icon="mdi:heart-pulse"
        color="blue"
        tooltip="Overall account quality (engagement + content + maturity)"
      />

      <ScoreCard
        label="Engagement Health"
        score={lead.engagement_health}
        maxScore={100}
        icon="mdi:chart-line"
        color="teal"
        tooltip="Quality and consistency of audience interactions"
      />

      <ScoreCard
        label="Content Quality"
        score={lead.content_sophistication}
        maxScore={100}
        icon="mdi:pencil-box-outline"
        color="purple"
        tooltip="Sophistication of content strategy"
      />

      <ScoreCard
        label="Account Maturity"
        score={lead.account_maturity}
        maxScore={100}
        icon="mdi:shield-check"
        color="green"
        tooltip="Profile completeness and posting consistency"
      />

      <ScoreCard
        label="Fake Follower Risk"
        score={lead.fake_follower_risk_score}
        maxScore={100}
        icon="mdi:alert-circle"
        color="orange"
        inverted={true}
        interpretation={lead.fake_follower_interpretation}
        tooltip="Likelihood of inauthentic followers (lower is better)"
      />

      <ScoreCard
        label="Authority Ratio"
        score={lead.authority_ratio}
        maxScore={100}
        icon="mdi:crown"
        color="gold"
        rawValue={lead.authority_ratio_raw}
        tooltip={`Followers-to-following ratio (raw: ${lead.authority_ratio_raw?.toLocaleString() || 0})`}
      />
    </div>
  );
}

// =============================================================================
// ENGAGEMENT SECTION
// =============================================================================

function EngagementSection({ lead }: { lead: Lead }) {
  const getEngagementInterpretation = (rate: number | null | undefined): string => {
    if (!rate) return 'No data';
    if (rate >= 3) return 'Excellent';
    if (rate >= 1.5) return 'Good';
    if (rate >= 0.5) return 'Fair';
    return 'Needs improvement';
  };

  return (
    <MetricsSection title="Engagement Analysis">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Metric
          label="Engagement Rate"
          value={lead.engagement_rate ? `${lead.engagement_rate.toFixed(2)}%` : '—'}
          interpretation={getEngagementInterpretation(lead.engagement_rate)}
          icon="mdi:trending-up"
          color="green"
        />

        <Metric
          label="Avg Likes/Post"
          value={lead.avg_likes_per_post ? formatNumber(lead.avg_likes_per_post) : '—'}
          rawValue={lead.avg_likes_per_post}
          icon="mdi:heart"
          color="red"
        />

        <Metric
          label="Avg Comments/Post"
          value={lead.avg_comments_per_post ? formatNumber(lead.avg_comments_per_post) : '—'}
          rawValue={lead.avg_comments_per_post}
          icon="mdi:comment"
          color="blue"
        />

        <Metric
          label="Comment-to-Like Ratio"
          value={
            lead.comment_to_like_ratio
              ? `${(lead.comment_to_like_ratio * 100).toFixed(2)}%`
              : '—'
          }
          interpretation="Normal"
          icon="mdi:comment-quote"
          color="purple"
        />
      </div>

      {/* Engagement Consistency */}
      {lead.engagement_consistency !== null && lead.engagement_consistency !== undefined && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Engagement Consistency
            </h4>
            {lead.time_weighting_applied && (
              <span className="text-xs text-gray-500 dark:text-gray-400">Time-weighted</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 transition-all duration-300"
                  style={{ width: `${lead.engagement_consistency}%` }}
                />
              </div>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {Math.round(lead.engagement_consistency)}/100
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            {lead.coefficient_of_variation && lead.coefficient_of_variation > 2
              ? 'High volatility - some posts perform much better than others'
              : 'Consistent engagement across posts'}
          </p>
        </div>
      )}
    </MetricsSection>
  );
}

// =============================================================================
// CONTENT STRATEGY SECTION
// =============================================================================

function ContentStrategySection({ lead }: { lead: Lead }) {
  return (
    <MetricsSection title="Content Strategy">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Format Distribution */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Content Format Mix
          </h4>
          <div className="space-y-2">
            {lead.reels_rate !== null && lead.reels_rate !== undefined && (
              <FormatBar label="Reels" percentage={lead.reels_rate} color="purple" />
            )}
            {lead.image_rate !== null && lead.image_rate !== undefined && (
              <FormatBar label="Images" percentage={lead.image_rate} color="blue" />
            )}
            {lead.carousel_rate !== null && lead.carousel_rate !== undefined && (
              <FormatBar label="Carousels" percentage={lead.carousel_rate} color="green" />
            )}
          </div>
          <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
            Format Diversity: {lead.format_diversity || 0}/4 • Dominant:{' '}
            {lead.dominant_format || 'unknown'}
          </div>
        </div>

        {/* Hashtag Strategy */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Hashtag Usage
          </h4>
          <div className="space-y-2 mb-3">
            <Metric
              label="Avg per Post"
              value={lead.avg_hashtags_per_post?.toFixed(2) || '0'}
              interpretation={
                (lead.avg_hashtags_per_post || 0) < 1
                  ? 'Very low'
                  : (lead.avg_hashtags_per_post || 0) < 5
                    ? 'Low'
                    : 'Good'
              }
            />
            <Metric label="Unique Count" value={lead.unique_hashtag_count || 0} />
          </div>
          {lead.top_hashtags && lead.top_hashtags.length > 0 && (
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Top Hashtags:</p>
              <div className="flex flex-wrap gap-2">
                {lead.top_hashtags.map((ht, idx) => (
                  <HashtagBadge key={idx} tag={ht.hashtag} count={ht.count} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Caption & Engagement Settings */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <Metric
          label="Avg Caption Length"
          value={lead.avg_caption_length ? `${Math.round(lead.avg_caption_length)} chars` : '—'}
          interpretation={
            (lead.avg_caption_length || 0) < 100
              ? 'Short'
              : (lead.avg_caption_length || 0) < 200
                ? 'Medium'
                : 'Long'
          }
        />
        <Metric
          label="Location Tags"
          value={lead.location_tagging_rate ? `${lead.location_tagging_rate.toFixed(0)}%` : '0%'}
          interpretation={(lead.location_tagging_rate || 0) === 0 ? 'Opportunity' : 'Good'}
        />
        <Metric
          label="Comments Enabled"
          value={lead.comments_enabled_rate ? `${lead.comments_enabled_rate.toFixed(0)}%` : '—'}
          interpretation={(lead.comments_enabled_rate || 0) >= 90 ? 'Good' : 'Review'}
        />
      </div>

      {/* Top Mentions */}
      {lead.top_mentions && lead.top_mentions.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Most Mentioned Accounts
          </h4>
          <div className="flex flex-wrap gap-2">
            {lead.top_mentions.map((mention, idx) => (
              <MentionBadge key={idx} username={mention.username} count={mention.count} />
            ))}
          </div>
        </div>
      )}
    </MetricsSection>
  );
}

// =============================================================================
// POSTING BEHAVIOR SECTION
// =============================================================================

function PostingBehaviorSection({ lead }: { lead: Lead }) {
  return (
    <MetricsSection title="Posting Behavior">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Metric
          label="Posting Frequency"
          value={lead.posting_frequency ? `${lead.posting_frequency.toFixed(1)}/mo` : '—'}
          interpretation={
            (lead.posting_frequency || 0) > 20
              ? 'Very active'
              : (lead.posting_frequency || 0) > 10
                ? 'Active'
                : 'Low'
          }
          icon="mdi:calendar-clock"
          color="green"
        />

        <Metric
          label="Last Post"
          value={formatDaysAgo(lead.days_since_last_post)}
          interpretation={
            (lead.days_since_last_post || 999) < 1
              ? 'Recent'
              : (lead.days_since_last_post || 999) < 7
                ? 'Active'
                : 'Inactive'
          }
          icon="mdi:clock-outline"
          color="blue"
        />

        <Metric
          label="Posting Consistency"
          value={lead.posting_consistency ? `${Math.round(lead.posting_consistency)}/100` : '—'}
          interpretation={
            (lead.posting_consistency || 0) >= 80
              ? 'Excellent'
              : (lead.posting_consistency || 0) >= 60
                ? 'Good'
                : 'Inconsistent'
          }
          icon="mdi:calendar-check"
          color="green"
        />

        <Metric
          label="Avg Between Posts"
          value={formatDaysBetween(lead.avg_days_between_posts)}
          icon="mdi:timer-outline"
          color="purple"
        />
      </div>
    </MetricsSection>
  );
}

// =============================================================================
// VIDEO PERFORMANCE SECTION
// =============================================================================

function VideoPerformanceSection({ lead }: { lead: Lead }) {
  return (
    <MetricsSection title="Video Performance">
      <div className="grid grid-cols-3 gap-4">
        <Metric
          label="Video Posts"
          value={lead.video_post_count || 0}
          unit={`of ${lead.post_count || 0}`}
          icon="mdi:video"
        />

        <Metric
          label="Total Views"
          value={formatNumber(lead.total_video_views || 0)}
          rawValue={lead.total_video_views}
          icon="mdi:eye"
          color="blue"
        />

        <Metric
          label="Avg Views/Video"
          value={formatNumber(lead.avg_video_views || 0)}
          rawValue={lead.avg_video_views}
          icon="mdi:trending-up"
          color="green"
        />
      </div>
    </MetricsSection>
  );
}

// =============================================================================
// RISK & SIGNALS SECTION
// =============================================================================

function RiskAndSignalsSection({ lead }: { lead: Lead }) {
  // Build opportunities list from gaps
  const opportunities: string[] = [];
  if (lead.content_gap) {
    if ((lead.avg_hashtags_per_post || 0) < 1) {
      opportunities.push(
        `Increase hashtag usage (currently ${lead.avg_hashtags_per_post?.toFixed(2)}/post)`
      );
    }
    if ((lead.avg_caption_length || 0) < 150) {
      opportunities.push(
        `Expand caption length (currently ${Math.round(lead.avg_caption_length || 0)} chars)`
      );
    }
    if (lead.location_tagging_rate === 0) {
      opportunities.push('Add location tags (currently 0%)');
    }
  }

  return (
    <MetricsSection title="Risk Analysis & Signals">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Score */}
        <RiskScoreCard
          score={lead.fake_follower_risk_score}
          interpretation={lead.fake_follower_interpretation}
          warnings={lead.warnings}
        />

        {/* Gap Detection */}
        <GapAnalysis
          gaps={{
            engagementGap: lead.engagement_gap,
            contentGap: lead.content_gap,
            conversionGap: lead.conversion_gap,
            platformGap: lead.platform_gap,
          }}
          opportunities={opportunities}
        />
      </div>

      {/* Viral Posts */}
      {lead.recent_viral_post_count !== null && lead.recent_viral_post_count !== undefined && (
        <div className="mt-6">
          <ViralPostIndicator
            recentViralCount={lead.recent_viral_post_count}
            totalSampled={lead.recent_posts_sampled}
            percentage={lead.viral_post_rate}
            disclaimer="Based on recent sample - not representative of full history"
          />
        </div>
      )}
    </MetricsSection>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function FormatBar({
  label,
  percentage,
  color,
}: {
  label: string;
  percentage: number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
  };

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color] || 'bg-gray-500'} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function formatNumber(num: number | null | undefined): string {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return Math.round(num).toString();
}

function formatDaysAgo(days: number | null | undefined): string {
  if (days === null || days === undefined) return '—';
  if (days < 1) return `${Math.round(days * 24)}h ago`;
  if (days < 7) return `${Math.round(days)}d ago`;
  if (days < 30) return `${Math.round(days / 7)}w ago`;
  return `${Math.round(days / 30)}mo ago`;
}

function formatDaysBetween(days: number | null | undefined): string {
  if (days === null || days === undefined) return '—';
  if (days < 1) return `${Math.round(days * 24)}h`;
  if (days < 7) return `${days.toFixed(1)}d`;
  return `${Math.round(days)}d`;
}
