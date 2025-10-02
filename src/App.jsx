import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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
import AnimatedRoute from './components/AnimatedRoute';
import ThemeProvider from './components/ThemeProvider';

// Animated routes wrapper component
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedRoute component={Welcome} />} />
        <Route path="/sessions" element={<AnimatedRoute component={Sessions} />} />
        <Route path="/sessions/:sessionId/preview" element={<AnimatedRoute component={SessionDetail} />} />
        <Route path="/sessions/builder" element={<AnimatedRoute component={SessionBuilder} />} />
        <Route path="/practice" element={<AnimatedRoute component={Practice} />} />
        <Route path="/breathing" element={<AnimatedRoute component={Breathing} />} />
        <Route path="/breathing/practice" element={<AnimatedRoute component={BreathingPractice} />} />
        <Route path="/insights" element={<AnimatedRoute component={Insights} />} />
        <Route path="/progress" element={<AnimatedRoute component={Insights} />} />
        <Route path="/settings" element={<AnimatedRoute component={Settings} />} />
        <Route path="/complete" element={<AnimatedRoute component={Complete} />} />
        <Route path="/poses" element={<AnimatedRoute component={PoseLibrary} />} />
        <Route path="/programs" element={<AnimatedRoute component={Programs} />} />
        <Route path="/programs/:programId" element={<AnimatedRoute component={ProgramDetail} />} />
        <Route path="/programs/:programId/week/:weekNumber" element={<AnimatedRoute component={WeekDetail} />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
          <OfflineIndicator />
          <Onboarding />
          <AnimatedRoutes />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
