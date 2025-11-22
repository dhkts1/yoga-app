/**
 * Panel Component - Linear/Notion Inspired
 *
 * Flat card with thin border and optional header.
 * Replaces heavy glass/glow card variants.
 */

import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

const Panel = React.memo(
  ({
    children,
    header,
    headerIcon,
    className,
    contentClassName,
    collapsible = false,
    defaultCollapsed = false,
    noPadding = false,
    hoverable = false,
    ...props
  }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

    return (
      <div
        className={cx(
          // Base panel styles
          "rounded-lg border border-border bg-surface",
          // Hover effect
          hoverable && "panel-hover cursor-pointer",
          className,
        )}
        {...props}
      >
        {/* Header */}
        {header && (
          <div
            className={cx(
              "flex items-center justify-between gap-2",
              "px-4 py-3",
              "border-b border-border",
              collapsible && "cursor-pointer select-none",
            )}
            onClick={
              collapsible ? () => setIsCollapsed(!isCollapsed) : undefined
            }
          >
            <div className="flex items-center gap-2">
              {headerIcon && (
                <span className="text-muted-foreground">{headerIcon}</span>
              )}
              <span className="section-header">{header}</span>
            </div>
            {collapsible && (
              <svg
                className={cx(
                  "h-4 w-4 text-muted-foreground transition-transform duration-150",
                  isCollapsed && "-rotate-90",
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </div>
        )}

        {/* Content */}
        {(!collapsible || !isCollapsed) && (
          <div className={cx(!noPadding && "p-4", contentClassName)}>
            {children}
          </div>
        )}
      </div>
    );
  },
);

Panel.displayName = "Panel";

Panel.propTypes = {
  children: PropTypes.node,
  header: PropTypes.string,
  headerIcon: PropTypes.node,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  collapsible: PropTypes.bool,
  defaultCollapsed: PropTypes.bool,
  noPadding: PropTypes.bool,
  hoverable: PropTypes.bool,
};

/**
 * PanelGroup - Container for multiple panels
 */
const PanelGroup = React.memo(({ children, className, ...props }) => (
  <div className={cx("space-y-3", className)} {...props}>
    {children}
  </div>
));

PanelGroup.displayName = "PanelGroup";

PanelGroup.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export { Panel, PanelGroup };
