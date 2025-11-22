// src/features/analysis-queue/hooks/useQueueSSE.ts

/**
 * QUEUE SSE HOOK - DURABLE OBJECTS CONNECTION
 *
 * Manages Server-Sent Events (SSE) connection to Durable Objects
 * for real-time analysis progress updates.
 *
 * ARCHITECTURE:
 * - Auto-reconnect on connection failure
 * - Parses SSE messages and updates Zustand store
 * - Cleanup on unmount
 *
 * MESSAGE FORMAT:
 * {
 *   type: 'progress' | 'complete' | 'failed',
 *   leadId: string,
 *   username: string,
 *   avatarUrl?: string,
 *   progress: number,
 *   step: { current: number, total: number },
 * }
 *
 * USAGE:
 * useQueueSSE(); // Call in a top-level component (e.g., App or TopBar parent)
 */

import { useEffect, useRef } from 'react';
import { useAnalysisQueueStore, AnalysisStatus } from '../stores/useAnalysisQueueStore';

// SSE endpoint (update with your actual Durable Objects endpoint)
const SSE_ENDPOINT = '/api/analysis-queue/stream';

// Reconnection settings
const RECONNECT_DELAY = 3000; // 3 seconds
const MAX_RECONNECT_ATTEMPTS = 5;

interface SSEMessage {
  type: 'progress' | 'complete' | 'failed' | 'start';
  leadId: string;
  username: string;
  avatarUrl?: string;
  progress: number;
  step: {
    current: number;
    total: number;
  };
}

export function useQueueSSE() {
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { addJob, updateJob } = useAnalysisQueueStore();

  useEffect(() => {
    // Connect to SSE stream
    const connect = () => {
      try {
        // Close existing connection
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }

        // Create new EventSource
        const eventSource = new EventSource(SSE_ENDPOINT, {
          withCredentials: true, // Include cookies for authentication
        });

        eventSourceRef.current = eventSource;

        // Handle incoming messages
        eventSource.onmessage = (event) => {
          try {
            const message: SSEMessage = JSON.parse(event.data);

            // Map SSE type to AnalysisStatus
            let status: AnalysisStatus;
            switch (message.type) {
              case 'start':
                status = 'pending';
                break;
              case 'progress':
                status = 'analyzing';
                break;
              case 'complete':
                status = 'complete';
                break;
              case 'failed':
                status = 'failed';
                break;
              default:
                status = 'analyzing';
            }

            // Check if job exists
            const existingJob = useAnalysisQueueStore
              .getState()
              .jobs.find((job) => job.leadId === message.leadId);

            if (!existingJob) {
              // Add new job
              addJob({
                leadId: message.leadId,
                username: message.username,
                avatarUrl: message.avatarUrl,
                progress: message.progress,
                step: message.step,
                status,
              });
            } else {
              // Update existing job
              updateJob(message.leadId, {
                progress: message.progress,
                step: message.step,
                status,
              });
            }

            // Reset reconnect attempts on successful message
            reconnectAttemptsRef.current = 0;
          } catch (error) {
            console.error('[QueueSSE] Failed to parse message:', error);
          }
        };

        // Handle connection open
        eventSource.onopen = () => {
          console.log('[QueueSSE] Connected to analysis queue stream');
          reconnectAttemptsRef.current = 0;
        };

        // Handle errors and reconnection
        eventSource.onerror = () => {
          console.error('[QueueSSE] Connection error, attempting to reconnect...');
          eventSource.close();

          // Attempt reconnection with exponential backoff
          if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttemptsRef.current += 1;
            const delay = RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current - 1);

            reconnectTimeoutRef.current = setTimeout(() => {
              console.log(
                `[QueueSSE] Reconnecting... (attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`
              );
              connect();
            }, delay);
          } else {
            console.error('[QueueSSE] Max reconnection attempts reached');
          }
        };
      } catch (error) {
        console.error('[QueueSSE] Failed to connect:', error);
      }
    };

    // Initial connection
    connect();

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [addJob, updateJob]);
}
