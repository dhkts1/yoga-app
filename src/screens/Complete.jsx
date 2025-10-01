import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircle, Home, RotateCcw, Star, Wind, TrendingUp, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { getSessionById } from '../data/sessions';
import useProgressStore from '../stores/progress';
import { FullscreenLayout } from '../components/layouts';

function Complete() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const sessionId = searchParams.get('session') || 'morning-energizer';

  // Check if this is a breathing session from location state
  const isBreathingSession = location.state?.sessionType === 'breathing';
  const breathingExerciseName = location.state?.exerciseName;
  const breathingDuration = location.state?.duration;

  // Get mood data from location state
  const preMoodData = location.state?.preMoodData;
  const postMoodData = location.state?.postMoodData;
  const sessionMoodData = location.state?.sessionMoodData;

  const session = !isBreathingSession ? getSessionById(sessionId) : null;
  const { completeSession, getStreakStatus } = useProgressStore();

  const [sessionRecord, setSessionRecord] = useState(null);
  const [streakStatus, setStreakStatus] = useState(null);
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

  // Confetti celebration when component mounts
  useEffect(() => {
    if (!shouldReduceMotion) {
      const timer = setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8FA68E', '#D4AF37', '#B5C4B4', '#F5F3F0'],
          disableForReducedMotion: true,
        });
      }, 300); // Slight delay for better effect

      return () => clearTimeout(timer);
    }
  }, [shouldReduceMotion]);

  // Record session completion when component mounts
  useEffect(() => {
    if (!sessionRecord && (session || isBreathingSession)) {
      let record;

      if (isBreathingSession) {
        // Breathing session already recorded in BreathingPractice
        // Just get the streak status
        record = { id: 'breathing_session' };
      } else {
        // Get actual duration from URL params or fallback to theoretical duration
        const actualDuration = parseInt(searchParams.get('duration'));
        const fallbackDuration = Math.round(session.poses.reduce((total, pose) => total + pose.duration, 0) / 60);
        const durationInMinutes = actualDuration || fallbackDuration;

        // Record the yoga session with mood data
        record = completeSession({
          sessionId: session.id,
          sessionName: session.name,
          duration: durationInMinutes,
          poses: session.poses,
          ...(sessionMoodData || {})
        });
      }

      setSessionRecord(record);

      // Get updated streak status
      const status = getStreakStatus();
      setStreakStatus(status);

      // Check for any new achievements (they're included in the store already)
      // For demo purposes, we could show them here if needed
    }
  }, [session, sessionRecord, completeSession, getStreakStatus, isBreathingSession]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handlePracticeAgain = () => {
    if (isBreathingSession) {
      navigate('/breathing');
    } else {
      navigate(`/practice?session=${sessionId}`);
    }
  };

  // Helper function to get mood improvement message
  const getMoodImprovementMessage = () => {
    if (!preMoodData || !postMoodData) return null;

    const moodImprovement = postMoodData.mood.value - preMoodData.mood.value;
    const energyImprovement = postMoodData.energy.value - preMoodData.energy.value;

    if (moodImprovement > 0 && energyImprovement > 0) {
      return {
        icon: <Heart className="h-5 w-5 text-red-500" />,
        message: "Your mood and energy both improved!",
        detail: `Mood: ${preMoodData.mood.emoji} → ${postMoodData.mood.emoji} • Energy: +${energyImprovement}`,
        color: "bg-green-50 border-green-200 text-green-800"
      };
    } else if (moodImprovement > 0) {
      return {
        icon: <TrendingUp className="h-5 w-5 text-green-500" />,
        message: "Your mood improved!",
        detail: `${preMoodData.mood.emoji} → ${postMoodData.mood.emoji}`,
        color: "bg-green-50 border-green-200 text-green-800"
      };
    } else if (energyImprovement > 0) {
      return {
        icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
        message: "Your energy level increased!",
        detail: `Energy boost: +${energyImprovement}`,
        color: "bg-blue-50 border-blue-200 text-blue-800"
      };
    } else if (moodImprovement === 0 && energyImprovement === 0) {
      return {
        icon: <Star className="h-5 w-5 text-accent" />,
        message: "You maintained your positive state!",
        detail: "Consistency is key to wellbeing",
        color: "bg-amber-50 border-amber-200 text-amber-800"
      };
    } else {
      return {
        icon: <Heart className="h-5 w-5 text-sage-600" />,
        message: "Thank you for taking time for yourself",
        detail: "Every practice is valuable for your wellbeing",
        color: "bg-sage-50 border-sage-200 text-sage-800"
      };
    }
  };

  const moodImprovementInfo = getMoodImprovementMessage();

  return (
    <FullscreenLayout
      showBottomNav={false}
      centered={true}
      contentClassName="px-4 py-8"
    >
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Success Icon with fade-in animation */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {isBreathingSession ? (
            <motion.div
              animate={shouldReduceMotion ? {} : { rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Wind className="mx-auto mb-4 h-20 w-20 text-primary" />
            </motion.div>
          ) : (
            <motion.div
              animate={shouldReduceMotion ? {} : { scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <CheckCircle className="mx-auto mb-4 h-20 w-20 text-primary" />
            </motion.div>
          )}
          <h1 className="mb-2 text-2xl font-medium text-primary">
            {isBreathingSession ? 'Breathing Complete!' : 'Practice Complete!'}
          </h1>
          <p className="text-secondary">
            You completed {isBreathingSession ? breathingExerciseName : `the ${session?.name || 'session'}`}
          </p>
          {isBreathingSession && breathingDuration && (
            <p className="text-sm text-secondary mt-1">
              {breathingDuration} minute session
            </p>
          )}
        </motion.div>

        {/* Encouragement with Progress - with pulse animation */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-lg text-primary">
            Beautiful work!
          </p>
          {streakStatus && (
            <motion.div
              className="mt-3 p-3 bg-cream-100 rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <p className="text-sm text-primary font-medium">
                {streakStatus.message}
              </p>
              {streakStatus.streak > 0 && (
                <div className="flex items-center justify-center mt-2 space-x-1">
                  {Array.from({ length: Math.min(streakStatus.streak, 7) }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.7 + i * 0.05 }}
                    >
                      <Star
                        className="h-4 w-4 text-accent fill-current"
                      />
                    </motion.div>
                  ))}
                  {streakStatus.streak > 7 && (
                    <span className="text-xs text-accent font-medium ml-1">
                      +{streakStatus.streak - 7}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          )}
          <p className="mt-2 text-sm text-secondary">
            You've taken an important step in your mindfulness journey
          </p>
        </motion.div>

        {/* Mood Improvement Display with fade-in */}
        {moodImprovementInfo && (
          <motion.div
            className={`mb-6 w-full rounded-lg border p-4 ${moodImprovementInfo.color}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="flex items-center space-x-3">
              {moodImprovementInfo.icon}
              <div className="flex-1">
                <p className="font-medium text-sm">
                  {moodImprovementInfo.message}
                </p>
                <p className="text-xs opacity-80 mt-1">
                  {moodImprovementInfo.detail}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="w-full space-y-4">
          <button
            onClick={handleGoHome}
            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-primary px-6 py-3 text-white shadow-sm transition-all duration-300 hover:bg-primary/90 active:scale-95"
          >
            <Home className="h-5 w-5" />
            <span>Back to Home</span>
          </button>

          <button
            onClick={handlePracticeAgain}
            className="flex w-full items-center justify-center space-x-2 rounded-lg border border-primary px-6 py-3 text-primary transition-all duration-300 hover:bg-primary/5 active:scale-95"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Practice Again</span>
          </button>
        </div>
      </div>

      {/* Subtle celebration animation */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-accent/10 animate-breathe"></div>
        <div className="absolute -bottom-20 -left-20 h-32 w-32 rounded-full bg-primary/10 animate-breathe" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 left-1/4 h-6 w-6 rounded-full bg-accent/20 animate-breathe" style={{animationDelay: '1s'}}></div>
      </div>
    </FullscreenLayout>
  );
}

export default Complete;