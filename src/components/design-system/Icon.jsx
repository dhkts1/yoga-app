/**
 * Icon Component
 *
 * Consistent icon wrapper with sizing and variants for the yoga app.
 * Supports both SVG icons and icon libraries.
 */

import React from 'react';
import { cn } from '../../lib/utils';

const Icon = React.forwardRef(({
  className,
  size = 'default',
  variant = 'default',
  children,
  ...props
}, ref) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    default: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
    '2xl': 'w-12 h-12'
  };

  const variants = {
    default: 'text-current',
    primary: 'text-sage-600',
    secondary: 'text-secondary',
    muted: 'text-muted',
    white: 'text-white',
    success: 'text-state-success',
    warning: 'text-state-warning',
    error: 'text-state-error'
  };

  const iconStyles = cn(
    'flex-shrink-0',
    sizes[size],
    variants[variant],
    className
  );

  return (
    <span
      className={iconStyles}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Icon.displayName = 'Icon';

// Common yoga app icons as SVG components
const PlayIcon = (props) => (
  <Icon {...props}>
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z"/>
    </svg>
  </Icon>
);

const PauseIcon = (props) => (
  <Icon {...props}>
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
    </svg>
  </Icon>
);

const StopIcon = (props) => (
  <Icon {...props}>
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 6h12v12H6z"/>
    </svg>
  </Icon>
);

const SkipNextIcon = (props) => (
  <Icon {...props}>
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
    </svg>
  </Icon>
);

const SkipPreviousIcon = (props) => (
  <Icon {...props}>
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
    </svg>
  </Icon>
);

const TimerIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12,6 12,12 16,14"/>
    </svg>
  </Icon>
);

const HeartIcon = (props) => (
  <Icon {...props}>
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  </Icon>
);

const SettingsIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m17.5-3.5L19 12l3.5 3.5M1.5 8.5L5 12l-3.5 3.5"/>
    </svg>
  </Icon>
);

const InfoIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4m0-4h.01"/>
    </svg>
  </Icon>
);

const CheckIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  </Icon>
);

const CloseIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </Icon>
);

const ChevronLeftIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polyline points="15,18 9,12 15,6"/>
    </svg>
  </Icon>
);

const ChevronRightIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polyline points="9,18 15,12 9,6"/>
    </svg>
  </Icon>
);

const ChevronUpIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polyline points="18,15 12,9 6,15"/>
    </svg>
  </Icon>
);

const ChevronDownIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polyline points="6,9 12,15 18,9"/>
    </svg>
  </Icon>
);

const MenuIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </Icon>
);

const HomeIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  </Icon>
);

const CalendarIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  </Icon>
);

const UserIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  </Icon>
);

const SearchIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-4.35-4.35"/>
    </svg>
  </Icon>
);

const FilterIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
    </svg>
  </Icon>
);

const SunIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  </Icon>
);

const MoonIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  </Icon>
);

const VolumeIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/>
      <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
    </svg>
  </Icon>
);

const VolumeOffIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23 9l-6 6m0-6l6 6" />
    </svg>
  </Icon>
);

// Yoga-specific icons
const PoseIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="3"/>
      <path d="M12 8v5l-3 3v4h2v-3l2-2 2 2v3h2v-4l-3-3V8"/>
    </svg>
  </Icon>
);

const BreathIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M4 12a8 8 0 018-8 8 8 0 018 8 8 8 0 01-8 8 8 8 0 01-8-8z"/>
      <path d="M12 8v8m-4-4h8"/>
    </svg>
  </Icon>
);

const FlexibilityIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
      <path d="M12 6v12M6 12h12"/>
    </svg>
  </Icon>
);

const StrengthIcon = (props) => (
  <Icon {...props}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M6.5 12h11M9 5l-2 7 2 7M15 5l2 7-2 7"/>
    </svg>
  </Icon>
);

export {
  Icon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  SkipNextIcon,
  SkipPreviousIcon,
  TimerIcon,
  HeartIcon,
  SettingsIcon,
  InfoIcon,
  CheckIcon,
  CloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MenuIcon,
  HomeIcon,
  CalendarIcon,
  UserIcon,
  SearchIcon,
  FilterIcon,
  SunIcon,
  MoonIcon,
  VolumeIcon,
  VolumeOffIcon,
  PoseIcon,
  BreathIcon,
  FlexibilityIcon,
  StrengthIcon
};