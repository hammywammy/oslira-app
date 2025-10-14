/**
 * @file Marketing Header
 * @description Reusable header for marketing pages
 * 
 * Replaces: HTML nav section in index.html
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ENV } from '@/core/config/env';

// =============================================================================
// COMPONENT
// =============================================================================

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLoginClick = () => {
    window.location.href = `${ENV.frontendUrl}/auth/login`;
  };

  return (
    <nav className="home__nav">
      <div className="home__nav-container">
        <Link to="/" className="home__logo">
          <img
            src="/assets/images/oslira-logo.png"
            alt="Oslira Logo"
            className="home__logo-image"
          />
          <span>Oslira</span>
        </Link>

        {/* Desktop Menu */}
        <div className="home__nav-menu">
          <Link to="/about" className="home__nav-link">
            About
          </Link>
          <Link to="/pricing" className="home__nav-link">
            Pricing
          </Link>
          <Link to="/security" className="home__nav-link">
            Security
          </Link>
          <Link to="/help" className="home__nav-link">
            Help
          </Link>
          <button
            onClick={handleLoginClick}
            className="home__nav-link home__nav-link--login"
          >
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-6 py-4 space-y-3">
            <Link
              to="/about"
              className="block text-gray-600 hover:text-blue-600 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/pricing"
              className="block text-gray-600 hover:text-blue-600 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/security"
              className="block text-gray-600 hover:text-blue-600 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Security
            </Link>
            <Link
              to="/help"
              className="block text-gray-600 hover:text-blue-600 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Help
            </Link>
            <button
              onClick={handleLoginClick}
              className="block w-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-semibold py-3 px-4 rounded-lg text-center"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default MarketingHeader;
