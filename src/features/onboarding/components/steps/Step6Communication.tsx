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

  // ✅ PROPER TYPE HANDLING WITH FALLBACK
  const selectedChannels = (watch('communication_channels') as string[] | undefined) || [];

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
                      ? 'bg-violet-500/20 border-violet-500 shadow-lg shadow-violet-500/20'
                      : 'bg-slate-900/50 border-slate-700/50 hover:border-violet-500/50'
                  }
                `}
              >
                <input
                  type="checkbox"
                  value={channel.value}
                  {...register('communication_channels')}
                  className="sr-only"
                />
                <Icon icon={channel.icon} className="text-3xl text-white mb-2" />
                <span className="text-sm font-medium text-white">{channel.label}</span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center"
                  >
                    <Icon icon={ICONS.check} className="text-white text-xs" />
                  </motion.div>
                )}
              </label>
            );
          })}
        </div>
        {errors.communication_channels && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <Icon icon={ICONS.alertCircle} className="text-sm" />
            {typeof errors.communication_channels.message === 'string' 
              ? errors.communication_channels.message 
              : 'Please select at least one channel'}
          </p>
        )}
      </motion.div>

      {/* Communication Tone */}
      <motion.div variants={fadeInVariants} className="space-y-3">
        <label className="block text-sm font-medium text-slate-200">
          Communication Tone <span className="text-violet-400">*</span>
        </label>
        <div className="space-y-3">
          {tones.map((tone) => (
            <label
              key={tone.value}
              className="flex items-start gap-3 p-4 bg-slate-900/50 border border-slate-700/50 rounded-lg cursor-pointer hover:border-violet-500/50 transition-all duration-200"
            >
              <input
                type="radio"
                value={tone.value}
                {...register('communication_tone')}
                className="mt-1 w-4 h-4 text-violet-500 border-slate-600 focus:ring-violet-500 focus:ring-offset-slate-900"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white">{tone.label}</span>
                  <span className="text-xs text-slate-400">{tone.description}</span>
                </div>
                <p className="text-sm text-slate-500 italic">{tone.example}</p>
              </div>
            </label>
          ))}
        </div>
        {errors.communication_tone && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <Icon icon={ICONS.alertCircle} className="text-sm" />
            {typeof errors.communication_tone.message === 'string'
              ? errors.communication_tone.message
              : 'Please select a tone'}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
