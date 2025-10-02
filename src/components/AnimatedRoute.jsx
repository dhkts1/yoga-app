import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * AnimatedRoute - Reusable wrapper for route animations
 *
 * Eliminates duplication of motion.div wrapping across all routes in App.jsx.
 * Handles prefers-reduced-motion detection and applies consistent page transitions.
 *
 * Usage:
 *   <Route path="/example" element={<AnimatedRoute component={ExampleScreen} />} />
 *
 * @param {Object} props
 * @param {React.ComponentType} props.component - The screen component to render
 * @returns {JSX.Element} Animated wrapper around the component
 */
function AnimatedRoute({ component: Component }) {
  const shouldReduceMotion = useReducedMotion();

  // Page transition variants - using only 2 keyframes for spring compatibility
  const pageVariants = shouldReduceMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3,
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Component />
    </motion.div>
  );
}

export default AnimatedRoute;
