/**
 * LinearMeter Component - Linear/Notion Inspired
 *
 * Horizontal progress bar with tick marks for a graph-like appearance.
 * Replaces circular progress rings.
 */

import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

const LinearMeter = React.memo(
  ({
    value = 0,
    max = 100,
    ticks = 5,
    label,
    showValue = true,
    size = "default",
    color = "accent",
    className,
    ...props
  }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    // Size variants
    const sizes = {
      sm: { height: "h-1.5", text: "text-xs" },
      default: { height: "h-2", text: "text-sm" },
      lg: { height: "h-3", text: "text-base" },
    };

    // Color variants
    const colors = {
      accent: "bg-accent",
      success: "bg-state-success",
      warning: "bg-state-warning",
      error: "bg-state-error",
    };

    const { height, text } = sizes[size];
    const barColor = colors[color];

    // Generate tick positions
    const tickPositions = Array.from(
      { length: ticks + 1 },
      (_, i) => (i / ticks) * 100,
    );

    return (
      <div className={cx("flex flex-col gap-1.5", className)} {...props}>
        {/* Label row */}
        {(label || showValue) && (
          <div className="flex items-center justify-between">
            {label && <span className="micro-label">{label}</span>}
            {showValue && (
              <span
                className={cx("font-mono font-medium text-foreground", text)}
              >
                {value}/{max}
              </span>
            )}
          </div>
        )}

        {/* Meter container */}
        <div className="relative">
          {/* Background track */}
          <div
            className={cx(
              "w-full overflow-hidden rounded-full bg-border",
              height,
            )}
          >
            {/* Fill bar */}
            <div
              className={cx(
                "h-full rounded-full transition-all duration-300 ease-out",
                barColor,
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Tick marks */}
          <div className="pointer-events-none absolute inset-0 flex justify-between">
            {tickPositions.map((pos, i) => (
              <div
                key={i}
                className={cx(
                  "w-px bg-background/60",
                  height,
                  i === 0 && "rounded-l-full",
                  i === ticks && "rounded-r-full",
                )}
                style={{ marginLeft: i === 0 ? 0 : -0.5 }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  },
);

LinearMeter.displayName = "LinearMeter";

LinearMeter.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  ticks: PropTypes.number,
  label: PropTypes.string,
  showValue: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "default", "lg"]),
  color: PropTypes.oneOf(["accent", "success", "warning", "error"]),
  className: PropTypes.string,
};

export { LinearMeter };
