/**
 * ICONIFY ICONS (LUCIDE SET)
 * 
 * Consistent line-style icons for onboarding
 * Using minimal set to maintain clean aesthetic
 */

export const ICONS = {
  // Navigation
  arrowLeft: 'lucide:arrow-left',
  arrowRight: 'lucide:arrow-right',
  
  // Validation
  check: 'lucide:check',
  xClose: 'lucide:x',
  alertCircle: 'lucide:alert-circle',
  checkCircle: 'lucide:check-circle-2',
  
  // Loading
  loader: 'lucide:loader-2',
  
  // Form fields - Step 1
  user: 'lucide:user',
  
  // Form fields - Step 2
  building: 'lucide:building-2',
  briefcase: 'lucide:briefcase',
  globe: 'lucide:globe',
  
  // Form fields - Step 3
  target: 'lucide:target',
  trendingUp: 'lucide:trending-up',
  
  // Form fields - Step 4
  alertTriangle: 'lucide:alert-triangle',
  
  // Form fields - Step 5
  users: 'lucide:users',
  hash: 'lucide:hash',
  
  // Form fields - Step 6
  messageSquare: 'lucide:message-square',
  mail: 'lucide:mail',
  instagram: 'lucide:instagram',
  smartphone: 'lucide:smartphone',
  
  // Form fields - Step 7
  userCog: 'lucide:user-cog',
  
  // Success
  sparkles: 'lucide:sparkles',
  
  // Edit
  edit: 'lucide:edit-2',
} as const;

export type IconName = keyof typeof ICONS;
