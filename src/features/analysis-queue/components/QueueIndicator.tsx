/**
 * QUEUE INDICATOR - PERSISTENT TOPBAR PILL BUTTON
 *
 * Always-visible pill button showing analysis queue status.
 * Never disappears from UI regardless of queue state.
 *
 * STATES:
 * - Loading: "Checking..." while fetching initial data
 * - Empty (Idle): "Queue" - click to see empty state dropdown
 * - Active: Shows real-time progress for 1+ analyses
 * - All Complete: Green checkmark with completed count
 * - Error: Red warning indicator with retry option
 *
 * FEATURES:
 * - Persistent visibility (never hides)
 * - Subtle --primary glow pulse on new job
 * - Click to toggle dropdown
 * - Keyboard accessible (Enter/Space to toggle)
 */

import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { DropdownPortal } from '@/shared/components/ui/DropdownPortal';
import { useAnalysisQueueStore } from '../stores/useAnalysisQueueStore';
import { QueueDropdown } from './QueueDropdown';

interface QueueIndicatorProps {
  onRetry?: () => void;
}

export function QueueIndicator({ onRetry }: QueueIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { jobs, activeCount, isLoading, isError, isWebSocketConnected } = useAnalysisQueueStore();

  // Trigger pulse animation when a new job is added
  const prevJobsLengthRef = useRef(jobs.length);
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    // Pulse when jobs are added
    if (jobs.length > prevJobsLengthRef.current) {
      setShouldPulse(true);
      timer = setTimeout(() => setShouldPulse(false), 2000);
    }

    prevJobsLengthRef.current = jobs.length;

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [jobs.length]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Get active jobs (pending or analyzing)
  const activeJobs = jobs.filter((job) => job.status === 'pending' || job.status === 'analyzing');

  // Derive connection error state (WebSocket disconnected with active jobs)
  const hasConnectionIssue = !isWebSocketConnected && activeJobs.length > 0;

  // Loading state - show subtle loading indicator
  if (isLoading) {
    return (
      <div className="relative">
        <button
          ref={buttonRef}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-muted/50 border border-border/50 opacity-70 cursor-default"
          aria-label="Analysis queue loading"
          aria-busy="true"
        >
          <Icon icon="ph:spinner" className="w-4 h-4 text-muted-foreground animate-spin" />
          <span className="text-xs font-medium text-muted-foreground">Checking...</span>
        </button>
      </div>
    );
  }

  // Error state - show warning indicator
  if (isError) {
    return (
      <div className="relative">
        <motion.button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-destructive/10 border border-destructive/30 hover:bg-destructive/20 transition-colors"
          aria-label="Analysis queue error - click to retry"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <Icon icon="ph:warning-fill" className="w-4 h-4 text-destructive" />
          <span className="text-xs font-medium text-destructive">Error</span>
          <Icon
            icon="ph:caret-down-fill"
            className={`w-3 h-3 text-destructive transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </motion.button>

        <DropdownPortal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          triggerRef={buttonRef}
          width={280}
          alignment="right"
        >
          <QueueDropdown onRetry={onRetry} />
        </DropdownPortal>
      </div>
    );
  }

  // Empty state - always visible as a subtle pill (clickable for dropdown)
  if (jobs.length === 0) {
    return (
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-muted/50 border border-border/50 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Analysis queue - no active analyses"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <Icon icon="ph:queue" className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Queue</span>
          <Icon
            icon="ph:caret-down-fill"
            className={`w-3 h-3 text-muted-foreground/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <DropdownPortal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          triggerRef={buttonRef}
          width={280}
          alignment="right"
        >
          <QueueDropdown onRetry={onRetry} />
        </DropdownPortal>
      </div>
    );
  }

  // All complete state - show checkmark when all jobs are done
  if (activeCount === 0 && jobs.length > 0) {
    const completedCount = jobs.filter((job) => job.status === 'complete').length;

    return (
      <div className="relative">
        <motion.button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 transition-colors"
          aria-label={`${completedCount} analyses complete`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <Icon icon="ph:check-circle-fill" className="w-4 h-4 text-green-600" />
          <span className="text-xs font-medium text-green-600">
            {completedCount} complete
          </span>
          <Icon
            icon="ph:caret-down-fill"
            className={`w-3 h-3 text-green-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </motion.button>

        <DropdownPortal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          triggerRef={buttonRef}
          width={280}
          alignment="right"
        >
          <QueueDropdown onRetry={onRetry} />
        </DropdownPortal>
      </div>
    );
  }

  // Single job display
  if (activeJobs.length === 1) {
    const job = activeJobs[0];
    if (!job || !job.username) return null;

    const displayUsername =
      job.username.length > 12 ? `${job.username.slice(0, 12)}...` : job.username;
    const firstLetter = job.username.charAt(0).toUpperCase();

    return (
      <div className="relative">
        <motion.button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`
            relative flex items-center gap-2 px-2.5 py-1.5 rounded-full
            bg-muted border border-border hover:bg-muted/80
            transition-all duration-200
            ${shouldPulse ? 'ring-2 ring-primary/30' : ''}
            ${hasConnectionIssue ? 'border-amber-500/50' : ''}
          `}
          aria-label={`Analyzing @${job.username} - ${job.progress}% complete`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {/* Pulse glow effect */}
          {shouldPulse && (
            <motion.div
              initial={{ opacity: 0.5, scale: 1 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-primary/20 blur-sm"
            />
          )}

          {/* Connection warning indicator */}
          {hasConnectionIssue && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
          )}

          {/* Avatar */}
          <div className="relative flex-shrink-0 z-10">
            {job.avatarUrl ? (
              <img
                src={job.avatarUrl}
                alt={job.username}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-border"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center ring-1 ring-primary/30">
                <span className="text-[9px] font-semibold text-primary">{firstLetter}</span>
              </div>
            )}
          </div>

          {/* Job info */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <span className="truncate max-w-[80px]">@{displayUsername}</span>
            <span className="text-muted-foreground tabular-nums">{job.progress}%</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground tabular-nums">
              {job.step.current}/{job.step.total}
            </span>
          </div>

          {/* Dropdown chevron */}
          <Icon
            icon="ph:caret-down-fill"
            className={`w-3 h-3 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </motion.button>

        <DropdownPortal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          triggerRef={buttonRef}
          width={280}
          alignment="right"
        >
          <QueueDropdown onRetry={onRetry} />
        </DropdownPortal>
      </div>
    );
  }

  // Multiple jobs display
  if (activeJobs.length > 1) {
    return (
      <div className="relative">
        <motion.button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`
            relative flex items-center gap-2 px-2.5 py-1.5 rounded-full
            bg-muted border border-border hover:bg-muted/80
            transition-all duration-200
            ${shouldPulse ? 'ring-2 ring-primary/30' : ''}
            ${hasConnectionIssue ? 'border-amber-500/50' : ''}
          `}
          aria-label={`${activeJobs.length} analyses in progress`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {/* Pulse glow effect */}
          {shouldPulse && (
            <motion.div
              initial={{ opacity: 0.5, scale: 1 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-primary/20 blur-sm"
            />
          )}

          {/* Connection warning indicator */}
          {hasConnectionIssue && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
          )}

          {/* Stacked avatars (max 3) */}
          <div className="relative flex items-center flex-shrink-0 z-10">
            {activeJobs.slice(0, 3).map((job, index) => {
              if (!job || !job.username) return null;
              const firstLetter = job.username.charAt(0).toUpperCase();
              return (
                <div
                  key={job.runId}
                  className="relative"
                  style={{
                    marginLeft: index > 0 ? '-6px' : '0',
                    zIndex: 3 - index,
                  }}
                >
                  {job.avatarUrl ? (
                    <img
                      src={job.avatarUrl}
                      alt={job.username}
                      className="w-5 h-5 rounded-full object-cover ring-2 ring-muted"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-muted">
                      <span className="text-[9px] font-semibold text-primary">{firstLetter}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Job count */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <span className="tabular-nums">{activeJobs.length}</span>
            <span className="text-muted-foreground">analyzing</span>
          </div>

          {/* Dropdown chevron */}
          <Icon
            icon="ph:caret-down-fill"
            className={`w-3 h-3 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </motion.button>

        <DropdownPortal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          triggerRef={buttonRef}
          width={280}
          alignment="right"
        >
          <QueueDropdown onRetry={onRetry} />
        </DropdownPortal>
      </div>
    );
  }

  // Fallback - should not reach here
  return null;
}
