// src/features/leads/components/BulkUploadModal.tsx

/**
 * BULK UPLOAD MODAL - V3.0 REDESIGN
 * 
 * DESIGN PHILOSOPHY:
 * ✅ Blue as 10% accent (icons, hover states, progress)
 * ✅ Visual hierarchy with better spacing
 * ✅ Styled file upload zone matching vanilla JS version
 * ✅ Analysis cards with colored left borders
 * ✅ Prominent credit calculation
 * ✅ Smart validation feedback
 * 
 * RESTORED INTELLIGENCE:
 * ✅ Real-time credit calculation
 * ✅ Duplicate detection and removal
 * ✅ Username validation with detailed errors
 * ✅ File preview with username chips
 * ✅ Insufficient credit warnings
 * ✅ Comprehensive error messaging
 */

import { useState, useRef } from 'react';
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
    description: 'Basic profile insights',
    credits: 1,
    icon: 'ph:lightning',
    borderColor: 'border-l-amber-400',
  },
  {
    value: 'deep',
    label: 'Deep Analysis',
    description: 'Detailed behavioral profile',
    credits: 2,
    icon: 'ph:brain',
    borderColor: 'border-l-purple-400',
  },
  {
    value: 'xray',
    label: 'X-Ray Analysis',
    description: 'Complete psychological profile',
    credits: 3,
    icon: 'ph:target',
    borderColor: 'border-l-primary-500',
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

        // Validate each username
        const validUsernames: string[] = [];
        const invalidUsernames: string[] = [];

        rawUsernames.forEach((username) => {
          const validation = validateInstagramUsername(username);
          if (validation.valid) {
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
    reader.readAsText(file);
  };

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

    const file = e.dataTransfer.files?.[0];
    if (file) {
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
      {/* Header */}
      <Modal.Header>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <Icon icon="ph:file-csv" className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Bulk Analysis</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Upload CSV with Instagram usernames</p>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="space-y-6">
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
            <Label className="text-sm font-medium text-foreground mb-2">Upload CSV File</Label>
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
                  mt-2 border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
                  transition-all duration-200
                  ${
                    isDragging
                      ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-border hover:border-muted-foreground/50 hover:bg-muted/10'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
                `}
              >
                <Icon 
                  icon="ph:upload-simple" 
                  className={`
                    w-12 h-12 mx-auto mb-3 transition-colors
                    ${isDragging ? 'text-primary-500' : 'text-muted-foreground'}
                  `}
                />
                <div className="text-sm text-foreground font-medium mb-1">
                  Drop your CSV here
                </div>
                <div className="text-xs text-muted-foreground">
                  or click to browse • Max {MAX_LEADS} usernames
                </div>
              </div>
            ) : (
              <div className="mt-2 p-4 border border-border rounded-xl bg-muted/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Icon icon="ph:file-csv" className="w-5 h-5 text-foreground flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground truncate">
                      {parsedFile.filename}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    disabled={isLoading}
                    className="flex-shrink-0"
                  >
                    <Icon icon="ph:x" className="w-4 h-4" />
                  </Button>
                </div>

                {/* File Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Icon icon="ph:check-circle" className="w-3 h-3 text-green-600" />
                    <span>{parsedFile.usernames.length} valid</span>
                  </div>
                  {parsedFile.duplicatesRemoved > 0 && (
                    <div className="flex items-center gap-1">
                      <Icon icon="ph:copy" className="w-3 h-3" />
                      <span>{parsedFile.duplicatesRemoved} duplicate{parsedFile.duplicatesRemoved !== 1 ? 's' : ''} removed</span>
                    </div>
                  )}
                </div>

                {/* Username Preview */}
                <div className="p-3 bg-background rounded-lg border border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Preview (first 10):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedFile.usernames.slice(0, 10).map((username, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-muted border border-border rounded text-foreground"
                      >
                        <span className="text-muted-foreground">@</span>
                        {username}
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
                <Label className="text-sm font-medium text-foreground mb-3">
                  Analysis Depth
                </Label>
                <div className="space-y-2">
                  {ANALYSIS_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className={`
                        group relative flex items-start gap-3 p-3 pl-4 border-l-4 border-r border-t border-b
                        rounded-lg cursor-pointer transition-all duration-150
                        ${
                          analysisType === option.value
                            ? `${option.borderColor} bg-muted/30 border-r-foreground/20 border-t-foreground/20 border-b-foreground/20`
                            : 'border-l-transparent border-r-border border-t-border border-b-border hover:border-l-muted-foreground/30 hover:bg-muted/10'
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
                        className="mt-0.5 w-4 h-4 text-foreground border-border focus:ring-primary-500"
                      />

                      <div className={`
                        flex-shrink-0 p-1.5 rounded-lg transition-colors
                        ${analysisType === option.value ? 'bg-background' : 'bg-transparent group-hover:bg-background'}
                      `}>
                        <Icon 
                          icon={option.icon} 
                          className={`
                            w-4 h-4 transition-colors
                            ${analysisType === option.value ? 'text-foreground' : 'text-muted-foreground'}
                          `}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-foreground">{option.label}</span>
                          <span className={`
                            inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold
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
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Credit Calculation - More Prominent */}
              <div className="p-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg border border-border space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Leads to analyze:</span>
                  <span className="font-semibold text-foreground">{parsedFile.usernames.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cost per lead:</span>
                  <div className="flex items-center gap-1">
                    <Icon icon="ph:coin" className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold text-foreground">{costPerLead}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current credits:</span>
                  <span className="font-semibold text-foreground">{currentCredits.toLocaleString()}</span>
                </div>
                <div className="pt-2.5 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-foreground">Total cost:</span>
                    <div className="flex items-center gap-1.5">
                      <Icon icon="ph:coin" className="w-5 h-5 text-amber-500" />
                      <span className="text-xl font-bold text-foreground">{totalCost}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium text-muted-foreground">Credits after:</span>
                    <span className={`text-lg font-bold ${creditsAfter >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
                    <div className="flex-1 text-sm text-amber-800 dark:text-amber-200">
                      <p className="font-medium">Insufficient credits</p>
                      <p className="text-xs mt-0.5">
                        You need {Math.abs(creditsAfter)} more credit{Math.abs(creditsAfter) !== 1 ? 's' : ''} to complete this analysis
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
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
          className="min-w-[160px]"
        >
          {isLoading ? (
            <>
              <Icon icon="ph:spinner" className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : parsedFile ? (
            <>
              <Icon icon="ph:play" className="w-4 h-4" />
              Analyze {parsedFile.usernames.length} Profile{parsedFile.usernames.length !== 1 ? 's' : ''}
            </>
          ) : (
            'Upload File First'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
