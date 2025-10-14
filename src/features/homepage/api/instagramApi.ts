/**
 * @file Instagram Analysis API
 * @description Type-safe API calls for Instagram analysis
 * 
 * Replaces: HomeHandlers.js backend logic
 */

import { httpClient } from '@/core/api/client';
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
    const response = await httpClient.post<InstagramAnalysisResponse>(
      '/v1/analyze-anonymous',
      { username: username.replace('@', '') },
      { skipAuth: true } // Anonymous endpoint
    );

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
 * Generate demo results (fallback when API unavailable)
 * Matches your old generateDemoResults() logic
 */
export function generateDemoResults(username: string): InstagramAnalysisResponse {
  const cleanUsername = username.replace('@', '');
  
  const demoProfiles = [
    {
      niche: 'Health & Wellness',
      category: 'Business',
      tags: ['Needs copy help', 'High engagement', 'Business owner'],
    },
    {
      niche: 'Tech Startup',
      category: 'Business',
      tags: ['Growing fast', 'Content creator', 'B2B focus'],
    },
    {
      niche: 'E-commerce',
      category: 'Business',
      tags: ['Product launches', 'Email marketing', 'Conversion focused'],
    },
    {
      niche: 'Coaching',
      category: 'Business',
      tags: ['Personal brand', 'Course creator', 'Audience building'],
    },
  ];

  const randomProfile = demoProfiles[Math.floor(Math.random() * demoProfiles.length)];
  if (!randomProfile) {
    throw new Error('Failed to generate demo profile');
  }

  const followers = (Math.random() * 50 + 5).toFixed(1);
  const score = Math.floor(Math.random() * 25 + 75);

  return {
    profile: {
      username: cleanUsername,
      followersCount: parseFloat(followers) * 1000,
      bio: `${randomProfile.niche} enthusiast`,
    },
    insights: {
      overallScore: score,
      accountSummary: `High-quality account with strong engagement potential for business partnerships. ${randomProfile.niche} focus.`,
      engagementInsights: [
        'Posts consistently get 5%+ engagement rate',
        'Audience is highly engaged with business content',
        'Strong potential for collaboration opportunities',
        'Posts during peak hours for maximum reach',
        'Uses relevant hashtags effectively',
      ],
      niche: randomProfile.niche,
      category: randomProfile.category,
    },
  };
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
  generateDemoResults,
  isRateLimitError,
};
