/**
 * Card Component - Linear/Notion Inspired
 *
 * Simplified card with flat borders and minimal shadows.
 * Reduced to 3 core variants for consistency.
 */

import React, { memo } from "react";
import cx from "classnames";

const Card = memo(
  React.forwardRef(
    (
      {
        className,
        variant = "default",
        padding = "default",
        interactive = false,
        hover = false,
        mobileSafe = true,
        children,
        ...props
      },
      ref,
    ) => {
      const baseStyles = [
        "bg-surface",
        "relative overflow-hidden",
        "transition-all duration-150 ease-out",
        mobileSafe && ["w-full", "box-border", "min-w-0", "max-w-full"],
      ];

      // Simplified variants - 3 core styles
      const variants = {
        default: ["border border-border", "rounded-lg"],
        elevated: ["border border-border", "rounded-lg", "shadow-card"],
        outlined: [
          "border border-border-strong",
          "rounded-lg",
          "bg-transparent",
        ],
      };

      // Padding variants
      const paddings = {
        none: "p-0",
        xs: "p-2",
        sm: "p-3",
        default: "p-4",
        lg: "p-6",
      };

      // Interactive states
      const interactiveStyles = interactive
        ? [
            "cursor-pointer",
            "hover:bg-surface-elevated hover:border-border-strong",
            "active:scale-[0.99]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          ]
        : [];

      const hoverStyles =
        hover && !interactive
          ? ["hover:bg-surface-elevated hover:border-border-strong"]
          : [];

      const cardStyles = cx(
        baseStyles,
        variants[variant],
        paddings[padding],
        interactiveStyles,
        hoverStyles,
        className,
      );

      return (
        <div className={cardStyles} ref={ref} {...props}>
          {children}
        </div>
      );
    },
  ),
);

Card.displayName = "Card";

// Card sub-components
const CardHeader = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      className={cx("flex flex-col gap-1 pb-3", className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  ),
);

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(
  ({ className, children, as: Component = "h3", ...props }, ref) => (
    <Component
      className={cx(
        "font-display text-lg font-semibold text-foreground",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </Component>
  ),
);

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <p
      className={cx("text-sm text-muted-foreground", className)}
      ref={ref}
      {...props}
    >
      {children}
    </p>
  ),
);

CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div className={cx("", className)} ref={ref} {...props}>
      {children}
    </div>
  ),
);

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      className={cx("flex items-center border-t border-border pt-3", className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  ),
);

CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
