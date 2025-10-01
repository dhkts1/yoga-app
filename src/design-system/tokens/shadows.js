/**
 * Design Tokens: Shadows
 *
 * Soft, natural shadows that create gentle depth without harshness.
 * Inspired by natural light filtering through leaves.
 */

export const shadows = {
  // Elevation levels - progressive depth
  none: 'none',

  // Subtle shadows for cards and subtle elevation
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',

  // Default shadow for most cards and components
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',

  // Medium shadow for hover states and interactive elements
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',

  // Large shadow for modals and important overlays
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',

  // Extra large shadow for major elevation changes
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',

  // Maximum shadow for the highest floating elements
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Colored shadows for brand elements
  sage: {
    sm: '0 1px 2px 0 rgba(143, 166, 142, 0.15)',
    base: '0 1px 3px 0 rgba(143, 166, 142, 0.2), 0 1px 2px 0 rgba(143, 166, 142, 0.12)',
    md: '0 4px 6px -1px rgba(143, 166, 142, 0.2), 0 2px 4px -1px rgba(143, 166, 142, 0.12)',
    lg: '0 10px 15px -3px rgba(143, 166, 142, 0.2), 0 4px 6px -2px rgba(143, 166, 142, 0.1)'
  },

  gold: {
    sm: '0 1px 2px 0 rgba(212, 175, 55, 0.15)',
    base: '0 1px 3px 0 rgba(212, 175, 55, 0.2), 0 1px 2px 0 rgba(212, 175, 55, 0.12)',
    md: '0 4px 6px -1px rgba(212, 175, 55, 0.2), 0 2px 4px -1px rgba(212, 175, 55, 0.12)',
    lg: '0 10px 15px -3px rgba(212, 175, 55, 0.2), 0 4px 6px -2px rgba(212, 175, 55, 0.1)'
  },

  // Component-specific shadows
  component: {
    // Cards
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    cardHover: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    cardPressed: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',

    // Buttons
    button: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    buttonHover: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
    buttonPressed: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.1)',

    // Primary button (sage)
    buttonPrimary: '0 1px 2px 0 rgba(143, 166, 142, 0.3)',
    buttonPrimaryHover: '0 2px 4px 0 rgba(143, 166, 142, 0.4)',

    // Overlays and modals
    modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overlay: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    tooltip: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',

    // Navigation
    header: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    tabBar: '0 -1px 3px 0 rgba(0, 0, 0, 0.1), 0 -1px 2px 0 rgba(0, 0, 0, 0.06)',

    // Form elements
    input: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    inputFocus: '0 0 0 3px rgba(143, 166, 142, 0.1), inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',

    // Progress elements
    progressTrack: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.1)',
    progressFill: '0 1px 2px 0 rgba(143, 166, 142, 0.3)'
  },

  // Inner shadows for inset effects
  inner: {
    sm: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    md: 'inset 0 4px 6px 0 rgba(0, 0, 0, 0.07)',
    lg: 'inset 0 8px 12px 0 rgba(0, 0, 0, 0.08)'
  },

  // Glow effects for focus and active states
  glow: {
    sage: '0 0 0 4px rgba(143, 166, 142, 0.1)',
    sageStrong: '0 0 0 4px rgba(143, 166, 142, 0.2)',
    gold: '0 0 0 4px rgba(212, 175, 55, 0.1)',
    error: '0 0 0 4px rgba(232, 180, 184, 0.2)',
    success: '0 0 0 4px rgba(16, 185, 129, 0.1)'
  }
};

// Helper function to get shadow by elevation level
export const getShadowByElevation = (level) => {
  const elevationMap = {
    0: shadows.none,
    1: shadows.sm,
    2: shadows.base,
    3: shadows.md,
    4: shadows.lg,
    5: shadows.xl,
    6: shadows['2xl']
  };

  return elevationMap[level] || shadows.base;
};

// Helper function to combine multiple shadows
export const combineShadows = (...shadowValues) => {
  return shadowValues.filter(Boolean).join(', ');
};