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
import { authManager } from '@/core/auth/auth-manager';
import { env } from '@/core/auth/environment';
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
      console.log('[CompleteOnboarding] 🎯 onSuccess triggered');

      const runId = response.data.run_id;
      await streamGenerationProgress(runId);

      console.log('[CompleteOnboarding] ✅ SSE stream complete');

      // Refresh user data (onboarding_completed will be true, and we'll get fresh JWT)
      console.log('[CompleteOnboarding] 🔄 Refreshing user data...');
      try {
        await refreshUser();
        console.log('[CompleteOnboarding] ✅ User data refreshed');
      } catch (refreshError: any) {
        console.warn('[CompleteOnboarding] ⚠️ User refresh failed (proceeding anyway)', {
          error: refreshError.message,
          timestamp: new Date().toISOString()
        });
        // Don't throw - Worker already completed successfully
      }

      // CRITICAL: Wait for React state to propagate before navigation
      // This ensures all providers have updated state before dashboard mounts
      console.log('[CompleteOnboarding] ⏳ Waiting for state propagation...');
      await new Promise(resolve => setTimeout(resolve, 150));

      console.log('[CompleteOnboarding] 🧭 Navigating to dashboard');
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

async function streamGenerationProgress(runId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('[SSE] 🔍 Starting SSE stream', {
      timestamp: new Date().toISOString(),
      run_id: runId
    });

    // Get auth token for query parameter (EventSource doesn't support headers)
    authManager.getAccessToken().then(token => {
      if (!token) {
        console.error('[SSE] ❌ No auth token available');
        reject(new Error('Authentication required'));
        return;
      }

      // Construct full absolute URL with API base
      const streamUrl = `${env.apiUrl}/api/business/generate-context/${runId}/stream?token=${encodeURIComponent(token)}`;

      console.log('[SSE] 🌐 Connecting to stream', {
        timestamp: new Date().toISOString(),
        url: streamUrl.replace(token, '[REDACTED]')
      });

      const eventSource = new EventSource(streamUrl);

      // Handle progress updates
      eventSource.addEventListener('progress', (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('[SSE] 📊 Progress update', {
            timestamp: new Date().toISOString(),
            status: data.status,
            progress: data.progress,
            step: data.current_step
          });
        } catch (error) {
          console.error('[SSE] ❌ Failed to parse progress event', error);
        }
      });

      // Handle completion
      eventSource.addEventListener('complete', (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('[SSE] 🎉 GENERATION COMPLETE!', {
            timestamp: new Date().toISOString(),
            final_progress: data.progress,
            final_step: data.current_step
          });
          eventSource.close();
          resolve();
        } catch (error) {
          console.error('[SSE] ❌ Failed to parse complete event', error);
          eventSource.close();
          reject(error);
        }
      });

      // Handle errors
      eventSource.addEventListener('error', (event: any) => {
        console.error('[SSE] ❌ Stream error', {
          timestamp: new Date().toISOString(),
          error: event
        });

        // Check if backend sent error message
        if (event.data) {
          try {
            const data = JSON.parse(event.data);
            console.error('[SSE] ❌ Backend error', data);
            eventSource.close();
            reject(new Error(data.message || 'Context generation failed'));
            return;
          } catch {
            // Not JSON, generic error
          }
        }

        eventSource.close();
        reject(new Error('SSE connection failed'));
      });

      // Handle connection errors
      eventSource.onerror = (error) => {
        console.error('[SSE] ❌ Connection error', {
          timestamp: new Date().toISOString(),
          readyState: eventSource.readyState
        });
        eventSource.close();
        reject(new Error('SSE connection error'));
      };

      // Timeout after 60 seconds
      const timeout = setTimeout(() => {
        console.error('[SSE] ⏰ TIMEOUT - exceeded 60 seconds', {
          timestamp: new Date().toISOString()
        });
        eventSource.close();
        reject(new Error('Generation timeout - exceeded 60 seconds'));
      }, 60000);

      // Clear timeout on completion
      eventSource.addEventListener('complete', () => {
        clearTimeout(timeout);
      });

    }).catch(error => {
      console.error('[SSE] ❌ Failed to get auth token', error);
      reject(error);
    });
  });
}
