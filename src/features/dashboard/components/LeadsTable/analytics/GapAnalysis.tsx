import { Icon } from '@iconify/react';

interface Gaps {
  engagementGap?: boolean;
  contentGap?: boolean;
  conversionGap?: boolean;
  platformGap?: boolean;
}

interface GapAnalysisProps {
  gaps: Gaps;
  opportunities?: string[];
}

const GAP_CONFIG = {
  engagementGap: {
    label: 'Engagement',
    icon: 'mdi:chart-line',
    description: 'Low engagement relative to followers',
  },
  contentGap: {
    label: 'Content Strategy',
    icon: 'mdi:pencil-box-outline',
    description: 'Weak content optimization',
  },
  conversionGap: {
    label: 'Conversion',
    icon: 'mdi:link-variant',
    description: 'Missing conversion opportunities',
  },
  platformGap: {
    label: 'Platform Features',
    icon: 'mdi:instagram',
    description: 'Underutilizing platform features',
  },
};

export function GapAnalysis({ gaps, opportunities }: GapAnalysisProps) {
  const identifiedGaps = Object.entries(gaps).filter(([_, hasGap]) => hasGap);

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Gap Analysis</h4>

      {identifiedGaps.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <Icon icon="mdi:check-circle" className="w-5 h-5" />
          <span>No significant gaps detected</span>
        </div>
      ) : (
        <div className="space-y-2">
          {identifiedGaps.map(([gapType]) => {
            const config = GAP_CONFIG[gapType as keyof typeof GAP_CONFIG];
            if (!config) return null;

            return (
              <div
                key={gapType}
                className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
              >
                <Icon
                  icon={config.icon}
                  className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {config.label}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{config.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {opportunities && opportunities.length > 0 && (
        <div className="mt-4">
          <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Opportunities:
          </h5>
          <ul className="space-y-1">
            {opportunities.map((opp, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400"
              >
                <Icon
                  icon="mdi:lightbulb-outline"
                  className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5"
                />
                <span>{opp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
