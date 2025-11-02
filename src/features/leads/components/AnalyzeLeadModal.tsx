// src/features/leads/components/AnalyzeLeadModal.tsx

/**
 * ANALYZE LEAD MODAL - V6.0 SIMPLIFIED
 * 
 * CHANGES:
 * ✅ Auto-fetches business profiles on mount
 * ✅ Dropdown selector for business profiles
 * ✅ Light + Deep analysis only (X-Ray removed)
 * ✅ Simplified, cleaner design
 * ✅ Better error handling and loading states
 */

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { httpClient } from '@/core/auth/http-client';
import { logger } from '@/core/utils/logger';
import { validateInstagramUsername } from '@/shared/utils/validation';
import type { AnalysisType } from '@/shared/types/leads.types';

// =============================================================================
// TYPES
// =============================================================================

interface AnalyzeLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (leadId: string) => void;
}

interface AnalysisOption {
  value: AnalysisType;
  label: string;
  description: string;
  credits: number;
  icon: string;
  color: string;
  gradient: string;
}

interface BusinessProfile {
  id: string;
  business_name: string;
  business_one_liner: string | null;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const ANALYSIS_OPTIONS: AnalysisOption[] = [
  {
    value: 'light',
    label: 'Light Analysis',
    description: 'Basic profile metrics and engagement scoring',
    credits: 1,
    icon: 'ph:lightning-fill',
    color: 'text-amber-600',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    value: 'deep',
    label: 'Deep Analysis',
    description: 'Detailed insights + outreach template',
    credits: 2,
    icon: 'ph:brain-fill',
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-indigo-500',
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export function AnalyzeLeadModal({
  isOpen,
  onClose,
  onSuccess,
}: AnalyzeLeadModalProps) {
  const [rawInput, setRawInput] = useState('');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('light');
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===========================================================================
  // FETCH BUSINESS PROFILES ON MOUNT
  // ===========================================================================

  useEffect(() => {
    if (isOpen) {
      fetchBusinessProfiles();
    }
  }, [isOpen]);

  const fetchBusinessProfiles = async () => {
    setIsLoadingProfiles(true);
    setError(null);

    try {
      const response = await httpClient.get<{
        success: boolean;
        data?: BusinessProfile[];
      }>('/api/business-profiles?page=1&pageSize=50');

      if (response.success && response.data && Array.isArray(response.data)) {
        setBusinessProfiles(response.data);
        
        // Auto-select first profile
        const firstProfile = response.data[0];
        if (firstProfile) {
          setSelectedProfileId(firstProfile.id);
        } else {
          setError('No business profile found. Please complete onboarding first.');
        }
      } else {
        throw new Error('Failed to fetch business profiles');
      }
    } catch (err) {
      logger.error('[AnalyzeLeadModal] Failed to fetch profiles', err as Error);
      setError('Unable to load business profiles. Please refresh and try again.');
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/^@/, '');
    setRawInput(value);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = rawInput.replace(/^@/, '').trim();
    const validation = validateInstagramUsername(cleanUsername);
    
    if (!validation.valid) {
      setError(validation.error || 'Invalid username');
      return;
    }

    if (!selectedProfileId) {
      setError('Please select a business profile');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await httpClient.post<{ 
        success: boolean; 
        data?: { lead_id: string };
      }>(
        '/api/leads/analyze',
        {
          username: cleanUsername,
          businessProfileId: selectedProfileId,
          analysisType: analysisType,
        }
      );

      if (response.success && response.data?.lead_id) {
        logger.info('[AnalyzeLeadModal] Analysis started', { 
          leadId: response.data.lead_id 
        });
        
        if (onSuccess) {
          onSuccess(response.data.lead_id);
        }

        handleClose();
      } else {
        throw new Error('Analysis failed to start');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      logger.error('[AnalyzeLeadModal] Analysis error', err as Error);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRawInput('');
      setAnalysisType('light');
      setError(null);
      onClose();
    }
  };

  // ===========================================================================
  // DERIVED STATE
  // ===========================================================================

  const canSubmit = 
    rawInput.trim().length > 0 && 
    selectedProfileId && 
    !isSubmitting && 
    !isLoadingProfiles;

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <Modal open={isOpen} onClose={handleClose} size="md" closeable={!isSubmitting}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-1">Research New Lead</h2>
          <p className="text-sm text-muted-foreground">
            Analyze an Instagram profile and get actionable insights
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Business Profile Selector */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Business Profile
            </label>
            
            {isLoadingProfiles ? (
              <div className="h-10 border border-border rounded-lg flex items-center justify-center gap-2 text-muted-foreground bg-muted/20">
                <Icon icon="ph:spinner" className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : businessProfiles.length === 0 ? (
              <div className="p-3 border border-border rounded-lg bg-muted/20 text-sm text-muted-foreground">
                No business profiles found
              </div>
            ) : (
              <select
                value={selectedProfileId}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                disabled={isSubmitting}
                className="w-full h-10 px-3 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
              >
                {businessProfiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.business_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Instagram Handle */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Instagram Handle
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
              <input
                type="text"
                value={rawInput}
                onChange={handleInputChange}
                placeholder="username"
                disabled={isSubmitting}
                className="w-full h-10 pl-8 pr-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          {/* Analysis Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Analysis Type
            </label>
            <div className="space-y-2">
              {ANALYSIS_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors
                    ${analysisType === option.value ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/30'}
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <input
                    type="radio"
                    name="analysisType"
                    value={option.value}
                    checked={analysisType === option.value}
                    onChange={(e) => setAnalysisType(e.target.value as AnalysisType)}
                    disabled={isSubmitting}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-foreground">{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.credits} {option.credits === 1 ? 'credit' : 'credits'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!canSubmit}
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Starting...' : 'Start Research'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
