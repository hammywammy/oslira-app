import { Icon } from '@iconify/react';

interface ViralPostIndicatorProps {
  recentViralCount: number | null | undefined;
  totalSampled: number | null | undefined;
  percentage?: number | null;
  disclaimer?: string;
}

export function ViralPostIndicator({
  recentViralCount,
  totalSampled,
  percentage,
  disclaimer,
}: ViralPostIndicatorProps) {
  const hasData =
    recentViralCount !== null &&
    recentViralCount !== undefined &&
    totalSampled !== null &&
    totalSampled !== undefined;

  if (!hasData) return null;

  return (
    <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
      <Icon icon="mdi:fire" className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {recentViralCount} viral post{recentViralCount !== 1 ? 's' : ''}
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400">of {totalSampled} sampled</span>
          {percentage !== null && percentage !== undefined && (
            <span className="text-xs font-medium text-green-600 dark:text-green-400">
              ({percentage.toFixed(1)}%)
            </span>
          )}
        </div>
        {disclaimer && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{disclaimer}</p>
        )}
      </div>
    </div>
  );
}
