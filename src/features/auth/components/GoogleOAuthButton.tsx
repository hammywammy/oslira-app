// src/features/auth/components/GoogleOAuthButton.tsx
/**
 * @file Google OAuth Button - Minimal Design
 * @description Clean OAuth button with subtle interactions
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { httpClient } from '@/core/auth/http-client';
import { env } from '@/core/auth/environment';

// =============================================================================
// TYPES
// =============================================================================

interface GoogleOAuthButtonProps {
  label?: string;
  mode?: 'login' | 'signup';
}

// =============================================================================
// COMPONENT
// =============================================================================

export function GoogleOAuthButton({
  label = 'Continue with Google',
  mode: _mode = 'login',
}: GoogleOAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initiate Google OAuth flow
   */
  async function handleClick() {
    try {
      setIsLoading(true);
      setError(null);

      // Step 1: Get Google Client ID from backend
      const response = await httpClient.get<{ clientId: string }>(
        '/api/auth/google-client-id',
        { skipAuth: true }
      );

      const clientId = response.clientId;

      // Step 2: Build Google OAuth URL
      const redirectUri = `${env.appUrl}/auth/callback`;

      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent',
      });

      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

      // Step 3: Redirect to Google
      window.location.href = googleAuthUrl;
    } catch (err: any) {
      console.error('[GoogleOAuthButton] Error:', err);
      setError('Failed to initiate sign-in');
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <motion.button
        onClick={handleClick}
        disabled={isLoading}
        whileHover={!isLoading ? { scale: 1.01 } : undefined}
        whileTap={!isLoading ? { scale: 0.99 } : undefined}
        transition={{ duration: 0.1 }}
        className={`
          relative w-full px-4 py-3 
          bg-neutral-900 hover:bg-neutral-800
          text-white font-medium
          rounded-xl
          flex items-center justify-center gap-3
          transition-colors duration-200
          ${isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {/* Loading state */}
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            {/* Google Icon */}
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>

            {/* Label */}
            <span>{label}</span>
          </>
        )}
      </motion.button>

      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 text-center"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
