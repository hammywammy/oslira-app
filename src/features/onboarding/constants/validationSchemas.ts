/**
 * VALIDATION SCHEMAS - STREAMLINED 4-STEP ONBOARDING
 * 
 * Step 1: Identity (full_name)
 * Step 2: Business (business_name, business_summary, communication_tone)
 * Step 3: Target Customer (target_description, followers, company_sizes)
 * Step 4: Review
 * 
 * UPDATED: Added business_name to Step 2
 */

import { z } from 'zod';

// TYPE EXPORTS
export type TargetCompanySize = 'startup' | 'smb' | 'enterprise';
export type CommunicationTone = 'professional' | 'friendly' | 'casual';

// STEP 1: IDENTITY
export const step1Schema = z.object({
  full_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
});

// STEP 2: BUSINESS CONTEXT
export const step2Schema = z.object({
  business_name: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .max(20, 'Business name must be less than 20 characters'),
  business_summary: z
    .string()
    .min(50, 'Please provide at least 50 characters')
    .max(750, 'Maximum 750 characters'),
  communication_tone: z.enum(['professional', 'friendly', 'casual'], {
    required_error: 'Please select a communication tone',
  }),
});

// STEP 3: TARGET CUSTOMER
export const step3Schema = z.object({
  target_description: z
    .string()
    .min(50, 'Please provide at least 50 characters')
    .max(750, 'Please keep it under 750 characters')
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

// FULL FORM SCHEMA
export const fullFormSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema);

export type FormData = z.infer<typeof fullFormSchema>;

// API SUBMISSION TYPE
export type OnboardingFormData = FormData;
