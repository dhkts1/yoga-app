/**
 * Typography Components
 *
 * Semantic typography components optimized for yoga practice.
 * Minimum 18px base size for arm's length readability.
 */

import React from "react";
import { cn } from "../../lib/utils";

// Heading component with semantic levels
const Heading = React.forwardRef(
  (
    {
      level = 1,
      className,
      children,
      as,
      variant,
      mobileSafe = true,
      ...props
    },
    ref,
  ) => {
    // Determine the HTML element
    const Component = as || `h${level}`;

    // Default variant based on level
    const defaultVariant =
      variant ||
      {
        1: "h1",
        2: "h2",
        3: "h3",
        4: "h4",
        5: "h4",
        6: "h4",
      }[level];

    // Typography variants - mobile-first responsive sizing
    const variants = {
      h1: "text-xl sm:text-2xl font-semibold text-foreground leading-tight tracking-tight",
      h2: "text-lg sm:text-xl font-semibold text-foreground leading-tight tracking-tight",
      h3: "text-base sm:text-lg font-medium text-foreground leading-snug tracking-tight",
      h4: "text-base font-medium text-foreground leading-snug tracking-tight",
      display:
        "text-2xl sm:text-3xl font-semibold text-foreground leading-tight tracking-tight",
      hero: "text-3xl sm:text-4xl font-bold text-foreground leading-tight tracking-tight",
    };

    const headingStyles = cn(
      variants[defaultVariant],
      // Mobile safety
      mobileSafe && [
        "max-w-full",
        "word-wrap break-word",
        "overflow-wrap break-word",
      ],
      className,
    );

    return (
      <Component className={headingStyles} ref={ref} {...props}>
        {children}
      </Component>
    );
  },
);

Heading.displayName = "Heading";

// Text component for body text
const Text = React.forwardRef(
  (
    {
      className,
      children,
      variant = "body",
      as: Component = "p",
      mobileSafe = true,
      ...props
    },
    ref,
  ) => {
    const variants = {
      body: "text-base text-foreground leading-relaxed",
      secondary: "text-base text-muted-foreground leading-relaxed",
      muted: "text-base text-muted-foreground leading-relaxed",
      small: "text-sm text-muted-foreground leading-normal",
      caption: "text-sm text-muted-foreground leading-normal",
      large: "text-lg text-foreground leading-relaxed",
      lead: "text-lg text-foreground leading-relaxed font-light",
      // Mobile-optimized variants
      "mobile-body": "text-sm sm:text-base text-foreground leading-relaxed",
      "mobile-small": "text-xs sm:text-sm text-muted-foreground leading-normal",
    };

    const textStyles = cn(
      variants[variant],
      // Mobile safety
      mobileSafe && [
        "max-w-full",
        "word-wrap break-word",
        "overflow-wrap break-word",
        "hyphens-auto",
      ],
      className,
    );

    return (
      <Component className={textStyles} ref={ref} {...props}>
        {children}
      </Component>
    );
  },
);

Text.displayName = "Text";

// Specialized components for yoga app
const PoseName = React.forwardRef(
  ({ className, children, sanskrit, ...props }, ref) => {
    return (
      <div className={cn("space-y-1", className)} ref={ref} {...props}>
        <h3 className="text-lg font-medium leading-relaxed text-foreground">
          {children}
        </h3>
        {sanskrit && (
          <p className="text-sm italic leading-normal text-muted-foreground">
            {sanskrit}
          </p>
        )}
      </div>
    );
  },
);

PoseName.displayName = "PoseName";

const Timer = React.forwardRef(
  ({ className, children, variant = "default", ...props }, ref) => {
    const variants = {
      default:
        "text-2xl sm:text-3xl font-semibold text-muted-foreground leading-none tracking-wide",
      large:
        "text-3xl sm:text-4xl font-semibold text-muted-foreground leading-none tracking-wide",
      small:
        "text-lg sm:text-xl font-medium text-muted-foreground leading-none tracking-wide",
    };

    const timerStyles = cn(
      "max-w-full font-mono tabular-nums",
      variants[variant],
      className,
    );

    return (
      <div className={timerStyles} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);

Timer.displayName = "Timer";

const Label = React.forwardRef(
  ({ className, children, required = false, ...props }, ref) => {
    return (
      <label
        className={cn(
          "text-base font-medium leading-normal text-foreground",
          "mb-2 block",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
        {required && (
          <span className="ml-1 text-state-error" aria-label="required">
            *
          </span>
        )}
      </label>
    );
  },
);

Label.displayName = "Label";

// Helper text component
const HelperText = React.forwardRef(
  ({ className, children, error = false, ...props }, ref) => {
    return (
      <p
        className={cn(
          "mt-1 text-sm leading-normal",
          error ? "text-state-error" : "text-muted-foreground",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </p>
    );
  },
);

HelperText.displayName = "HelperText";

// Quote component for inspiration
const Quote = React.forwardRef(
  ({ className, children, author, ...props }, ref) => {
    return (
      <blockquote
        className={cn(
          "border-l-4 border-primary py-2 pl-4",
          "rounded-r-lg bg-muted",
          className,
        )}
        ref={ref}
        {...props}
      >
        <p className="mb-2 text-base italic leading-relaxed text-foreground">
          "{children}"
        </p>
        {author && (
          <cite className="text-sm not-italic text-muted-foreground">— {author}</cite>
        )}
      </blockquote>
    );
  },
);

Quote.displayName = "Quote";

// Badge component for status indicators
const Badge = React.forwardRef(
  (
    { className, children, variant = "default", size = "default", ...props },
    ref,
  ) => {
    const variants = {
      default: "bg-muted text-foreground border-border",
      success: "bg-state-success/10 text-state-success border-state-success/30",
      warning: "bg-state-warning/10 text-state-warning border-state-warning/30",
      error: "bg-state-error/10 text-state-error border-state-error/30",
      secondary: "bg-muted text-muted-foreground border-border",
      gold: "bg-accent/10 text-accent border-accent/30",
    };

    const sizes = {
      sm: "px-2 py-1 text-xs",
      default: "px-3 py-1 text-sm",
      lg: "px-4 py-2 text-base",
    };

    const badgeStyles = cn(
      "inline-flex items-center rounded-full border font-medium",
      "transition-colors duration-200",
      variants[variant],
      sizes[size],
      className,
    );

    return (
      <span className={badgeStyles} ref={ref} {...props}>
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";

// Link component with consistent styling
const Link = React.forwardRef(
  (
    { className, children, variant = "default", external = false, ...props },
    ref,
  ) => {
    const variants = {
      default:
        "text-muted-foreground hover:text-muted-foreground underline underline-offset-2",
      subtle:
        "text-foreground hover:text-muted-foreground hover:underline underline-offset-2",
      button:
        "text-muted-foreground hover:text-muted-foreground font-medium no-underline hover:underline underline-offset-2",
    };

    const linkStyles = cn(
      "rounded-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      variants[variant],
      className,
    );

    const externalProps = external
      ? {
          target: "_blank",
          rel: "noopener noreferrer",
        }
      : {};

    return (
      <a className={linkStyles} ref={ref} {...externalProps} {...props}>
        {children}
        {external && <span className="sr-only"> (opens in new tab)</span>}
      </a>
    );
  },
);

Link.displayName = "Link";

export {
  Heading,
  Text,
  PoseName,
  Timer,
  Label,
  HelperText,
  Quote,
  Badge,
  Link,
};
