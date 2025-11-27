// src/features/dashboard/components/LeadsTable/AIAnalysisSection.tsx

/**
 * AI ANALYSIS SECTION COMPONENT
 *
 * Displays AI-generated insights in an elegant, professional layout:
 * - Strengths (positive insights)
 * - Weaknesses (areas of concern)
 * - Risk Factors (critical considerations)
 *
 * Enterprise-grade design with semantic colors and smooth interactions
 */

import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

interface AIAnalysisSectionProps {
  strengths?: string[];
  weaknesses?: string[];
  riskFactors?: string[];
}

export function AIAnalysisSection({
  strengths,
  weaknesses,
  riskFactors,
}: AIAnalysisSectionProps) {
  // Don't render if no data
  if (!strengths?.length && !weaknesses?.length && !riskFactors?.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Strengths Section */}
      {strengths && strengths.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="group rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700"
        >
          <div className="border-l-4 border-l-emerald-500 p-5">
            <h3 className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-3">
              <Icon icon="mdi:check-circle" className="w-4 h-4" />
              Key Strengths
            </h3>

            <ul className="space-y-2">
              {strengths.map((strength, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                >
                  <Icon
                    icon="mdi:circle-medium"
                    className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
                  />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Weaknesses Section */}
      {weaknesses && weaknesses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="group rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700"
        >
          <div className="border-l-4 border-l-amber-500 p-5">
            <h3 className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-3">
              <Icon icon="mdi:alert-circle" className="w-4 h-4" />
              Areas of Concern
            </h3>

            <ul className="space-y-2">
              {weaknesses.map((weakness, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                >
                  <Icon
                    icon="mdi:circle-medium"
                    className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
                  />
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Risk Factors Section */}
      {riskFactors && riskFactors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="group rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-red-300 dark:hover:border-red-700"
        >
          <div className="border-l-4 border-l-red-500 p-5">
            <h3 className="flex items-center gap-2 text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wide mb-3">
              <Icon icon="mdi:shield-alert" className="w-4 h-4" />
              Risk Factors
            </h3>

            <ul className="space-y-2">
              {riskFactors.map((risk, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                >
                  <Icon
                    icon="mdi:circle-medium"
                    className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5"
                  />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}
