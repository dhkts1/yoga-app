/**
 * Stat Component
 *
 * Analytics and statistics display component for insights dashboard.
 * Shows metrics with optional trend indicators and icons.
 * Enhanced with Linear-futuristic animated counters and glow effects.
 */

import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "./Card";
import { Heading, Text } from "./Typography";
import { cn } from "../../lib/utils";

const Stat = React.forwardRef(
  (
    {
      className,
      variant = "default",
      value,
      label,
      icon,
      trend,
      trendValue,
      description,
      animate = true,
      ...props
    },
    ref,
  ) => {
    // Variant styles - enhanced with Linear-futuristic options
    const variants = {
      default: {
        card: "",
        cardVariant: "default",
        valueColor: "text-foreground",
        labelColor: "text-muted-foreground",
      },
      highlight: {
        card: "",
        cardVariant: "sage",
        valueColor: "text-foreground",
        labelColor: "text-muted-foreground",
      },
      compact: {
        card: "",
        cardVariant: "default",
        valueColor: "text-foreground",
        labelColor: "text-muted-foreground",
      },
      // ═══ LINEAR-FUTURISTIC VARIANTS ═══
      glow: {
        card: "shadow-card-glow hover:shadow-card-glow-hover",
        cardVariant: "elevated-glow",
        valueColor: "text-primary",
        labelColor: "text-muted-foreground",
      },
      glass: {
        card: "",
        cardVariant: "glass-glow",
        valueColor: "text-foreground",
        labelColor: "text-muted-foreground",
      },
      neon: {
        card: "shadow-glow-sm",
        cardVariant: "neon",
        valueColor: "text-primary",
        labelColor: "text-muted-foreground",
      },
    };

    const variantConfig = variants[variant] || variants.default;

    // Trend icon mapping
    const trendIcons = {
      up: <TrendingUp className="size-4 text-state-success" />,
      down: <TrendingDown className="size-4 text-state-error" />,
      neutral: <Minus className="size-4 text-muted-foreground" />,
    };

    // Trend text color
    const trendColors = {
      up: "text-state-success",
      down: "text-state-error",
      neutral: "text-muted-foreground",
    };

    // Animation variants
    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    };

    const valueVariants = {
      hidden: { scale: 0.8, opacity: 0 },
      visible: {
        scale: 1,
        opacity: 1,
        transition: {
          delay: 0.1,
          duration: 0.5,
          ease: [0.23, 1, 0.32, 1],
        },
      },
    };

    const Component = animate ? motion.div : "div";
    const motionProps = animate
      ? {
          variants: containerVariants,
          initial: "hidden",
          animate: "visible",
        }
      : {};

    // Compact variant uses minimal vertical layout for 2x2 grids
    if (variant === "compact") {
      return (
        <Component {...motionProps} ref={ref}>
          <Card className={cn("flex flex-col p-2.5", className)} {...props}>
            {/* Value row: icon + number + trend */}
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {icon && (
                  <div className="flex size-7 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
                    <div className="scale-75">{icon}</div>
                  </div>
                )}
                <motion.div
                  variants={animate ? valueVariants : undefined}
                  className="text-xl font-bold leading-none"
                >
                  {value}
                </motion.div>
              </div>
              {trend && (
                <div className={cn("shrink-0", trendColors[trend])}>
                  <div className="scale-75">{trendIcons[trend]}</div>
                </div>
              )}
            </div>

            {/* Label and description */}
            <div className="flex flex-col">
              <Text
                variant="muted"
                className="text-xs leading-tight text-muted-foreground"
              >
                {label}
              </Text>
              {description && (
                <Text
                  variant="muted"
                  className="mt-1 text-xs leading-tight text-muted-foreground"
                >
                  {description}
                </Text>
              )}
            </div>
          </Card>
        </Component>
      );
    }

    // Default and highlight variants use vertical card layout
    return (
      <Component {...motionProps} ref={ref}>
        <Card className={cn("flex flex-col p-4 sm:p-6", className)} {...props}>
          {/* Header with icon and trend */}
          <div className="mb-2 flex items-start justify-between">
            {icon && (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                {icon}
              </div>
            )}
            {trend && (
              <div
                className={cn("flex items-center gap-1", trendColors[trend])}
              >
                {trendIcons[trend]}
                {trendValue && (
                  <span className="text-sm font-medium">{trendValue}</span>
                )}
              </div>
            )}
          </div>

          {/* Main value */}
          <motion.div
            variants={animate ? valueVariants : undefined}
            className="flex flex-col"
          >
            <Heading level={2} className={cn("mb-1", variantConfig.valueColor)}>
              {value}
            </Heading>

            {/* Label */}
            <Text
              variant="muted"
              size="base"
              className={variantConfig.labelColor}
            >
              {label}
            </Text>

            {/* Optional description */}
            {description && (
              <Text
                variant="muted"
                size="sm"
                className="mt-2 text-muted-foreground"
              >
                {description}
              </Text>
            )}
          </motion.div>
        </Card>
      </Component>
    );
  },
);

Stat.displayName = "Stat";

Stat.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf([
    "default",
    "highlight",
    "compact",
    // Linear-futuristic variants
    "glow",
    "glass",
    "neon",
  ]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  trend: PropTypes.oneOf(["up", "down", "neutral"]),
  trendValue: PropTypes.string,
  description: PropTypes.string,
  animate: PropTypes.bool,
};

// Stat Grid wrapper for common layout pattern
const StatGrid = React.forwardRef(
  ({ className, columns = 2, gap = "default", children, ...props }, ref) => {
    const gaps = {
      sm: "gap-3",
      default: "gap-4",
      lg: "gap-6",
    };

    const gridCols = {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    };

    return (
      <div
        className={cn(
          "grid",
          gridCols[columns] || gridCols[2],
          gaps[gap] || gaps.default,
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  },
);

StatGrid.displayName = "StatGrid";

StatGrid.propTypes = {
  className: PropTypes.string,
  columns: PropTypes.oneOf([1, 2, 3, 4]),
  gap: PropTypes.oneOf(["sm", "default", "lg"]),
  children: PropTypes.node.isRequired,
};

export { Stat, StatGrid };
