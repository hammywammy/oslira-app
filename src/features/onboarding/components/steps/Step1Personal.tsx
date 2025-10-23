// src/features/onboarding/components/steps/Step1Personal.tsx

/**
 * STEP 1: PERSONAL IDENTITY
 * 
 * Fields:
 * - signature_name (required)
 */

import { motion } from 'framer-motion';
import { FormInput } from '../FormInput';
import { ICONS } from '../../constants/icons';
import { fadeInVariants, containerVariants } from '../../animations/variants';
import { useFormContext } from 'react-hook-form';
import type { FormData } from '../../constants/validationSchemas';

// =============================================================================
// COMPONENT
// =============================================================================

export function Step1Personal() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={fadeInVariants} className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-white">
          Welcome to Oslira
        </h2>
        <p className="text-slate-400 text-lg">
          Let's start with your name
        </p>
      </motion.div>

      {/* Form */}
      <motion.div variants={fadeInVariants}>
        <FormInput
          label="Your Name"
          placeholder="John Smith"
          icon={ICONS.user}
          error={errors.signature_name?.message}
          helperText="This will appear in your outreach messages"
          required
          {...register('signature_name')}
        />
      </motion.div>
    </motion.div>
  );
}
