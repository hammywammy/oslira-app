// src/features/leads/components/AnalyzeLeadModal.tsx

/**
 * ANALYZE LEAD MODAL - V5.0 WITH PERSONALITY
 * 
 * IMPROVEMENTS:
 * ✅ Larger modal size for better presence
 * ✅ Colorful, engaging design with personality
 * ✅ Visual @ prefix in input (user types on top)
 * ✅ Instagram icon + branding
 * ✅ Gradient accents and modern styling
 * ✅ Better visual hierarchy
 * ✅ More engaging copy
 */

import { useState } from 'react';
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
  businessProfileId?: string;
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
  {
    value: 'xray',
    label: 'X-Ray Analysis',
    description: 'Complete psychological profile + strategy',
    credits: 3,
    icon: 'ph:atom-fill',
    color: 'text-emerald-600',
    gradient: 'from-emerald-500 to-teal-500',
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export function AnalyzeLeadModal({
  isOpen,
  onClose,
  onSuccess,
  businessProfileId,
}: AnalyzeLeadModalProps) {
  const [rawInput, setRawInput] = useState('');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('light');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    if (!businessProfileId) {
      setError('No business profile selected');
      return;
    }

    setIsLoading(true);

    try {
      const response = await httpClient.post<{ success: boolean; lead_id: string }>(
        '/v1/leads/analyze',
        {
          platform: 'instagram',
          username: cleanUsername,
          analysis_type: analysisType,
          business_profile_id: businessProfileId,
        }
      );

      if (response.success && response.lead_id) {
        logger.info('[AnalyzeLeadModal] Analysis started', { leadId: response.lead_id });
        
        if (onSuccess) {
          onSuccess(response.lead_id);
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
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setRawInput('');
      setAnalysisType('light');
      setError(null);
      onClose();
    }
  };

  // ===========================================================================
  // DERIVED STATE
  // ===========================================================================

  const canSubmit = rawInput.trim().length > 0 && !isLoading;
  const displayUsername = rawInput ? `@${rawInput}` : '';
  const selectedOption = ANALYSIS_OPTIONS.find((opt) => opt.value === analysisType);

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <Modal open={isOpen} onClose={handleClose} size="lg" closeable={!isLoading}>
      <div className="p-8">
        {/* Header with Icon */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Icon icon="ph:magnifying-glass-bold" className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-1">Research New Lead</h2>
            <p className="text-sm text-muted-foreground">Analyze an Instagram profile and get actionable insights</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
              <Icon icon="ph:warning-circle-fill" className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Platform Display (Instagram with icon) */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Platform
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon icon="mdi:instagram" className="w-5 h-5 text-pink-500" />
              </div>
              <input
                type="text"
                value="Instagram"
                disabled
                className="w-full h-12 pl-12 pr-4 bg-muted/50 border border-border rounded-xl text-sm font-medium text-foreground cursor-not-allowed"
              />
            </div>
          </div>

          {/* Username Input with @ prefix */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-foreground mb-2">
              Instagram Handle
            </label>
            <div className="relative">
              {/* @ Symbol Display */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                <span className="text-lg font-semibold text-muted-foreground">@</span>
              </div>
              {/* Input Field */}
              <input
                id="username"
                type="text"
                placeholder="kjrdney"
                value={rawInput}
                onChange={handleInputChange}
                disabled={isLoading}
                autoFocus
                className="w-full h-12 pl-9 pr-4 bg-background border-2 border-border rounded-xl text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-50"
              />
              {/* Live Preview */}
              {displayUsername && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                    {displayUsername}
                  </span>
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Enter the username without the @ symbol
            </p>
          </div>

          {/* Analysis Type Cards */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Choose Analysis Depth
            </label>
            <div className="space-y-3">
              {ANALYSIS_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`
                    group relative flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all
                    ${
                      analysisType === option.value
                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                        : 'border-border hover:border-muted-foreground/30 hover:bg-muted/30'
                    }
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {/* Radio */}
                  <input
                    type="radio"
                    name="analysisType"
                    value={option.value}
                    checked={analysisType === option.value}
                    onChange={(e) => setAnalysisType(e.target.value as AnalysisType)}
                    disabled={isLoading}
                    className="mt-1 w-5 h-5 text-primary border-2 border-border focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  />

                  {/* Icon with Gradient */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${option.gradient} flex items-center justify-center shadow-md`}>
                    <Icon icon={option.icon} className="w-5 h-5 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-base font-semibold text-foreground">{option.label}</h4>
                      <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded-full text-xs font-bold text-foreground">
                        <Icon icon="ph:lightning-fill" className="w-3 h-3" />
                        {option.credits}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Total Cost Display */}
          {selectedOption && (
            <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/30 border border-border rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Total Cost</span>
                <div className="flex items-center gap-2">
                  <Icon icon="ph:coins-fill" className="w-5 h-5 text-amber-500" />
                  <span className="text-lg font-bold text-foreground">
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
              disabled={isLoading}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!canSubmit}
              isLoading={isLoading}
              className="px-8 shadow-lg shadow-primary/20"
            >
              <Icon icon="ph:magnifying-glass-bold" className="w-4 h-4" />
              {isLoading ? 'Starting Research...' : 'Start Research'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
