// src/features/dashboard/components/LeadsTable/AIAnalysisSection.tsx

/**
 * AI ANALYSIS SECTION COMPONENT
 *
 * Displays AI-generated insights in a refined, Stripe-level professional layout:
 * - Strengths (positive insights)
 * - Weaknesses (areas of concern)
 * - Risk Factors (critical considerations)
 *
 * Sophisticated design with subtle accents, clean white space, purposeful typography
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
    <div className="space-y-3">
      {/* Strengths Section */}
      {strengths && strengths.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="group bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-sm hover:border-gray-300"
        >
          <div className="border-l-4 border-l-emerald-500 p-6">
            <h3 className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 mb-4">
              <div className="p-1.5 rounded-md bg-emerald-50">
                <Icon icon="mdi:check-circle" className="w-4 h-4 text-emerald-600" />
              </div>
              Key Strengths
            </h3>

            <ul className="space-y-3">
              {strengths.map((strength, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-[15px] text-gray-800 leading-relaxed"
                >
                  <Icon
                    icon="mdi:circle-small"
                    className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"
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
          className="group bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-sm hover:border-gray-300"
        >
          <div className="border-l-4 border-l-amber-500 p-6">
            <h3 className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 mb-4">
              <div className="p-1.5 rounded-md bg-amber-50">
                <Icon icon="mdi:alert-circle" className="w-4 h-4 text-amber-600" />
              </div>
              Areas of Concern
            </h3>

            <ul className="space-y-3">
              {weaknesses.map((weakness, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-[15px] text-gray-800 leading-relaxed"
                >
                  <Icon
                    icon="mdi:circle-small"
                    className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
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
          className="group bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-sm hover:border-gray-300"
        >
          <div className="border-l-4 border-l-red-500 p-6">
            <h3 className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 mb-4">
              <div className="p-1.5 rounded-md bg-red-50">
                <Icon icon="mdi:shield-alert" className="w-4 h-4 text-red-600" />
              </div>
              Risk Factors
            </h3>

            <ul className="space-y-3">
              {riskFactors.map((risk, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-[15px] text-gray-800 leading-relaxed"
                >
                  <Icon
                    icon="mdi:circle-small"
                    className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
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
