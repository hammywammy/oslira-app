/**
 * @file Application Entry Point
 * @description Main entry point for the React application
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeConfig, validateConfig } from '@/core/config/env';
import { logger } from '@/core/utils/logger';

// Initialize config from backend (AWS Secrets Manager)
async function startApp() {
  try {
    // Fetch config from backend
    await initializeConfig();
    
    // Validate config
    validateConfig();
    
    logger.info('Application starting with config from AWS');
  } catch (error) {
    console.error('Configuration initialization failed:', error);
  // Show error to user
  document.body.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-center: center;
      min-height: 100vh;
      background: #f3f4f6;
      font-family: system-ui, -apple-system, sans-serif;
    ">
      <div style="
        max-width: 500px;
        padding: 2rem;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      ">
        <h1 style="color: #dc2626; margin: 0 0 1rem 0;">Configuration Error</h1>
        <p style="color: #6b7280; margin: 0;">
          The application is missing required configuration. Please check your environment variables.
        </p>
        <pre style="
          margin-top: 1rem;
          padding: 1rem;
          background: #f3f4f6;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          overflow-x: auto;
        ">${error instanceof Error ? error.message : 'Unknown error'}</pre>
      </div>
    </div>
  `;
  throw error;
}

// Render app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
