/**
 * LEADS API SERVICE
 *
 * Handles all API interactions for leads data
 * Fetches real leads from database with full analysis data
 *
 * FEATURES:
 * - Fetch all leads for current user's account
 * - Automatic mapping from database schema to frontend types
 * - Joins leads with lead_analyses for complete data
 * - Type-safe API responses
 */

import { httpClient } from '@/core/auth/http-client';
import { logger } from '@/core/utils/logger';
import type { Lead } from '@/shared/types/leads.types';

interface FetchLeadsResponse {
  success: boolean;
  data: Lead[];
}

interface FetchLeadsParams {
  page?: number;
  pageSize?: number;
  sortBy?: 'created_at' | 'updated_at' | 'overall_score';
  sortOrder?: 'asc' | 'desc';
  platform?: 'instagram';
  analysisStatus?: 'pending' | 'processing' | 'complete' | 'failed';
  businessProfileId?: string | null;
}

/**
 * Map backend ai_analysis to frontend AIResponse format
 * Handles snake_case to camelCase conversion
 */
function mapAiAnalysisToAiResponse(aiAnalysis: any): any {
  if (!aiAnalysis) return undefined;

  return {
    score: aiAnalysis.profile_assessment_score ?? aiAnalysis.score,
    leadTier: aiAnalysis.lead_tier ?? aiAnalysis.leadTier,
    strengths: aiAnalysis.strengths,
    weaknesses: aiAnalysis.weaknesses,
    riskFactors: aiAnalysis.risk_factors ?? aiAnalysis.riskFactors,
    fitReasoning: aiAnalysis.fit_reasoning ?? aiAnalysis.fitReasoning,
    opportunities: aiAnalysis.opportunities,
    recommendedActions: aiAnalysis.recommended_actions ?? aiAnalysis.recommendedActions,
  };
}

/**
 * Map backend extracted_data to frontend ExtractedData format
 * Handles snake_case to camelCase conversion for all nested fields
 */
function mapExtractedData(extractedData: any): any {
  if (!extractedData) return undefined;

  return {
    static: extractedData.static
      ? {
          verified: extractedData.static.verified,
          postsCount: extractedData.static.posts_count,
          externalUrl: extractedData.static.external_url,
          topHashtags: extractedData.static.top_hashtags,
          topMentions: extractedData.static.top_mentions,
          avgVideoViews: extractedData.static.avg_video_views,
          dominantFormat: extractedData.static.dominant_format,
          followersCount: extractedData.static.followers_count,
          avgLikesPerPost: extractedData.static.avg_likes_per_post,
          formatDiversity: extractedData.static.format_diversity,
          daysSinceLastPost: extractedData.static.days_since_last_post,
          isBusinessAccount: extractedData.static.is_business_account,
          avgCommentsPerPost: extractedData.static.avg_comments_per_post,
          postingConsistency: extractedData.static.posting_consistency,
          businessCategoryName: extractedData.static.business_category_name,
        }
      : undefined,
    calculated: extractedData.calculated
      ? {
          authorityRatio: extractedData.calculated.authority_ratio,
          accountMaturity: extractedData.calculated.account_maturity,
          engagementScore: extractedData.calculated.engagement_score,
          engagementHealth: extractedData.calculated.engagement_health,
          profileHealthScore: extractedData.calculated.profile_health_score,
          fakeFollowerWarning: extractedData.calculated.fake_follower_warning,
          contentSophistication: extractedData.calculated.content_sophistication,
          engagementConsistency: extractedData.calculated.engagement_consistency,
          leadTier: extractedData.calculated.leadTier || extractedData.calculated.lead_tier,
          audienceScale: extractedData.calculated.audienceScale || extractedData.calculated.audience_scale,
        }
      : undefined,
    metadata: extractedData.metadata
      ? {
          version: extractedData.metadata.version,
          sampleSize: extractedData.metadata.sample_size,
          extractedAt: extractedData.metadata.extracted_at,
        }
      : undefined,
  };
}

/**
 * Fetch all leads for the authenticated user
 *
 * Backend should:
 * 1. Get user's account_id from auth token
 * 2. Query leads table filtered by account_id
 * 3. LEFT JOIN with lead_analyses to get analysis data
 * 4. Map database fields to frontend Lead type
 * 5. Return paginated results
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Promise with leads data
 */
export async function fetchLeads(params: FetchLeadsParams = {}): Promise<Lead[]> {
  try {
    logger.info('[LeadsApi] Fetching leads', { params });

    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.platform) queryParams.append('platform', params.platform);
    if (params.analysisStatus) queryParams.append('analysisStatus', params.analysisStatus);
    if (params.businessProfileId) queryParams.append('businessProfileId', params.businessProfileId);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/leads?${queryString}` : '/api/leads';

    const response = await httpClient.get<FetchLeadsResponse>(endpoint);

    if (!response.success || !response.data) {
      logger.warn('[LeadsApi] Invalid response format', { response });
      return [];
    }

    const mappedData = response.data.map((lead: any) => ({
      ...lead,
      ai_response: mapAiAnalysisToAiResponse(lead.ai_analysis),
      extracted_data: mapExtractedData(lead.extracted_data),
      calculated_metrics: lead.extracted_data?.calculated || undefined,
    }));

    logger.info('[LeadsApi] Leads fetched successfully', {
      count: mappedData.length
    });

    return mappedData;
  } catch (error) {
    logger.error('[LeadsApi] Failed to fetch leads', error as Error);
    return [];
  }
}

/**
 * Fetch a single lead by ID
 *
 * @param leadId - Lead ID to fetch
 * @returns Promise with lead data or null
 */
export async function fetchLeadById(leadId: string): Promise<Lead | null> {
  try {
    logger.info('[LeadsApi] Fetching lead by ID', { leadId });

    const response = await httpClient.get<{ success: boolean; data: Lead }>(`/api/leads/${leadId}`);

    if (!response.success || !response.data) {
      logger.warn('[LeadsApi] Lead not found', { leadId });
      return null;
    }

    logger.info('[LeadsApi] Lead fetched successfully', { leadId });
    return response.data;
  } catch (error) {
    logger.error('[LeadsApi] Failed to fetch lead', error as Error, { leadId });
    return null;
  }
}

/**
 * Delete a lead
 *
 * @param leadId - Lead ID to delete
 * @returns Promise with success status
 */
export async function deleteLead(leadId: string): Promise<boolean> {
  try {
    logger.info('[LeadsApi] Deleting lead', { leadId });

    const response = await httpClient.delete<{ success: boolean }>(`/api/leads/${leadId}`);

    if (!response.success) {
      logger.warn('[LeadsApi] Failed to delete lead', { leadId });
      return false;
    }

    logger.info('[LeadsApi] Lead deleted successfully', { leadId });
    return true;
  } catch (error) {
    logger.error('[LeadsApi] Error deleting lead', error as Error, { leadId });
    return false;
  }
}

/**
 * Bulk delete leads
 *
 * @param leadIds - Array of lead IDs to delete
 * @returns Promise with success status
 */
export async function bulkDeleteLeads(leadIds: string[]): Promise<boolean> {
  try {
    logger.info('[LeadsApi] Bulk deleting leads', { count: leadIds.length });

    const response = await httpClient.post<{ success: boolean }>('/api/leads/bulk-delete', {
      leadIds,
    });

    if (!response.success) {
      logger.warn('[LeadsApi] Failed to bulk delete leads', { count: leadIds.length });
      return false;
    }

    logger.info('[LeadsApi] Leads bulk deleted successfully', { count: leadIds.length });
    return true;
  } catch (error) {
    logger.error('[LeadsApi] Error bulk deleting leads', error as Error, { count: leadIds.length });
    return false;
  }
}
