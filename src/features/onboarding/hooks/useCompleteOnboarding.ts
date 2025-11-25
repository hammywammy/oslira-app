// src/features/onboarding/hooks/useCompleteOnboarding.ts

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
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { useBusinessContextWebSocket } from './useBusinessContextWebSocket';
import type { BusinessContextProgressState } from './useBusinessContextWebSocket';
import type { FormData } from '@/features/onboarding/constants/validationSchemas';

// =============================================================================
// RESPONSE TYPE
// =============================================================================

interface OnboardingCompleteResponse {
  success: boolean;
  data: {
    run_id: string;
    status: string;
    message: string;
    progress_url: string;
  };
}

// =============================================================================
// RETURN TYPE
// =============================================================================

interface UseCompleteOnboardingReturn {
  mutate: (formData: FormData) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  progress: BusinessContextProgressState | null;
  isConnected: boolean;
}

// =============================================================================
// CONSTANTS
// =============================================================================

// Fallback timeout if WebSocket fails - ensures user isn't stuck forever
const FALLBACK_TIMEOUT = 90000; // 90 seconds

// =============================================================================
// HOOK
// =============================================================================

export function useCompleteOnboarding(): UseCompleteOnboardingReturn {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [runId, setRunId] = useState<string | null>(null);
  const hasNavigatedRef = useRef(false);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // WebSocket hook for real-time progress tracking
  const { progress, isConnected, error: wsError } = useBusinessContextWebSocket(runId);

  // Handle completion - navigate when WebSocket reports complete
  useEffect(() => {
    if (hasNavigatedRef.current) return;

    if (progress?.status === 'complete') {
      hasNavigatedRef.current = true;

      // Clear fallback timeout
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
        fallbackTimeoutRef.current = null;
      }

      console.log('[CompleteOnboarding] ✅ WebSocket reports complete - navigating');

      // Refresh user data (onboarding_completed will be true, and we'll get fresh JWT)
      refreshUser()
        .then(() => {
          console.log('[CompleteOnboarding] ✅ User data refreshed');
          navigate('/dashboard', { replace: true });
        })
        .catch((refreshError: Error) => {
          console.warn('[CompleteOnboarding] ⚠️ User refresh failed (proceeding anyway)', {
            error: refreshError.message,
          });
          // Don't throw - Worker already completed successfully
          navigate('/dashboard', { replace: true });
        });
    }
  }, [progress?.status, refreshUser, navigate]);

  // Handle WebSocket failure - if generation failed, we should still navigate eventually
  useEffect(() => {
    if (hasNavigatedRef.current) return;

    if (progress?.status === 'failed') {
      hasNavigatedRef.current = true;

      // Clear fallback timeout
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
        fallbackTimeoutRef.current = null;
      }

      console.error('[CompleteOnboarding] ❌ Generation failed', {
        error: wsError?.message,
      });

      // Still navigate - user needs to see the result
      refreshUser()
        .catch(() => {}) // Ignore refresh errors
        .finally(() => {
          navigate('/dashboard', { replace: true });
        });
    }
  }, [progress?.status, wsError, refreshUser, navigate]);

  // Cleanup fallback timeout on unmount
  useEffect(() => {
    return () => {
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
      }
    };
  }, []);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      console.log('[CompleteOnboarding] 🚀 Starting mutation', {
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

      // Send the form data EXACTLY as-is
      // Backend derives signature_name from full_name
      const response = await httpClient.post<OnboardingCompleteResponse>(
        '/api/business/generate-context',
        formData
      );

      console.log('[CompleteOnboarding] ✅ Mutation response received', {
        timestamp: new Date().toISOString(),
        run_id: response.data.run_id,
        status: response.data.status,
        message: response.data.message,
      });

      return response;
    },

    onSuccess: (response: OnboardingCompleteResponse) => {
      console.log('[CompleteOnboarding] 🎯 onSuccess triggered - starting WebSocket');

      const newRunId = response.data.run_id;

      // Set runId to trigger WebSocket connection
      setRunId(newRunId);

      // Set fallback timeout in case WebSocket fails completely
      // This ensures user isn't stuck forever if WebSocket never connects/completes
      fallbackTimeoutRef.current = setTimeout(() => {
        if (hasNavigatedRef.current) return;

        console.warn('[CompleteOnboarding] ⏰ Fallback timeout triggered - navigating anyway');
        hasNavigatedRef.current = true;

        refreshUser()
          .catch(() => {}) // Ignore refresh errors
          .finally(() => {
            navigate('/dashboard', { replace: true });
          });
      }, FALLBACK_TIMEOUT);
    },

    onError: (error: Error) => {
      console.error('[CompleteOnboarding] ❌ Error in mutation flow', {
        timestamp: new Date().toISOString(),
        error: error.message,
      });
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
