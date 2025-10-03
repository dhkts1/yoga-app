/**
 * ScrollableTabContent Component
 *
 * Reusable wrapper for tab content that needs scrolling.
 * Handles all flex/overflow complexity internally to prevent layout bugs.
 *
 * Features:
 * - Proper scroll behavior with no gaps
 * - Optional action button at top
 * - Optional empty state
 * - Bottom padding for mobile navigation
 * - Works with both shadcn Tabs and design system Tab
 */

import React from "react";
import PropTypes from "prop-types";
import { cn } from "../../lib/utils";
import { Card } from "./Card";

const ScrollableTabContent = ({
  children,
  actionButton = null,
  emptyState = null,
  padding = "sm",
  className,
  ...props
}) => {
  // Padding variants for content
  const paddingVariants = {
    none: "",
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-5",
    lg: "p-5 sm:p-6",
  };

  // Show empty state if provided and no meaningful content
  // Check if children is actually empty (null, undefined, false, or empty array content)
  const hasContent = (() => {
    if (!children) return false;
    const count = React.Children.count(children);
    if (count === 0) return false;

    // If it's a single child that's a div with no children, treat as empty
    if (count === 1) {
      const child = React.Children.only(children);
      if (React.isValidElement(child) && child.props.children) {
        const grandchildCount = React.Children.count(child.props.children);
        return grandchildCount > 0;
      }
    }

    return count > 0;
  })();

  const showEmpty = emptyState && !hasContent;

  return (
    <div className={cn("space-y-3", className)} {...props}>
      {/* Optional action button */}
      {actionButton && actionButton}

      {/* Scrollable content card */}
      <Card
        padding="none"
        className={cn(
          "max-h-[60vh] overflow-y-auto",
          showEmpty && "flex min-h-[300px] items-center justify-center",
        )}
      >
        {showEmpty ? (
          // Empty state - centered
          <div className="p-4">{emptyState}</div>
        ) : (
          // Content with padding and bottom spacing for mobile nav
          <div className={cn(paddingVariants[padding], "pb-6")}>{children}</div>
        )}
      </Card>
    </div>
  );
};

ScrollableTabContent.propTypes = {
  children: PropTypes.node,
  actionButton: PropTypes.node,
  emptyState: PropTypes.node,
  padding: PropTypes.oneOf(["none", "sm", "md", "lg"]),
  className: PropTypes.string,
};

export { ScrollableTabContent };
