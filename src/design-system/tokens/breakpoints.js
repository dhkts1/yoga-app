/**
 * Design Tokens: Breakpoints
 *
 * Mobile-first responsive design breakpoints optimized for yoga practice.
 * Designed for comfortable viewing during different practice scenarios.
 */

export const breakpoints = {
  // Pixel values for media queries
  values: {
    xs: 320,    // Small mobile phones (minimum support)
    sm: 480,    // Large mobile phones
    md: 768,    // Tablets
    lg: 1024,   // Small laptops
    xl: 1280,   // Large laptops
    '2xl': 1536 // Desktop monitors
  },

  // CSS media query strings
  media: {
    xs: '(min-width: 320px)',
    sm: '(min-width: 480px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)'
  },

  // Max-width media queries (for mobile-first with max constraints)
  maxMedia: {
    xs: '(max-width: 479px)',
    sm: '(max-width: 767px)',
    md: '(max-width: 1023px)',
    lg: '(max-width: 1279px)',
    xl: '(max-width: 1535px)'
  },

  // Range queries (between breakpoints)
  between: {
    'xs-sm': '(min-width: 320px) and (max-width: 479px)',
    'sm-md': '(min-width: 480px) and (max-width: 767px)',
    'md-lg': '(min-width: 768px) and (max-width: 1023px)',
    'lg-xl': '(min-width: 1024px) and (max-width: 1279px)',
    'xl-2xl': '(min-width: 1280px) and (max-width: 1535px)'
  },

  // Container max-widths for each breakpoint
  containers: {
    xs: '100%',
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // Yoga-specific breakpoints and considerations
  yoga: {
    // Practice contexts
    phone: {
      breakpoint: 'xs',
      description: 'Mobile phone held at arm\'s length',
      minFontSize: '18px',
      touchTarget: '44px',
      margin: '16px'
    },

    tablet: {
      breakpoint: 'md',
      description: 'Tablet propped up during floor practice',
      minFontSize: '20px',
      touchTarget: '48px',
      margin: '24px'
    },

    laptop: {
      breakpoint: 'lg',
      description: 'Laptop for longer sessions or browsing',
      minFontSize: '18px',
      touchTarget: '40px',
      margin: '32px'
    },

    // Orientation considerations
    landscape: '(orientation: landscape)',
    portrait: '(orientation: portrait)',

    // High-density displays
    retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',

    // Accessibility preferences
    reducedMotion: '(prefers-reduced-motion: reduce)',
    darkMode: '(prefers-color-scheme: dark)',
    highContrast: '(prefers-contrast: high)'
  },

  // Component-specific responsive rules
  components: {
    // Navigation adapts to screen size
    navigation: {
      mobile: 'bottom tab bar',
      tablet: 'side navigation',
      desktop: 'top navigation'
    },

    // Timer scales with screen
    timer: {
      mobile: '180px diameter',
      tablet: '240px diameter',
      desktop: '200px diameter'
    },

    // Card layouts
    cards: {
      mobile: '1 column',
      tablet: '2 columns',
      desktop: '3 columns'
    },

    // Practice layout
    practice: {
      mobile: 'full-screen vertical',
      tablet: 'horizontal split',
      desktop: 'sidebar layout'
    }
  }
};

// Helper functions for responsive design
export const getBreakpointValue = (breakpoint) => {
  return breakpoints.values[breakpoint];
};

export const getMediaQuery = (breakpoint, type = 'min') => {
  if (type === 'max') {
    return breakpoints.maxMedia[breakpoint];
  }
  return breakpoints.media[breakpoint];
};

export const getBetweenQuery = (from, to) => {
  return breakpoints.between[`${from}-${to}`];
};

// CSS-in-JS helpers
export const up = (breakpoint) => `@media ${breakpoints.media[breakpoint]}`;
export const down = (breakpoint) => `@media ${breakpoints.maxMedia[breakpoint]}`;
export const between = (from, to) => `@media ${breakpoints.between[`${from}-${to}`]}`;

// Utility for checking if current screen matches breakpoint
export const useBreakpoint = (breakpoint) => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(breakpoints.media[breakpoint]).matches;
};