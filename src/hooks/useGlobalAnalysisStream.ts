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
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { jobs, updateJob, setWebSocketConnected } = useAnalysisQueueStore();

  const hasActiveJobs = jobs.some(j =>
    j.status === 'pending' || j.status === 'analyzing'
  );

  useEffect(() => {
    // Don't disconnect if jobs still active - this prevents unmount during token refresh
    if (!hasActiveJobs) {
      if (wsRef.current) {
        logger.info('[GlobalStream] No active jobs, closing WebSocket');
        wsRef.current.close();
        wsRef.current = null;
      }
      setWebSocketConnected(false);
      return;
    }

    // If WebSocket already exists and is open, don't create a new one
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      logger.info('[GlobalStream] WebSocket already connected, reusing connection');
      return;
    }

    // If WebSocket is connecting, wait for it
    if (wsRef.current && wsRef.current.readyState === WebSocket.CONNECTING) {
      logger.info('[GlobalStream] WebSocket already connecting, waiting...');
      return;
    }

    let mounted = true;

    const connect = async () => {
      try {
        const token = await authManager.getAccessToken();
        if (!token || !mounted) return;

        const wsProtocol = env.apiUrl.startsWith('https') ? 'wss' : 'ws';
        const wsUrl = env.apiUrl.replace(/^https?/, wsProtocol);
        const ws = new WebSocket(`${wsUrl}/api/analysis/ws?token=${encodeURIComponent(token)}`);

        wsRef.current = ws;

        ws.onopen = () => {
          logger.info('[GlobalStream] Connected');
          setWebSocketConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);

            if (message.type === 'ready') {
              logger.info('[GlobalStream] Ready confirmation received');
              return;
            }

            if (message.type === 'analysis.progress' ||
                message.type === 'analysis.complete' ||
                message.type === 'analysis.failed') {

              if (message.runId && message.data) {
                logger.info('[GlobalStream] Update received', {
                  runId: message.runId,
                  type: message.type,
                  progress: message.data.progress
                });

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
          setWebSocketConnected(false);
        };

        ws.onclose = (event) => {
          logger.info('[GlobalStream] Disconnected', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
          });
          setWebSocketConnected(false);
          wsRef.current = null;

          // Auto-reconnect if still have active jobs and wasn't a clean close
          if (mounted && hasActiveJobs && event.code !== 1000) {
            logger.info('[GlobalStream] Unexpected disconnect, reconnecting in 2s...');
            reconnectTimeoutRef.current = setTimeout(() => {
              if (mounted && hasActiveJobs) {
                connect();
              }
            }, 2000);
          }
        };
      } catch (error) {
        logger.error('[GlobalStream] Connection failed', { error });
        setWebSocketConnected(false);
      }
    };

    connect();

    // Cleanup only on unmount, not on dependency changes
    return () => {
      mounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      // Only close if no active jobs (prevents disconnect during token refresh)
      if (!hasActiveJobs && wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setWebSocketConnected(false);
    };
  }, [hasActiveJobs]); // ONLY re-run when hasActiveJobs changes
}
