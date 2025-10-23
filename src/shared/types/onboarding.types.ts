// src/shared/types/onboarding.types.ts

/**
 * ONBOARDING TYPES
 * 
 * Form data types matching backend API expectations
 * Maps to business_profiles table and JSONB columns
 */

// =============================================================================
// FORM DATA
// =============================================================================

export interface OnboardingFormData {
  // Step 1: Personal Identity
  signature_name: string;

  // Step 2: Business Basics
  company_name: string;
  business_summary: string;
  industry: Industry;
  industry_other?: string;
  company_size: CompanySize;
  website?: string;

  // Step 3: Goals
  primary_objective: PrimaryObjective;
  monthly_lead_goal: number;

  // Step 4: Challenges
  challenges: Challenge[];

  // Step 5: Target Audience
  target_description: string;
  icp_min_followers: number;
  icp_max_followers: number;
  target_company_sizes: TargetCompanySize[];

  // Step 6: Communication
  communication_channels: CommunicationChannel[];
  communication_tone: BrandVoice;

  // Step 7: Team
  team_size: TeamSize;
  campaign_manager: CampaignManager;
}

// =============================================================================
// ENUMS
// =============================================================================

export type Industry =
  | 'Technology'
  | 'Healthcare'
  | 'Finance'
  | 'Real Estate'
  | 'Retail'
  | 'Manufacturing'
  | 'Consulting'
  | 'Marketing'
  | 'Education'
  | 'Other';

export type CompanySize = '1-10' | '11-50' | '51+';

export type PrimaryObjective =
  | 'lead-generation'
  | 'sales-automation'
  | 'market-research'
  | 'customer-retention';

export type Challenge =
  | 'low-quality-leads'
  | 'time-consuming'
  | 'expensive-tools'
  | 'lack-personalization'
  | 'poor-data-quality'
  | 'difficult-scaling';

export type TargetCompanySize = 'startup' | 'smb' | 'enterprise';

export type CommunicationChannel = 'email' | 'instagram' | 'sms';

export type BrandVoice = 'professional' | 'friendly' | 'casual';

export type TeamSize = 'just-me' | 'small-team' | 'large-team';

export type CampaignManager = 'myself' | 'sales-team' | 'marketing-team' | 'mixed-team';

// =============================================================================
// API PAYLOAD
// =============================================================================

export interface OnboardingSubmitPayload {
  signature_name: string;
  business_name: string;
  business_summary: string;
  website?: string;
  ideal_customer_profile: {
    business_description: string;
    target_audience: string;
    industry: string;
    icp_min_followers: number;
    icp_max_followers: number;
    brand_voice: string;
  };
  operational_metadata: {
    company_size: string;
    monthly_lead_goal: number;
    primary_objective: string;
    challenges: string[];
    target_company_sizes: string[];
    communication_channels: string[];
    communication_tone: string;
    team_size: string;
    campaign_manager: string;
  };
}

// =============================================================================
// API RESPONSE
// =============================================================================

export interface OnboardingCompleteResponse {
  success: boolean;
  business_profile_id: string;
  access_token: string;
  message: string;
}

export interface GenerationProgressResponse {
  status: 'pending' | 'processing' | 'complete' | 'failed';
  progress: number;
  message: string;
  result?: {
    business_profile_id: string;
    business_one_liner: string;
    business_summary_generated: string;
  };
  error?: string;
}
