import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * FeatureTooltip Component
 *
 * Contextual tooltips for feature discovery
 * - Mobile-optimized with smart positioning
 * - Dismissible with persistence
 * - Accessible with proper ARIA attributes
 * - Subtle animations per design system
 */
function FeatureTooltip({
  id,  // eslint-disable-line no-unused-vars
  content,
  position = 'bottom',
  target,
  show = false,
  onDismiss,
  delay = 2000,
  autoDismissDelay = 8000,
  className,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [calculatedPosition, setCalculatedPosition] = useState(position);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);
  const autoDismissRef = useRef(null);

  // Show tooltip after delay
  useEffect(() => {
    if (show) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);

        // Auto-dismiss after specified delay
        autoDismissRef.current = setTimeout(() => {
          handleDismiss();
        }, autoDismissDelay);
      }, delay);
    } else {
      setIsVisible(false);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (autoDismissRef.current) clearTimeout(autoDismissRef.current);
    };
  }, [show, delay, autoDismissDelay]);

  // Calculate smart positioning to avoid off-screen rendering
  useEffect(() => {
    if (!isVisible || !tooltipRef.current || !target?.current) return;

    const targetRect = target.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newPosition = position;

    // Check if tooltip would go off-screen and adjust
    if (position === 'bottom' && targetRect.bottom + tooltipRect.height + 12 > viewportHeight) {
      newPosition = 'top';
    } else if (position === 'top' && targetRect.top - tooltipRect.height - 12 < 0) {
      newPosition = 'bottom';
    } else if (position === 'right' && targetRect.right + tooltipRect.width + 12 > viewportWidth) {
      newPosition = 'left';
    } else if (position === 'left' && targetRect.left - tooltipRect.width - 12 < 0) {
      newPosition = 'right';
    }

    setCalculatedPosition(newPosition);
  }, [isVisible, position, target]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isVisible) {
        handleDismiss();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  if (!isVisible || !target?.current) return null;

  const targetRect = target.current.getBoundingClientRect();

  // Calculate tooltip position based on target element
  const getTooltipStyle = () => {
    const offset = 12; // Distance from target

    let style = {
      position: 'fixed',
      zIndex: 9999,
      maxWidth: '200px',
    };

    switch (calculatedPosition) {
      case 'top':
        style.bottom = `${window.innerHeight - targetRect.top + offset}px`;
        style.left = `${targetRect.left + targetRect.width / 2}px`;
        style.transform = 'translateX(-50%)';
        break;
      case 'bottom':
        style.top = `${targetRect.bottom + offset}px`;
        style.left = `${targetRect.left + targetRect.width / 2}px`;
        style.transform = 'translateX(-50%)';
        break;
      case 'left':
        style.right = `${window.innerWidth - targetRect.left + offset}px`;
        style.top = `${targetRect.top + targetRect.height / 2}px`;
        style.transform = 'translateY(-50%)';
        break;
      case 'right':
        style.left = `${targetRect.right + offset}px`;
        style.top = `${targetRect.top + targetRect.height / 2}px`;
        style.transform = 'translateY(-50%)';
        break;
      default:
        break;
    }

    return style;
  };

  // Arrow positioning classes
  const getArrowClasses = () => {
    const baseClasses = 'absolute w-0 h-0 border-solid';

    switch (calculatedPosition) {
      case 'top':
        return cn(
          baseClasses,
          'bottom-[-8px] left-1/2 -translate-x-1/2',
          'border-t-8 border-t-white',
          'border-l-8 border-l-transparent',
          'border-r-8 border-r-transparent'
        );
      case 'bottom':
        return cn(
          baseClasses,
          'top-[-8px] left-1/2 -translate-x-1/2',
          'border-b-8 border-b-white',
          'border-l-8 border-l-transparent',
          'border-r-8 border-r-transparent'
        );
      case 'left':
        return cn(
          baseClasses,
          'right-[-8px] top-1/2 -translate-y-1/2',
          'border-l-8 border-l-white',
          'border-t-8 border-t-transparent',
          'border-b-8 border-b-transparent'
        );
      case 'right':
        return cn(
          baseClasses,
          'left-[-8px] top-1/2 -translate-y-1/2',
          'border-r-8 border-r-white',
          'border-t-8 border-t-transparent',
          'border-b-8 border-b-transparent'
        );
      default:
        return baseClasses;
    }
  };

  return (
    <div
      ref={tooltipRef}
      role="tooltip"
      aria-label={content}
      style={getTooltipStyle()}
      className={cn(
        'bg-white rounded-lg p-3 shadow-lg border-2 border-sage-600',
        'animate-fade-in',
        className
      )}
    >
      {/* Arrow */}
      <div className={getArrowClasses()} />

      {/* Content */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-sage-900 leading-relaxed flex-1">
          {content}
        </p>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-sage-100 transition-colors"
          aria-label="Dismiss tooltip"
        >
          <X className="h-3 w-3 text-sage-600" />
        </button>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes gentle-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        [role="tooltip"] {
          animation: gentle-pulse 2s ease-in-out infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 300ms ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default FeatureTooltip;
