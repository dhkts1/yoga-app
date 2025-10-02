/**
 * Tab Component
 *
 * Accessible tab navigation component with multiple visual variants.
 * Supports horizontal scrolling on mobile and smooth transitions.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Tab = React.forwardRef(({
  className,
  tabs = [],
  activeTab,
  onTabChange,
  variant = 'pills',
  fullWidth = false,
  scrollable = true,
  ...props
}, ref) => {
  // Base container styles
  const containerStyles = [
    'flex items-center',
    scrollable && [
      'overflow-x-auto overflow-y-hidden',
      'scrollbar-hide', // Utility class to hide scrollbar
      '-mx-1 px-1', // Negative margin for edge alignment
    ],
    !scrollable && fullWidth && 'w-full',
  ];

  // Variant styles for tab list
  const variantStyles = {
    pills: [
      'gap-2',
      'bg-muted rounded-lg p-1',
      fullWidth && 'w-full',
    ],
    underline: [
      'gap-6',
      'border-b border-border-light',
      fullWidth && 'w-full justify-around',
    ],
    buttons: [
      'gap-3',
      fullWidth && 'w-full',
    ],
  };

  // Individual tab styles
  const getTabStyles = (tab, isActive) => {
    const baseTabStyles = [
      'relative',
      'px-4 py-2',
      'font-medium text-base',
      'transition-all duration-200 ease-gentle',
      'cursor-pointer select-none',
      'whitespace-nowrap',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      fullWidth && 'flex-1 text-center',
    ];

    if (variant === 'pills') {
      return cn(
        baseTabStyles,
        'rounded-md',
        isActive
          ? 'bg-card text-muted-foreground shadow-sm'
          : 'text-text-secondary hover:text-muted-foreground hover:bg-card/50'
      );
    }

    if (variant === 'underline') {
      return cn(
        baseTabStyles,
        'pb-3 border-b-2',
        isActive
          ? 'text-foreground border-primary'
          : 'text-muted-foreground border-transparent hover:text-foreground hover:border-primary'
      );
    }

    if (variant === 'buttons') {
      return cn(
        baseTabStyles,
        'rounded-lg border-2',
        isActive
          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
          : 'bg-transparent text-muted-foreground border-border hover:bg-muted hover:border-primary'
      );
    }

    return cn(baseTabStyles);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e, tabValue) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTabChange(tabValue);
    }
  };

  return (
    <div
      className={cn(containerStyles, className)}
      ref={ref}
      role="tablist"
      {...props}
    >
      <div className={cn('flex items-center', variantStyles[variant])}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          const tabLabel = typeof tab === 'string' ? tab : tab.label;
          const tabValue = typeof tab === 'string' ? tab : tab.value;
          const tabIcon = typeof tab === 'object' ? tab.icon : null;
          const tabCount = typeof tab === 'object' ? tab.count : null;

          return (
            <button
              key={tabValue}
              className={getTabStyles(tab, isActive)}
              onClick={() => onTabChange(tabValue)}
              onKeyDown={(e) => handleKeyDown(e, tabValue)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tabValue}`}
              id={`tab-${tabValue}`}
              tabIndex={isActive ? 0 : -1}
              type="button"
            >
              <div className="flex items-center justify-center gap-2">
                {tabIcon && (
                  <span className="flex-shrink-0">{tabIcon}</span>
                )}
                <span>{tabLabel}</span>
                {tabCount !== null && tabCount !== undefined && (
                  <span
                    className={cn(
                      'ml-1 px-2 py-0.5 rounded-full text-xs font-medium',
                      isActive
                        ? variant === 'buttons'
                          ? 'bg-card/20 text-white'
                          : 'bg-muted text-muted-foreground'
                        : 'bg-muted text-text-muted'
                    )}
                  >
                    {tabCount}
                  </span>
                )}
              </div>

              {/* Animated indicator for pills variant */}
              {variant === 'pills' && isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-card rounded-md shadow-sm -z-10"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});

Tab.displayName = 'Tab';

Tab.propTypes = {
  className: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        icon: PropTypes.node,
        count: PropTypes.number,
      }),
    ])
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['pills', 'underline', 'buttons']),
  fullWidth: PropTypes.bool,
  scrollable: PropTypes.bool,
};

// TabPanel component for accessibility
const TabPanel = React.forwardRef(({
  className,
  value,
  activeTab,
  children,
  animate = true,
  ...props
}, ref) => {
  const isActive = activeTab === value;

  if (!isActive) return null;

  const panelVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const Component = animate ? motion.div : 'div';
  const motionProps = animate
    ? {
        variants: panelVariants,
        initial: 'hidden',
        animate: 'visible',
      }
    : {};

  return (
    <Component
      className={cn('focus-visible:outline-none', className)}
      ref={ref}
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      tabIndex={0}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
});

TabPanel.displayName = 'TabPanel';

TabPanel.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  animate: PropTypes.bool,
};

export { Tab, TabPanel };
