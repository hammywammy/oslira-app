// src/features/leads/components/BulkUploadModal.tsx

/**
 * BULK UPLOAD MODAL - V6.0 SIMPLIFIED
 * 
 * CHANGES:
 * ✅ Auto-fetches business profiles on mount
 * ✅ Dropdown selector for business profiles
 * ✅ Light + Deep analysis only (X-Ray removed)
 * ✅ Simplified, cleaner design
 * ✅ Better error handling and loading states
 */

import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { httpClient } from '@/core/auth/http-client';
import { logger } from '@/core/utils/logger';
import { validateInstagramUsername } from '@/shared/utils/validation';
import { useBusinessProfile } from '@/features/business/providers/BusinessProfileProvider';
import { useSelectedBusinessId, useBusinessProfiles } from '@/core/store/selectors';
import { useCreditsService } from '@/features/credits/hooks/useCreditsService';
import type { AnalysisType } from '@/shared/types/leads.types';

// =============================================================================
// TYPES
// =============================================================================

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (jobId: string, count: number) => void;
  currentCredits?: number;
}

interface InvalidUsername {
  username: string;
  error: string;
}

interface ParsedFile {
  filename: string;
  usernames: string[];
  duplicatesRemoved: number;
  invalidUsernames: InvalidUsername[];
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
];

const MAX_LEADS = 50;

// =============================================================================
// COMPONENT
// =============================================================================

export function BulkUploadModal({
  isOpen,
  onClose,
  onSuccess,
  currentCredits = 0,
}: BulkUploadModalProps) {
  // Global state - business profiles
  const businessProfiles = useBusinessProfiles();
  const selectedProfileId = useSelectedBusinessId();
  const { isLoading: isLoadingProfiles, selectProfile } = useBusinessProfile();

  // Credits service for refreshing balance after analysis starts
  const { refetchBalance } = useCreditsService();

  // Local state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedFile, setParsedFile] = useState<ParsedFile | null>(null);
  const [analysisType, setAnalysisType] = useState<AnalysisType>('light');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        const invalidUsernames: InvalidUsername[] = [];

        rawUsernames.forEach((username) => {
          if (!username) return; // Skip empty lines
          const validation = validateInstagramUsername(username);
          if (validation.valid) {
            validUsernames.push(username);
          } else {
            invalidUsernames.push({
              username,
              error: validation.error || 'Invalid username',
            });
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
          invalidUsernames,
        });

        logger.info('[BulkUploadModal] File parsed', {
          filename: file.name,
          validCount: uniqueUsernames.length,
          invalidCount: invalidUsernames.length,
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
    if (!parsedFile || !selectedProfileId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await httpClient.post<{ 
        success: boolean; 
        data?: { job_id: string };
      }>(
        '/api/leads/analyze/bulk',
        {
          usernames: parsedFile.usernames,
          businessProfileId: selectedProfileId,
          analysisType: analysisType,
        }
      );

      if (response.success && response.data?.job_id) {
        logger.info('[BulkUploadModal] Bulk analysis started', {
          jobId: response.data.job_id
        });

        // Refresh credits balance immediately (credits are deducted on backend when analysis starts)
        refetchBalance().catch((error) => {
          logger.warn('[BulkUploadModal] Failed to refresh balance after analysis start', error as Error);
        });

        if (onSuccess) {
          onSuccess(response.data.job_id, parsedFile.usernames.length);
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
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
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
  const canSubmit = 
    parsedFile && 
    selectedProfileId && 
    !hasInsufficientCredits && 
    !isSubmitting && 
    !isLoadingProfiles;

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <Modal open={isOpen} onClose={handleClose} size="lg" closeable={!isSubmitting}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-1">Bulk Upload</h2>
          <p className="text-sm text-muted-foreground">Analyze multiple Instagram profiles at once</p>
        </div>

        <div className="space-y-4">
          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Business Profile Selector */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Business Profile
            </label>
            
            {isLoadingProfiles ? (
              <div className="h-10 border border-border rounded-lg flex items-center justify-center gap-2 text-muted-foreground bg-muted/20">
                <Icon icon="ph:spinner" className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : businessProfiles.length === 0 ? (
              <div className="p-3 border border-border rounded-lg bg-muted/20 text-sm text-muted-foreground">
                No business profiles found
              </div>
            ) : (
              <select
                value={selectedProfileId || ''}
                onChange={(e) => selectProfile(e.target.value)}
                disabled={isSubmitting}
                className="w-full h-10 px-3 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
              >
                {businessProfiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.business_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* File Upload Zone */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Upload CSV File
            </label>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              disabled={isSubmitting}
              className="hidden"
            />

            {!parsedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors text-center
                  ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/20'}
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <Icon icon="ph:upload-simple" className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">
                  Drop CSV file here or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Maximum {MAX_LEADS} usernames per upload
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* File Info */}
                <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/20">
                  <Icon icon="ph:file-csv" className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {parsedFile.filename}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {parsedFile.usernames.length} valid usernames
                      {parsedFile.duplicatesRemoved > 0 && ` • ${parsedFile.duplicatesRemoved} duplicates removed`}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    disabled={isSubmitting}
                    className="p-1.5 hover:bg-muted rounded transition-colors flex-shrink-0"
                  >
                    <Icon icon="ph:x" className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Username Preview */}
                <div className="p-3 bg-background border border-border rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Valid usernames:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedFile.usernames.slice(0, 10).map((username, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-muted border border-border rounded"
                      >
                        @{username}
                      </span>
                    ))}
                    {parsedFile.usernames.length > 10 && (
                      <span className="text-xs px-2 py-1 text-muted-foreground">
                        +{parsedFile.usernames.length - 10} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Invalid Usernames Warning */}
                {parsedFile.invalidUsernames.length > 0 && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon icon="lucide:alert-circle" className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <p className="text-xs font-medium text-red-700 dark:text-red-300">
                        {parsedFile.invalidUsernames.length} invalid username{parsedFile.invalidUsernames.length > 1 ? 's' : ''} skipped:
                      </p>
                    </div>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {parsedFile.invalidUsernames.slice(0, 5).map((invalid, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs"
                        >
                          <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded font-mono">
                            @{invalid.username}
                          </span>
                          <span className="text-red-600 dark:text-red-400">
                            {invalid.error}
                          </span>
                        </div>
                      ))}
                      {parsedFile.invalidUsernames.length > 5 && (
                        <p className="text-xs text-red-600 dark:text-red-400 pt-1">
                          +{parsedFile.invalidUsernames.length - 5} more invalid usernames
                        </p>
                      )}
                    </div>
                  </div>
                )}
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
                    className={`
                      flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors
                      ${analysisType === option.value ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/30'}
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
                      className="w-4 h-4 text-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-foreground">{option.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {option.credits} {option.credits === 1 ? 'credit' : 'credits'} each
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Cost Summary */}
          {parsedFile && selectedOption && (
            <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Leads to analyze</span>
                <span className="font-medium text-foreground">{parsedFile.usernames.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cost per lead</span>
                <span className="font-medium text-foreground">
                  {costPerLead} {costPerLead === 1 ? 'credit' : 'credits'}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Total Cost</span>
                <span className="text-base font-bold text-foreground">
                  {totalCost} {totalCost === 1 ? 'credit' : 'credits'}
                </span>
              </div>
              
              {hasInsufficientCredits && (
                <div className="pt-2">
                  <p className="text-xs text-red-600 dark:text-red-400">
                    ⚠️ Insufficient credits. You need {Math.abs(creditsAfter)} more.
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit}
              disabled={!canSubmit}
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Uploading...' : 'Start Bulk Analysis'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
