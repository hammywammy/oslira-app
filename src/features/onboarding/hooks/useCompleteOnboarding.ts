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

      // Poll for completion
      const runId = response.data.run_id;
      console.log('[CompleteOnboarding] ⏳ Starting polling for run_id:', runId);
      
      await pollGenerationProgress(runId);
      
      console.log('[CompleteOnboarding] ✅ Polling complete');

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
// HELPER: Poll generation progress
// =============================================================================

async function pollGenerationProgress(runId: string): Promise<void> {
  const maxAttempts = 60; // 60 seconds max (1 poll per second)
  let attempts = 0;
  let stuckAt100Count = 0;

  console.log('[Poll] 🔍 Starting progress polling', {
    timestamp: new Date().toISOString(),
    run_id: runId,
    max_attempts: maxAttempts
  });

  while (attempts < maxAttempts) {
    attempts++;

    try {
      const response = await httpClient.get<{
        status: 'pending' | 'processing' | 'complete' | 'failed';
        progress: number;
        current_step: string;
      }>(`/api/business/generate-context/${runId}/progress`);

      // Log every poll with full context
      console.log(`[Poll #${attempts}] 📊 Progress update`, {
        timestamp: new Date().toISOString(),
        status: response.status,
        progress: response.progress,
        step: response.current_step,
        attempt: attempts,
        max_attempts: maxAttempts
      });

      // ✅ CHECK FOR COMPLETION
if (response.status === 'complete') {
  console.log('[Poll] 🎉 GENERATION COMPLETE!', {
    timestamp: new Date().toISOString(),
    final_progress: response.progress,
    final_step: response.current_step,
    total_attempts: attempts,
    duration_seconds: attempts
  });
  break; // ✅ Exit loop immediately
}

// ✅ CHECK FOR FAILURE
if (response.status === 'failed') {
  console.error('[Poll] ❌ Generation failed', {
    timestamp: new Date().toISOString(),
    status: response.status,
    step: response.current_step,
    attempts: attempts
  });
  throw new Error('Context generation failed');
}

// ⚠️ SAFETY: Detect if backend is stuck (should never happen with the fix)
if (response.status === 'processing' && response.progress === 100) {
  stuckAt100Count++;
  console.warn(`[Poll] ⚠️  Backend stuck at 100% (count: ${stuckAt100Count}/10)`, {
    timestamp: new Date().toISOString(),
    status: response.status,
    progress: response.progress,
    step: response.current_step,
    warning: 'This indicates a backend /complete endpoint failure'
  });

  // Give backend 10 seconds (increased from 5) before forcing through
  if (stuckAt100Count >= 10) {
    console.error('[Poll] 🛑 CRITICAL: Backend failed to mark complete after 10 seconds', {
      timestamp: new Date().toISOString(),
      final_step: response.current_step,
      recommendation: 'Check backend logs for /complete endpoint errors'
    });
    // Force completion as fallback (backend already did the work)
    break;
  }
} else {
  stuckAt100Count = 0; // Reset counter
}

      // Wait 1 second before next poll
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (pollError: any) {
      console.error(`[Poll #${attempts}] ❌ Poll request failed`, {
        timestamp: new Date().toISOString(),
        error: pollError.message,
        attempt: attempts,
        will_retry: attempts < maxAttempts - 1
      });

      // If not last attempt, continue polling
      if (attempts < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      // Last attempt failed - throw error
      throw pollError;
    }
  }

  // ✅ CHECK FOR TIMEOUT
  if (attempts >= maxAttempts) {
    console.error('[Poll] ⏰ TIMEOUT - exceeded max attempts', {
      timestamp: new Date().toISOString(),
      attempts: attempts,
      max_attempts: maxAttempts,
      duration_seconds: maxAttempts
    });
    throw new Error('Generation timeout - exceeded 60 seconds');
  }

  console.log('[Poll] ✅ Polling loop exited successfully', {
    timestamp: new Date().toISOString(),
    total_attempts: attempts
  });
}
