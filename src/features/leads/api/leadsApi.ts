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
import type { Lead, AIResponse, ExtractedData } from '@/shared/types/leads.types';

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
function mapAiAnalysisToAiResponse(aiAnalysis: unknown): AIResponse | undefined {
  if (!aiAnalysis || typeof aiAnalysis !== 'object') return undefined;

  const data = aiAnalysis as Record<string, unknown>;

  return {
    score: (data.profile_assessment_score ?? data.score) as number,
    leadTier: (data.lead_tier ?? data.leadTier) as 'hot' | 'warm' | 'cold',
    strengths: (data.strengths ?? []) as string[],
    weaknesses: (data.weaknesses ?? []) as string[],
    riskFactors: (data.risk_factors ?? data.riskFactors ?? []) as string[],
    fitReasoning: (data.fit_reasoning ?? data.fitReasoning ?? '') as string,
    opportunities: (data.opportunities ?? []) as string[],
    recommendedActions: (data.recommended_actions ?? data.recommendedActions ?? []) as string[],
  };
}

/**
 * Map backend extracted_data to frontend ExtractedData format
 * Handles snake_case to camelCase conversion for all nested fields
 */
function mapExtractedData(extractedData: unknown): ExtractedData | undefined {
  if (!extractedData || typeof extractedData !== 'object') return undefined;

  const data = extractedData as Record<string, unknown>;
  const staticData = data.static as Record<string, unknown> | undefined;
  const calculatedData = data.calculated as Record<string, unknown> | undefined;
  const metadataData = data.metadata as Record<string, unknown> | undefined;

  return {
    static: staticData
      ? {
          verified: staticData.verified as boolean,
          postsCount: staticData.posts_count as number,
          externalUrl: (staticData.external_url as string | null) ?? null,
          topHashtags: (staticData.top_hashtags as Array<{ hashtag: string; count: number }>) ?? [],
          topMentions: (staticData.top_mentions as Array<{ username: string; count: number }>) ?? [],
          avgVideoViews: (staticData.avg_video_views as number | null) ?? null,
          dominantFormat: staticData.dominant_format as string,
          followersCount: staticData.followers_count as number,
          avgLikesPerPost: staticData.avg_likes_per_post as number,
          formatDiversity: staticData.format_diversity as number,
          daysSinceLastPost: staticData.days_since_last_post as number,
          isBusinessAccount: staticData.is_business_account as boolean,
          avgCommentsPerPost: staticData.avg_comments_per_post as number,
          postingConsistency: staticData.posting_consistency as number,
          businessCategoryName: (staticData.business_category_name as string | null) ?? null,
        }
      : undefined,
    calculated: calculatedData
      ? {
          authorityRatio: calculatedData.authority_ratio as number,
          accountMaturity: calculatedData.account_maturity as number,
          engagementScore: calculatedData.engagement_score as number,
          engagementHealth: calculatedData.engagement_health as number,
          profileHealthScore: calculatedData.profile_health_score as number,
          fakeFollowerWarning: calculatedData.fake_follower_warning as string,
          contentSophistication: calculatedData.content_sophistication as number,
          engagementConsistency: calculatedData.engagement_consistency as number,
          leadTier: (calculatedData.leadTier || calculatedData.lead_tier) as 'hot' | 'warm' | 'cold' | undefined,
          audienceScale: (calculatedData.audienceScale || calculatedData.audience_scale) as string | undefined,
        }
      : undefined,
    metadata: metadataData
      ? {
          version: metadataData.version as string,
          sampleSize: metadataData.sample_size as number,
          extractedAt: metadataData.extracted_at as string,
        }
      : undefined,
  } as ExtractedData;
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

    const mappedData = response.data.map((lead: Lead) => ({
      ...lead,
      ai_response: mapAiAnalysisToAiResponse((lead as unknown as Record<string, unknown>).ai_analysis),
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
