import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { GlassIconButton } from '../design-system';
import { HEADER_STYLES } from './headerStyles';

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
  const ExitButton = (
    <GlassIconButton
      icon={X}
      onClick={onExit}
      label="Exit practice"
      variant={exitButtonStyle}
      className={exitButtonStyle === 'circular' ? 'hover:shadow-md' : ''}
    />
  );

  return (
    <header
      className={cn(HEADER_STYLES.container, className)}
      {...props}
    >
      {/* Main header content - Fixed height */}
      <div className="flex h-14 items-center px-4">
        <div className="relative z-[60] flex w-full items-center justify-center">
          {/* Exit button - absolute positioned on left */}
          <div className="absolute left-0">
            {ExitButton}
          </div>

          {/* Title area - truly centered with slight downward shift */}
          <div className={cn(
            "mt-1 min-w-0",
            exitButtonStyle === 'circular' ? "text-center" : "flex items-center gap-3"
          )}>
            {contextBadge && exitButtonStyle === 'circular' && (
              <div className="mb-1 flex items-center justify-center gap-1">
                {contextBadge}
              </div>
            )}
            <h1 className={cn(
              "truncate font-semibold tracking-tight",
              // Solid color - cleaner, more minimal
              "text-foreground",
              exitButtonStyle === 'circular' ? "text-xl" : "text-base"
            )}>
              {title}
            </h1>
            {subtitle && (
              <p className={cn(
                "truncate text-muted-foreground/80",
                exitButtonStyle === 'circular' ? "mt-0.5 text-xs" : "mt-0.5 text-sm italic"
              )}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Right actions - absolute positioned on right */}
          {actions && (
            <div className="absolute right-0 flex shrink-0 items-center gap-1.5">
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
