/**
 * @file Date Utilities
 * @description Migrated from DateUtils.js - preserves ALL date logic
 * 
 * Features:
 * - Date formatting
 * - Relative time (time ago)
 * - Date validation
 * - Date manipulation
 * - Timezone handling
 */

// FORMATTING
/**
 * Format date to readable string
 * Example: "Jan 15, 2024"
 */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format date with time
 * Example: "Jan 15, 2024 at 3:45 PM"
 */
export function formatDateTime(date: Date | string | number): string {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format time only
 * Example: "3:45 PM"
 */
export function formatTime(date: Date | string | number): string {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid time';
  }

  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format date to ISO string (for API calls)
 */
export function toISOString(date: Date | string | number): string {
  return new Date(date).toISOString();
}

// RELATIVE TIME (Time Ago)
/**
 * Get relative time string
 * Example: "2 hours ago", "3 days ago"
 */
export function timeAgo(date: Date | string | number): string {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) {
    return 'just now';
  } else if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDay < 7) {
    return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
  } else if (diffWeek < 4) {
    return `${diffWeek} ${diffWeek === 1 ? 'week' : 'weeks'} ago`;
  } else if (diffMonth < 12) {
    return `${diffMonth} ${diffMonth === 1 ? 'month' : 'months'} ago`;
  } else {
    return `${diffYear} ${diffYear === 1 ? 'year' : 'years'} ago`;
  }
}

/**
 * Get time until future date
 * Example: "in 2 hours", "in 3 days"
 */
export function timeUntil(date: Date | string | number): string {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  const diffMs = d.getTime() - now.getTime();

  if (diffMs < 0) {
    return timeAgo(date);
  }

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return 'in less than a minute';
  } else if (diffMin < 60) {
    return `in ${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'}`;
  } else if (diffHour < 24) {
    return `in ${diffHour} ${diffHour === 1 ? 'hour' : 'hours'}`;
  } else {
    return `in ${diffDay} ${diffDay === 1 ? 'day' : 'days'}`;
  }
}

// VALIDATION
/**
 * Check if date is valid
 */
export function isValidDate(date: unknown): boolean {
  if (date instanceof Date) {
    return !isNaN(date.getTime());
  }

  if (typeof date === 'string' || typeof date === 'number') {
    const d = new Date(date);
    return !isNaN(d.getTime());
  }

  return false;
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date | string | number): boolean {
  return new Date(date).getTime() < Date.now();
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date | string | number): boolean {
  return new Date(date).getTime() > Date.now();
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string | number): boolean {
  const d = new Date(date);
  const today = new Date();
  
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: Date | string | number): boolean {
  const d = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
}

// MANIPULATION
/**
 * Add days to date
 */
export function addDays(date: Date | string | number, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Add hours to date
 */
export function addHours(date: Date | string | number, hours: number): Date {
  const d = new Date(date);
  d.setHours(d.getHours() + hours);
  return d;
}

/**
 * Add minutes to date
 */
export function addMinutes(date: Date | string | number, minutes: number): Date {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + minutes);
  return d;
}

/**
 * Get start of day
 */
export function startOfDay(date: Date | string | number): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get end of day
 */
export function endOfDay(date: Date | string | number): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Get start of month
 */
export function startOfMonth(date: Date | string | number): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get end of month
 */
export function endOfMonth(date: Date | string | number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d;
}

// COMPARISON
/**
 * Check if two dates are same day
 */
export function isSameDay(date1: Date | string | number, date2: Date | string | number): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

/**
 * Get difference in days between two dates
 */
export function diffInDays(date1: Date | string | number, date2: Date | string | number): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffMs = d2.getTime() - d1.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Get difference in hours between two dates
 */
export function diffInHours(date1: Date | string | number, date2: Date | string | number): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffMs = d2.getTime() - d1.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60));
}

// PARSING
/**
 * Parse date from various formats
 */
export function parseDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}

/**
 * Get date range (for filters)
 */
export function getDateRange(
  range: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth'
): { start: Date; end: Date } {
  const now = new Date();
  let start: Date;
  let end: Date = new Date();

  switch (range) {
    case 'today':
      start = startOfDay(now);
      end = endOfDay(now);
      break;
    
    case 'yesterday':
      start = startOfDay(addDays(now, -1));
      end = endOfDay(addDays(now, -1));
      break;
    
    case 'last7days':
      start = startOfDay(addDays(now, -7));
      end = endOfDay(now);
      break;
    
    case 'last30days':
      start = startOfDay(addDays(now, -30));
      end = endOfDay(now);
      break;
    
    case 'thisMonth':
      start = startOfMonth(now);
      end = endOfDay(now);
      break;
    
    case 'lastMonth':
      const lastMonth = addDays(now, -30);
      start = startOfMonth(lastMonth);
      end = endOfMonth(lastMonth);
      break;
    
    default:
      start = startOfDay(now);
      end = endOfDay(now);
  }

  return { start, end };
}
