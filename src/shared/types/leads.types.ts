// src/shared/types/leads.types.ts
/**
 * LEAD DATA TYPES
 * 
 * Type definitions for lead entities and related data structures
 */

export type Platform = 'instagram';
export type AnalysisType = 'light' | 'deep' | 'xray';
export type AnalysisStatus = 'pending' | 'processing' | 'complete' | 'failed';

/**
 * Lead entity from database
 *
 * Maps directly to the backend API response from GET /api/leads
 * Fields match the database schema (leads + lead_analyses tables)
 */
export interface Lead {
  // Primary lead data (from leads table)
  id: string;
  account_id: string;
  business_profile_id: string | null;
  username: string;
  display_name: string | null;
  profile_pic_url: string | null;
  profile_url: string | null;
  follower_count: number | null;
  following_count: number | null;
  post_count: number | null;
  platform: Platform | null;
  created_at: string;
  updated_at: string;

  // Analysis data (from lead_analyses table - null if not analyzed)
  analysis_type: AnalysisType | null;
  analysis_status: AnalysisStatus | null;
  analysis_completed_at: string | null;
  overall_score: number | null;
  summary: string | null;
  confidence: number | null;

  // Profile metadata
  is_verified?: boolean;
  is_business?: boolean;
  external_urls?: ExternalLink[];
}

/**
 * External link from lead's profile
 */
export interface ExternalLink {
  url: string;
  title?: string;
  link_type?: string;
}
