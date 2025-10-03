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
function generateCustomDarkTheme(hexColor) {
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
 * Generate light mode theme variables from a base color
 * @param {string} hexColor - Base hex color
 * @returns {object} - CSS variables for the theme
 */
function generateCustomLightTheme(hexColor) {
  const { h, s, l } = hexToHSL(hexColor);

  // Generate darker variations for text, lighter for backgrounds
  return {
    "--background": `${h} ${Math.max(s - 10, 0)}% ${Math.min(l + 30, 96)}%`,
    "--card": `${h} ${Math.max(s - 5, 0)}% ${Math.min(l + 35, 100)}%`,
    "--popover": `${h} ${Math.max(s - 5, 0)}% ${Math.min(l + 35, 100)}%`,
    "--muted": `${h} ${Math.max(s - 15, 0)}% ${Math.min(l + 25, 96)}%`,
    "--border": `${h} ${Math.max(s - 18, 0)}% ${Math.min(l + 20, 91)}%`,
    "--input": `${h} ${Math.max(s - 18, 0)}% ${Math.min(l + 20, 91)}%`,
    "--primary": `${h} ${Math.min(s + 5, 35)}% ${Math.max(l - 15, 32)}%`,
    "--primary-foreground": `0 0% 100%`,
    "--secondary": `${h} ${Math.min(s + 5, 35)}% ${Math.max(l - 20, 30)}%`,
    "--secondary-foreground": `0 0% 100%`,
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
 * Light Mode Theme Definitions
 * Each theme includes all CSS variables for complete light mode customization
 */
const LIGHT_MODE_THEMES = {
  cream: {
    name: "Warm Cream",
    description: "Soft cream with sage accents (default)",
    preview: "#F5F3F0",
    variables: {
      "--background": "30 25% 94%",
      "--card": "30 15% 98%",
      "--popover": "30 15% 98%",
      "--muted": "30 20% 90%",
      "--border": "30 18% 85%",
      "--input": "30 18% 85%",
      "--primary": "150 35% 32%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "142 35% 30%",
      "--secondary-foreground": "0 0% 100%",
    },
  },
  white: {
    name: "Pure White",
    description: "Clean white with subtle sage",
    preview: "#FFFFFF",
    variables: {
      "--background": "0 0% 100%",
      "--card": "0 0% 99%",
      "--popover": "0 0% 99%",
      "--muted": "0 0% 96%",
      "--border": "0 0% 90%",
      "--input": "0 0% 90%",
      "--primary": "150 35% 32%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "142 35% 30%",
      "--secondary-foreground": "0 0% 100%",
    },
  },
  sage: {
    name: "Sage Tint",
    description: "Light sage green background",
    preview: "#E8F5E8",
    variables: {
      "--background": "150 35% 92%",
      "--card": "150 25% 97%",
      "--popover": "150 25% 97%",
      "--muted": "150 30% 88%",
      "--border": "150 25% 82%",
      "--input": "150 25% 82%",
      "--primary": "150 45% 28%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "142 40% 26%",
      "--secondary-foreground": "0 0% 100%",
    },
  },
  sand: {
    name: "Desert Sand",
    description: "Warm sandy beige tones",
    preview: "#F5E6D3",
    variables: {
      "--background": "35 40% 90%",
      "--card": "35 30% 96%",
      "--popover": "35 30% 96%",
      "--muted": "35 35% 86%",
      "--border": "35 30% 80%",
      "--input": "35 30% 80%",
      "--primary": "150 35% 32%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "142 35% 30%",
      "--secondary-foreground": "0 0% 100%",
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
 * Manages light/dark modes by:
 * - Reading theme preference from store
 * - Applying/removing 'dark' class on <html> element
 * - Applying selected light/dark mode color theme
 * - Updating PWA meta theme-color
 * - Listening for theme changes
 * - Resetting theme variables when switching modes
 */
export function ThemeProvider({ children }) {
  const theme = usePreferencesStore((state) => state.theme);
  const darkModeTheme = usePreferencesStore((state) => state.darkModeTheme);
  const customDarkColor = usePreferencesStore((state) => state.customDarkColor);
  const lightModeTheme = usePreferencesStore((state) => state.lightModeTheme);
  const customLightColor = usePreferencesStore(
    (state) => state.customLightColor,
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');

    // Remove both classes first
    root.classList.remove("light", "dark");

    // Reset all theme variables to ensure clean switch
    resetThemeVariables(root);

    // Handle system preference if theme is 'system' (future enhancement)
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);

      // Apply theme variables based on system preference
      if (systemTheme === "dark") {
        applyDarkModeTheme(root, darkModeTheme, customDarkColor);
      } else {
        applyLightModeTheme(root, lightModeTheme, customLightColor);
      }

      // Update PWA theme color
      if (metaThemeColor) {
        const themeColor =
          systemTheme === "dark"
            ? darkModeTheme === "custom"
              ? customDarkColor
              : DARK_MODE_THEMES[darkModeTheme]?.preview || "#282B2E"
            : lightModeTheme === "custom"
              ? customLightColor
              : LIGHT_MODE_THEMES[lightModeTheme]?.preview || "#F5F3F0";
        metaThemeColor.setAttribute("content", themeColor);
      }
    } else {
      // Apply the selected theme
      root.classList.add(theme);

      // Apply theme variables based on selected mode
      if (theme === "dark") {
        applyDarkModeTheme(root, darkModeTheme, customDarkColor);
      } else if (theme === "light") {
        applyLightModeTheme(root, lightModeTheme, customLightColor);
      }

      // Update PWA theme color
      if (metaThemeColor) {
        const themeColor =
          theme === "dark"
            ? darkModeTheme === "custom"
              ? customDarkColor
              : DARK_MODE_THEMES[darkModeTheme]?.preview || "#282B2E"
            : lightModeTheme === "custom"
              ? customLightColor
              : LIGHT_MODE_THEMES[lightModeTheme]?.preview || "#F5F3F0";
        metaThemeColor.setAttribute("content", themeColor);
      }
    }
  }, [theme, darkModeTheme, customDarkColor, lightModeTheme, customLightColor]);

  return <>{children}</>;
}

/**
 * Reset all theme variables to clear previous theme
 */
function resetThemeVariables(root) {
  const allThemeVariables = [
    "--background",
    "--card",
    "--popover",
    "--muted",
    "--border",
    "--input",
    "--primary",
    "--primary-foreground",
    "--secondary",
    "--secondary-foreground",
    "--accent-foreground",
  ];

  allThemeVariables.forEach((property) => {
    root.style.removeProperty(property);
  });
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
    variables = generateCustomDarkTheme(customColor);
  }

  // Apply all CSS variables for the selected theme
  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

/**
 * Apply light mode theme CSS variables
 */
function applyLightModeTheme(root, themeKey, customColor) {
  let theme = LIGHT_MODE_THEMES[themeKey];

  if (!theme) {
    console.warn(`Unknown light mode theme: ${themeKey}`);
    return;
  }

  // For custom theme, generate variables dynamically
  let variables = theme.variables;
  if (themeKey === "custom" && customColor) {
    variables = generateCustomLightTheme(customColor);
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
export { DARK_MODE_THEMES, LIGHT_MODE_THEMES };
