import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * PracticeHeader - Specialized header for practice screens
 *
 * Features:
 * - Fixed 56px height for consistency
 * - Exit button (circular or standard)
 * - Title with optional subtitle
 * - Optional context badge (for program context)
 * - Right-side action buttons
 * - Optional progress bar
 * - Design system compliant with gradient and shadow
 *
 * Usage:
 * <PracticeHeader
 *   title="Session Name"
 *   subtitle="Sanskrit Name"
 *   onExit={() => navigate('/sessions')}
 *   exitButtonStyle="circular"
 *   contextBadge={<div>Week 1, Day 1</div>}
 *   actions={<>buttons...</>}
 *   progressBar={<div className="h-1.5 bg-primary" style={{width: '50%'}} />}
 * />
 */
function PracticeHeader({
  title,
  subtitle,
  onExit,
  exitButtonStyle = 'standard', // 'circular' | 'standard'
  contextBadge,
  actions,
  progressBar,
  className,
  ...props
}) {
  const ExitButton = exitButtonStyle === 'circular' ? (
    <button
      onClick={onExit}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full',
        'bg-sage-100 text-sage-700',
        'hover:bg-sage-200 hover:shadow-md',
        'transition-all duration-200',
        'flex-shrink-0'
      )}
      aria-label="Exit practice"
    >
      <X className="h-5 w-5" />
    </button>
  ) : (
    <button
      onClick={onExit}
      className={cn(
        'flex-shrink-0 p-2 -ml-2',
        'text-sage-600 hover:text-sage-700',
        'hover:bg-sage-50 rounded-full',
        'transition-all duration-200'
      )}
      aria-label="Exit practice"
    >
      <X className="h-6 w-6" />
    </button>
  );

  return (
    <header
      className={cn(
        // Background with subtle gradient
        'bg-gradient-to-b from-white to-sage-50/30',
        // Shadow for depth
        'shadow-sm',
        // Border
        'border-b border-sage-100',
        className
      )}
      {...props}
    >
      {/* Main header content - Fixed height */}
      <div className="h-14 px-4 flex items-center">
        <div className="flex items-center justify-between w-full relative z-[60]">
          {/* Exit button */}
          {ExitButton}

          {/* Title area - centered or left-aligned based on context */}
          <div className={cn(
            "min-w-0 flex-1",
            exitButtonStyle === 'circular' ? "text-center mx-3" : "flex items-center gap-3 ml-3"
          )}>
            {contextBadge && exitButtonStyle === 'circular' && (
              <div className="flex items-center justify-center gap-1 mb-0.5">
                {contextBadge}
              </div>
            )}
            <div className="min-w-0">
              <h1 className={cn(
                "font-semibold truncate",
                "bg-gradient-to-r from-sage-800 to-sage-600 bg-clip-text text-transparent",
                exitButtonStyle === 'circular' ? "text-sm" : "text-base"
              )}>
                {title}
              </h1>
              {subtitle && (
                <p className={cn(
                  "text-sage-600 truncate",
                  exitButtonStyle === 'circular' ? "text-xs" : "text-sm italic"
                )}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right actions */}
          {actions && (
            <div className="flex items-center gap-1 flex-shrink-0 ml-3">
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Optional progress bar */}
      {progressBar && (
        <div className="mx-4 pb-2">
          {progressBar}
        </div>
      )}
    </header>
  );
}

export default PracticeHeader;
