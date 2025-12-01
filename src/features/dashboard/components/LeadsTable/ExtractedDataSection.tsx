/**
 * EXTRACTED DATA SECTION COMPONENT
 *
 * Displays raw extracted data from the analysis pipeline
 * Organized into three subsections:
 * - Static Metrics (raw observed data)
 * - Calculated Metrics (derived/computed values)
 * - Metadata (extraction info)
 *
 * Enterprise-grade design matching the existing Analytics tab style
 */

import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import type { ExtractedData } from '@/shared/types/leads.types';
import { MetricsSection, Metric, HashtagBadge, MentionBadge } from './analytics';

interface ExtractedDataSectionProps {
  extractedData: ExtractedData;
}

export function ExtractedDataSection({ extractedData }: ExtractedDataSectionProps) {
  const { static: staticMetrics, calculated, metadata: _metadata } = extractedData;

  // Helper to get tier colors
  const getTierConfig = (tier?: 'hot' | 'warm' | 'cold') => {
    switch (tier) {
      case 'hot':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-700 dark:text-red-300',
          icon: 'mdi:fire',
        };
      case 'warm':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800',
          text: 'text-amber-700 dark:text-amber-300',
          icon: 'mdi:fire',
        };
      case 'cold':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-700 dark:text-blue-300',
          icon: 'mdi:snowflake',
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          border: 'border-gray-200 dark:border-gray-700',
          text: 'text-gray-700 dark:text-gray-300',
          icon: 'mdi:help-circle',
        };
    }
  };

  const tierConfig = getTierConfig(calculated?.leadTier);

  return (
    <div className="space-y-6">
      {/* Influencer Markings Section - Always visible */}
      <MetricsSection title="Influencer Markings">
        <div className="flex flex-wrap items-center gap-3">
          {/* Lead Tier Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border ${tierConfig.bg} ${tierConfig.border} transition-all duration-200 hover:shadow-sm`}
          >
            <Icon icon={tierConfig.icon} className={`w-5 h-5 ${tierConfig.text}`} />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Lead Tier</span>
              <span className={`text-sm font-bold uppercase ${tierConfig.text}`}>
                {calculated?.leadTier || 'Not set'}
              </span>
            </div>
          </div>

          {/* Audience Scale Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 transition-all duration-200 hover:shadow-sm">
            <Icon icon="mdi:account-group" className="w-5 h-5 text-purple-700 dark:text-purple-300" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Audience Scale</span>
              <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                {calculated?.audienceScale || 'Not set'}
              </span>
            </div>
          </div>
        </div>
      </MetricsSection>

      {/* Post Stats Section */}
      <MetricsSection title="Post Stats">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Metric
            label="Total Posts"
            value={staticMetrics.postsCount?.toLocaleString() || '0'}
            icon="mdi:image-multiple"
            color="blue"
          />

          <Metric
            label="Followers"
            value={formatNumber(staticMetrics.followersCount)}
            rawValue={staticMetrics.followersCount}
            icon="mdi:account-group"
            color="purple"
          />

          <Metric
            label="Avg Likes/Post"
            value={formatNumber(staticMetrics.avgLikesPerPost)}
            rawValue={staticMetrics.avgLikesPerPost}
            icon="mdi:heart"
            color="red"
          />

          <Metric
            label="Avg Comments/Post"
            value={formatNumber(staticMetrics.avgCommentsPerPost)}
            rawValue={staticMetrics.avgCommentsPerPost}
            icon="mdi:comment"
            color="green"
          />

          <Metric
            label="Format Diversity"
            value={`${staticMetrics.formatDiversity || 0}/4`}
            interpretation={staticMetrics.dominantFormat || 'Unknown'}
            icon="mdi:palette"
            color="amber"
          />

          <Metric
            label="Last Post"
            value={formatDaysAgo(staticMetrics.daysSinceLastPost)}
            interpretation={
              (staticMetrics.daysSinceLastPost || 999) < 1
                ? 'Very recent'
                : (staticMetrics.daysSinceLastPost || 999) < 7
                  ? 'Recent'
                  : 'Inactive'
            }
            icon="mdi:clock-outline"
            color="blue"
          />

          {/* Video Performance as a box */}
          {staticMetrics.avgVideoViews !== null && staticMetrics.avgVideoViews !== undefined && (
            <Metric
              label="Avg Video Views"
              value={formatNumber(staticMetrics.avgVideoViews)}
              rawValue={staticMetrics.avgVideoViews}
              icon="mdi:video"
              color="purple"
            />
          )}
        </div>

        {/* Business Category */}
        {staticMetrics.businessCategoryName && (
          <div className="mt-4">
            <Metric
              label="Business Category"
              value={staticMetrics.businessCategoryName}
              icon="mdi:tag"
              color="purple"
            />
          </div>
        )}

        {/* Content Strategy Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Top Hashtags */}
          {staticMetrics.topHashtags && staticMetrics.topHashtags.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Icon icon="mdi:pound" className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Top Hashtags
              </h4>
              <div className="flex flex-wrap gap-2">
                {staticMetrics.topHashtags.map((ht, idx) => (
                  <HashtagBadge key={idx} tag={ht.hashtag} count={ht.count} />
                ))}
              </div>
            </div>
          )}

          {/* Top Mentions */}
          {staticMetrics.topMentions && staticMetrics.topMentions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Icon icon="mdi:at" className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Top Mentions
              </h4>
              <div className="flex flex-wrap gap-2">
                {staticMetrics.topMentions.map((mention, idx) => (
                  <MentionBadge key={idx} username={mention.username} count={mention.count} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Posting Consistency */}
        <div className="mt-6 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-green-50">
                <Icon icon="mdi:calendar-check" className="w-4 h-4 text-green-600" />
              </div>
              Posting Consistency
            </h4>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              {Math.round(staticMetrics.postingConsistency || 0)}
              <span className="text-sm font-medium text-gray-400">/100</span>
            </span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${staticMetrics.postingConsistency || 0}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                />
              </div>
            </div>
          </div>
          <p className="text-xs font-medium text-gray-500">
            {(staticMetrics.postingConsistency || 0) >= 80
              ? 'Highly consistent posting schedule'
              : (staticMetrics.postingConsistency || 0) >= 60
                ? 'Moderately consistent posting'
                : 'Irregular posting pattern'}
          </p>
        </div>
      </MetricsSection>

      {/* Calculated Metrics Section */}
      <MetricsSection title="Computed Analytics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Metric
            label="Profile Health"
            value={`${Math.round(calculated.profileHealthScore || 0)}/100`}
            interpretation={getHealthInterpretation(calculated.profileHealthScore)}
            icon="mdi:heart-pulse"
            color="blue"
            tooltip="Overall account health based on follower count, engagement rate, posting frequency, and content diversity. Higher scores indicate a well-maintained, active profile."
          />

          <Metric
            label="Engagement Health"
            value={`${Math.round(calculated.engagementHealth || 0)}/100`}
            interpretation={getHealthInterpretation(calculated.engagementHealth)}
            icon="mdi:chart-line"
            color="teal"
            tooltip="Measures how well the audience interacts with content. Considers likes-to-follower ratio, comment rate, and engagement consistency across posts."
          />

          <Metric
            label="Content Quality"
            value={`${Math.round(calculated.contentSophistication || 0)}/100`}
            interpretation={getQualityInterpretation(calculated.contentSophistication)}
            icon="mdi:star"
            color="purple"
            tooltip="Evaluates content professionalism through format diversity, caption quality, posting consistency, and use of hashtags and mentions."
          />

          <Metric
            label="Account Maturity"
            value={`${Math.round(calculated.accountMaturity || 0)}/100`}
            interpretation={getMaturityInterpretation(calculated.accountMaturity)}
            icon="mdi:shield-check"
            color="green"
            tooltip="Indicates account establishment and credibility based on total posts, follower base size, and profile completeness."
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <Metric
            label="Authority Ratio"
            value={Math.round(calculated.authorityRatio || 0).toString()}
            icon="mdi:crown"
            color="gold"
            tooltip="Ratio of followers to following count. Higher values suggest the account is influential and has earned its audience rather than following many accounts for reciprocal follows."
          />

          <Metric
            label="Engagement Score"
            value={`${calculated.engagementScore?.toFixed(2) || '0'}%`}
            interpretation={
              (calculated.engagementScore || 0) >= 5
                ? 'Excellent'
                : (calculated.engagementScore || 0) >= 2
                  ? 'Good'
                  : 'Fair'
            }
            icon="mdi:trending-up"
            color="green"
            tooltip="Engagement score based on follower interactions. Calculated as (average likes + comments) / followers × 100. Higher scores indicate a more active and responsive audience."
          />

          <Metric
            label="Engagement Consistency"
            value={`${Math.round(calculated.engagementConsistency || 0)}/100`}
            interpretation={
              (calculated.engagementConsistency || 0) >= 70
                ? 'Stable'
                : (calculated.engagementConsistency || 0) >= 40
                  ? 'Variable'
                  : 'Volatile'
            }
            icon="mdi:chart-bell-curve"
            color="amber"
            tooltip="Measures how stable engagement is across posts. High consistency means the audience reliably engages with content, while low scores indicate unpredictable performance."
          />
        </div>

        {/* Fake Follower Analysis */}
        {calculated.fakeFollowerWarning && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`mt-6 p-6 rounded-lg border-2 bg-white shadow-sm ${
              calculated.fakeFollowerWarning.toLowerCase().includes('healthy')
                ? 'border-emerald-200'
                : calculated.fakeFollowerWarning.toLowerCase().includes('warning')
                  ? 'border-amber-200'
                  : 'border-red-200'
            }`}
          >
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2.5">
              <div
                className={`p-1.5 rounded-md ${
                  calculated.fakeFollowerWarning.toLowerCase().includes('healthy')
                    ? 'bg-emerald-50'
                    : calculated.fakeFollowerWarning.toLowerCase().includes('warning')
                      ? 'bg-amber-50'
                      : 'bg-red-50'
                }`}
              >
                <Icon
                  icon={
                    calculated.fakeFollowerWarning.toLowerCase().includes('healthy')
                      ? 'mdi:shield-check'
                      : 'mdi:shield-alert'
                  }
                  className={`w-4 h-4 ${
                    calculated.fakeFollowerWarning.toLowerCase().includes('healthy')
                      ? 'text-emerald-600'
                      : calculated.fakeFollowerWarning.toLowerCase().includes('warning')
                        ? 'text-amber-600'
                        : 'text-red-600'
                  }`}
                />
              </div>
              <span className="text-gray-900">Authenticity Assessment</span>
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {calculated.fakeFollowerWarning}
            </p>
          </motion.div>
        )}
      </MetricsSection>
    </div>
  );
}

// UTILITY FUNCTIONS
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

function getHealthInterpretation(score: number | null | undefined): string {
  if (!score) return 'No data';
  if (score >= 75) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

function getQualityInterpretation(score: number | null | undefined): string {
  if (!score) return 'No data';
  if (score >= 70) return 'High quality';
  if (score >= 50) return 'Moderate';
  if (score >= 30) return 'Basic';
  return 'Low quality';
}

function getMaturityInterpretation(score: number | null | undefined): string {
  if (!score) return 'No data';
  if (score >= 80) return 'Very mature';
  if (score >= 60) return 'Mature';
  if (score >= 40) return 'Developing';
  return 'New';
}
