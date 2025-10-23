// src/features/onboarding/constants/validationSchemas.ts

/**
 * ZOD VALIDATION SCHEMAS
 * 
 * Client-side validation matching backend expectations
 */

import { z } from 'zod';

// =============================================================================
// STEP 1: PERSONAL IDENTITY
// =============================================================================

export const step1Schema = z.object({
  signature_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
});

// =============================================================================
// STEP 2: BUSINESS BASICS
// =============================================================================

export const step2Schema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  business_summary: z
    .string()
    .min(50, 'Please provide at least 50 characters')
    .max(500, 'Please keep it under 500 characters'),
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
  industry_other: z.string().max(30).optional(),
  company_size: z.enum(['1-10', '11-50', '51+']),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
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
    .min(1, 'Must be at least 1')
    .max(10000, 'Must be less than 10,000'),
});

// =============================================================================
// STEP 4: CHALLENGES
// =============================================================================

export const step4Schema = z.object({
  challenges: z
    .array(
      z.enum([
        'low-quality-leads',
        'time-consuming',
        'expensive-tools',
        'lack-personalization',
        'poor-data-quality',
        'difficult-scaling',
      ])
    )
    .optional()
    .default([]),
});

// =============================================================================
// STEP 5: TARGET AUDIENCE
// =============================================================================

export const step5Schema = z.object({
  target_description: z
    .string()
    .min(20, 'Please provide at least 20 characters')
    .max(500, 'Please keep it under 500 characters'),
  icp_min_followers: z.number().int().min(0, 'Must be at least 0'),
  icp_max_followers: z.number().int().min(0, 'Must be at least 0'),
  target_company_sizes: z
    .array(z.enum(['startup', 'smb', 'enterprise']))
    .optional()
    .default([]),
}).refine((data) => data.icp_max_followers >= data.icp_min_followers, {
  message: 'Maximum must be greater than or equal to minimum',
  path: ['icp_max_followers'],
});

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
