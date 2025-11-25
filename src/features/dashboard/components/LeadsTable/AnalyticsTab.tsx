// src/features/dashboard/components/LeadsTable/AnalyticsTab.tsx

/**
 * ANALYTICS TAB COMPONENT
 *
 * Shows locked state for light analysis or empty state for deep analysis
 */

import { Icon } from '@iconify/react';
import type { AnalysisType } from '@/shared/types/leads.types';

interface AnalyticsTabProps {
  analysisType: AnalysisType | null;
}

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
        View engagement metrics, content strategy breakdown, and partnership readiness signals.
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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
        <Icon icon="mdi:chart-box-outline" className="w-8 h-8 text-blue-500 dark:text-blue-400" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Analytics Dashboard
      </h3>

      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
        Coming soon: Engagement metrics, content patterns, and audience quality indicators.
      </p>
    </div>
  );
}

export function AnalyticsTab({ analysisType }: AnalyticsTabProps) {
  const isLightAnalysis = analysisType === 'light' || analysisType === null;

  return isLightAnalysis ? <LockedState /> : <EmptyState />;
}
