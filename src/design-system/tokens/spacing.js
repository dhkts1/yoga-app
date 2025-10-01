/**
 * Design Tokens: Spacing
 *
 * Consistent spacing scale for layout and component spacing.
 * Based on 8px grid system for pixel-perfect alignment.
 */

export const spacing = {
  // Base spacing scale (8px grid)
  0: '0px',
  1: '4px',      // 0.25rem
  2: '8px',      // 0.5rem
  3: '12px',     // 0.75rem
  4: '16px',     // 1rem
  5: '20px',     // 1.25rem
  6: '24px',     // 1.5rem
  8: '32px',     // 2rem
  10: '40px',    // 2.5rem
  12: '48px',    // 3rem
  16: '64px',    // 4rem
  20: '80px',    // 5rem
  24: '96px',    // 6rem
  32: '128px',   // 8rem
  40: '160px',   // 10rem
  48: '192px',   // 12rem
  56: '224px',   // 14rem
  64: '256px',   // 16rem

  // Semantic spacing - Named for intent
  xs: '4px',     // Tiny gaps
  sm: '8px',     // Small gaps
  md: '16px',    // Medium gaps (default)
  lg: '24px',    // Large gaps
  xl: '32px',    // Extra large gaps
  '2xl': '48px', // 2X large gaps
  '3xl': '64px', // 3X large gaps
  '4xl': '96px', // 4X large gaps

  // Component-specific spacing
  component: {
    // Touch targets - Minimum 44px for accessibility
    touchTarget: '44px',
    touchTargetLarge: '56px',

    // Padding
    buttonPaddingX: '24px',
    buttonPaddingY: '12px',
    cardPadding: '16px',
    cardPaddingLarge: '24px',
    containerPadding: '16px',
    containerPaddingLarge: '24px',

    // Margins
    sectionMargin: '32px',
    cardMargin: '16px',
    elementMargin: '8px',

    // Gaps
    stackGap: '16px',
    gridGap: '16px',
    flexGap: '8px',

    // Layout
    headerHeight: '64px',
    tabBarHeight: '64px',
    modalPadding: '24px',
    overlayPadding: '16px'
  },

  // Screen-specific spacing
  screen: {
    // Safe areas
    safeAreaTop: 'env(safe-area-inset-top)',
    safeAreaBottom: 'env(safe-area-inset-bottom)',
    safeAreaLeft: 'env(safe-area-inset-left)',
    safeAreaRight: 'env(safe-area-inset-right)',

    // Container padding by screen size
    mobile: '16px',
    tablet: '24px',
    desktop: '32px',

    // Maximum container widths
    maxWidthMobile: '480px',
    maxWidthTablet: '768px',
    maxWidthDesktop: '1024px'
  },

  // Layout spacing for specific use cases
  layout: {
    // Yoga-specific spacing
    poseImageMargin: '24px',
    timerMargin: '32px',
    sessionCardGap: '16px',
    practiceScreenPadding: '20px',
    tipsPadding: '16px',

    // Navigation
    navItemPadding: '12px',
    tabBarPadding: '8px',
    menuItemPadding: '16px',

    // Forms
    fieldSpacing: '16px',
    labelMargin: '8px',
    inputPadding: '12px',

    // Cards and containers
    cardBorderRadius: '16px',
    buttonBorderRadius: '12px',
    inputBorderRadius: '8px',
    overlayBorderRadius: '20px'
  }
};

// Helper functions for common spacing patterns
export const getSpacing = (size) => spacing[size] || spacing.md;

export const getComponentSpacing = (component, property) => {
  return spacing.component[`${component}${property ? property.charAt(0).toUpperCase() + property.slice(1) : ''}`];
};

// Stack spacing utility (for vertical layouts)
export const stackSpacing = {
  tight: spacing.xs,    // 4px
  normal: spacing.md,   // 16px
  loose: spacing.lg,    // 24px
  relaxed: spacing.xl   // 32px
};

// Grid spacing utility (for grid layouts)
export const gridSpacing = {
  tight: spacing.sm,    // 8px
  normal: spacing.md,   // 16px
  loose: spacing.lg,    // 24px
  relaxed: spacing.xl   // 32px
};