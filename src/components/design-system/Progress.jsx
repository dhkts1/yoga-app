/**
 * Progress Components
 *
 * Progress indicators for yoga practice, timers, and session tracking.
 * Designed with calming, breath-like animations.
 */

import React from 'react';
import { cn } from '../../lib/utils';

// Linear progress bar
const ProgressBar = React.forwardRef(({
  className,
  value = 0,
  max = 100,
  variant = 'default',
  size = 'default',
  showValue = false,
  animated = false,
  ...props
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variants = {
    default: {
      track: 'bg-muted',
      fill: 'bg-primary'
    },
    gold: {
      track: 'bg-accent/20',
      fill: 'bg-accent'
    },
    success: {
      track: 'bg-state-success/20',
      fill: 'bg-state-success'
    },
    subtle: {
      track: 'bg-muted',
      fill: 'bg-muted-foreground/50'
    }
  };

  const sizes = {
    sm: 'h-1',
    default: 'h-2',
    lg: 'h-3'
  };

  const trackStyles = cn(
    'w-full rounded-full overflow-hidden',
    sizes[size],
    variants[variant].track,
    className
  );

  const fillStyles = cn(
    'h-full rounded-full transition-all duration-300 ease-gentle',
    animated && 'animate-pulse',
    variants[variant].fill
  );

  return (
    <div className="w-full">
      <div
        className={trackStyles}
        ref={ref}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        {...props}
      >
        <div
          className={fillStyles}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <div className="flex justify-between mt-1 text-sm text-muted-foreground">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

// Circular progress for timers
const CircularProgress = React.forwardRef(({
  className,
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'default',
  showValue = true,
  animated = false,
  children,
  ...props
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const variants = {
    default: {
      track: 'stroke-muted',
      fill: 'stroke-primary'
    },
    gold: {
      track: 'stroke-accent/30',
      fill: 'stroke-accent'
    },
    timer: {
      track: 'stroke-muted',
      fill: 'stroke-primary'
    }
  };

  const centerX = size / 2;
  const centerY = size / 2;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      ref={ref}
      {...props}
    >
      <svg
        width={size}
        height={size}
        className={cn(
          'transform -rotate-90',
          animated && 'animate-pulse'
        )}
      >
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          strokeWidth={strokeWidth}
          className={cn('fill-none', variants[variant].track)}
        />

        {/* Progress circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn(
            'fill-none transition-all duration-300 ease-gentle',
            variants[variant].fill
          )}
          style={{
            strokeDasharray,
            strokeDashoffset
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showValue && (
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground">
              {value}
            </div>
            {max !== 100 && (
              <div className="text-sm text-muted-foreground">
                / {max}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

CircularProgress.displayName = 'CircularProgress';

// Timer component with circular progress
const Timer = React.forwardRef(({
  className,
  totalSeconds,
  remainingSeconds,
  size = 180,
  onComplete, // eslint-disable-line no-unused-vars
  paused = false,
  ...props
}, ref) => {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const percentage = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  // Format time display
  const formatTime = (mins, secs) => {
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn('relative', className)} ref={ref} {...props}>
      <CircularProgress
        value={percentage}
        max={100}
        size={size}
        strokeWidth={12}
        variant="timer"
        showValue={false}
        animated={!paused && remainingSeconds > 0}
      >
        <div className="text-center">
          <div className="text-3xl font-semibold text-foreground font-mono">
            {formatTime(minutes, seconds)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {paused ? 'Paused' : 'Remaining'}
          </div>
        </div>
      </CircularProgress>

      {/* Breathing animation indicator */}
      {!paused && remainingSeconds > 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full rounded-full border-2 border-primary opacity-30 animate-breathe" />
        </div>
      )}
    </div>
  );
});

Timer.displayName = 'Timer';

// Session progress component
const SessionProgress = React.forwardRef(({
  className,
  currentPose,
  totalPoses,
  poses = [],
  variant = 'default',
  ...props
}, ref) => {
  return (
    <div className={cn('space-y-3', className)} ref={ref} {...props}>
      {/* Main progress bar */}
      <ProgressBar
        value={currentPose}
        max={totalPoses}
        variant={variant}
        size="default"
      />

      {/* Progress info */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">
          Pose {currentPose} of {totalPoses}
        </span>
        <span className="text-muted-foreground font-medium">
          {Math.round((currentPose / totalPoses) * 100)}%
        </span>
      </div>

      {/* Pose indicators */}
      {poses.length > 0 && poses.length <= 10 && (
        <div className="flex gap-1">
          {poses.map((_, index) => (
            <div
              key={index}
              className={cn(
                'flex-1 h-1 rounded-full transition-colors duration-300',
                index < currentPose
                  ? 'bg-primary'
                  : index === currentPose
                  ? 'bg-primary/50'
                  : 'bg-muted'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
});

SessionProgress.displayName = 'SessionProgress';

// Loading spinner
const Spinner = React.forwardRef(({
  className,
  size = 'default',
  variant = 'default',
  ...props
}, ref) => {
  const sizes = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const variants = {
    default: 'text-muted-foreground',
    light: 'text-white',
    muted: 'text-muted'
  };

  const spinnerStyles = cn(
    'animate-spin',
    sizes[size],
    variants[variant],
    className
  );

  return (
    <svg
      className={spinnerStyles}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
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
});

Spinner.displayName = 'Spinner';

// Skeleton loader for content placeholders
const Skeleton = React.forwardRef(({
  className,
  variant = 'default',
  ...props
}, ref) => {
  const variants = {
    default: 'h-4 bg-muted rounded',
    text: 'h-4 bg-muted rounded',
    title: 'h-6 bg-muted rounded',
    button: 'h-12 bg-muted rounded-lg',
    card: 'h-32 bg-muted rounded-xl',
    circle: 'w-12 h-12 bg-muted rounded-full',
    avatar: 'w-10 h-10 bg-muted rounded-full'
  };

  const skeletonStyles = cn(
    'animate-pulse',
    variants[variant],
    className
  );

  return (
    <div
      className={skeletonStyles}
      ref={ref}
      {...props}
    />
  );
});

Skeleton.displayName = 'Skeleton';

export {
  ProgressBar,
  CircularProgress,
  Timer,
  SessionProgress,
  Spinner,
  Skeleton
};