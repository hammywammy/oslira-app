/**
 * QUEUE DROPDOWN - ANALYSIS PROGRESS PANEL
 *
 * Displays all active/recent analysis jobs in a scrollable dropdown.
 * Features multiple visual states: loading, error, empty, and active.
 *
 * STATES:
 * - Loading: Skeleton placeholders while fetching
 * - Error: Connection lost message with retry button
 * - Empty (Idle): Friendly message explaining queue is idle
 * - Active: Real-time job list with progress
 *
 * INTERACTION:
 * - Framer AnimatePresence with opacity + translateY from -8px
 * - Max-height 320px with overflow scroll
 * - Closes on outside click or Escape
 * - Keyboard navigable with Tab
 */

import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalysisQueueStore } from '../stores/useAnalysisQueueStore';
import { QueueItem } from './QueueItem';

interface QueueDropdownProps {
  onRetry?: () => void;
}

export function QueueDropdown({ onRetry }: QueueDropdownProps) {
  const { jobs, retryJob, clearCompleted, isLoading, isError, isWebSocketConnected } = useAnalysisQueueStore();

  // Sort jobs: active first, then by start time
  const sortedJobs = [...jobs].sort((a, b) => {
    // Active jobs (pending/analyzing) first
    const aActive = a.status === 'pending' || a.status === 'analyzing' ? 1 : 0;
    const bActive = b.status === 'pending' || b.status === 'analyzing' ? 1 : 0;

    if (aActive !== bActive) {
      return bActive - aActive;
    }

    // Then by start time (newest first)
    return b.startedAt - a.startedAt;
  });

  const hasCompletedOrFailed = jobs.some(
    (job) => job.status === 'complete' || job.status === 'failed'
  );

  const activeJobs = jobs.filter(j => j.status === 'pending' || j.status === 'analyzing');
  const hasConnectionIssue = !isWebSocketConnected && activeJobs.length > 0;

  // Loading state content
  const renderLoadingState = () => (
    <div className="px-3 py-8">
      {/* Skeleton items */}
      <div className="space-y-3 animate-pulse">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <div className="w-8 h-8 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 bg-muted rounded" />
              <div className="h-2 w-full bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-center text-muted-foreground mt-4">
        Checking for active analyses...
      </p>
    </div>
  );

  // Error state content
  const renderErrorState = () => (
    <div className="px-3 py-10 text-center">
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-destructive/10 flex items-center justify-center">
        <Icon icon="ph:wifi-slash" className="w-6 h-6 text-destructive" />
      </div>
      <p className="text-sm font-medium text-foreground mb-1">Connection lost</p>
      <p className="text-xs text-muted-foreground mb-4 max-w-[200px] mx-auto">
        Unable to fetch queue status. Check your connection and try again.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
          aria-label="Retry connection"
        >
          <Icon icon="ph:arrow-clockwise" className="w-3.5 h-3.5" />
          Retry Now
        </button>
      )}
    </div>
  );

  // Empty state content
  const renderEmptyState = () => (
    <div className="px-3 py-10 text-center">
      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-muted/50 flex items-center justify-center">
        <Icon icon="ph:clock" className="w-7 h-7 text-muted-foreground/50" />
      </div>
      <p className="text-sm font-medium text-foreground mb-1">No leads being analyzed</p>
      <p className="text-xs text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
        Start an analysis to see real-time progress here
      </p>
    </div>
  );

  // Connection warning banner
  const renderConnectionWarning = () => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="px-3 py-2 bg-amber-500/10 border-b border-amber-500/20"
    >
      <div className="flex items-center gap-2 text-xs text-amber-600">
        <Icon icon="ph:wifi-slash" className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Connection unstable - using fallback updates</span>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full" role="region" aria-label="Analysis queue">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Analysis Queue</h3>
          {!isLoading && !isError && jobs.length > 0 && (
            <span className="text-xs font-medium text-muted-foreground">
              {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
            </span>
          )}
        </div>

        {hasCompletedOrFailed && (
          <button
            onClick={clearCompleted}
            className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            aria-label="Clear completed and failed jobs"
          >
            Clear
          </button>
        )}
      </div>

      {/* Connection warning */}
      <AnimatePresence>
        {hasConnectionIssue && !isError && renderConnectionWarning()}
      </AnimatePresence>

      {/* Content area */}
      <div
        className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'hsl(var(--muted)) transparent',
        }}
        role="list"
        aria-label="Analysis jobs"
      >
        {isLoading && renderLoadingState()}
        {isError && !isLoading && renderErrorState()}
        {!isLoading && !isError && jobs.length === 0 && renderEmptyState()}
        {!isLoading && !isError && jobs.length > 0 && (
          <div className="py-1">
            <AnimatePresence mode="popLayout">
              {sortedJobs.map((job) => (
                <QueueItem key={job.runId} job={job} onRetry={retryJob} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer hint - only show when there are jobs */}
      {!isLoading && !isError && jobs.length > 0 && (
        <div className="px-3 py-2 border-t border-border bg-muted/30">
          <p className="text-[10px] text-muted-foreground text-center">
            Completed jobs auto-dismiss after 3s
          </p>
        </div>
      )}
    </div>
  );
}
