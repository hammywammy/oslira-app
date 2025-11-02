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

      if (response.success && response.data) {
        setBusinessProfiles(response.data);
        
        // Auto-select first profile
        if (response.data.length > 0) {
          setSelectedProfileId(response.data[0].id);
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

  const displayUsername = rawInput ? `@${rawInput}` : '';
  const selectedOption = ANALYSIS_OPTIONS.find(opt => opt.value === analysisType);

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <Modal open={isOpen} onClose={handleClose} size="md" closeable={!isSubmitting}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <Icon icon="ph:magnifying-glass-bold" className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">Research New Lead</h2>
            <p className="text-sm text-muted-foreground">
              Analyze an Instagram profile and get actionable insights
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
              <Icon icon="ph:warning-circle-fill" className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Business Profile Selector */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Business Profile
            </label>
            
            {isLoadingProfiles ? (
              <div className="h-11 border-2 border-border rounded-lg flex items-center justify-center gap-2 text-muted-foreground">
                <Icon icon="ph:spinner" className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading profiles...</span>
              </div>
            ) : businessProfiles.length === 0 ? (
              <div className="p-3 border-2 border-border rounded-lg bg-muted/30 text-sm text-muted-foreground">
                No business profiles found
              </div>
            ) : (
              <select
                value={selectedProfileId}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                disabled={isSubmitting}
                className="w-full h-11 px-3 border-2 border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Platform (Fixed to Instagram) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Platform
            </label>
            <div className="h-11 px-4 border-2 border-border rounded-lg bg-muted/20 flex items-center gap-3">
              <Icon icon="ph:instagram-logo" className="w-5 h-5 text-[#E4405F]" />
              <span className="text-sm font-medium text-foreground">Instagram</span>
            </div>
          </div>

          {/* Instagram Handle */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Instagram Handle
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="text-base font-medium text-muted-foreground">@</span>
              </div>
              <input
                type="text"
                value={rawInput}
                onChange={handleInputChange}
                placeholder="hamzawilx"
                disabled={isSubmitting}
                className="w-full h-11 pl-9 pr-4 border-2 border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {displayUsername && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <a
                    href={`https://instagram.com/${rawInput}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    {displayUsername}
                  </a>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Enter the username without the @ symbol
            </p>
          </div>

          {/* Analysis Depth */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Choose Analysis Depth
            </label>
            <div className="space-y-2.5">
              {ANALYSIS_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`
                    group relative flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all
                    ${
                      analysisType === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground/30 hover:bg-muted/30'
                    }
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
                    className="sr-only"
                  />
                  
                  {/* Radio Circle */}
                  <div className={`
                    flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${
                      analysisType === option.value
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground/30'
                    }
                  `}>
                    {analysisType === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>

                  {/* Icon */}
                  <div className={`
                    flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br ${option.gradient} flex items-center justify-center shadow-md
                  `}>
                    <Icon icon={option.icon} className="w-5 h-5 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {option.label}
                      </span>
                      <span className={`
                        inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                        ${
                          analysisType === option.value
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }
                      `}>
                        <Icon icon="ph:coin-fill" className="w-3 h-3" />
                        {option.credits}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {option.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Cost Summary */}
          {selectedOption && (
            <div className="p-4 bg-muted/30 border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Total Cost</span>
                <div className="flex items-center gap-2">
                  <Icon icon="ph:coin-fill" className="w-4 h-4 text-amber-500" />
                  <span className="text-base font-bold text-foreground">
                    {selectedOption.credits} {selectedOption.credits === 1 ? 'credit' : 'credits'}
                  </span>
                </div>
              </div>
            </div>
          )}

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
              className="shadow-lg shadow-primary/20"
            >
              <Icon icon="ph:magnifying-glass-bold" className="w-4 h-4" />
              {isSubmitting ? 'Starting...' : 'Start Research'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
