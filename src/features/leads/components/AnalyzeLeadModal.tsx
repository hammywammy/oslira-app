// src/features/leads/components/AnalyzeLeadModal.tsx

/**
 * ANALYZE LEAD MODAL - V3.0 REDESIGN
 * 
 * DESIGN PHILOSOPHY:
 * ✅ Blue as 10% accent (hover states, icons, subtle highlights)
 * ✅ Visual hierarchy with spacing and typography
 * ✅ Styled analysis cards with colored left borders
 * ✅ Prominent cost display
 * ✅ Real-time validation feedback
 * ✅ Instagram-only (no platform selector clutter)
 * 
 * FEATURES:
 * ✅ Auto @ prefix display
 * ✅ Instagram username validation
 * ✅ Smart placeholder: @instagramhandle
 * ✅ Analysis type cards with visual distinction
 * ✅ Clean, professional layout
 */

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { Label } from '@/shared/components/ui/Label';
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
  borderColor: string;
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
    icon: 'ph:lightning',
    borderColor: 'border-l-amber-400',
  },
  {
    value: 'deep',
    label: 'Deep Analysis',
    description: 'Detailed insights + outreach template',
    credits: 2,
    icon: 'ph:brain',
    borderColor: 'border-l-purple-400',
  },
  {
    value: 'xray',
    label: 'X-Ray Analysis',
    description: 'Complete psychological profile + strategy',
    credits: 3,
    icon: 'ph:target',
    borderColor: 'border-l-primary-500',
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
  const [validationError, setValidationError] = useState<string | null>(null);

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/^@/, ''); // Strip @ if user types it
    setRawInput(value);
    
    // Clear errors on change
    if (error) setError(null);
    if (validationError) setValidationError(null);

    // Real-time validation feedback (only if they've typed something)
    if (value.trim().length > 0) {
      const validation = validateInstagramUsername(value);
      if (!validation.valid) {
        setValidationError(validation.error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationError(null);

    // Validate
    const cleanUsername = rawInput.replace(/^@/, '').trim();
    const validation = validateInstagramUsername(cleanUsername);
    
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }

    if (!businessProfileId) {
      setError('No business profile selected');
      return;
    }

    setIsLoading(true);

    try {
      logger.info('[AnalyzeLeadModal] Starting analysis', {
        username: cleanUsername,
        analysisType,
        businessProfileId,
      });

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
      setValidationError(null);
      onClose();
    }
  };

  // ===========================================================================
  // DERIVED STATE
  // ===========================================================================

  const selectedOption = ANALYSIS_OPTIONS.find((opt) => opt.value === analysisType);
  const totalCost = selectedOption?.credits || 1;
  const displayUsername = rawInput ? `@${rawInput}` : '';
  const canSubmit = rawInput.trim().length > 0 && !validationError && !isLoading;

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <Modal open={isOpen} onClose={handleClose} size="md" closeable={!isLoading}>
      {/* Header */}
      <Modal.Header>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <Icon icon="ph:magnifying-glass-bold" className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Research New Lead</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Analyze an Instagram profile</p>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Icon icon="ph:warning-circle" className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          )}

          {/* Username Input */}
          <div>
            <Label htmlFor="username" className="text-sm font-medium text-foreground mb-2">
              Instagram Handle
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="text-muted-foreground text-base font-medium">@</span>
              </div>
              <input
                id="username"
                type="text"
                placeholder="instagramhandle"
                value={rawInput}
                onChange={handleInputChange}
                disabled={isLoading}
                autoFocus
                className={`
                  w-full h-11 pl-8 pr-4 
                  bg-white dark:bg-neutral-900
                  border rounded-lg
                  text-base text-foreground placeholder:text-muted-foreground
                  transition-all duration-150
                  focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    validationError
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-border hover:border-muted-foreground/50'
                  }
                `}
              />
            </div>
            
            {/* Validation Feedback */}
            {validationError ? (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <Icon icon="ph:warning-circle" className="w-3 h-3" />
                {validationError}
              </p>
            ) : rawInput ? (
              <p className="mt-1.5 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <Icon icon="ph:check-circle" className="w-3 h-3" />
                Will analyze: <span className="font-medium">{displayUsername}</span>
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-muted-foreground">
                Enter the username without the @ symbol
              </p>
            )}
          </div>

          {/* Analysis Type Selection */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-3">
              Analysis Depth
            </Label>
            <div className="space-y-2">
              {ANALYSIS_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`
                    group relative flex items-start gap-3 p-4 pl-5 border-l-4 border-r border-t border-b
                    rounded-lg cursor-pointer transition-all duration-150
                    ${
                      analysisType === option.value
                        ? `${option.borderColor} bg-muted/30 border-r-foreground/20 border-t-foreground/20 border-b-foreground/20`
                        : 'border-l-transparent border-r-border border-t-border border-b-border hover:border-l-muted-foreground/30 hover:bg-muted/10'
                    }
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {/* Radio Input */}
                  <input
                    type="radio"
                    name="analysisType"
                    value={option.value}
                    checked={analysisType === option.value}
                    onChange={(e) => setAnalysisType(e.target.value as AnalysisType)}
                    disabled={isLoading}
                    className="mt-1 w-4 h-4 text-foreground border-border focus:ring-primary-500"
                  />

                  {/* Icon */}
                  <div className={`
                    flex-shrink-0 p-1.5 rounded-lg transition-colors
                    ${analysisType === option.value ? 'bg-background' : 'bg-transparent group-hover:bg-background'}
                  `}>
                    <Icon 
                      icon={option.icon} 
                      className={`
                        w-5 h-5 transition-colors
                        ${analysisType === option.value ? 'text-foreground' : 'text-muted-foreground'}
                      `}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">
                        {option.label}
                      </span>
                      <span className={`
                        inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
                        ${
                          analysisType === option.value
                            ? 'bg-foreground text-background'
                            : 'bg-muted border border-border text-foreground'
                        }
                      `}>
                        <Icon icon="ph:coin" className="w-3 h-3" />
                        {option.credits}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Cost Summary - More Prominent */}
          <div className="p-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon icon="ph:wallet" className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Total cost</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icon icon="ph:coin" className="w-5 h-5 text-amber-500" />
                <span className="text-lg font-bold text-foreground">
                  {totalCost}
                </span>
                <span className="text-xs text-muted-foreground ml-0.5">
                  credit{totalCost !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>

      {/* Footer */}
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={handleClose} 
          disabled={isLoading}
          className="min-w-[100px]"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!canSubmit}
          isLoading={isLoading}
          className="min-w-[140px]"
        >
          {isLoading ? (
            <>
              <Icon icon="ph:spinner" className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Icon icon="ph:magnifying-glass-bold" className="w-4 h-4" />
              Start Research
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
