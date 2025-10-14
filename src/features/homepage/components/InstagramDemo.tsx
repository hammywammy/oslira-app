/**
 * @file Instagram Demo Component
 * @description Demo input + results display
 * 
 * Replaces: HomeApp.js setupInstagramDemo()
 */

import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useInstagramAnalysis } from '../hooks/useInstagramAnalysis';
import { DemoResultsModal } from './DemoResultsModal';
import { RateLimitModal } from './RateLimitModal';
import type { InstagramAnalysisResponse, RateLimitError } from '../api/instagramApi';

// =============================================================================
// COMPONENT
// =============================================================================

export function InstagramDemo() {
  const [username, setUsername] = useState('');
  const [analysisResult, setAnalysisResult] = useState<InstagramAnalysisResponse | null>(null);
  const [rateLimitError, setRateLimitError] = useState<RateLimitError | null>(null);

  // Analysis mutation
  const { mutate: analyzeProfile, isPending } = useInstagramAnalysis({
    onSuccess: (data) => {
      setAnalysisResult(data);
    },
    onRateLimit: (error) => {
      setRateLimitError(error);
    },
  });

  // Handle form submission
  const handleAnalyze = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!username.trim()) {
      return;
    }

    analyzeProfile(username);
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <>
      <div className="home__hero-demo-container">
        <p className="home__demo-intro-text">Try the AI analysis below:</p>

        <form onSubmit={handleAnalyze} className="home__demo-input-container">
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="@instagram_handle"
            className="home__demo-input"
            fullWidth
            disabled={isPending}
            aria-label="Instagram handle"
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            disabled={isPending || !username.trim()}
            className="home__demo-analyze-btn"
          >
            {isPending ? 'Analyzing...' : 'Quick Analysis'}
          </Button>
        </form>
      </div>

      {/* Modals */}
      <DemoResultsModal
        isOpen={!!analysisResult}
        onClose={() => setAnalysisResult(null)}
        data={analysisResult}
      />

      <RateLimitModal
        isOpen={!!rateLimitError}
        onClose={() => setRateLimitError(null)}
        remaining={rateLimitError?.metadata.remaining ?? 0}
        resetIn={rateLimitError?.metadata.resetIn ?? 24}
      />
    </>
  );
}

export default InstagramDemo;
