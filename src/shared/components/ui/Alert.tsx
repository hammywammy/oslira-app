// src/shared/components/ui/Alert.tsx

/**
 * ALERT COMPONENT
 * 
 * Notification banner with semantic variants
 * 
 * FEATURES:
 * - 4 variants (success, error, warning, info)
 * - Optional icon
 * - Optional title
 * - Optional dismiss button
 * - Full accessibility
 * 
 * DESIGN:
 * - Colored background (100-level semantic colors)
 * - Colored border (400-level semantic colors)
 * - Colored text (700-level semantic colors)
 * - Border radius: 8px
 * - Padding: 16px
 * 
 * USAGE:
 * <Alert variant="success">Lead analyzed successfully!</Alert>
 * <Alert variant="error" title="Error" onDismiss={() => {}}>
 *   Failed to analyze lead. Please try again.
 * </Alert>
 */

import { Icon } from '@iconify/react';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

// =============================================================================
// TYPES
// =============================================================================

export interface AlertProps {
  /** Alert content */
  children: ReactNode;
  /** Visual variant */
  variant: 'success' | 'error' | 'warning' | 'info';
  /** Optional title */
  title?: string;
  /** Optional custom icon */
  icon?: string;
  /** Dismiss callback */
  onDismiss?: () => void;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// VARIANT CONFIGURATION
// =============================================================================

const variantConfig = {
  success: {
    container: 'bg-success-100 border-success-400 text-success-700',
    icon: 'mdi:check-circle',
    iconColor: 'text-success-600',
  },
  error: {
    container: 'bg-error-100 border-error-400 text-error-700',
    icon: 'mdi:alert-circle',
    iconColor: 'text-error-600',
  },
  warning: {
    container: 'bg-warning-100 border-warning-400 text-warning-700',
    icon: 'mdi:alert',
    iconColor: 'text-warning-600',
  },
  info: {
    container: 'bg-info-100 border-info-400 text-info-700',
    icon: 'mdi:information',
    iconColor: 'text-info-600',
  },
} as const;

// =============================================================================
// COMPONENT
// =============================================================================

export function Alert({
  children,
  variant,
  title,
  icon,
  onDismiss,
  className = '',
}: AlertProps) {
  const config = variantConfig[variant];
  const displayIcon = icon || config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      role="alert"
      className={`
        ${config.container}
        flex items-start gap-3
        p-4
        border
        rounded-lg
        ${className}
      `}
    >
      {/* Icon */}
      <Icon
        icon={displayIcon}
        width={20}
        height={20}
        className={`${config.iconColor} flex-shrink-0 mt-0.5`}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        {title && (
          <h4 className="font-semibold text-sm mb-1">
            {title}
          </h4>
        )}

        {/* Message */}
        <div className="text-sm">
          {children}
        </div>
      </div>

      {/* Dismiss Button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`
            ${config.iconColor}
            flex-shrink-0
            hover:opacity-70
            transition-opacity duration-150
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            rounded
          `}
          aria-label="Dismiss alert"
        >
          <Icon icon="mdi:close" width={18} height={18} />
        </button>
      )}
    </motion.div>
  );
}
