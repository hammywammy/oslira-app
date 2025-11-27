/**
 * ANALYTICS TAB - EXTRACTED DATA DISPLAY
 *
 * Displays extracted data from deep analysis including:
 * - Static metrics (raw observed data)
 * - Calculated analytics (derived values)
 * Shows locked state for light analysis
 */

import { Icon } from '@iconify/react';
import type { Lead, AnalysisType } from '@/shared/types/leads.types';
import { ExtractedDataSection } from './ExtractedDataSection';

interface AnalyticsTabProps {
  lead: Lead;
  analysisType: AnalysisType | null;
}

/**
 * Bottom metadata bar - Shows analysis type, status, and extraction metadata
 */
function BottomMetadataBar({ lead }: { lead: Lead }) {
  const metadata = lead.extracted_data?.metadata;

  // Analysis type config
  const typeConfig = {
    light: { icon: 'mdi:lightning-bolt', label: 'Light Analysis', color: 'text-amber-600' },
    deep: { icon: 'mdi:brain', label: 'Deep Analysis', color: 'text-blue-600' },
    xray: { icon: 'mdi:atom', label: 'X-Ray Analysis', color: 'text-purple-600' },
  };

  // Status config
  const statusConfig = {
    pending: { icon: 'mdi:clock-outline', label: 'Pending', color: 'text-gray-600' },
    processing: { icon: 'mdi:loading', label: 'Processing', color: 'text-amber-600' },
    complete: { icon: 'mdi:check-circle', label: 'Complete', color: 'text-green-600' },
    failed: { icon: 'mdi:alert-circle', label: 'Failed', color: 'text-red-600' },
  };

  const typeInfo = lead.analysis_type && typeConfig[lead.analysis_type];
  const statusInfo = lead.analysis_status && statusConfig[lead.analysis_status];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 mt-6">
      <div className="flex items-center justify-between">
        {/* Left: Analysis Type & Status */}
        <div className="flex items-center gap-3">
          {typeInfo && (
            <div className="flex items-center gap-1.5 text-sm">
              <Icon icon={typeInfo.icon} className={`w-4 h-4 ${typeInfo.color}`} />
              <span className="font-medium text-gray-700">{typeInfo.label}</span>
            </div>
          )}
          {typeInfo && statusInfo && (
            <span className="text-gray-300">•</span>
          )}
          {statusInfo && (
            <div className="flex items-center gap-1.5 text-sm">
              <Icon icon={statusInfo.icon} className={`w-4 h-4 ${statusInfo.color}`} />
              <span className="font-medium text-gray-700">{statusInfo.label}</span>
            </div>
          )}
        </div>

        {/* Right: Extraction Metadata */}
        {metadata && (
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <Icon icon="mdi:code-tags" className="w-3.5 h-3.5" />
              <span>v{metadata.version}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon icon="mdi:database" className="w-3.5 h-3.5" />
              <span>{metadata.sampleSize} posts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon icon="mdi:clock-outline" className="w-3.5 h-3.5" />
              <span>{formatDate(metadata.extractedAt)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
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
      {/* Bottom Metadata Bar */}
      <BottomMetadataBar lead={lead} />
    </div>
  );
}

// LOCKED STATE
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

