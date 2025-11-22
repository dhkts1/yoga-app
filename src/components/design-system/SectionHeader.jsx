/**
 * SectionHeader Component - Linear/Notion Inspired
 *
 * Mono-styled section headers with "/" prefix.
 * Used for organizing content sections.
 */

import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

const SectionHeader = React.memo(
  ({ title, icon, action, showDivider = true, className, ...props }) => {
    return (
      <div className={cx("flex flex-col gap-2", className)} {...props}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && (
              <span className="size-4 text-muted-foreground">{icon}</span>
            )}
            <span className="section-header">/ {title}</span>
          </div>
          {action && <div>{action}</div>}
        </div>
        {showDivider && <div className="divider" />}
      </div>
    );
  },
);

SectionHeader.displayName = "SectionHeader";

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  action: PropTypes.node,
  showDivider: PropTypes.bool,
  className: PropTypes.string,
};

export { SectionHeader };
