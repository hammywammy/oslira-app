// src/features/leads/components/BulkUploadModal.tsx

/**
 * BULK UPLOAD MODAL - REDESIGNED V2 WITH FULL INTELLIGENCE
 * 
 * RESTORED FEATURES:
 * ✅ Real-time credit calculation
 * ✅ Duplicate detection and removal
 * ✅ File preview with username list
 * ✅ Comprehensive validation
 * ✅ Insufficient credit warnings
 * ✅ File stats display
 * ✅ Smart error messaging
 * 
 * DESIGN IMPROVEMENTS:
 * ✅ Blue as accent, not primary
 * ✅ Clean, professional layout
 * ✅ Better visual hierarchy
 */

import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { Label } from '@/shared/components/ui/Label';
import { httpClient } from '@/core/auth/http-client';
import { logger } from '@/core/utils/logger';
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
  invalidRemoved: number;
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
    description: 'Basic profile insights',
    credits: 1,
  },
  {
    value: 'deep',
    label: 'Deep Analysis',
    description: 'Detailed behavioral profile',
    credits: 2,
  },
  {
    value: 'xray',
    label: 'X-Ray Analysis',
    description: 'Complete psychological profile',
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
  const [isDragging, setIsDragging] = useState(false);

  // ===========================================================================
  // VALIDATION
  // ===========================================================================

  const validateUsername = (username: string): boolean => {
    const cleaned = username.replace(/^@/, '').trim();

    if (cleaned.length === 0 || cleaned.length > 30) return false;

    const validCharsRegex = /^[a-zA-Z0-9._]+$/;
    if (!validCharsRegex.test(cleaned)) return false;

    if (cleaned.startsWith('.') || cleaned.endsWith('.') || cleaned.includes('..')) {
      return false;
    }

    return true;
  };

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

        // Check for invalid CSV format (columns/separators)
        const invalidLines = lines.filter((line) => {
          return line.includes(',') || line.includes('\t') || line.includes(';');
        });

        if (invalidLines.length > 0) {
          setError('Invalid CSV format. File should contain only usernames, one per line, no columns or separators.');
          return;
        }

        // Clean usernames
        const rawUsernames = lines.map((line) => line.replace(/^@/, '').trim());

        // Separate valid and invalid
        const validUsernames: string[] = [];
        const invalidUsernames: string[] = [];

        rawUsernames.forEach((username) => {
          if (validateUsername(username)) {
            validUsernames.push(username);
          } else {
            invalidUsernames.push(username);
          }
        });

        if (invalidUsernames.length > 0) {
          setError(
            `Found ${invalidUsernames.length} invalid username${invalidUsernames.length !== 1 ? 's' : ''}: ${invalidUsernames.slice(0, 3).join(', ')}${
              invalidUsernames.length > 3 ? '...' : ''
            }`
          );
          return;
        }

        if (validUsernames.length === 0) {
          setError('No valid usernames found in file');
          return;
        }

        // Check max limit
        if (validUsernames.length > MAX_LEADS) {
          setError(`Maximum ${MAX_LEADS} leads allowed. Your file contains ${validUsernames.length} valid usernames.`);
          return;
        }

        // Remove duplicates
        const uniqueUsernames = [...new Set(validUsernames)];
        const duplicatesRemoved = validUsernames.length - uniqueUsernames.length;

        setParsedFile({
          filename: file.name,
          usernames: uniqueUsernames,
          duplicatesRemoved,
          invalidRemoved: invalidUsernames.length,
        });

        logger.info('[BulkUploadModal] File parsed successfully', {
          filename: file.name,
          totalLines: lines.length,
          validUsernames: validUsernames.length,
          uniqueUsernames: uniqueUsernames.length,
          duplicatesRemoved,
          invalidRemoved: invalidUsernames.length,
        });
      } catch (err) {
        logger.error('[BulkUploadModal] CSV parsing failed', err as Error);
        setError('Failed to parse CSV file. Please check the format.');
      }
    };

    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
    };

    reader.readAsText(file);
  };

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setError('Please upload a CSV file');
        return;
      }
      parseCSVFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setError('Please upload a CSV file');
        return;
      }
      parseCSVFile(file);
    }
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
      logger.info('[BulkUploadModal] Starting bulk analysis', {
        count: parsedFile.usernames.length,
        analysisType,
        businessProfileId,
      });

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
      logger.error('[BulkUploadModal] Bulk analysis error', err as Error);
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
    <Modal open={isOpen} onClose={handleClose} size="lg" closeable={!isLoading}>
      <Modal.Header>Bulk Analysis</Modal.Header>

      <Modal.Body>
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Upload a CSV with Instagram usernames to analyze multiple leads at once
          </p>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-2">
                <Icon icon="ph:warning-circle" className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm text-red-800 dark:text-red-200">
                  <p className="font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* File Upload Zone */}
          <div>
            <Label>Upload CSV File</Label>
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
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  transition-all duration-200
                  ${
                    isDragging
                      ? 'border-foreground bg-muted/30'
                      : 'border-border hover:border-muted-foreground/50 hover:bg-muted/10'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <Icon icon="ph:upload-simple" className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground mb-1">
                  Drop your CSV here or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Maximum {MAX_LEADS} leads per file • One username per line
                </p>
              </div>
            ) : (
              <div className="mt-2 space-y-3">
                {/* File Info Card */}
                <div className="p-4 bg-muted/20 border border-border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Icon icon="ph:file-csv" className="w-5 h-5 text-foreground mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{parsedFile.filename}</p>
                        <div className="mt-1 space-y-0.5">
                          <p className="text-xs text-muted-foreground">
                            ✓ {parsedFile.usernames.length} valid username{parsedFile.usernames.length !== 1 ? 's' : ''} found
                          </p>
                          {parsedFile.duplicatesRemoved > 0 && (
                            <p className="text-xs text-muted-foreground">
                              • {parsedFile.duplicatesRemoved} duplicate{parsedFile.duplicatesRemoved !== 1 ? 's' : ''} removed
                            </p>
                          )}
                          {parsedFile.invalidRemoved > 0 && (
                            <p className="text-xs text-muted-foreground">
                              • {parsedFile.invalidRemoved} invalid username{parsedFile.invalidRemoved !== 1 ? 's' : ''} removed
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      disabled={isLoading}
                      className="ml-2 flex-shrink-0"
                    >
                      <Icon icon="ph:x" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Username Preview */}
                <div className="p-4 bg-muted/10 border border-border rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Preview (first 10):</p>
                  <div className="flex flex-wrap gap-2">
                    {parsedFile.usernames.slice(0, 10).map((username, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs font-medium bg-muted border border-border rounded text-foreground"
                      >
                        @{username}
                      </span>
                    ))}
                    {parsedFile.usernames.length > 10 && (
                      <span className="px-2 py-1 text-xs text-muted-foreground">
                        +{parsedFile.usernames.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Analysis Type Selection */}
          {parsedFile && (
            <>
              <div>
                <Label>Analysis Type</Label>
                <div className="mt-3 space-y-2">
                  {ANALYSIS_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className={`
                        flex items-start gap-3 p-3 border rounded-lg cursor-pointer
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
                        name="bulkAnalysisType"
                        value={option.value}
                        checked={analysisType === option.value}
                        onChange={(e) => setAnalysisType(e.target.value as AnalysisType)}
                        disabled={isLoading}
                        className="mt-0.5 w-4 h-4 text-foreground border-border focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-foreground">{option.label}</span>
                          <span className="text-xs px-2 py-0.5 bg-muted border border-border rounded-full text-muted-foreground">
                            {option.credits} credit{option.credits !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Credit Calculation */}
              <div className="p-4 bg-muted/20 rounded-lg border border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Leads to analyze:</span>
                  <span className="font-medium text-foreground">{parsedFile.usernames.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cost per lead:</span>
                  <span className="font-medium text-foreground">{costPerLead} credit{costPerLead !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current credits:</span>
                  <span className="font-medium text-foreground">{currentCredits.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total cost:</span>
                    <span className="font-semibold text-foreground">-{totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="font-medium text-foreground">Credits after:</span>
                    <span
                      className={`font-semibold ${
                        hasInsufficientCredits
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}
                    >
                      {creditsAfter.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Insufficient Credits Warning */}
              {hasInsufficientCredits && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Icon icon="ph:warning" className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-amber-800 dark:text-amber-200">Insufficient Credits</p>
                      <p className="text-amber-700 dark:text-amber-300 mt-0.5">
                        You need {Math.abs(creditsAfter)} more credits to complete this analysis.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="min-w-[160px]"
        >
          {isLoading ? (
            <>
              <Icon icon="ph:spinner" className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : parsedFile ? (
            `Analyze ${parsedFile.usernames.length} Profile${parsedFile.usernames.length !== 1 ? 's' : ''}`
          ) : (
            'Upload File First'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
