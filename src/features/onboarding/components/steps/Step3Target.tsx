/**
 * STEP 3: TARGET CUSTOMER - LIGHT MODE REDESIGN
 * 
 * Clean target audience configuration
 * Using primary blue and secondary purple accents
 */

import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Textarea } from '@/shared/components/ui/Textarea';
import { Input } from '@/shared/components/ui/Input';
import type { FormData, TargetCompanySize } from '@/features/onboarding/constants/validationSchemas';

const companySizeOptions: { value: TargetCompanySize; label: string; description: string }[] = [
  {
    value: 'startup',
    label: 'Startup',
    description: '1-50 employees',
  },
  {
    value: 'smb',
    label: 'SMB',
    description: '51-500 employees',
  },
  {
    value: 'enterprise',
    label: 'Enterprise',
    description: '500+ employees',
  },
];

export function Step3Target() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FormData>();

  const targetDescription = watch('target_description') || '';
  const selectedSizes = watch('target_company_sizes') || [];
  const charCount = targetDescription.length;

  const toggleSize = (size: TargetCompanySize) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    setValue('target_company_sizes', newSizes, { shouldValidate: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 mb-4">
          <Icon icon="ph:target" className="text-2xl text-primary-600" />
        </div>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          Define your ideal customer
        </h2>
        <p className="text-neutral-600">
          Who are you trying to reach on Instagram?
        </p>
      </div>

      {/* Target Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-700">
          Target Audience Description
        </label>
        <Textarea
          placeholder="Describe your ideal customers - their roles, industries, pain points..."
          rows={5}
          error={errors.target_description?.message}
          {...register('target_description')}
          className="w-full"
        />
        <div className="flex items-center justify-between text-sm">
          <span className={`font-medium ${
            charCount < 50 ? 'text-red-500' :
            charCount < 200 ? 'text-amber-500' :
            'text-green-600'
          }`}>
            {charCount < 50 ? 'Add more detail' :
             charCount < 200 ? 'Good start' :
             'Perfect!'}
          </span>
          <span className="text-neutral-500">
            {charCount} / 750
          </span>
        </div>
      </div>

      {/* Follower Range */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-neutral-700">
          Follower Range
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-neutral-600 mb-1">
              Minimum Followers
            </label>
            <Input
              type="number"
              min={0}
              placeholder="0"
              defaultValue={0}
              error={errors.icp_min_followers?.message}
              {...register('icp_min_followers', { valueAsNumber: true })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-600 mb-1">
              Maximum Followers
            </label>
            <Input
              type="number"
              min={0}
              placeholder="1,000,000"
              defaultValue={1000000}
              error={errors.icp_max_followers?.message}
              {...register('icp_max_followers', { valueAsNumber: true })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Company Size */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-neutral-700">
          Target Company Size
          <span className="text-neutral-500 font-normal ml-2">(Optional)</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {companySizeOptions.map((option) => {
            const isSelected = selectedSizes.includes(option.value);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleSize(option.value)}
                className={`
                  p-4 rounded-xl border-2
                  transition-all duration-200
                  ${isSelected
                    ? 'bg-secondary-50 border-secondary-500'
                    : 'bg-white border-neutral-200 hover:border-neutral-300'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center
                    ${isSelected
                      ? 'bg-secondary-500 border-secondary-500'
                      : 'bg-white border-neutral-300'
                    }
                  `}>
                    {isSelected && (
                      <Icon icon="ph:check" className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`font-medium text-sm ${
                      isSelected ? 'text-neutral-900' : 'text-neutral-700'
                    }`}>
                      {option.label}
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {option.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
