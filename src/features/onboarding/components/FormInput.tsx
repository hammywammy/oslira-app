// src/features/onboarding/components/FormInput.tsx

/**
 * FORM INPUT COMPONENT
 * 
 * Reusable input with consistent styling, validation, and animations
 */

import { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { ICONS } from '../constants/icons';
import { errorVariants } from '../animations/variants';

// =============================================================================
// TYPES
// =============================================================================

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: string;
  helperText?: string;
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  icon?: string;
  helperText?: string;
}

// =============================================================================
// FORM INPUT
// =============================================================================

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, icon, helperText, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-200">
          {label}
          {props.required && <span className="text-violet-400 ml-1">*</span>}
        </label>

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon icon={icon} className="w-5 h-5" />
            </div>
          )}

          <input
            ref={ref}
            {...props}
            className={`
              w-full px-4 py-2.5 
              ${icon ? 'pl-11' : ''}
              bg-slate-900/50 border rounded-lg
              text-white placeholder-slate-500
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:bg-slate-900
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-500/50' : 'border-slate-700/50'}
              ${className}
            `}
          />
        </div>

        {/* Helper text or error */}
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex items-center gap-1.5 text-xs text-red-400"
            >
              <Icon icon={ICONS.alertCircle} className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          ) : helperText ? (
            <motion.p
              key="helper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-slate-400"
            >
              {helperText}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

// =============================================================================
// FORM TEXTAREA
// =============================================================================

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-200">
          {label}
          {props.required && <span className="text-violet-400 ml-1">*</span>}
        </label>

        <textarea
          ref={ref}
          {...props}
          className={`
            w-full px-4 py-2.5
            bg-slate-900/50 border rounded-lg
            text-white placeholder-slate-500
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:bg-slate-900
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-none
            ${error ? 'border-red-500/50' : 'border-slate-700/50'}
            ${className}
          `}
        />

        {/* Character count if maxLength provided */}
        {props.maxLength && (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {error ? (
                  <motion.div
                    key="error"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="flex items-center gap-1.5 text-xs text-red-400"
                  >
                    <Icon icon={ICONS.alertCircle} className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                ) : helperText ? (
                  <motion.p
                    key="helper"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-slate-400"
                  >
                    {helperText}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>
            <span className="text-xs text-slate-500 ml-2">
              {props.value?.toString().length || 0} / {props.maxLength}
            </span>
          </div>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';
