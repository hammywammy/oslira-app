// src/features/analysis-queue/components/QueueItem.tsx

/**
 * QUEUE ITEM - INDIVIDUAL ANALYSIS PROGRESS ROW
 *
 * Displays single analysis job with avatar, username, progress bar, and status.
 * Fits within 200px width with optimized spacing and truncation.
 *
 * VISUAL DESIGN:
 * - 24px circular avatar (profile pic or first-letter fallback)
 * - Truncated @username (max 12 chars)
 * - 60px slim linear progress bar with --primary fill
 * - Percentage text and step indicator (2/4)
 * - Status-based indicators (checkmark, error, spinner)
 */

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { AnalysisJob } from '../stores/useAnalysisQueueStore';

interface QueueItemProps {
  job: AnalysisJob;
  onRetry?: (leadId: string) => void;
}

export function QueueItem({ job, onRetry }: QueueItemProps) {
  const { username, avatarUrl, progress, step, status } = job;

  // Truncate username to max 12 chars
  const displayUsername = username.length > 12 ? `${username.slice(0, 12)}...` : username;

  // Get first letter for avatar fallback
  const firstLetter = username.charAt(0).toUpperCase();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 rounded-lg transition-colors group"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={username}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-border"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center ring-1 ring-primary/30">
            <span className="text-[10px] font-semibold text-primary">{firstLetter}</span>
          </div>
        )}

        {/* Status indicator overlay */}
        {status === 'analyzing' && (
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-full h-full rounded-full bg-primary"
            />
          </div>
        )}
        {status === 'complete' && (
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
            <Icon icon="ph:check-bold" className="w-2 h-2 text-white" />
          </div>
        )}
        {status === 'failed' && (
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <Icon icon="ph:x-bold" className="w-2 h-2 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        {/* Username and percentage */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-foreground truncate">@{displayUsername}</span>
          <span className="text-xs font-medium text-muted-foreground tabular-nums flex-shrink-0">
            {progress}%
          </span>
        </div>

        {/* Progress bar and step indicator */}
        <div className="flex items-center gap-2">
          {/* Progress bar */}
          <div className="relative flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`absolute inset-y-0 left-0 rounded-full ${
                status === 'complete'
                  ? 'bg-green-500'
                  : status === 'failed'
                  ? 'bg-red-500'
                  : 'bg-primary'
              }`}
            />
            {/* Shimmer effect for active jobs */}
            {status === 'analyzing' && (
              <motion.div
                animate={{ x: ['0%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            )}
          </div>

          {/* Step indicator */}
          <span className="text-[10px] font-medium text-muted-foreground tabular-nums flex-shrink-0">
            {step.current}/{step.total}
          </span>
        </div>
      </div>

      {/* Retry button for failed jobs */}
      {status === 'failed' && onRetry && (
        <button
          onClick={() => onRetry(job.leadId)}
          className="flex-shrink-0 p-1 hover:bg-muted rounded transition-colors opacity-0 group-hover:opacity-100"
          title="Retry analysis"
        >
          <Icon icon="ph:arrow-clockwise" className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      )}
    </motion.div>
  );
}
