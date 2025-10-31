// src/shared/components/ui/Alert.tsx

/**
 * ALERT COMPONENT - PRODUCTION GRADE V2.0
 * 
 * Professional alert/notification with natural dark mode support
 * Follows Card.tsx and Button.tsx architecture patterns
 * 
 * ARCHITECTURE:
 * ✅ Natural Tailwind dark: classes for automatic mode detection
 * ✅ Proper contrast in both light and dark modes
 * ✅ Semantic variants (success, error, warning, info)
 * ✅ Size variants (sm, md, lg) control padding
 * ✅ Closeable with X button
 * ✅ Auto icon per variant
 * 
 * DESIGN PHILOSOPHY:
 * "Concert hall, not arcade"
 * - Clean, professional alert styling
 * - Semantic colors with proper contrast
 * - Subtle backgrounds, not overwhelming
 * 
 * USAGE:
 * <Alert variant="success">Changes saved!</Alert>
 * <Alert variant="error" closeable onClose={handler}>Error occurred</Alert>
 * <Alert variant="info" icon="custom-icon">Custom info</Alert>
 */

import { Icon } from '@iconify/react';
import { HTMLAttributes, ReactNode, useState } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: 'success' | 'error' | 'warning' | 'info';
  /** Size variant (controls padding) */
  size?: 'sm' | 'md' | 'lg';
  /** Border radius */
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
  /** Custom icon (overrides default variant icon) */
  icon?: string;
  /** Show close button */
  closeable?: boolean;
  /** Close handler */
  onClose?: () => void;
  /** Alert content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// SIZE STYLES (PADDING)
// =============================================================================

const sizeStyles = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
} as const;

// =============================================================================
// ROUNDED STYLES
// =============================================================================

const roundedStyles = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
} as const;

// =============================================================================
// VARIANT STYLES - LIGHT/DARK MODE COMPATIBLE
// =============================================================================

const variantStyles = {
  success: {
    container: `
      bg-success-100 border-success-400
      dark:bg-success-900/20 dark:border-success-700
    `,
    icon: 'text-success-600 dark:text-success-400',
    text: 'text-success-800 dark:text-success-200',
  },
  error: {
    container: `
      bg-error-100 border-error-400
      dark:bg-error-900/20 dark:border-error-700
    `,
    icon: 'text-error-600 dark:text-error-400',
    text: 'text-error-800 dark:text-error-200',
  },
  warning: {
    container: `
      bg-warning-100 border-warning-400
      dark:bg-warning-900/20 dark:border-warning-700
    `,
    icon: 'text-warning-600 dark:text-warning-400',
    text: 'text-warning-800 dark:text-warning-200',
  },
  info: {
    container: `
      bg-info-100 border-info-400
      dark:bg-info-900/20 dark:border-info-700
    `,
    icon: 'text-info-600 dark:text-info-400',
    text: 'text-info-800 dark:text-info-200',
  },
} as const;

// =============================================================================
// DEFAULT ICONS PER VARIANT
// =============================================================================

const defaultIcons = {
  success: 'lucide:check-circle',
  error: 'lucide:alert-circle',
  warning: 'lucide:alert-triangle',
  info: 'lucide:info',
} as const;

// =============================================================================
// COMPONENT
// =============================================================================

export function Alert({
  variant = 'info',
  size = 'md',
  rounded = 'lg',
  icon,
  closeable = false,
  onClose,
  children,
  className = '',
  ...props
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  const iconToUse = icon || defaultIcons[variant];
  const styles = variantStyles[variant];

  return (
    <div
      role="alert"
      className={`
        ${sizeStyles[size]}
        ${roundedStyles[rounded]}
        ${styles.container}
        flex items-start gap-3
        border
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {/* Icon */}
      <Icon
        icon={iconToUse}
        width={20}
        height={20}
        className={`${styles.icon} flex-shrink-0 mt-0.5`}
        aria-hidden="true"
      />

      {/* Content */}
      <div className={`flex-1 ${styles.text} text-sm`}>
        {children}
      </div>

      {/* Close Button */}
      {closeable && (
        <button
          type="button"
          onClick={handleClose}
          className={`
            ${styles.icon}
            flex-shrink-0
            hover:opacity-70
            transition-opacity duration-150
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current
            rounded
          `}
          aria-label="Close alert"
        >
          <Icon icon="lucide:x" width={18} height={18} />
        </button>
      )}
    </div>
  );
}
