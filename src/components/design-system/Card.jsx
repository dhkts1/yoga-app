/**
 * Card Component
 *
 * Flexible card component for yoga poses, sessions, and content.
 * Designed with calming aesthetics and smooth interactions.
 */

import React from 'react';
import { cn } from '../../lib/utils';

const Card = React.forwardRef(({
  className,
  variant = 'default',
  padding = 'default',
  interactive = false,
  hover = false,
  mobileSafe = true,
  children,
  ...props
}, ref) => {
  const baseStyles = [
    // Basic card structure
    'bg-card',
    'relative overflow-hidden',

    // Smooth transitions for all interactive states
    'transition-all duration-300 ease-gentle',

    // Mobile safety
    mobileSafe && [
      'w-full', // Ensure cards don't exceed container width
      'box-border', // Include padding/border in width calculation
      'min-w-0', // Allow flex children to shrink
      'max-w-full', // Prevent overflow
    ],
  ];

  // Variant styles
  const variants = {
    default: [
      'border border-border-light',
      'rounded-xl',
      'shadow-sm',
    ],

    elevated: [
      'rounded-xl',
      'shadow-md',
      'border-0',
    ],

    outlined: [
      'border-2 border-border',
      'rounded-xl',
      'shadow-none',
    ],

    glass: [
      'bg-background-glass backdrop-blur-sm',
      'border border-border-light',
      'rounded-xl',
      'shadow-lg',
    ],

    sage: [
      'bg-muted border border-border',
      'rounded-xl',
      'shadow-sm',
    ],

    cream: [
      'bg-muted border border-border',
      'rounded-xl',
      'shadow-sm',
    ]
  };

  // Padding variants - mobile-first approach
  const paddings = {
    none: 'p-0',
    xs: 'p-2',
    sm: 'p-3 sm:p-4',
    default: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
    xl: 'p-8 sm:p-10',
    mobile: 'p-4', // Consistent mobile padding
  };

  // Interactive states
  const interactiveStyles = interactive ? [
    'cursor-pointer',
    'hover:shadow-lg hover:scale-[1.02]',
    'active:scale-[0.98]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  ] : [];

  // Hover-only styles (for cards that aren't clickable but should respond to hover)
  const hoverStyles = hover && !interactive ? [
    'hover:shadow-md hover:scale-[1.01]',
  ] : [];

  const cardStyles = cn(
    baseStyles,
    variants[variant],
    paddings[padding],
    interactiveStyles,
    hoverStyles,
    className
  );

  return (
    <div
      className={cardStyles}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Card sub-components for common patterns
const CardHeader = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 pb-4', className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({
  className,
  children,
  as: Component = 'h3',
  ...props
}, ref) => {
  return (
    <Component
      className={cn(
        'text-xl font-medium leading-8 text-primary',
        'tracking-tight',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </Component>
  );
});

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <p
      className={cn(
        'text-base text-secondary leading-6',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      className={cn('pt-0', className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      className={cn('flex items-center pt-4', className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
};