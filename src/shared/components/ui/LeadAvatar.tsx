// src/shared/components/ui/LeadAvatar.tsx

import { useState } from 'react';

/**
 * LEAD AVATAR COMPONENT
 *
 * Displays lead profile picture with automatic fallback to initials.
 *
 * Handles:
 * - R2 URLs (new leads): Always work
 * - Instagram URLs (old leads): May fail due to CORS/expiry
 * - Missing URLs: Shows initials immediately
 * - Load errors: Gracefully falls back to initials
 *
 * Usage:
 * <LeadAvatar url={lead.profile_pic_url} username={lead.username} size="md" />
 */

interface LeadAvatarProps {
  /** Profile picture URL (R2 or Instagram) */
  url: string | null | undefined;
  /** Instagram username (used for initials fallback) */
  username: string;
  /** Display name (preferred for initials if available) */
  displayName?: string | null;
  /** Size preset */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Additional CSS classes */
  className?: string;
}

const SIZE_CONFIG = {
  xs: {
    container: 'w-6 h-6',
    text: 'text-xs',
  },
  sm: {
    container: 'w-8 h-8',
    text: 'text-sm',
  },
  md: {
    container: 'w-10 h-10',
    text: 'text-base',
  },
  lg: {
    container: 'w-14 h-14',
    text: 'text-lg',
  },
  xl: {
    container: 'w-20 h-20',
    text: 'text-2xl',
  },
} as const;

export function LeadAvatar({
  url,
  username,
  displayName,
  size = 'md',
  className = '',
}: LeadAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get initials from display name or username
  const getInitial = (): string => {
    if (displayName && displayName.trim()) {
      return displayName.trim().charAt(0).toUpperCase();
    }
    if (username && username.trim()) {
      return username.trim().charAt(0).toUpperCase();
    }
    return '?';
  };

  const sizeConfig = SIZE_CONFIG[size];
  const shouldShowImage = url && !imageError;
  const initial = getInitial();

  return (
    <div
      className={`
        ${sizeConfig.container}
        rounded-full
        bg-gradient-to-br from-primary to-primary/60
        flex items-center justify-center
        text-white font-semibold
        overflow-hidden
        flex-shrink-0
        relative
        ${className}
      `}
    >
      {/* Initials (always rendered, shown when no image) */}
      {(!shouldShowImage || !imageLoaded) && (
        <span className={`${sizeConfig.text} select-none`}>
          {initial}
        </span>
      )}

      {/* Image (rendered on top when available) */}
      {shouldShowImage && (
        <img
          src={url}
          alt={displayName || username}
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-opacity duration-200
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(false);
          }}
        />
      )}
    </div>
  );
}

// Default export for convenience
export default LeadAvatar;
