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

  // No calculated_metrics data - show empty state
  if (!lead.calculated_metrics || !lead.calculated_metrics.raw || !lead.calculated_metrics.scores || !lead.calculated_metrics.gaps) {
    return <EmptyMetricsState />;
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
      {(lead.calculated_metrics.raw.videoPostCount || 0) > 0 && (
        <VideoPerformanceSection lead={lead} />
      )}

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

function ScoreCardsSection({ lead }: { lead: Lead }) {
  const metrics = lead.calculated_metrics!;
  const scores = metrics.scores;
  const raw = metrics.raw;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <ScoreCard
        label="Profile Health"
        score={scores.profileHealthScore}
        maxScore={100}
        icon="mdi:heart-pulse"
        color="blue"
        tooltip="Overall account quality (engagement + content + maturity)"
      />

      <ScoreCard
        label="Engagement Health"
        score={scores.engagementHealth}
        maxScore={100}
        icon="mdi:chart-line"
        color="teal"
        tooltip="Quality and consistency of audience interactions"
      />

      <ScoreCard
        label="Content Quality"
        score={scores.contentSophistication}
        maxScore={100}
        icon="mdi:pencil-box-outline"
        color="purple"
        tooltip="Sophistication of content strategy"
      />

      <ScoreCard
        label="Account Maturity"
        score={scores.accountMaturity}
        maxScore={100}
        icon="mdi:shield-check"
        color="green"
        tooltip="Profile completeness and posting consistency"
      />

      <ScoreCard
        label="Fake Follower Risk"
        score={scores.fakeFollowerRisk}
        maxScore={100}
        icon="mdi:alert-circle"
        color="orange"
        inverted={true}
        tooltip="Likelihood of inauthentic followers (lower is better)"
      />

      <ScoreCard
        label="Authority Ratio"
        score={raw.authorityRatio}
        maxScore={100}
        icon="mdi:crown"
        color="gold"
        rawValue={raw.authorityRatioRaw}
        tooltip={`Followers-to-following ratio (raw: ${raw.authorityRatioRaw?.toLocaleString() || 0})`}
      />
    </div>
  );
}

// =============================================================================
// ENGAGEMENT SECTION
// =============================================================================

function EngagementSection({ lead }: { lead: Lead }) {
  const raw = lead.calculated_metrics!.raw;

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
          value={raw.engagementRate ? `${raw.engagementRate.toFixed(2)}%` : '—'}
          interpretation={getEngagementInterpretation(raw.engagementRate)}
          icon="mdi:trending-up"
          color="green"
        />

        <Metric
          label="Avg Likes/Post"
          value={raw.avgLikesPerPost ? formatNumber(raw.avgLikesPerPost) : '—'}
          rawValue={raw.avgLikesPerPost}
          icon="mdi:heart"
          color="red"
        />

        <Metric
          label="Avg Comments/Post"
          value={raw.avgCommentsPerPost ? formatNumber(raw.avgCommentsPerPost) : '—'}
          rawValue={raw.avgCommentsPerPost}
          icon="mdi:comment"
          color="blue"
        />

        <Metric
          label="Comment-to-Like Ratio"
          value={raw.commentToLikeRatio ? `${(raw.commentToLikeRatio * 100).toFixed(2)}%` : '—'}
          interpretation="Normal"
          icon="mdi:comment-quote"
          color="purple"
        />
      </div>

      {/* Engagement Consistency */}
      {raw.engagementConsistency !== null && raw.engagementConsistency !== undefined && (
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
                  style={{ width: `${raw.engagementConsistency}%` }}
                />
              </div>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {Math.round(raw.engagementConsistency)}/100
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            {raw.engagementStdDev && raw.engagementStdDev > 0.2
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
  const raw = lead.calculated_metrics!.raw;

  return (
    <MetricsSection title="Content Strategy">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Format Distribution */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Content Format Mix
          </h4>
          <div className="space-y-2">
            {raw.reelsRate !== null && raw.reelsRate !== undefined && (
              <FormatBar label="Reels" percentage={raw.reelsRate} color="purple" />
            )}
            {raw.imageRate !== null && raw.imageRate !== undefined && (
              <FormatBar label="Images" percentage={raw.imageRate} color="blue" />
            )}
            {raw.carouselRate !== null && raw.carouselRate !== undefined && (
              <FormatBar label="Carousels" percentage={raw.carouselRate} color="green" />
            )}
          </div>
          <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
            Format Diversity: {raw.formatDiversity || 0}/4 • Dominant: {raw.dominantFormat || 'unknown'}
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
              value={raw.avgHashtagsPerPost?.toFixed(2) || '0'}
              interpretation={
                (raw.avgHashtagsPerPost || 0) < 1
                  ? 'Very low'
                  : (raw.avgHashtagsPerPost || 0) < 5
                    ? 'Low'
                    : 'Good'
              }
            />
            <Metric label="Unique Count" value={raw.uniqueHashtagCount || 0} />
          </div>
          {raw.topHashtags && raw.topHashtags.length > 0 && (
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Top Hashtags:</p>
              <div className="flex flex-wrap gap-2">
                {raw.topHashtags.map((ht, idx) => (
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
          value={raw.avgCaptionLength ? `${Math.round(raw.avgCaptionLength)} chars` : '—'}
          interpretation={
            (raw.avgCaptionLength || 0) < 100 ? 'Short' : (raw.avgCaptionLength || 0) < 200 ? 'Medium' : 'Long'
          }
        />
        <Metric
          label="Location Tags"
          value={raw.locationTaggingRate ? `${raw.locationTaggingRate.toFixed(0)}%` : '0%'}
          interpretation={(raw.locationTaggingRate || 0) === 0 ? 'Opportunity' : 'Good'}
        />
        <Metric
          label="Comments Enabled"
          value={raw.commentsEnabledRate ? `${raw.commentsEnabledRate.toFixed(0)}%` : '—'}
          interpretation={(raw.commentsEnabledRate || 0) >= 90 ? 'Good' : 'Review'}
        />
      </div>

      {/* Top Mentions */}
      {raw.topMentions && raw.topMentions.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Most Mentioned Accounts
          </h4>
          <div className="flex flex-wrap gap-2">
            {raw.topMentions.map((mention, idx) => (
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
  const raw = lead.calculated_metrics!.raw;

  return (
    <MetricsSection title="Posting Behavior">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Metric
          label="Posting Frequency"
          value={raw.postingFrequency ? `${raw.postingFrequency.toFixed(1)}/mo` : '—'}
          interpretation={
            (raw.postingFrequency || 0) > 20
              ? 'Very active'
              : (raw.postingFrequency || 0) > 10
                ? 'Active'
                : 'Low'
          }
          icon="mdi:calendar-clock"
          color="green"
        />

        <Metric
          label="Last Post"
          value={formatDaysAgo(raw.daysSinceLastPost)}
          interpretation={
            (raw.daysSinceLastPost || 999) < 1
              ? 'Recent'
              : (raw.daysSinceLastPost || 999) < 7
                ? 'Active'
                : 'Inactive'
          }
          icon="mdi:clock-outline"
          color="blue"
        />

        <Metric
          label="Posting Consistency"
          value={raw.postingConsistency ? `${Math.round(raw.postingConsistency)}/100` : '—'}
          interpretation={
            (raw.postingConsistency || 0) >= 80
              ? 'Excellent'
              : (raw.postingConsistency || 0) >= 60
                ? 'Good'
                : 'Inconsistent'
          }
          icon="mdi:calendar-check"
          color="green"
        />

        <Metric
          label="Avg Between Posts"
          value={formatDaysBetween(raw.avgDaysBetweenPosts)}
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
  const raw = lead.calculated_metrics!.raw;

  return (
    <MetricsSection title="Video Performance">
      <div className="grid grid-cols-3 gap-4">
        <Metric
          label="Video Posts"
          value={raw.videoPostCount || 0}
          unit={`of ${raw.postsCount || 0}`}
          icon="mdi:video"
        />

        <Metric
          label="Total Views"
          value={formatNumber(raw.totalVideoViews || 0)}
          rawValue={raw.totalVideoViews}
          icon="mdi:eye"
          color="blue"
        />

        <Metric
          label="Avg Views/Video"
          value={formatNumber(raw.avgVideoViews || 0)}
          rawValue={raw.avgVideoViews}
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
  const metrics = lead.calculated_metrics!;
  const raw = metrics.raw;
  const gaps = metrics.gaps;

  // Build opportunities list from gaps
  const opportunities: string[] = [];
  if (gaps.contentGap) {
    if ((raw.avgHashtagsPerPost || 0) < 1) {
      opportunities.push(`Increase hashtag usage (currently ${raw.avgHashtagsPerPost?.toFixed(2)}/post)`);
    }
    if ((raw.avgCaptionLength || 0) < 150) {
      opportunities.push(`Expand caption length (currently ${Math.round(raw.avgCaptionLength || 0)} chars)`);
    }
    if (raw.locationTaggingRate === 0) {
      opportunities.push('Add location tags (currently 0%)');
    }
  }

  return (
    <MetricsSection title="Risk Analysis & Signals">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Score */}
        <RiskScoreCard
          score={raw.fakeFollowerRiskScore}
          warnings={raw.fakeFollowerWarnings}
        />

        {/* Gap Detection */}
        <GapAnalysis
          gaps={{
            engagementGap: gaps.engagementGap,
            contentGap: gaps.contentGap,
            conversionGap: gaps.conversionGap,
            platformGap: gaps.platformGap,
          }}
          opportunities={opportunities}
        />
      </div>

      {/* Viral Posts */}
      {raw.recentViralPostCount !== null && raw.recentViralPostCount !== undefined && (
        <div className="mt-6">
          <ViralPostIndicator
            recentViralCount={raw.recentViralPostCount}
            totalSampled={raw.recentPostsSampled}
            percentage={raw.viralPostRate}
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
