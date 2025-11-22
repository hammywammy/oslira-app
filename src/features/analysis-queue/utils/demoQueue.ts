// src/features/analysis-queue/utils/demoQueue.ts

/**
 * DEMO QUEUE UTILITY - FOR TESTING & DEMONSTRATION
 *
 * Simulates analysis queue updates without backend SSE connection.
 * Useful for testing UI and animations.
 *
 * USAGE:
 * import { startDemoQueue, stopDemoQueue } from '@/features/analysis-queue/utils/demoQueue';
 *
 * // Start demo (simulates 1-3 concurrent analyses)
 * startDemoQueue();
 *
 * // Stop demo
 * stopDemoQueue();
 *
 * OR add to window for console testing:
 * window.startDemoQueue = startDemoQueue;
 * window.stopDemoQueue = stopDemoQueue;
 */

import { useAnalysisQueueStore } from '../stores/useAnalysisQueueStore';

const DEMO_USERS = [
  { username: 'johndoe', avatarUrl: undefined },
  { username: 'janesmithmarketing', avatarUrl: undefined },
  { username: 'techleader', avatarUrl: undefined },
  { username: 'salesguru', avatarUrl: undefined },
  { username: 'ceovisionary', avatarUrl: undefined },
];

let demoInterval: NodeJS.Timeout | null = null;
let activeSimulations: Map<string, NodeJS.Timeout> = new Map();

/**
 * Simulate a single analysis job from start to completion
 */
function simulateAnalysis(runId: string, username: string, avatarUrl?: string) {
  const { addJob, updateJob } = useAnalysisQueueStore.getState();

  // Start job
  addJob({
    runId,
    username,
    analysisType: 'light',
    avatarUrl,
    progress: 0,
    step: { current: 0, total: 4 },
    status: 'pending',
  });

  let currentStep = 0;
  let currentProgress = 0;

  const interval = setInterval(() => {
    currentProgress += Math.floor(Math.random() * 15) + 5; // Random increment 5-20%

    if (currentProgress >= 100) {
      currentProgress = 100;
      currentStep = 4;

      // 90% success rate, 10% failure rate
      const success = Math.random() > 0.1;

      updateJob(runId, {
        progress: currentProgress,
        step: { current: currentStep, total: 4 },
        status: success ? 'complete' : 'failed',
      });

      clearInterval(interval);
      activeSimulations.delete(runId);
    } else {
      // Update step based on progress
      if (currentProgress >= 75 && currentStep < 3) {
        currentStep = 3;
      } else if (currentProgress >= 50 && currentStep < 2) {
        currentStep = 2;
      } else if (currentProgress >= 25 && currentStep < 1) {
        currentStep = 1;
      }

      updateJob(runId, {
        progress: currentProgress,
        step: { current: currentStep, total: 4 },
        status: 'analyzing',
      });
    }
  }, 1000); // Update every second

  activeSimulations.set(runId, interval);
}

/**
 * Start demo queue with random analysis jobs
 */
export function startDemoQueue() {
  if (demoInterval) {
    console.log('[DemoQueue] Already running');
    return;
  }

  console.log('[DemoQueue] Starting demo queue...');

  // Start 1-2 initial jobs
  const initialJobs = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < initialJobs; i++) {
    const user = DEMO_USERS[Math.floor(Math.random() * DEMO_USERS.length)];
    if (!user) continue;
    const runId = `demo-${Date.now()}-${i}`;
    setTimeout(() => {
      simulateAnalysis(runId, user.username, user.avatarUrl);
    }, i * 2000); // Stagger start times
  }

  // Periodically add new jobs (every 10-20 seconds)
  demoInterval = setInterval(() => {
    const user = DEMO_USERS[Math.floor(Math.random() * DEMO_USERS.length)];
    if (!user) return;
    const runId = `demo-${Date.now()}`;
    simulateAnalysis(runId, user.username, user.avatarUrl);
  }, Math.floor(Math.random() * 10000) + 10000);
}

/**
 * Stop demo queue and clear all active simulations
 */
export function stopDemoQueue() {
  if (demoInterval) {
    clearInterval(demoInterval);
    demoInterval = null;
  }

  // Clear all active simulation intervals
  activeSimulations.forEach((interval) => clearInterval(interval));
  activeSimulations.clear();

  // Clear all jobs from store
  useAnalysisQueueStore.getState().clearCompleted();

  console.log('[DemoQueue] Stopped');
}

// Expose to window for console testing (only in development)
if (process.env.NODE_ENV === 'development') {
  (window as any).startDemoQueue = startDemoQueue;
  (window as any).stopDemoQueue = stopDemoQueue;

  console.log(
    '%c[DemoQueue] Available commands:\n' +
      '  window.startDemoQueue() - Start demo\n' +
      '  window.stopDemoQueue() - Stop demo',
    'color: #4f46e5; font-weight: bold;'
  );
}
