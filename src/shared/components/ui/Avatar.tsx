// src/shared/components/ui/Avatar.tsx

/**
 * AVATAR COMPONENT - PRODUCTION GRADE V2.0
 * 
 * Professional avatar with natural dark mode support
 * Follows Card.tsx and Button.tsx architecture patterns
 * 
 * ARCHITECTURE:
 * ✅ Natural Tailwind dark: classes for automatic mode detection
 * ✅ Proper contrast in both light and dark modes
 * ✅ Image support with fallback to initials
 * ✅ Status indicator (online, offline, away, busy)
 * ✅ Size variants (sm, md, lg, xl)
 * ✅ Clickable variant
 * 
 * DESIGN PHILOSOPHY:
 * "Concert hall, not arcade"
 * - Clean, professional avatar styling
 * - Graceful fallback to initials
 * - Subtle status indicators
 * 
 * USAGE:
 * <Avatar src="/user.jpg" name="John Doe" />
 * <Avatar name="Jane Smith" status="online" />
 * <Avatar size="lg" clickable onClick={handler} />
 */

import { HTMLAttributes, useState } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  /** Image URL */
  src?: string;
  /** User name (fallback to initials) */
  name?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Border radius */
  rounded?: 'md' | 'lg' | 'full';
  /** Status indicator */
  status?: 'online' | 'offline' | 'away' | 'busy';
  /** Clickable variant */
  clickable?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// SIZE STYLES
// =============================================================================

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
} as const;

const statusSize = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
} as const;

// =============================================================================
// ROUNDED STYLES
// =============================================================================

const roundedStyles = {
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const;

// =============================================================================
// STATUS COLORS - LIGHT/DARK MODE COMPATIBLE
// =============================================================================

const statusColors = {
  online: 'bg-success-500 dark:bg-success-400',
  offline: 'bg-neutral-400 dark:bg-neutral-600',
  away: 'bg-warning-500 dark:bg-warning-400',
  busy: 'bg-error-500 dark:bg-error-400',
} as const;

// =============================================================================
// HELPER: GET INITIALS
// =============================================================================

function getInitials(name?: string): string {
  if (!name) return '?';
  
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// =============================================================================
// COMPONENT
// =============================================================================

export function Avatar({
  src,
  name,
  size = 'md',
  rounded = 'full',
  status,
  clickable = false,
  className = '',
  onClick,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const showFallback = !src || imageError;
  const initials = getInitials(name);
  const isClickable = clickable || !!onClick;

  return (
    <div
      className={`
        relative inline-flex items-center justify-center
        ${sizeStyles[size]}
        ${roundedStyles[rounded]}
        ${showFallback ? `
          bg-primary-100 text-primary-700
          dark:bg-primary-900/30 dark:text-primary-300
        ` : 'bg-neutral-200 dark:bg-neutral-700'}
        font-semibold
        overflow-hidden
        ${isClickable ? 'cursor-pointer hover:opacity-90 transition-opacity duration-150' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      {...props}
    >
      {/* Image */}
      {src && !imageError && (
        <img
          src={src}
          alt={name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      )}

      {/* Fallback Initials */}
      {showFallback && (
        <span className="select-none">{initials}</span>
      )}

      {/* Status Indicator */}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            ${statusSize[size]}
            ${statusColors[status]}
            rounded-full
            border-2 border-white dark:border-neutral-900
          `}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}
