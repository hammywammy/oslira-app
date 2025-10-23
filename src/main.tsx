// src/main.tsx

/**
 * APPLICATION ENTRY POINT
 * 
 * Simple, clean entry - no complex config loading
 * Environment detection handled automatically by environment.ts
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@/styles/index.css';

// =============================================================================
// START APP
// =============================================================================

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found in DOM');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
