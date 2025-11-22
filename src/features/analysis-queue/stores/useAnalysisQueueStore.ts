// src/features/analysis-queue/stores/useAnalysisQueueStore.ts

/**
 * ANALYSIS QUEUE STORE - ZUSTAND STATE MANAGEMENT
 *
 * Real-time analysis progress tracking with SSE integration.
 * Manages active/recent analyses and auto-dismisses completed items.
 *
 * ARCHITECTURE:
 * - Real-time updates from Durable Objects SSE stream
 * - Auto-dismiss completed items after 3 seconds
 * - Failed items persist with retry action
 * - Smart visibility (auto-hide when empty, auto-show on first job)
 *
 * USAGE:
 * const {
 *   jobs,                  // All active/recent analysis jobs
 *   activeCount,           // Count of in-progress jobs
 *   addJob,                // Add new job to queue
 *   updateJob,             // Update job progress/status
 *   removeJob,             // Remove job from queue
 *   retryJob,              // Retry failed job
 * } = useAnalysisQueueStore();
 */

import { create } from 'zustand';

// =============================================================================
// TYPES
// =============================================================================

export type AnalysisStatus = 'pending' | 'analyzing' | 'complete' | 'failed';

export interface AnalysisJob {
  leadId: string;
  username: string;
  avatarUrl?: string;
  progress: number; // 0-100
  step: {
    current: number;
    total: number;
  };
  status: AnalysisStatus;
  startedAt: number; // timestamp
  completedAt?: number; // timestamp
}

interface AnalysisQueueState {
  // State
  jobs: AnalysisJob[];
  activeCount: number;

  // Actions
  addJob: (job: Omit<AnalysisJob, 'startedAt'>) => void;
  updateJob: (leadId: string, updates: Partial<AnalysisJob>) => void;
  removeJob: (leadId: string) => void;
  retryJob: (leadId: string) => void;
  clearCompleted: () => void;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Compute active count (pending or analyzing jobs)
 */
const getActiveCount = (jobs: AnalysisJob[]): number => {
  return jobs.filter((job) => job.status === 'pending' || job.status === 'analyzing').length;
};

// =============================================================================
// STORE
// =============================================================================

export const useAnalysisQueueStore = create<AnalysisQueueState>((set, get) => ({
  // State
  jobs: [],
  activeCount: 0,

  // Actions
  addJob: (job) =>
    set((state) => {
      // Don't add duplicate jobs
      if (state.jobs.some((j) => j.leadId === job.leadId)) {
        return state;
      }

      const newJob: AnalysisJob = {
        ...job,
        startedAt: Date.now(),
      };

      const newJobs = [...state.jobs, newJob];

      return {
        jobs: newJobs,
        activeCount: getActiveCount(newJobs),
      };
    }),

  updateJob: (leadId, updates) =>
    set((state) => {
      const newJobs = state.jobs.map((job) => {
        if (job.leadId !== leadId) return job;

        const updatedJob = { ...job, ...updates };

        // Set completedAt timestamp when status changes to complete or failed
        if (
          (updates.status === 'complete' || updates.status === 'failed') &&
          !updatedJob.completedAt
        ) {
          updatedJob.completedAt = Date.now();
        }

        return updatedJob;
      });

      // Auto-dismiss completed jobs after 3 seconds
      if (updates.status === 'complete') {
        setTimeout(() => {
          get().removeJob(leadId);
        }, 3000);
      }

      return {
        jobs: newJobs,
        activeCount: getActiveCount(newJobs),
      };
    }),

  removeJob: (leadId) =>
    set((state) => {
      const newJobs = state.jobs.filter((job) => job.leadId !== leadId);
      return {
        jobs: newJobs,
        activeCount: getActiveCount(newJobs),
      };
    }),

  retryJob: (leadId) =>
    set((state) => {
      const newJobs = state.jobs.map((job) => {
        if (job.leadId !== leadId) return job;

        return {
          ...job,
          status: 'pending' as AnalysisStatus,
          progress: 0,
          step: { current: 0, total: job.step.total },
          startedAt: Date.now(),
          completedAt: undefined,
        };
      });

      return {
        jobs: newJobs,
        activeCount: getActiveCount(newJobs),
      };
    }),

  clearCompleted: () =>
    set((state) => {
      const newJobs = state.jobs.filter(
        (job) => job.status !== 'complete' && job.status !== 'failed'
      );
      return {
        jobs: newJobs,
        activeCount: getActiveCount(newJobs),
      };
    }),
}));
