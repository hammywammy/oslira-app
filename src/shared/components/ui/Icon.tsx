/**
 * @file Icon Component
 * @description Iconify wrapper with size presets
 */

import { Icon as IconifyIcon } from '@iconify/react';

interface IconProps {
  icon: string; // e.g., "mdi:home", "lucide:settings"
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  color?: string;
}

const sizeMap = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
};

export function Icon({ icon, size = 'md', className = '', color }: IconProps) {
  const iconSize = typeof size === 'number' ? size : sizeMap[size];

  return (
    <IconifyIcon
      icon={icon}
      width={iconSize}
      height={iconSize}
      className={className}
      style={color ? { color } : undefined}
    />
  );
}

export default Icon;
