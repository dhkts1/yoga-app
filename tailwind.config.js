/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Linear/Notion-inspired color system using CSS variables
      colors: {
        // Core backgrounds
        background: "hsl(var(--background))",
        surface: "hsl(var(--surface))",
        "surface-elevated": "hsl(var(--surface-elevated))",

        // Semantic color tokens
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          secondary: "hsl(var(--accent-secondary))",
        },
        border: "hsl(var(--border))",
        "border-strong": "hsl(var(--border-strong))",

        // State colors - Linear-inspired
        "state-success": "hsl(var(--state-success))",
        "state-warning": "hsl(var(--state-warning))",
        "state-error": "hsl(var(--state-error))",
        "state-info": "hsl(var(--state-info))",

        // shadcn/ui compatibility
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        "foreground-muted": "hsl(var(--foreground-muted))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--foreground))",
        },

        // Chart colors - Linear-inspired
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },

      // Complete typography system
      fontSize: {
        xs: ["14px", { lineHeight: "20px", letterSpacing: "0.025em" }],
        sm: ["16px", { lineHeight: "24px", letterSpacing: "0.025em" }],
        base: ["18px", { lineHeight: "28px", letterSpacing: "0.025em" }],
        lg: ["20px", { lineHeight: "32px", letterSpacing: "0.025em" }],
        xl: ["24px", { lineHeight: "36px", letterSpacing: "0.025em" }],
        "2xl": ["32px", { lineHeight: "44px", letterSpacing: "0.025em" }],
        "3xl": ["48px", { lineHeight: "56px", letterSpacing: "0.025em" }],
        "4xl": ["64px", { lineHeight: "72px", letterSpacing: "0.025em" }],
      },

      // Enhanced spacing system
      spacing: {
        // Base spacing (8px grid)
        0: "0px",
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
        16: "64px",
        20: "80px",
        24: "96px",
        32: "128px",
        40: "160px",
        48: "192px",
        56: "224px",
        64: "256px",

        // Semantic spacing
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
        "4xl": "96px",

        // Touch targets
        touch: "44px",
        "touch-lg": "56px",

        // Safe areas
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },

      // Enhanced border radius
      borderRadius: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px", // Button radius
        xl: "16px", // Card radius
        "2xl": "20px", // Overlay radius
        "3xl": "24px",
        full: "9999px",
      },

      // Linear-inspired font family
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
        mono: [
          "IBM Plex Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },

      // Linear-style shadows - flat with accent glows
      boxShadow: {
        none: "none",
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
        sm: "0 1px 3px 0 rgba(0, 0, 0, 0.4)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.4)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)",

        // Accent glow shadows (electric cyan)
        "glow-sm": "0 0 10px -2px hsl(var(--accent) / 0.3)",
        "glow-md": "0 0 20px -4px hsl(var(--accent) / 0.4)",
        "glow-lg": "0 0 30px -6px hsl(var(--accent) / 0.5)",
        "glow-xl": "0 0 50px -10px hsl(var(--accent) / 0.6)",

        // State glow variants
        "glow-success": "0 0 20px -4px hsl(var(--state-success) / 0.5)",
        "glow-warning": "0 0 20px -4px hsl(var(--state-warning) / 0.5)",
        "glow-error": "0 0 20px -4px hsl(var(--state-error) / 0.5)",
        "glow-info": "0 0 20px -4px hsl(var(--state-info) / 0.5)",

        // Interactive glow ring - accent
        "ring-glow":
          "0 0 0 2px hsl(var(--accent) / 0.15), 0 0 15px -4px hsl(var(--accent) / 0.3)",
        "ring-glow-strong":
          "0 0 0 2px hsl(var(--accent) / 0.25), 0 0 20px -6px hsl(var(--accent) / 0.5)",

        // Card shadows - subtle for Linear look
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 4px 12px -2px rgba(0, 0, 0, 0.4)",

        // Glass morphism shadow
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
        "glass-strong":
          "0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.03)",
      },

      // Backdrop blur levels for glass effects
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "40px",
        "3xl": "64px",
      },

      // Linear-style animations - subtle and clean
      keyframes: {
        // Accordion
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },

        // Core transitions
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(4px)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },

        // Linear-style status indicators
        "dot-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.2)", opacity: "0.7" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(var(--accent) / 0.4)" },
          "50%": { boxShadow: "0 0 12px 2px hsl(var(--accent) / 0.2)" },
        },

        // Sparkline draw animation
        "sparkline-draw": {
          "0%": { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "0" },
        },

        // Counter roll for stats
        "counter-roll": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },

        // Shimmer for loading
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },

        // Pulse for breathing exercises
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.9" },
          "50%": { transform: "scale(1.03)", opacity: "1" },
        },

        // Subtle float
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },

      animation: {
        // Accordion
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",

        // Core transitions (faster for Linear feel)
        "fade-in": "fade-in 150ms ease-out",
        "fade-out": "fade-out 150ms ease-out",
        "slide-up": "slide-up 200ms ease-out",
        "slide-down": "slide-down 200ms ease-out",
        "scale-in": "scale-in 150ms ease-out",

        // Status indicators
        "dot-pulse": "dot-pulse 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",

        // Sparkline
        "sparkline-draw": "sparkline-draw 1s ease-out forwards",

        // Counter
        "counter-roll": "counter-roll 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",

        // Loading
        shimmer: "shimmer 1.5s ease-in-out infinite",

        // Breathing
        breathe: "breathe 4s ease-in-out infinite",

        // Float
        float: "float 3s ease-in-out infinite",
      },

      // Transition durations and easings
      transitionDuration: {
        0: "0ms",
        75: "75ms",
        100: "100ms",
        150: "150ms",
        200: "200ms",
        300: "300ms",
        500: "500ms",
        700: "700ms",
        1000: "1000ms",
        4000: "4000ms",
      },

      transitionTimingFunction: {
        breathe: "cubic-bezier(0.4, 0.0, 0.2, 1)",
        gentle: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        calm: "cubic-bezier(0.23, 1, 0.32, 1)",
        spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },

      // Responsive breakpoints (mobile-first)
      screens: {
        xs: "320px",
        sm: "480px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },

      // Mobile-safe utilities
      maxWidth: {
        none: "none",
        0: "0rem",
        xs: "20rem",
        sm: "24rem",
        md: "28rem",
        lg: "32rem",
        xl: "36rem",
        "2xl": "42rem",
        "3xl": "48rem",
        "4xl": "56rem",
        "5xl": "64rem",
        "6xl": "72rem",
        "7xl": "80rem",
        full: "100%",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        prose: "65ch",
        "screen-xs": "320px",
        "screen-sm": "480px",
        "screen-md": "768px",
        "screen-lg": "1024px",
        "screen-xl": "1280px",
        "screen-2xl": "1536px",
        // Safe viewport widths to prevent overflow
        safe: "calc(100vw - 2rem)", // Full width minus default padding
        "safe-sm": "calc(100vw - 1rem)", // Smaller safe width
      },

      // Responsive width utilities
      width: {
        full: "100%",
        screen: "100vw",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        // Safe widths that prevent horizontal overflow
        safe: "calc(100vw - 2rem)",
        "safe-sm": "calc(100vw - 1rem)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
