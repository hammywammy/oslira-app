/**
 * ONBOARDING TYPES - STREAMLINED
 * 
 * Updated to match 4-step onboarding flow
 * Maps to backend API expectations
 */

// FORM DATA (STREAMLINED - 4 STEPS)
export interface OnboardingFormData {
  // Step 1: Identity
  signature_name: string;

  // Step 2: Business Context
  business_summary: string;
  communication_tone: BrandVoice;

  // Step 3: Target Customer
  target_description: string;
  icp_min_followers: number;
  icp_max_followers: number;
  target_company_sizes: TargetCompanySize[];
}

// ENUMS (MINIMAL)
export type TargetCompanySize = 'startup' | 'smb' | 'enterprise';
export type BrandVoice = 'professional' | 'friendly' | 'casual';

// API PAYLOAD (BACKEND STRUCTURE)
export interface OnboardingSubmitPayload {
  signature_name: string;
  business_name: string; // Extracted from business_summary
  business_summary: string;
  website?: string;
  ideal_customer_profile: {
    business_description: string;
    target_audience: string;
    industry: string; // Extracted from business_summary or default
    icp_min_followers: number;
    icp_max_followers: number;
    brand_voice: string;
  };
  operational_metadata: {
    company_size: string; // Default value
    monthly_lead_goal: number; // Default value
    primary_objective: string; // Default value
    challenges: string[];
    target_company_sizes: string[];
    communication_channels: string[]; // Default: ['instagram']
    communication_tone: string;
    team_size: string; // Default value
    campaign_manager: string; // Default value
  };
}

// API RESPONSE
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
