// src/core/theme/ThemeProvider.tsx

/**
 * THEME PROVIDER - PRODUCTION GRADE V1.0
 * 
 * ARCHITECTURE:
 * ✅ Single source of truth for theme state
 * ✅ Automatic localStorage persistence
 * ✅ System preference detection (prefers-color-scheme)
 * ✅ SSR-safe initialization
 * ✅ Global theme context accessible anywhere
 * ✅ Bulletproof synchronization with document.documentElement
 * 
 * PHILOSOPHY:
 * "One Provider to rule them all"
 * - Define once at app root
 * - Access anywhere with useTheme()
 * - Zero duplication
 * - Enterprise pattern (Shadcn, Vercel, Linear)
 * 
 * USAGE:
 * 
 * // In App.tsx or main.tsx:
 * <ThemeProvider>
 *   <YourApp />
 * </ThemeProvider>
 * 
 * // In any component:
 * const { theme, setTheme, toggleTheme } = useTheme();
 * <button onClick={toggleTheme}>Toggle</button>
 */

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  ReactNode 
} from 'react';

// =============================================================================
// TYPES
// =============================================================================

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
}

// =============================================================================
// CONSTANTS
// =============================================================================

const STORAGE_KEY = 'oslira-theme';
const THEME_CLASS = 'dark';

// =============================================================================
// CONTEXT
// =============================================================================

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// =============================================================================
// PROVIDER
// =============================================================================

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
  // STATE
  // ===========================================================================
  
  const [theme, setThemeState] = useState<Theme>(() => {
    // SSR-safe initialization
    if (typeof window === 'undefined') return defaultTheme;
    
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
    
    // Add dark class if dark mode
    if (resolved === 'dark') {
      root.classList.add(THEME_CLASS);
    }
    
    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Fail silently if localStorage is blocked
    }
  }, [theme, enableSystem]);

  // ===========================================================================
  // EFFECT: Listen to system preference changes
  // ===========================================================================
  
  useEffect(() => {
    if (!enableSystem || theme !== 'system') return;

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
  }, [theme, enableSystem]);

  // ===========================================================================
  // ACTIONS
  // ===========================================================================
  
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
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
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// =============================================================================
// HOOK: useTheme
// =============================================================================

export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

// =============================================================================
// EXPORT TYPES
// =============================================================================

export type { Theme, ThemeContextValue };
