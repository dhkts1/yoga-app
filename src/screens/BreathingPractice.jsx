import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Play, Pause, X, RotateCcw, Volume2, VolumeX, Heart, HeartOff } from 'lucide-react';
import { Button, Text, Heading } from '../components/design-system';
import { PracticeLayout } from '../components/layouts';
import BreathingGuide from '../components/BreathingGuide';
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
          isPostPractice={true}
        />
      </div>
    );
  }

  return (
    <PracticeLayout
      header={
        <div className="px-4 py-3 bg-white border-b border-sage-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExit}
                className="flex-shrink-0 p-2 -ml-2 text-sage-600 hover:text-sage-700"
              >
                <X className="h-6 w-6" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-medium text-sage-900 truncate">
                  {exercise.nameEnglish}
                </h1>
                <p className="text-sm text-secondary italic truncate">
                  {exercise.nameSanskrit}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 ml-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleBreathingMoodCheck}
                className={`p-2 ${breathingPrefs.showMoodCheck ? 'text-sage-600' : 'text-sage-400'}`}
                title={breathingPrefs.showMoodCheck ? 'Mood check enabled' : 'Mood check disabled'}
              >
                {breathingPrefs.showMoodCheck ? <Heart className="h-5 w-5" /> : <HeartOff className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-2 ${voiceEnabled ? 'text-sage-600' : 'text-sage-400'}`}
              >
                {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="p-2 text-sage-600"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      }
      contentClassName="flex flex-col bg-gradient-to-br from-sage-50 to-cream-50"
    >
      {/* Timer display */}
      <div className="text-center pt-6 pb-4">
        <Text variant="h1" className="text-3xl font-light text-sage-800">
          {formatTime(timeRemaining)}
        </Text>
        <Text variant="caption" className="text-secondary">
          {currentCycle} of {totalCycles} cycles completed
        </Text>
      </div>

      {/* Main breathing guide */}
      <div className="flex-1 flex items-center justify-center px-4">
        <BreathingGuide
          exercise={exercise}
          isActive={isActive}
          onCycleComplete={handleCycleComplete}
          currentCycle={currentCycle}
          totalCycles={totalCycles}
        />
      </div>

      {/* Exercise description when not active */}
      {!sessionStarted && (
        <div className="px-4 pb-6">
          <div className="max-w-md mx-auto text-center">
            <Text variant="body" className="text-secondary mb-4">
              {exercise.description}
            </Text>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Text variant="caption" className="font-medium mb-2 block">
                Breathing Pattern:
              </Text>
              <Text variant="caption" className="text-secondary">
                {exercise.pattern.inhale}s inhale • {exercise.pattern.holdIn}s hold • {exercise.pattern.exhale}s exhale • {exercise.pattern.holdOut}s rest
              </Text>
            </div>
          </div>
        </div>
      )}

      {/* Pause overlay */}
      {isPaused && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 text-center">
            <Heading level={3} className="mb-4">
              Practice Paused
            </Heading>
            <Text variant="body" className="text-secondary mb-6">
              Take your time. Resume when you're ready to continue.
            </Text>
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={handleResume}
                className="flex-1"
              >
                Resume
              </Button>
              <Button
                variant="secondary"
                onClick={handleExit}
                className="flex-1"
              >
                Exit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed action buttons at bottom */}
      <div className="fixed bottom-[60px] left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent pointer-events-none">
        <div className="max-w-sm mx-auto pointer-events-auto">
          {!sessionStarted ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handleStart}
              className="w-full shadow-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Practice
            </Button>
          ) : !isPaused && (
            <Button
              variant="secondary"
              size="lg"
              onClick={handlePause}
              className="w-full shadow-lg"
            >
              <Pause className="h-5 w-5 mr-2" />
              Pause
            </Button>
          )}
        </div>
      </div>
    </PracticeLayout>
  );
}

export default BreathingPractice;