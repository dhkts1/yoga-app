import { useEffect } from 'react';
import usePreferencesStore from '../stores/preferences';

/**
 * ThemeProvider Component
 *
 * Manages dark mode by:
 * - Reading theme preference from store
 * - Applying/removing 'dark' class on <html> element
 * - Updating PWA meta theme-color
 * - Listening for theme changes
 */
export function ThemeProvider({ children }) {
  const theme = usePreferencesStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');

    // Remove both classes first
    root.classList.remove('light', 'dark');

    // Handle system preference if theme is 'system' (future enhancement)
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);

      // Update PWA theme color
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          'content',
          systemTheme === 'dark' ? '#1A2E1A' : '#8FA68E'
        );
      }
    } else {
      // Apply the selected theme
      root.classList.add(theme);

      // Update PWA theme color
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          'content',
          theme === 'dark' ? '#1A2E1A' : '#8FA68E'
        );
      }
    }
  }, [theme]);

  return <>{children}</>;
}

/**
 * Hook to get current theme and theme setter
 */
export function useTheme() {
  const theme = usePreferencesStore((state) => state.theme);
  const setTheme = usePreferencesStore((state) => state.setTheme);

  return {
    theme,
    setTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isSystem: theme === 'system'
  };
}

export default ThemeProvider;
