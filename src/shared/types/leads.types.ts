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
  // PROFILE METRICS (17 fields)
  // ============================================================================
  authority_ratio_raw?: number; // Raw followers/following ratio
  authority_ratio?: number; // 0-100 score (should be log-scaled)
  bio_length?: number; // Character count of bio
  highlight_reel_count?: number; // Number of story highlights
  external_url?: string; // Link in bio
  has_external_link?: boolean; // Has link in bio
  external_links_count?: number; // Number of external links
  has_bio?: boolean; // Has biography text

  // ============================================================================
  // ENGAGEMENT METRICS (11 fields)
  // ============================================================================
  total_likes?: number; // Sum of all likes
  total_comments?: number; // Sum of all comments
  avg_likes_per_post?: number; // Average likes per post
  avg_comments_per_post?: number; // Average comments per post
  engagement_rate?: number; // Percentage (e.g., 4.39)
  comment_to_like_ratio?: number; // Comments/Likes ratio
  engagement_consistency?: number; // 0-100 score (lower = more volatile)
  coefficient_of_variation?: number; // Statistical variance measure
  time_weighting_applied?: boolean; // Whether recent posts weighted more
  mean_engagement_rate?: number; // Average engagement rate
  engagement_std_dev?: number; // Standard deviation

  // ============================================================================
  // FREQUENCY METRICS (8 fields)
  // ============================================================================
  posting_frequency?: number; // Posts per month
  days_since_last_post?: number; // Days since most recent post
  posting_consistency?: number; // 0-100 score
  avg_days_between_posts?: number; // Average gap between posts
  posting_period_days?: number; // Days in analyzed period
  oldest_post_timestamp?: string; // ISO timestamp
  newest_post_timestamp?: string; // ISO timestamp
  time_between_posts_count?: number; // Number of intervals measured

  // ============================================================================
  // FORMAT METRICS (11 fields)
  // ============================================================================
  reels_count?: number; // Number of Reels
  video_count?: number; // Total videos (includes reels)
  non_reels_video_count?: number; // Videos that aren't reels
  image_count?: number; // Static images
  carousel_count?: number; // Multi-image posts
  format_diversity?: number; // Number of different formats used
  dominant_format?: string; // "reels" | "images" | "mixed"
  reels_rate?: number; // Percentage of posts that are reels
  image_rate?: number; // Percentage of posts that are images
  video_rate?: number; // Percentage of posts that are videos
  carousel_rate?: number; // Percentage of posts that are carousels

  // ============================================================================
  // CONTENT METRICS (14 fields)
  // ============================================================================
  total_hashtags?: number; // Total hashtag count
  unique_hashtag_count?: number; // Number of unique hashtags
  avg_hashtags_per_post?: number; // Average hashtags per post
  hashtag_diversity?: number; // Unique/Total ratio
  top_hashtags?: Array<{
    // Most used hashtags
    hashtag: string;
    count: number;
  }>;
  avg_caption_length?: number; // Average characters per caption
  avg_caption_length_non_empty?: number; // Excludes empty captions
  max_caption_length?: number; // Longest caption
  location_tagging_rate?: number; // Percentage with location
  alt_text_rate?: number; // Percentage with alt text
  comments_enabled_rate?: number; // Percentage with comments on
  unique_mentions_count?: number; // Number of unique @mentions
  top_mentions?: Array<{
    // Most mentioned accounts
    username: string;
    count: number;
  }>;

  // ============================================================================
  // VIDEO METRICS (4 fields)
  // ============================================================================
  video_post_count?: number; // Number of video posts
  total_video_views?: number; // Sum of all video views
  avg_video_views?: number; // Average views per video
  video_view_to_like_ratio?: number; // Views/Likes ratio

  // ============================================================================
  // RISK SCORES (4 fields)
  // ============================================================================
  fake_follower_risk_score?: number; // 0-100 (lower is better)
  fake_follower_interpretation?: string; // "LOW_RISK" | "MEDIUM_RISK" | "HIGH_RISK"
  warnings_count?: number; // Number of risk warnings
  warnings?: string[]; // Array of warning messages

  // ============================================================================
  // DERIVED METRICS (4 fields)
  // ============================================================================
  content_density?: number; // Posts per day of account age
  recent_viral_post_count?: number; // Number of viral posts in sample
  recent_posts_sampled?: number; // Sample size (e.g., 12)
  viral_post_rate?: number; // Percentage (with disclaimer)

  // ============================================================================
  // COMPOSITE SCORES (5 fields)
  // ============================================================================
  profile_health_score?: number; // 0-100 overall account quality
  engagement_health?: number; // 0-100 engagement quality
  content_sophistication?: number; // 0-100 content strategy quality
  account_maturity?: number; // 0-100 profile completeness
  fake_follower_risk?: number; // 0-100 (duplicate of fake_follower_risk_score)

  // ============================================================================
  // GAP DETECTION (4 boolean flags)
  // ============================================================================
  engagement_gap?: boolean; // Low engagement relative to followers
  content_gap?: boolean; // Weak content strategy
  conversion_gap?: boolean; // Missing conversion opportunities
  platform_gap?: boolean; // Not leveraging platform features

  // ============================================================================
  // AI ANALYSIS RESULTS (10 fields)
  // ============================================================================
  profile_assessment_score?: number; // From Profile Assessment AI (0-100)
  lead_tier?: LeadTier; // 'hot' | 'warm' | 'cold'
  overall_score: number | null; // Legacy field (may be same as profile_assessment_score)
  summary: string | null; // Partnership assessment paragraph
  strengths?: string[]; // 3-5 key strengths
  weaknesses?: string[]; // 3-5 key weaknesses
  opportunities?: string[]; // 3-5 opportunities
  outreach_hooks?: string[]; // 3-5 conversation starters
  recommended_actions?: string[]; // 2-4 recommended actions
  risk_factors?: string[]; // 1-3 risk factors
  fit_reasoning?: string; // Why good/bad fit
  partnership_assessment?: string; // Summary for salespeople
  confidence: number | null; // Confidence score (0-100)

  // ============================================================================
  // EXTERNAL LINKS
  // ============================================================================
  external_urls?: ExternalLink[];
}

/**
 * External link from profile
 */
export interface ExternalLink {
  url: string;
  title?: string;
  link_type?: string;
}
