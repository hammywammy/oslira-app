/**
 * Business Profile Types
 * Defines the structure of business profiles as returned by the API
 */

export interface BusinessProfile {
  id: string;
  business_name: string;
  website: string | null;
  business_one_liner: string | null;
  leads_count: number;
  analyses_count: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessProfileDetail extends BusinessProfile {
  account_id: string;
  business_context_pack: Record<string, unknown>;
  context_version: number | null;
  context_generated_at: string | null;
  context_manually_edited: boolean;
  context_updated_at: string | null;
}

/**
 * API Response for business profiles list
 */
export interface BusinessProfilesResponse {
  success: boolean;
  data: BusinessProfile[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}
