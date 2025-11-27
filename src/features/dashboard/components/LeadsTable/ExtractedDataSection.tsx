// src/features/dashboard/components/LeadsTable/ExtractedDataSection.tsx

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
  const { static: staticMetrics, calculated, metadata } = extractedData;

  return (
    <div className="space-y-6">
      {/* Static Metrics Section */}
      <MetricsSection title="Raw Profile Data">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <Metric
            label="Account Type"
            value={staticMetrics.isBusinessAccount ? 'Business' : 'Personal'}
            icon={staticMetrics.isBusinessAccount ? 'mdi:briefcase' : 'mdi:account'}
            color={staticMetrics.isBusinessAccount ? 'purple' : 'gray'}
          />

          <Metric
            label="Verified"
            value={staticMetrics.verified ? 'Yes' : 'No'}
            icon={staticMetrics.verified ? 'mdi:check-decagram' : 'mdi:close-circle-outline'}
            color={staticMetrics.verified ? 'blue' : 'gray'}
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
        </div>

        {/* Video Performance */}
        {staticMetrics.avgVideoViews !== null && staticMetrics.avgVideoViews !== undefined && (
          <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
            <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
              <Icon icon="mdi:video" className="w-4 h-4" />
              Video Performance
            </h4>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {formatNumber(staticMetrics.avgVideoViews)} avg views
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Raw value: {staticMetrics.avgVideoViews.toLocaleString()}
            </div>
          </div>
        )}

        {/* External URL */}
        {staticMetrics.externalUrl && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <Icon icon="mdi:link" className="w-4 h-4" />
              External Link
            </h4>
            <a
              href={staticMetrics.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
            >
              {staticMetrics.externalUrl}
            </a>
          </div>
        )}

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
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Posting Consistency
            </h4>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${staticMetrics.postingConsistency || 0}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-green-500"
                />
              </div>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {Math.round(staticMetrics.postingConsistency || 0)}/100
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
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
          />

          <Metric
            label="Engagement Health"
            value={`${Math.round(calculated.engagementHealth || 0)}/100`}
            interpretation={getHealthInterpretation(calculated.engagementHealth)}
            icon="mdi:chart-line"
            color="teal"
          />

          <Metric
            label="Content Quality"
            value={`${Math.round(calculated.contentSophistication || 0)}/100`}
            interpretation={getQualityInterpretation(calculated.contentSophistication)}
            icon="mdi:star"
            color="purple"
          />

          <Metric
            label="Account Maturity"
            value={`${Math.round(calculated.accountMaturity || 0)}/100`}
            interpretation={getMaturityInterpretation(calculated.accountMaturity)}
            icon="mdi:shield-check"
            color="green"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <Metric
            label="Authority Ratio"
            value={Math.round(calculated.authorityRatio || 0).toString()}
            icon="mdi:crown"
            color="gold"
          />

          <Metric
            label="Engagement Score"
            value={calculated.engagementScore?.toFixed(2) || '0'}
            interpretation={
              (calculated.engagementScore || 0) >= 3
                ? 'Excellent'
                : (calculated.engagementScore || 0) >= 1
                  ? 'Good'
                  : 'Fair'
            }
            icon="mdi:trending-up"
            color="green"
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
          />
        </div>

        {/* Fake Follower Analysis */}
        {calculated.fakeFollowerWarning && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`mt-6 p-4 rounded-lg border-2 ${
              calculated.fakeFollowerWarning.toLowerCase().includes('healthy')
                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
                : calculated.fakeFollowerWarning.toLowerCase().includes('warning')
                  ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'
                  : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
            }`}
          >
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Icon
                icon={
                  calculated.fakeFollowerWarning.toLowerCase().includes('healthy')
                    ? 'mdi:shield-check'
                    : 'mdi:shield-alert'
                }
                className={`w-5 h-5 ${
                  calculated.fakeFollowerWarning.toLowerCase().includes('healthy')
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : calculated.fakeFollowerWarning.toLowerCase().includes('warning')
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-red-600 dark:text-red-400'
                }`}
              />
              <span
                className={
                  calculated.fakeFollowerWarning.toLowerCase().includes('healthy')
                    ? 'text-emerald-900 dark:text-emerald-100'
                    : calculated.fakeFollowerWarning.toLowerCase().includes('warning')
                      ? 'text-amber-900 dark:text-amber-100'
                      : 'text-red-900 dark:text-red-100'
                }
              >
                Authenticity Assessment
              </span>
            </h4>
            <p
              className={`text-sm ${
                calculated.fakeFollowerWarning.toLowerCase().includes('healthy')
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : calculated.fakeFollowerWarning.toLowerCase().includes('warning')
                    ? 'text-amber-700 dark:text-amber-300'
                    : 'text-red-700 dark:text-red-300'
              }`}
            >
              {calculated.fakeFollowerWarning}
            </p>
          </motion.div>
        )}
      </MetricsSection>

      {/* Metadata Section */}
      <MetricsSection title="Extraction Metadata">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:information" className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Version
              </span>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {metadata.version}
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:database" className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Sample Size
              </span>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {metadata.sampleSize} posts
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:clock-outline" className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Extracted
              </span>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {formatExtractedDate(metadata.extractedAt)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {formatTimeAgo(metadata.extractedAt)}
            </div>
          </div>
        </div>
      </MetricsSection>
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

function formatExtractedDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Unknown';
  }
}

function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  } catch {
    return 'Unknown';
  }
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
