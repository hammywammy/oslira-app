// src/features/onboarding/hooks/useDebounced.ts

/**
 * DEBOUNCED ACTION HOOK
 * 
 * Prevents rapid-fire calls to expensive operations
 * Used for: Navigation, validation, form submission
 * 
 * Pattern:
 * - First call executes immediately
 * - Subsequent calls within delay are ignored
 * - After delay expires, next call executes
 */

import { useRef, useCallback } from 'react';

interface UseDebouncedOptions {
  delay?: number;
  leading?: boolean; // Execute on first call
  trailing?: boolean; // Execute after delay
}

/**
 * Creates a debounced version of a function
 * 
 * @param callback - Function to debounce
 * @param options - Debounce configuration
 * @returns Debounced function
 */
export function useDebounced<T extends (...args: any[]) => any>(
  callback: T,
  options: UseDebouncedOptions = {}
): (...args: Parameters<T>) => void {
  const { delay = 300, leading = true, trailing = false } = options;
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallRef = useRef<number>(0);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallRef.current;

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Leading edge: Execute immediately if enough time has passed
      if (leading && timeSinceLastCall >= delay) {
        lastCallRef.current = now;
        callback(...args);
        return;
      }

      // Trailing edge: Execute after delay
      if (trailing) {
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callback(...args);
        }, delay);
      }
    },
    [callback, delay, leading, trailing]
  );

  return debouncedFn;
}

/**
 * Simple throttle hook (different from debounce)
 * Executes at most once per delay period
 */
export function useThrottled<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  const lastRunRef = useRef<number>(0);

  const throttledFn = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastRunRef.current >= delay) {
        lastRunRef.current = now;
        callback(...args);
      }
    },
    [callback, delay]
  );

  return throttledFn;
}
