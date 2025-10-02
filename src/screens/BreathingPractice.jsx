import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, HeartOff } from 'lucide-react';
import { Button, Text } from '../components/design-system';
import { PracticeLayout } from '../components/layouts';
import BreathingGuide from '../components/BreathingGuide';
import { PracticeHeader } from '../components/headers';
import GlassIconButton from '../components/ui/GlassIconButton';
import { getBreathingExerciseById, calculateBreathingCycles } from '../data/breathing';
import useProgressStore from '../stores/progress';
import usePreferencesStore from '../stores/preferences';
import MoodTracker from '../components/MoodTracker';

/**
 * BreathingPractice Screen
 *
 * Active breathing session with:
 * - Visual breathing guide animation
 * - Timer and progress tracking
 * - Pause/resume functionality
 * - Voice guidance (optional)
 * - Session completion flow
 */
function BreathingPractice() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { completeBreathingSession } = useProgressStore();
  const { breathing: breathingPrefs, toggleBreathingMoodCheck } = usePreferencesStore();

  // URL parameters
  const exerciseId = searchParams.get('exercise') || 'box-breathing';
  const duration = parseInt(searchParams.get('duration')) || 3;

  // Get exercise data
  const exercise = getBreathingExerciseById(exerciseId);
  const totalCycles = calculateBreathingCycles(exercise, duration);

  // Session state
  const [isActive, setIsActive] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // convert to seconds
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Mood tracking state
  const [showPreMoodTracker, setShowPreMoodTracker] = useState(breathingPrefs.showMoodCheck);
  const [showPostMoodTracker, setShowPostMoodTracker] = useState(false);
  const [preMoodData, setPreMoodData] = useState(null);

  // Refs for tracking
  const sessionStartTimeRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Handle cycle completion from BreathingGuide
  const handleCycleComplete = () => {
    setCurrentCycle(prev => {
      const newCycle = prev + 1;

      // Check if session is complete
      if (newCycle >= totalCycles) {
        handleSessionComplete();
        return totalCycles;
      }

      return newCycle;
    });
  };

  // Start session
  const handleStart = () => {
    setIsActive(true);
    setSessionStarted(true);
    setIsPaused(false);
    sessionStartTimeRef.current = Date.now();

    // Start timer countdown
    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          handleSessionComplete();
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

  // Pause session
  const handlePause = () => {
    setIsActive(false);
    setIsPaused(true);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Resume session
  const handleResume = () => {
    setIsActive(true);
    setIsPaused(false);

    // Restart timer
    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          handleSessionComplete();
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

  // Complete session
  const handleSessionComplete = () => {
    setIsActive(false);
    setIsPaused(false);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // Show post-practice mood tracker if enabled, otherwise complete immediately
    if (breathingPrefs.showMoodCheck) {
      setShowPostMoodTracker(true);
    } else {
      // Calculate actual practice time
      const actualDuration = sessionStartTimeRef.current
        ? Math.round((Date.now() - sessionStartTimeRef.current) / 1000 / 60)
        : duration;

      // Record completion without mood data
      completeBreathingSession({
        exerciseId: exercise.id,
        exerciseName: exercise.nameEnglish,
        duration: actualDuration,
        targetCycles: totalCycles,
        completedCycles: currentCycle,
        category: exercise.category
      });

      // Navigate to completion screen
      navigate('/complete', {
        state: {
          sessionType: 'breathing',
          exerciseName: exercise.nameEnglish,
          duration: actualDuration,
          completedCycles: currentCycle,
          targetCycles: totalCycles
        }
      });
    }
  };

  // Reset session
  const handleReset = () => {
    setIsActive(false);
    setSessionStarted(false);
    setIsPaused(false);
    setCurrentCycle(0);
    setTimeRemaining(duration * 60);
    sessionStartTimeRef.current = null;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Exit session
  const handleExit = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    navigate('/breathing');
  };

  // Handle pre-practice mood tracking completion
  const handlePreMoodComplete = (moodData) => {
    setPreMoodData(moodData);
    setShowPreMoodTracker(false);
  };

  // Handle pre-practice mood tracking skip
  const handlePreMoodSkip = () => {
    setShowPreMoodTracker(false);
  };

  // Handle post-practice mood tracking completion
  const handlePostMoodComplete = (moodData) => {
    setShowPostMoodTracker(false);

    // Calculate actual practice time
    const actualDuration = sessionStartTimeRef.current
      ? Math.round((Date.now() - sessionStartTimeRef.current) / 1000 / 60)
      : duration;

    // Record completion in progress store with mood data
    completeBreathingSession({
      exerciseId: exercise.id,
      exerciseName: exercise.nameEnglish,
      duration: actualDuration,
      targetCycles: totalCycles,
      completedCycles: currentCycle,
      category: exercise.category,
      preMood: preMoodData?.mood?.value,
      preEnergy: preMoodData?.energy?.value,
      postMood: moodData?.mood?.value,
      postEnergy: moodData?.energy?.value
    });

    // Navigate to completion screen with mood data
    navigate('/complete', {
      state: {
        sessionType: 'breathing',
        exerciseName: exercise.nameEnglish,
        duration: actualDuration,
        completedCycles: currentCycle,
        targetCycles: totalCycles,
        preMoodData,
        postMoodData: moodData
      }
    });
  };

  // Handle post-practice mood tracking skip
  const handlePostMoodSkip = () => {
    setShowPostMoodTracker(false);

    // Calculate actual practice time
    const actualDuration = sessionStartTimeRef.current
      ? Math.round((Date.now() - sessionStartTimeRef.current) / 1000 / 60)
      : duration;

    // Record completion in progress store without mood data
    completeBreathingSession({
      exerciseId: exercise.id,
      exerciseName: exercise.nameEnglish,
      duration: actualDuration,
      targetCycles: totalCycles,
      completedCycles: currentCycle,
      category: exercise.category
    });

    // Navigate to completion screen without mood data
    navigate('/complete', {
      state: {
        sessionType: 'breathing',
        exerciseName: exercise.nameEnglish,
        duration: actualDuration,
        completedCycles: currentCycle,
        targetCycles: totalCycles
      }
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!exercise) {
    return (
      <PracticeLayout>
        <div className="flex items-center justify-center min-h-full p-4">
          <div className="text-center">
            <Text variant="body">Exercise not found</Text>
            <Button onClick={() => navigate('/breathing')} className="mt-4">
              Back to Breathing Exercises
            </Button>
          </div>
        </div>
      </PracticeLayout>
    );
  }

  // Don't render main practice interface if mood tracker is showing
  if (showPreMoodTracker && breathingPrefs.showMoodCheck) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <MoodTracker
          title="How are you feeling before practice?"
          onComplete={handlePreMoodComplete}
          onSkip={handlePreMoodSkip}
          onDontShowAgain={toggleBreathingMoodCheck}
          isPostPractice={false}
        />
      </div>
    );
  }

  if (showPostMoodTracker) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <MoodTracker
          title="How do you feel after your practice?"
          onComplete={handlePostMoodComplete}
          onSkip={handlePostMoodSkip}
          onDontShowAgain={toggleBreathingMoodCheck}
          isPostPractice={true}
        />
      </div>
    );
  }

  // Render header
  const renderHeader = () => (
    <PracticeHeader
      title={exercise.nameEnglish}
      subtitle={exercise.nameSanskrit}
      onExit={handleExit}
      exitButtonStyle="circular"
      actions={
        <GlassIconButton
          icon={breathingPrefs.showMoodCheck ? Heart : HeartOff}
          onClick={toggleBreathingMoodCheck}
          label={breathingPrefs.showMoodCheck ? 'Mood check enabled' : 'Mood check disabled'}
          variant="circular"
          className={!breathingPrefs.showMoodCheck ? 'opacity-50' : ''}
        />
      }
    />
  );

  return (
    <PracticeLayout
      header={renderHeader()}
      scrollable={true}
      contentClassName="px-4 flex flex-col"
    >
      {/* Timer display */}
      <div className="text-center mb-4 mt-8">
        <div className="text-3xl sm:text-4xl font-light text-primary">
          {formatTime(timeRemaining)}
        </div>
        <p className="text-xs sm:text-sm text-secondary mt-1">remaining</p>
      </div>

      {/* Main breathing guide with integrated controls */}
      <div className="flex items-center justify-center mb-2 relative group">
        <BreathingGuide
          exercise={exercise}
          isActive={isActive}
          onCycleComplete={handleCycleComplete}
          currentCycle={currentCycle}
          totalCycles={totalCycles}
          onStart={handleStart}
          onPause={handlePause}
          onResume={handleResume}
          onReset={handleReset}
          sessionStarted={sessionStarted}
          isPaused={isPaused}
        />

        {/* Exercise description tooltip - shows on hover */}
        {!sessionStarted && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
              <p className="text-xs text-secondary">
                {exercise.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Spacer to push progress bar to bottom */}
      <div className="flex-1" />

      {/* Progress bar - positioned above navbar */}
      {sessionStarted && (
        <div className="pb-20 pt-4">
          <div className="flex justify-between items-center mb-2">
            <Text variant="caption" className="text-secondary">
              Cycle {currentCycle} of {totalCycles}
            </Text>
            <Text variant="caption" className="text-secondary">
              {Math.round((currentCycle / totalCycles) * 100)}%
            </Text>
          </div>
          <div className="w-full bg-cream-200 rounded-full h-2">
            <div
              className="bg-sage-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(currentCycle / totalCycles) * 100}%` }}
            />
          </div>
        </div>
      )}

    </PracticeLayout>
  );
}

export default BreathingPractice;