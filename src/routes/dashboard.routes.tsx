// src/routes/dashboard.routes.tsx
/**
 * DASHBOARD ROUTES
 * 
 * Update this import in your main routes/index.tsx file:
 * Replace the placeholder dashboard route with:
 * 
 * import { DashboardPage } from '@/pages/dashboard/DashboardPage';
 * 
 * {
 *   path: '/dashboard',
 *   element: (
 *     <DomainGuard domain="app">
 *       <ProtectedRoute>
 *         <DashboardPage />
 *       </ProtectedRoute>
 *     </DomainGuard>
 *   ),
 * },
 */

export const dashboardRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    description: 'Main dashboard with leads table',
  },
  {
    path: '/dashboard/leads',
    name: 'Leads',
    description: 'Leads management (alias to main dashboard)',
  },
  {
    path: '/dashboard/analytics',
    name: 'Analytics',
    description: 'Analytics and charts (Phase 6)',
  },
  {
    path: '/dashboard/settings',
    name: 'Settings',
    description: 'User and business settings',
  },
  {
    path: '/dashboard/billing',
    name: 'Billing',
    description: 'Subscription and billing management',
  },
];
