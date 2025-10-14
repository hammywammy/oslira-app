/**
 * @file Logo Component
 * @description Reusable logo component
 * Path: src/shared/components/ui/Logo.tsx
 */

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8',   // 32px
    md: 'h-10',  // 40px
    lg: 'h-12',  // 48px
  };

  return (
    <img
      src="/oslira-logo.svg"
      alt="Oslira"
      className={`w-auto ${sizeClasses[size]} ${className}`}
    />
  );
}

export default Logo;
