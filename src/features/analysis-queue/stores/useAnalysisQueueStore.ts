/**
 * ANALYSIS QUEUE STORE - ZUSTAND STATE MANAGEMENT
 *
 * Real-time analysis progress tracking synced with React Query polling.
 * Manages active/recent analyses and auto-dismisses completed items.
 *
 * ARCHITECTURE:
 * - Job state management (no polling control - handled by React Query)
 * - Auto-dismiss completed items after 3 seconds
 * - Failed items persist with retry action
 * - Optimistic job creation pattern
 *
 * USAGE:
 * const {
 *   jobs,                  // All active/recent analysis jobs
 *   activeCount,           // Count of in-progress jobs
 *   addJob,                // Add new job to queue
 *   updateJob,             // Update job progress/status
 *   removeJob,             // Remove job from queue
 *   retryJob,              // Retry failed job
 *   addOptimisticJob,      // Add optimistic job before backend confirmation
 *   confirmJobStarted,     // Confirm optimistic job with backend data
 * } = useAnalysisQueueStore();
 */

import { create } from 'zustand';

export type AnalysisStatus = 'pending' | 'analyzing' | 'complete' | 'failed' | 'cancelled';

export interface AnalysisJob {
  runId: string;
  leadId?: string;
  username: string;
  analysisType: string;
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
  updateJob: (runId: string, updates: Partial<AnalysisJob>) => void;
  updateAllJobs: (jobs: AnalysisJob[]) => void;
  removeJob: (runId: string) => void;
  retryJob: (runId: string) => void;
  clearCompleted: () => void;

  // Optimistic job actions
  addOptimisticJob: (runId: string, username: string, analysisType: string) => void;
  confirmJobStarted: (runId: string, avatarUrl?: string, leadId?: string) => void;
}

/**
 * Compute active count (pending or analyzing jobs)
 */
const getActiveCount = (jobs: AnalysisJob[]): number => {
  return jobs.filter((job) => job.status === 'pending' || job.status === 'analyzing').length;
};

export const useAnalysisQueueStore = create<AnalysisQueueState>((set) => ({
  // State
  jobs: [],
  activeCount: 0,

  // Actions
  addJob: (job) =>
    set((state) => {
      // Don't add duplicate jobs
      if (state.jobs.some((j) => j.runId === job.runId)) {
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

  updateJob: (runId, updates) =>
    set((state) => {
      const newJobs = state.jobs.map((job) => {
        if (job.runId !== runId) return job;

        // FIX: Explicitly clone nested step object to ensure immutability
        const updatedJob = {
          ...job,
          ...updates,
          // Clone step object if provided in updates, otherwise use existing
          step: updates.step ? { ...updates.step } : job.step,
        };

        // Set completedAt timestamp when status changes to complete or failed
        if (
          (updates.status === 'complete' || updates.status === 'failed') &&
          !updatedJob.completedAt
        ) {
          updatedJob.completedAt = Date.now();
        }

        return updatedJob;
      });

      const newActiveCount = getActiveCount(newJobs);

      return {
        jobs: newJobs,
        activeCount: newActiveCount,
      };
    }),

  updateAllJobs: (fetchedJobs) =>
    set((state) => {
      // Merge fetched jobs with existing jobs
      const jobMap = new Map(state.jobs.map(job => [job.runId, job]));

      fetchedJobs.forEach(fetchedJob => {
        const existingJob = jobMap.get(fetchedJob.runId);

        if (existingJob) {
          // Update existing job
          jobMap.set(fetchedJob.runId, {
            ...existingJob,
            ...fetchedJob,
            startedAt: existingJob.startedAt, // Preserve original start time
          });
        } else {
          // Add new job
          jobMap.set(fetchedJob.runId, {
            ...fetchedJob,
            startedAt: fetchedJob.startedAt || Date.now(),
          });
        }
      });

      const newJobs = Array.from(jobMap.values());
      const newActiveCount = getActiveCount(newJobs);

      return {
        jobs: newJobs,
        activeCount: newActiveCount,
      };
    }),

  removeJob: (runId) =>
    set((state) => {
      const newJobs = state.jobs.filter((job) => job.runId !== runId);
      const newActiveCount = getActiveCount(newJobs);

      return {
        jobs: newJobs,
        activeCount: newActiveCount,
      };
    }),

  retryJob: (runId) =>
    set((state) => {
      const newJobs = state.jobs.map((job) => {
        if (job.runId !== runId) return job;

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
      const newActiveCount = getActiveCount(newJobs);

      return {
        jobs: newJobs,
        activeCount: newActiveCount,
      };
    }),

  // Optimistic job actions
  addOptimisticJob: (runId, username, analysisType) =>
    set((state) => {
      // Don't add duplicate jobs
      if (state.jobs.some((j) => j.runId === runId)) {
        return state;
      }

      const newJob: AnalysisJob = {
        runId,
        username,
        analysisType,
        progress: 0,
        step: { current: 0, total: 4 },
        status: 'pending',
        startedAt: Date.now(),
      };

      const newJobs = [...state.jobs, newJob];

      return {
        jobs: newJobs,
        activeCount: getActiveCount(newJobs),
      };
    }),

  confirmJobStarted: (runId, avatarUrl, leadId) =>
    set((state) => {
      const newJobs = state.jobs.map((job) => {
        if (job.runId !== runId) return job;

        return {
          ...job,
          ...(avatarUrl && { avatarUrl }),
          ...(leadId && { leadId }),
        };
      });

      return {
        jobs: newJobs,
      };
    }),
}));
