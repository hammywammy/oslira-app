import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Environment-specific config (build-time injection)
  const env = {
    staging: {
      apiUrl: 'https://api-staging.oslira.com',
      appUrl: 'https://staging-app.oslira.com',
    },
    production: {
      apiUrl: 'https://api.oslira.com',
      appUrl: 'https://app.oslira.com',
    },
  };

  const config = env[mode as 'staging' | 'production'] || env.production;

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      // Inject at build time as constants (tree-shakeable)
      '__APP_ENV__': JSON.stringify(mode),
      '__API_URL__': JSON.stringify(config.apiUrl),
      '__APP_URL__': JSON.stringify(config.appUrl),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/core': path.resolve(__dirname, './src/core'),
        '@/features': path.resolve(__dirname, './src/features'),
        '@/shared': path.resolve(__dirname, './src/shared'),
        '@/types': path.resolve(__dirname, './src/types'),
      },
    },
    server: {
      port: 3000,
      open: true,
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'supabase': ['@supabase/supabase-js'],
            'query': ['@tanstack/react-query'],
            'state': ['zustand'],
          },
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    },
  };
});
