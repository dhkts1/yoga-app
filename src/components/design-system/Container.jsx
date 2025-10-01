/**
 * Container Components
 *
 * Layout containers for consistent spacing and responsive design.
 * Optimized for yoga practice scenarios across devices.
 */

import React from 'react';
import { cn } from '../../lib/utils';

// Main container component
const Container = React.forwardRef(({
  className,
  children,
  size = 'default',
  padding = 'default',
  centered = true,
  mobileSafe = true,
  ...props
}, ref) => {
  const sizes = {
    sm: 'max-w-2xl',
    default: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
    safe: 'max-w-safe' // Use safe width utility
  };

  const paddings = {
    none: '',
    xs: 'px-2',
    sm: 'px-4',
    default: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12',
    mobile: 'px-4 sm:px-6', // Optimized for mobile
  };

  const containerStyles = cn(
    'w-full',
    sizes[size],
    paddings[padding],
    centered && 'mx-auto',
    // Mobile-specific safety
    mobileSafe && [
      'overflow-x-hidden',
      'box-border',
      'min-w-0', // Allows flex children to shrink below their content size
    ],
    className
  );

  return (
    <div
      className={containerStyles}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Container.displayName = 'Container';

// Section container for page sections
const Section = React.forwardRef(({
  className,
  children,
  spacing = 'default',
  background = 'default',
  ...props
}, ref) => {
  const spacings = {
    none: '',
    sm: 'py-8',
    default: 'py-12 sm:py-16',
    lg: 'py-16 sm:py-20',
    xl: 'py-20 sm:py-24'
  };

  const backgrounds = {
    default: '',
    sage: 'bg-sage-50',
    cream: 'bg-cream-100',
    white: 'bg-white',
    transparent: 'bg-transparent'
  };

  const sectionStyles = cn(
    spacings[spacing],
    backgrounds[background],
    className
  );

  return (
    <section
      className={sectionStyles}
      ref={ref}
      {...props}
    >
      {children}
    </section>
  );
});

Section.displayName = 'Section';

// Stack component for vertical layouts
const Stack = React.forwardRef(({
  className,
  children,
  spacing = 'default',
  align = 'stretch',
  justify = 'start',
  direction = 'column',
  ...props
}, ref) => {
  const spacings = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    default: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };

  const alignments = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const justifications = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const directions = {
    row: 'flex-row',
    column: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'column-reverse': 'flex-col-reverse'
  };

  const stackStyles = cn(
    'flex',
    directions[direction],
    spacings[spacing],
    alignments[align],
    justifications[justify],
    className
  );

  return (
    <div
      className={stackStyles}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Stack.displayName = 'Stack';

// Grid component for responsive grids
const Grid = React.forwardRef(({
  className,
  children,
  columns = 'auto',
  gap = 'default',
  responsive = true, // eslint-disable-line no-unused-vars
  mobileSafe = true,
  ...props
}, ref) => {
  const gaps = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    default: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  };

  // Column configurations - mobile-first approach
  const columnConfigs = {
    auto: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2', // Start with 1 column on mobile
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3', // Progressive enhancement
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    'poses': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    'sessions': 'grid-cols-1 md:grid-cols-2',
    'features': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    'mobile-cards': 'grid-cols-1', // Single column for mobile cards
  };

  const gridStyles = cn(
    'grid',
    columnConfigs[columns],
    gaps[gap],
    // Mobile safety
    mobileSafe && [
      'w-full',
      'overflow-x-hidden',
      'box-border',
    ],
    className
  );

  return (
    <div
      className={gridStyles}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Grid.displayName = 'Grid';

// Center component for centering content
const Center = React.forwardRef(({
  className,
  children,
  minHeight = false,
  ...props
}, ref) => {
  const centerStyles = cn(
    'flex items-center justify-center text-center',
    minHeight && 'min-h-screen',
    className
  );

  return (
    <div
      className={centerStyles}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Center.displayName = 'Center';

// Page wrapper for consistent page layout
const PageWrapper = React.forwardRef(({
  className,
  children,
  title,
  description,
  padding = true,
  ...props
}, ref) => {
  return (
    <main
      className={cn(
        'min-h-screen bg-background pt-safe-top pb-safe-bottom overflow-x-hidden',
        padding && 'px-4 sm:px-6',
        className
      )}
      ref={ref}
      {...props}
    >
      {(title || description) && (
        <Section spacing="sm" background="white">
          <Container>
            {title && (
              <h1 className="text-2xl font-semibold text-primary mb-2">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-lg text-secondary">
                {description}
              </p>
            )}
          </Container>
        </Section>
      )}
      {children}
    </main>
  );
});

PageWrapper.displayName = 'PageWrapper';

// Practice screen specific layout
const PracticeLayout = React.forwardRef(({
  className,
  children,
  timer,
  controls,
  pose,
  tips,
  ...props
}, ref) => {
  return (
    <div
      className={cn(
        'min-h-screen bg-background flex flex-col',
        'pt-safe-top pb-safe-bottom',
        className
      )}
      ref={ref}
      {...props}
    >
      {/* Timer section */}
      {timer && (
        <div className="flex-shrink-0 bg-white border-b border-border-light">
          <Container padding="default">
            <div className="py-6 text-center">
              {timer}
            </div>
          </Container>
        </div>
      )}

      {/* Main pose content */}
      <div className="flex-1 flex flex-col">
        {pose && (
          <div className="flex-1 flex items-center justify-center p-6">
            {pose}
          </div>
        )}
      </div>

      {/* Controls section */}
      {controls && (
        <div className="flex-shrink-0 bg-white border-t border-border-light">
          <Container padding="default">
            <div className="py-4">
              {controls}
            </div>
          </Container>
        </div>
      )}

      {/* Tips overlay */}
      {tips}

      {children}
    </div>
  );
});

PracticeLayout.displayName = 'PracticeLayout';

// Aspect ratio container for consistent image/video sizing
const AspectRatio = React.forwardRef(({
  className,
  children,
  ratio = '4/3',
  ...props
}, ref) => {
  const ratios = {
    '1/1': 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-video',
    '3/2': 'aspect-[3/2]',
    '2/1': 'aspect-[2/1]'
  };

  const aspectStyles = cn(
    'relative overflow-hidden',
    ratios[ratio] || `aspect-[${ratio}]`,
    className
  );

  return (
    <div
      className={aspectStyles}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

AspectRatio.displayName = 'AspectRatio';

export {
  Container,
  Section,
  Stack,
  Grid,
  Center,
  PageWrapper,
  PracticeLayout,
  AspectRatio
};