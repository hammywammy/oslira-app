// src/features/leads/components/AnalyzeLeadModal.tsx

/**
 * ANALYZE LEAD MODAL - V8.0 PURE INPUT FORM
 *
 * CHANGES FROM V7.0:
 * ✅ Removed all progress tracking (moved to global queue)
 * ✅ Adds optimistic job to queue store immediately
 * ✅ Closes modal immediately after successful API response
 * ✅ Progress tracking handled globally by useActiveAnalyses hook
 */

import { useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { ValidationError } from '@/shared/components/ui/ValidationError';
import { httpClient } from '@/core/auth/http-client';
import { logger } from '@/core/utils/logger';
import { validateInstagramUsername } from '@/shared/utils/validation';
import { useBusinessProfile } from '@/features/business/providers/BusinessProfileProvider';
import { useSelectedBusinessId, useBusinessProfiles } from '@/core/store/selectors';
import { useAnalysisQueueStore } from '@/features/analysis-queue/stores/useAnalysisQueueStore';
import { useCreditsService } from '@/features/credits/hooks/useCreditsService';
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
  // Global state - business profiles
  const businessProfiles = useBusinessProfiles();
  const selectedProfileId = useSelectedBusinessId();
  const { isLoading: isLoadingProfiles, selectProfile } = useBusinessProfile();

  // Queue store for optimistic updates
  const { addOptimisticJob } = useAnalysisQueueStore();

  // Credits service for refreshing balance after analysis starts
  const { refetchBalance } = useCreditsService();

  // Form state
  const [rawInput, setRawInput] = useState('');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('light');

  // Validation state
  const [validationError, setValidationError] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===========================================================================
  // VALIDATION
  // ===========================================================================

  const validateInput = useCallback((value: string): string | null => {
    if (!value.trim()) {
      return null; // Don't show error for empty input until submit
    }
    const result = validateInstagramUsername(value);
    return result.error;
  }, []);

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/^@/, '');
    setRawInput(value);
    setHasInteracted(true);

    // Real-time validation - show error as user types
    const validationResult = validateInput(value);
    setValidationError(validationResult);

    // Clear submission error when user starts typing
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

        // Add optimistic job to queue store
        addOptimisticJob(response.data.run_id, cleanUsername, analysisType);

        // Refresh credits balance immediately (credits are deducted on backend when analysis starts)
        refetchBalance().catch((error) => {
          logger.warn('[AnalyzeLeadModal] Failed to refresh balance after analysis start', error as Error);
        });

        // Call onSuccess if provided
        onSuccess?.(response.data.run_id);

        // Close modal immediately
        handleClose();
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
    if (!isSubmitting) {
      setRawInput('');
      setAnalysisType('light');
      setError(null);
      setValidationError(null);
      setHasInteracted(false);
      setIsSubmitting(false);
      onClose();
    }
  };

  // ===========================================================================
  // DERIVED STATE
  // ===========================================================================

  // Check if input is valid (no validation errors and passes full validation)
  const isInputValid = rawInput.trim().length > 0 && !validationError && validateInstagramUsername(rawInput.trim()).valid;

  const canSubmit =
    isInputValid &&
    selectedProfileId &&
    !isSubmitting &&
    !isLoadingProfiles;

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      size="md"
      closeable={!isSubmitting}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-1">
            Research New Lead
          </h2>
          <p className="text-sm text-muted-foreground">
            Analyze an Instagram profile and get actionable insights
          </p>
        </div>

        {/* Form */}
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
                  value={selectedProfileId || ''}
                  onChange={(e) => selectProfile(e.target.value)}
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
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${validationError && hasInteracted ? 'text-red-500' : 'text-muted-foreground'}`}>
                  @
                </div>
                <input
                  type="text"
                  value={rawInput}
                  onChange={handleInputChange}
                  placeholder="username"
                  className={`
                    w-full h-10 pl-8 pr-3 rounded-lg bg-background text-foreground text-sm
                    focus:outline-none focus:ring-2 transition-colors
                    ${validationError && hasInteracted
                      ? 'border-2 border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/50'
                      : 'border border-border focus:ring-primary focus:border-primary'
                    }
                  `}
                  disabled={isSubmitting}
                  aria-invalid={!!validationError && hasInteracted}
                  aria-describedby={validationError ? 'username-validation-error' : undefined}
                />
              </div>
              {/* Inline Validation Error */}
              <div id="username-validation-error" className="mt-2">
                <ValidationError message={validationError} show={hasInteracted && !!validationError} size="sm" />
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
      </div>
    </Modal>
  );
}
