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
      className={`relative flex size-14 items-center justify-center rounded-full bg-muted transition-all duration-300 hover:bg-muted dark:bg-secondary dark:hover:bg-secondary ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
    >
      <div className="relative size-6">
        {/* Sun icon (visible in dark mode) */}
        <Sun
          className={`absolute inset-0 size-6 text-accent transition-all duration-300 ${
            isDark
              ? 'rotate-0 scale-100 opacity-100'
              : 'rotate-90 scale-0 opacity-0'
          }`}
        />
        {/* Moon icon (visible in light mode) */}
        <Moon
          className={`absolute inset-0 size-6 text-muted-foreground transition-all duration-300 dark:text-foreground ${
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
      className={`flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-muted dark:hover:bg-sage-800 ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
    >
      {isDark ? (
        <Sun className="size-5 text-accent" />
      ) : (
        <Moon className="size-5 text-muted-foreground" />
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
          className={`flex size-12 items-center justify-center rounded-lg transition-all ${
            theme === 'light'
              ? 'bg-primary text-primary-foreground shadow-sage'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
          aria-label="Light mode"
          aria-pressed={theme === 'light'}
        >
          <Sun className="size-5" />
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`flex size-12 items-center justify-center rounded-lg transition-all ${
            theme === 'dark'
              ? 'bg-primary text-primary-foreground shadow-sage'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
          aria-label="Dark mode"
          aria-pressed={theme === 'dark'}
        >
          <Moon className="size-5" />
        </button>
      </div>
    </div>
  );
}

export default ThemeToggle;
