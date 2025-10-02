/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
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
      // Complete color system for yoga app
      colors: {
        // Primary sage palette
        sage: {
          50: '#F7F8F7',
          100: '#E8ECE8',
          200: '#D1DAD0',
          300: '#B5C4B4',
          400: '#9BB29A',
          500: '#8FA68E',   // Primary sage
          600: '#758974',
          700: '#5C6E5B',
          800: '#3F4A3F',
          900: '#2A332A',
          DEFAULT: '#8FA68E'
        },

        // Warm cream palette
        cream: {
          50: '#FDFBF7',
          100: '#F5F3F0',   // Primary cream
          200: '#F0EDE9',
          300: '#E8E6E3',
          400: '#DDD9D5',
          500: '#D1CCC7',
          600: '#B8B2AD',
          700: '#9A9590',
          800: '#716B66',
          900: '#4A453F',
          DEFAULT: '#F5F3F0'
        },

        // Muted gold palette
        gold: {
          50: '#FDFBF5',
          100: '#F7F2E6',
          200: '#F0E5CC',
          300: '#E6D6B3',
          400: '#DCC799',
          500: '#D4AF37',   // Primary gold
          600: '#B89A2F',
          700: '#9C8427',
          800: '#806E1F',
          900: '#665917',
          DEFAULT: '#D4AF37'
        },

        // Semantic colors
        primary: '#8FA68E',         // Sage green
        secondary: '#5C6E5B',       // Darker sage for text (was cream #F5F3F0)
        accent: '#D4AF37',          // Muted gold

        // Additional text colors
        text: {
          primary: '#2C2C2C',       // Deep charcoal
          secondary: '#5C6E5B',     // Darker sage (was #6B6B6B - too light)
          muted: '#9CA3AF',         // Muted gray
          inverse: '#FFFFFF',       // White
          sage: '#758974',          // Sage text
          cream: '#5A5550',         // Warm dark
        },

        // Background colors
        background: {
          DEFAULT: '#F5F3F0',          // Main background (cream)
          secondary: '#F5F3F0',        // Secondary background
          sage: '#8FA68E',             // Sage background
          cream: '#F5F3F0',            // Cream background
          overlay: 'rgba(245, 243, 240, 0.95)', // Modal overlay
          glass: 'rgba(255, 255, 255, 0.8)'     // Glass effect
        },

        // Border colors
        border: {
          DEFAULT: '#E5E7EB',         // Default border
          light: '#E5E7EB',           // Light border
          medium: '#D1D5DB',          // Medium border
          sage: '#B5C4B4',            // Sage border
          focus: '#8FA68E'            // Focus border
        },

        // State colors
        state: {
          success: '#10B981',         // Success green
          warning: '#F59E0B',         // Warning amber
          error: '#E8B4B8',           // Soft error pink
          info: '#3B82F6'             // Info blue
        },

        // Interactive colors
        interactive: {
          primary: '#8FA68E',
          'primary-hover': '#758974',
          'primary-active': '#5C6E5B',
          secondary: 'transparent',
          'secondary-hover': '#F7F8F7',
          'secondary-active': '#E8ECE8'
        },

        // Keep shadcn/ui compatibility
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
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      // Complete typography system
      fontSize: {
        'xs': ['14px', { lineHeight: '20px', letterSpacing: '0.025em' }],
        'sm': ['16px', { lineHeight: '24px', letterSpacing: '0.025em' }],
        'base': ['18px', { lineHeight: '28px', letterSpacing: '0.025em' }],
        'lg': ['20px', { lineHeight: '32px', letterSpacing: '0.025em' }],
        'xl': ['24px', { lineHeight: '36px', letterSpacing: '0.025em' }],
        '2xl': ['32px', { lineHeight: '44px', letterSpacing: '0.025em' }],
        '3xl': ['48px', { lineHeight: '56px', letterSpacing: '0.025em' }],
        '4xl': ['64px', { lineHeight: '72px', letterSpacing: '0.025em' }],
      },

      // Enhanced spacing system
      spacing: {
        // Base spacing (8px grid)
        0: '0px',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px',
        32: '128px',
        40: '160px',
        48: '192px',
        56: '224px',
        64: '256px',

        // Semantic spacing
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',

        // Touch targets
        'touch': '44px',
        'touch-lg': '56px',

        // Safe areas
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },

      // Enhanced border radius
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',       // Button radius
        'xl': '16px',       // Card radius
        '2xl': '20px',      // Overlay radius
        '3xl': '24px',
        'full': '9999px',
      },

      // Complete font family
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'monospace']
      },

      // Enhanced shadows
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'sage': '0 1px 3px 0 rgba(143, 166, 142, 0.2), 0 1px 2px 0 rgba(143, 166, 142, 0.12)',
        'sage-lg': '0 10px 15px -3px rgba(143, 166, 142, 0.2), 0 4px 6px -2px rgba(143, 166, 142, 0.1)',
        'glow-sage': '0 0 0 4px rgba(143, 166, 142, 0.1)',
        'glow-sage-strong': '0 0 0 4px rgba(143, 166, 142, 0.2)',
      },

      // Comprehensive animations
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
        "breathe": {
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
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(143, 166, 142, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(143, 166, 142, 0.1)" },
        },
        "bounce-scale": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },

      animation: {
        // Existing animations
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",

        // Yoga animations
        "breathe": "breathe 4s cubic-bezier(0.4, 0.0, 0.2, 1) infinite",
        "fade-in": "fade-in 300ms cubic-bezier(0.4, 0.0, 0.2, 1)",
        "slide-up": "slide-up 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "slide-down": "slide-down 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "scale-in": "scale-in 300ms cubic-bezier(0.23, 1, 0.32, 1)",
        "pulse-gentle": "pulse-gentle 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        "bounce-scale": "bounce-scale 300ms cubic-bezier(0.4, 0.0, 0.2, 1)",
        "shimmer": "shimmer 2s linear infinite",
      },

      // Transition durations and easings
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
        '4000': '4000ms',
      },

      transitionTimingFunction: {
        'breathe': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        'gentle': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'calm': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },

      // Responsive breakpoints (mobile-first)
      screens: {
        'xs': '320px',
        'sm': '480px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },

      // Mobile-safe utilities
      maxWidth: {
        'none': 'none',
        '0': '0rem',
        'xs': '20rem',
        'sm': '24rem',
        'md': '28rem',
        'lg': '32rem',
        'xl': '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '80rem',
        'full': '100%',
        'min': 'min-content',
        'max': 'max-content',
        'fit': 'fit-content',
        'prose': '65ch',
        'screen-xs': '320px',
        'screen-sm': '480px',
        'screen-md': '768px',
        'screen-lg': '1024px',
        'screen-xl': '1280px',
        'screen-2xl': '1536px',
        // Safe viewport widths to prevent overflow
        'safe': 'calc(100vw - 2rem)', // Full width minus default padding
        'safe-sm': 'calc(100vw - 1rem)', // Smaller safe width
      },

      // Responsive width utilities
      width: {
        'full': '100%',
        'screen': '100vw',
        'min': 'min-content',
        'max': 'max-content',
        'fit': 'fit-content',
        // Safe widths that prevent horizontal overflow
        'safe': 'calc(100vw - 2rem)',
        'safe-sm': 'calc(100vw - 1rem)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}