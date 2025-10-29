// src/features/onboarding/hooks/useCompleteOnboarding.ts

/**
 * COMPLETE ONBOARDING HOOK - SIMPLIFIED
 * 
 * Sends EXACTLY what the form collects.
 * No nested objects. No transformations. No bullshit.
 * Backend handles the mapping.
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
      // Send the form data EXACTLY as-is
      // Backend will handle transformation to workflow format
      const response = await httpClient.post<OnboardingCompleteResponse>(
        '/api/business/generate-context',
        formData // ✅ Send flat structure directly
      );

      return response;
    },

    onSuccess: async (response) => {
      console.log('[CompleteOnboarding] Context generation started:', response.data.run_id);

      // Poll for completion
      const runId = response.data.run_id;
      await pollGenerationProgress(runId);

      // Refresh user data (onboarding_completed will be true)
      await refreshUser();

      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
    },

    onError: (error: any) => {
      console.error('[CompleteOnboarding] Error:', error);
    },
  });
}

// =============================================================================
// HELPER: Poll generation progress
// =============================================================================

async function pollGenerationProgress(runId: string): Promise<void> {
  const maxAttempts = 60; // 60 seconds max (1 poll per second)
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await httpClient.get<{
      status: 'pending' | 'processing' | 'complete' | 'failed';
      progress: number;
      current_step: string;
    }>(`/api/business/generate-context/${runId}/progress`);

    console.log(`[Poll] Status: ${response.status}, Progress: ${response.progress}%`);

    // ✅ BREAK LOOP ON COMPLETION
    if (response.status === 'complete') {
      console.log('[Poll] Generation complete! Proceeding to dashboard...');
      break; // Exit while loop immediately
    }

    // ✅ THROW ERROR ON FAILURE
    if (response.status === 'failed') {
      throw new Error('Context generation failed');
    }

    // Wait 1 second before next poll
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }

  // ✅ EXPLICIT TIMEOUT CHECK
  if (attempts >= maxAttempts) {
    throw new Error('Generation timeout - exceeded 60 seconds');
  }
}
