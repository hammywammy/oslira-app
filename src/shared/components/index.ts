// src/shared/components/index.ts

/**
 * SHARED COMPONENTS - BARREL EXPORT
 * 
 * Centralized export for all shared components.
 * Enables clean imports across the application.
 * 
 * USAGE:
 * import { Sidebar, Tooltip, Button, Badge } from '@/shared/components';
 */

// Layout Components
export { Sidebar } from './layout/Sidebar';

// UI Components
export { Tooltip } from './ui/Tooltip';
export { Button } from './ui/Button';
export { Badge } from './ui/Badge';
export { Input } from './ui/Input';

// Add more shared components as they're created
// export { Modal } from './ui/Modal';
// export { Card } from './ui/Card';
