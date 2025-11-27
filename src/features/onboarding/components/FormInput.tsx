/**
 * FORM INPUT & TEXTAREA COMPONENTS - PRODUCTION GRADE
 * 
 * FIXES:
 * ✅ React Error #137 - Explicitly destructures children to prevent spreading
 * ✅ Development warning when children accidentally passed
 * ✅ Character counter properly reads field value
 * ✅ Textarea height increased (rows default changed)
 * ✅ Removed duplicate character counter
 * ✅ RING FIX: Changed ring-purple-500 to ring-primary-500
 */

import { forwardRef } from 'react';
import { Icon } from '@iconify/react';
import type { FieldError } from 'react-hook-form';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
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

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  placeholder?: string;
  icon?: string;
  error?: FieldError | string;
  helperText?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
}

// HELPER: Extract error message
function getErrorMessage(error: FieldError | string | undefined): string | undefined {
  if (!error) return undefined;
  if (typeof error === 'string') return error;
  return error.message;
}

// FORM INPUT COMPONENT
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
      children, // ← CRITICAL: Explicitly extract to prevent spreading to <input>
      ...rest
    },
    ref
  ) {
    const errorMessage = getErrorMessage(error);
    const hasError = !!errorMessage;

    // =========================================================================
    // SAFETY CHECK - Development warning for children
    // =========================================================================
    if (process.env.NODE_ENV === 'development' && children !== undefined) {
      console.error(
        '[FormInput] Input elements cannot have children. The children prop has been ignored.',
        { receivedChildren: children }
      );
    }

    const baseClasses = `
      w-full px-4 py-3 
      bg-slate-800/50 
      border-2 rounded-xl 
      text-white placeholder-slate-500
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-primary-500/50
      ${
        hasError
          ? 'border-red-500/50 focus:border-red-500'
          : 'border-slate-700 focus:border-primary-500'
      }
    `;

    return (
      <div className="space-y-2">
        {/* Label */}
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          {icon && <Icon icon={icon} className="text-lg text-primary-400" />}
          {label}
          {required && <span className="text-red-400">*</span>}
        </label>

        {/* Input - CRITICAL: Self-closing, children explicitly excluded */}
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

// FORM TEXTAREA COMPONENT
// ✅ FIXED: Removed built-in character counter (handled by parent)
// ✅ FIXED: Increased default rows from 4 to 8
// ✅ FIXED: Changed ring-purple-500 to ring-primary-500
// ✅ FIXED: React Error #137 - children explicitly excluded
export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  function FormTextarea(
    {
      label,
      placeholder,
      icon,
      error,
      helperText,
      required = false,
      rows = 8, // ✅ INCREASED from 4 to 8 for better visibility
      maxLength,
      children, // ← CRITICAL: Explicitly extract to prevent spreading to <textarea>
      ...rest
    },
    ref
  ) {
    const errorMessage = getErrorMessage(error);
    const hasError = !!errorMessage;

    // =========================================================================
    // SAFETY CHECK - Development warning for children
    // =========================================================================
    if (process.env.NODE_ENV === 'development' && children !== undefined) {
      console.error(
        '[FormTextarea] Textarea elements should not have children. Use value/defaultValue instead. The children prop has been ignored.',
        { receivedChildren: children }
      );
    }

    const baseClasses = `
      w-full px-4 py-3 
      bg-slate-800/50 
      border-2 rounded-xl 
      text-white placeholder-slate-500
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-primary-500/50
      resize-none
      ${
        hasError
          ? 'border-red-500/50 focus:border-red-500'
          : 'border-slate-700 focus:border-primary-500'
      }
    `;

    return (
      <div className="space-y-2">
        {/* Label */}
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          {icon && <Icon icon={icon} className="text-lg text-primary-400" />}
          {label}
          {required && <span className="text-red-400">*</span>}
        </label>

        {/* Textarea - CRITICAL: Self-closing, children explicitly excluded */}
        <textarea
          ref={ref}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
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

        {/* Helper Text - ONLY show if no error and helperText provided */}
        {!hasError && helperText && (
          <p className="text-sm text-slate-500">{helperText}</p>
        )}
        
        {/* ✅ REMOVED: Built-in character counter - parent components handle this */}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
FormTextarea.displayName = 'FormTextarea';
