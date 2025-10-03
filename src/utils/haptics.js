/**
 * Haptic feedback utilities using Vibration API
 * Provides tactile feedback for user interactions
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
 */

export const haptics = {
  /**
   * Light tap (button press, navigation)
   * Duration: 10ms
   */
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },

  /**
   * Medium tap (important action, pose transition)
   * Duration: 20ms
   */
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },

  /**
   * Strong tap (completion, milestone)
   * Duration: 40ms
   */
  strong: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(40);
    }
  },

  /**
   * Success pattern (session complete, achievement unlocked)
   * Pattern: [vibrate 10ms, pause 50ms, vibrate 10ms]
   */
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  },

  /**
   * Error pattern (validation failed, action blocked)
   * Pattern: [vibrate 50ms, pause 50ms, vibrate 50ms]
   */
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50, 50]);
    }
  },

  /**
   * Check if Vibration API is supported
   * @returns {boolean}
   */
  isSupported: () => 'vibrate' in navigator
};
