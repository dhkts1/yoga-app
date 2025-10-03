import { useEffect, useState } from 'react';

/**
 * useReducedMotion Hook
 *
 * Detects if the user has enabled "prefers-reduced-motion" in their OS settings
 * and returns a boolean indicating whether animations should be reduced or disabled.
 *
 * This hook automatically updates when the user changes their system preferences.
 *
 * @returns {boolean} true if user prefers reduced motion, false otherwise
 *
 * @example
 * function MyComponent() {
 *   const shouldReduceMotion = useReducedMotion();
 *
 *   return (
 *     <motion.div
 *       animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
 *     >
 *       Content
 *     </motion.div>
 *   );
 * }
 *
 * @example
 * // Disable animations completely
 * function AnimatedButton() {
 *   const shouldReduceMotion = useReducedMotion();
 *
 *   if (shouldReduceMotion) {
 *     return <button>Click me</button>;
 *   }
 *
 *   return (
 *     <motion.button whileHover={{ scale: 1.05 }}>
 *       Click me
 *     </motion.button>
 *   );
 * }
 */
export function useReducedMotion() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(() => {
    // Initialize with current media query value
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    // Return early if window is not available (SSR)
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // No need to set initial value - already set in useState initializer

    const handleChange = (e) => {
      setShouldReduceMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return shouldReduceMotion;
}

export default useReducedMotion;
