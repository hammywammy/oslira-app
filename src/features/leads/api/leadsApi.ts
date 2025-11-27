// src/features/leads/api/leadsApi.ts

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

// =============================================================================
// TYPES
// =============================================================================

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

// =============================================================================
// API FUNCTIONS
// =============================================================================

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

    // DEBUG LOGGING - Check data structure from backend
    console.group('🔍 Leads API - Backend Response');
    console.log('Total leads:', response.data.length);
    if (response.data.length > 0) {
      const firstLead = response.data[0];
      console.log('Sample lead object:', firstLead);
      console.log('Has ai_response?', !!firstLead.ai_response);
      console.log('ai_response data:', firstLead.ai_response);
      console.log('Has extracted_data?', !!firstLead.extracted_data);
      console.log('extracted_data data:', firstLead.extracted_data);
      console.log('Has calculated_metrics?', !!firstLead.calculated_metrics);
      console.log('calculated_metrics data:', firstLead.calculated_metrics);
      console.log('Analysis type:', firstLead.analysis_type);
      console.log('Analysis status:', firstLead.analysis_status);
    }
    console.groupEnd();

    logger.info('[LeadsApi] Leads fetched successfully', {
      count: response.data.length
    });

    return response.data;
  } catch (error) {
    logger.error('[LeadsApi] Failed to fetch leads', error as Error);
    // Return empty array instead of throwing - graceful degradation
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
