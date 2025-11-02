// src/features/leads/components/BulkUploadModal.tsx

/**
 * BULK UPLOAD MODAL - V4.0 CLEAN REDESIGN
 * 
 * DESIGN INSPIRED BY CLEANER AESTHETIC:
 * ✅ Minimalist, clean layout
 * ✅ Simple file upload without heavy decoration
 * ✅ Radio buttons with simple labels
 * ✅ Professional color palette
 * ✅ Removed visual clutter
 * ✅ Focus on clarity and functionality
 */

import { useState, useRef } from 'react';
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

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (jobId: string, count: number) => void;
  businessProfileId?: string;
  currentCredits?: number;
}

interface ParsedFile {
  filename: string;
  usernames: string[];
  duplicatesRemoved: number;
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

const MAX_LEADS = 50;

// =============================================================================
// COMPONENT
// =============================================================================

export function BulkUploadModal({
  isOpen,
  onClose,
  onSuccess,
  businessProfileId,
  currentCredits = 0,
}: BulkUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedFile, setParsedFile] = useState<ParsedFile | null>(null);
  const [analysisType, setAnalysisType] = useState<AnalysisType>('light');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===========================================================================
  // FILE PARSING
  // ===========================================================================

  const parseCSVFile = (file: File) => {
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0);

        // Clean and validate usernames
        const rawUsernames = lines.map((line) => line.replace(/^@/, '').trim());
        const validUsernames: string[] = [];

        rawUsernames.forEach((username) => {
          const validation = validateInstagramUsername(username);
          if (validation.valid) {
            validUsernames.push(username);
          }
        });

        if (validUsernames.length === 0) {
          setError('No valid usernames found in file');
          return;
        }

        if (validUsernames.length > MAX_LEADS) {
          setError(`Maximum ${MAX_LEADS} leads allowed. Your file contains ${validUsernames.length} usernames.`);
          return;
        }

        // Remove duplicates
        const uniqueUsernames = [...new Set(validUsernames)];
        const duplicatesRemoved = validUsernames.length - uniqueUsernames.length;

        setParsedFile({
          filename: file.name,
          usernames: uniqueUsernames,
          duplicatesRemoved,
        });

        logger.info('[BulkUploadModal] File parsed', {
          filename: file.name,
          validCount: uniqueUsernames.length,
        });
      } catch (err) {
        logger.error('[BulkUploadModal] Parse failed', err as Error);
        setError('Failed to parse CSV file');
      }
    };
    reader.readAsText(file);
  };

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseCSVFile(file);
  };

  const handleRemoveFile = () => {
    setParsedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!parsedFile || !businessProfileId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await httpClient.post<{ success: boolean; job_id: string }>(
        '/v1/leads/bulk-analyze',
        {
          platform: 'instagram',
          usernames: parsedFile.usernames,
          analysis_type: analysisType,
          business_profile_id: businessProfileId,
        }
      );

      if (response.success && response.job_id) {
        logger.info('[BulkUploadModal] Bulk analysis started', { jobId: response.job_id });

        if (onSuccess) {
          onSuccess(response.job_id, parsedFile.usernames.length);
        }

        handleClose();
      } else {
        throw new Error('Bulk analysis failed to start');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bulk analysis failed';
      logger.error('[BulkUploadModal] Error', err as Error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setParsedFile(null);
      setAnalysisType('light');
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
    }
  };

  // ===========================================================================
  // CALCULATIONS
  // ===========================================================================

  const selectedOption = ANALYSIS_OPTIONS.find((opt) => opt.value === analysisType);
  const costPerLead = selectedOption?.credits || 1;
  const totalCost = parsedFile ? parsedFile.usernames.length * costPerLead : 0;
  const creditsAfter = currentCredits - totalCost;
  const hasInsufficientCredits = creditsAfter < 0;
  const canSubmit = parsedFile && !hasInsufficientCredits && !isLoading;

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <Modal open={isOpen} onClose={handleClose} size="md" closeable={!isLoading}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">Bulk Upload</h2>
          <p className="text-sm text-muted-foreground mt-1">Upload a CSV file with Instagram usernames</p>
        </div>

        <div className="space-y-5">
          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-800 dark:text-red-200">
              {error}
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              CSV File
            </label>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              disabled={isLoading}
              className="hidden"
            />

            {!parsedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-md p-8 text-center cursor-pointer hover:border-muted-foreground/50 hover:bg-muted/5 transition-colors"
              >
                <Icon icon="mdi:file-upload-outline" className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-foreground font-medium mb-1">Click to upload CSV</p>
                <p className="text-xs text-muted-foreground">Max {MAX_LEADS} usernames • One username per line</p>
              </div>
            ) : (
              <div className="border border-border rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Icon icon="mdi:file-delimited-outline" className="w-5 h-5 text-foreground flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground truncate">
                      {parsedFile.filename}
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    disabled={isLoading}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <Icon icon="mdi:close" className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{parsedFile.usernames.length} usernames</span>
                  {parsedFile.duplicatesRemoved > 0 && (
                    <span>{parsedFile.duplicatesRemoved} duplicates removed</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Analysis Type (only show if file uploaded) */}
          {parsedFile && (
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
          )}

          {/* Cost Summary (only show if file uploaded) */}
          {parsedFile && (
            <div className="p-4 bg-muted/30 rounded-md">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium">Total Cost</span>
                <span className="text-foreground font-semibold">
                  {totalCost} {totalCost === 1 ? 'credit' : 'credits'}
                </span>
              </div>
              {hasInsufficientCredits && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                  Insufficient credits. You have {currentCredits} credits but need {totalCost}.
                </p>
              )}
            </div>
          )}

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
              type="button"
              variant="primary"
              onClick={handleSubmit}
              disabled={!canSubmit}
              isLoading={isLoading}
            >
              {isLoading ? 'Starting Analysis...' : 'Start Analysis'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
