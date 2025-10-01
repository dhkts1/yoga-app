/**
 * Design Tokens: Colors
 *
 * Calming, nature-inspired palette for mindful yoga practice.
 * Based on PRD specifications with semantic naming for clear intent.
 */

export const colors = {
  // Primary palette - Core brand colors
  sage: {
    50: '#F7F8F7',    // Lightest sage for backgrounds
    100: '#E8ECE8',   // Light sage for subtle accents
    200: '#D1DAD0',   // Medium-light sage
    300: '#B5C4B4',   // Medium sage
    400: '#9BB29A',   // Medium-dark sage
    500: '#8FA68E',   // Primary sage (brand color)
    600: '#758974',   // Dark sage for text
    700: '#5C6E5B',   // Darker sage
    800: '#3F4A3F',   // Very dark sage
    900: '#2A332A',   // Darkest sage
    DEFAULT: '#8FA68E'
  },

  cream: {
    50: '#FDFBF7',    // Lightest cream
    100: '#F5F3F0',   // Primary cream (brand color)
    200: '#F0EDE9',   // Medium-light cream
    300: '#E8E6E3',   // Medium cream
    400: '#DDD9D5',   // Medium-dark cream
    500: '#D1CCC7',   // Dark cream
    600: '#B8B2AD',   // Darker cream
    700: '#9A9590',   // Very dark cream
    800: '#716B66',   // Almost gray
    900: '#4A453F',   // Darkest cream
    DEFAULT: '#F5F3F0'
  },

  gold: {
    50: '#FDFBF5',    // Lightest gold
    100: '#F7F2E6',   // Light gold
    200: '#F0E5CC',   // Medium-light gold
    300: '#E6D6B3',   // Medium gold
    400: '#DCC799',   // Medium-dark gold
    500: '#D4AF37',   // Primary gold (brand color)
    600: '#B89A2F',   // Dark gold
    700: '#9C8427',   // Darker gold
    800: '#806E1F',   // Very dark gold
    900: '#665917',   // Darkest gold
    DEFAULT: '#D4AF37'
  },

  // Neutral palette - For text and UI elements
  neutral: {
    50: '#FAFAFA',    // Background white
    100: '#F5F5F5',   // Light gray
    200: '#E5E5E5',   // Medium-light gray
    300: '#D4D4D4',   // Medium gray
    400: '#A3A3A3',   // Medium-dark gray
    500: '#737373',   // Dark gray
    600: '#525252',   // Darker gray
    700: '#404040',   // Very dark gray
    800: '#262626',   // Almost black
    900: '#171717',   // Darkest gray
    DEFAULT: '#737373'
  },

  // Semantic colors - Meaning-based naming
  primary: '#8FA68E',      // Sage green - primary brand
  secondary: '#F5F3F0',    // Warm cream - secondary brand
  accent: '#D4AF37',       // Muted gold - highlight/accent

  // Text colors - Semantic naming for readability
  text: {
    primary: '#2C2C2C',    // Deep charcoal - main text
    secondary: '#6B6B6B',  // Soft gray - secondary text
    muted: '#9CA3AF',      // Muted - disabled/placeholder
    inverse: '#FFFFFF',    // White - on dark backgrounds
    sage: '#758974',       // Sage - special text on light
    cream: '#5A5550'       // Warm dark - text on cream
  },

  // Background colors - Context-specific naming
  background: {
    primary: '#FAFAFA',    // Main app background
    secondary: '#F5F3F0',  // Card/section background
    sage: '#8FA68E',       // Sage background
    cream: '#F5F3F0',      // Cream background
    overlay: 'rgba(245, 243, 240, 0.95)', // Modal overlay
    glass: 'rgba(255, 255, 255, 0.8)'     // Glass effect
  },

  // Border colors - Subtle definition
  border: {
    light: '#E5E7EB',      // Light borders
    medium: '#D1D5DB',     // Medium borders
    sage: '#B5C4B4',       // Sage borders
    focus: '#8FA68E'       // Focus state borders
  },

  // State colors - User feedback
  state: {
    success: '#10B981',    // Green for success
    warning: '#F59E0B',    // Amber for warnings
    error: '#E8B4B8',      // Soft pink for errors (from PRD)
    info: '#3B82F6'        // Blue for information
  },

  // Interactive colors - For buttons, links, etc.
  interactive: {
    primary: '#8FA68E',           // Primary button
    'primary-hover': '#758974',   // Primary button hover
    'primary-active': '#5C6E5B',  // Primary button active
    secondary: 'transparent',     // Secondary button
    'secondary-hover': '#F7F8F7', // Secondary button hover
    'secondary-active': '#E8ECE8' // Secondary button active
  }
};

// Export individual palettes for convenience
export const { sage, cream, gold, neutral, text, background, border, state, interactive } = colors;