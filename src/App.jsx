import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';

// Eager-loaded screens (instant initial render for core UX)
import Welcome from './screens/Welcome';
import Practice from './screens/Practice';
import Complete from './screens/Complete';

// Lazy-loaded screens (code-split for bundle optimization)
const Sessions = lazy(() => import('./screens/Sessions'));
const SessionDetail = lazy(() => import('./screens/SessionDetail'));
const SessionBuilder = lazy(() => import('./screens/SessionBuilder'));
const Breathing = lazy(() => import('./screens/Breathing'));
const BreathingPractice = lazy(() => import('./screens/BreathingPractice'));
const Insights = lazy(() => import('./screens/Insights'));
const Settings = lazy(() => import('./screens/Settings'));
const PoseLibrary = lazy(() => import('./screens/PoseLibrary'));
const Programs = lazy(() => import('./screens/Programs'));
const ProgramDetail = lazy(() => import('./screens/ProgramDetail'));
const WeekDetail = lazy(() => import('./screens/WeekDetail'));

import OfflineIndicator from './components/design-system/OfflineIndicator';
import Onboarding from './components/Onboarding';
import AnimatedRoute from './components/AnimatedRoute';
import ThemeProvider from './components/ThemeProvider';
import RouteLoadingFallback from './components/RouteLoadingFallback';
import ErrorBoundary from './components/ErrorBoundary';
import SkipLink from './components/SkipLink';
import { focusMainHeading } from './utils/focusManagement';
import './utils/errorLogging'; // Initialize error logging

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
          <Route path="/" element={<ErrorBoundary><AnimatedRoute component={Welcome} /></ErrorBoundary>} />
          <Route path="/sessions" element={<ErrorBoundary><AnimatedRoute component={Sessions} /></ErrorBoundary>} />
          <Route path="/sessions/:sessionId/preview" element={<ErrorBoundary><AnimatedRoute component={SessionDetail} /></ErrorBoundary>} />
          <Route path="/sessions/builder" element={<ErrorBoundary><AnimatedRoute component={SessionBuilder} /></ErrorBoundary>} />
          <Route path="/practice" element={<ErrorBoundary><AnimatedRoute component={Practice} /></ErrorBoundary>} />
          <Route path="/breathing" element={<ErrorBoundary><AnimatedRoute component={Breathing} /></ErrorBoundary>} />
          <Route path="/breathing/practice" element={<ErrorBoundary><AnimatedRoute component={BreathingPractice} /></ErrorBoundary>} />
          <Route path="/insights" element={<ErrorBoundary><AnimatedRoute component={Insights} /></ErrorBoundary>} />
          <Route path="/progress" element={<ErrorBoundary><AnimatedRoute component={Insights} /></ErrorBoundary>} />
          <Route path="/settings" element={<ErrorBoundary><AnimatedRoute component={Settings} /></ErrorBoundary>} />
          <Route path="/complete" element={<ErrorBoundary><AnimatedRoute component={Complete} /></ErrorBoundary>} />
          <Route path="/poses" element={<ErrorBoundary><AnimatedRoute component={PoseLibrary} /></ErrorBoundary>} />
          <Route path="/programs" element={<ErrorBoundary><AnimatedRoute component={Programs} /></ErrorBoundary>} />
          <Route path="/programs/:programId" element={<ErrorBoundary><AnimatedRoute component={ProgramDetail} /></ErrorBoundary>} />
          <Route path="/programs/:programId/week/:weekNumber" element={<ErrorBoundary><AnimatedRoute component={WeekDetail} /></ErrorBoundary>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <SkipLink />
        <div id="main-content" className="min-h-screen bg-background text-foreground overflow-x-hidden">
          <OfflineIndicator />
          <Onboarding />
          <AnimatedRoutes />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
