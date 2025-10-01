/**
 * Typography Components
 *
 * Semantic typography components optimized for yoga practice.
 * Minimum 18px base size for arm's length readability.
 */

import React from 'react';
import { cn } from '../../lib/utils';

// Heading component with semantic levels
const Heading = React.forwardRef(({
  level = 1,
  className,
  children,
  as,
  variant,
  mobileSafe = true,
  ...props
}, ref) => {
  // Determine the HTML element
  const Component = as || `h${level}`;

  // Default variant based on level
  const defaultVariant = variant || {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
    5: 'h4',
    6: 'h4'
  }[level];

  // Typography variants - mobile-first responsive sizing
  const variants = {
    h1: 'text-xl sm:text-2xl font-semibold text-primary leading-tight tracking-tight',
    h2: 'text-lg sm:text-xl font-semibold text-primary leading-tight tracking-tight',
    h3: 'text-base sm:text-lg font-medium text-primary leading-snug tracking-tight',
    h4: 'text-base font-medium text-primary leading-snug tracking-tight',
    display: 'text-2xl sm:text-3xl font-semibold text-primary leading-tight tracking-tight',
    hero: 'text-3xl sm:text-4xl font-bold text-primary leading-tight tracking-tight'
  };

  const headingStyles = cn(
    variants[defaultVariant],
    // Mobile safety
    mobileSafe && [
      'max-w-full',
      'word-wrap break-word',
      'overflow-wrap break-word',
    ],
    className
  );

  return (
    <Component
      className={headingStyles}
      ref={ref}
      {...props}
    >
      {children}
    </Component>
  );
});

Heading.displayName = 'Heading';

// Text component for body text
const Text = React.forwardRef(({
  className,
  children,
  variant = 'body',
  as: Component = 'p',
  mobileSafe = true,
  ...props
}, ref) => {
  const variants = {
    body: 'text-base text-primary leading-relaxed',
    secondary: 'text-base text-secondary leading-relaxed',
    muted: 'text-base text-muted leading-relaxed',
    small: 'text-sm text-secondary leading-normal',
    caption: 'text-sm text-muted leading-normal',
    large: 'text-lg text-primary leading-relaxed',
    lead: 'text-lg text-primary leading-relaxed font-light',
    // Mobile-optimized variants
    'mobile-body': 'text-sm sm:text-base text-primary leading-relaxed',
    'mobile-small': 'text-xs sm:text-sm text-secondary leading-normal',
  };

  const textStyles = cn(
    variants[variant],
    // Mobile safety
    mobileSafe && [
      'max-w-full',
      'word-wrap break-word',
      'overflow-wrap break-word',
      'hyphens-auto',
    ],
    className
  );

  return (
    <Component
      className={textStyles}
      ref={ref}
      {...props}
    >
      {children}
    </Component>
  );
});

Text.displayName = 'Text';

// Specialized components for yoga app
const PoseName = React.forwardRef(({
  className,
  children,
  sanskrit,
  ...props
}, ref) => {
  return (
    <div className={cn('space-y-1', className)} ref={ref} {...props}>
      <h3 className="text-lg font-medium text-primary leading-relaxed">
        {children}
      </h3>
      {sanskrit && (
        <p className="text-sm text-secondary italic leading-normal">
          {sanskrit}
        </p>
      )}
    </div>
  );
});

PoseName.displayName = 'PoseName';

const Timer = React.forwardRef(({
  className,
  children,
  variant = 'default',
  ...props
}, ref) => {
  const variants = {
    default: 'text-2xl sm:text-3xl font-semibold text-sage-600 leading-none tracking-wide',
    large: 'text-3xl sm:text-4xl font-semibold text-sage-600 leading-none tracking-wide',
    small: 'text-lg sm:text-xl font-medium text-sage-600 leading-none tracking-wide'
  };

  const timerStyles = cn(
    'font-mono tabular-nums max-w-full',
    variants[variant],
    className
  );

  return (
    <div
      className={timerStyles}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Timer.displayName = 'Timer';

const Label = React.forwardRef(({
  className,
  children,
  required = false,
  ...props
}, ref) => {
  return (
    <label
      className={cn(
        'text-base font-medium text-primary leading-normal',
        'block mb-2',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
      {required && (
        <span className="text-state-error ml-1" aria-label="required">
          *
        </span>
      )}
    </label>
  );
});

Label.displayName = 'Label';

// Helper text component
const HelperText = React.forwardRef(({
  className,
  children,
  error = false,
  ...props
}, ref) => {
  return (
    <p
      className={cn(
        'text-sm leading-normal mt-1',
        error ? 'text-state-error' : 'text-muted',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </p>
  );
});

HelperText.displayName = 'HelperText';

// Quote component for inspiration
const Quote = React.forwardRef(({
  className,
  children,
  author,
  ...props
}, ref) => {
  return (
    <blockquote
      className={cn(
        'border-l-4 border-sage-300 pl-4 py-2',
        'bg-sage-50 rounded-r-lg',
        className
      )}
      ref={ref}
      {...props}
    >
      <p className="text-base text-primary italic leading-relaxed mb-2">
        "{children}"
      </p>
      {author && (
        <cite className="text-sm text-secondary not-italic">
          — {author}
        </cite>
      )}
    </blockquote>
  );
});

Quote.displayName = 'Quote';

// Badge component for status indicators
const Badge = React.forwardRef(({
  className,
  children,
  variant = 'default',
  size = 'default',
  ...props
}, ref) => {
  const variants = {
    default: 'bg-sage-100 text-sage-800 border-sage-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    secondary: 'bg-gray-100 text-gray-800 border-gray-200',
    gold: 'bg-gold-100 text-gold-800 border-gold-200'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    default: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const badgeStyles = cn(
    'inline-flex items-center font-medium rounded-full border',
    'transition-colors duration-200',
    variants[variant],
    sizes[size],
    className
  );

  return (
    <span
      className={badgeStyles}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

// Link component with consistent styling
const Link = React.forwardRef(({
  className,
  children,
  variant = 'default',
  external = false,
  ...props
}, ref) => {
  const variants = {
    default: 'text-sage-600 hover:text-sage-700 underline underline-offset-2',
    subtle: 'text-primary hover:text-sage-600 hover:underline underline-offset-2',
    button: 'text-sage-600 hover:text-sage-700 font-medium no-underline hover:underline underline-offset-2'
  };

  const linkStyles = cn(
    'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 rounded-sm',
    variants[variant],
    className
  );

  const externalProps = external ? {
    target: '_blank',
    rel: 'noopener noreferrer'
  } : {};

  return (
    <a
      className={linkStyles}
      ref={ref}
      {...externalProps}
      {...props}
    >
      {children}
      {external && (
        <span className="sr-only"> (opens in new tab)</span>
      )}
    </a>
  );
});

Link.displayName = 'Link';

export {
  Heading,
  Text,
  PoseName,
  Timer,
  Label,
  HelperText,
  Quote,
  Badge,
  Link
};