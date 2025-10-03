/**
 * Mobile Tester Component
 *
 * Development utility for testing mobile responsiveness and viewport constraints.
 * Only shown in development mode to help validate mobile-safe components.
 */

import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

const MobileTester = ({ children, showIndicator = true, testSizes = [375, 414, 428] }) => {
  const [viewportWidth, setViewportWidth] = useState(null);
  const [hasHorizontalScroll, setHasHorizontalScroll] = useState(false);
  const [testMode, setTestMode] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      setViewportWidth(window.innerWidth);

      // Check for horizontal scroll
      const hasScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth;
      setHasHorizontalScroll(hasScroll);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    // Check on every DOM mutation (for dynamic content)
    const observer = new MutationObserver(updateViewport);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', updateViewport);
      observer.disconnect();
    };
  }, []);

  // Only show in development
  if (import.meta.env.PROD) {
    return children;
  }

  return (
    <div className="relative">
      {children}

      {showIndicator && (
        <div className={cn(
          'fixed right-4 top-4 z-50',
          'rounded-lg bg-foreground/80 px-3 py-2 font-mono text-sm text-primary-foreground',
          'shadow-lg backdrop-blur-sm',
          hasHorizontalScroll && 'animate-pulse bg-state-error'
        )}>
          <div className="space-y-1">
            <div>Viewport: {viewportWidth}px</div>
            <div className={cn(
              'flex items-center gap-2',
              hasHorizontalScroll ? 'text-state-error' : 'text-state-success'
            )}>
              <div className={cn(
                'size-2 rounded-full',
                hasHorizontalScroll ? 'bg-state-error' : 'bg-state-success'
              )} />
              {hasHorizontalScroll ? 'H-Scroll' : 'Mobile Safe'}
            </div>
          </div>
        </div>
      )}

      {/* Test Mode Controls */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setTestMode(!testMode)}
          className={cn(
            'rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground',
            'transition-colors hover:bg-primary',
            'shadow-lg backdrop-blur-sm'
          )}
        >
          {testMode ? 'Exit Test' : 'Test Mobile'}
        </button>

        {testMode && (
          <div className="mt-2 space-y-2">
            {testSizes.map(size => (
              <button
                key={size}
                onClick={() => {
                  // Simulate viewport size for testing
                  document.documentElement.style.maxWidth = `${size}px`;
                  document.documentElement.style.margin = '0 auto';
                  document.documentElement.style.border = '2px solid red';
                  document.documentElement.style.boxSizing = 'border-box';
                }}
                className={cn(
                  'block w-full rounded bg-card px-3 py-2 text-sm text-muted-foreground',
                  'border border-border transition-colors hover:bg-muted',
                  viewportWidth === size && 'bg-muted font-medium'
                )}
              >
                {size}px
                {size === 375 && ' (iPhone SE)'}
                {size === 414 && ' (iPhone Pro)'}
                {size === 428 && ' (iPhone Pro Max)'}
              </button>
            ))}
            <button
              onClick={() => {
                // Reset to normal
                document.documentElement.style.maxWidth = '';
                document.documentElement.style.margin = '';
                document.documentElement.style.border = '';
              }}
              className="block w-full rounded bg-muted px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Overflow Warning */}
      {hasHorizontalScroll && (
        <div className="fixed inset-x-0 top-0 z-40 bg-state-error py-2 text-center text-sm font-medium text-primary-foreground">
          ⚠️ Horizontal scroll detected - check component widths!
        </div>
      )}
    </div>
  );
};

// Component validator for individual components
const ComponentValidator = ({ children, name, className }) => {
  const [hasOverflow, setHasOverflow] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const checkOverflow = () => {
      const element = ref.current;
      const hasHorizontalOverflow = element.scrollWidth > element.clientWidth;
      // const hasVerticalOverflow = element.scrollHeight > element.clientHeight;

      setHasOverflow(hasHorizontalOverflow);

      if (hasHorizontalOverflow) {
        console.warn(`Component "${name}" has horizontal overflow:`, {
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
          element
        });
      }
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(ref.current);

    return () => resizeObserver.disconnect();
  }, [name]);

  // Only show in development
  if (import.meta.env.PROD) {
    return children;
  }

  return (
    <div
      ref={ref}
      className={cn(
        className,
        hasOverflow && 'ring-2 ring-state-error ring-offset-2'
      )}
      data-component={name}
    >
      {children}
      {hasOverflow && (
        <div className="absolute right-0 top-0 rounded-bl bg-state-error px-2 py-1 text-xs text-primary-foreground">
          Overflow: {name}
        </div>
      )}
    </div>
  );
};

// Hook for mobile-safe measurements
const useMobileSafe = () => {
  const [measurements, setMeasurements] = useState({
    viewportWidth: 0,
    safeWidth: 0,
    hasHorizontalScroll: false,
    deviceType: 'mobile'
  });

  useEffect(() => {
    const updateMeasurements = () => {
      const vw = window.innerWidth;
      const safeWidth = vw - 32; // 2rem padding
      const hasScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth;

      let deviceType = 'mobile';
      if (vw >= 768) deviceType = 'desktop';
      else if (vw >= 480) deviceType = 'tablet';

      setMeasurements({
        viewportWidth: vw,
        safeWidth,
        hasHorizontalScroll: hasScroll,
        deviceType
      });
    };

    updateMeasurements();
    window.addEventListener('resize', updateMeasurements);

    return () => window.removeEventListener('resize', updateMeasurements);
  }, []);

  return measurements;
};

export { MobileTester, ComponentValidator, useMobileSafe };