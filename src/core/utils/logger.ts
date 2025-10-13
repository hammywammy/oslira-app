/**
 * @file Logger Utility
 * @description Migrated from Logger.js - preserves all logging logic
 * 
 * Features:
 * - Environment-aware logging
 * - Log levels (debug, info, warn, error)
 * - Structured logging with context
 * - Performance measurement
 * - Error tracking integration ready
 */

import { ENV } from '@/core/config/env';

// =============================================================================
// TYPES
// =============================================================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: LogContext;
  timestamp: string;
  error?: Error;
}

// =============================================================================
// LOG LEVEL HIERARCHY
// =============================================================================

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const CURRENT_LOG_LEVEL = LOG_LEVELS[ENV.logLevel];

// =============================================================================
// LOGGER CLASS
// =============================================================================

class Logger {
  private history: LogEntry[] = [];
  private maxHistorySize = 100;

  /**
   * Check if log level should be shown
   */
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= CURRENT_LOG_LEVEL;
  }

  /**
   * Format log message with timestamp and context
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (context) {
      return `${prefix} ${message} ${JSON.stringify(context)}`;
    }
    
    return `${prefix} ${message}`;
  }

  /**
   * Store log entry in history
   */
  private storeInHistory(entry: LogEntry): void {
    this.history.push(entry);
    
    // Keep only last N entries
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog('debug')) return;

    const entry: LogEntry = {
      level: 'debug',
      message,
      context,
      timestamp: new Date().toISOString(),
    };

    this.storeInHistory(entry);

    if (ENV.isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(this.formatMessage('debug', message, context));
    }
  }

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    if (!this.shouldLog('info')) return;

    const entry: LogEntry = {
      level: 'info',
      message,
      context,
      timestamp: new Date().toISOString(),
    };

    this.storeInHistory(entry);

    if (ENV.isDevelopment || ENV.isStaging) {
      // eslint-disable-next-line no-console
      console.log(this.formatMessage('info', message, context));
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog('warn')) return;

    const entry: LogEntry = {
      level: 'warn',
      message,
      context,
      timestamp: new Date().toISOString(),
    };

    this.storeInHistory(entry);

    console.warn(this.formatMessage('warn', message, context));
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: LogContext): void {
    if (!this.shouldLog('error')) return;

    const entry: LogEntry = {
      level: 'error',
      message,
      context,
      timestamp: new Date().toISOString(),
      error,
    };

    this.storeInHistory(entry);

    console.error(this.formatMessage('error', message, context));
    
    if (error) {
      console.error('Error details:', error);
    }

    // TODO: Send to Sentry in production
    if (ENV.isProduction && ENV.sentryDsn) {
      // Sentry.captureException(error || new Error(message), { extra: context });
    }
  }

  /**
   * Measure performance of an operation
   */
  async measure<T>(
    label: string,
    operation: () => Promise<T> | T,
    context?: LogContext
  ): Promise<T> {
    const startTime = performance.now();
    
    this.debug(`Starting: ${label}`, context);
    
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      
      this.debug(`Completed: ${label}`, {
        ...context,
        duration: `${duration.toFixed(2)}ms`,
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      this.error(`Failed: ${label}`, error as Error, {
        ...context,
        duration: `${duration.toFixed(2)}ms`,
      });
      
      throw error;
    }
  }

  /**
   * Get log history
   */
  getHistory(): LogEntry[] {
    return [...this.history];
  }

  /**
   * Clear log history
   */
  clearHistory(): void {
    this.history = [];
  }

  /**
   * Get recent errors
   */
  getRecentErrors(count = 10): LogEntry[] {
    return this.history
      .filter((entry) => entry.level === 'error')
      .slice(-count);
  }

  /**
   * Export logs (for debugging)
   */
  exportLogs(): string {
    return JSON.stringify(this.history, null, 2);
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

export const logger = new Logger();

// =============================================================================
// EXPORTS
// =============================================================================

export default logger;
