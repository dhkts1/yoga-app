import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { haptics } from "../../utils/haptics";

const GradientButton = React.forwardRef(
  (
    {
      className,
      children,
      size = "default",
      disabled = false,
      loading = false,
      onClick,
      ...props
    },
    ref,
  ) => {
    const sizes = {
      sm: "h-10 px-4 text-sm",
      default: "h-14 px-8 text-base",
      lg: "h-16 px-10 text-lg",
    };

    const handleClick = (e) => {
      if (!disabled && !loading) {
        haptics.medium();
      }
      onClick?.(e);
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2",
          "font-semibold text-white",
          "overflow-hidden rounded-xl",
          "shimmer shadow-lg",
          "transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          sizes[size],
          className,
        )}
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--aurora-teal)), hsl(var(--aurora-violet)), hsl(var(--aurora-coral)))",
        }}
        disabled={disabled || loading}
        onClick={handleClick}
        whileHover={{
          scale: disabled ? 1 : 1.02,
          boxShadow: "0 10px 40px -10px hsl(var(--aurora-violet) / 0.4)",
        }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...props}
      >
        {loading ? (
          <svg className="size-5 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          children
        )}
      </motion.button>
    );
  },
);

GradientButton.displayName = "GradientButton";

GradientButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(["sm", "default", "lg"]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
};

export { GradientButton };
