// src/features/analysis-queue/index.ts

/**
 * ANALYSIS QUEUE FEATURE - PUBLIC EXPORTS
 *
 * Real-time analysis progress tracking widget for topbar.
 */

export { QueueIndicator } from './components/QueueIndicator';
export { useQueueSSE } from './hooks/useQueueSSE';
export { useAnalysisQueueStore } from './stores/useAnalysisQueueStore';
export { startDemoQueue, stopDemoQueue } from './utils/demoQueue';
export type { AnalysisJob, AnalysisStatus } from './stores/useAnalysisQueueStore';
