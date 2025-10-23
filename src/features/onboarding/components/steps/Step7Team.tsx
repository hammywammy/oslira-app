// src/features/onboarding/components/steps/Step7Team.tsx

/**
 * STEP 7: TEAM
 * 
 * Fields:
 * - team_size (radio)
 * - campaign_manager (radio)
 */

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { ICONS } from '../../constants/icons';
import { fadeInVariants, containerVariants } from '../../animations/variants';
import { useFormContext } from 'react-hook-form';
import type { FormData } from '../../constants/validationSchemas';

// =============================================================================
// COMPONENT
// =============================================================================

export function Step7Team() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>();

  const teamSizes = [
    {
      value: 'just-me',
      label: 'Just Me',
      description: 'Solo entrepreneur or freelancer',
    },
    {
      value: 'small-team',
      label: 'Small Team',
      description: '2-10 people',
    },
    {
      value: 'large-team',
      label: 'Large Team',
      description: '11+ people',
    },
  ];

  const campaignManagers = [
    {
      value: 'myself',
      label: 'Myself',
      description: 'I handle campaigns personally',
    },
    {
      value: 'sales-team',
      label: 'Sales Team',
      description: 'Dedicated sales department',
    },
    {
      value: 'marketing-team',
      label: 'Marketing Team',
      description: 'Marketing department manages outreach',
    },
    {
      value: 'mixed-team',
      label: 'Mixed Team',
      description: 'Collaboration between departments',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInVariants} className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">
          Tell us about your team
        </h2>
        <p className="text-slate-400">
          Help us tailor your experience
        </p>
      </motion.div>

      {/* Team Size */}
      <motion.div variants={fadeInVariants} className="space-y-3">
        <label className="block text-sm font-medium text-slate-200">
          Team Size <span className="text-violet-400">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {teamSizes.map((size) => (
            <label
              key={size.value}
              className="relative flex flex-col items-center justify-center p-4 border border-slate-700/50 rounded-lg cursor-pointer hover:border-violet-500/50 transition-colors"
            >
              <input
                type="radio"
                value={size.value}
                {...register('team_size')}
                className="sr-only peer"
              />
              
              {/* Icon */}
              <Icon
                icon={ICONS.users}
                className="w-6 h-6 mb-2 text-slate-400 peer-checked:text-violet-400 transition-colors"
              />

              {/* Label */}
              <p className="text-sm font-medium text-center text-slate-200 peer-checked:text-violet-300 transition-colors">
                {size.label}
              </p>
              <p className="text-xs text-slate-500 text-center mt-1">
                {size.description}
              </p>

              {/* Border highlight */}
              <div className="absolute inset-0 border-2 border-violet-500 rounded-lg opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
            </label>
          ))}
        </div>
        {errors.team_size && (
          <p className="text-xs text-red-400 flex items-center gap-1.5">
            <Icon icon={ICONS.alertCircle} className="w-3.5 h-3.5" />
            {errors.team_size.message}
          </p>
        )}
      </motion.div>

      {/* Campaign Manager */}
      <motion.div variants={fadeInVariants} className="space-y-3">
        <label className="block text-sm font-medium text-slate-200">
          Who manages campaigns? <span className="text-violet-400">*</span>
        </label>
        <div className="space-y-2">
          {campaignManagers.map((manager) => (
            <label
              key={manager.value}
              className="relative flex items-start p-4 border border-slate-700/50 rounded-lg cursor-pointer hover:border-violet-500/50 transition-colors"
            >
              <input
                type="radio"
                value={manager.value}
                {...register('campaign_manager')}
                className="sr-only peer"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-slate-200 peer-checked:text-violet-300">
                    {manager.label}
                  </p>
                  <Icon
                    icon={ICONS.userCog}
                    className="w-4 h-4 text-slate-400 peer-checked:text-violet-400"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {manager.description}
                </p>
              </div>
              <div className="absolute inset-0 border-2 border-violet-500 rounded-lg opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
            </label>
          ))}
        </div>
        {errors.campaign_manager && (
          <p className="text-xs text-red-400 flex items-center gap-1.5">
            <Icon icon={ICONS.alertCircle} className="w-3.5 h-3.5" />
            {errors.campaign_manager.message}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
