import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button, Text } from '../components/design-system';
import { PracticeLayout } from '../components/layouts';
import BreathingGuide from '../components/BreathingGuide';
import { PracticeHeader } from '../components/headers';
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

  // Calculate progress percentage
  const progressPercent = totalCycles > 0 ? (currentCycle / totalCycles) * 100 : 0;

  // Render header
  const renderHeader = () => (
    <PracticeHeader
      title={exercise.nameEnglish}
      onExit={handleExit}
      exitButtonStyle="circular"
      progressBar={
        sessionStarted && (
          <div className="h-1.5 rounded-full bg-cream-200">
            <div
              className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )
      }
    />
  );

  // Render footer with controls
  const renderFooter = () => (
    <div className="px-4 pt-6 pb-4 bg-background border-t border-cream-200">
      <div className="flex items-center justify-center gap-6 max-w-sm mx-auto">
        {!sessionStarted ? (
          <button
            onClick={handleStart}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 active:scale-95 transition-transform"
            aria-label="Start practice"
          >
            <Play className="h-7 w-7 ml-1" />
          </button>
        ) : (
          <>
            <button
              onClick={handleReset}
              className="flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md bg-sage-50/40 text-sage-700 hover:text-sage-900 hover:bg-sage-100/50 transition-all hover:scale-105 active:scale-95"
              aria-label="Reset"
            >
              <RotateCcw className="h-5 w-5" />
            </button>

            <button
              onClick={isPaused ? handleResume : handlePause}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 active:scale-95 transition-transform"
              aria-label={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? (
                <Play className="h-7 w-7 ml-1" />
              ) : (
                <Pause className="h-7 w-7" />
              )}
            </button>

            <div className="w-12" /> {/* Spacer for symmetry */}
          </>
        )}
      </div>
    </div>
  );

  return (
    <PracticeLayout
      header={renderHeader()}
      footer={renderFooter()}
      contentClassName="px-4 pb-6"
    >
      {/* Timer and cycle info - above breathing circle */}
      <div className="text-center mb-4 mt-4">
        {/* Cycle count */}
        {sessionStarted && (
          <p className="text-xs text-sage-500 mb-2">
            Cycle {currentCycle} of {totalCycles}
          </p>
        )}

        {/* Timer */}
        <div className="mb-2">
          <div className="text-2xl sm:text-3xl font-light text-primary">
            {formatTime(timeRemaining)}
          </div>
          <p className="text-xs sm:text-sm text-secondary">remaining</p>
        </div>
      </div>

      {/* Breathing guide - replaces PoseImage in yoga practice */}
      <div className="mx-auto mb-3 flex items-center justify-center">
        <BreathingGuide
          exercise={exercise}
          isActive={isActive}
          onCycleComplete={handleCycleComplete}
          currentCycle={currentCycle}
          totalCycles={totalCycles}
        />
      </div>

      {/* Exercise Info - matches pose info structure */}
      <div className="text-center">
        <h2 className="mb-1 text-lg sm:text-xl font-medium text-primary">
          {exercise.nameEnglish}
        </h2>
        <p className="mb-1 text-xs sm:text-sm text-secondary italic">
          {exercise.nameSanskrit}
        </p>

        {/* Exercise description - matches pose description */}
        {exercise.description && (
          <p className="hidden sm:block mb-3 text-sm text-sage-700 px-4 leading-relaxed">
            {exercise.description}
          </p>
        )}
      </div>
    </PracticeLayout>
  );
}

export default BreathingPractice;