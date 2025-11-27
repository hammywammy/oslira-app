/**
 * EXTERNAL LINKS SECTION COMPONENT
 *
 * Displays external links from lead's profile (website, calendly, linktree, etc.)
 * Only renders if links exist - no empty state
 */

import { Icon } from '@iconify/react';
import type { ExternalLink } from '@/shared/types/leads.types';

interface ExternalLinksSectionProps {
  links: ExternalLink[];
}

/**
 * Get context-aware emoji icon based on URL
 */
function getLinkIcon(url: string): string {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('calendly')) return '📅';
  if (lowerUrl.includes('linktree') || lowerUrl.includes('linktr.ee')) return '🌳';
  if (lowerUrl.includes('instagram')) return '📸';
  if (lowerUrl.includes('youtube')) return '🎥';
  if (lowerUrl.includes('tiktok')) return '🎵';
  if (lowerUrl.includes('twitter') || lowerUrl.includes('x.com')) return '🐦';
  if (lowerUrl.includes('linkedin')) return '💼';
  if (lowerUrl.includes('facebook')) return '👤';
  if (lowerUrl.includes('spotify')) return '🎧';
  if (lowerUrl.includes('substack')) return '📰';
  if (lowerUrl.includes('patreon')) return '🎨';
  if (lowerUrl.includes('ko-fi') || lowerUrl.includes('buymeacoffee')) return '☕';
  return '🌐';
}

/**
 * Extract clean domain from URL
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    let domain = urlObj.hostname.replace('www.', '');
    // Include path for certain services
    if (domain === 'calendly.com' || domain === 'linktr.ee') {
      const path = urlObj.pathname.replace(/\/$/, '');
      if (path && path !== '/') {
        return `${domain}${path}`;
      }
    }
    return domain;
  } catch {
    return url;
  }
}

function LinkItem({ link }: { link: ExternalLink }) {
  const icon = getLinkIcon(link.url);
  const displayText = link.title || extractDomain(link.url);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors duration-100 group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-base shrink-0">{icon}</span>
        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
          {displayText}
        </span>
      </div>
      <Icon
        icon="mdi:chevron-right"
        className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0 ml-2"
      />
    </a>
  );
}

export function ExternalLinksSection({ links }: ExternalLinksSectionProps) {
  if (!links || links.length === 0) return null;

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          🔗 Links
        </h3>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          ({links.length})
        </span>
      </div>

      <div className="space-y-1">
        {links.map((link, index) => (
          <LinkItem key={index} link={link} />
        ))}
      </div>
    </div>
  );
}
