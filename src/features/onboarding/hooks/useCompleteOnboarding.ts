// src/features/onboarding/hooks/useCompleteOnboarding.ts

/**
 * COMPLETE ONBOARDING HOOK
 * 
 * Handles:
 * - Form submission to API
 * - Token refresh after completion
 * - Auth context update
 * - Navigation to dashboard
 */

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '@/core/auth/http-client';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import type {
  OnboardingSubmitPayload,
  OnboardingCompleteResponse,
  OnboardingFormData,
} from '@/shared/types/onboarding.types';

// =============================================================================
// HELPER: Transform form data to API payload
// =============================================================================

function transformFormDataToPayload(data: OnboardingFormData): OnboardingSubmitPayload {
  return {
    signature_name: data.signature_name,
    business_name: data.company_name,
    business_summary: data.business_summary,
    website: data.website || undefined,
    ideal_customer_profile: {
      business_description: data.business_summary,
      target_audience: data.target_description,
      industry: data.industry === 'Other' ? data.industry_other! : data.industry,
      icp_min_followers: data.icp_min_followers,
      icp_max_followers: data.icp_max_followers,
      brand_voice: data.communication_tone,
    },
    operational_metadata: {
      company_size: data.company_size,
      monthly_lead_goal: data.monthly_lead_goal,
      primary_objective: data.primary_objective,
      challenges: data.challenges || [],
      target_company_sizes: data.target_company_sizes || [],
      communication_channels: data.communication_channels,
      communication_tone: data.communication_tone,
      team_size: data.team_size,
      campaign_manager: data.campaign_manager,
    },
  };
}

// =============================================================================
// HOOK
// =============================================================================

export function useCompleteOnboarding() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: async (formData: OnboardingFormData) => {
      const payload = transformFormDataToPayload(formData);

      const response = await httpClient.post<OnboardingCompleteResponse>(
        '/api/business/generate-context',
        payload
      );

      return response; // ✅ Return the whole response object
    },

    onSuccess: async (response) => {
      // ✅ Access token from response object
      if (response.access_token) {
        const authManager = (await import('@/core/auth/auth-manager')).authManager;
        const currentTokens = authManager.getTokens();
        
        if (currentTokens) {
          // ✅ Use the correct signature: setTokens(accessToken, refreshToken, expiresAt)
          authManager.setTokens(
            response.access_token,
            currentTokens.refreshToken,
            currentTokens.expiresAt
          );
        }
      }

      // Refresh user data in auth context
      await refreshUser();

      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
    },

    onError: (error: any) => {
      console.error('[CompleteOnboarding] Error:', error);
      
      // Error handling is managed by React Hook Form
      // and displayed in the UI via error states
    },
  });
}
