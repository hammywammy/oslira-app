/**
 * ANNOUNCEMENTS CONFIGURATION
 *
 * Hardcoded announcements that appear in the notification system.
 * Each announcement must have a unique ID (used for tracking dismissed state).
 *
 * FIELDS:
 * - id: Unique identifier (used for localStorage tracking)
 * - type: 'info' | 'success' | 'warning' | 'error' (affects styling)
 * - title: Short headline
 * - message: Detailed description
 * - actionLabel: (Optional) Text for the action button
 * - actionUrl: (Optional) URL to navigate to when action is clicked
 * - createdAt: ISO date string (used for sorting)
 */

export interface Announcement {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  actionLabel?: string;
  actionUrl?: string;
  createdAt: string;
}

export const announcements: Announcement[] = [
  {
    id: 'welcome-2024-11',
    type: 'success',
    title: 'Welcome to Oslira!',
    message: 'Thanks for joining! Explore our dashboard to start analyzing your leads and growing your business.',
    actionLabel: 'Get Started',
    actionUrl: '/dashboard',
    createdAt: '2024-11-15T10:00:00Z',
  },
  {
    id: 'new-feature-bulk-upload',
    type: 'info',
    title: 'New Feature: Bulk Upload',
    message: 'You can now upload multiple leads at once using our new bulk upload feature. Save time and analyze leads faster!',
    actionLabel: 'Try It Now',
    actionUrl: '/dashboard',
    createdAt: '2024-11-18T14:30:00Z',
  },
  {
    id: 'credit-reminder',
    type: 'warning',
    title: 'Credits Running Low',
    message: 'You have 10 credits remaining. Consider upgrading your plan to continue analyzing leads without interruption.',
    actionLabel: 'View Plans',
    actionUrl: '/settings?tab=billing',
    createdAt: '2024-11-20T09:00:00Z',
  },
  {
    id: 'maintenance-scheduled',
    type: 'info',
    title: 'Scheduled Maintenance',
    message: 'We\'ll be performing system maintenance on Nov 25th from 2-4 AM EST. During this time, some features may be temporarily unavailable.',
    createdAt: '2024-11-21T08:00:00Z',
  },
  {
    id: 'ai-improvements',
    type: 'success',
    title: 'Enhanced AI Analysis',
    message: 'Our AI models have been upgraded! You\'ll now get even more accurate insights and recommendations for your leads.',
    actionLabel: 'Learn More',
    actionUrl: '/dashboard',
    createdAt: '2024-11-19T16:00:00Z',
  },
];
