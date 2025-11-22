/**
 * Button Component - Linear/Notion Inspired
 *
 * Crisp, minimal button component with outline-based variants.
 * Simplified to 5 core variants for consistency.
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import cx from "classnames";
import { haptics } from "../../utils/haptics";

const Button = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "default",
      children,
      disabled = false,
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      mobileSafe = true,
      ...props
    },
    ref,
  ) => {
    // Check for prefers-reduced-motion
    const [shouldReduceMotion, setShouldReduceMotion] = useState(() =>
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false,
    );

    useEffect(() => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const handleChange = (e) => setShouldReduceMotion(e.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    // Base styles - Linear aesthetic
    const baseStyles = [
      // Layout
      "inline-flex items-center justify-center gap-2",
      "font-medium",
      "relative overflow-hidden",

      // Focus states
      "focus-visible:outline-none",
      "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",

      // Disabled
      "disabled:pointer-events-none disabled:opacity-40",

      // Fast transitions for Linear feel
      "transition-all duration-150 ease-out",

      // Touch targets
      "min-h-[44px]",

      // Rounded - subtle for Linear aesthetic
      "rounded-md",

      // Mobile
      mobileSafe && ["touch-manipulation", "select-none"],
      fullWidth && "w-full",
      !icon && "text-center",
    ];

    // Simplified variants - 5 core styles
    const variants = {
      // Primary: Outlined with accent fill on hover
      primary: [
        "border border-accent bg-accent/10 text-accent",
        "hover:bg-accent hover:text-accent-foreground",
        "active:bg-accent/90 active:scale-[0.98]",
      ],

      // Secondary: Ghost with border
      secondary: [
        "border border-border bg-transparent text-foreground",
        "hover:bg-surface-elevated hover:border-border-strong",
        "active:bg-surface-elevated active:scale-[0.98]",
      ],

      // Ghost: No border, subtle hover
      ghost: [
        "bg-transparent text-muted-foreground",
        "hover:bg-surface-elevated hover:text-foreground",
        "active:bg-surface active:scale-[0.98]",
      ],

      // Link: Text-only
      link: [
        "text-accent underline-offset-4",
        "hover:underline hover:text-accent/80",
        "h-auto p-0 min-h-0 font-normal",
      ],

      // Destructive: Error state
      destructive: [
        "border border-destructive bg-destructive/10 text-destructive",
        "hover:bg-destructive hover:text-destructive-foreground",
        "active:bg-destructive/90 active:scale-[0.98]",
      ],
    };

    // Size variants
    const sizes = {
      sm: ["h-9 px-3", "text-sm"],
      default: ["h-11 px-4", "text-sm"],
      lg: ["h-12 px-6", "text-base"],
      icon: ["h-11 w-11 p-0"],
      "mobile-full": ["h-11 w-full px-4", "text-sm"],
      "mobile-large": ["h-12 w-full px-6", "text-base"],
    };

    const buttonStyles = cx(
      baseStyles,
      variants[variant],
      sizes[size],
      className,
    );

    // Loading spinner
    const LoadingSpinner = () => (
      <svg
        className="size-4 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    const renderContent = () => {
      if (loading) {
        return (
          <>
            <LoadingSpinner />
            {children && <span className="opacity-70">{children}</span>}
          </>
        );
      }

      if (icon && iconPosition === "left") {
        return (
          <>
            {icon}
            {children}
          </>
        );
      }

      if (icon && iconPosition === "right") {
        return (
          <>
            {children}
            {icon}
          </>
        );
      }

      return children;
    };

    // Motion config - subtle for Linear feel
    const motionProps = shouldReduceMotion
      ? {}
      : {
          whileTap: { scale: 0.97 },
          transition: { type: "spring", stiffness: 500, damping: 30 },
        };

    const handleClick = (e) => {
      if (!disabled && !loading) {
        if (variant === "primary") {
          haptics.light();
        } else if (variant === "destructive") {
          haptics.medium();
        }
      }
      props.onClick?.(e);
    };

    return (
      <motion.button
        className={buttonStyles}
        ref={ref}
        disabled={disabled || loading}
        {...motionProps}
        {...props}
        onClick={handleClick}
      >
        {renderContent()}
      </motion.button>
    );
  },
);

Button.displayName = "Button";

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "ghost",
    "link",
    "destructive",
  ]),
  size: PropTypes.oneOf([
    "sm",
    "default",
    "lg",
    "icon",
    "mobile-full",
    "mobile-large",
  ]),
  children: PropTypes.node,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  fullWidth: PropTypes.bool,
  mobileSafe: PropTypes.bool,
};

export { Button };
