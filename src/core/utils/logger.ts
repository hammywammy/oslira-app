// src/core/utils/logger.ts
 
/**
 * @file Logger Utility
 * @description Production-grade logging with environment-aware output
 */
 
import { env } from '@/core/auth/environment';

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

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
} as const;

const CURRENT_LOG_LEVEL = (() => {
  try {
    return LOG_LEVELS[(env.isProduction ? 'warn' : 'debug') as LogLevel] ?? LOG_LEVELS.info;
  } catch {
    return LOG_LEVELS.info;
  }
})();

class Logger {
  private history: LogEntry[] = [];
  private maxHistorySize = 100;

  private shouldLog(level: LogLevel): boolean {
    const levelValue = LOG_LEVELS[level];
    return levelValue !== undefined && levelValue >= CURRENT_LOG_LEVEL;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (context) {
      return `${prefix} ${message} ${JSON.stringify(context)}`;
    }
    
    return `${prefix} ${message}`;
  }

  private storeInHistory(entry: LogEntry): void {
    this.history.push(entry);
    
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog('debug')) return;

    const entry: LogEntry = {
      level: 'debug',
      message,
      context,
      timestamp: new Date().toISOString(),
    };

    this.storeInHistory(entry);
    // Debug logs stored in history only, not printed to console
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldLog('info')) return;

    const entry: LogEntry = {
      level: 'info',
      message,
      context,
      timestamp: new Date().toISOString(),
    };

    this.storeInHistory(entry);
    // Info logs stored in history only, not printed to console
  }

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
  }

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

  getHistory(): LogEntry[] {
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }

  getRecentErrors(count = 10): LogEntry[] {
    return this.history
      .filter((entry) => entry.level === 'error')
      .slice(-count);
  }

  exportLogs(): string {
    return JSON.stringify(this.history, null, 2);
  }
}

export const logger = new Logger();

export default logger;
