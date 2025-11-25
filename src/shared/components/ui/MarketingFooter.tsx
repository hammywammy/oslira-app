/**
 * @file Marketing Footer
 * @description Shared footer for all marketing pages
 * Path: src/shared/components/MarketingFooter.tsx
 */

import { motion } from 'framer-motion';
import { Logo } from '@/shared/components/ui/Logo';

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: 'Pricing', href: '/pricing' },
    { label: 'Disclaimer', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Refund', href: '#' },
    { label: 'Terms', href: '#' },
  ];

  return (
    <footer className="py-12 px-4 md:px-8 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Brand Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Logo size="lg" />
            <span className="text-2xl font-bold text-white">Oslira</span>
          </div>

          <p className="text-slate-400 leading-relaxed max-w-2xl">
            The prospecting engine for small teams and solo operators. Turn raw leads into revenue with intelligent outbound.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} Oslira. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            {links.map((link, index) => (
              <span key={link.label} className="flex items-center gap-4">
                <motion.a
                  href={link.href}
                  className="hover:text-white transition-colors"
                  whileHover={{ y: -2 }}
                >
                  {link.label}
                </motion.a>
                {index < links.length - 1 && <span className="text-slate-600">|</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MarketingFooter;
