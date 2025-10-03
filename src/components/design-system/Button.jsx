/**
 * Button Component
 *
 * Calming, accessible button component for the yoga app.
 * Follows "Breathe First, Features Later" philosophy with gentle interactions.
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { haptics } from '../../utils/haptics';

const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'default',
  children,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  asChild = false,
  fullWidth = false,
  mobileSafe = true,
  ...props
}, ref) => {
  // Check for prefers-reduced-motion
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setShouldReduceMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  // Base styles for all buttons
  const baseStyles = [
    // Layout and typography
    'inline-flex items-center justify-center gap-2',
    'font-medium text-base leading-6',
    'relative overflow-hidden',

    // Accessibility
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',

    // Smooth transitions
    'transition-all duration-300 ease-gentle',

    // Touch targets (minimum 44px for accessibility)
    'min-h-touch min-w-touch',

    // Rounded corners (calming, not sharp)
    'rounded-lg',

    // Mobile-specific improvements
    mobileSafe && [
      'touch-manipulation', // Prevent zoom on double-tap (iOS)
      'select-none', // Prevent text selection
    ],

    // Full width option for mobile layouts
    fullWidth && 'w-full',

    // Text wrapping for mobile
    !icon && 'whitespace-normal sm:whitespace-nowrap text-center',
  ];

  // Variant styles
  const variants = {
    primary: [
      'bg-primary text-primary-foreground',
      'hover:bg-secondary hover:shadow-md',
      'active:bg-secondary active:scale-[0.98]',
      'shadow-sm hover:shadow-md',
    ],

    secondary: [
      'bg-transparent text-muted-foreground border-2 border-primary',
      'hover:bg-muted hover:border-primary',
      'active:bg-muted active:scale-[0.98]',
      'shadow-sm hover:shadow-md',
    ],

    ghost: [
      'bg-transparent text-muted-foreground',
      'hover:bg-muted',
      'active:bg-muted active:scale-[0.98]',
    ],

    outline: [
      'bg-transparent text-foreground border-2 border-border',
      'hover:bg-muted hover:border-primary',
      'active:bg-muted active:scale-[0.98]',
    ],

    destructive: [
      'bg-destructive text-destructive-foreground',
      'hover:bg-destructive/90 hover:shadow-lg',
      'active:bg-destructive/80 active:scale-[0.98]',
    ],

    link: [
      'text-muted-foreground underline-offset-4',
      'hover:underline hover:text-foreground',
      'active:text-foreground',
      'h-auto p-0 font-normal',
    ]
  };

  // Size styles - responsive approach
  const sizes = {
    sm: [
      'h-10 px-3 py-2 sm:px-4',
      'text-sm',
      'rounded-md',
    ],

    default: [
      'h-12 px-4 py-3 sm:px-6',
      'text-base',
    ],

    lg: [
      'h-14 px-6 py-4 sm:px-8',
      'text-lg',
      'rounded-xl',
    ],

    icon: [
      'h-12 w-12',
      'p-0',
      'flex-shrink-0', // Prevent icon buttons from shrinking
    ],

    // Mobile-optimized sizes
    'mobile-full': [
      'h-12 w-full px-4 py-3',
      'text-base',
    ],

    'mobile-large': [
      'h-14 w-full px-6 py-4',
      'text-lg',
      'rounded-xl',
    ]
  };

  // Combine all styles
  const buttonStyles = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  );

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="size-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Render content with optional icon and loading state
  const renderContent = () => {
    if (loading) {
      return (
        <>
          <LoadingSpinner />
          {children && <span className="opacity-70">{children}</span>}
        </>
      );
    }

    if (icon && iconPosition === 'left') {
      return (
        <>
          {icon}
          {children}
        </>
      );
    }

    if (icon && iconPosition === 'right') {
      return (
        <>
          {children}
          {icon}
        </>
      );
    }

    return children;
  };

  // Render as child component if asChild is true
  if (asChild) {
    return React.cloneElement(children, {
      className: cn(buttonStyles, children.props.className),
      ref,
      disabled: disabled || loading,
      ...props,
    });
  }

  // Spring animation config
  const springConfig = {
    type: "spring",
    stiffness: 400,
    damping: 17,
  };

  // Motion props (disabled if user prefers reduced motion)
  const motionProps = shouldReduceMotion
    ? {}
    : {
        whileTap: { scale: 0.95 },
        transition: springConfig,
      };

  // Handle click with haptic feedback
  const handleClick = (e) => {
    // Add haptic feedback for primary, secondary, and destructive buttons
    if (!disabled && !loading) {
      if (variant === 'primary' || variant === 'secondary') {
        haptics.light();
      } else if (variant === 'destructive') {
        haptics.medium();
      }
    }

    // Call the original onClick if provided
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <motion.button
      className={buttonStyles}
      ref={ref}
      disabled={disabled || loading}
      {...motionProps}
      {...props}
      onClick={handleClick}
    >
      {renderContent()}
    </motion.button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'outline', 'danger']),
  size: PropTypes.oneOf(['sm', 'default', 'lg']),
  children: PropTypes.node,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  asChild: PropTypes.bool,
};

export { Button };