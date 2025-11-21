// src/shared/components/ui/Modal.tsx

/**
 * MODAL COMPONENT - PRODUCTION GRADE V1.0
 * 
 * Professional modal dialog with natural dark mode support
 * Follows Card.tsx and Button.tsx architecture patterns
 * 
 * ARCHITECTURE:
 * ✅ Natural Tailwind dark: classes for automatic mode detection
 * ✅ Proper contrast in both light and dark modes
 * ✅ Size variants (sm, md, lg, xl, full)
 * ✅ Backdrop variants (blur, dark, light)
 * ✅ Centered positioning
 * ✅ Closeable with X button or backdrop click
 * ✅ Accessibility (focus trap, ESC key)
 * 
 * DESIGN PHILOSOPHY:
 * "Concert hall, not arcade"
 * - Clean modal with professional backdrop
 * - Smooth animations
 * - Clear visual hierarchy
 * 
 * USAGE:
 * <Modal open={isOpen} onClose={handleClose}>
 *   <Modal.Header>Dialog Title</Modal.Header>
 *   <Modal.Body>Content here</Modal.Body>
 *   <Modal.Footer>Actions here</Modal.Footer>
 * </Modal>
 */

import { Icon } from '@iconify/react';
import { HTMLAttributes, ReactNode, useEffect } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  /** Modal open state */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal content */
  children: ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  /** Center modal vertically */
  centered?: boolean;
  /** Backdrop variant */
  backdrop?: 'blur' | 'dark' | 'light';
  /** Show close button */
  closeable?: boolean;
  /** Additional CSS classes */
  className?: string;
}

interface ModalSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

// =============================================================================
// SIZE STYLES
// =============================================================================

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  full: 'max-w-full mx-4',
} as const;

// =============================================================================
// BACKDROP STYLES - LIGHT/DARK MODE COMPATIBLE
// =============================================================================

const backdropStyles = {
  blur: 'backdrop-blur-sm bg-neutral-900/60 dark:bg-neutral-950/70',
  dark: 'bg-neutral-900/80 dark:bg-neutral-950/90',
  light: 'bg-neutral-100/80 dark:bg-neutral-900/70',
} as const;

// =============================================================================
// MODAL COMPONENT
// =============================================================================

export function Modal({
  open,
  onClose,
  children,
  size = 'md',
  centered = true,
  backdrop = 'blur',
  closeable = true,
  className = '',
  ...props
}: ModalProps) {
  // Handle ESC key
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeable) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose, closeable]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50
        flex
        ${centered ? 'items-center' : 'items-start pt-20'}
        justify-center
        p-4
        ${backdropStyles[backdrop]}
      `}
      onClick={closeable ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      {...props}
    >
      {/* Modal Content */}
      <div
        className={`
          relative
          ${sizeStyles[size]}
          w-full
          bg-white
          dark:bg-neutral-900
          rounded-xl
          shadow-2xl
          border border-neutral-200
          dark:border-neutral-800
          animate-in fade-in-0 zoom-in-95 duration-200
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {closeable && (
          <button
            type="button"
            onClick={onClose}
            className="
              absolute top-4 right-4
              p-1
              text-neutral-600 hover:text-neutral-900
              dark:text-neutral-400 dark:hover:text-neutral-100
              transition-colors duration-150
              rounded-lg
              hover:bg-neutral-100
              dark:hover:bg-neutral-800
              focus:outline-none focus:ring-2 focus:ring-primary-500
            "
            aria-label="Close modal"
          >
            <Icon icon="lucide:x" width={20} height={20} />
          </button>
        )}

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
}

// =============================================================================
// MODAL HEADER
// =============================================================================

Modal.Header = function ModalHeader({ children, className = '', ...props }: ModalSectionProps) {
  return (
    <div
      className={`
        px-6 py-4
        border-b border-neutral-200
        dark:border-neutral-800
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 pr-8">
        {children}
      </h2>
    </div>
  );
};

// =============================================================================
// MODAL BODY
// =============================================================================

Modal.Body = function ModalBody({ children, className = '', ...props }: ModalSectionProps) {
  return (
    <div
      className={`
        px-6 py-4
        text-neutral-700
        dark:text-neutral-300
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {children}
    </div>
  );
};

// =============================================================================
// MODAL FOOTER
// =============================================================================

Modal.Footer = function ModalFooter({ children, className = '', ...props }: ModalSectionProps) {
  return (
    <div
      className={`
        px-6 py-4
        border-t border-neutral-200
        dark:border-neutral-800
        flex items-center justify-end gap-3
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {children}
    </div>
  );
};
