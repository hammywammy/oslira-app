/**
 * GENERAL TAB - USER PREFERENCES
 * 
 * Primary user-facing settings:
 * - What should we call you? (preferred name)
 * - Business Context (editable description for AI personalization)
 * 
 * PLACEHOLDER IMPLEMENTATION:
 * - Local state only (no backend integration yet)
 * - Real data connections added later
 * - Structure designed for easy backend hookup
 * 
 * FUTURE INTEGRATION:
 * - Connect to user profile API
 * - Connect to business profile API
 * - Add auto-save functionality
 * - Add validation
 */

import { useState } from 'react';
import { logger } from '@/core/utils/logger';
import { Icon } from '@iconify/react';
import { Input } from '@/shared/components/ui/Input';
import { Textarea } from '@/shared/components/ui/Textarea';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { useAuth } from '@/features/auth/contexts/AuthProvider';

export function GeneralTab() {
  const { user } = useAuth();
  
  // Placeholder state (will be replaced with backend data)
  const [preferredName, setPreferredName] = useState(user?.full_name || '');
  const [businessContext, setBusinessContext] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Handle save (placeholder - will call backend later)
  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setHasChanges(false);
    
    // TODO(oslira): Connect to PUT /api/user/preferences endpoint when backend is ready
    logger.info('[GeneralTab] Saving preferences', { preferredName, businessContext });
  };

  // Handle input changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferredName(e.target.value);
    setHasChanges(true);
  };

  const handleContextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBusinessContext(e.target.value);
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">General</h2>
        <p className="text-muted-foreground">
          Manage your basic preferences and profile settings
        </p>
      </div>

      {/* Profile Section */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon icon="ph:user" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Profile</h3>
              <p className="text-sm text-muted-foreground">
                How you appear in Oslira
              </p>
            </div>
          </div>

          {/* Preferred Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              What should we call you?
            </label>
            <Input
              value={preferredName}
              onChange={handleNameChange}
              placeholder="Enter your preferred name"
              className="max-w-md"
            />
            <p className="text-xs text-muted-foreground">
              This name will be used throughout the application and in AI-generated content
            </p>
          </div>

          {/* Account Email (Read-only) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              value={user?.email || ''}
              disabled
              className="max-w-md bg-muted/50"
            />
            <p className="text-xs text-muted-foreground">
              Your login email cannot be changed
            </p>
          </div>
        </div>
      </Card>

      {/* Business Context Section */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon icon="ph:briefcase" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Business Context</h3>
              <p className="text-sm text-muted-foreground">
                Help AI understand your business better
              </p>
            </div>
          </div>

          {/* Business Context Textarea */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Describe your business and target audience
            </label>
            <Textarea
              value={businessContext}
              onChange={handleContextChange}
              placeholder="Tell us about your business, what you do, who you serve, and what makes you unique. This helps our AI generate more relevant and personalized lead insights..."
              rows={8}
              className="resize-y"
            />
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Icon icon="ph:info" className="w-4 h-4 shrink-0 mt-0.5" />
              <p>
                This context will be used to personalize AI analysis and outreach message generation.
                The more detail you provide, the better the results.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      {hasChanges && (
        <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-amber-900 dark:text-amber-200">
            <Icon icon="ph:warning" className="w-4 h-4" />
            <span>You have unsaved changes</span>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="min-w-[120px]"
          >
            {isSaving ? (
              <>
                <Icon icon="ph:spinner" className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Icon icon="ph:check" className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default GeneralTab;
