// src/features/auth/components/GoogleOAuthButton.tsx

/**
 * GOOGLE OAUTH BUTTON
 * 
 * Initiates Google OAuth flow
 * 
 * Flow:
 * 1. Fetch Google Client ID from backend /api/auth/google-client-id
 * 2. Redirect to Google OAuth consent screen
 * 3. Google redirects back to /auth/callback?code=xxx
 * 4. OAuthCallbackPage handles the rest
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
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
  mode = 'login',
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
      // Backend fetches from AWS Secrets Manager
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
        prompt: 'consent', // Force consent screen (ensures refresh token)
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
        whileHover={!isLoading ? { scale: 1.01, y: -1 } : undefined}
        whileTap={!isLoading ? { scale: 0.99 } : undefined}
        className={`
          w-full px-6 py-3 
          bg-white border-2 border-slate-200 
          rounded-xl font-semibold 
          flex items-center justify-center gap-3
          shadow-sm hover:shadow-md
          transition-all duration-200
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-300'}
        `}
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Icon icon="mdi:loading" className="w-5 h-5 text-slate-600" />
          </motion.div>
        ) : (
          <>
            <Icon icon="mdi:google" className="w-5 h-5 text-slate-700" />
            <span className="text-slate-700">{label}</span>
          </>
        )}
      </motion.button>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 text-center"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
