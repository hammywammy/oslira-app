/**
 * TAILWIND CSS V4 CONFIGURATION
 * 
 * Extends Tailwind with Oslira design tokens
 * Uses CSS custom properties from theme.css
 */

import tailwindcss from '@tailwindcss/vite';

export default {
  darkMode: 'class', // ← CRITICAL: Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Neutrals (Foundation)
        neutral: {
          0: 'var(--color-neutral-0)',
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        },
        // Primary (Electric Blue - Strategic Accent)
        primary: {
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
        },
        // Secondary (Subtle Purple - Micro-Accent)
        secondary: {
          300: 'var(--color-secondary-300)',
          400: 'var(--color-secondary-400)',
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
        },
        // Semantic States
        success: {
          100: 'var(--color-success-100)',
          200: 'var(--color-success-200)',
          400: 'var(--color-success-400)',
          500: 'var(--color-success-500)',
          600: 'var(--color-success-600)',
          700: 'var(--color-success-700)',
        },
        error: {
          100: 'var(--color-error-100)',
          200: 'var(--color-error-200)',
          400: 'var(--color-error-400)',
          500: 'var(--color-error-500)',
          600: 'var(--color-error-600)',
          700: 'var(--color-error-700)',
        },
        warning: {
          100: 'var(--color-warning-100)',
          200: 'var(--color-warning-200)',
          400: 'var(--color-warning-400)',
          500: 'var(--color-warning-500)',
          600: 'var(--color-warning-600)',
          700: 'var(--color-warning-700)',
        },
        info: {
          100: 'var(--color-info-100)',
          200: 'var(--color-info-200)',
          400: 'var(--color-info-400)',
          500: 'var(--color-info-500)',
          600: 'var(--color-info-600)',
          700: 'var(--color-info-700)',
        },
        // Semantic Aliases
        background: 'var(--bg-primary)',
        foreground: 'var(--text-primary)',
        muted: 'var(--text-tertiary)',
        border: 'var(--border-default)',
      },
      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
        '4xl': 'var(--space-4xl)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        raised: 'var(--shadow-raised)',
        elevated: 'var(--shadow-elevated)',
        overlay: 'var(--shadow-overlay)',
        modal: 'var(--shadow-modal)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
      },
      fontSize: {
        xs: ['var(--font-size-xs)', { lineHeight: '1.333' }],
        sm: ['var(--font-size-sm)', { lineHeight: '1.385' }],
        base: ['var(--font-size-base)', { lineHeight: '1.429' }],
        md: ['var(--font-size-md)', { lineHeight: '1.5' }],
        lg: ['var(--font-size-lg)', { lineHeight: '1.556' }],
        xl: ['var(--font-size-xl)', { lineHeight: '1.4' }],
        '2xl': ['var(--font-size-2xl)', { lineHeight: '1.333' }],
        '3xl': ['var(--font-size-3xl)', { lineHeight: '1.25' }],
        '4xl': ['var(--font-size-4xl)', { lineHeight: '1.167' }],
      },
      fontWeight: {
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
        bold: 'var(--font-weight-bold)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        medium: 'var(--duration-medium)',
        slow: 'var(--duration-slow)',
        slower: 'var(--duration-slower)',
      },
      transitionTimingFunction: {
        default: 'var(--easing-default)',
        out: 'var(--easing-out)',
        in: 'var(--easing-in)',
      },
      maxWidth: {
        narrow: 'var(--container-narrow)',
        default: 'var(--container-default)',
        wide: 'var(--container-wide)',
        full: 'var(--container-full)',
      },
      zIndex: {
        base: 'var(--z-base)',
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        fixed: 'var(--z-fixed)',
        overlay: 'var(--z-overlay)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
      },
    },
  },
  plugins: [tailwindcss],
};
