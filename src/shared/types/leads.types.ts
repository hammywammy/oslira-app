// src/shared/types/leads.types.ts
/**
 * LEAD DATA TYPES - COMPLETE VERSION
 *
 * Includes all 80+ fields from backend analysis pipeline
 */

export type Platform = 'instagram';
export type AnalysisType = 'light' | 'deep' | 'xray';
export type AnalysisStatus = 'pending' | 'processing' | 'complete' | 'failed';
export type LeadTier = 'hot' | 'warm' | 'cold';

/**
 * Complete Lead entity with all analysis data
 * Maps to backend API response from GET /api/leads
 */
export interface Lead {
  // ============================================================================
  // PRIMARY LEAD DATA (from leads table)
  // ============================================================================
  id: string;
  account_id: string;
  business_profile_id: string | null;
  username: string;
  display_name: string | null;
  profile_pic_url: string | null;
  profile_url: string | null;
  platform: Platform | null;
  created_at: string;
  updated_at: string;

  // ============================================================================
  // BASIC PROFILE METRICS
  // ============================================================================
  follower_count: number | null;
  following_count: number | null;
  post_count: number | null;
  is_verified?: boolean;
  is_business?: boolean;

  // ============================================================================
  // ANALYSIS METADATA (from lead_analyses table)
  // ============================================================================
  analysis_type: AnalysisType | null;
  analysis_status: AnalysisStatus | null;
  analysis_completed_at: string | null;

  // ============================================================================
  // AI ANALYSIS SUMMARY (legacy fields - kept for backward compatibility)
  // ============================================================================
  overall_score: number | null;
  summary: string | null;

  // ============================================================================
  // EXTERNAL LINKS
  // ============================================================================
  external_urls?: ExternalLink[];

  // ============================================================================
  // CALCULATED METRICS (JSONB field from backend)
  // ============================================================================
  calculated_metrics?: CalculatedMetrics;

  // ============================================================================
  // AI RESPONSE (JSONB field from backend - enhanced AI analysis)
  // ============================================================================
  ai_response?: AIResponse;

  // ============================================================================
  // EXTRACTED DATA (JSONB field from backend - raw metrics)
  // ============================================================================
  extracted_data?: ExtractedData;
}

/**
 * External link from profile
 */
export interface ExternalLink {
  url: string;
  title?: string;
  link_type?: string;
}

/**
 * External link detail with type
 */
export interface ExternalUrlDetail {
  url: string;
  title?: string;
  linkType?: string;
}

/**
 * Calculated metrics from backend analysis (JSONB field)
 * Streamlined to include only actively used metrics
 */
export interface CalculatedMetrics {
  // Post counts
  posts_count?: number;
  recent_posts_sampled?: number;

  // Authority
  authority_ratio?: number;
  authority_ratio_raw?: number;

  // Engagement metrics
  avg_likes_per_post?: number;
  avg_comments_per_post?: number;
  engagement_rate?: number;
  engagement_consistency?: number;
  engagement_std_dev?: number;
  comment_to_like_ratio?: number;

  // Format distribution
  video_post_count?: number;
  image_rate?: number;
  reels_rate?: number;
  carousel_rate?: number;
  format_diversity?: number;
  dominant_format?: string;

  // Video metrics
  total_video_views?: number | null;
  avg_video_views?: number | null;

  // Content metrics
  unique_hashtag_count?: number;
  avg_hashtags_per_post?: number;
  top_hashtags?: Array<{ hashtag: string; count: number }>;
  top_mentions?: Array<{ username: string; count: number }>;
  avg_caption_length?: number;
  location_tagging_rate?: number;
  comments_enabled_rate?: number;

  // Posting behavior
  posting_frequency?: number;
  posting_consistency?: number;
  days_since_last_post?: number;
  avg_days_between_posts?: number;

  // Viral content
  viral_post_rate?: number;
  recent_viral_post_count?: number;

  // Composite scores
  profile_health_score?: number;
  engagement_health?: number;
  content_sophistication?: number;
  account_maturity?: number;

  // Risk analysis
  fake_follower_risk_score?: number;
  fake_follower_interpretation?: string;
  warnings?: string[];

  // Gap detection flags
  engagement_gap?: boolean;
  content_gap?: boolean;
  conversion_gap?: boolean;
  platform_gap?: boolean;
}

/**
 * AI Response data from backend analysis
 * Contains enhanced AI-generated insights and recommendations
 */
export interface AIResponse {
  score: number;
  leadTier: LeadTier;
  strengths: string[];
  weaknesses: string[];
  riskFactors: string[];
  fitReasoning: string;
  opportunities: string[];
  recommendedActions: string[];
}

/**
 * Extracted data from backend analysis
 * Contains raw metrics organized by category
 */
export interface ExtractedData {
  static: StaticMetrics;
  calculated: CalculatedDataMetrics;
  metadata: MetadataInfo;
}

/**
 * Static metrics that don't change frequently
 */
export interface StaticMetrics {
  verified: boolean;
  postsCount: number;
  externalUrl: string | null;
  topHashtags: Array<{ hashtag: string; count: number }>;
  topMentions: Array<{ username: string; count: number }>;
  avgVideoViews: number | null;
  dominantFormat: string;
  followersCount: number;
  avgLikesPerPost: number;
  formatDiversity: number;
  daysSinceLastPost: number;
  isBusinessAccount: boolean;
  avgCommentsPerPost: number;
  postingConsistency: number;
  businessCategoryName: string | null;
}

/**
 * Calculated metrics from analysis
 */
export interface CalculatedDataMetrics {
  authorityRatio: number;
  accountMaturity: number;
  engagementScore: number;
  engagementHealth: number;
  profileHealthScore: number;
  fakeFollowerWarning: string;
  contentSophistication: number;
  engagementConsistency: number;
}

/**
 * Metadata about the analysis
 */
export interface MetadataInfo {
  version: string;
  sampleSize: number;
  extractedAt: string;
}
