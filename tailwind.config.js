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
      // Complete color system for yoga app using CSS variables
      colors: {
        // Use CSS variables for theme-aware colors
        background: "hsl(var(--background))",

        // Primary sage palette - CSS variables
        sage: {
          50: "hsl(var(--sage-50))",
          100: "hsl(var(--sage-100))",
          200: "hsl(var(--sage-200))",
          300: "hsl(var(--sage-300))",
          400: "hsl(var(--sage-400))",
          500: "hsl(var(--sage-500))",
          600: "hsl(var(--sage-600))",
          700: "hsl(var(--sage-700))",
          800: "hsl(var(--sage-800))",
          900: "hsl(var(--sage-900))",
          DEFAULT: "hsl(var(--sage-500))",
        },

        // Warm cream palette - CSS variables
        cream: {
          50: "hsl(var(--cream-50))",
          100: "hsl(var(--cream-100))",
          200: "hsl(var(--cream-200))",
          300: "hsl(var(--cream-300))",
          400: "hsl(var(--cream-400))",
          500: "hsl(var(--cream-500))",
          600: "hsl(var(--cream-600))",
          700: "hsl(var(--cream-700))",
          800: "hsl(var(--cream-800))",
          900: "hsl(var(--cream-900))",
          DEFAULT: "hsl(var(--cream-100))",
        },

        // Muted gold palette - CSS variables
        gold: {
          50: "hsl(var(--gold-50))",
          100: "hsl(var(--gold-100))",
          200: "hsl(var(--gold-200))",
          300: "hsl(var(--gold-300))",
          400: "hsl(var(--gold-400))",
          500: "hsl(var(--gold-500))",
          600: "hsl(var(--gold-600))",
          700: "hsl(var(--gold-700))",
          800: "hsl(var(--gold-800))",
          900: "hsl(var(--gold-900))",
          DEFAULT: "hsl(var(--gold-500))",
        },

        // Semantic color tokens using CSS variables
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
        },
        border: "hsl(var(--border))",

        // State colors for badges and indicators
        "state-success": "hsl(var(--state-success))",
        "state-warning": "hsl(var(--state-warning))",
        "state-error": "hsl(var(--state-error))",
        "state-info": "hsl(var(--state-info))",

        // Earthy accent palette (classic yoga)
        aurora: {
          teal: "hsl(var(--aurora-teal))", // Sage green
          violet: "hsl(var(--aurora-violet))", // Warm gold
          coral: "hsl(var(--aurora-coral))", // Terracotta
          cyan: "hsl(var(--aurora-cyan))", // Forest green
          DEFAULT: "hsl(var(--aurora-teal))", // Default to sage
        },

        // Energy state colors
        energy: "hsl(var(--energy))",
        power: "hsl(var(--power))",
        calm: "hsl(var(--calm))",

        // shadcn/ui compatibility
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
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

      // Complete font family
      fontFamily: {
        sans: ["General Sans", "Inter", "-apple-system", "sans-serif"],
        display: ["Clash Display", "General Sans", "sans-serif"],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },

      // Enhanced shadows - Linear-futuristic glow system
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",

        // Classic earthy glow shadows (sage green accent)
        "glow-sm": "0 0 10px -2px hsl(142 40% 40% / 0.3)",
        "glow-md": "0 0 20px -4px hsl(142 40% 40% / 0.4)",
        "glow-lg": "0 0 30px -6px hsl(142 40% 40% / 0.5)",
        "glow-xl": "0 0 50px -10px hsl(142 40% 40% / 0.6)",

        // State glow variants - earthy tones
        "glow-success": "0 0 20px -4px hsl(142 45% 42% / 0.5)",
        "glow-warning": "0 0 20px -4px hsl(38 80% 50% / 0.5)",
        "glow-error": "0 0 20px -4px hsl(12 70% 50% / 0.5)",
        "glow-info": "0 0 20px -4px hsl(200 35% 50% / 0.5)",

        // Interactive glow ring - sage green
        "ring-glow":
          "0 0 0 4px hsl(142 40% 40% / 0.15), 0 0 20px -4px hsl(142 40% 40% / 0.3)",
        "ring-glow-strong":
          "0 0 0 4px hsl(142 40% 40% / 0.25), 0 0 30px -6px hsl(142 40% 40% / 0.5)",

        // Elevated cards with subtle warm glow
        "card-glow":
          "0 4px 20px -4px rgba(0, 0, 0, 0.1), 0 0 15px -5px hsl(142 40% 40% / 0.1)",
        "card-glow-hover":
          "0 8px 30px -6px rgba(0, 0, 0, 0.15), 0 0 25px -8px hsl(142 40% 40% / 0.2)",

        // Glass morphism shadow
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.12)",
        "glass-strong":
          "0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
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

      // Comprehensive animations - Linear-futuristic
      keyframes: {
        // Existing animations
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },

        // Yoga-specific animations
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-gentle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "bounce-scale": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },

        // ═══ CLASSIC YOGA ANIMATIONS ═══

        // Glow pulse - sage green accent
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 hsl(142 40% 40% / 0.4)",
          },
          "50%": {
            boxShadow: "0 0 20px 4px hsl(142 40% 40% / 0.2)",
          },
        },

        // Subtle glow for badges/status
        "neon-pulse": {
          "0%, 100%": {
            boxShadow:
              "0 0 5px hsl(142 40% 40% / 0.5), 0 0 10px hsl(142 40% 40% / 0.3)",
          },
          "50%": {
            boxShadow:
              "0 0 10px hsl(142 40% 40% / 0.7), 0 0 20px hsl(142 40% 40% / 0.4)",
          },
        },

        // Gradient border animation
        "gradient-border": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },

        // Subtle float with glow
        "float-glow": {
          "0%, 100%": {
            transform: "translateY(0px)",
            filter: "drop-shadow(0 0 10px hsl(142 40% 40% / 0.2))",
          },
          "50%": {
            transform: "translateY(-8px)",
            filter: "drop-shadow(0 0 20px hsl(142 40% 40% / 0.4))",
          },
        },

        // Status dot pulse (Linear-style)
        "dot-pulse": {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "50%": {
            transform: "scale(1.5)",
            opacity: "0.5",
          },
        },

        // Scan line effect
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },

        // Counter roll animation
        "counter-roll": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },

        // Ripple effect
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.6" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },

        // Skeleton shimmer
        "skeleton-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },

        // Entrance from blur
        "blur-in": {
          "0%": { opacity: "0", filter: "blur(10px)" },
          "100%": { opacity: "1", filter: "blur(0)" },
        },

        // ═══ CLASSIC YOGA BREATH ANIMATIONS ═══
        "aurora-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.8" },
        },
        "glow-breathe": {
          "0%, 100%": {
            boxShadow: "0 0 20px -5px hsl(142 40% 40% / 0.4)",
          },
          "50%": {
            boxShadow: "0 0 30px -5px hsl(142 40% 40% / 0.6)",
          },
        },
        "streak-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
      },

      animation: {
        // Existing animations
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",

        // Yoga animations
        breathe: "breathe 4s cubic-bezier(0.4, 0.0, 0.2, 1) infinite",
        "fade-in": "fade-in 300ms cubic-bezier(0.4, 0.0, 0.2, 1)",
        "slide-up": "slide-up 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "slide-down": "slide-down 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "scale-in": "scale-in 300ms cubic-bezier(0.23, 1, 0.32, 1)",
        "pulse-gentle": "pulse-gentle 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "bounce-scale": "bounce-scale 300ms cubic-bezier(0.4, 0.0, 0.2, 1)",
        shimmer: "shimmer 2s linear infinite",

        // ═══ CLASSIC YOGA ANIMATIONS ═══
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
        "gradient-border": "gradient-border 3s ease infinite",
        "float-glow": "float-glow 3s ease-in-out infinite",
        "dot-pulse": "dot-pulse 2s ease-in-out infinite",
        "scan-line": "scan-line 3s linear infinite",
        "counter-roll": "counter-roll 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        ripple: "ripple 0.6s ease-out",
        "skeleton-shimmer": "skeleton-shimmer 1.5s ease-in-out infinite",
        "blur-in": "blur-in 0.4s cubic-bezier(0.4, 0, 0.2, 1)",

        // ═══ CLASSIC YOGA BREATH ANIMATIONS ═══
        "aurora-pulse": "aurora-pulse 4s ease-in-out infinite",
        "glow-breathe": "glow-breathe 3s ease-in-out infinite",
        "streak-pulse": "streak-pulse 2s ease-in-out infinite",
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
