// src/features/dashboard/components/LeadsTable/analytics/ScoreCard.tsx

import { Icon } from '@iconify/react';
import { Tooltip } from '@/shared/components/ui/Tooltip';

interface ScoreCardProps {
  label: string;
  score: number | null | undefined;
  maxScore: number;
  icon: string;
  color: 'blue' | 'teal' | 'purple' | 'green' | 'orange' | 'gold';
  tooltip?: string;
  inverted?: boolean; // If true, lower scores are better
  interpretation?: string;
  rawValue?: number; // Show on hover
}

const COLOR_CLASSES = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  teal: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  gold: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
};

const PROGRESS_COLORS = {
  blue: 'bg-blue-500',
  teal: 'bg-teal-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  gold: 'bg-yellow-500',
};

export function ScoreCard({
  label,
  score,
  maxScore,
  icon,
  color,
  tooltip,
  inverted: _inverted = false,
  interpretation,
  rawValue,
}: ScoreCardProps) {
  const hasScore = score !== null && score !== undefined;
  const percentage = hasScore ? (score / maxScore) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${COLOR_CLASSES[color]}`}
          >
            <Icon icon={icon} className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        </div>

        {tooltip && (
          <Tooltip content={tooltip}>
            <Icon icon="mdi:information-outline" className="w-4 h-4 text-gray-400 cursor-help" />
          </Tooltip>
        )}
      </div>

      {/* Score Display */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {hasScore ? Math.round(score) : '—'}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">/ {maxScore}</span>
        {rawValue !== undefined && rawValue !== null && (
          <Tooltip content={`Raw value: ${rawValue.toLocaleString()}`}>
            <span className="text-xs text-gray-400 cursor-help">ⓘ</span>
          </Tooltip>
        )}
      </div>

      {/* Progress Bar */}
      {hasScore && (
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full ${PROGRESS_COLORS[color]} transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      {/* Interpretation */}
      {interpretation && (
        <div className="text-xs text-gray-600 dark:text-gray-400">{interpretation}</div>
      )}
    </div>
  );
}
