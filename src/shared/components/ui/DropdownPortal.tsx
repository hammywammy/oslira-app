import { ReactNode, RefObject, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Portal } from './Portal';

interface DropdownPortalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLElement>;
  children: ReactNode;
  width?: number;
  alignment?: 'left' | 'right';
  offset?: number;
}

export function DropdownPortal({
  isOpen,
  onClose,
  triggerRef,
  children,
  width = 256, // 64 * 4 = 256px (w-64 in Tailwind)
  alignment = 'right',
  offset = 8, // gap between trigger and dropdown
}: DropdownPortalProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate position when opening or on window resize
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const calculatePosition = () => {
      if (!triggerRef.current) return;

      const rect = triggerRef.current.getBoundingClientRect();

      const top = rect.bottom + offset;
      let left: number;

      if (alignment === 'right') {
        // Right-aligned: align right edge of dropdown with right edge of trigger
        left = rect.right - width;
      } else {
        // Left-aligned: align left edge of dropdown with left edge of trigger
        left = rect.left;
      }

      // Ensure dropdown doesn't go off-screen
      const maxLeft = window.innerWidth - width - 8; // 8px padding from edge
      const minLeft = 8;
      left = Math.max(minLeft, Math.min(left, maxLeft));

      setPosition({ top, left });
    };

    // Calculate initial position
    calculatePosition();

    // Recalculate on resize
    window.addEventListener('resize', calculatePosition);

    return () => {
      window.removeEventListener('resize', calculatePosition);
    };
  }, [isOpen, triggerRef, width, alignment, offset]);

  // Close on external scroll, resize, or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = (e: Event) => {
      // Don't close if scrolling inside the dropdown
      if (dropdownRef.current && e.target instanceof Node) {
        if (dropdownRef.current.contains(e.target)) {
          return;
        }
      }
      onClose();
    };

    const handleClose = () => onClose();

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Use capture phase to catch all scroll events, but filter internal scrolls
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleClose);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleClose);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for outside click detection */}
            <div
              className="fixed inset-0 z-dropdownBackdrop"
              onClick={onClose}
            />

            {/* Dropdown content */}
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'fixed',
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${width}px`,
              }}
              className="bg-background border border-border rounded-lg shadow-xl z-dropdown"
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
}
