/**
 * @file Demo Results Modal
 * @description Display Instagram analysis results
 * 
 * Replaces: HomeHandlers.js showAnonymousResultsModal()
 */

import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { env } from '@/core/auth/environment';
import type { InstagramAnalysisResponse } from '../api/instagramApi';

// =============================================================================
// TYPES
// =============================================================================

interface DemoResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InstagramAnalysisResponse | null;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DemoResultsModal({ isOpen, onClose, data }: DemoResultsModalProps) {
  if (!data) return null;

  const { profile, insights } = data;
  const score = insights.overallScore;
  const username = `@${profile.username}`;

  const handleGetStarted = () => {
    // Redirect to auth
    window.location.href = `${env.appUrl}/auth/login`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {username.charAt(1).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{username}</h2>
            <p className="text-sm text-gray-600">
              {profile.followersCount?.toLocaleString() ?? 'N/A'} followers
            </p>
          </div>
        </div>
      </div>

      {/* Score */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white font-bold text-2xl">
          {score}
        </div>
        <p className="mt-2 text-lg font-semibold text-gray-900">Overall Score</p>
        <p className="text-sm text-gray-600">Partnership Potential</p>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Account Summary</h3>
        <p className="text-gray-700">{insights.accountSummary}</p>
      </div>

      {/* Insights */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Engagement Insights</h3>
        <div className="space-y-3">
          {/* Show first 2 insights */}
          {insights.engagementInsights.slice(0, 2).map((insight, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg"
            >
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {index + 1}
              </div>
              <p className="text-gray-700 text-sm">{insight}</p>
            </div>
          ))}

          {/* Blurred insights */}
          {insights.engagementInsights.length > 2 && (
            <div className="relative">
              <div className="space-y-3 filter blur-sm">
                {insights.engagementInsights.slice(2).map((insight, index) => (
                  <div
                    key={index + 2}
                    className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg"
                  >
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 3}
                    </div>
                    <p className="text-gray-700 text-sm">{insight}</p>
                  </div>
                ))}
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span>{insights.engagementInsights.length - 2} More Insights</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Login to see full analysis + outreach strategies
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white text-center">
        <h3 className="font-bold text-lg mb-2">Get Complete Analysis</h3>
        <p className="text-blue-100 mb-4">
          See all insights + personalized outreach strategies for your business
        </p>
        <Button
          onClick={handleGetStarted}
          variant="secondary"
          fullWidth
        >
          Start Free Trial
        </Button>
        <p className="text-xs text-blue-200 mt-2">25 complete analyses included</p>
      </div>
    </Modal>
  );
}

export default DemoResultsModal;
