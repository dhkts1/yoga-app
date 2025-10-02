import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

/**
 * ThemeToggle Component
 *
 * Beautiful toggle button to switch between light and dark themes.
 * Features:
 * - Sun/Moon icon animation
 * - Mobile-optimized (44px touch target)
 * - Smooth transitions
 * - Accessible with ARIA labels
 */
export function ThemeToggle({ className = '' }) {
  const { setTheme, isDark } = useTheme();

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center justify-center w-14 h-14 rounded-full bg-muted dark:bg-secondary hover:bg-muted dark:hover:bg-secondary transition-all duration-300 ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
    >
      <div className="relative w-6 h-6">
        {/* Sun icon (visible in dark mode) */}
        <Sun
          className={`absolute inset-0 w-6 h-6 text-accent transition-all duration-300 ${
            isDark
              ? 'rotate-0 scale-100 opacity-100'
              : 'rotate-90 scale-0 opacity-0'
          }`}
        />
        {/* Moon icon (visible in light mode) */}
        <Moon
          className={`absolute inset-0 w-6 h-6 text-muted-foreground dark:text-card-foreground transition-all duration-300 ${
            isDark
              ? '-rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100'
          }`}
        />
      </div>
    </button>
  );
}

/**
 * Compact ThemeToggle for headers/navbars
 */
export function ThemeToggleCompact({ className = '' }) {
  const { setTheme, isDark } = useTheme();

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted dark:hover:bg-sage-800 transition-colors ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-accent" />
      ) : (
        <Moon className="w-5 h-5 text-muted-foreground" />
      )}
    </button>
  );
}

/**
 * ThemeToggle with label (for Settings)
 */
export function ThemeToggleWithLabel() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <h3 className="text-base font-medium text-foreground">
          Appearance
        </h3>
        <p className="text-sm text-muted-foreground">
          Choose your preferred theme
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setTheme('light')}
          className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all ${
            theme === 'light'
              ? 'bg-primary text-white shadow-sage'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
          aria-label="Light mode"
          aria-pressed={theme === 'light'}
        >
          <Sun className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all ${
            theme === 'dark'
              ? 'bg-primary text-white shadow-sage'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
          aria-label="Dark mode"
          aria-pressed={theme === 'dark'}
        >
          <Moon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default ThemeToggle;
