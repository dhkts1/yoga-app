/**
 * Design Tokens: Typography
 *
 * Optimized for readability at arm's length during yoga practice.
 * Minimum 18px base size as specified in PRD for accessibility.
 */

export const typography = {
  // Font families
  fontFamily: {
    sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'monospace']
  },

  // Font sizes with line heights optimized for readability
  fontSize: {
    // Small text - Use sparingly, only for captions
    xs: {
      size: '14px',
      lineHeight: '20px',
      letterSpacing: '0.025em'
    },

    // Small text - Secondary information
    sm: {
      size: '16px',
      lineHeight: '24px',
      letterSpacing: '0.025em'
    },

    // Base size - Primary reading text (minimum for arm's length)
    base: {
      size: '18px',
      lineHeight: '28px',
      letterSpacing: '0.025em'
    },

    // Large text - Headings and emphasis
    lg: {
      size: '20px',
      lineHeight: '32px',
      letterSpacing: '0.025em'
    },

    // Extra large - Section headings
    xl: {
      size: '24px',
      lineHeight: '36px',
      letterSpacing: '0.025em'
    },

    // 2X large - Page headings
    '2xl': {
      size: '32px',
      lineHeight: '44px',
      letterSpacing: '0.025em'
    },

    // 3X large - Display text (timer, etc.)
    '3xl': {
      size: '48px',
      lineHeight: '56px',
      letterSpacing: '0.025em'
    },

    // 4X large - Hero/display text
    '4xl': {
      size: '64px',
      lineHeight: '72px',
      letterSpacing: '0.025em'
    }
  },

  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },

  // Semantic text styles for common components
  styles: {
    // Headings
    h1: {
      fontSize: '32px',
      lineHeight: '44px',
      fontWeight: '600',
      letterSpacing: '0.025em',
      color: '#2C2C2C'
    },

    h2: {
      fontSize: '24px',
      lineHeight: '36px',
      fontWeight: '600',
      letterSpacing: '0.025em',
      color: '#2C2C2C'
    },

    h3: {
      fontSize: '20px',
      lineHeight: '32px',
      fontWeight: '500',
      letterSpacing: '0.025em',
      color: '#2C2C2C'
    },

    h4: {
      fontSize: '18px',
      lineHeight: '28px',
      fontWeight: '500',
      letterSpacing: '0.025em',
      color: '#2C2C2C'
    },

    // Body text
    body: {
      fontSize: '18px',
      lineHeight: '28px',
      fontWeight: '400',
      letterSpacing: '0.025em',
      color: '#2C2C2C'
    },

    // Secondary text
    caption: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: '400',
      letterSpacing: '0.025em',
      color: '#6B6B6B'
    },

    // Small text (use sparingly)
    small: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: '400',
      letterSpacing: '0.025em',
      color: '#6B6B6B'
    },

    // UI elements
    button: {
      fontSize: '18px',
      lineHeight: '28px',
      fontWeight: '500',
      letterSpacing: '0.025em'
    },

    // Timer display
    timer: {
      fontSize: '48px',
      lineHeight: '56px',
      fontWeight: '600',
      letterSpacing: '0.025em',
      color: '#8FA68E'
    },

    // Pose names
    poseName: {
      fontSize: '20px',
      lineHeight: '32px',
      fontWeight: '500',
      letterSpacing: '0.025em',
      color: '#2C2C2C'
    },

    // Sanskrit names
    sanskrit: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: '400',
      letterSpacing: '0.025em',
      color: '#6B6B6B',
      fontStyle: 'italic'
    }
  }
};

// Helper function to apply text styles
export const getTextStyle = (styleName) => {
  const style = typography.styles[styleName];
  if (!style) return {};

  return {
    fontSize: style.fontSize,
    lineHeight: style.lineHeight,
    fontWeight: style.fontWeight,
    letterSpacing: style.letterSpacing,
    color: style.color,
    fontStyle: style.fontStyle
  };
};