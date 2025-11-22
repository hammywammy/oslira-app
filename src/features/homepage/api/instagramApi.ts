/**
 * @file Instagram Analysis API
 * @description Type-safe API calls for Instagram analysis
 */

import { httpClient } from '@/core/auth/http-client';
import { logger } from '@/core/utils/logger';

// =============================================================================
// TYPES
// =============================================================================

export interface InstagramProfile {
  username: string;
  followersCount?: number;
  bio?: string;
  profilePictureUrl?: string;
}

export interface EngagementInsights {
  overallScore: number;
  accountSummary: string;
  engagementInsights: string[];
  niche?: string;
  category?: string;
}

export interface InstagramAnalysisResponse {
  profile: InstagramProfile;
  insights: EngagementInsights;
  metadata?: {
    remaining: number;
    resetIn: number;
  };
}

export interface RateLimitError {
  error: string;
  metadata: {
    remaining: number;
    resetIn: number;
  };
}

// API response wrapper (matches http-client)
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// =============================================================================
// API FUNCTIONS
// =============================================================================

/**
 * Analyze Instagram profile anonymously (no auth required)
 * Uses 1 of your daily free analyses
 */
export async function analyzeInstagramAnonymous(
  username: string
): Promise<InstagramAnalysisResponse> {
  logger.info('Analyzing Instagram profile anonymously', { username });

  try {
    const response = await httpClient.post<ApiResponse<InstagramAnalysisResponse>>(
      '/v1/analyze-anonymous',
      { username: username.replace('@', '') },
      { skipAuth: true } // Anonymous endpoint
    );

    // Check wrapped response
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Analysis failed');
    }

    logger.info('Instagram analysis successful', {
      username,
      score: response.data.insights?.overallScore,
      remaining: response.data.metadata?.remaining,
    });

    return response.data;
  } catch (error) {
    logger.error('Instagram analysis failed', error as Error, { username });
    throw error;
  }
}

/**
 * Check if error is rate limit error
 */
export function isRateLimitError(error: unknown): error is RateLimitError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as { error: unknown }).error === 'string' &&
    (error as { error: string }).error.includes('rate limit')
  );
}

export default {
  analyzeInstagramAnonymous,
  isRateLimitError,
};
