/**
 * Shared Animation Utilities
 *
 * Centralized Framer Motion animation variants used across the application.
 * These variants provide consistent timing, easing, and stagger effects for list animations.
 *
 * Usage:
 * ```jsx
 * import { LIST_ANIMATION } from '../utils/animations';
 *
 * <motion.div
 *   variants={LIST_ANIMATION.container}
 *   initial="hidden"
 *   animate="visible"
 * >
 *   {items.map(item => (
 *     <motion.div key={item.id} variants={LIST_ANIMATION.item}>
 *       {item.content}
 *     </motion.div>
 *   ))}
 * </motion.div>
 * ```
 */

/**
 * LIST_ANIMATION - Standard list animation with stagger effect
 *
 * Perfect for:
 * - Session cards
 * - Program cards
 * - Navigation lists
 * - Any vertically stacked content that should animate in sequentially
 *
 * Timing:
 * - Container fades in instantly
 * - Children stagger by 50ms (staggerChildren: 0.05)
 * - First child starts after 100ms delay (delayChildren: 0.1)
 * - Each item takes 300ms to animate in
 */
export const LIST_ANIMATION = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }
};

/**
 * LIST_ANIMATION_SUBTLE - Reduced motion variant of LIST_ANIMATION
 *
 * Same timing but with less vertical movement (y: 8 instead of y: 10)
 * Use for denser lists or when more subtle animations are desired
 */
export const LIST_ANIMATION_SUBTLE = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }
};

/**
 * FADE_IN - Simple fade-in animation without movement
 *
 * Perfect for:
 * - Modal overlays
 * - Static content
 * - When movement would be distracting
 */
export const FADE_IN = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

/**
 * SLIDE_UP - Slide up from bottom with fade
 *
 * Perfect for:
 * - Modals
 * - Bottom sheets
 * - Toast notifications
 */
export const SLIDE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

/**
 * SCALE_IN - Scale and fade in
 *
 * Perfect for:
 * - Emphasis elements
 * - Icons
 * - Celebration elements
 */
export const SCALE_IN = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1]
    }
  }
};
