/**
 * COMPLETE ONBOARDING HOOK - WITH WEBSOCKET PROGRESS TRACKING
 *
 * Sends form data to initiate business context generation.
 * Uses WebSocket for real-time progress updates (non-blocking enhancement).
 * Backend derives signature_name from full_name.
 */

import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '@/core/auth/http-client';
import { logger } from '@/core/utils/logger';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { useBusinessContextWebSocket } from './useBusinessContextWebSocket';
import type { BusinessContextProgressState } from './useBusinessContextWebSocket';
import type { FormData } from '@/features/onboarding/constants/validationSchemas';

interface OnboardingCompleteResponse {
  success: boolean;
  data: {
    run_id: string;
    status: string;
    message: string;
    progress_url: string;
  };
}

interface UseCompleteOnboardingReturn {
  mutate: (formData: FormData) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  progress: BusinessContextProgressState | null;
  isConnected: boolean;
}

const FALLBACK_TIMEOUT = 90000;

export function useCompleteOnboarding(): UseCompleteOnboardingReturn {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [runId, setRunId] = useState<string | null>(null);
  const hasNavigatedRef = useRef(false);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // WebSocket hook for real-time progress tracking
  const { progress, isConnected, error: wsError } = useBusinessContextWebSocket(runId);

  useEffect(() => {
    if (hasNavigatedRef.current) return;

    if (progress?.status === 'complete') {
      hasNavigatedRef.current = true;

      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
        fallbackTimeoutRef.current = null;
      }

      logger.info('[CompleteOnboarding] WebSocket reports complete - navigating');

      refreshUser()
        .then(() => {
          logger.info('[CompleteOnboarding] User data refreshed');
          navigate('/dashboard', { replace: true });
        })
        .catch((refreshError: Error) => {
          logger.warn('[CompleteOnboarding] User refresh failed (proceeding anyway)', {
            error: refreshError.message,
          });
          navigate('/dashboard', { replace: true });
        });
    }
  }, [progress?.status, refreshUser, navigate]);

  useEffect(() => {
    if (hasNavigatedRef.current) return;

    if (progress?.status === 'failed') {
      hasNavigatedRef.current = true;

      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
        fallbackTimeoutRef.current = null;
      }

      logger.error('[CompleteOnboarding] Generation failed', undefined, {
        errorMessage: wsError?.message,
      });

      refreshUser()
        .catch(() => {})
        .finally(() => {
          navigate('/dashboard', { replace: true });
        });
    }
  }, [progress?.status, wsError, refreshUser, navigate]);

  useEffect(() => {
    return () => {
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
      }
    };
  }, []);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      logger.info('[CompleteOnboarding] Starting mutation', {
        timestamp: new Date().toISOString(),
        formData: {
          full_name: formData.full_name,
          business_name: formData.business_name,
          has_business_summary: !!formData.business_summary,
          has_target_description: !!formData.target_description,
          communication_tone: formData.communication_tone,
          follower_range: `${formData.icp_min_followers}-${formData.icp_max_followers}`,
          company_sizes_count: formData.target_company_sizes?.length || 0,
        },
      });

      const response = await httpClient.post<OnboardingCompleteResponse>(
        '/api/business/generate-context',
        formData
      );

      logger.info('[CompleteOnboarding] Mutation response received', {
        timestamp: new Date().toISOString(),
        run_id: response.data.run_id,
        status: response.data.status,
        message: response.data.message,
      });

      return response;
    },

    onSuccess: (response: OnboardingCompleteResponse) => {
      logger.info('[CompleteOnboarding] onSuccess triggered - starting WebSocket');

      const newRunId = response.data.run_id;

      setRunId(newRunId);

      fallbackTimeoutRef.current = setTimeout(() => {
        if (hasNavigatedRef.current) return;

        logger.warn('[CompleteOnboarding] Fallback timeout triggered - navigating anyway');
        hasNavigatedRef.current = true;

        refreshUser()
          .catch(() => {})
          .finally(() => {
            navigate('/dashboard', { replace: true });
          });
      }, FALLBACK_TIMEOUT);
    },

    onError: (error: Error) => {
      logger.error('[CompleteOnboarding] Error in mutation flow', error);
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    progress,
    isConnected,
  };
}
