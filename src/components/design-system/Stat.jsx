/**
 * Stat Component
 *
 * Analytics and statistics display component for insights dashboard.
 * Shows metrics with optional trend indicators and icons.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from './Card';
import { Heading, Text } from './Typography';
import { cn } from '../../lib/utils';

const Stat = React.forwardRef(({
  className,
  variant = 'default',
  value,
  label,
  icon,
  trend,
  trendValue,
  description,
  animate = true,
  ...props
}, ref) => {
  // Variant styles
  const variants = {
    default: {
      card: 'variant-default',
      valueColor: 'text-primary',
      labelColor: 'text-secondary',
    },
    highlight: {
      card: 'variant-sage',
      valueColor: 'text-sage-700',
      labelColor: 'text-sage-600',
    },
    compact: {
      card: 'variant-default padding-sm',
      valueColor: 'text-primary',
      labelColor: 'text-secondary',
    },
  };

  const variantConfig = variants[variant] || variants.default;

  // Trend icon mapping
  const trendIcons = {
    up: <TrendingUp className="w-4 h-4 text-state-success" />,
    down: <TrendingDown className="w-4 h-4 text-state-error" />,
    neutral: <Minus className="w-4 h-4 text-text-muted" />,
  };

  // Trend text color
  const trendColors = {
    up: 'text-state-success',
    down: 'text-state-error',
    neutral: 'text-text-muted',
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

  const Component = animate ? motion.div : 'div';
  const motionProps = animate
    ? {
        variants: containerVariants,
        initial: 'hidden',
        animate: 'visible',
      }
    : {};

  return (
    <Component {...motionProps} ref={ref}>
      <Card
        className={cn(
          'flex flex-col',
          variant === 'compact' ? 'p-3 sm:p-4' : 'p-4 sm:p-6',
          className
        )}
        {...props}
      >
        {/* Header with icon and trend */}
        <div className="flex items-start justify-between mb-2">
          {icon && (
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-sage-100 flex items-center justify-center text-sage-600">
              {icon}
            </div>
          )}
          {trend && (
            <div className={cn('flex items-center gap-1', trendColors[trend])}>
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
          <Heading
            level={variant === 'compact' ? 3 : 2}
            className={cn('mb-1', variantConfig.valueColor)}
          >
            {value}
          </Heading>

          {/* Label */}
          <Text
            variant="muted"
            size={variant === 'compact' ? 'sm' : 'base'}
            className={variantConfig.labelColor}
          >
            {label}
          </Text>

          {/* Optional description */}
          {description && (
            <Text
              variant="muted"
              size="sm"
              className="mt-2 text-text-muted"
            >
              {description}
            </Text>
          )}
        </motion.div>
      </Card>
    </Component>
  );
});

Stat.displayName = 'Stat';

Stat.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'highlight', 'compact']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  trend: PropTypes.oneOf(['up', 'down', 'neutral']),
  trendValue: PropTypes.string,
  description: PropTypes.string,
  animate: PropTypes.bool,
};

// Stat Grid wrapper for common layout pattern
const StatGrid = React.forwardRef(({
  className,
  columns = 2,
  gap = 'default',
  children,
  ...props
}, ref) => {
  const gaps = {
    sm: 'gap-3',
    default: 'gap-4',
    lg: 'gap-6',
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div
      className={cn(
        'grid',
        gridCols[columns] || gridCols[2],
        gaps[gap] || gaps.default,
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

StatGrid.displayName = 'StatGrid';

StatGrid.propTypes = {
  className: PropTypes.string,
  columns: PropTypes.oneOf([1, 2, 3, 4]),
  gap: PropTypes.oneOf(['sm', 'default', 'lg']),
  children: PropTypes.node.isRequired,
};

export { Stat, StatGrid };
