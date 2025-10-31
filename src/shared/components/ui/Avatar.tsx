// src/shared/components/ui/Avatar.tsx

/**
 * AVATAR COMPONENT
 * 
 * Profile image with fallback to initials
 * 
 * FEATURES:
 * - Image with error handling
 * - Fallback to initials
 * - 4 sizes (sm, md, lg, xl)
 * - Circular by default
 * - Optional status indicator
 * 
 * USAGE:
 * <Avatar src="..." alt="..." size="md" />
 * <Avatar name="John Doe" size="lg" status="online" />
 */

import { useState } from 'react';
import { Icon } from '@iconify/react';

// =============================================================================
// TYPES
// =============================================================================

export interface AvatarProps {
  /** Image URL */
  src?: string;
  /** Alt text for image */
  alt?: string;
  /** Fallback name for initials */
  name?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Optional status indicator */
  status?: 'online' | 'offline' | 'away' | 'busy';
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

const statusColors = {
  online: 'bg-success-500',
  offline: 'bg-neutral-400',
  away: 'bg-warning-500',
  busy: 'bg-error-500',
} as const;

// =============================================================================
// HELPER: Generate Initials
// =============================================================================

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// =============================================================================
// COMPONENT
// =============================================================================

export function Avatar({
  src,
  alt,
  name = 'User',
  size = 'md',
  status,
  className = '',
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const initials = getInitials(name);
  const showFallback = !src || imageError || !imageLoaded;

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Avatar Container */}
      <div
        className={`
          ${sizeStyles[size]}
          rounded-full
          overflow-hidden
          bg-primary-100
          flex items-center justify-center
          font-medium text-primary-700
          transition-opacity duration-200
        `}
      >
        {/* Image */}
        {src && !imageError && (
          <img
            src={src}
            alt={alt || name}
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
            className={`
              w-full h-full object-cover
              transition-opacity duration-200
              ${showFallback ? 'opacity-0' : 'opacity-100'}
            `}
          />
        )}

        {/* Fallback Initials */}
        {showFallback && (
          <span className="select-none">
            {initials}
          </span>
        )}
      </div>

      {/* Status Indicator */}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            ${statusSize[size]}
            ${statusColors[status]}
            rounded-full
            border-2 border-neutral-0
          `}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}
