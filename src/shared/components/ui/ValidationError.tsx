/**
 * VALIDATION ERROR COMPONENT
 *
 * Inline validation error display with red box styling.
 * Used for form field validation feedback.
 *
 * FEATURES:
 * - Red background with border
 * - Icon with error message
 * - Animated entrance
 * - Dark mode compatible
 *
 * USAGE:
 * <ValidationError message="Username must be at least 3 characters" />
 * <ValidationError message={error} show={!!error} />
 */

import { Icon } from '@iconify/react';

export interface ValidationErrorProps {
  /** Error message to display */
  message: string | null;
  /** Whether to show the error (defaults to true if message exists) */
  show?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md';
}

// SIZE STYLES
const sizeStyles = {
  sm: {
    container: 'p-2',
    text: 'text-xs',
    icon: 14,
  },
  md: {
    container: 'p-3',
    text: 'text-sm',
    icon: 16,
  },
} as const;

export function ValidationError({
  message,
  show,
  className = '',
  size = 'md',
}: ValidationErrorProps) {
  // Determine visibility - show if `show` is true or if message exists and show is undefined
  const isVisible = show !== undefined ? show && !!message : !!message;

  if (!isVisible || !message) {
    return null;
  }

  const styles = sizeStyles[size];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        ${styles.container}
        bg-red-50 dark:bg-red-900/20
        border border-red-300 dark:border-red-800
        rounded-lg
        flex items-start gap-2
        animate-in fade-in slide-in-from-top-1 duration-200
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      <Icon
        icon="lucide:alert-circle"
        width={styles.icon}
        height={styles.icon}
        className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
        aria-hidden="true"
      />
      <span className={`${styles.text} text-red-700 dark:text-red-300 font-medium`}>
        {message}
      </span>
    </div>
  );
}

export default ValidationError;
