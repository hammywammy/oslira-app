// src/shared/components/ui/Label.tsx

/**
 * LABEL COMPONENT
 * 
 * Form label primitive with semantic HTML
 * 
 * FEATURES:
 * - Semantic <label> element
 * - Required indicator (*)
 * - Optional helper text
 * - Proper typography (14px, medium weight)
 * - Associated with form controls via htmlFor
 * 
 * DESIGN:
 * - Text: Neutral-900 (primary text)
 * - Font: 14px, weight 500
 * - Spacing: 12px from input
 * 
 * USAGE:
 * <Label htmlFor="email">Email Address</Label>
 * <Label htmlFor="name" required>Full Name</Label>
 * <Label htmlFor="bio" helper="Tell us about yourself">Bio</Label>
 */

import { LabelHTMLAttributes, ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Label text */
  children: ReactNode;
  /** Mark as required (shows asterisk) */
  required?: boolean;
  /** Helper text below label */
  helper?: string;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function Label({
  children,
  required = false,
  helper,
  className = '',
  ...props
}: LabelProps) {
  return (
    <div className="flex flex-col gap-1">
      {/* Label */}
      <label
        className={`
          text-sm font-medium text-neutral-900
          ${className}
        `}
        {...props}
      >
        {children}
        {required && (
          <span className="text-error-600 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {/* Helper Text */}
      {helper && (
        <span className="text-xs text-neutral-600">
          {helper}
        </span>
      )}
    </div>
  );
}
