/**
 * QUEUE DROPDOWN - ANALYSIS PROGRESS PANEL
 *
 * Displays all active/recent analysis jobs in a scrollable dropdown.
 * Features Framer Motion animations and keyboard navigation.
 *
 * INTERACTION:
 * - Framer AnimatePresence with opacity + translateY from -8px
 * - Max-height 320px with overflow scroll
 * - Closes on outside click or Escape
 * - Keyboard navigable with Tab
 */

import { Icon } from '@iconify/react';
import { AnimatePresence } from 'framer-motion';
import { useAnalysisQueueStore } from '../stores/useAnalysisQueueStore';
import { QueueItem } from './QueueItem';

export function QueueDropdown() {
  const { jobs, retryJob, clearCompleted } = useAnalysisQueueStore();

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

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Analysis Queue</h3>
          <span className="text-xs font-medium text-muted-foreground">
            {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
          </span>
        </div>

        {hasCompletedOrFailed && (
          <button
            onClick={clearCompleted}
            className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Job List */}
      <div
        className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'hsl(var(--muted)) transparent',
        }}
      >
        {jobs.length === 0 ? (
          <div className="px-3 py-12 text-center">
            <Icon icon="ph:queue" className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">No analyses in queue</p>
            <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
              Start analyzing a lead to track progress here
            </p>
          </div>
        ) : (
          <div className="py-1">
            <AnimatePresence mode="popLayout">
              {sortedJobs.map((job) => (
                <QueueItem key={job.runId} job={job} onRetry={retryJob} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer hint */}
      {jobs.length > 0 && (
        <div className="px-3 py-2 border-t border-border bg-muted/30">
          <p className="text-[10px] text-muted-foreground text-center">
            Completed jobs auto-dismiss after 3s
          </p>
        </div>
      )}
    </div>
  );
}
