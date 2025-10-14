/**
 * @file Application Entry Point
 * @description Main entry point - fetches config from AWS via backend before starting React
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { initializeConfig, validateConfig } from '@/core/config/env';
import { logger } from '@/core/utils/logger';

// ✅ NEW - importing Tailwind v4
import '@/styles/index.css';

async function startApp() {
  try {
    logger.info('🚀 Starting Oslira V2...');

    // STEP 1: Fetch config from backend
    logger.info('📡 Fetching config from backend...');
    await initializeConfig();
    
    // STEP 2: Validate required config fields
    logger.info('✅ Validating config...');
    validateConfig();
    
    logger.info('✅ Config loaded successfully from AWS');
    
    // STEP 3: Render React app
    logger.info('⚛️ Rendering React app...');
    const root = ReactDOM.createRoot(document.getElementById('root')!);
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    logger.info('✅ Application started successfully');
    
  } catch (error) {
    logger.error('❌ Application startup failed', error as Error);
    showErrorScreen(error as Error);
  }
}

// =============================================================================
// ERROR SCREEN
// =============================================================================

function showErrorScreen(error: Error) {
  document.body.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 2rem;
    ">
      <div style="
        max-width: 500px;
        width: 100%;
        padding: 2.5rem;
        background: white;
        border-radius: 1rem;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      ">
        <!-- Error Icon -->
        <div style="
          width: 64px;
          height: 64px;
          margin: 0 auto 1.5rem;
          background: linear-gradient(135deg, #f87171 0%, #dc2626 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        ">
          ⚠️
        </div>
        
        <!-- Error Title -->
        <h1 style="
          color: #111827;
          font-size: 1.5rem;
          font-weight: 700;
          text-align: center;
          margin: 0 0 0.75rem 0;
        ">
          Configuration Error
        </h1>
        
        <!-- Error Message -->
        <p style="
          color: #6b7280;
          font-size: 1rem;
          text-align: center;
          margin: 0 0 1.5rem 0;
          line-height: 1.5;
        ">
          Unable to load application configuration. Please check your backend connection.
        </p>
        
        <!-- Error Details (Collapsible) -->
        <details style="
          margin-bottom: 1.5rem;
        ">
          <summary style="
            color: #9ca3af;
            font-size: 0.875rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 0.5rem;
            transition: background 0.2s;
          ">
            Show technical details
          </summary>
          <pre style="
            margin-top: 0.75rem;
            padding: 1rem;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            font-size: 0.75rem;
            overflow-x: auto;
            color: #374151;
            line-height: 1.5;
          ">${error.message || 'Unknown error'}</pre>
        </details>
        
        <!-- Action Buttons -->
        <div style="
          display: flex;
          gap: 0.75rem;
        ">
          <button
            onclick="window.location.reload()"
            style="
              flex: 1;
              padding: 0.75rem 1.5rem;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              border-radius: 0.5rem;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              transition: transform 0.2s, box-shadow 0.2s;
            "
            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 10px 20px rgba(102, 126, 234, 0.4)'"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
          >
            Try Again
          </button>
          
          <a
            href="mailto:support@oslira.com"
            style="
              flex: 1;
              padding: 0.75rem 1.5rem;
              background: #f3f4f6;
              color: #374151;
              border: none;
              border-radius: 0.5rem;
              font-size: 1rem;
              font-weight: 600;
              text-decoration: none;
              text-align: center;
              cursor: pointer;
              transition: background 0.2s;
            "
            onmouseover="this.style.background='#e5e7eb'"
            onmouseout="this.style.background='#f3f4f6'"
          >
            Contact Support
          </a>
        </div>
        
        <!-- Help Text -->
        <p style="
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
          color: #9ca3af;
          font-size: 0.875rem;
          text-align: center;
        ">
          If this problem persists, please contact our support team.
        </p>
      </div>
    </div>
  `;
}

// =============================================================================
// START THE APP
// =============================================================================

startApp();
