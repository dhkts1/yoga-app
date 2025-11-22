/**
 * ContentBody Component
 *
 * Unified content wrapper for all screens with consistent:
 * - Max-width and horizontal centering
 * - Responsive padding
 * - Optional vertical centering (for sparse content)
 * - Child element spacing
 *
 * Replaces duplicated wrapper patterns across the app.
 */

import React from "react";
import cx from "classnames";

const ContentBody = React.forwardRef(
  (
    {
      className,
      children,
      size = "md",
      padding = "md",
      centered = false,
      spacing = "none",
      ...props
    },
    ref,
  ) => {
    // Size configurations (max-width)
    const sizes = {
      sm: "max-w-sm", // 384px - sparse content (Welcome, Practice)
      md: "max-w-2xl", // 672px - moderate content (SessionDetail)
      lg: "max-w-4xl", // 896px - dense content (Insights)
      full: "max-w-full", // no max width
    };

    // Padding configurations (mobile-first)
    const paddings = {
      none: "",
      sm: "px-4 py-4",
      md: "px-4 py-6",
      lg: "px-6 py-8",
    };

    // Spacing between children (vertical)
    const spacings = {
      none: "",
      sm: "space-y-3",
      md: "space-y-4",
      lg: "space-y-6",
      xl: "space-y-8",
    };

    const bodyStyles = cx(
      // Base styles
      "w-full",
      sizes[size],
      "mx-auto",
      paddings[padding],

      // Vertical centering for sparse content
      centered && "flex h-full flex-col items-center justify-center",

      // Child spacing
      spacings[spacing],

      // Mobile safety
      "overflow-x-hidden",
      "box-border",

      className,
    );

    return (
      <div className={bodyStyles} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);

ContentBody.displayName = "ContentBody";

export default ContentBody;
