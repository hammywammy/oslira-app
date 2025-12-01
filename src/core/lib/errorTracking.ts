/**
 * @file Error Tracking (Stub)
 * @description Stub for error tracking - full version from Phase 1 errorTracking artifact
 * For now, just log errors. Will integrate Sentry later.
 */

import { logger } from '@/core/utils/logger';

interface ErrorContext {
  [key: string]: unknown;
}

class ErrorTracking {
  captureException(error: Error, context?: ErrorContext): void {
    logger.error('Error captured', error, context);
    // TODO(oslira): Integrate Sentry SDK for production error tracking - see docs.sentry.io
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    logger[level === 'warning' ? 'warn' : level](message);
    // TODO(oslira): Integrate Sentry SDK for production message capture - see docs.sentry.io
  }
}

export const errorTracking = new ErrorTracking();
export default errorTracking;
