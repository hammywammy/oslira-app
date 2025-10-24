// src/features/onboarding/constants/validationSchemas.ts

/**
 * VALIDATION SCHEMAS
 * 
 * Zod schemas for each onboarding step
 * Validates input before proceeding to next step
 * 
 * FIXED: Includes monthly_lead_goal in step3Schema
 * FIXED: Step 5 no longer uses .refine() to maintain .shape property access
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
    .min(20, 'Description must be at least 20 characters')
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
    .max(100)
    .optional(),
  
  website: z
    .union([
      z.string().url('Must be a valid URL'),
      z.literal(''),
    ])
    .optional(),
  
  company_size: z.enum(['1-10', '11-50', '51+']),
  
  employees_count: z
    .number()
    .int()
    .min(1, 'Must have at least 1 employee')
    .optional(),
});

// =============================================================================
// STEP 3: GOALS
// ✅ FIXED: Added monthly_lead_goal field
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
// STEP 4: CHALLENGES
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
    .min(1, 'Please select at least one challenge'),
});

// =============================================================================
// STEP 5: TARGET AUDIENCE
// ✅ FIXED: No .refine() - cross-field validation handled in OnboardingPage
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
});

// Note: The validation "max >= min" is now handled in OnboardingPage.tsx
// This keeps step5Schema as a pure ZodObject with accessible .shape property

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

// =============================================================================
// API SUBMISSION TYPE (same as FormData)
// =============================================================================

export type OnboardingFormData = FormData;
