// src/features/dashboard/components/LeadsTable/ScoreBreakdown.tsx

/**
 * SCORE BREAKDOWN COMPONENT
 *
 * Displays 4 score categories with weighted progress bars:
 * - Profile Fit (0-50) - 50% weight - Most dominant factor
 * - Readiness (0-25) - 25% weight - Second strongest factor
 * - Engagement (0-15) - 15% weight - Third priority
 * - Authority (0-10) - 10% weight - Fourth priority
 * Total: 100 points
 */

import { Icon } from '@iconify/react';

interface ScoreCategory {
  label: string;
  key: 'profileFit' | 'engagement' | 'authority' | 'readiness';
  score: number | null;
  maxScore: number;
}

interface ScoreBreakdownProps {
  scores: {
    profileFit: number | null;
    engagement: number | null;
    authority: number | null;
    readiness: number | null;
  };
  overallScore: number | null;
}

const SCORE_CATEGORIES: Omit<ScoreCategory, 'score'>[] = [
  { label: 'Profile Fit', key: 'profileFit', maxScore: 50 },
  { label: 'Readiness', key: 'readiness', maxScore: 25 },
  { label: 'Engagement', key: 'engagement', maxScore: 15 },
  { label: 'Authority', key: 'authority', maxScore: 10 },
];

function ScoreRow({ label, score, maxScore }: { label: string; score: number | null; maxScore: number }) {
  const percentage = score !== null ? (score / maxScore) * 100 : 0;
  const hasScore = score !== null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-between w-32 shrink-0">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label={`Info about ${label}`}
        >
          <Icon icon="mdi:information-outline" width={14} />
        </button>
      </div>

      <div className="flex-1 flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          {hasScore && (
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          )}
        </div>

        <span className={`text-sm font-semibold w-12 text-right ${
          hasScore ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'
        }`}>
          {hasScore ? `${score}/${maxScore}` : `--/${maxScore}`}
        </span>
      </div>
    </div>
  );
}

export function ScoreBreakdown({ scores, overallScore }: ScoreBreakdownProps) {
  return (
    <div className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-5 transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
        Score Breakdown
      </h3>

      <div className="space-y-4">
        {SCORE_CATEGORIES.map((category) => (
          <ScoreRow
            key={category.key}
            label={category.label}
            score={scores[category.key]}
            maxScore={category.maxScore}
          />
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Overall Score</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {overallScore !== null ? `${overallScore}/100` : '--/100'}
          </span>
        </div>
      </div>
    </div>
  );
}
