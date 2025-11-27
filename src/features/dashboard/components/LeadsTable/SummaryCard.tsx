/**
 * SUMMARY CARD COMPONENT
 *
 * Displays the partnership assessment with:
 * - Score-based emoji/icon indicator
 * - Colored left border matching the icon color
 * - Improved typography for readability
 */

interface SummaryCardProps {
  summary: string;
  score: number | null;
}

function getScoreIndicator(score: number | null): {
  emoji: string;
  borderColor: string;
  bgColor: string;
} {
  if (score === null) {
    return {
      emoji: '📋',
      borderColor: 'border-l-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-800/30',
    };
  }

  if (score >= 80) {
    return {
      emoji: '✅',
      borderColor: 'border-l-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/10',
    };
  }

  if (score >= 60) {
    return {
      emoji: '💡',
      borderColor: 'border-l-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/10',
    };
  }

  if (score >= 40) {
    return {
      emoji: '⚠️',
      borderColor: 'border-l-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-900/10',
    };
  }

  return {
    emoji: '❌',
    borderColor: 'border-l-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/10',
  };
}

export function SummaryCard({ summary, score }: SummaryCardProps) {
  const { emoji, borderColor, bgColor } = getScoreIndicator(score);

  return (
    <div className={`group rounded-lg border border-gray-200 dark:border-gray-800 ${bgColor} overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700`}>
      <div className={`border-l-4 ${borderColor} p-5`}>
        <h3 className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          <span>{emoji}</span>
          Partnership Assessment
        </h3>

        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {summary}
        </p>
      </div>
    </div>
  );
}
