import { useNavigate, useLocation } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { Sun, Compass, Wind, Calendar, TrendingUp, User } from 'lucide-react';
import { cn } from '../lib/utils';
import useProgressStore from '../stores/progress';
import usePreferencesStore from '../stores/preferences';
import FeatureTooltip from './FeatureTooltip';

/**
 * BottomNav - Persistent bottom tab navigation
 * Following Material Design and Nielsen Norman Group best practices (3-5 tabs)
 *
 * Features:
 * - 6 tabs: Today, Discover, Breathe, Programs, Progress, Profile
 * - Active state with color and icon style changes
 * - Fixed position with safe area handling
 * - 44px minimum touch targets
 * - Mobile-optimized with smooth transitions
 * - Feature discovery tooltip for Progress tab
 */
function BottomNav({ className }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Refs for tooltip targeting
  const progressTabRef = useRef(null);

  // Progress store
  const { totalSessions } = useProgressStore();

  // Preferences store for tooltips
  const {
    isTooltipDismissed,
    dismissTooltip,
  } = usePreferencesStore();

  // Tooltip visibility state
  const [showProgressTooltip, setShowProgressTooltip] = useState(false);

  // Check tooltip conditions
  useEffect(() => {
    // Tooltip 3: Bottom Nav - Progress
    // Show when: After 1 session completed, hasn't opened Progress, on home screen
    const progressDismissed = isTooltipDismissed('tooltip-bottom-nav-progress');
    const isOnHomeScreen = location.pathname === '/';
    const hasNotVisitedProgress = location.pathname !== '/insights' && location.pathname !== '/progress';

    if (!progressDismissed && totalSessions >= 1 && isOnHomeScreen && hasNotVisitedProgress) {
      // Show tooltip after a delay
      const timer = setTimeout(() => {
        setShowProgressTooltip(true);
      }, 3000); // Wait 3 seconds after home screen loads

      return () => clearTimeout(timer);
    }
  }, [totalSessions, location.pathname, isTooltipDismissed, dismissTooltip]);

  // Handle Progress tooltip dismiss
  const handleProgressTooltipDismiss = () => {
    setShowProgressTooltip(false);
    dismissTooltip('tooltip-bottom-nav-progress');
  };

  const tabs = [
    {
      id: 'today',
      label: 'Today',
      icon: Sun,
      path: '/',
      // Match exact home path
      isActive: location.pathname === '/'
    },
    {
      id: 'discover',
      label: 'Discover',
      icon: Compass,
      path: '/sessions',
      // Match /sessions and /sessions/builder only (not breathing)
      isActive: location.pathname.startsWith('/sessions')
    },
    {
      id: 'breathe',
      label: 'Breathe',
      icon: Wind,
      path: '/breathing',
      // Match /breathing and /breathing/practice
      isActive: location.pathname.startsWith('/breathing')
    },
    {
      id: 'programs',
      label: 'Programs',
      icon: Calendar,
      path: '/programs',
      // Match /programs and program detail pages
      isActive: location.pathname.startsWith('/programs')
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: TrendingUp,
      path: '/insights',
      // Match /insights and /progress
      isActive: location.pathname === '/insights' || location.pathname === '/progress'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/settings',
      // Match /settings
      isActive: location.pathname === '/settings'
    }
  ];

  const handleTabClick = (tab) => {
    // Dismiss tooltip if clicking Progress
    if (tab.id === 'progress' && showProgressTooltip) {
      dismissTooltip('tooltip-bottom-nav-progress');
      setShowProgressTooltip(false);
    }

    navigate(tab.path);
  };

  return (
    <nav
      className={cn(
        // Layout
        'fixed bottom-0 left-0 right-0 z-40',
        // Styling - solid background (no transparency)
        'bg-background',
        'border-t border-border',
        // Safe area handling for iOS
        'pb-safe-bottom',
        // Shadow
        'shadow-lg',
        className
      )}
    >
      <div className="flex items-stretch justify-around h-[48px]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.isActive;

          return (
            <button
              key={tab.id}
              ref={tab.id === 'progress' ? progressTabRef : null}
              onClick={() => handleTabClick(tab)}
              className={cn(
                // Layout - equal width tabs
                'flex-1 flex flex-col items-center justify-center',
                // Minimum touch target
                'min-h-[44px]',
                // Spacing
                'px-2 py-2',
                // Transitions
                'transition-all duration-300',
                // Hover state (subtle on mobile)
                'hover:bg-muted',
                // Active state
                'relative',
                // Focus state for accessibility
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset'
              )}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active indicator line at top */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-secondary rounded-b-full" />
              )}

              {/* Icon */}
              <Icon
                className={cn(
                  // Size - compact for smaller nav
                  'h-6 w-6',
                  // Color based on active state
                  isActive ? 'text-muted-foreground' : 'text-muted-foreground',
                  // Stroke width for active state (bolder when active)
                  isActive ? 'stroke-[2.5]' : 'stroke-[2]',
                  // Smooth transition
                  'transition-all duration-300'
                )}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </button>
          );
        })}
      </div>

      {/* Tooltip 3: Bottom Nav - Progress */}
      <FeatureTooltip
        id="tooltip-bottom-nav-progress"
        content="Track your practice journey and view insights"
        position="top"
        target={progressTabRef}
        show={showProgressTooltip}
        onDismiss={handleProgressTooltipDismiss}
        delay={0}
      />
    </nav>
  );
}

export default BottomNav;
