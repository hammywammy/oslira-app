// src/features/onboarding/hooks/useCompleteOnboarding.ts

/**
 * COMPLETE ONBOARDING HOOK - STREAMLINED
 * 
 * Maps 4-step form data to backend API structure
 * Provides sensible defaults for fields removed from UI
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
// HELPER: Extract company name from business summary
// =============================================================================

function extractCompanyName(businessSummary: string): string {
  // Try to extract first sentence or first 100 chars as company name
  const firstSentence = businessSummary.split(/[.!?]/)[0];
  
  // If first sentence mentions "is a" or "is an", extract company name before it
  const match = firstSentence?.match(/^(.+?)\s+is\s+(a|an)\s+/i);
  if (match) {
    return match[1]?.trim() || 'Company';
  }
  
  // Otherwise, take first few words (max 50 chars)
  const words = businessSummary.split(' ').slice(0, 5).join(' ');
  return words.length > 50 ? words.substring(0, 50) : words || 'Company';
}

// =============================================================================
// HELPER: Transform form data to API payload
// =============================================================================

function transformFormDataToPayload(data: OnboardingFormData): OnboardingSubmitPayload {
  // Extract company name from business summary
  const businessName = extractCompanyName(data.business_summary);

  return {
    signature_name: data.signature_name,
    business_name: businessName,
    business_summary: data.business_summary,
    website: undefined, // No longer collected
    
    ideal_customer_profile: {
      business_description: data.business_summary,
      target_audience: data.target_description,
      industry: 'Not Specified', // Backend can derive from summary if needed
      icp_min_followers: data.icp_min_followers,
      icp_max_followers: data.icp_max_followers,
      brand_voice: data.communication_tone,
    },
    
    operational_metadata: {
      // Removed fields - provide sensible defaults
      company_size: 'not-specified',
      monthly_lead_goal: 0, // Backend can ignore or set default
      primary_objective: 'lead-generation', // Reasonable default
      challenges: [], // No longer collected
      
      // Still collected fields
      target_company_sizes: data.target_company_sizes || [],
      communication_channels: ['instagram'], // Platform-specific default
      communication_tone: data.communication_tone,
      
      // Removed fields - defaults
      team_size: 'not-specified',
      campaign_manager: 'not-specified',
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

      return response;
    },

    onSuccess: async (response) => {
      // Update access token if provided
      if (response.access_token) {
        const authManager = (await import('@/core/auth/auth-manager')).authManager;
        const currentTokens = authManager.getTokens();
        
        if (currentTokens) {
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
