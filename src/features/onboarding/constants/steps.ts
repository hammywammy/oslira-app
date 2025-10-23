// src/features/onboarding/constants/steps.ts

/**
 * STEP METADATA
 * 
 * Configuration for 8 onboarding steps
 */

export interface StepMetadata {
  id: number;
  title: string;
  description: string;
  fields: string[];
}

export const STEPS: StepMetadata[] = [
  {
    id: 1,
    title: 'Welcome to Oslira',
    description: 'Let\'s start with your name',
    fields: ['signature_name'],
  },
  {
    id: 2,
    title: 'Tell us about your business',
    description: 'Help us understand what you do',
    fields: [
      'company_name',
      'business_summary',
      'industry',
      'company_size',
      'website',
    ],
  },
  {
    id: 3,
    title: 'What are your goals?',
    description: 'Define what success looks like',
    fields: ['primary_objective', 'monthly_lead_goal'],
  },
  {
    id: 4,
    title: 'What challenges do you face?',
    description: 'Tell us what you\'re struggling with',
    fields: ['challenges'],
  },
  {
    id: 5,
    title: 'Who is your ideal customer?',
    description: 'Describe your target audience',
    fields: [
      'target_description',
      'icp_min_followers',
      'icp_max_followers',
      'target_company_sizes',
    ],
  },
  {
    id: 6,
    title: 'How do you communicate?',
    description: 'Choose your outreach style',
    fields: ['communication_channels', 'communication_tone'],
  },
  {
    id: 7,
    title: 'Tell us about your team',
    description: 'Help us tailor your experience',
    fields: ['team_size', 'campaign_manager'],
  },
  {
    id: 8,
    title: 'Review & confirm',
    description: 'Make sure everything looks good',
    fields: [],
  },
];

export const TOTAL_STEPS = STEPS.length;
