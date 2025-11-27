/**
 * THEME PROVIDER - PRODUCTION GRADE V2.0 (SUBDOMAIN-AWARE)
 * 
 * CRITICAL UPDATE:
 * ✅ Marketing pages (oslira.com) → ALWAYS light mode, unaffected by toggle
 * ✅ App pages (app.oslira.com) → Full dark mode support
 * ✅ Showcase pages → Can toggle for demo purposes
 * 
 * ARCHITECTURE:
 * - Detects subdomain/path to determine if dark mode should be enabled
 * - Marketing pages ignore theme state entirely
 * - App pages respect theme state and localStorage
 * - Showcase pages can toggle but don't affect marketing
 * 
 * PHILOSOPHY:
 * "Marketing = Always Professional Light, App = User Choice"
 */

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  ReactNode 
} from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  /** Current theme: 'light', 'dark', or 'system' */
  theme: Theme;
  /** Resolved theme (what's actually applied) */
  resolvedTheme: 'light' | 'dark';
  /** Set theme directly */
  setTheme: (theme: Theme) => void;
  /** Toggle between light and dark */
  toggleTheme: () => void;
  /** Whether dark mode is allowed on current page */
  darkModeEnabled: boolean;
}

const STORAGE_KEY = 'oslira-theme';
const THEME_CLASS = 'dark';

// CONTEXT
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// HELPER: Check if dark mode should be enabled
function isDarkModeAllowed(): boolean {
  if (typeof window === 'undefined') return false;

  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  // Marketing domain → NEVER allow dark mode
  const isMarketingDomain =
    hostname === 'oslira.com' ||
    hostname === 'www.oslira.com' ||
    hostname === 'staging.oslira.com' ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1';

  // Marketing pages (even on localhost) → NEVER allow dark mode
  const isMarketingPage =
    pathname === '/' ||
    pathname.startsWith('/features') ||
    pathname.startsWith('/pricing') ||
    pathname.startsWith('/about');

  // If on marketing domain OR marketing page → disable dark mode
  if (isMarketingDomain || isMarketingPage) {
    return false;
  }

  // App subdomain → ALWAYS allow dark mode (using same patterns as EnvironmentManager)
  const isAppDomain =
    hostname === 'app.oslira.com' ||
    hostname === 'staging-app.oslira.com' ||
    hostname === 'app.localhost' ||
    hostname.startsWith('oslira-app'); // Cloudflare Pages preview URLs

  if (isAppDomain) {
    return true;
  }

  // Showcase pages (for demo) → Allow dark mode
  const isShowcasePage = pathname.startsWith('/showcase');

  if (isShowcasePage) {
    return true;
  }

  // App pages (auth, dashboard, onboarding) → Allow dark mode
  const isAppPage =
    pathname.startsWith('/auth') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/leads');

  if (isAppPage) {
    return true;
  }

  // Default: disable dark mode for safety
  return false;
}

// PROVIDER
interface ThemeProviderProps {
  children: ReactNode;
  /** Default theme if no preference found */
  defaultTheme?: Theme;
  /** Enable system preference detection */
  enableSystem?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  enableSystem = true,
}: ThemeProviderProps) {
  
  // ===========================================================================
  // CHECK: Is dark mode allowed on current page?
  // ===========================================================================
  
  const [darkModeEnabled] = useState(isDarkModeAllowed);
  
  // ===========================================================================
  // STATE
  // ===========================================================================
  
  const [theme, setThemeState] = useState<Theme>(() => {
    // SSR-safe initialization
    if (typeof window === 'undefined') return defaultTheme;
    
    // If dark mode disabled, always return 'light'
    if (!darkModeEnabled) return 'light';
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme;
      return stored || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // ===========================================================================
  // HELPER: Get system preference
  // ===========================================================================
  
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  };

  // ===========================================================================
  // HELPER: Resolve theme (handles 'system')
  // ===========================================================================
  
  const resolveTheme = (theme: Theme): 'light' | 'dark' => {
    // CRITICAL: If dark mode disabled, always return 'light'
    if (!darkModeEnabled) return 'light';
    
    if (theme === 'system') {
      return enableSystem ? getSystemTheme() : 'light';
    }
    return theme;
  };

  // ===========================================================================
  // EFFECT: Apply theme to DOM
  // ===========================================================================
  
  useEffect(() => {
    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);
    
    const root = document.documentElement;
    
    // Remove existing theme class
    root.classList.remove(THEME_CLASS);
    
    // CRITICAL: Only add dark class if dark mode is enabled AND resolved to dark
    if (darkModeEnabled && resolved === 'dark') {
      root.classList.add(THEME_CLASS);
    }
    
    // Persist to localStorage (only if dark mode enabled)
    if (darkModeEnabled) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // Fail silently if localStorage is blocked
      }
    }
  }, [theme, enableSystem, darkModeEnabled]);

  // ===========================================================================
  // EFFECT: Listen to system preference changes
  // ===========================================================================
  
  useEffect(() => {
    // Don't listen if dark mode disabled
    if (!darkModeEnabled || !enableSystem || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const resolved = resolveTheme('system');
      setResolvedTheme(resolved);
      
      const root = document.documentElement;
      root.classList.remove(THEME_CLASS);
      if (resolved === 'dark') {
        root.classList.add(THEME_CLASS);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, enableSystem, darkModeEnabled]);

  // ===========================================================================
  // ACTIONS
  // ===========================================================================
  
  const setTheme = (newTheme: Theme) => {
    // Ignore if dark mode disabled
    if (!darkModeEnabled) {
      console.warn('[ThemeProvider] Dark mode disabled on this page. Theme change ignored.');
      return;
    }
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    // Ignore if dark mode disabled
    if (!darkModeEnabled) {
      console.warn('[ThemeProvider] Dark mode disabled on this page. Toggle ignored.');
      return;
    }
    
    // If currently system, toggle to opposite of resolved
    if (theme === 'system') {
      const resolved = resolveTheme('system');
      setThemeState(resolved === 'dark' ? 'light' : 'dark');
    } else {
      setThemeState(theme === 'dark' ? 'light' : 'dark');
    }
  };

  // ===========================================================================
  // CONTEXT VALUE
  // ===========================================================================
  
  const value: ThemeContextValue = {
    theme: darkModeEnabled ? theme : 'light',
    resolvedTheme: darkModeEnabled ? resolvedTheme : 'light',
    setTheme,
    toggleTheme,
    darkModeEnabled,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// HOOK: useTheme
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

export type { Theme, ThemeContextValue };
