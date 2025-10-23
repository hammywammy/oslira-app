// src/features/onboarding/components/steps/Step6Communication.tsx

/**
 * STEP 6: COMMUNICATION
 * 
 * Fields:
 * - communication_channels (checkbox array - min 1)
 * - communication_tone (radio)
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

export function Step6Communication() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<FormData>();

  const selectedChannels = watch('communication_channels') || [];

  const channels = [
    { value: 'email', label: 'Email', icon: ICONS.mail },
    { value: 'instagram', label: 'Instagram DM', icon: ICONS.instagram },
    { value: 'sms', label: 'SMS', icon: ICONS.smartphone },
  ];

  const tones = [
    {
      value: 'professional',
      label: 'Professional',
      description: 'Formal and business-focused',
      example: '"I\'d like to discuss..."',
    },
    {
      value: 'friendly',
      label: 'Friendly',
      description: 'Warm and approachable',
      example: '"Hey! I noticed..."',
    },
    {
      value: 'casual',
      label: 'Casual',
      description: 'Relaxed and conversational',
      example: '"Quick question for you..."',
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
          How do you communicate?
        </h2>
        <p className="text-slate-400">
          Choose your outreach style
        </p>
      </motion.div>

      {/* Communication Channels */}
      <motion.div variants={fadeInVariants} className="space-y-3">
        <label className="block text-sm font-medium text-slate-200">
          Communication Channels <span className="text-violet-400">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {channels.map((channel) => {
            const isSelected = selectedChannels.includes(channel.value);
            
            return (
              <label
                key={channel.value}
                className={`
                  relative flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer
                  transition-all duration-200
                  ${
                    isSelected
                      ? 'border-violet-500/50 bg-violet-500/5'
                      : 'border-slate-700/50 hover:border-violet-500/30'
                  }
                `}
              >
                <input
                  type="checkbox"
                  value={channel.value}
                  {...register('communication_channels')}
                  className="sr-only peer"
                />
                
                {/* Checkmark indicator */}
                <div className={`
                  absolute top-2 right-2 w-5 h-5 rounded-full border-2
                  flex items-center justify-center
                  transition-colors duration-200
                  ${
                    isSelected
                      ? 'border-violet-500 bg-violet-500'
                      : 'border-slate-600'
                  }
                `}>
                  {isSelected && (
                    <Icon icon={ICONS.check} className="w-3 h-3 text-white" />
                  )}
                </div>

                {/* Icon */}
                <Icon
                  icon={channel.icon}
                  className={`
                    w-6 h-6 mb-2 transition-colors
                    ${isSelected ? 'text-violet-400' : 'text-slate-400'}
                  `}
                />

                {/* Label */}
                <p className={`
                  text-sm font-medium text-center transition-colors
                  ${isSelected ? 'text-violet-300' : 'text-slate-200'}
                `}>
                  {channel.label}
                </p>
              </label>
            );
          })}
        </div>
        {errors.communication_channels && (
          <p className="text-xs text-red-400 flex items-center gap-1.5">
            <Icon icon={ICONS.alertCircle} className="w-3.5 h-3.5" />
            {errors.communication_channels.message}
          </p>
        )}
      </motion.div>

      {/* Communication Tone */}
      <motion.div variants={fadeInVariants} className="space-y-3">
        <label className="block text-sm font-medium text-slate-200">
          Communication Tone <span className="text-violet-400">*</span>
        </label>
        <div className="space-y-2">
          {tones.map((tone) => (
            <label
              key={tone.value}
              className="relative flex items-start p-4 border border-slate-700/50 rounded-lg cursor-pointer hover:border-violet-500/50 transition-colors"
            >
              <input
                type="radio"
                value={tone.value}
                {...register('communication_tone')}
                className="sr-only peer"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-slate-200 peer-checked:text-violet-300">
                    {tone.label}
                  </p>
                  <Icon
                    icon={ICONS.messageSquare}
                    className="w-4 h-4 text-slate-400 peer-checked:text-violet-400"
                  />
                </div>
                <p className="text-xs text-slate-500 mb-1">
                  {tone.description}
                </p>
                <p className="text-xs text-slate-600 italic">
                  Example: {tone.example}
                </p>
              </div>
              <div className="absolute inset-0 border-2 border-violet-500 rounded-lg opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
            </label>
          ))}
        </div>
        {errors.communication_tone && (
          <p className="text-xs text-red-400 flex items-center gap-1.5">
            <Icon icon={ICONS.alertCircle} className="w-3.5 h-3.5" />
            {errors.communication_tone.message}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
