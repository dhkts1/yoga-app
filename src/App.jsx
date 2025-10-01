import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Welcome from './screens/Welcome';
import Sessions from './screens/Sessions';
import SessionDetail from './screens/SessionDetail';
import SessionBuilder from './screens/SessionBuilder';
import Practice from './screens/Practice';
import Complete from './screens/Complete';
import Breathing from './screens/Breathing';
import BreathingPractice from './screens/BreathingPractice';
import Insights from './screens/Insights';
import Settings from './screens/Settings';
import PoseLibrary from './screens/PoseLibrary';
import Programs from './screens/Programs';
import ProgramDetail from './screens/ProgramDetail';
import WeekDetail from './screens/WeekDetail';
import OfflineIndicator from './components/design-system/OfflineIndicator';
import Onboarding from './components/Onboarding';

// Animated routes wrapper component
function AnimatedRoutes() {
  const location = useLocation();
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setShouldReduceMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Page transition variants - using only 2 keyframes for spring compatibility
  const pageVariants = shouldReduceMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3,
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Welcome />
            </motion.div>
          }
        />
        <Route
          path="/sessions"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Sessions />
            </motion.div>
          }
        />
        <Route
          path="/sessions/:sessionId/preview"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <SessionDetail />
            </motion.div>
          }
        />
        <Route
          path="/sessions/builder"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <SessionBuilder />
            </motion.div>
          }
        />
        <Route
          path="/practice"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Practice />
            </motion.div>
          }
        />
        <Route
          path="/breathing"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Breathing />
            </motion.div>
          }
        />
        <Route
          path="/breathing/practice"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <BreathingPractice />
            </motion.div>
          }
        />
        <Route
          path="/insights"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Insights />
            </motion.div>
          }
        />
        <Route
          path="/progress"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Insights />
            </motion.div>
          }
        />
        <Route
          path="/settings"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Settings />
            </motion.div>
          }
        />
        <Route
          path="/complete"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Complete />
            </motion.div>
          }
        />
        <Route
          path="/poses"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <PoseLibrary />
            </motion.div>
          }
        />
        <Route
          path="/programs"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Programs />
            </motion.div>
          }
        />
        <Route
          path="/programs/:programId"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ProgramDetail />
            </motion.div>
          }
        />
        <Route
          path="/programs/:programId/week/:weekNumber"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <WeekDetail />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-primary overflow-x-hidden">
        <OfflineIndicator />
        <Onboarding />
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
