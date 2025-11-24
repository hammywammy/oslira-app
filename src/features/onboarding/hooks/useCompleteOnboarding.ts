// src/features/onboarding/hooks/useCompleteOnboarding.ts

/**
 * COMPLETE ONBOARDING HOOK - WITH EXTENSIVE DIAGNOSTIC LOGGING
 * 
 * Sends EXACTLY what the form collects.
 * Backend derives signature_name from full_name.
 */

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '@/core/auth/http-client';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
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
// HOOK
// =============================================================================

export function useCompleteOnboarding() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  return useMutation({
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
          company_sizes_count: formData.target_company_sizes?.length || 0
        }
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
        message: response.data.message
      });

      return response;
    },

    onSuccess: async (response) => {
      console.log('[CompleteOnboarding] 🎯 onSuccess triggered', {
        timestamp: new Date().toISOString(),
        run_id: response.data.run_id
      });

      // Stream progress via SSE
      const runId = response.data.run_id;
      console.log('[CompleteOnboarding] ⏳ Starting SSE stream for run_id:', runId);

      await streamGenerationProgress(runId, (progress) => {
        console.log('[SSE] Progress callback', progress);
      });

      console.log('[CompleteOnboarding] ✅ SSE stream complete');

      // Refresh user data (onboarding_completed will be true)
      console.log('[CompleteOnboarding] 🔄 Refreshing user data...');
      try {
        await refreshUser();
        console.log('[CompleteOnboarding] ✅ User data refreshed');
      } catch (refreshError: any) {
        console.warn('[CompleteOnboarding] ⚠️  User refresh failed (proceeding anyway)', {
          error: refreshError.message,
          timestamp: new Date().toISOString()
        });
        // Don't throw - Worker already completed successfully
      }

      // Navigate to dashboard
      console.log('[CompleteOnboarding] 🧭 Navigating to dashboard', {
        timestamp: new Date().toISOString()
      });
      navigate('/dashboard', { replace: true });
    },

    onError: (error: any) => {
      console.error('[CompleteOnboarding] ❌ Error in mutation flow', {
        timestamp: new Date().toISOString(),
        error: error.message,
        stack: error.stack
      });
    },
  });
}

// =============================================================================
// HELPER: Stream generation progress via SSE
// =============================================================================

async function streamGenerationProgress(
  runId: string,
  onProgress: (data: { status: string; progress: number; current_step: string }) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(
      `/api/business/generate-context/${runId}/stream`,
      { withCredentials: true }
    );

    console.log('[SSE] 🔌 Connected to progress stream', {
      timestamp: new Date().toISOString(),
      run_id: runId,
      url: `/api/business/generate-context/${runId}/stream`
    });

    // Handle progress updates
    eventSource.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);

        console.log('[SSE] 📊 Progress update', {
          timestamp: new Date().toISOString(),
          status: data.status,
          progress: data.progress,
          step: data.current_step
        });

        onProgress(data);

        // Check for completion
        if (data.status === 'complete') {
          console.log('[SSE] 🎉 GENERATION COMPLETE!', {
            timestamp: new Date().toISOString(),
            final_progress: data.progress,
            final_step: data.current_step
          });
          eventSource.close();
          resolve();
        }

        // Check for failure
        if (data.status === 'failed') {
          console.error('[SSE] ❌ Generation failed', {
            timestamp: new Date().toISOString(),
            status: data.status,
            step: data.current_step
          });
          eventSource.close();
          reject(new Error('Context generation failed'));
        }
      } catch (parseError: any) {
        console.error('[SSE] ❌ Failed to parse message', {
          timestamp: new Date().toISOString(),
          error: parseError.message,
          raw_data: event.data
        });
      }
    });

    // Handle custom 'complete' event
    eventSource.addEventListener('complete', () => {
      console.log('[SSE] ✅ Complete event received', {
        timestamp: new Date().toISOString()
      });
      eventSource.close();
      resolve();
    });

    // Handle errors
    eventSource.addEventListener('error', (error) => {
      console.error('[SSE] ❌ Connection error', {
        timestamp: new Date().toISOString(),
        error: error,
        readyState: eventSource.readyState
      });
      eventSource.close();
      reject(new Error('SSE connection failed'));
    });
  });
}
