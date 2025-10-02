/**
 * Badge Component
 *
 * Versatile badge component for status indicators, difficulty levels, yoga styles, and more.
 * Designed with calming aesthetics and semantic color mapping.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';

const Badge = React.forwardRef(({
  className,
  variant = 'default',
  size = 'default',
  icon,
  iconPosition = 'left',
  children,
  onClick,
  ...props
}, ref) => {
  // Base styles for all badges
  const baseStyles = [
    // Layout and typography
    'inline-flex items-center justify-center gap-1.5',
    'font-medium whitespace-nowrap',
    'rounded-full',
    'border',

    // Smooth transitions
    'transition-all duration-200 ease-gentle',

    // Interactive badges
    onClick && [
      'cursor-pointer',
      'hover:scale-105',
      'active:scale-95',
      'min-h-touch min-w-touch', // Mobile-safe touch targets when clickable
    ],
  ];

  // Variant styles with semantic color mapping
  const variants = {
    // Status variants (for programs, sessions)
    'status-active': [
      'bg-sage-100 text-sage-700 border-sage-300',
      'hover:bg-sage-200',
    ],
    'status-paused': [
      'bg-amber-100 text-amber-700 border-amber-300',
      'hover:bg-amber-200',
    ],
    'status-completed': [
      'bg-green-100 text-green-700 border-green-300',
      'hover:bg-green-200',
    ],
    'status-not-started': [
      'bg-gray-100 text-gray-600 border-gray-300',
      'hover:bg-gray-200',
    ],

    // Difficulty variants
    'difficulty-beginner': [
      'bg-blue-100 text-blue-700 border-blue-300',
      'hover:bg-blue-200',
    ],
    'difficulty-intermediate': [
      'bg-purple-100 text-purple-700 border-purple-300',
      'hover:bg-purple-200',
    ],
    'difficulty-advanced': [
      'bg-red-100 text-red-700 border-red-300',
      'hover:bg-red-200',
    ],
    'difficulty-mixed': [
      'bg-gray-100 text-gray-700 border-gray-300',
      'hover:bg-gray-200',
    ],

    // Yoga style variants
    'style-iyengar': [
      'bg-sage-100 text-sage-700 border-sage-300',
      'hover:bg-sage-200',
    ],
    'style-vinyasa': [
      'bg-gold-100 text-gold-700 border-gold-300',
      'hover:bg-gold-200',
    ],
    'style-hatha': [
      'bg-cream-200 text-cream-800 border-cream-400',
      'hover:bg-cream-300',
    ],
    'style-restorative': [
      'bg-purple-100 text-purple-700 border-purple-300',
      'hover:bg-purple-200',
    ],

    // Default variant
    default: [
      'bg-sage-100 text-sage-700 border-sage-300',
      'hover:bg-sage-200',
    ],

    // Additional semantic variants
    success: [
      'bg-state-success/10 text-green-700 border-state-success/30',
      'hover:bg-state-success/20',
    ],
    warning: [
      'bg-state-warning/10 text-amber-700 border-state-warning/30',
      'hover:bg-state-warning/20',
    ],
    error: [
      'bg-state-error/10 text-red-700 border-red-300',
      'hover:bg-state-error/20',
    ],
    info: [
      'bg-state-info/10 text-blue-700 border-state-info/30',
      'hover:bg-state-info/20',
    ],
  };

  // Size variants
  const sizes = {
    sm: [
      'h-5 px-2 py-0.5',
      'text-xs',
      'gap-1',
    ],
    default: [
      'h-6 px-3 py-1',
      'text-sm',
    ],
    lg: [
      'h-8 px-4 py-1.5',
      'text-base',
      'gap-2',
    ],
  };

  const badgeStyles = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  );

  // Render content with optional icon
  const renderContent = () => {
    if (icon && iconPosition === 'left') {
      return (
        <>
          <span className="flex-shrink-0">{icon}</span>
          {children}
        </>
      );
    }

    if (icon && iconPosition === 'right') {
      return (
        <>
          {children}
          <span className="flex-shrink-0">{icon}</span>
        </>
      );
    }

    return children;
  };

  return (
    <span
      className={badgeStyles}
      ref={ref}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {renderContent()}
    </span>
  );
});

Badge.displayName = 'Badge';

Badge.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf([
    'default',
    'status-active',
    'status-paused',
    'status-completed',
    'status-not-started',
    'difficulty-beginner',
    'difficulty-intermediate',
    'difficulty-advanced',
    'difficulty-mixed',
    'style-iyengar',
    'style-vinyasa',
    'style-hatha',
    'style-restorative',
    'success',
    'warning',
    'error',
    'info',
  ]),
  size: PropTypes.oneOf(['sm', 'default', 'lg']),
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

export { Badge };
