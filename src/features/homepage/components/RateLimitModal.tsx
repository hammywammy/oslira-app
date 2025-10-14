/**
 * @file Rate Limit Modal
 * @description Show when user hits daily limit
 * 
 * Replaces: HomeHandlers.js showRateLimitModal()
 */

import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { ENV } from '@/core/config/env';

// =============================================================================
// TYPES
// =============================================================================

interface RateLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  remaining: number;
  resetIn: number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function RateLimitModal({
  isOpen,
  onClose,
  remaining,
  resetIn,
}: RateLimitModalProps) {
  const handleLogin = () => {
    window.location.href = `${ENV.frontendUrl}/auth/login`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Daily Limit Reached
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          You've used your free analysis today. Resets in{' '}
          <strong>{resetIn} hours</strong>.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleLogin}
            variant="primary"
            fullWidth
          >
            Login for More Analyses
          </Button>

          <button
            onClick={onClose}
            className="w-full text-gray-500 hover:text-gray-700 transition-colors"
          >
            Close
          </button>
        </div>

        {/* Remaining info */}
        {remaining > 0 && (
          <p className="mt-4 text-xs text-gray-500">
            {remaining} analyses remaining today
          </p>
        )}
      </div>
    </Modal>
  );
}

export default RateLimitModal;
