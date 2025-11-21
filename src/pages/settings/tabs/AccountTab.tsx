// src/pages/settings/tabs/AccountTab.tsx

/**
 * ACCOUNT TAB - AUTHENTICATION & SECURITY
 * 
 * Placeholder for account management features:
 * - Profile information
 * - Password change
 * - Connected accounts (OAuth)
 * - Account deletion
 * 
 * FUTURE INTEGRATION:
 * - Connect to user profile API
 * - Add password change functionality
 * - Add OAuth account management
 * - Add account deletion flow
 */

import { Icon } from '@iconify/react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { useAuth } from '@/features/auth/contexts/AuthProvider';

// =============================================================================
// COMPONENT
// =============================================================================

export function AccountTab() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Account</h2>
        <p className="text-muted-foreground">
          Manage your account settings and authentication
        </p>
      </div>

      {/* Account Information */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon icon="ph:identification-card" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Account Information</h3>
              <p className="text-sm text-muted-foreground">
                Your account details and status
              </p>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <div className="text-sm font-medium text-foreground">Email Address</div>
                <div className="text-sm text-muted-foreground mt-1">{user?.email}</div>
              </div>
              <Icon icon="ph:check-circle" className="w-5 h-5 text-green-600" />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <div className="text-sm font-medium text-foreground">Account Created</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {/* TODO: Format user creation date */}
                  Recently
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <div className="text-sm font-medium text-foreground">Account ID</div>
                <div className="text-sm text-muted-foreground mt-1 font-mono">
                  {user?.id?.slice(0, 16)}...
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Authentication */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon icon="ph:key" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Manage your login methods
              </p>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon icon="logos:google-icon" className="w-6 h-6" />
                <div>
                  <div className="text-sm font-medium text-foreground">Google</div>
                  <div className="text-xs text-muted-foreground">Connected</div>
                </div>
              </div>
              <Button variant="secondary" size="sm" disabled>
                Disconnect
              </Button>
            </div>
          </div>

          {/* Password Section (placeholder) */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">Password</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Update your password for enhanced security
                </div>
              </div>
              <Button variant="secondary" disabled>
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-200 dark:border-red-900">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-red-200 dark:border-red-900">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <Icon icon="ph:warning" className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">
                Irreversible account actions
              </p>
            </div>
          </div>

          {/* Delete Account */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-foreground">Delete Account</div>
              <div className="text-xs text-muted-foreground mt-1 max-w-md">
                Permanently delete your account and all associated data. This action cannot be undone.
              </div>
            </div>
            <Button variant="secondary" disabled className="text-red-600 dark:text-red-400">
              <Icon icon="ph:trash" className="w-4 h-4" />
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AccountTab;
