/**
 * ============================================================================
 * TAILWIND V4 CONFIGURATION - OSLIRA V3.0
 * ============================================================================
 * 
 * ARCHITECTURE:
 * - CSS variables defined in theme.css
 * - Semantic tokens auto-flip via .dark class
 * - Base palette available for special cases
 * 
 * PHILOSOPHY:
 * "Components use semantic names, CSS handles the rest"
 * ============================================================================
 */

export default {
  /**
   * DARK MODE CONFIGURATION
   * 
   * Strategy: 'selector' (modern Tailwind approach)
   * - Enables dark mode when .dark class is on <html> or any parent
   * - Controlled by ThemeProvider via JavaScript
   * - SSR-safe, localStorage-persistent
   */
  darkMode: 'selector',
  
  /**
   * CONTENT PATHS
   * Tell Tailwind where to find class names
   */
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  
  theme: {
    extend: {
      /**
       * SEMANTIC COLORS
       * These auto-flip between light/dark via CSS variables
       * 
       * Usage:
       * - bg-background (white → dark gray)
       * - text-foreground (black → white)
       * - border-border (light gray → medium gray)
       */
      colors: {
        // Semantic tokens (the main interface)
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        card: {
          DEFAULT: 'var(--color-card)',
          foreground: 'var(--color-card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--color-popover)',
          foreground: 'var(--color-popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)',
          foreground: 'var(--color-destructive-foreground)',
        },
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',

        // Base palette (for gradients, data viz, special cases)
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
        'primary-palette': {
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
        },
        'secondary-palette': {
          300: 'var(--color-secondary-300)',
          400: 'var(--color-secondary-400)',
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
        },
        success: {
          100: 'var(--color-success-100)',
          500: 'var(--color-success-500)',
          700: 'var(--color-success-700)',
        },
        error: {
          100: 'var(--color-error-100)',
          500: 'var(--color-error-500)',
          700: 'var(--color-error-700)',
        },
        warning: {
          100: 'var(--color-warning-100)',
          500: 'var(--color-warning-500)',
          700: 'var(--color-warning-700)',
        },
        info: {
          100: 'var(--color-info-100)',
          500: 'var(--color-info-500)',
          700: 'var(--color-info-700)',
        },

        // Data visualization palette
        'data-blue': 'var(--color-data-blue)',
        'data-teal': 'var(--color-data-teal)',
        'data-purple': 'var(--color-data-purple)',
        'data-green': 'var(--color-data-green)',
        'data-orange': 'var(--color-data-orange)',
        'data-red': 'var(--color-data-red)',
        'data-gray': 'var(--color-data-gray)',

        // Tier indicators
        'tier-free': 'var(--color-tier-free)',
        'tier-pro': 'var(--color-tier-pro)',
        'tier-agency': 'var(--color-tier-agency)',
        'tier-enterprise': 'var(--color-tier-enterprise)',

        // Lead score heatmap
        'lead-cold': 'var(--color-lead-cold)',
        'lead-warm': 'var(--color-lead-warm)',
        'lead-hot': 'var(--color-lead-hot)',
        'lead-qualified': 'var(--color-lead-qualified)',

        // Analysis type badges
        'analysis-light': 'var(--color-analysis-light)',
        'analysis-deep': 'var(--color-analysis-deep)',
        'analysis-xray': 'var(--color-analysis-xray)',
      },

      /**
       * BORDER RADIUS
       * Using CSS variables for consistency
       */
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },

      /**
       * SPACING
       * Consistent spacing scale
       */
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

      /**
       * FONT FAMILY
       */
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },

      /**
       * FONT SIZE
       */
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        base: 'var(--font-size-base)',
        lg: 'var(--font-size-lg)',
        xl: 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
      },

      /**
       * BOX SHADOW
       */
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },

      /**
       * ANIMATION DURATION
       */
      transitionDuration: {
        instant: 'var(--duration-instant)',
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
        slower: 'var(--duration-slower)',
      },

      /**
       * Z-INDEX - Centralized layering system
       * Defined in src/styles/zIndex.ts
       * Each layer has 100 points spacing for future additions
       */
      zIndex: {
        // Background layer
        background: 'var(--z-background)',

        // Base layer
        base: 'var(--z-base)',
        content: 'var(--z-content)',
        card: 'var(--z-card)',

        // Sticky layer
        sticky: 'var(--z-sticky)',
        stickyTable: 'var(--z-sticky-table)',
        stickyTableColumn: 'var(--z-sticky-table-column)',

        // Fixed navigation layer
        fixedNav: 'var(--z-fixed-nav)',
        pagination: 'var(--z-pagination)',
        sidebar: 'var(--z-sidebar)',
        hotbar: 'var(--z-hotbar)',
        topBar: 'var(--z-top-bar)',
        topBarBorder: 'var(--z-top-bar-border)',

        // Dropdown layer
        dropdown: 'var(--z-dropdown)',
        dropdownBackdrop: 'var(--z-dropdown-backdrop)',
        popover: 'var(--z-popover)',
        tooltip: 'var(--z-tooltip)',

        // Overlay layer
        overlay: 'var(--z-overlay)',
        modalBackdrop: 'var(--z-modal-backdrop)',
        drawerBackdrop: 'var(--z-drawer-backdrop)',
        loadingOverlay: 'var(--z-loading-overlay)',

        // Modal layer
        modal: 'var(--z-modal)',
        modalContent: 'var(--z-modal-content)',
        drawer: 'var(--z-drawer)',
        fullscreen: 'var(--z-fullscreen)',

        // Toast layer (highest)
        toast: 'var(--z-toast)',
        alert: 'var(--z-alert)',

        // Showcase/dev tools
        showcaseNav: 'var(--z-showcase-nav)',
        showcaseBackdrop: 'var(--z-showcase-backdrop)',
      },
    },
  },
  
  plugins: [],
};
