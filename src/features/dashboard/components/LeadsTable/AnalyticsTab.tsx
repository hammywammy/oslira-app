// src/features/dashboard/components/LeadsTable/AnalyticsTab.tsx

/**
 * ANALYTICS TAB - COMPREHENSIVE METRICS DASHBOARD
 *
 * Displays all 80+ calculated metrics from deep analysis
 * Shows locked state for light analysis
 */

import { Icon } from '@iconify/react';
import type { Lead, AnalysisType, CalculatedMetrics } from '@/shared/types/leads.types';
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

  // No calculated_metrics data - show empty state
  if (!lead.calculated_metrics) {
    return <EmptyMetricsState />;
  }

  const metrics = lead.calculated_metrics;

  // Deep analysis - show full metrics
  return (
    <div className="space-y-6">
      {/* Score Cards Section */}
      <ScoreCardsSection metrics={metrics} />

      {/* Engagement Metrics */}
      <EngagementSection metrics={metrics} />

      {/* Content Strategy */}
      <ContentStrategySection metrics={metrics} />

      {/* Posting Behavior */}
      <PostingBehaviorSection metrics={metrics} />

      {/* Video Performance (conditional) */}
      {(metrics.video_post_count || 0) > 0 && <VideoPerformanceSection metrics={metrics} />}

      {/* Risk & Signals */}
      <RiskAndSignalsSection metrics={metrics} />
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

function EmptyMetricsState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <Icon icon="mdi:chart-box-outline" className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No Analytics Data
      </h3>

      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
        Analytics data is not available for this lead yet. Run a deep analysis to generate metrics.
      </p>
    </div>
  );
}

// =============================================================================
// SCORE CARDS SECTION
// =============================================================================

function ScoreCardsSection({ metrics }: { metrics: CalculatedMetrics }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <ScoreCard
        label="Profile Health"
        score={metrics.profile_health_score}
        maxScore={100}
        icon="mdi:heart-pulse"
        color="blue"
        tooltip="Overall account quality (engagement + content + maturity)"
      />

      <ScoreCard
        label="Engagement Health"
        score={metrics.engagement_health}
        maxScore={100}
        icon="mdi:chart-line"
        color="teal"
        tooltip="Quality and consistency of audience interactions"
      />

      <ScoreCard
        label="Content Quality"
        score={metrics.content_sophistication}
        maxScore={100}
        icon="mdi:pencil-box-outline"
        color="purple"
        tooltip="Sophistication of content strategy"
      />

      <ScoreCard
        label="Account Maturity"
        score={metrics.account_maturity}
        maxScore={100}
        icon="mdi:shield-check"
        color="green"
        tooltip="Profile completeness and posting consistency"
      />

      <ScoreCard
        label="Fake Follower Risk"
        score={metrics.fake_follower_risk_score}
        maxScore={100}
        icon="mdi:alert-circle"
        color="orange"
        inverted={true}
        tooltip="Likelihood of inauthentic followers (lower is better)"
      />

      <ScoreCard
        label="Authority Ratio"
        score={metrics.authority_ratio}
        maxScore={100}
        icon="mdi:crown"
        color="gold"
        rawValue={metrics.authority_ratio_raw}
        tooltip={`Followers-to-following ratio (raw: ${metrics.authority_ratio_raw?.toLocaleString() || 0})`}
      />
    </div>
  );
}

// =============================================================================
// ENGAGEMENT SECTION
// =============================================================================

function EngagementSection({ metrics }: { metrics: CalculatedMetrics }) {
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
          value={metrics.engagement_rate ? `${metrics.engagement_rate.toFixed(2)}%` : '—'}
          interpretation={getEngagementInterpretation(metrics.engagement_rate)}
          icon="mdi:trending-up"
          color="green"
        />

        <Metric
          label="Avg Likes/Post"
          value={metrics.avg_likes_per_post ? formatNumber(metrics.avg_likes_per_post) : '—'}
          rawValue={metrics.avg_likes_per_post}
          icon="mdi:heart"
          color="red"
        />

        <Metric
          label="Avg Comments/Post"
          value={metrics.avg_comments_per_post ? formatNumber(metrics.avg_comments_per_post) : '—'}
          rawValue={metrics.avg_comments_per_post}
          icon="mdi:comment"
          color="blue"
        />

        <Metric
          label="Comment-to-Like Ratio"
          value={
            metrics.comment_to_like_ratio
              ? `${(metrics.comment_to_like_ratio * 100).toFixed(2)}%`
              : '—'
          }
          interpretation="Normal"
          icon="mdi:comment-quote"
          color="purple"
        />
      </div>

      {/* Engagement Consistency */}
      {metrics.engagement_consistency !== null && metrics.engagement_consistency !== undefined && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Engagement Consistency
            </h4>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 transition-all duration-300"
                  style={{ width: `${metrics.engagement_consistency}%` }}
                />
              </div>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {Math.round(metrics.engagement_consistency)}/100
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            {metrics.engagement_std_dev && metrics.engagement_std_dev > 0.2
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

function ContentStrategySection({ metrics }: { metrics: CalculatedMetrics }) {
  return (
    <MetricsSection title="Content Strategy">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Format Distribution */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Content Format Mix
          </h4>
          <div className="space-y-2">
            {metrics.reels_rate !== null && metrics.reels_rate !== undefined && (
              <FormatBar label="Reels" percentage={metrics.reels_rate} color="purple" />
            )}
            {metrics.image_rate !== null && metrics.image_rate !== undefined && (
              <FormatBar label="Images" percentage={metrics.image_rate} color="blue" />
            )}
            {metrics.carousel_rate !== null && metrics.carousel_rate !== undefined && (
              <FormatBar label="Carousels" percentage={metrics.carousel_rate} color="green" />
            )}
          </div>
          <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
            Format Diversity: {metrics.format_diversity || 0}/4 • Dominant:{' '}
            {metrics.dominant_format || 'unknown'}
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
              value={metrics.avg_hashtags_per_post?.toFixed(2) || '0'}
              interpretation={
                (metrics.avg_hashtags_per_post || 0) < 1
                  ? 'Very low'
                  : (metrics.avg_hashtags_per_post || 0) < 5
                    ? 'Low'
                    : 'Good'
              }
            />
            <Metric label="Unique Count" value={metrics.unique_hashtag_count || 0} />
          </div>
          {metrics.top_hashtags && metrics.top_hashtags.length > 0 && (
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Top Hashtags:</p>
              <div className="flex flex-wrap gap-2">
                {metrics.top_hashtags.map((ht, idx) => (
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
          value={metrics.avg_caption_length ? `${Math.round(metrics.avg_caption_length)} chars` : '—'}
          interpretation={
            (metrics.avg_caption_length || 0) < 100
              ? 'Short'
              : (metrics.avg_caption_length || 0) < 200
                ? 'Medium'
                : 'Long'
          }
        />
        <Metric
          label="Location Tags"
          value={metrics.location_tagging_rate ? `${metrics.location_tagging_rate.toFixed(0)}%` : '0%'}
          interpretation={(metrics.location_tagging_rate || 0) === 0 ? 'Opportunity' : 'Good'}
        />
        <Metric
          label="Comments Enabled"
          value={metrics.comments_enabled_rate ? `${metrics.comments_enabled_rate.toFixed(0)}%` : '—'}
          interpretation={(metrics.comments_enabled_rate || 0) >= 90 ? 'Good' : 'Review'}
        />
      </div>

      {/* Top Mentions */}
      {metrics.top_mentions && metrics.top_mentions.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Most Mentioned Accounts
          </h4>
          <div className="flex flex-wrap gap-2">
            {metrics.top_mentions.map((mention, idx) => (
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

function PostingBehaviorSection({ metrics }: { metrics: CalculatedMetrics }) {
  return (
    <MetricsSection title="Posting Behavior">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Metric
          label="Posting Frequency"
          value={metrics.posting_frequency ? `${metrics.posting_frequency.toFixed(1)}/mo` : '—'}
          interpretation={
            (metrics.posting_frequency || 0) > 20
              ? 'Very active'
              : (metrics.posting_frequency || 0) > 10
                ? 'Active'
                : 'Low'
          }
          icon="mdi:calendar-clock"
          color="green"
        />

        <Metric
          label="Last Post"
          value={formatDaysAgo(metrics.days_since_last_post)}
          interpretation={
            (metrics.days_since_last_post || 999) < 1
              ? 'Recent'
              : (metrics.days_since_last_post || 999) < 7
                ? 'Active'
                : 'Inactive'
          }
          icon="mdi:clock-outline"
          color="blue"
        />

        <Metric
          label="Posting Consistency"
          value={metrics.posting_consistency ? `${Math.round(metrics.posting_consistency)}/100` : '—'}
          interpretation={
            (metrics.posting_consistency || 0) >= 80
              ? 'Excellent'
              : (metrics.posting_consistency || 0) >= 60
                ? 'Good'
                : 'Inconsistent'
          }
          icon="mdi:calendar-check"
          color="green"
        />

        <Metric
          label="Avg Between Posts"
          value={formatDaysBetween(metrics.avg_days_between_posts)}
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

function VideoPerformanceSection({ metrics }: { metrics: CalculatedMetrics }) {
  return (
    <MetricsSection title="Video Performance">
      <div className="grid grid-cols-3 gap-4">
        <Metric
          label="Video Posts"
          value={metrics.video_post_count || 0}
          unit={`of ${metrics.posts_count || 0}`}
          icon="mdi:video"
        />

        <Metric
          label="Total Views"
          value={formatNumber(metrics.total_video_views || 0)}
          rawValue={metrics.total_video_views}
          icon="mdi:eye"
          color="blue"
        />

        <Metric
          label="Avg Views/Video"
          value={formatNumber(metrics.avg_video_views || 0)}
          rawValue={metrics.avg_video_views}
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

function RiskAndSignalsSection({ metrics }: { metrics: CalculatedMetrics }) {
  // Build opportunities list from gaps
  const opportunities: string[] = [];
  if (metrics.content_gap) {
    if ((metrics.avg_hashtags_per_post || 0) < 1) {
      opportunities.push(
        `Increase hashtag usage (currently ${metrics.avg_hashtags_per_post?.toFixed(2)}/post)`
      );
    }
    if ((metrics.avg_caption_length || 0) < 150) {
      opportunities.push(
        `Expand caption length (currently ${Math.round(metrics.avg_caption_length || 0)} chars)`
      );
    }
    if (metrics.location_tagging_rate === 0) {
      opportunities.push('Add location tags (currently 0%)');
    }
  }

  return (
    <MetricsSection title="Risk Analysis & Signals">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Score */}
        <RiskScoreCard
          score={metrics.fake_follower_risk_score}
          interpretation={metrics.fake_follower_interpretation}
          warnings={metrics.warnings}
        />

        {/* Gap Detection */}
        <GapAnalysis
          gaps={{
            engagementGap: metrics.engagement_gap,
            contentGap: metrics.content_gap,
            conversionGap: metrics.conversion_gap,
            platformGap: metrics.platform_gap,
          }}
          opportunities={opportunities}
        />
      </div>

      {/* Viral Posts */}
      {metrics.recent_viral_post_count !== null && metrics.recent_viral_post_count !== undefined && (
        <div className="mt-6">
          <ViralPostIndicator
            recentViralCount={metrics.recent_viral_post_count}
            totalSampled={metrics.recent_posts_sampled}
            percentage={metrics.viral_post_rate}
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
