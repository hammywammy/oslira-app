/**
 * BUSINESS CONTEXT WEBSOCKET HOOK - REAL-TIME PROGRESS WITH HIBERNATION
 *
 * Replaces SSE with WebSocket for efficient real-time updates during onboarding.
 * Uses Durable Object WebSocket Hibernation API.
 *
 * FEATURES:
 * - Real-time progress updates for business context generation
 * - Automatic reconnection (max 1 attempt - fail fast to polling)
 * - Heartbeat ping/pong (immediate + every 5s - well under DO 10s hibernation threshold)
 * - Page Visibility API detection for tab hibernation
 * - Graceful degradation to HTTP polling
 * - Auto-cleanup on unmount
 *
 * USAGE:
 * const { progress, isConnected, error, reconnect } = useBusinessContextWebSocket(runId);
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { authManager } from '@/core/auth/auth-manager';
import { env } from '@/core/auth/environment';
import { logger } from '@/core/utils/logger';

export type BusinessContextStatus = 'pending' | 'generating' | 'complete' | 'failed';

export interface BusinessContextProgressState {
  runId: string;
  status: BusinessContextStatus;
  progress: number; // 0-100
  step: { current: number; total: number };
  currentStep?: string;
}

interface WebSocketMessage {
  type: 'initial' | 'progress' | 'complete' | 'failed' | 'pong' | 'error' | 'ready';
  data?: {
    status?: BusinessContextStatus;
    progress?: number;
    step?: { current: number; total: number };
    current_step?: string;
    error?: string;
  };
  message?: string;
  timestamp?: number;
}

interface UseBusinessContextWebSocketReturn {
  progress: BusinessContextProgressState | null;
  isConnected: boolean;
  error: Error | null;
  reconnect: () => void;
}

const HEARTBEAT_INTERVAL = 5000; // 5 seconds (well under DO hibernation timeout of 10s)
const RECONNECT_DELAY = 1000; // 1 second (fail fast to polling)
const MAX_RECONNECT_ATTEMPTS = 1; // Fail fast - fall back to HTTP polling quickly

export function useBusinessContextWebSocket(runId: string | null): UseBusinessContextWebSocketReturn {
  const [progress, setProgress] = useState<BusinessContextProgressState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isMountedRef = useRef(true);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  // Connect to WebSocket
  const connect = useCallback(async () => {
    if (!runId || !isMountedRef.current) return;

    try {
      cleanup();

      const token = await authManager.getAccessToken();
      if (!token) throw new Error('Authentication required');

      // Build WebSocket URL for business context generation
      const protocol = env.apiUrl.startsWith('https') ? 'wss' : 'ws';
      const wsUrl = env.apiUrl.replace(/^https?/, protocol);
      const url = `${wsUrl}/api/business/generate-context/${runId}/ws?token=${encodeURIComponent(token)}`;

      logger.info('[BusinessContextWS] Connecting', { runId });

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isMountedRef.current) {
          ws.close();
          return;
        }

        logger.info('[BusinessContextWS] Connected', { runId });
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;

        // Send immediate ping to prevent early hibernation
        ws.send(JSON.stringify({ action: 'ping' }));

        // Start heartbeat interval
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ action: 'ping' }));
          }
        }, HEARTBEAT_INTERVAL);
      };

      ws.onmessage = (event) => {
        if (!isMountedRef.current) return;

        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          switch (message.type) {
            case 'initial':
            case 'progress': {
              if (message.data) {
                const newProgress: BusinessContextProgressState = {
                  runId,
                  status: message.data.status || 'generating',
                  progress: message.data.progress || 0,
                  step: message.data.step || { current: 0, total: 4 },
                  currentStep: message.data.current_step,
                };
                setProgress(newProgress);
                logger.info('[BusinessContextWS] Progress update', {
                  runId,
                  progress: newProgress.progress,
                });
              }
              break;
            }

            case 'complete': {
              if (message.data) {
                const completeProgress: BusinessContextProgressState = {
                  runId,
                  status: 'complete',
                  progress: 100,
                  step: message.data.step || { current: 4, total: 4 },
                  currentStep: message.data.current_step,
                };
                setProgress(completeProgress);
                logger.info('[BusinessContextWS] Generation complete - closing connection', { runId });

                // CRITICAL: Stop reconnection attempts and close WebSocket
                reconnectAttemptsRef.current = MAX_RECONNECT_ATTEMPTS;
                cleanup();
              }
              break;
            }

            case 'failed': {
              if (message.data) {
                const failedProgress: BusinessContextProgressState = {
                  runId,
                  status: 'failed',
                  progress: message.data.progress || 0,
                  step: message.data.step || { current: 0, total: 4 },
                  currentStep: message.data.current_step || 'Failed',
                };
                setProgress(failedProgress);
                setError(new Error(message.data.error || 'Business context generation failed'));
                logger.info('[BusinessContextWS] Generation failed - closing connection', { runId });

                // CRITICAL: Stop reconnection attempts and close WebSocket
                reconnectAttemptsRef.current = MAX_RECONNECT_ATTEMPTS;
                cleanup();
              }
              break;
            }

            case 'ready':
              logger.info('[BusinessContextWS] Connection ready', { runId });
              break;

            case 'pong':
              // Heartbeat acknowledged
              break;

            case 'error':
              logger.error('[BusinessContextWS] Server error', new Error(message.message || 'Server error'));
              setError(new Error(message.message || 'Server error'));
              break;

            default:
              logger.warn('[BusinessContextWS] Unknown message', { type: message.type });
          }
        } catch (err) {
          logger.error('[BusinessContextWS] Parse error', err as Error);
        }
      };

      ws.onerror = () => {
        logger.error('[BusinessContextWS] Connection error', new Error('WebSocket connection error'), { runId });
        setError(new Error('WebSocket connection error'));
      };

      ws.onclose = (event) => {
        if (!isMountedRef.current) return;

        setIsConnected(false);
        cleanup();

        // Clean closure (code 1000 or 1001) - no reconnection needed
        if (event.code === 1000 || event.code === 1001) {
          logger.info('[BusinessContextWS] Clean closure, no reconnection needed', {
            runId,
            code: event.code,
            reason: event.reason,
          });
          return;
        }

        // Abnormal closure - attempt reconnection
        logger.warn('[BusinessContextWS] Abnormal closure', { runId, code: event.code, reason: event.reason });

        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          logger.info('[BusinessContextWS] Reconnecting', {
            attempt: reconnectAttemptsRef.current,
            max: MAX_RECONNECT_ATTEMPTS,
          });

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, RECONNECT_DELAY * reconnectAttemptsRef.current);
        } else {
          setError(new Error('Max reconnection attempts reached'));
          logger.error('[BusinessContextWS] Max retries reached for abnormal closure', new Error('Max retries reached'), { runId });
        }
      };
    } catch (err) {
      logger.error('[BusinessContextWS] Failed to connect', err as Error);
      setError(err as Error);
      setIsConnected(false);
    }
  }, [runId, cleanup]);

  // Initial connection
  useEffect(() => {
    isMountedRef.current = true;

    if (runId) {
      connect();
    }

    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [runId, connect, cleanup]);

  // Page Visibility handler - reconnect when tab becomes visible
  useEffect(() => {
    if (!isConnected || !runId) return;

    // Prevent tab/browser hibernation during generation
    const handleVisibilityChange = () => {
      if (!document.hidden && wsRef.current?.readyState !== WebSocket.OPEN) {
        logger.warn('[BusinessContextWS] Tab visible but WS dead - reconnecting');
        connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isConnected, runId, connect]);

  return { progress, isConnected, error, reconnect: connect };
}
