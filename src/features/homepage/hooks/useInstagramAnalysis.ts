/**
 * @file Instagram Analysis Hook
 * @description React Query hook for Instagram analysis
 * 
 * Replaces: HomeHandlers.js runInstagramAnalysis()
 */

import { useMutation } from '@tanstack/react-query';
import { logger } from '@/core/utils/logger';
import {
  analyzeInstagramAnonymous,
  isRateLimitError,
  type InstagramAnalysisResponse,
  type RateLimitError,
} from '../api/instagramApi';

export interface UseInstagramAnalysisOptions {
  onSuccess?: (data: InstagramAnalysisResponse) => void;
  onRateLimit?: (error: RateLimitError) => void;
  onError?: (error: Error) => void;
}

export function useInstagramAnalysis(options?: UseInstagramAnalysisOptions) {
  return useMutation({
    mutationFn: async (username: string) => {
      // Clean username
      const cleanUsername = username.trim().replace('@', '');

      if (!cleanUsername) {
        throw new Error('Please enter an Instagram username');
      }

      logger.info('Starting Instagram analysis', { username: cleanUsername });

      try {
        // Call the API
        const result = await analyzeInstagramAnonymous(cleanUsername);
        return result;
      } catch (error) {
        // Check if rate limited
        if (isRateLimitError(error)) {
          logger.warn('Rate limit hit', {
            remaining: error.metadata.remaining,
            resetIn: error.metadata.resetIn,
          });

          // Call rate limit callback if provided
          if (options?.onRateLimit) {
            options.onRateLimit(error);
          }
        }

        throw error;
      }
    },
    
    onSuccess: (data) => {
      logger.info('Instagram analysis completed', {
        username: data.profile.username,
        score: data.insights.overallScore,
      });
      
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    
    onError: (error) => {
      logger.error('Instagram analysis error', error);
      
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
}

export default useInstagramAnalysis;
