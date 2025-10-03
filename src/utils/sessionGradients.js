/**
 * Session Gradients Utility
 *
 * Provides gradient background classes for session cards based on session type/ID.
 * Uses only existing Tailwind design system colors (sage, cream, gold, orange, blue, purple, etc.)
 *
 * Features:
 * - Time-of-day based gradients (morning, midday, evening)
 * - Session-type specific gradients
 * - Dark mode variants
 * - Fallback to neutral gradient
 */

/**
 * Session gradient mapping
 * Uses ONLY sage, cream, and gold from tailwind.config.js
 * Richer, more visually appealing gradients
 */
export const SESSION_GRADIENTS = {
  // Pre-built sessions - using richer tones for visual impact
  'morning-energizer': {
    light: 'bg-gradient-to-br from-gold-200 via-gold-100 to-cream-50',
    dark: 'dark:bg-gradient-to-br dark:from-gold-900/40 dark:via-gold-900/25 dark:to-sage-900/10',
  },
  'lunch-break-relief': {
    light: 'bg-gradient-to-br from-sage-200 via-sage-100 to-cream-50',
    dark: 'dark:bg-gradient-to-br dark:from-sage-900/40 dark:via-sage-900/25 dark:to-sage-900/10',
  },
  'evening-wind-down': {
    light: 'bg-gradient-to-br from-sage-300 via-sage-200 to-sage-50',
    dark: 'dark:bg-gradient-to-br dark:from-sage-900/50 dark:via-sage-900/30 dark:to-sage-900/15',
  },
  'deep-stretch': {
    light: 'bg-gradient-to-br from-cream-300 via-cream-200 to-cream-50',
    dark: 'dark:bg-gradient-to-br dark:from-cream-900/40 dark:via-cream-900/25 dark:to-sage-900/10',
  },

  // Custom sessions - sage/gold blend with more saturation
  'custom': {
    light: 'bg-gradient-to-br from-sage-200 via-gold-100 to-cream-100',
    dark: 'dark:bg-gradient-to-br dark:from-sage-900/40 dark:via-gold-900/25 dark:to-sage-900/15',
  },

  // Breathing exercises - softer sage with depth
  'breathing': {
    light: 'bg-gradient-to-br from-sage-200 via-sage-100 to-sage-50',
    dark: 'dark:bg-gradient-to-br dark:from-sage-900/40 dark:via-sage-900/25 dark:to-sage-900/15',
  },

  // Fallback - neutral but visible gradient
  'default': {
    light: 'bg-gradient-to-br from-sage-100 to-cream-50',
    dark: 'dark:bg-gradient-to-br dark:from-sage-900/30 dark:to-sage-900/15',
  },
};

/**
 * Get gradient classes for a session
 * @param {string} sessionId - The session ID or type
 * @param {boolean} includeHover - Whether to include hover state gradient brightening
 * @returns {string} - Tailwind gradient classes
 */
export function getSessionGradient(sessionId, includeHover = false) {
  // Check if it's a custom session
  if (sessionId?.startsWith('custom-')) {
    const gradient = SESSION_GRADIENTS['custom'];
    const base = `${gradient.light} ${gradient.dark}`;
    return includeHover
      ? `${base} hover:from-sage-200 hover:via-gold-100 dark:hover:from-sage-800/40`
      : base;
  }

  // Check if it's a breathing exercise
  if (sessionId?.includes('breathing') || sessionId?.startsWith('box-') || sessionId?.startsWith('4-7-8')) {
    const gradient = SESSION_GRADIENTS['breathing'];
    const base = `${gradient.light} ${gradient.dark}`;
    return includeHover
      ? `${base} hover:from-sage-200 hover:via-sage-100 dark:hover:from-sage-800/40`
      : base;
  }

  // Use specific gradient or default
  const gradient = SESSION_GRADIENTS[sessionId] || SESSION_GRADIENTS['default'];
  const base = `${gradient.light} ${gradient.dark}`;

  if (includeHover) {
    // Generic hover brightening
    return `${base} hover:brightness-105`;
  }

  return base;
}

/**
 * Get subtle gradient for card borders/accents
 * @param {string} sessionId - The session ID
 * @returns {string} - Border gradient class
 */
export function getSessionBorderGradient(sessionId) {
  if (sessionId === 'morning-energizer') {
    return 'border-l-4 border-gold-300 dark:border-gold-700';
  }
  if (sessionId === 'lunch-break-relief') {
    return 'border-l-4 border-sage-300 dark:border-sage-700';
  }
  if (sessionId === 'evening-wind-down') {
    return 'border-l-4 border-sage-400 dark:border-sage-600';
  }
  if (sessionId?.startsWith('custom-')) {
    return 'border-l-4 border-gold-300 dark:border-gold-700';
  }
  return 'border-l-4 border-sage-300 dark:border-sage-700';
}

/**
 * Get accent color for session (for icons, badges, etc.)
 * @param {string} sessionId - The session ID
 * @returns {string} - Tailwind color classes
 */
export function getSessionAccentColor(sessionId) {
  if (sessionId === 'morning-energizer') {
    return 'text-accent';
  }
  if (sessionId === 'lunch-break-relief') {
    return 'text-foreground';
  }
  if (sessionId === 'evening-wind-down') {
    return 'text-foreground';
  }
  if (sessionId?.startsWith('custom-')) {
    return 'text-accent';
  }
  return 'text-foreground';
}

/**
 * Determine session type from session data
 * @param {object} session - Session object
 * @returns {string} - Session type identifier
 */
export function getSessionType(session) {
  if (!session) return 'default';

  // Check for custom session
  if (session.id?.startsWith('custom-') || session.isCustom) {
    return 'custom';
  }

  // Check for breathing exercise
  if (session.category === 'breathing' || session.type === 'breathing') {
    return 'breathing';
  }

  // Return session ID for specific gradients
  return session.id || 'default';
}
