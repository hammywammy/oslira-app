// src/features/analysis-queue/components/QueueIndicator.tsx

/**
 * QUEUE INDICATOR - TOPBAR PILL BUTTON
 *
 * Collapsible pill button that shows analysis queue status.
 * Smart display logic adapts to single/multiple jobs.
 *
 * DISPLAY MODES:
 * - Single job: [avatar] @username 45% • 2/4 ▾
 * - Multiple jobs: [stacked avatars] 3 analyzing ▾
 * - Auto-hide when empty, auto-show on first job
 *
 * FEATURES:
 * - Subtle --primary glow pulse on new job
 * - Click to toggle dropdown
 * - Keyboard accessible
 */

import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { DropdownPortal } from '@/shared/components/ui/DropdownPortal';
import { useAnalysisQueueStore } from '../stores/useAnalysisQueueStore';
import { QueueDropdown } from './QueueDropdown';

export function QueueIndicator() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { jobs, activeCount } = useAnalysisQueueStore();

  // Trigger pulse animation when a new job is added
  const prevActiveCountRef = useRef(activeCount);
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (activeCount > prevActiveCountRef.current) {
      setShouldPulse(true);
      timer = setTimeout(() => setShouldPulse(false), 2000);
    }

    prevActiveCountRef.current = activeCount;

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [activeCount]);

  // Hide when no jobs
  if (jobs.length === 0) {
    return null;
  }

  // Get active jobs (pending or analyzing)
  const activeJobs = jobs.filter((job) => job.status === 'pending' || job.status === 'analyzing');

  // Single job display
  if (activeJobs.length === 1) {
    const job = activeJobs[0];
    if (!job) return null;

    const displayUsername =
      job.username.length > 12 ? `${job.username.slice(0, 12)}...` : job.username;
    const firstLetter = job.username.charAt(0).toUpperCase();

    return (
      <div className="relative">
        <motion.button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`
            relative flex items-center gap-2 px-2.5 py-1.5 rounded-full
            bg-muted border border-border hover:bg-muted/80
            transition-all duration-200
            ${shouldPulse ? 'ring-2 ring-primary/30' : ''}
          `}
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
            className={`w-3 h-3 text-muted-foreground transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </motion.button>

        {/* Dropdown */}
        <DropdownPortal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          triggerRef={buttonRef}
          width={280}
          alignment="right"
        >
          <QueueDropdown />
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`
            relative flex items-center gap-2 px-2.5 py-1.5 rounded-full
            bg-muted border border-border hover:bg-muted/80
            transition-all duration-200
            ${shouldPulse ? 'ring-2 ring-primary/30' : ''}
          `}
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

          {/* Stacked avatars (max 3) */}
          <div className="relative flex items-center flex-shrink-0 z-10">
            {activeJobs.slice(0, 3).map((job, index) => {
              const firstLetter = job.username.charAt(0).toUpperCase();
              return (
                <div
                  key={job.leadId}
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
            className={`w-3 h-3 text-muted-foreground transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </motion.button>

        {/* Dropdown */}
        <DropdownPortal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          triggerRef={buttonRef}
          width={280}
          alignment="right"
        >
          <QueueDropdown />
        </DropdownPortal>
      </div>
    );
  }

  // Show pill even if only completed/failed jobs remain (until cleared)
  return (
    <div className="relative">
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-muted border border-border hover:bg-muted/80 transition-colors"
      >
        <Icon icon="ph:clock-countdown" className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
        </span>
        <Icon
          icon="ph:caret-down-fill"
          className={`w-3 h-3 text-muted-foreground transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </motion.button>

      {/* Dropdown */}
      <DropdownPortal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        triggerRef={buttonRef}
        width={280}
        alignment="right"
      >
        <QueueDropdown />
      </DropdownPortal>
    </div>
  );
}
