// src/shared/components/ui/Textarea.tsx

/**
 * TEXTAREA COMPONENT
 * 
 * Multi-line text input primitive
 * 
 * FEATURES:
 * - Validation states (default, error, success)
 * - Optional auto-resize
 * - Character count
 * - Full accessibility
 * - Disabled state
 * 
 * DESIGN:
 * - Min height: 80px (5 rows default)
 * - Border radius: 6px
 * - Matches Input component styling
 * - Focus: Electric blue ring
 * 
 * USAGE:
 * <Textarea placeholder="Enter description..." rows={5} />
 * <Textarea error="Description is required" />
 * <Textarea maxLength={500} showCount />
 */

import { Icon } from '@iconify/react';
import { TextareaHTMLAttributes, forwardRef, useEffect, useRef, useState } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error message (shows error state) */
  error?: string;
  /** Success state */
  success?: boolean;
  /** Auto-resize to content */
  autoResize?: boolean;
  /** Show character count */
  showCount?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// STATE STYLES
// =============================================================================

const getStateStyles = (error?: string, success?: boolean, disabled?: boolean) => {
  if (disabled) {
    return 'bg-neutral-100 border-neutral-300 text-neutral-500 cursor-not-allowed';
  }
  if (error) {
    return 'border-error-500 focus:border-error-600 focus:ring-2 focus:ring-error-200';
  }
  if (success) {
    return 'border-success-500 focus:border-success-600 focus:ring-2 focus:ring-success-200';
  }
  return 'border-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200';
};

// =============================================================================
// COMPONENT
// =============================================================================

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      error,
      success = false,
      autoResize = false,
      showCount = false,
      fullWidth = false,
      disabled = false,
      className = '',
      id,
      rows = 4,
      maxLength,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);
    const [charCount, setCharCount] = useState(0);
    const errorId = error && id ? `${id}-error` : undefined;

    // Auto-resize functionality
    useEffect(() => {
      if (autoResize && internalRef.current) {
        const textarea = internalRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [value, autoResize]);

    // Character count tracking
    useEffect(() => {
      if (showCount && value) {
        setCharCount(String(value).length);
      }
    }, [value, showCount]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (showCount) {
        setCharCount(e.target.value.length);
      }
      onChange?.(e);
    };

    return (
      <div className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''}`}>
        {/* Textarea */}
        <textarea
          ref={(node) => {
            // Handle both forwarded ref and internal ref
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            internalRef.current = node;
          }}
          id={id}
          rows={rows}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId}
          className={`
            ${getStateStyles(error, success, disabled)}
            ${fullWidth ? 'w-full' : ''}
            px-3 py-2
            bg-neutral-0
            border
            rounded-md
            font-normal
            text-base
            text-neutral-900
            placeholder:text-neutral-500
            transition-all duration-100
            focus:outline-none
            resize-y
            ${autoResize ? 'resize-none' : ''}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
          {...props}
        />

        {/* Footer: Error or Character Count */}
        <div className="flex items-center justify-between gap-2">
          {/* Error Message */}
          {error && (
            <span
              id={errorId}
              className="text-xs text-error-700 flex items-center gap-1"
              role="alert"
            >
              <Icon icon="mdi:alert-circle" width={12} height={12} aria-hidden="true" />
              {error}
            </span>
          )}

          {/* Character Count */}
          {showCount && (
            <span
              className={`
                text-xs ml-auto
                ${maxLength && charCount > maxLength ? 'text-error-700' : 'text-neutral-600'}
              `}
            >
              {charCount}
              {maxLength && ` / ${maxLength}`}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
