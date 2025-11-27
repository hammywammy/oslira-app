// src/features/dashboard/components/LeadsTable/AnalyticsTab.tsx

/**
 * ANALYTICS TAB - EXTRACTED DATA DISPLAY
 *
 * Displays extracted data from deep analysis including:
 * - Static metrics (raw observed data)
 * - Calculated analytics (derived values)
 * - Extraction metadata
 * Shows locked state for light analysis
 */

import { Icon } from '@iconify/react';
import type { Lead, AnalysisType } from '@/shared/types/leads.types';
import { ExtractedDataSection } from './ExtractedDataSection';

interface AnalyticsTabProps {
  lead: Lead;
  analysisType: AnalysisType | null;
}

export function AnalyticsTab({ lead, analysisType }: AnalyticsTabProps) {
  // Light analysis or no analysis - show locked state
  if (analysisType === 'light' || analysisType === null) {
    return <LockedState />;
  }

  // No extracted_data - show empty state
  if (!lead.extracted_data) {
    return <EmptyMetricsState />;
  }

  // Deep analysis - show extracted data metrics
  return (
    <div className="space-y-6">
      <ExtractedDataSection extractedData={lead.extracted_data} />
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
        View detailed profile metrics, engagement analytics, and content strategy insights.
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

