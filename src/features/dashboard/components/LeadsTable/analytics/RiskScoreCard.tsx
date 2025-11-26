// src/features/dashboard/components/LeadsTable/analytics/RiskScoreCard.tsx

import { Icon } from '@iconify/react';

interface RiskScoreCardProps {
  score: number | null | undefined;
  interpretation?: string;
  warnings?: string[];
}

export function RiskScoreCard({ score, interpretation, warnings }: RiskScoreCardProps) {
  const hasScore = score !== null && score !== undefined;

  const getRiskLevel = () => {
    if (!hasScore) return { color: 'gray', label: 'Unknown' };
    if (score < 20) return { color: 'green', label: 'Low Risk' };
    if (score < 50) return { color: 'yellow', label: 'Medium Risk' };
    return { color: 'red', label: 'High Risk' };
  };

  const { color, label } = getRiskLevel();

  const colorClasses = {
    gray: {
      bg: 'bg-gray-50 dark:bg-gray-900/20',
      icon: 'text-gray-600 dark:text-gray-400',
      text: 'text-gray-600 dark:text-gray-400',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      icon: 'text-green-600 dark:text-green-400',
      text: 'text-green-600 dark:text-green-400',
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      icon: 'text-yellow-600 dark:text-yellow-400',
      text: 'text-yellow-600 dark:text-yellow-400',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      icon: 'text-red-600 dark:text-red-400',
      text: 'text-red-600 dark:text-red-400',
    },
  };

  const classes = colorClasses[color as keyof typeof colorClasses];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg ${classes.bg} flex items-center justify-center`}>
          <Icon icon="mdi:shield-alert" className={`w-5 h-5 ${classes.icon}`} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Fake Follower Risk
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {interpretation || (hasScore ? 'Assessed' : 'Not analyzed')}
          </p>
        </div>
      </div>

      {hasScore && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {score}/100
            </span>
            <span className={`text-sm font-medium ${classes.text}`}>{label}</span>
          </div>

          {warnings && warnings.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Warnings:</p>
              {warnings.map((warning, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Icon
                    icon="mdi:alert-circle-outline"
                    className="w-4 h-4 text-orange-500 shrink-0 mt-0.5"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{warning}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
