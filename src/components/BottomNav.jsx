import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useState, useEffect, useMemo, useCallback, memo } from "react";
import { Sun, Compass, Wind, Calendar, TrendingUp, User } from "lucide-react";
import { cn } from "../lib/utils";
import useProgressStore from "../stores/progress";
import usePreferencesStore from "../stores/preferences";
import FeatureTooltip from "./FeatureTooltip";

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
const BottomNav = memo(function BottomNav({ className }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract only pathname to minimize rerenders
  const pathname = location.pathname;

  // Refs for tooltip targeting
  const progressTabRef = useRef(null);

  // Progress store - only subscribe to totalSessions for tooltip logic
  const totalSessions = useProgressStore((state) => state.totalSessions);

  // Preferences store for tooltips - only subscribe to tooltip methods
  const isTooltipDismissed = usePreferencesStore(
    (state) => state.isTooltipDismissed,
  );
  const dismissTooltip = usePreferencesStore((state) => state.dismissTooltip);

  // Tooltip visibility state
  const [showProgressTooltip, setShowProgressTooltip] = useState(false);

  // Check tooltip conditions
  useEffect(() => {
    // Tooltip 3: Bottom Nav - Progress
    // Show when: After 1 session completed, hasn't opened Progress, on home screen
    const progressDismissed = isTooltipDismissed("tooltip-bottom-nav-progress");
    const isOnHomeScreen = pathname === "/";
    const hasNotVisitedProgress =
      pathname !== "/insights" && pathname !== "/progress";

    if (
      !progressDismissed &&
      totalSessions >= 1 &&
      isOnHomeScreen &&
      hasNotVisitedProgress
    ) {
      // Show tooltip after a delay
      const timer = setTimeout(() => {
        setShowProgressTooltip(true);
      }, 3000); // Wait 3 seconds after home screen loads

      return () => clearTimeout(timer);
    }
  }, [totalSessions, pathname, isTooltipDismissed]);

  // Handle Progress tooltip dismiss - memoized
  const handleProgressTooltipDismiss = useCallback(() => {
    setShowProgressTooltip(false);
    dismissTooltip("tooltip-bottom-nav-progress");
  }, [dismissTooltip]);

  // Memoize tabs array - only recompute when pathname changes
  const tabs = useMemo(
    () => [
      {
        id: "today",
        label: "Today",
        icon: Sun,
        path: "/",
        // Match exact home path
        isActive: pathname === "/",
      },
      {
        id: "discover",
        label: "Discover",
        icon: Compass,
        path: "/sessions",
        // Match /sessions and /sessions/builder only (not breathing)
        isActive: pathname.startsWith("/sessions"),
      },
      {
        id: "breathe",
        label: "Breathe",
        icon: Wind,
        path: "/breathing",
        // Match /breathing and /breathing/practice
        isActive: pathname.startsWith("/breathing"),
      },
      {
        id: "programs",
        label: "Programs",
        icon: Calendar,
        path: "/programs",
        // Match /programs and program detail pages
        isActive: pathname.startsWith("/programs"),
      },
      {
        id: "progress",
        label: "Progress",
        icon: TrendingUp,
        path: "/insights",
        // Match /insights and /progress
        isActive: pathname === "/insights" || pathname === "/progress",
      },
      {
        id: "profile",
        label: "Profile",
        icon: User,
        path: "/settings",
        // Match /settings
        isActive: pathname === "/settings",
      },
    ],
    [pathname],
  );

  // Memoize tab click handler
  const handleTabClick = useCallback(
    (tab) => {
      // Dismiss tooltip if clicking Progress
      if (tab.id === "progress" && showProgressTooltip) {
        dismissTooltip("tooltip-bottom-nav-progress");
        setShowProgressTooltip(false);
      }

      navigate(tab.path);
    },
    [showProgressTooltip, dismissTooltip, navigate],
  );

  return (
    <nav
      className={cn(
        // Layout
        "fixed inset-x-0 bottom-0 z-40",
        // Styling - solid background (no transparency)
        "bg-background",
        "border-t border-border",
        // Safe area handling for iOS
        "pb-safe-bottom",
        // Shadow
        "shadow-lg",
        className,
      )}
    >
      <div className="flex h-12 items-stretch justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.isActive;

          return (
            <button
              key={tab.id}
              ref={tab.id === "progress" ? progressTabRef : null}
              onClick={() => handleTabClick(tab)}
              className={cn(
                // Layout - equal width tabs
                "flex flex-1 flex-col items-center justify-center",
                // Minimum touch target
                "min-h-touch",
                // Spacing
                "p-2",
                // Transitions
                "transition-all duration-300",
                // Hover state (subtle on mobile)
                "hover:bg-muted",
                // Active state
                "relative",
                // Focus state for accessibility
                "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring",
              )}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active indicator line at top */}
              {isActive && (
                <div className="absolute left-1/2 top-0 h-1 w-12 -translate-x-1/2 rounded-b-full bg-secondary" />
              )}

              {/* Icon */}
              <Icon
                className={cn(
                  // Size - compact for smaller nav
                  "size-6",
                  // Color based on active state
                  isActive ? "text-muted-foreground" : "text-muted-foreground",
                  // Stroke width for active state (bolder when active)
                  isActive ? "stroke-[2.5]" : "stroke-[2]",
                  // Smooth transition
                  "transition-all duration-300",
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
});

BottomNav.displayName = "BottomNav";

export default BottomNav;
