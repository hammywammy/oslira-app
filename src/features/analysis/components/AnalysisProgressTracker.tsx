// src/features/analysis/components/AnalysisProgressTracker.tsx

/**
 * ANALYSIS PROGRESS TRACKER COMPONENT
 * 
 * Visual progress indicator for async analysis
 * Displays:
 * - Progress bar (0-100%)
 * - Current step description
 * - Status icon (spinner/check/error)
 */

import { Icon } from '@iconify/react';

interface AnalysisProgressTrackerProps {
  progress: number;
  currentStep: string;
  status: 'pending' | 'processing' | 'complete' | 'failed' | 'cancelled';
  error?: string | null;
}

export function AnalysisProgressTracker({
  progress,
  currentStep,
  status,
  error,
}: AnalysisProgressTrackerProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'complete':
        return <Icon icon="ph:check-circle-fill" className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <Icon icon="ph:x-circle-fill" className="w-5 h-5 text-red-600" />;
      case 'cancelled':
        return <Icon icon="ph:stop-circle-fill" className="w-5 h-5 text-gray-600" />;
      default:
        return <Icon icon="ph:spinner" className="w-5 h-5 text-blue-600 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'complete':
        return 'bg-green-600';
      case 'failed':
        return 'bg-red-600';
      case 'cancelled':
        return 'bg-gray-600';
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <div className="space-y-3">
      {/* Status Header */}
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{currentStep}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {progress}% complete
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${getStatusColor()} transition-all duration-500 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Error Message */}
      {error && status === 'failed' && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
    </div>
  );
}
