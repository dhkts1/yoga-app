import { useNavigate, useLocation } from "react-router-dom";
import { useMemo, memo, useCallback, useState } from "react";
import {
  Sun,
  Compass,
  Wind,
  Calendar,
  TrendingUp,
  Plus,
  Play,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import cx from "classnames";
import { haptics } from "../utils/haptics";

/**
 * BottomNav - Linear/Notion Inspired Navigation
 *
 * Features:
 * - 5 tabs with centered floating action button
 * - Clean, minimal design with thin borders
 * - Quick action sheet for start options
 */
const BottomNav = memo(function BottomNav({ className }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showQuickActions, setShowQuickActions] = useState(false);

  const pathname = location.pathname;

  const tabs = useMemo(
    () => [
      {
        id: "today",
        label: "Today",
        icon: Sun,
        path: "/",
        isActive: pathname === "/",
      },
      {
        id: "discover",
        label: "Sessions",
        icon: Compass,
        path: "/sessions",
        isActive: pathname.startsWith("/sessions"),
      },
      // Center slot for FAB
      { id: "fab", isFab: true },
      {
        id: "programs",
        label: "Programs",
        icon: Calendar,
        path: "/programs",
        isActive: pathname.startsWith("/programs"),
      },
      {
        id: "progress",
        label: "Insights",
        icon: TrendingUp,
        path: "/insights",
        isActive: pathname === "/insights",
      },
    ],
    [pathname],
  );

  const handleTabClick = useCallback(
    (tab) => {
      haptics.light();
      navigate(tab.path);
    },
    [navigate],
  );

  const handleFabClick = () => {
    haptics.light();
    setShowQuickActions(!showQuickActions);
  };

  const handleQuickAction = (path) => {
    haptics.light();
    setShowQuickActions(false);
    navigate(path);
  };

  return (
    <>
      {/* Quick Actions Sheet */}
      <AnimatePresence>
        {showQuickActions && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowQuickActions(false)}
            />

            {/* Action Sheet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-x-4 bottom-20 z-50 space-y-1 rounded-lg border border-border bg-surface p-2"
            >
              <button
                onClick={() =>
                  handleQuickAction("/practice?session=morning-energizer")
                }
                className="flex w-full items-center gap-3 rounded-md p-3 transition-colors hover:bg-surface-elevated"
              >
                <div className="flex size-10 items-center justify-center rounded-md bg-accent/10">
                  <Play className="size-5 text-accent" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">
                    Quick Session
                  </p>
                  <p className="text-xs text-muted-foreground">
                    5 min morning flow
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleQuickAction("/breathing")}
                className="flex w-full items-center gap-3 rounded-md p-3 transition-colors hover:bg-surface-elevated"
              >
                <div className="flex size-10 items-center justify-center rounded-md bg-state-success/10">
                  <Wind className="size-5 text-state-success" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">
                    Breathing
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Calm your mind
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleQuickAction("/sessions/builder")}
                className="flex w-full items-center gap-3 rounded-md p-3 transition-colors hover:bg-surface-elevated"
              >
                <div className="flex size-10 items-center justify-center rounded-md bg-accent-secondary/10">
                  <Plus className="size-5 text-accent-secondary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">
                    Custom Session
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Build your own
                  </p>
                </div>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav
        className={cx(
          "fixed inset-x-0 bottom-0 z-40",
          "bg-background/95 backdrop-blur-md",
          "border-t border-border",
          "pb-safe-bottom",
          className,
        )}
      >
        <div className="mx-auto flex h-14 max-w-md items-stretch justify-around">
          {tabs.map((tab) => {
            // Floating Action Button
            if (tab.isFab) {
              return (
                <div
                  key={tab.id}
                  className="flex items-center justify-center px-2"
                >
                  <motion.button
                    onClick={handleFabClick}
                    className={cx(
                      "flex h-12 w-12 items-center justify-center rounded-full",
                      "bg-accent text-accent-foreground",
                      "shadow-glow-sm hover:shadow-glow-md",
                      "transition-all duration-150",
                      showQuickActions && "rotate-45",
                    )}
                    whileTap={{ scale: 0.95 }}
                    animate={{ rotate: showQuickActions ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {showQuickActions ? (
                      <X className="size-5" />
                    ) : (
                      <Plus className="size-5" />
                    )}
                  </motion.button>
                </div>
              );
            }

            const Icon = tab.icon;
            const isActive = tab.isActive;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={cx(
                  "flex flex-1 flex-col items-center justify-center",
                  "min-h-[44px] px-2",
                  "transition-all duration-150",
                  "relative",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
                )}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={cx(
                    "mb-0.5 h-5 w-5",
                    isActive ? "text-accent" : "text-muted-foreground",
                    "transition-colors duration-150",
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={cx(
                    "text-[10px] font-medium",
                    isActive ? "text-accent" : "text-muted-foreground",
                    "transition-colors duration-150",
                  )}
                >
                  {tab.label}
                </span>

                {/* Active indicator - top bar */}
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
});

BottomNav.displayName = "BottomNav";

export default BottomNav;
