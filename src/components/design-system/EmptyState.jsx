/**
 * EmptyState Component
 *
 * Calming empty state component for when there's no data to display.
 * Encourages users with gentle messaging and optional action buttons.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { Heading, Text } from './Typography';
import { cn } from '../../lib/utils';

const EmptyState = React.forwardRef(({
  className,
  icon,
  illustration,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
  size = 'default',
  animate = true,
  ...props
}, ref) => {
  // Size variants
  const sizes = {
    sm: {
      container: 'py-8 px-4',
      iconSize: 'w-12 h-12',
      illustrationSize: 'w-32 h-32',
      titleLevel: 4,
      spacing: 'space-y-3',
    },
    default: {
      container: 'py-12 px-6',
      iconSize: 'w-16 h-16',
      illustrationSize: 'w-48 h-48',
      titleLevel: 3,
      spacing: 'space-y-4',
    },
    lg: {
      container: 'py-16 px-8',
      iconSize: 'w-20 h-20',
      illustrationSize: 'w-64 h-64',
      titleLevel: 2,
      spacing: 'space-y-6',
    },
  };

  const sizeConfig = sizes[size] || sizes.default;

  // Variant styles
  const variants = {
    default: 'text-text-secondary',
    sage: 'text-muted-foreground',
    muted: 'text-text-muted',
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
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

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  };

  const Component = animate ? motion.div : 'div';
  const MotionDiv = animate ? motion.div : 'div';
  const motionProps = animate
    ? {
        variants: containerVariants,
        initial: 'hidden',
        animate: 'visible',
      }
    : {};

  return (
    <Component
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizeConfig.container,
        variants[variant],
        className
      )}
      ref={ref}
      {...motionProps}
      {...props}
    >
      <div className={cn('flex flex-col items-center', sizeConfig.spacing)}>
        {/* Icon or Illustration */}
        {(icon || illustration) && (
          <MotionDiv
            variants={animate ? iconVariants : undefined}
            className="flex-shrink-0"
          >
            {illustration ? (
              <div className={cn(sizeConfig.illustrationSize, 'relative')}>
                {illustration}
              </div>
            ) : (
              <div
                className={cn(
                  sizeConfig.iconSize,
                  'rounded-full bg-muted flex items-center justify-center text-muted-foreground'
                )}
              >
                {icon}
              </div>
            )}
          </MotionDiv>
        )}

        {/* Title */}
        {title && (
          <MotionDiv variants={animate ? itemVariants : undefined}>
            <Heading
              level={sizeConfig.titleLevel}
              className="text-text-primary"
            >
              {title}
            </Heading>
          </MotionDiv>
        )}

        {/* Description */}
        {description && (
          <MotionDiv
            variants={animate ? itemVariants : undefined}
            className="max-w-md"
          >
            <Text
              variant="muted"
              size={size === 'sm' ? 'sm' : 'base'}
              className="leading-relaxed"
            >
              {description}
            </Text>
          </MotionDiv>
        )}

        {/* Actions */}
        {(action || secondaryAction) && (
          <MotionDiv
            variants={animate ? itemVariants : undefined}
            className="flex flex-col sm:flex-row items-center gap-3 mt-2"
          >
            {action && (
              <Button
                variant={action.variant || 'primary'}
                size={action.size || 'default'}
                onClick={action.onClick}
                icon={action.icon}
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant={secondaryAction.variant || 'ghost'}
                size={secondaryAction.size || 'default'}
                onClick={secondaryAction.onClick}
                icon={secondaryAction.icon}
              >
                {secondaryAction.label}
              </Button>
            )}
          </MotionDiv>
        )}
      </div>
    </Component>
  );
});

EmptyState.displayName = 'EmptyState';

EmptyState.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node,
  illustration: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.string,
    size: PropTypes.string,
    icon: PropTypes.node,
  }),
  secondaryAction: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.string,
    size: PropTypes.string,
    icon: PropTypes.node,
  }),
  variant: PropTypes.oneOf(['default', 'sage', 'muted']),
  size: PropTypes.oneOf(['sm', 'default', 'lg']),
  animate: PropTypes.bool,
};

export { EmptyState };
