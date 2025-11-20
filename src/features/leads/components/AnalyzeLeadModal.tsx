// src/features/leads/components/AnalyzeLeadModal.tsx

/**
 * ANALYZE LEAD MODAL - V7.0 ASYNC WITH PROGRESS
 * 
 * CHANGES FROM V6.0:
 * ✅ Returns run_id instead of lead_id
 * ✅ Shows real-time progress tracking
 * ✅ Polls analysis progress every 1 second
 * ✅ Calls onSuccess(lead_id) when complete
 * ✅ Matches onboarding async pattern
 */

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { httpClient } from '@/core/auth/http-client';
import { logger } from '@/core/utils/logger';
import { validateInstagramUsername } from '@/shared/utils/validation';
import { useAnalysisProgress } from '@/features/analysis/hooks/useAnalysisProgress';
import { AnalysisProgressTracker } from '@/features/analysis/components/AnalysisProgressTracker';
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
  // Form state
  const [rawInput, setRawInput] = useState('');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('light');
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  
  // Loading states
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Analysis tracking
  const [runId, setRunId] = useState<string | null>(null);

// Progress polling hook
  const { progress, isPolling, error: progressError } = useAnalysisProgress({
    runId,
    onComplete: (leadId) => {
      logger.info('[AnalyzeLeadModal] Analysis complete', {
        leadId,
        runId
      });
      onSuccess?.(leadId);
      handleClose();
    },
    onError: (error) => {
      logger.error('[AnalyzeLeadModal] Analysis failed', new Error(error), {
        errorMessage: error,
        runId
      });
      setError(error);
      setIsSubmitting(false);
      setRunId(null);
    },
  });

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
      // Request returns run_id, not lead_id
      const response = await httpClient.post<{ 
        success: boolean; 
        data?: { 
          run_id: string;
          status: string;
          message: string;
          progress_url: string;
          cancel_url: string;
        };
      }>(
        '/api/leads/analyze',
        {
          username: cleanUsername,
          businessProfileId: selectedProfileId,
          analysisType: analysisType,
        }
      );

      if (response.success && response.data?.run_id) {
        logger.info('[AnalyzeLeadModal] Analysis started', { 
          runId: response.data.run_id,
          username: cleanUsername,
        });
        
        // Trigger progress polling
        setRunId(response.data.run_id);
        
        // Don't close modal - show progress tracker instead
      } else {
        throw new Error('Analysis failed to start');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      logger.error('[AnalyzeLeadModal] Analysis error', err as Error);
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isPolling) {
      setRawInput('');
      setAnalysisType('light');
      setError(null);
      setRunId(null);
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
    !isLoadingProfiles &&
    !isPolling;

  // Show progress tracker when polling (even if progress is null during initialization)
  const showProgressTracker = isPolling;
  const showForm = !showProgressTracker;

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <Modal 
      open={isOpen} 
      onClose={handleClose} 
      size="md" 
      closeable={!isSubmitting && !isPolling}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-1">
            {showProgressTracker ? 'Analyzing Lead' : 'Research New Lead'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {showProgressTracker 
              ? 'Please wait while we analyze this Instagram profile'
              : 'Analyze an Instagram profile and get actionable insights'
            }
          </p>
        </div>

        {/* Progress Tracker */}
        {showProgressTracker && (
          <>
            {progress ? (
              <AnalysisProgressTracker
                progress={progress.progress}
                currentStep={progress.current_step}
                status={progress.status}
                error={progressError}
              />
            ) : (
              // Show loading state during workflow initialization (first 10s)
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Icon icon="ph:spinner" className="w-5 h-5 text-blue-600 animate-spin" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Starting analysis...
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Initializing workflow
                    </p>
                  </div>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 animate-pulse" style={{ width: '20%' }} />
                </div>
              </div>
            )}
          </>
        )}

        {/* Form */}
        {showForm && (
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
                <div className="h-10 border border-border rounded-lg flex items-center justify-center text-sm text-muted-foreground bg-muted/20">
                  No profiles found
                </div>
              ) : (
                <select
                  value={selectedProfileId}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  className="w-full h-10 px-3 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {businessProfiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.business_name}
                      {profile.business_one_liner && ` • ${profile.business_one_liner}`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Instagram Username Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Instagram Username
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  @
                </div>
                <input
                  type="text"
                  value={rawInput}
                  onChange={handleInputChange}
                  placeholder="username"
                  className="w-full h-10 pl-8 pr-3 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Analysis Type Selector */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Analysis Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ANALYSIS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setAnalysisType(option.value)}
                    className={`
                      relative p-4 border rounded-lg text-left transition-all
                      ${analysisType === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-background hover:border-primary/50'
                      }
                    `}
                    disabled={isSubmitting}
                  >
                    {/* Selection indicator */}
                    {analysisType === option.value && (
                      <div className="absolute top-2 right-2">
                        <Icon
                          icon="ph:check-circle-fill"
                          className="w-5 h-5 text-primary"
                        />
                      </div>
                    )}

                    {/* Icon */}
                    <Icon
                      icon={option.icon}
                      className={`w-6 h-6 mb-2 ${option.color}`}
                    />

                    {/* Title */}
                    <div className="font-medium text-sm text-foreground mb-1">
                      {option.label}
                    </div>

                    {/* Description */}
                    <div className="text-xs text-muted-foreground mb-2">
                      {option.description}
                    </div>

                    {/* Credits */}
                    <div className="text-xs font-medium text-muted-foreground">
                      {option.credits} {option.credits === 1 ? 'credit' : 'credits'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!canSubmit}
                className="flex-1"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Icon icon="ph:spinner" className="w-4 h-4 animate-spin" />
                    Starting...
                  </span>
                ) : (
                  'Start Analysis'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
