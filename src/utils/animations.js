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
        delayChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  },
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
        delayChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  },
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
    transition: { duration: 0.3, ease: "easeOut" },
  },
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
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
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
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// LINEAR-FUTURISTIC ANIMATIONS
// Spring physics, glow effects, and modern micro-interactions
// ═══════════════════════════════════════════════════════════════════

/**
 * SPRING - Natural spring physics for interactive elements
 *
 * Perfect for:
 * - Button presses
 * - Card hovers
 * - Interactive feedback
 */
export const SPRING = {
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

/**
 * GLOW_CARD - Card with glow effect on hover
 *
 * Perfect for:
 * - Session cards
 * - Interactive tiles
 * - CTAs
 */
export const GLOW_CARD = {
  initial: {
    boxShadow: "0 0 0 0 rgba(139, 92, 246, 0)",
    scale: 1,
  },
  hover: {
    boxShadow: "0 0 30px -6px rgba(139, 92, 246, 0.4)",
    scale: 1.01,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  tap: {
    scale: 0.99,
    boxShadow: "0 0 20px -4px rgba(139, 92, 246, 0.3)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

/**
 * BLUR_IN - Entrance with blur effect
 *
 * Perfect for:
 * - Page transitions
 * - Modal entrances
 * - Hero sections
 */
export const BLUR_IN = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
    y: 10,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/**
 * STAGGER_SPRING - List animation with spring physics
 *
 * Perfect for:
 * - Dashboard cards
 * - Navigation items
 * - Feature lists
 */
export const STAGGER_SPRING = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  },
};

/**
 * COUNTER_ROLL - Animated number counter
 *
 * Use with AnimatePresence for number changes
 */
export const COUNTER_ROLL = {
  initial: { y: 20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

/**
 * RIPPLE - Ripple effect for button clicks
 *
 * Use with motion.span inside buttons
 */
export const RIPPLE = {
  initial: { scale: 0, opacity: 0.6 },
  animate: {
    scale: 2.5,
    opacity: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/**
 * GLOW_BUTTON - Button with glow on hover/focus
 *
 * Perfect for:
 * - Primary CTAs
 * - Important actions
 */
export const GLOW_BUTTON = {
  initial: {
    boxShadow: "0 0 0 0 rgba(139, 92, 246, 0)",
  },
  hover: {
    boxShadow: "0 0 20px -4px rgba(139, 92, 246, 0.5)",
    transition: {
      duration: 0.2,
    },
  },
  focus: {
    boxShadow:
      "0 0 0 4px rgba(139, 92, 246, 0.2), 0 0 20px -4px rgba(139, 92, 246, 0.4)",
  },
  tap: {
    scale: 0.98,
    boxShadow: "0 0 15px -3px rgba(139, 92, 246, 0.4)",
  },
};

/**
 * PAGE_TRANSITION - Smooth page transitions
 *
 * Use with AnimatePresence at router level
 */
export const PAGE_TRANSITION = {
  initial: {
    opacity: 0,
    y: 8,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    filter: "blur(2px)",
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * SKELETON_PULSE - Skeleton loading animation
 *
 * Apply to loading placeholders
 */
export const SKELETON_PULSE = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * HOVER_LIFT - Subtle lift effect on hover
 *
 * Perfect for:
 * - Cards
 * - List items
 * - Interactive elements
 */
export const HOVER_LIFT = {
  initial: { y: 0 },
  hover: {
    y: -4,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

/**
 * STAGGER_FADE - Standard stagger animation for lists
 *
 * Perfect for:
 * - Welcome screen sections
 * - Navigation lists
 * - Card grids
 */
export const STAGGER_FADE = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  },
};

/**
 * CELEBRATE - Celebration stagger animation with scale
 *
 * Perfect for:
 * - Completion screens
 * - Achievement displays
 * - Success states
 */
export const CELEBRATE = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  },
};
