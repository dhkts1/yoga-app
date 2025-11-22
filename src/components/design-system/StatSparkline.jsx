/**
 * StatSparkline Component - Linear/Notion Inspired
 *
 * Combines a stat value with an inline sparkline.
 * Shows label, value, delta trend, and mini chart.
 */

import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { Sparkline } from "./Sparkline";

const StatSparkline = React.memo(
  ({
    label,
    value,
    delta,
    deltaLabel,
    data = [],
    sparklineColor,
    layout = "horizontal",
    className,
    ...props
  }) => {
    // Determine delta direction
    const deltaDirection = delta > 0 ? "up" : delta < 0 ? "down" : "neutral";
    const deltaColor = {
      up: "text-state-success",
      down: "text-state-error",
      neutral: "text-muted-foreground",
    }[deltaDirection];

    const deltaIcon = {
      up: "▲",
      down: "▼",
      neutral: "—",
    }[deltaDirection];

    // Default sparkline color based on delta
    const effectiveColor =
      sparklineColor ||
      (deltaDirection === "up"
        ? "hsl(var(--state-success))"
        : deltaDirection === "down"
          ? "hsl(var(--state-error))"
          : "hsl(var(--accent))");

    if (layout === "stacked") {
      return (
        <div className={cx("flex flex-col gap-2", className)} {...props}>
          {/* Label */}
          <span className="micro-label">{label}</span>

          {/* Value and Delta row */}
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold text-foreground">
              {value}
            </span>
            {delta !== undefined && (
              <span className={cx("font-mono text-xs", deltaColor)}>
                {deltaIcon} {Math.abs(delta)}
                {deltaLabel && (
                  <span className="ml-1 text-muted-foreground">
                    {deltaLabel}
                  </span>
                )}
              </span>
            )}
          </div>

          {/* Sparkline */}
          {data.length > 0 && (
            <Sparkline
              data={data}
              width={120}
              height={32}
              color={effectiveColor}
              showArea
            />
          )}
        </div>
      );
    }

    // Horizontal layout (default)
    return (
      <div
        className={cx("flex items-center justify-between gap-4", className)}
        {...props}
      >
        {/* Left side: Label and Value */}
        <div className="flex flex-col gap-0.5">
          <span className="micro-label">{label}</span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-semibold text-foreground">
              {value}
            </span>
            {delta !== undefined && (
              <span className={cx("font-mono text-xs", deltaColor)}>
                {deltaIcon} {Math.abs(delta)}
              </span>
            )}
          </div>
        </div>

        {/* Right side: Sparkline */}
        {data.length > 0 && (
          <Sparkline
            data={data}
            width={80}
            height={28}
            color={effectiveColor}
            showArea
          />
        )}
      </div>
    );
  },
);

StatSparkline.displayName = "StatSparkline";

StatSparkline.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  delta: PropTypes.number,
  deltaLabel: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.number),
  sparklineColor: PropTypes.string,
  layout: PropTypes.oneOf(["horizontal", "stacked"]),
  className: PropTypes.string,
};

export { StatSparkline };
