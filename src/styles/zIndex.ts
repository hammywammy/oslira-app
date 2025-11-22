/**
 * CENTRALIZED Z-INDEX CONFIGURATION
 *
 * This file defines all z-index values used throughout the application.
 * Each layer has 100 points of spacing to allow for future additions.
 *
 * LAYERING HIERARCHY (bottom to top):
 * ====================================
 *
 * 1. Background (-10 to -1): Elements that should be behind all content
 * 2. Base (0 to 99): Normal document flow and relative positioning within components
 * 3. Sticky (100 to 199): Sticky table headers, sticky navigation elements
 * 4. Fixed Navigation (300 to 399): Fixed headers, sidebars, toolbars
 * 5. Dropdowns (400 to 499): Dropdown menus, popovers, tooltips
 * 6. Overlays (500 to 599): Modal backdrops, drawer backdrops, loading overlays
 * 7. Modals (600 to 699): Modal dialogs, drawers, side panels
 * 8. Toasts (700 to 799): Notifications, toasts, alerts (highest priority)
 */

export const zIndex = {
  // ============================================================================
  // BACKGROUND LAYER (-10 to -1)
  // ============================================================================
  background: -10,        // Background decorative elements (gradients, patterns)

  // ============================================================================
  // BASE LAYER (0 to 99)
  // ============================================================================
  base: 0,                // Default layer
  content: 10,            // Content that needs to be above base (text over backgrounds)
  card: 20,               // Cards and elevated content

  // ============================================================================
  // STICKY LAYER (100 to 199)
  // ============================================================================
  sticky: 100,            // Base sticky elements
  stickyTable: 110,       // Sticky table headers
  stickyTableColumn: 120, // Sticky table columns (needs to be above headers)

  // ============================================================================
  // FIXED NAVIGATION LAYER (300 to 399)
  // ============================================================================
  fixedNav: 350,          // Base fixed navigation
  pagination: 305,        // Table pagination (below other nav elements)
  sidebar: 310,           // Application sidebar
  hotbar: 315,            // Dashboard hotbar / secondary toolbar
  topBar: 330,            // Top navigation bar (HIGHEST - dropdowns must show above hotbar)
  topBarBorder: 331,      // Border line above TopBar (needs to be on top of TopBar)

  // ============================================================================
  // DROPDOWN LAYER (400 to 499)
  // ============================================================================
  dropdown: 400,          // Base dropdown menus
  dropdownBackdrop: 390,  // Invisible backdrop for closing dropdowns (below dropdown)
  popover: 410,           // Popovers
  tooltip: 420,           // Tooltips (highest in dropdown layer)

  // ============================================================================
  // OVERLAY LAYER (500 to 599)
  // ============================================================================
  overlay: 500,           // Base overlay/backdrop
  modalBackdrop: 510,     // Modal backdrops
  drawerBackdrop: 520,    // Drawer/side panel backdrops
  loadingOverlay: 530,    // Loading overlays

  // ============================================================================
  // MODAL LAYER (600 to 699)
  // ============================================================================
  modal: 600,             // Base modal dialogs
  modalContent: 610,      // Modal content (slightly above modal container)
  drawer: 620,            // Side drawers/panels
  fullscreen: 630,        // Fullscreen overlays

  // ============================================================================
  // TOAST LAYER (700 to 799) - HIGHEST PRIORITY
  // ============================================================================
  toast: 700,             // Toast notifications
  alert: 710,             // Critical alerts

  // ============================================================================
  // SHOWCASE/DEV TOOLS (for demo pages only, can overlap with app UI)
  // ============================================================================
  showcaseNav: 650,       // ShowcaseNav component (between modal and toast)
  showcaseBackdrop: 640,  // ShowcaseNav backdrop
} as const;

// Type helper for TypeScript
export type ZIndex = typeof zIndex[keyof typeof zIndex];

/**
 * Helper function to get Tailwind z-index class name
 * Usage: getZIndexClass('modal') => 'z-[600]'
 */
export function getZIndexClass(layer: keyof typeof zIndex): string {
  return `z-[${zIndex[layer]}]`;
}

/**
 * Helper function to get inline style z-index value
 * Usage: getZIndexStyle('modal') => { zIndex: 600 }
 */
export function getZIndexStyle(layer: keyof typeof zIndex): { zIndex: number } {
  return { zIndex: zIndex[layer] };
}

// Export individual values for convenience
export const {
  background,
  base,
  content,
  card,
  sticky,
  stickyTable,
  stickyTableColumn,
  fixedNav,
  sidebar,
  topBar,
  topBarBorder,
  hotbar,
  pagination,
  dropdown,
  dropdownBackdrop,
  popover,
  tooltip,
  overlay,
  modalBackdrop,
  drawerBackdrop,
  loadingOverlay,
  modal,
  modalContent,
  drawer,
  fullscreen,
  toast,
  alert,
  showcaseNav,
  showcaseBackdrop,
} = zIndex;
