/**
 * SWITCH COMPONENT - PRODUCTION GRADE V2.0
 * 
 * Professional toggle switch with natural dark mode support
 * Follows Card.tsx and Button.tsx architecture patterns
 * 
 * ARCHITECTURE:
 * ✅ Natural Tailwind dark: classes for automatic mode detection
 * ✅ Proper contrast in both light and dark modes
 * ✅ Smooth sliding animation
 * ✅ Size variants (md, lg)
 * ✅ Full accessibility support
 * 
 * DESIGN PHILOSOPHY:
 * "Concert hall, not arcade"
 * - Clean toggle with subtle motion
 * - Electric blue when active
 * - Professional slide animation
 * 
 * USAGE:
 * <Switch checked={value} onChange={handler}>
 *   Enable notifications
 * </Switch>
 * <Switch size="lg" disabled />
 */

import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Size variant */
  size?: 'md' | 'lg';
  /** Label content (rendered next to switch) */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

// SIZE STYLES
const sizeStyles = {
  md: {
    track: 'w-11 h-6',
    thumb: 'w-5 h-5',
    thumbTranslate: 'translate-x-5',
  },
  lg: {
    track: 'w-14 h-7',
    thumb: 'w-6 h-6',
    thumbTranslate: 'translate-x-7',
  },
} as const;

const labelTextSize = {
  md: 'text-sm',
  lg: 'text-base',
} as const;

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      size = 'md',
      disabled = false,
      checked = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const { track, thumb, thumbTranslate } = sizeStyles[size];

    return (
      <label
        className={`
          inline-flex items-center gap-3
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${className}
        `}
      >
        {/* Hidden Native Checkbox */}
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="sr-only"
          role="switch"
          aria-checked={checked}
          {...props}
        />

        {/* Switch Track */}
        <span
          className={`
            ${track}
            relative inline-flex items-center
            rounded-full
            transition-colors duration-200
            ${
              checked
                ? `
                  bg-primary-500
                  dark:bg-primary-500
                `
                : `
                  bg-neutral-300
                  dark:bg-neutral-700
                `
            }
            ${
              !disabled && !checked
                ? `
                  hover:bg-neutral-400
                  dark:hover:bg-neutral-600
                `
                : ''
            }
          `}
        >
          {/* Switch Thumb */}
          <span
            className={`
              ${thumb}
              inline-block
              rounded-full
              bg-white
              shadow-sm
              transition-transform duration-200
              transform
              ${checked ? thumbTranslate : 'translate-x-0.5'}
            `}
            aria-hidden="true"
          />
        </span>

        {/* Label Text */}
        {children && (
          <span
            className={`
              ${labelTextSize[size]}
              text-neutral-900
              dark:text-neutral-100
              select-none
            `}
          >
            {children}
          </span>
        )}
      </label>
    );
  }
);

Switch.displayName = 'Switch';
