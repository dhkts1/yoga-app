import { useEffect } from "react";
import usePreferencesStore from "../stores/preferences";

/**
 * Convert hex color to HSL
 * @param {string} hex - Hex color (e.g., '#282B2E')
 * @returns {object} - {h, s, l} values
 */
function hexToHSL(hex) {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Generate dark mode theme variables from a base color
 * @param {string} hexColor - Base hex color
 * @returns {object} - CSS variables for the theme
 */
function generateCustomTheme(hexColor) {
  const { h, s, l } = hexToHSL(hexColor);

  // Generate lighter variations for cards, borders, etc.
  return {
    "--background": `${h} ${Math.max(s - 2, 0)}% ${l}%`,
    "--card": `${h} ${Math.max(s - 2, 0)}% ${l + 6}%`,
    "--popover": `${h} ${Math.max(s - 2, 0)}% ${l + 6}%`,
    "--muted": `${h} ${Math.max(s - 3, 0)}% ${l + 10}%`,
    "--border": `${h} ${Math.max(s - 3, 0)}% ${l + 12}%`,
    "--input": `${h} ${Math.max(s - 3, 0)}% ${l + 12}%`,
    "--primary-foreground": `${h} ${Math.max(s - 2, 0)}% ${l}%`,
    "--secondary-foreground": `${h} ${Math.max(s - 2, 0)}% ${l}%`,
    "--accent-foreground": `${h} ${Math.max(s - 2, 0)}% ${l}%`,
  };
}

/**
 * Dark Mode Theme Definitions
 * Each theme includes all CSS variables for complete dark mode customization
 */
const DARK_MODE_THEMES = {
  slate: {
    name: "Soft Slate",
    description: "Cool charcoal with subtle blue tones",
    preview: "#282B2E",
    variables: {
      "--background": "220 8% 18%",
      "--card": "220 6% 24%",
      "--popover": "220 6% 24%",
      "--muted": "220 5% 28%",
      "--border": "220 5% 30%",
      "--input": "220 5% 30%",
      "--primary-foreground": "220 8% 18%",
      "--secondary-foreground": "220 8% 18%",
      "--accent-foreground": "220 8% 18%",
    },
  },
  taupe: {
    name: "Warm Taupe",
    description: "Cozy grayish-brown tones",
    preview: "#342F2D",
    variables: {
      "--background": "30 6% 20%",
      "--card": "30 5% 26%",
      "--popover": "30 5% 26%",
      "--muted": "30 4% 30%",
      "--border": "30 4% 32%",
      "--input": "30 4% 32%",
      "--primary-foreground": "30 6% 20%",
      "--secondary-foreground": "30 6% 20%",
      "--accent-foreground": "30 6% 20%",
    },
  },
  gray: {
    name: "Pure Gray",
    description: "Neutral graphite without color tint",
    preview: "#2E2E2E",
    variables: {
      "--background": "0 0% 18%",
      "--card": "0 0% 24%",
      "--popover": "0 0% 24%",
      "--muted": "0 0% 28%",
      "--border": "0 0% 30%",
      "--input": "0 0% 30%",
      "--primary-foreground": "0 0% 18%",
      "--secondary-foreground": "0 0% 18%",
      "--accent-foreground": "0 0% 18%",
    },
  },
  sage: {
    name: "Muted Sage",
    description: "Subtle sage green (brand color)",
    preview: "#2B332B",
    variables: {
      "--background": "142 6% 20%",
      "--card": "142 5% 26%",
      "--popover": "142 5% 26%",
      "--muted": "142 4% 30%",
      "--border": "142 4% 32%",
      "--input": "142 4% 32%",
      "--primary-foreground": "142 6% 20%",
      "--secondary-foreground": "142 6% 20%",
      "--accent-foreground": "142 6% 20%",
    },
  },
  custom: {
    name: "Custom",
    description: "Choose your own color",
    preview: null, // Will be set dynamically
    variables: {}, // Will be generated dynamically
  },
};

/**
 * ThemeProvider Component
 *
 * Manages dark mode by:
 * - Reading theme preference from store
 * - Applying/removing 'dark' class on <html> element
 * - Applying selected dark mode color theme
 * - Updating PWA meta theme-color
 * - Listening for theme changes
 */
export function ThemeProvider({ children }) {
  const theme = usePreferencesStore((state) => state.theme);
  const darkModeTheme = usePreferencesStore((state) => state.darkModeTheme);
  const customDarkColor = usePreferencesStore((state) => state.customDarkColor);

  useEffect(() => {
    const root = window.document.documentElement;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');

    // Remove both classes first
    root.classList.remove("light", "dark");

    // Handle system preference if theme is 'system' (future enhancement)
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);

      // Apply dark mode theme variables if in dark mode
      if (systemTheme === "dark") {
        applyDarkModeTheme(root, darkModeTheme, customDarkColor);
      }

      // Update PWA theme color
      if (metaThemeColor) {
        const themeColor =
          systemTheme === "dark"
            ? darkModeTheme === "custom"
              ? customDarkColor
              : DARK_MODE_THEMES[darkModeTheme]?.preview || "#282B2E"
            : "#8FA68E";
        metaThemeColor.setAttribute("content", themeColor);
      }
    } else {
      // Apply the selected theme
      root.classList.add(theme);

      // Apply dark mode theme variables if in dark mode
      if (theme === "dark") {
        applyDarkModeTheme(root, darkModeTheme, customDarkColor);
      }

      // Update PWA theme color
      if (metaThemeColor) {
        const themeColor =
          theme === "dark"
            ? darkModeTheme === "custom"
              ? customDarkColor
              : DARK_MODE_THEMES[darkModeTheme]?.preview || "#282B2E"
            : "#8FA68E";
        metaThemeColor.setAttribute("content", themeColor);
      }
    }
  }, [theme, darkModeTheme, customDarkColor]);

  return <>{children}</>;
}

/**
 * Apply dark mode theme CSS variables
 */
function applyDarkModeTheme(root, themeKey, customColor) {
  let theme = DARK_MODE_THEMES[themeKey];

  if (!theme) {
    console.warn(`Unknown dark mode theme: ${themeKey}`);
    return;
  }

  // For custom theme, generate variables dynamically
  let variables = theme.variables;
  if (themeKey === "custom" && customColor) {
    variables = generateCustomTheme(customColor);
  }

  // Apply all CSS variables for the selected theme
  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
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
    isDark: theme === "dark",
    isLight: theme === "light",
    isSystem: theme === "system",
  };
}

export default ThemeProvider;
export { DARK_MODE_THEMES };
