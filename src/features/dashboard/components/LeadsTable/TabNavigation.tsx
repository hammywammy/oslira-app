/**
 * TAB NAVIGATION COMPONENT
 *
 * Simple Stripe-style underline tabs for Overview/Analytics
 * Supports locked state for Analytics tab when using light analysis
 */

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export type TabType = 'overview' | 'analytics';

interface Tab {
  id: TabType;
  label: string;
  locked?: boolean;
}

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isLightAnalysis: boolean;
}

export function TabNavigation({ activeTab, onTabChange, isLightAnalysis }: TabNavigationProps) {
  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Analytics', locked: isLightAnalysis },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex gap-6 px-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isLocked = tab.locked;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`
                relative py-3 text-sm font-medium transition-colors duration-150
                ${isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : isLocked
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            >
              <span className="flex items-center gap-1.5">
                {tab.label}
                {isLocked && (
                  <Icon icon="mdi:lock" className="w-3.5 h-3.5" />
                )}
              </span>

              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
