/**
 * Badge Component
 *
 * Versatile badge component for status indicators, difficulty levels, yoga styles, and more.
 * Designed with calming aesthetics and semantic color mapping.
 */

import React from "react";
import PropTypes from "prop-types";
import { cn } from "../../lib/utils";

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
    // Base styles for all badges
    const baseStyles = [
      // Layout and typography
      "inline-flex items-center justify-center gap-1.5",
      "font-medium whitespace-nowrap",
      "rounded-full",
      "border",

      // Smooth transitions
      "transition-all duration-200 ease-gentle",

      // Interactive badges
      onClick && [
        "cursor-pointer",
        "hover:scale-105",
        "active:scale-95",
        "min-h-touch min-w-touch", // Mobile-safe touch targets when clickable
      ],
    ];

    // Variant styles with semantic color mapping
    const variants = {
      // Status variants (for programs, sessions)
      "status-active": [
        "bg-muted text-muted-foreground border-primary",
        "hover:bg-muted",
      ],
      "status-paused": [
        "bg-state-warning/10 text-state-warning border-state-warning/30",
        "hover:bg-state-warning/20",
      ],
      "status-completed": [
        "bg-state-success/10 text-state-success border-state-success/30",
        "hover:bg-state-success/20",
      ],
      "status-not-started": [
        "bg-muted text-muted-foreground border-border",
        "hover:bg-muted",
      ],

      // Difficulty variants
      "difficulty-beginner": [
        "bg-state-info/10 text-state-info border-state-info/30",
        "hover:bg-state-info/20",
      ],
      "difficulty-intermediate": [
        "bg-accent/10 text-accent border-accent/30",
        "hover:bg-accent/20",
      ],
      "difficulty-advanced": [
        "bg-state-error/10 text-state-error border-state-error/30",
        "hover:bg-state-error/20",
      ],
      "difficulty-mixed": [
        "bg-muted text-muted-foreground border-border",
        "hover:bg-muted",
      ],

      // Yoga style variants
      "style-iyengar": [
        "bg-muted text-muted-foreground border-primary",
        "hover:bg-muted",
      ],
      "style-vinyasa": [
        "bg-accent/10 text-accent border-accent/30",
        "hover:bg-accent/20",
      ],
      "style-hatha": [
        "bg-muted text-muted-foreground border-border",
        "hover:bg-muted",
      ],
      "style-restorative": [
        "bg-accent/10 text-accent border-accent/30",
        "hover:bg-accent/20",
      ],

      // Default variant
      default: [
        "bg-muted text-muted-foreground border-primary",
        "hover:bg-muted",
      ],

      // Additional semantic variants
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
      info: [
        "bg-state-info/10 text-state-info border-state-info/30",
        "hover:bg-state-info/20",
      ],

      // ═══ LINEAR-FUTURISTIC NEON VARIANTS ═══

      // Primary neon glow
      neon: [
        "bg-primary/10 text-primary border-primary/50",
        "shadow-glow-sm",
        "hover:bg-primary/20 hover:shadow-glow-md",
      ],

      // Neon success (green glow)
      "neon-success": [
        "bg-state-success/10 text-state-success border-state-success/50",
        "shadow-glow-success",
        "hover:bg-state-success/20",
      ],

      // Neon warning (amber glow)
      "neon-warning": [
        "bg-state-warning/10 text-state-warning border-state-warning/50",
        "shadow-glow-warning",
        "hover:bg-state-warning/20",
      ],

      // Neon error (red glow)
      "neon-error": [
        "bg-state-error/10 text-state-error border-state-error/50",
        "shadow-glow-error",
        "hover:bg-state-error/20",
      ],

      // Neon info (blue glow)
      "neon-info": [
        "bg-state-info/10 text-state-info border-state-info/50",
        "shadow-glow-info",
        "hover:bg-state-info/20",
      ],

      // Glass pill variant
      glass: [
        "bg-card/40 text-foreground border-border/30",
        "backdrop-blur-md",
        "hover:bg-card/60 hover:border-primary/30",
      ],

      // Solid accent pill
      accent: [
        "bg-primary text-primary-foreground border-primary",
        "hover:shadow-glow-sm",
      ],

      // Outline with glow on hover
      "outline-glow": [
        "bg-transparent text-foreground border-border",
        "hover:border-primary/50 hover:shadow-glow-sm hover:text-primary",
      ],

      // Dot indicator style (Linear-like status dot)
      dot: [
        "bg-transparent border-0 gap-2",
        "before:content-[''] before:w-2 before:h-2 before:rounded-full before:bg-primary before:animate-dot-pulse",
      ],
    };

    // Size variants
    const sizes = {
      sm: ["h-5 px-2 py-0.5", "text-xs", "gap-1"],
      default: ["h-6 px-3 py-1", "text-sm"],
      lg: ["h-8 px-4 py-1.5", "text-base", "gap-2"],
    };

    const badgeStyles = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      className,
    );

    // Render content with optional icon
    const renderContent = () => {
      if (icon && iconPosition === "left") {
        return (
          <>
            <span className="shrink-0">{icon}</span>
            {children}
          </>
        );
      }

      if (icon && iconPosition === "right") {
        return (
          <>
            {children}
            <span className="shrink-0">{icon}</span>
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
    "status-active",
    "status-paused",
    "status-completed",
    "status-not-started",
    "difficulty-beginner",
    "difficulty-intermediate",
    "difficulty-advanced",
    "difficulty-mixed",
    "style-iyengar",
    "style-vinyasa",
    "style-hatha",
    "style-restorative",
    "success",
    "warning",
    "error",
    "info",
    // Linear-futuristic variants
    "neon",
    "neon-success",
    "neon-warning",
    "neon-error",
    "neon-info",
    "glass",
    "accent",
    "outline-glow",
    "dot",
  ]),
  size: PropTypes.oneOf(["sm", "default", "lg"]),
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

export { Badge };
