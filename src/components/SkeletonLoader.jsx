/**
 * SkeletonLoader Component
 *
 * Loading placeholder with shimmer animation for content loading states.
 * Respects user's motion preferences with prefers-reduced-motion support.
 */

import PropTypes from "prop-types";
import { cn } from "../lib/utils";
import { useReducedMotion } from "../hooks/useReducedMotion";

const SkeletonLoader = ({
  width = "100%",
  height = "1rem",
  count = 1,
  className = "",
  variant = "default",
}) => {
  // Use existing hook instead of re-implementing
  const shouldReduceMotion = useReducedMotion();

  // Variant styles
  const variants = {
    default: "rounded-md",
    text: "rounded",
    circle: "rounded-full",
    card: "rounded-xl",
    button: "rounded-lg",
  };

  // Base skeleton styles
  const baseStyles = [
    "bg-gradient-to-r from-muted via-muted/50 to-muted",
    "bg-[length:200%_100%]",
    !shouldReduceMotion && "animate-shimmer",
    variants[variant],
  ];

  // Create array of skeleton elements based on count
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={cn(baseStyles, className)}
      style={{
        width,
        height,
        // Add slight spacing between multiple skeleton lines
        marginBottom: count > 1 && index < count - 1 ? "0.5rem" : "0",
      }}
      role="status"
      aria-label="Loading..."
    />
  ));

  return (
    <>
      {skeletons}
      {/* Accessible loading text for screen readers */}
      <span className="sr-only">Loading content...</span>
    </>
  );
};

SkeletonLoader.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  count: PropTypes.number,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "text", "circle", "card", "button"]),
};

export default SkeletonLoader;
