/**
 * Card Component
 *
 * Flexible card component for yoga poses, sessions, and content.
 * Designed with calming aesthetics and smooth interactions.
 * Memoized for performance optimization
 */

import React, { memo } from "react";
import { cn } from "../../lib/utils";

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
        // Basic card structure
        "bg-card",
        "relative overflow-hidden",

        // Smooth transitions for all interactive states
        "transition-all duration-300 ease-gentle",

        // Mobile safety
        mobileSafe && [
          "w-full", // Ensure cards don't exceed container width
          "box-border", // Include padding/border in width calculation
          "min-w-0", // Allow flex children to shrink
          "max-w-full", // Prevent overflow
        ],
      ];

      // Variant styles
      const variants = {
        default: ["border border-border", "rounded-xl", "shadow-sm"],

        elevated: ["rounded-xl", "shadow-md", "border-0"],

        outlined: ["border-2 border-border", "rounded-xl", "shadow-none"],

        glass: [
          "bg-card/60 backdrop-blur-xl",
          "border border-border/50",
          "rounded-xl",
          "shadow-glass",
        ],

        sage: ["bg-muted border border-border", "rounded-xl", "shadow-sm"],

        cream: ["bg-muted border border-border", "rounded-xl", "shadow-sm"],

        // ═══ LINEAR-FUTURISTIC VARIANTS ═══

        // Glass with gradient border glow
        "glass-glow": [
          "bg-card/50 backdrop-blur-2xl",
          "border border-primary/20",
          "rounded-xl",
          "shadow-card-glow",
        ],

        // Elevated with subtle glow
        "elevated-glow": [
          "bg-card",
          "rounded-xl",
          "shadow-card-glow",
          "border border-border/30",
        ],

        // Neon outlined card
        neon: [
          "bg-transparent",
          "border-2 border-primary/50",
          "rounded-xl",
          "shadow-glow-sm",
        ],

        // Gradient border effect (using pseudo-element workaround)
        gradient: [
          "bg-card",
          "border border-transparent",
          "rounded-xl",
          "shadow-card-glow",
          "ring-1 ring-primary/20",
        ],

        // Dark elevated for contrast
        dark: [
          "bg-sage-100 dark:bg-sage-200",
          "border border-border/50",
          "rounded-xl",
          "shadow-lg",
        ],
      };

      // Padding variants - mobile-first approach
      const paddings = {
        none: "p-0",
        xs: "p-2",
        sm: "p-3 sm:p-4",
        default: "p-4 sm:p-6",
        lg: "p-6 sm:p-8",
        xl: "p-8 sm:p-10",
        mobile: "p-4", // Consistent mobile padding
      };

      // Interactive states - enhanced with Linear-futuristic glow
      const interactiveStyles = interactive
        ? [
            "cursor-pointer",
            "hover:shadow-card-glow-hover hover:scale-[1.02] hover:border-primary/30",
            "active:scale-[0.98] active:shadow-card-glow",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "focus-visible:shadow-ring-glow",
          ]
        : [];

      // Hover-only styles (for cards that aren't clickable but should respond to hover)
      const hoverStyles =
        hover && !interactive
          ? [
              "hover:shadow-card-glow hover:scale-[1.01] hover:border-primary/20",
            ]
          : [];

      const cardStyles = cn(
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

// Card sub-components for common patterns
const CardHeader = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn("flex flex-col space-y-1.5 pb-4", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(
  ({ className, children, as: Component = "h3", ...props }, ref) => {
    return (
      <Component
        className={cn(
          "text-xl font-medium leading-8 text-foreground",
          "tracking-tight",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        className={cn("text-base leading-6 text-muted-foreground", className)}
        ref={ref}
        {...props}
      >
        {children}
      </p>
    );
  },
);

CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={cn("pt-0", className)} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn("flex items-center pt-4", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  },
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
