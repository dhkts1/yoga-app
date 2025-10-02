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

  // Page transition variants - slide from right
  const pageVariants = shouldReduceMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
      }
    : {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
      };

  const pageTransition = {
    type: "tween",
    ease: "easeOut",
    duration: 0.1,
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
