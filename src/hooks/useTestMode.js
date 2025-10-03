import { useEffect } from 'react';

/**
 * Custom hook for E2E test mode detection and timer speed configuration.
 *
 * Test mode allows E2E tests to run much faster by reducing pose durations
 * from minutes to seconds (1 second per pose in test mode).
 *
 * @returns {Object} Test mode utilities
 * @returns {Function} getEffectiveDuration - Converts duration based on test mode (1s if testing, original if not)
 * @returns {boolean} isTestMode - Whether test mode is currently active
 *
 * @example
 * const { getEffectiveDuration, isTestMode } = useTestMode();
 * const duration = getEffectiveDuration(60); // Returns 1 if testing, 60 if not
 */
export function useTestMode() {
  // Initialize test mode from sessionStorage on mount (for E2E tests)
  // Also ensure window properties are set if sessionStorage indicates test mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isTestMode = sessionStorage.getItem('__TEST_MODE__') === 'true';
      if (isTestMode) {
        window.__TEST_MODE__ = true;
        window.__TIMER_SPEED__ = parseInt(sessionStorage.getItem('__TIMER_SPEED__') || '100', 10);
      }
    }
  }, []); // Run once on mount

  /**
   * Converts a duration to its effective value based on test mode.
   * In test mode, all durations become 1 second for fast testing.
   *
   * @param {number} duration - Original duration in seconds
   * @returns {number} Effective duration (1 if test mode, original otherwise)
   */
  const getEffectiveDuration = (duration) => {
    if (typeof window !== 'undefined') {
      // Check sessionStorage FIRST (available during initial render, before useEffect runs)
      const isTestMode = sessionStorage.getItem('__TEST_MODE__') === 'true' || window.__TEST_MODE__;
      if (isTestMode) {
        // Note: window properties are set in useEffect above, not here during render
        return 1; // 1 second per pose in test mode
      }
    }
    return duration;
  };

  const isTestMode = typeof window !== 'undefined' &&
    (sessionStorage.getItem('__TEST_MODE__') === 'true' || window.__TEST_MODE__);

  return {
    getEffectiveDuration,
    isTestMode
  };
}
