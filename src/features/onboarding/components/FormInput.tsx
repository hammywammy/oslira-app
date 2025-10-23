// src/features/onboarding/components/FormInput.tsx

/**
 * FORM INPUT & TEXTAREA COMPONENTS
 * 
 * Reusable input components with:
 * - Label with icon
 * - Error message display
 * - Helper text
 * - Proper FieldError handling
 * - TypeScript compatibility with react-hook-form
 */

import { forwardRef } from 'react';
import { Icon } from '@iconify/react';
import type { FieldError } from 'react-hook-form';

// =============================================================================
// TYPES
// =============================================================================

export interface FormInputProps {
  label: string;
  placeholder?: string;
  icon?: string;
  error?: FieldError | string;
  helperText?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'url' | 'number';
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

export interface FormTextareaProps {
  label: string;
  placeholder?: string;
  icon?: string;
  error?: FieldError | string;
  helperText?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
}

// =============================================================================
// HELPER: Extract error message
// =============================================================================

function getErrorMessage(error: FieldError | string | undefined): string | undefined {
  if (!error) return undefined;
  if (typeof error === 'string') return error;
  return error.message;
}

// =============================================================================
// FORM INPUT COMPONENT
// =============================================================================

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  function FormInput(
    {
      label,
      placeholder,
      icon,
      error,
      helperText,
      required = false,
      type = 'text',
      min,
      max,
      step,
      ...rest
    },
    ref
  ) {
    const errorMessage = getErrorMessage(error);
    const hasError = !!errorMessage;

    const baseClasses = `
      w-full px-4 py-3 
      bg-slate-800/50 
      border-2 rounded-xl 
      text-white placeholder-slate-500
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-purple-500/50
      ${
        hasError
          ? 'border-red-500/50 focus:border-red-500'
          : 'border-slate-700 focus:border-purple-500'
      }
    `;

    return (
      <div className="space-y-2">
        {/* Label */}
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          {icon && <Icon icon={icon} className="text-lg text-purple-400" />}
          {label}
          {required && <span className="text-red-400">*</span>}
        </label>

        {/* Input */}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={baseClasses}
          {...rest}
        />

        {/* Error Message */}
        {hasError && (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <Icon icon="lucide:alert-circle" className="text-base flex-shrink-0" />
            {errorMessage}
          </div>
        )}

        {/* Helper Text */}
        {!hasError && helperText && (
          <p className="text-sm text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

// =============================================================================
// FORM TEXTAREA COMPONENT
// =============================================================================

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  function FormTextarea(
    {
      label,
      placeholder,
      icon,
      error,
      helperText,
      required = false,
      rows = 4,
      maxLength,
      ...rest
    },
    ref
  ) {
    const errorMessage = getErrorMessage(error);
    const hasError = !!errorMessage;

    const baseClasses = `
      w-full px-4 py-3 
      bg-slate-800/50 
      border-2 rounded-xl 
      text-white placeholder-slate-500
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-purple-500/50
      resize-none
      ${
        hasError
          ? 'border-red-500/50 focus:border-red-500'
          : 'border-slate-700 focus:border-purple-500'
      }
    `;

    return (
      <div className="space-y-2">
        {/* Label */}
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          {icon && <Icon icon={icon} className="text-lg text-purple-400" />}
          {label}
          {required && <span className="text-red-400">*</span>}
        </label>

        {/* Textarea */}
        <textarea
          ref={ref}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className={baseClasses}
          {...rest}
        />

        {/* Character count if maxLength specified */}
        {maxLength && !hasError && (
          <p className="text-sm text-slate-500 text-right">
            {(rest as any).value?.length || 0} / {maxLength}
          </p>
        )}

        {/* Error Message */}
        {hasError && (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <Icon icon="lucide:alert-circle" className="text-base flex-shrink-0" />
            {errorMessage}
          </div>
        )}

        {/* Helper Text */}
        {!hasError && helperText && !maxLength && (
          <p className="text-sm text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);
