// src/features/leads/components/BulkUploadModal.tsx

/**
 * BULK UPLOAD MODAL - V5.0 WITH PERSONALITY
 * 
 * IMPROVEMENTS:
 * ✅ Larger modal size for better presence
 * ✅ Colorful, engaging design with personality
 * ✅ Gradient accents and modern styling
 * ✅ Better visual hierarchy
 * ✅ More engaging copy and icons
 * ✅ Visual feedback and animations
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
  icon: string;
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
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    value: 'deep',
    label: 'Deep Analysis',
    description: 'Detailed insights + outreach template',
    credits: 2,
    icon: 'ph:brain-fill',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    value: 'xray',
    label: 'X-Ray Analysis',
    description: 'Complete psychological profile + strategy',
    credits: 3,
    icon: 'ph:atom-fill',
    gradient: 'from-emerald-500 to-teal-500',
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
      setIsDragging(false);
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
      <div className="p-8">
        {/* Header with Icon */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Icon icon="ph:upload-bold" className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-1">Bulk Upload</h2>
            <p className="text-sm text-muted-foreground">Analyze multiple Instagram profiles at once</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
              <Icon icon="ph:warning-circle-fill" className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* File Upload Zone */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Upload CSV File
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
                onClick={() => !isLoading && fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
                  ${isDragging 
                    ? 'border-primary bg-primary/10 scale-[1.02]' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
                `}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <Icon icon="ph:file-csv-fill" className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {isDragging ? 'Drop your file here' : 'Drop CSV file or click to browse'}
                </h3>
                <p className="text-sm text-muted-foreground mb-1">
                  One Instagram username per line
                </p>
                <p className="text-xs text-muted-foreground">
                  Maximum {MAX_LEADS} usernames • CSV format only
                </p>
              </div>
            ) : (
              <div className="border-2 border-primary rounded-2xl p-6 bg-primary/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                      <Icon icon="ph:file-csv-fill" className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{parsedFile.filename}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon icon="ph:check-circle-fill" className="w-3.5 h-3.5 text-emerald-500" />
                          {parsedFile.usernames.length} valid
                        </span>
                        {parsedFile.duplicatesRemoved > 0 && (
                          <span>{parsedFile.duplicatesRemoved} duplicates removed</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    disabled={isLoading}
                    className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
                  >
                    <Icon icon="ph:x-bold" className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Username Preview */}
                <div className="p-3 bg-background rounded-xl border border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Preview (first 10):</p>
                  <div className="flex flex-wrap gap-2">
                    {parsedFile.usernames.slice(0, 10).map((username, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-muted border border-border rounded-lg text-foreground"
                      >
                        <span className="text-muted-foreground">@</span>
                        {username}
                      </span>
                    ))}
                    {parsedFile.usernames.length > 10 && (
                      <span className="px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        +{parsedFile.usernames.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Analysis Type (only show if file uploaded) */}
          {parsedFile && (
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
                    <input
                      type="radio"
                      name="analysisType"
                      value={option.value}
                      checked={analysisType === option.value}
                      onChange={(e) => setAnalysisType(e.target.value as AnalysisType)}
                      disabled={isLoading}
                      className="mt-1 w-5 h-5 text-primary border-2 border-border focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    />
                    
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${option.gradient} flex items-center justify-center shadow-md`}>
                      <Icon icon={option.icon} className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-base font-semibold text-foreground">{option.label}</h4>
                        <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded-full text-xs font-bold text-foreground">
                          <Icon icon="ph:lightning-fill" className="w-3 h-3" />
                          {option.credits} each
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Cost Summary */}
          {parsedFile && (
            <div className="p-5 bg-gradient-to-br from-muted/50 to-muted/30 border-2 border-border rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground">Total Cost</span>
                <div className="flex items-center gap-2">
                  <Icon icon="ph:coins-fill" className="w-6 h-6 text-amber-500" />
                  <span className="text-2xl font-bold text-foreground">
                    {totalCost}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {totalCost === 1 ? 'credit' : 'credits'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{parsedFile.usernames.length} leads × {costPerLead} {costPerLead === 1 ? 'credit' : 'credits'}</span>
                <span>Balance after: {creditsAfter} credits</span>
              </div>
              {hasInsufficientCredits && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-xs font-medium text-red-800 dark:text-red-200">
                    ⚠️ Insufficient credits. You need {totalCost} credits but only have {currentCredits}.
                  </p>
                </div>
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
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit}
              disabled={!canSubmit}
              isLoading={isLoading}
              className="px-8 shadow-lg shadow-primary/20"
            >
              <Icon icon="ph:upload-bold" className="w-4 h-4" />
              {isLoading ? 'Starting Analysis...' : 'Start Analysis'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
