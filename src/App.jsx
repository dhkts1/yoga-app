import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import usePreferencesStore from "./stores/preferences";

// Eager-loaded screens (instant initial render for core UX)
import Welcome from "./screens/Welcome";
import Practice from "./screens/Practice";
import Complete from "./screens/Complete";

// Lazy-loaded screens (code-split for bundle optimization)
const Sessions = lazy(() => import("./screens/Sessions"));
const SessionDetail = lazy(() => import("./screens/SessionDetail"));
const SessionBuilder = lazy(() => import("./screens/SessionBuilder"));
const Breathing = lazy(() => import("./screens/Breathing"));
const BreathingPractice = lazy(() => import("./screens/BreathingPractice"));
const Insights = lazy(() => import("./screens/Insights"));
const Settings = lazy(() => import("./screens/Settings"));
const PoseLibrary = lazy(() => import("./screens/PoseLibrary"));
const Programs = lazy(() => import("./screens/Programs"));
const ProgramDetail = lazy(() => import("./screens/ProgramDetail"));
const WeekDetail = lazy(() => import("./screens/WeekDetail"));

import OfflineIndicator from "./components/design-system/OfflineIndicator";
import StorageWarning from "./components/StorageWarning";
import Onboarding from "./components/Onboarding";
// import InstallPrompt from './components/InstallPrompt'; // Not currently used
import AnimatedRoute from "./components/AnimatedRoute";
import ThemeProvider from "./components/ThemeProvider";
import RouteLoadingFallback from "./components/RouteLoadingFallback";
import ErrorBoundary from "./components/ErrorBoundary";
import SkipLink from "./components/SkipLink";
import { focusMainHeading } from "./utils/focusManagement";
import "./utils/errorLogging"; // Initialize error logging

// Routes configuration (eliminates boilerplate wrapper pattern)
const routes = [
  // Eager-loaded routes (core UX)
  { path: "/", component: Welcome },
  { path: "/practice", component: Practice },
  { path: "/complete", component: Complete },
  // Lazy-loaded routes (code-split)
  { path: "/sessions", component: Sessions },
  { path: "/sessions/:sessionId/preview", component: SessionDetail },
  { path: "/sessions/builder", component: SessionBuilder },
  { path: "/breathing", component: Breathing },
  { path: "/breathing/practice", component: BreathingPractice },
  { path: "/insights", component: Insights },
  { path: "/progress", component: Insights }, // Alias for insights
  { path: "/settings", component: Settings },
  { path: "/poses", component: PoseLibrary },
  { path: "/programs", component: Programs },
  { path: "/programs/:programId", component: ProgramDetail },
  { path: "/programs/:programId/week/:weekNumber", component: WeekDetail },
];

// Animated routes wrapper component
function AnimatedRoutes() {
  const location = useLocation();

  // Focus management for route changes (WCAG 2.1 AA)
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

    // Focus the main heading after route transition
    // This announces the new page to screen readers
    const timer = setTimeout(() => {
      focusMainHeading();
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes location={location} key={location.pathname}>
          {routes.map(({ path, component }) => (
            <Route
              key={path}
              path={path}
              element={
                <ErrorBoundary>
                  <AnimatedRoute component={component} />
                </ErrorBoundary>
              }
            />
          ))}
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  // Initialize language direction on app load
  useEffect(() => {
    const language = usePreferencesStore.getState().language;
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <SkipLink />
        <div
          id="main-content"
          className="min-h-screen overflow-x-hidden bg-background text-foreground"
        >
          <OfflineIndicator />
          <StorageWarning />
          <Onboarding />
          <AnimatedRoutes />
        </div>
        <Analytics />
        <SpeedInsights />
      </Router>
    </ThemeProvider>
  );
}

export default App;
