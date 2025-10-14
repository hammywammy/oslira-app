/**
 * @file Marketing Footer
 * @description Shared footer for all marketing pages (HomePage, Pricing, About, etc.)
 * Path: src/shared/components/MarketingFooter.tsx
 */

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Logo } from '@/shared/components/ui/Logo';

// =============================================================================
// COMPONENT
// =============================================================================

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-20 px-4 md:px-8 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Logo size="lg" className="mb-4" />
            
            <p className="text-slate-400 mb-6 leading-relaxed">
              Turn hours of Instagram prospecting into minutes with AI-powered lead analysis and personalized outreach.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: 'mdi:twitter', url: '#', label: 'Twitter' },
                { icon: 'mdi:linkedin', url: '#', label: 'LinkedIn' },
                { icon: 'mdi:github', url: '#', label: 'GitHub' },
                { icon: 'mdi:youtube', url: '#', label: 'YouTube' },
              ].map((social) => (
                <motion.a
                  key={social.icon}
                  href={social.url}
                  aria-label={social.label}
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white"
                  whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: 'rgba(59, 130, 246, 0.5)'
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon icon={social.icon} className="text-xl" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'Changelog', 'Roadmap'].map((link) => (
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

          {/* Resources Column */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-3">
              {['Documentation', 'Help Center', 'API Reference', 'Blog'].map((link) => (
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

          {/* Company Column */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              {['About', 'Contact', 'Careers', 'Press Kit'].map((link) => (
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
          <div className="flex gap-6 text-sm">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((link) => (
              <motion.a
                key={link}
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                whileHover={{ y: -2 }}
              >
                {link}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MarketingFooter;
