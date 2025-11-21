import { useNavigate, useLocation } from "react-router-dom";
import { useMemo, memo, useCallback } from "react";
import { Sun, Compass, Wind, Calendar, TrendingUp, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

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
 */
const BottomNav = memo(function BottomNav({ className }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract only pathname to minimize rerenders
  const pathname = location.pathname;

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
      navigate(tab.path);
    },
    [navigate],
  );

  return (
    <nav
      className={cn(
        // Layout
        "frosted-nav fixed inset-x-0 bottom-0 z-40 h-14",
        // Safe area handling for iOS
        "pb-safe-bottom",
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
              {/* Icon */}
              <Icon
                className={cn(
                  // Size - compact for smaller nav
                  "size-6",
                  // Color based on active state
                  isActive
                    ? "text-foreground drop-shadow-[0_0_6px_hsl(var(--aurora-violet)/0.4)]"
                    : "text-muted-foreground",
                  // Stroke width for active state (bolder when active)
                  isActive ? "stroke-[2.5]" : "stroke-[2]",
                  // Smooth transition
                  "transition-all duration-300",
                )}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 size-1.5 rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
});

BottomNav.displayName = "BottomNav";

export default BottomNav;
