// src/shared/components/ui/Textarea.tsx

/**
 * TEXTAREA COMPONENT - PRODUCTION GRADE
 * 
 * Multi-line text input primitive
 * 
 * FIXES:
 * ✅ React Error #137 - Explicitly destructures children to prevent spreading
 * ✅ Development warning when children accidentally passed
 * ✅ Type safety with strict prop filtering
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
      children, // ← CRITICAL: Explicitly extract to prevent spreading to <textarea>
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);
    const [charCount, setCharCount] = useState(0);
    const errorId = error && id ? `${id}-error` : undefined;

    // =========================================================================
    // SAFETY CHECK - Development warning for children
    // =========================================================================
    if (process.env.NODE_ENV === 'development' && children !== undefined) {
      console.error(
        '[Textarea] Textarea elements should not have children. Use value/defaultValue instead. The children prop has been ignored.',
        { receivedChildren: children }
      );
    }

    // =========================================================================
    // COMBINE REFS
    // =========================================================================
    const setRefs = (element: HTMLTextAreaElement | null) => {
      internalRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    // =========================================================================
    // AUTO-RESIZE LOGIC
    // =========================================================================
    useEffect(() => {
      if (autoResize && internalRef.current) {
        const textarea = internalRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [value, autoResize]);

    // =========================================================================
    // CHARACTER COUNT TRACKING
    // =========================================================================
    useEffect(() => {
      if (showCount && value !== undefined) {
        const count = typeof value === 'string' ? value.length : 0;
        setCharCount(count);
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
        {/* Textarea - CRITICAL: Self-closing, children explicitly excluded */}
        <textarea
          ref={setRefs}
          id={id}
          rows={rows}
          maxLength={maxLength}
          value={value}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId}
          onChange={handleChange}
          className={`
            ${getStateStyles(error, success, disabled)}
            ${fullWidth ? 'w-full' : ''}
            px-3 py-2
            rounded-md border bg-white
            font-normal text-neutral-900 placeholder-neutral-500
            transition-all duration-200
            focus:outline-none
            disabled:opacity-50
            resize-none
            ${className}
          `.trim().replace(/\s+/g, ' ')}
          {...props}
        />

        {/* Character Count / Error Row */}
        <div className="flex items-center justify-between">
          {/* Error Message */}
          {error && (
            <div 
              id={errorId}
              className="flex items-center gap-1.5 text-sm text-error-600"
              role="alert"
            >
              <Icon icon="lucide:alert-circle" width={14} height={14} />
              <span>{error}</span>
            </div>
          )}

          {/* Character Count */}
          {showCount && maxLength && (
            <div className="text-xs text-neutral-600 ml-auto">
              {charCount} / {maxLength}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
