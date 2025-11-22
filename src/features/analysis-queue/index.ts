// src/features/analysis-queue/index.ts

/**
 * ANALYSIS QUEUE FEATURE - PUBLIC EXPORTS
 *
 * Real-time analysis progress tracking widget for topbar.
 */

export { QueueIndicator } from './components/QueueIndicator';
export { useActiveAnalyses } from './hooks/useActiveAnalyses';
export { useAnalysisQueueStore } from './stores/useAnalysisQueueStore';
export type { AnalysisJob, AnalysisStatus } from './stores/useAnalysisQueueStore';
