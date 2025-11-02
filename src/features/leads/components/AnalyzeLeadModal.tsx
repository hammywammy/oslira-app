// src/features/leads/components/AnalyzeLeadModal.tsx

/**
 * ANALYZE LEAD MODAL - PRODUCTION GRADE
 * 
 * Single lead analysis with Instagram username input
 * Follows Modal.tsx architecture patterns
 * 
 * FEATURES:
 * - Platform selector (Instagram only for now)
 * - Username/URL input with validation
 * - Analysis type selection (Light/Deep/X-Ray)
 * - Real-time credit cost calculation
 * - API integration with http-client
 * - Error handling and loading states
 * 
 * ARCHITECTURE:
 * ✅ Uses shared Modal component
 * ✅ Form validation with error display
 * ✅ API calls through http-client
 * ✅ Event-driven success/error handling
 * ✅ Accessible and keyboard-friendly
 */

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { Select } from '@/shared/components/ui/Select';
import { Radio } from '@/shared/components/ui/Radio';
import { Badge } from '@/shared/components/ui/Badge';
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

interface AnalysisTypeOption {
  value: AnalysisType;
  label: string;
  description: string;
  credits: number;
  color: 'orange' | 'purple' | 'blue';
}

// =============================================================================
// CONSTANTS
// =============================================================================

const ANALYSIS_TYPES: AnalysisTypeOption[] = [
  {
    value: 'light',
    label: 'Light Analysis',
    description: 'Basic profile metrics and engagement scoring',
    credits: 1,
    color: 'orange',
  },
  {
    value: 'deep',
    label: 'Deep Analysis',
    description: 'Detailed insights + outreach template',
    credits: 2,
    color: 'purple',
  },
  {
    value: 'xray',
    label: 'X-Ray Analysis',
    description: 'Complete psychological profile + strategy',
    credits: 3,
    color: 'blue',
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
  const [platform, setPlatform] = useState<'instagram'>('instagram');
  const [username, setUsername] = useState('');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('light');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    const validationError = validateUsername(username);
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
      const cleanUsername = username.replace(/^@/, '').trim();

      logger.info('[AnalyzeLeadModal] Starting analysis', {
        username: cleanUsername,
        analysisType,
        businessProfileId,
      });

      // Call backend API
      const response = await httpClient.post<{ success: boolean; lead_id: string }>(
        '/v1/leads/analyze',
        {
          platform,
          username: cleanUsername,
          analysis_type: analysisType,
          business_profile_id: businessProfileId,
        }
      );

      if (response.success && response.lead_id) {
        logger.info('[AnalyzeLeadModal] Analysis started', { leadId: response.lead_id });
        
        // Success callback
        if (onSuccess) {
          onSuccess(response.lead_id);
        }

        // Close modal
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
      setUsername('');
      setAnalysisType('light');
      setError(null);
      onClose();
    }
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================

  const selectedAnalysis = ANALYSIS_TYPES.find((type) => type.value === analysisType);

  return (
    <Modal open={isOpen} onClose={handleClose} size="md" closeable={!isLoading}>
      <Modal.Header>Research New Lead</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Icon
                  icon="ph:warning-circle"
                  className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0"
                />
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          )}

          {/* Platform Selector */}
          <div>
            <Label htmlFor="platform">Platform</Label>
            <Select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as 'instagram')}
              disabled={isLoading}
            >
              <option value="instagram">Instagram</option>
            </Select>
          </div>

          {/* Username Input */}
          <div>
            <Label htmlFor="username">Username or Profile URL</Label>
            <Input
              id="username"
              type="text"
              placeholder="@username or full URL"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError(null);
              }}
              disabled={isLoading}
              autoFocus
              className={error ? 'border-red-500 focus:ring-red-500' : ''}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Enter an Instagram username or paste a profile URL
            </p>
          </div>

          {/* Analysis Type */}
          <div>
            <Label>Analysis Type</Label>
            <div className="mt-3 space-y-3">
              {ANALYSIS_TYPES.map((type) => (
                <label
                  key={type.value}
                  className={`
                    flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer
                    transition-all duration-200
                    ${
                      analysisType === type.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground/30 hover:bg-muted/30'
                    }
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <Radio
                    name="analysisType"
                    value={type.value}
                    checked={analysisType === type.value}
                    onChange={(e) => setAnalysisType(e.target.value as AnalysisType)}
                    disabled={isLoading}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{type.label}</span>
                      <Badge variant={type.color} size="sm">
                        {type.credits} credit{type.credits !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Credit Summary */}
          {selectedAnalysis && (
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total cost:</span>
                <span className="font-semibold text-foreground">
                  {selectedAnalysis.credits} credit{selectedAnalysis.credits !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading || !username.trim()}
          className="min-w-[140px]"
        >
          {isLoading ? (
            <>
              <Icon icon="ph:spinner" className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Icon icon="ph:magnifying-glass" className="w-4 h-4" />
              Start Research
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
