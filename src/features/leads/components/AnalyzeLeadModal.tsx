// src/features/leads/components/AnalyzeLeadModal.tsx

/**
 * ANALYZE LEAD MODAL - V4.0 CLEAN REDESIGN
 * 
 * DESIGN INSPIRED BY IMAGE 2:
 * ✅ Minimalist, clean layout
 * ✅ Simple dropdown-style platform selector (even though Instagram only)
 * ✅ Clean text input without heavy decoration
 * ✅ Radio buttons with simple labels and credit display
 * ✅ Professional color palette integration
 * ✅ Removed visual clutter (icons, borders, heavy cards)
 * ✅ Focus on clarity and simplicity
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
}

// =============================================================================
// CONSTANTS
// =============================================================================

const ANALYSIS_OPTIONS: AnalysisOption[] = [
  {
    value: 'light',
    label: 'Light Analysis',
    description: 'Basic profile metrics (1 credit)',
    credits: 1,
  },
  {
    value: 'deep',
    label: 'Deep Analysis',
    description: 'Detailed insights + outreach template (2 credits)',
    credits: 2,
  },
  {
    value: 'xray',
    label: 'X-Ray Analysis',
    description: 'Complete psychological profile (3 credits)',
    credits: 3,
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

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <Modal open={isOpen} onClose={handleClose} size="sm" closeable={!isLoading}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">Research New Lead</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-800 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Platform Selector (Instagram only, but styled as dropdown) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Platform
            </label>
            <div className="relative">
              <select 
                disabled
                className="w-full h-10 px-3 pr-8 bg-background border border-border rounded-md text-sm text-foreground appearance-none cursor-not-allowed opacity-60"
              >
                <option>Instagram</option>
              </select>
              <Icon 
                icon="mdi:chevron-down" 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" 
              />
            </div>
          </div>

          {/* Username Input */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1.5">
              Username or Profile URL
            </label>
            <input
              id="username"
              type="text"
              placeholder="kjrdney"
              value={rawInput}
              onChange={handleInputChange}
              disabled={isLoading}
              autoFocus
              className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:opacity-50"
            />
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
                  className="flex items-start gap-3 p-3 border border-border rounded-md cursor-pointer hover:bg-muted/30 transition-colors"
                >
                  <input
                    type="radio"
                    name="analysisType"
                    value={option.value}
                    checked={analysisType === option.value}
                    onChange={(e) => setAnalysisType(e.target.value as AnalysisType)}
                    disabled={isLoading}
                    className="mt-0.5 w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{option.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{option.description}</div>
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
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!canSubmit}
              isLoading={isLoading}
            >
              {isLoading ? 'Starting Research...' : 'Start Research'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
