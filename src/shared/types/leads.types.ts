// src/shared/types/leads.types.ts
/**
 * LEAD DATA TYPES
 * 
 * Type definitions for lead entities and related data structures
 */

export type Platform = 'instagram';
export type AnalysisType = 'light' | 'deep' | 'xray';
export type AnalysisStatus = 'pending' | 'processing' | 'complete' | 'failed';

export interface Lead {
  id: string;
  account_id: string;
  business_profile_id: string;
  platform: Platform;
  username: string;
  profile_url: string;
  created_at: string;

  // Analysis Results
  analysis_type: AnalysisType | null;
  analysis_status: AnalysisStatus;
  analysis_completed_at: string | null;

  // Scores (0-100)
  overall_score: number | null;
  niche_fit_score: number | null;
  engagement_score: number | null;
  confidence_level: number | null;

  // Basic Profile Data
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  followers_count: number | null;
  following_count: number | null;
  posts_count: number | null;

  // Analysis Results
  summary_text: string | null;
  outreach_message: string | null;
  psychographics: PsychographicsData | null;

  // Metadata
  cache_hit: boolean;
  credits_charged: number;
  run_id: string | null;
}

export interface PsychographicsData {
  disc_profile: {
    dominance: number;
    influence: number;
    steadiness: number;
    conscientiousness: number;
    primary_type: 'D' | 'I' | 'S' | 'C';
  };
  copywriter_profile: {
    is_copywriter: boolean;
    specialization: string | null;
    experience_level: 'beginner' | 'intermediate' | 'expert' | null;
  };
  motivation_drivers: string[];
  communication_style: string;
  recommended_proof_elements: string[];
  outreach_strategy: string;
  hook_style_suggestions: string[];
}

export interface LeadAnalysis {
  id: string;
  lead_id: string;
  analysis_type: AnalysisType;
  overall_score: number;
  niche_fit_score: number;
  engagement_score: number;
  confidence_level: number;
  summary_text: string;
  outreach_message: string | null;
  psychographics: PsychographicsData | null;
  created_at: string;
}
