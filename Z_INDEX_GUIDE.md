# Z-Index System Documentation

## Overview

This project uses a centralized z-index system with **100-point spacing** between each layer. This provides room for future additions while maintaining a clear visual hierarchy.

## Configuration Files

1. **`src/styles/zIndex.ts`** - TypeScript constants and helper functions
2. **`src/styles/theme.css`** - CSS custom properties
3. **`tailwind.config.js`** - Tailwind utility classes

## Layer Hierarchy (Bottom to Top)

```
Background Layer    -10 to -1     Background decorative elements
Base Layer          0 to 99       Normal content flow & relative positioning
Sticky Layer        100 to 199    Sticky table headers & columns
Fixed Nav Layer     300 to 399    Fixed headers, sidebars, toolbars
Dropdown Layer      400 to 499    Dropdowns, popovers, tooltips
Overlay Layer       500 to 599    Modal backdrops & loading overlays
Modal Layer         600 to 699    Modals, drawers, side panels
Toast Layer         700 to 799    Notifications & alerts (HIGHEST)
Showcase Layer      640 to 650    Dev tools (between overlay & modal)
```

## Defined Z-Index Values

### Background Layer (-10 to -1)
- **`z-background` (-10)**: Background patterns, gradients (OnboardingShell)

### Base Layer (0 to 99)
- **`z-base` (0)**: Default document flow
- **`z-content` (10)**: Content over backgrounds (decorative text overlays)
- **`z-card` (20)**: Elevated cards

### Sticky Layer (100 to 199)
- **`z-sticky` (100)**: Base sticky elements
- **`z-stickyTable` (110)**: Sticky table headers & columns
- **`z-stickyTableColumn` (120)**: Intersection of sticky header + column (HIGHEST in table)

### Fixed Navigation Layer (300 to 399)
- **`z-fixedNav` (300)**: Base fixed navigation (Header, MarketingHeader)
- **`z-pagination` (305)**: Table pagination
- **`z-sidebar` (310)**: Application sidebar
- **`z-topBar` (320)**: Top navigation bar
- **`z-topBarBorder` (321)**: Border line above TopBar
- **`z-hotbar` (330)**: Dashboard hotbar / secondary toolbar

### Dropdown Layer (400 to 499)
- **`z-dropdownBackdrop` (390)**: Invisible backdrop for closing dropdowns
- **`z-dropdown` (400)**: Dropdown menus (TopBar, Sidebar, Header)
- **`z-popover` (410)**: Popovers
- **`z-tooltip` (420)**: Tooltips (HIGHEST in dropdown layer)

### Overlay Layer (500 to 599)
- **`z-overlay` (500)**: Base overlay/backdrop
- **`z-modalBackdrop` (510)**: Modal backdrops
- **`z-drawerBackdrop` (520)**: Drawer/side panel backdrops
- **`z-loadingOverlay` (530)**: Loading overlays

### Modal Layer (600 to 699)
- **`z-modal` (600)**: Modal dialogs
- **`z-modalContent` (610)**: Modal content (slightly above container)
- **`z-drawer` (620)**: Side drawers/panels
- **`z-fullscreen` (630)**: Fullscreen overlays

### Toast Layer (700 to 799)
- **`z-toast` (700)**: Toast notifications
- **`z-alert` (710)**: Critical alerts

### Showcase/Dev Tools (640 to 650)
- **`z-showcaseBackdrop` (640)**: ShowcaseNav backdrop
- **`z-showcaseNav` (650)**: ShowcaseNav component

## Usage

### In TypeScript/TSX

```tsx
import { zIndex, getZIndexClass, getZIndexStyle } from '@/styles/zIndex';

// Use Tailwind class
<div className="fixed inset-0 z-modal">

// Use inline style
<div style={getZIndexStyle('modal')}>

// Use constant
<div style={{ zIndex: zIndex.modal }}>
```

### In Tailwind Classes

```tsx
// Preferred method
<div className="z-topBar">
<div className="z-dropdown">
<div className="z-modal">
```

### Component Examples

#### Fixed Navigation
```tsx
// TopBar
<header className="fixed top-0 z-topBar">
<div className="fixed top-0 z-topBarBorder" /> // Border on top

// Sidebar
<aside className="fixed left-0 z-sidebar">

// Hotbar
<div className="fixed top-14 z-hotbar">

// Pagination
<div className="fixed bottom-0 z-pagination">
```

#### Dropdowns
```tsx
<>
  {/* Backdrop */}
  <div className="fixed inset-0 z-dropdownBackdrop" onClick={close} />

  {/* Menu */}
  <div className="absolute z-dropdown">
    {/* Menu items */}
  </div>
</>
```

#### Modals
```tsx
<>
  {/* Modal container with backdrop */}
  <div className="fixed inset-0 z-modal backdrop-blur">
    {/* Modal content */}
    <div className="relative">
      <button className="absolute z-content">Close</button> // Relative to modal
      {children}
    </div>
  </div>
</>
```

#### Sticky Tables
```tsx
<table>
  <thead className="sticky top-0 z-stickyTable">
    <tr>
      {/* Intersection needs higher z-index */}
      <th className="sticky left-0 z-stickyTableColumn">Checkbox</th>
      <th>Column</th>
      <th className="sticky right-0 z-stickyTableColumn">Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="sticky left-0 z-stickyTable">...</td>
      <td>...</td>
      <td className="sticky right-0 z-stickyTable">...</td>
    </tr>
  </tbody>
</table>
```

#### Tooltips
```tsx
<div className="relative group">
  <button>Hover me</button>
  <div className="absolute z-tooltip opacity-0 group-hover:opacity-100">
    Tooltip text
  </div>
</div>
```

## Component Z-Index Reference

### Core Layout
- **TopBar** (src/shared/components/layout/TopBar.tsx)
  - Border: `z-topBarBorder` (321)
  - Main: `z-topBar` (320)
  - Dropdown backdrops: `z-dropdownBackdrop` (390)
  - Dropdown menus: `z-dropdown` (400)

- **Sidebar** (src/shared/components/layout/Sidebar.tsx)
  - Sidebar: `z-sidebar` (310)
  - Tooltips: `z-tooltip` (420)
  - User dropdown backdrop: `z-dropdownBackdrop` (390)
  - User dropdown menu: `z-dropdown` (400)

### Dashboard Components
- **TableViewLayout** (src/features/dashboard/layout/TableViewLayout.tsx)
  - Hotbar: `z-hotbar` (330)
  - Pagination: `z-pagination` (305)

- **LeadsTable** (src/features/dashboard/components/LeadsTable/LeadsTable.tsx)
  - Header row: `z-stickyTable` (110)
  - Sticky columns: `z-stickyTable` (110)
  - Header + column intersection: `z-stickyTableColumn` (120)

### UI Components
- **Modal** (src/shared/components/ui/Modal.tsx)
  - Container: `z-modal` (600)
  - Close button: `z-content` (10) - relative to modal

- **Tooltip** (src/shared/components/ui/Tooltip.tsx)
  - Tooltip: `z-tooltip` (420)

### Marketing/Onboarding
- **MarketingHeader** (src/features/homepage/components/MarketingHeader.tsx)
  - Header: `z-fixedNav` (300)
  - Mobile menu: `z-dropdown` (400)

- **ProgressBar** (src/features/onboarding/components/ProgressBar.tsx)
  - Progress bar: `z-fixedNav` (300)

- **NavigationBar** (src/features/onboarding/components/NavigationBar.tsx)
  - Nav bar: `z-fixedNav` (300)

### Dev Tools
- **ShowcaseNav** (src/shared/components/dev/ShowcaseNav.tsx)
  - Button: `z-showcaseNav` (650)
  - Backdrop: `z-showcaseBackdrop` (640)
  - Panel: `z-showcaseNav` (650)

- **ThemeToggle** (src/core/theme/ThemeToggle.tsx)
  - Fixed button: `z-fixedNav` (300)

## Best Practices

1. **Always use named constants** - Never hardcode z-index values
2. **Use semantic layer names** - Choose the appropriate layer for your component's purpose
3. **100-point spacing** - Provides room for 99 additions between each layer
4. **Relative positioning within components** - Use z-base/content/card for internal layering
5. **Modals above everything (except toasts)** - Modals at 600, toasts at 700+
6. **Dropdowns above fixed nav** - Dropdowns at 400, fixed nav at 300
7. **Sticky tables use their own layer** - 100-120 range for table sticky elements

## Adding New Z-Index Values

When adding a new z-index value:

1. **Choose the appropriate layer** based on component purpose
2. **Update all three files**:
   - `src/styles/zIndex.ts` - Add constant
   - `src/styles/theme.css` - Add CSS variable
   - `tailwind.config.js` - Add utility class
3. **Use increments within the layer range**
   - Example: New dropdown variant → 405, 410, 415...
4. **Document the new value** in this guide

## Troubleshooting

### Dropdown Hidden Behind Modal
✅ **Solution**: Dropdowns (400) are below modals (600). If dropdown needs to show in modal, render it inside the modal content or increase dropdown z-index to z-modalContent (610+).

### Tooltip Hidden Behind Navigation
✅ **Solution**: Tooltips (420) are above fixed nav (300). Check if tooltip is being rendered inside a container with lower z-index.

### Sticky Table Headers Not Stacking Correctly
✅ **Solution**: Use the 3-tier system:
- Regular cells: no z-index
- Sticky columns/headers: `z-stickyTable` (110)
- Sticky header + column intersection: `z-stickyTableColumn` (120)

### Modal Shows Behind Fixed Navigation
❌ **Problem**: Check if modal has correct z-index. Modals (600) should be above all navigation (300s).

## Migration Checklist

When converting existing components:

- [ ] Identify current z-index values
- [ ] Map to appropriate layer
- [ ] Replace hardcoded values with Tailwind classes
- [ ] Test stacking context
- [ ] Update component documentation
- [ ] Remove any `z-[arbitrary]` values
- [ ] Verify no conflicts with other components

---

**Last Updated**: 2025-11-21
**Version**: 1.0
