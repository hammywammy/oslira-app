// src/features/leads/components/AnalyzeLeadModal.tsx

/**
 * ANALYZE LEAD MODAL - REDESIGNED V2
 * 
 * IMPROVEMENTS:
 * ✅ Blue as accent, not primary color
 * ✅ Auto @ prefix on username input
 * ✅ Clean, minimal design
 * ✅ Better visual hierarchy
 * ✅ Professional color scheme
 */

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { Select } from '@/shared/components/ui/Select';
import { httpClient } from '@/core/auth/http-client';
import { logger } from '@/core/utils/logger';
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
    description: 'Basic profile metrics and engagement scoring',
    credits: 1,
  },
  {
    value: 'deep',
    label: 'Deep Analysis',
    description: 'Detailed insights + outreach template',
    credits: 2,
  },
  {
    value: 'xray',
    label: 'X-Ray Analysis',
    description: 'Complete psychological profile + strategy',
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

  // Auto-add @ prefix for display
  const displayUsername = rawInput && !rawInput.startsWith('@') ? `@${rawInput}` : rawInput;

  // ===========================================================================
  // VALIDATION
  // ===========================================================================

  const validateUsername = (value: string): string | null => {
    const cleaned = value.replace(/^@/, '').trim();

    if (!cleaned) {
      return 'Please enter a username';
    }

    if (cleaned.length < 1 || cleaned.length > 30) {
      return 'Username must be 1-30 characters';
    }

    const validCharsRegex = /^[a-zA-Z0-9._]+$/;
    if (!validCharsRegex.test(cleaned)) {
      return 'Only letters, numbers, periods, and underscores allowed';
    }

    if (cleaned.startsWith('.') || cleaned.endsWith('.') || cleaned.includes('..')) {
      return 'Invalid period placement';
    }

    return null;
  };

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/^@/, ''); // Strip @ if user types it
    setRawInput(value);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    const cleanUsername = rawInput.replace(/^@/, '').trim();
    const validationError = validateUsername(cleanUsername);
    if (validationError) {
      setError(validationError);
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
      onClose();
    }
  };

  // ===========================================================================
  // DERIVED STATE
  // ===========================================================================

  const selectedOption = ANALYSIS_OPTIONS.find((opt) => opt.value === analysisType);
  const totalCost = selectedOption?.credits || 1;
  const canSubmit = rawInput.trim().length > 0 && !isLoading;

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <Modal open={isOpen} onClose={handleClose} size="md" closeable={!isLoading}>
      <Modal.Header>Research New Lead</Modal.Header>

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

          {/* Platform Selector */}
          <div>
            <Label htmlFor="platform">Platform</Label>
            <Select id="platform" value="instagram" disabled className="mt-2">
              <option value="instagram">Instagram</option>
            </Select>
          </div>

          {/* Username Input with @ Display */}
          <div>
            <Label htmlFor="username">Username or Profile URL</Label>
            <div className="mt-2 relative">
              <Input
                id="username"
                type="text"
                placeholder="hamzawilx"
                value={rawInput}
                onChange={handleInputChange}
                disabled={isLoading}
                autoFocus
                className={`${error ? 'border-red-500 focus:ring-red-500' : ''} ${rawInput ? 'pl-7' : ''}`}
              />
              {/* @ Prefix Display */}
              {rawInput && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="text-foreground font-medium">@</span>
                </div>
              )}
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Type the handle without the @ symbol
            </p>
            {/* Preview what will be analyzed */}
            {rawInput && (
              <p className="mt-1 text-xs text-muted-foreground">
                Will analyze: <span className="font-medium text-foreground">{displayUsername}</span>
              </p>
            )}
          </div>

          {/* Analysis Type */}
          <div>
            <Label>Analysis Type</Label>
            <div className="mt-3 space-y-2">
              {ANALYSIS_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-start gap-3 p-4 border rounded-lg cursor-pointer
                    transition-all duration-150
                    ${
                      analysisType === option.value
                        ? 'border-foreground bg-muted/30'
                        : 'border-border hover:border-muted-foreground/50 hover:bg-muted/10'
                    }
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <input
                    type="radio"
                    name="analysisType"
                    value={option.value}
                    checked={analysisType === option.value}
                    onChange={(e) => setAnalysisType(e.target.value as AnalysisType)}
                    disabled={isLoading}
                    className="mt-1 w-4 h-4 text-foreground border-border focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-foreground">{option.label}</span>
                      <span className="text-xs px-2 py-0.5 bg-muted border border-border rounded-full text-muted-foreground">
                        {option.credits} credit{option.credits !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Cost Summary */}
          <div className="p-4 bg-muted/20 rounded-lg border border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total cost:</span>
              <span className="font-semibold text-foreground">
                {totalCost} credit{totalCost !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="min-w-[140px]"
        >
          {isLoading ? (
            <>
              <Icon icon="ph:spinner" className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Start Research'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
