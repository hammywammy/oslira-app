/**
 * Global WebSocket connection for ALL analysis updates
 */
import { useEffect, useRef } from 'react';
import { useAnalysisQueueStore } from '@/features/analysis-queue/stores/useAnalysisQueueStore';
import { authManager } from '@/core/auth/auth-manager';
import { env } from '@/core/auth/environment';
import { logger } from '@/core/utils/logger';

export function useGlobalAnalysisStream() {
  const wsRef = useRef<WebSocket | null>(null);
  const { jobs, updateJob } = useAnalysisQueueStore();

  const hasActiveJobs = jobs.some(j =>
    j.status === 'pending' || j.status === 'analyzing'
  );

  useEffect(() => {
    if (!hasActiveJobs) return;

    let mounted = true;

    const connect = async () => {
      const token = await authManager.getAccessToken();
      if (!token || !mounted) return;

      const wsProtocol = env.apiUrl.startsWith('https') ? 'wss' : 'ws';
      const wsUrl = env.apiUrl.replace(/^https?/, wsProtocol);
      const ws = new WebSocket(`${wsUrl}/api/analysis/ws`);

      wsRef.current = ws;

      ws.onopen = () => {
        logger.info('[GlobalStream] Connected');
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === 'analysis.progress' ||
              message.type === 'analysis.complete' ||
              message.type === 'analysis.failed') {

            if (message.runId && message.data) {
              updateJob(message.runId, {
                progress: message.data.progress,
                step: message.data.step,
                status: message.data.status,
                avatarUrl: message.data.avatarUrl,
                leadId: message.data.leadId,
              });
            }
          }
        } catch (error) {
          logger.error('[GlobalStream] Parse error', { error });
        }
      };

      ws.onerror = (error) => {
        logger.error('[GlobalStream] Error', { error });
      };

      ws.onclose = () => {
        logger.info('[GlobalStream] Disconnected');
      };
    };

    connect();

    return () => {
      mounted = false;
      wsRef.current?.close();
    };
  }, [hasActiveJobs]);
}
