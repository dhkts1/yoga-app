/**
 * Badge Component - Linear/Notion Inspired
 *
 * Simplified badge with outline-first design.
 * Semantic variants for status and state.
 */

import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

const Badge = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      icon,
      iconPosition = "left",
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const baseStyles = [
      "inline-flex items-center justify-center gap-1.5",
      "font-medium font-mono text-xs uppercase tracking-wide",
      "rounded-md",
      "border",
      "transition-all duration-150 ease-out",
      onClick && [
        "cursor-pointer",
        "hover:scale-[1.02]",
        "active:scale-[0.98]",
      ],
    ];

    // Simplified variants - outlined by default
    const variants = {
      default: [
        "bg-transparent text-muted-foreground border-border",
        "hover:border-border-strong hover:text-foreground",
      ],

      // Semantic status
      success: [
        "bg-state-success/10 text-state-success border-state-success/30",
        "hover:bg-state-success/20",
      ],
      warning: [
        "bg-state-warning/10 text-state-warning border-state-warning/30",
        "hover:bg-state-warning/20",
      ],
      error: [
        "bg-state-error/10 text-state-error border-state-error/30",
        "hover:bg-state-error/20",
      ],
      info: ["bg-accent/10 text-accent border-accent/30", "hover:bg-accent/20"],

      // Accent - filled
      accent: [
        "bg-accent text-accent-foreground border-accent",
        "hover:bg-accent/90",
      ],

      // Status indicators (for programs/sessions)
      active: ["bg-accent/10 text-accent border-accent/30"],
      paused: [
        "bg-state-warning/10 text-state-warning border-state-warning/30",
      ],
      completed: [
        "bg-state-success/10 text-state-success border-state-success/30",
      ],

      // Delta badges for stats
      "delta-up": [
        "bg-state-success/10 text-state-success border-state-success/30",
        "font-mono",
      ],
      "delta-down": [
        "bg-state-error/10 text-state-error border-state-error/30",
        "font-mono",
      ],
    };

    // Size variants
    const sizes = {
      sm: ["h-5 px-1.5", "text-[10px]"],
      default: ["h-6 px-2"],
      lg: ["h-7 px-3", "text-xs"],
    };

    const badgeStyles = cx(
      baseStyles,
      variants[variant],
      sizes[size],
      className,
    );

    const renderContent = () => {
      if (icon && iconPosition === "left") {
        return (
          <>
            <span className="size-3 shrink-0">{icon}</span>
            {children}
          </>
        );
      }

      if (icon && iconPosition === "right") {
        return (
          <>
            {children}
            <span className="size-3 shrink-0">{icon}</span>
          </>
        );
      }

      return children;
    };

    return (
      <span
        className={badgeStyles}
        ref={ref}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        {...props}
      >
        {renderContent()}
      </span>
    );
  },
);

Badge.displayName = "Badge";

Badge.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf([
    "default",
    "success",
    "warning",
    "error",
    "info",
    "accent",
    "active",
    "paused",
    "completed",
    "delta-up",
    "delta-down",
  ]),
  size: PropTypes.oneOf(["sm", "default", "lg"]),
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

export { Badge };
