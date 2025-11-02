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

import { useState, useRef, useEffect } from 'react';
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

interface BusinessProfile {
  id: string;
  business_name: string;
  business_one_liner: string | null;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedFile, setParsedFile] = useState<ParsedFile | null>(null);
  const [analysisType, setAnalysisType] = useState<AnalysisType>('light');
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // ===========================================================================
  // FETCH BUSINESS PROFILES ON MOUNT
  // ===========================================================================

  useEffect(() => {
    if (isOpen) {
      fetchBusinessProfiles();
    }
  }, [isOpen]);

  const fetchBusinessProfiles = async () => {
    setIsLoadingProfiles(true);
    setError(null);

    try {
      const response = await httpClient.get<{
        success: boolean;
        data?: BusinessProfile[];
      }>('/api/business-profiles?page=1&pageSize=50');

      if (response.success && response.data) {
        setBusinessProfiles(response.data);
        
        // Auto-select first profile
        if (response.data.length > 0) {
          setSelectedProfileId(response.data[0].id);
        } else {
          setError('No business profile found. Please complete onboarding first.');
        }
      } else {
        throw new Error('Failed to fetch business profiles');
      }
    } catch (err) {
      logger.error('[BulkUploadModal] Failed to fetch profiles', err as Error);
      setError('Unable to load business profiles. Please refresh and try again.');
    } finally {
      setIsLoadingProfiles(false);
    }
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
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <Icon icon="ph:upload-bold" className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">Bulk Upload</h2>
            <p className="text-sm text-muted-foreground">Analyze multiple Instagram profiles at once</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
              <Icon icon="ph:warning-circle-fill" className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Business Profile Selector */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Business Profile
            </label>
            
            {isLoadingProfiles ? (
              <div className="h-11 border-2 border-border rounded-lg flex items-center justify-center gap-2 text-muted-foreground">
                <Icon icon="ph:spinner" className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading profiles...</span>
              </div>
            ) : businessProfiles.length === 0 ? (
              <div className="p-3 border-2 border-border rounded-lg bg-muted/30 text-sm text-muted-foreground">
                No business profiles found
              </div>
            ) : (
              <select
                value={selectedProfileId}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                disabled={isSubmitting}
                className="w-full h-11 px-3 border-2 border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {businessProfiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.business_name}
                    {profile.business_one_liner && ` • ${profile.business_one_liner}`}
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
                  relative p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all
                  ${
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/50 hover:bg-muted/20'
                  }
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                    <Icon icon="ph:file-csv-bold" className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">
                      Drop CSV file here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Maximum {MAX_LEADS} usernames per upload
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* File Info */}
                <div className="flex items-center gap-3 p-3 border-2 border-border rounded-lg bg-muted/30">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon icon="ph:file-csv-fill" className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {parsedFile.filename}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <Icon icon="ph:check-circle-fill" className="w-3.5 h-3.5 text-emerald-500" />
                        {parsedFile.usernames.length} valid
                      </span>
                      {parsedFile.duplicatesRemoved > 0 && (
                        <span>{parsedFile.duplicatesRemoved} duplicates removed</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    disabled={isSubmitting}
                    className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
                  >
                    <Icon icon="ph:x-bold" className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Username Preview */}
                <div className="p-3 bg-background rounded-lg border border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Preview (first 10):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {parsedFile.usernames.slice(0, 10).map((username, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-muted border border-border rounded-md text-foreground"
                      >
                        <span className="text-muted-foreground">@</span>
                        {username}
                      </span>
                    ))}
                    {parsedFile.usernames.length > 10 && (
                      <span className="px-2 py-1 text-xs font-medium text-muted-foreground">
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
              <label className="block text-sm font-medium text-foreground mb-2">
                Choose Analysis Depth
              </label>
              <div className="space-y-2.5">
                {ANALYSIS_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`
                      group relative flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all
                      ${
                        analysisType === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground/30 hover:bg-muted/30'
                      }
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
                      className="sr-only"
                    />
                    
                    {/* Radio Circle */}
                    <div className={`
                      flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                      ${
                        analysisType === option.value
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground/30'
                      }
                    `}>
                      {analysisType === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>

                    {/* Icon */}
                    <div className={`
                      flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br ${option.gradient} flex items-center justify-center shadow-md
                    `}>
                      <Icon icon={option.icon} className="w-5 h-5 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {option.label}
                        </span>
                        <span className={`
                          inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                          ${
                            analysisType === option.value
                              ? 'bg-primary/20 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }
                        `}>
                          <Icon icon="ph:coin-fill" className="w-3 h-3" />
                          {option.credits} each
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {option.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Cost Summary */}
          {parsedFile && selectedOption && (
            <div className="p-4 bg-muted/30 border border-border rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Leads to analyze</span>
                <span className="font-semibold text-foreground">
                  {parsedFile.usernames.length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cost per lead</span>
                <span className="font-semibold text-foreground">
                  {costPerLead} {costPerLead === 1 ? 'credit' : 'credits'}
                </span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Total Cost</span>
                <div className="flex items-center gap-2">
                  <Icon icon="ph:coin-fill" className="w-4 h-4 text-amber-500" />
                  <span className="text-base font-bold text-foreground">
                    {totalCost} {totalCost === 1 ? 'credit' : 'credits'}
                  </span>
                </div>
              </div>
              
              {/* Insufficient Credits Warning */}
              {hasInsufficientCredits && (
                <div className="pt-2">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                    <Icon icon="ph:warning-circle-fill" className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-800 dark:text-red-200">
                      Insufficient credits. You need {Math.abs(creditsAfter)} more credits.
                    </p>
                  </div>
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
              className="shadow-lg shadow-primary/20"
            >
              <Icon icon="ph:upload-bold" className="w-4 h-4" />
              {isSubmitting ? 'Uploading...' : 'Start Bulk Analysis'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
