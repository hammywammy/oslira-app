// src/features/onboarding/constants/validationSchemas.ts

/**
 * VALIDATION SCHEMAS
 * 
 * Zod schemas for each onboarding step
 * Validates input before proceeding to next step
 */

import { z } from 'zod';

// =============================================================================
// TYPE EXPORTS (for TypeScript usage)
// =============================================================================

export type Industry = 'Technology' | 'Healthcare' | 'Finance' | 'Real Estate' | 'Retail' | 
  'Manufacturing' | 'Consulting' | 'Marketing' | 'Education' | 'Other';

export type CompanySize = '1-10' | '11-50' | '51+';

export type PrimaryObjective = 'lead-generation' | 'sales-automation' | 'market-research' | 'customer-retention';

export type Challenge = 'low-quality-leads' | 'time-consuming' | 'expensive-tools' | 
  'lack-personalization' | 'poor-data-quality' | 'difficult-scaling';

export type TargetCompanySize = 'startup' | 'smb' | 'enterprise';

export type CommunicationChannel = 'email' | 'instagram' | 'sms';

export type BrandVoice = 'professional' | 'friendly' | 'casual';

export type TeamSize = 'just-me' | 'small-team' | 'large-team';

export type CampaignManager = 'myself' | 'sales-team' | 'marketing-team' | 'mixed-team';

// =============================================================================
// STEP 1: PERSONAL IDENTITY
// =============================================================================

export const step1Schema = z.object({
  signature_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .trim(),
});

// =============================================================================
// STEP 2: BUSINESS BASICS
// =============================================================================

export const step2Schema = z.object({
  company_name: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters')
    .trim(),
  
  business_summary: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(500, 'Description must be less than 500 characters')
    .trim(),
  
  industry: z.enum([
    'Technology',
    'Healthcare',
    'Finance',
    'Real Estate',
    'Retail',
    'Manufacturing',
    'Consulting',
    'Marketing',
    'Education',
    'Other',
  ]),
  
  industry_other: z
    .string()
    .max(50, 'Industry must be less than 50 characters')
    .trim()
    .optional(),
  
  company_size: z.enum(['1-10', '11-50', '51+']),
  
  website: z
    .string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),
});

// =============================================================================
// STEP 3: GOALS
// =============================================================================

export const step3Schema = z.object({
  primary_objective: z.enum([
    'lead-generation',
    'sales-automation',
    'market-research',
    'customer-retention',
  ]),
  
  monthly_lead_goal: z
    .number()
    .int()
    .min(1, 'Lead goal must be at least 1')
    .max(10000, 'Lead goal must be less than 10,000'),
});

// =============================================================================
// STEP 4: CHALLENGES (OPTIONAL)
// =============================================================================

export const step4Schema = z.object({
  challenges: z
    .array(z.enum([
      'low-quality-leads',
      'time-consuming',
      'expensive-tools',
      'lack-personalization',
      'poor-data-quality',
      'difficult-scaling',
    ]))
    .optional()
    .default([]),
});

// =============================================================================
// STEP 5: TARGET AUDIENCE
// =============================================================================

export const step5Schema = z.object({
  target_description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Description must be less than 500 characters')
    .trim(),
  
  icp_min_followers: z
    .number()
    .int()
    .min(0, 'Minimum must be 0 or greater'),
  
  icp_max_followers: z
    .number()
    .int()
    .min(0, 'Maximum must be 0 or greater'),
  
  target_company_sizes: z
    .array(z.enum(['startup', 'smb', 'enterprise']))
    .optional()
    .default([]),
}).refine(
  (data) => data.icp_max_followers >= data.icp_min_followers,
  {
    message: 'Maximum followers must be greater than or equal to minimum',
    path: ['icp_max_followers'],
  }
);

// =============================================================================
// STEP 6: COMMUNICATION
// =============================================================================

export const step6Schema = z.object({
  communication_channels: z
    .array(z.enum(['email', 'instagram', 'sms']))
    .min(1, 'Please select at least one channel'),
  
  communication_tone: z.enum(['professional', 'friendly', 'casual']),
});

// =============================================================================
// STEP 7: TEAM
// =============================================================================

export const step7Schema = z.object({
  team_size: z.enum(['just-me', 'small-team', 'large-team']),
  campaign_manager: z.enum(['myself', 'sales-team', 'marketing-team', 'mixed-team']),
});

// =============================================================================
// FULL FORM SCHEMA
// =============================================================================

export const fullFormSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema)
  .merge(step6Schema)
  .merge(step7Schema);

export type FormData = z.infer<typeof fullFormSchema>;
