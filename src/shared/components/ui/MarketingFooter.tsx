/**
 * @file Marketing Footer
 * @description Shared footer for all marketing pages
 * Path: src/shared/components/MarketingFooter.tsx
 */

import { motion } from 'framer-motion';
import { Logo } from '@/shared/components/ui/Logo';

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-20 px-4 md:px-8 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Logo size="lg" />
              <span className="text-2xl font-bold text-white">Oslira</span>
            </div>
            
            <p className="text-slate-400 leading-relaxed">
              The prospecting engine for small teams and solo operators. Turn raw leads into revenue with intelligent outbound.
            </p>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              {['About', 'Case Studies', 'Contact'].map((link) => (
                <li key={link}>
                  <motion.a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3">
              {['API', 'Documentation', 'Pricing'].map((link) => (
                <li key={link}>
                  <motion.a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-3">
              {['Help', 'Security', 'Status'].map((link) => (
                <li key={link}>
                  <motion.a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} Oslira. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            {['Disclaimer', 'Privacy', 'Refund', 'Terms'].map((link, index, array) => (
              <span key={link} className="flex items-center gap-4">
                <motion.a
                  href="#"
                  className="hover:text-white transition-colors"
                  whileHover={{ y: -2 }}
                >
                  {link}
                </motion.a>
                {index < array.length - 1 && <span className="text-slate-600">|</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MarketingFooter;
