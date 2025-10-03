import { useReducer, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button, Text, ContentBody } from "../components/design-system";
import { PracticeLayout } from "../components/layouts";
import BreathingGuide from "../components/BreathingGuide";
import { PracticeHeader } from "../components/headers";
import {
  getBreathingExerciseById,
  calculateBreathingCycles,
} from "../data/breathing";
import useProgressStore from "../stores/progress";
import usePreferencesStore from "../stores/preferences";
import MoodTracker from "../components/MoodTracker";
import useTranslation from "../hooks/useTranslation";

// Action types
const ACTIONS = {
  START_PRACTICE: "START_PRACTICE",
  PAUSE_PRACTICE: "PAUSE_PRACTICE",
  RESUME_PRACTICE: "RESUME_PRACTICE",
  COMPLETE_CYCLE: "COMPLETE_CYCLE",
  COMPLETE_SESSION: "COMPLETE_SESSION",
  RESET_PRACTICE: "RESET_PRACTICE",
  DECREMENT_TIMER: "DECREMENT_TIMER",
  SHOW_POST_MOOD_TRACKER: "SHOW_POST_MOOD_TRACKER",
  HIDE_PRE_MOOD_TRACKER: "HIDE_PRE_MOOD_TRACKER",
  HIDE_POST_MOOD_TRACKER: "HIDE_POST_MOOD_TRACKER",
  SET_PRE_MOOD_DATA: "SET_PRE_MOOD_DATA",
};

// Initial state factory (for React Compiler compatibility with params)
const createInitialState = (duration, showMoodCheck) => ({
  isActive: false,
  currentCycle: 0,
  timeRemaining: duration * 60, // convert to seconds
  sessionStarted: false,
  isPaused: false,
  showPreMoodTracker: showMoodCheck,
  showPostMoodTracker: false,
  preMoodData: null,
});

// Reducer function (defined outside component for React Compiler compatibility)
function breathingPracticeReducer(state, action) {
  switch (action.type) {
    case ACTIONS.START_PRACTICE:
      return {
        ...state,
        isActive: true,
        sessionStarted: true,
        isPaused: false,
      };

    case ACTIONS.PAUSE_PRACTICE:
      return {
        ...state,
        isActive: false,
        isPaused: true,
      };

    case ACTIONS.RESUME_PRACTICE:
      return {
        ...state,
        isActive: true,
        isPaused: false,
      };

    case ACTIONS.COMPLETE_CYCLE: {
      const newCycle = state.currentCycle + 1;
      // Check if session is complete (handled by caller)
      return {
        ...state,
        currentCycle: newCycle,
      };
    }

    case ACTIONS.COMPLETE_SESSION:
      return {
        ...state,
        isActive: false,
        isPaused: false,
      };

    case ACTIONS.RESET_PRACTICE:
      return {
        ...state,
        isActive: false,
        sessionStarted: false,
        isPaused: false,
        currentCycle: 0,
        timeRemaining: action.payload.duration * 60,
      };

    case ACTIONS.DECREMENT_TIMER:
      return {
        ...state,
        timeRemaining: Math.max(0, state.timeRemaining - 1),
      };

    case ACTIONS.SHOW_POST_MOOD_TRACKER:
      return {
        ...state,
        showPostMoodTracker: true,
      };

    case ACTIONS.HIDE_PRE_MOOD_TRACKER:
      return {
        ...state,
        showPreMoodTracker: false,
      };

    case ACTIONS.HIDE_POST_MOOD_TRACKER:
      return {
        ...state,
        showPostMoodTracker: false,
      };

    case ACTIONS.SET_PRE_MOOD_DATA:
      return {
        ...state,
        preMoodData: action.payload,
      };

    default:
      return state;
  }
}

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
  const { breathing: breathingPrefs, toggleBreathingMoodCheck } =
    usePreferencesStore();
  const { t } = useTranslation();

  // URL parameters
  const exerciseId = searchParams.get("exercise") || "box-breathing";
  const duration = parseInt(searchParams.get("duration")) || 3;

  // Get exercise data
  const exercise = getBreathingExerciseById(exerciseId);

  // Calculate total cycles (needed for reducer initialization)
  const totalCycles = exercise
    ? calculateBreathingCycles(exercise, duration)
    : 0;

  // Initialize reducer with lazy initialization - MUST be called before any early returns
  const [state, dispatch] = useReducer(
    breathingPracticeReducer,
    { duration, showMoodCheck: breathingPrefs.showMoodCheck },
    ({ duration, showMoodCheck }) =>
      createInitialState(duration, showMoodCheck),
  );

  // Refs for tracking - MUST be called before any early returns
  const sessionStartTimeRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Redirect if exercise not found
  useEffect(() => {
    if (!exercise) {
      navigate("/breathing");
    }
  }, [exercise, navigate]);

  // Watch for timer reaching zero
  useEffect(() => {
    if (state.timeRemaining <= 0 && state.sessionStarted) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      // Show post-practice mood tracker if enabled, otherwise complete immediately
      if (breathingPrefs.showMoodCheck) {
        dispatch({ type: ACTIONS.SHOW_POST_MOOD_TRACKER });
      } else {
        // Complete session without mood tracking
        const actualDuration = sessionStartTimeRef.current
          ? Math.round((Date.now() - sessionStartTimeRef.current) / 1000 / 60)
          : duration;

        const sessionData = {
          exerciseId: exercise?.id,
          exerciseName: exercise?.nameEnglish,
          duration: actualDuration,
          targetCycles: totalCycles,
          completedCycles: state.currentCycle,
          category: exercise?.category,
        };

        completeBreathingSession(sessionData);

        navigate("/complete", {
          state: {
            sessionType: "breathing",
            exerciseName: exercise?.nameEnglish,
            duration: actualDuration,
            completedCycles: state.currentCycle,
            targetCycles: totalCycles,
          },
        });
      }
    }
  }, [
    state.timeRemaining,
    state.sessionStarted,
    breathingPrefs.showMoodCheck,
    dispatch,
    exercise,
    totalCycles,
    state.currentCycle,
    duration,
    completeBreathingSession,
    navigate,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Early return if exercise not found - AFTER all hooks
  if (!exercise) {
    return null;
  }

  // Helper function to complete session and navigate
  const completeAndNavigate = (preMoodData = null, postMoodData = null) => {
    // Calculate actual practice time
    const actualDuration = sessionStartTimeRef.current
      ? Math.round((Date.now() - sessionStartTimeRef.current) / 1000 / 60)
      : duration;

    // Prepare session data
    const sessionData = {
      exerciseId: exercise.id,
      exerciseName: exercise.nameEnglish,
      duration: actualDuration,
      targetCycles: totalCycles,
      completedCycles: state.currentCycle,
      category: exercise.category,
    };

    // Add mood data if provided
    if (preMoodData || postMoodData) {
      sessionData.preMood = preMoodData?.mood?.value;
      sessionData.preEnergy = preMoodData?.energy?.value;
      sessionData.postMood = postMoodData?.mood?.value;
      sessionData.postEnergy = postMoodData?.energy?.value;
    }

    // Record completion in progress store
    completeBreathingSession(sessionData);

    // Navigate to completion screen
    navigate("/complete", {
      state: {
        sessionType: "breathing",
        exerciseName: exercise.nameEnglish,
        duration: actualDuration,
        completedCycles: state.currentCycle,
        targetCycles: totalCycles,
        ...(preMoodData && { preMoodData }),
        ...(postMoodData && { postMoodData }),
      },
    });
  };

  // Handle cycle completion from BreathingGuide
  const handleCycleComplete = () => {
    dispatch({ type: ACTIONS.COMPLETE_CYCLE });

    // Check if session is complete after dispatching
    const newCycle = state.currentCycle + 1;
    if (newCycle >= totalCycles) {
      handleSessionComplete();
    }
  };

  // Start session
  const handleStart = () => {
    dispatch({ type: ACTIONS.START_PRACTICE });
    sessionStartTimeRef.current = Date.now();

    // Start timer countdown
    timerIntervalRef.current = setInterval(() => {
      dispatch({ type: ACTIONS.DECREMENT_TIMER });
    }, 1000);
  };

  // Pause session
  const handlePause = () => {
    dispatch({ type: ACTIONS.PAUSE_PRACTICE });

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Resume session
  const handleResume = () => {
    dispatch({ type: ACTIONS.RESUME_PRACTICE });

    // Restart timer
    timerIntervalRef.current = setInterval(() => {
      dispatch({ type: ACTIONS.DECREMENT_TIMER });
    }, 1000);
  };

  // Complete session
  const handleSessionComplete = () => {
    dispatch({ type: ACTIONS.COMPLETE_SESSION });

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // Show post-practice mood tracker if enabled, otherwise complete immediately
    if (breathingPrefs.showMoodCheck) {
      dispatch({ type: ACTIONS.SHOW_POST_MOOD_TRACKER });
    } else {
      // Complete session without mood tracking
      completeAndNavigate();
    }
  };

  // Reset session
  const handleReset = () => {
    dispatch({ type: ACTIONS.RESET_PRACTICE, payload: { duration } });
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
    navigate("/breathing");
  };

  // Handle pre-practice mood tracking completion
  const handlePreMoodComplete = (moodData) => {
    dispatch({ type: ACTIONS.SET_PRE_MOOD_DATA, payload: moodData });
    dispatch({ type: ACTIONS.HIDE_PRE_MOOD_TRACKER });
  };

  // Handle pre-practice mood tracking skip
  const handlePreMoodSkip = () => {
    dispatch({ type: ACTIONS.HIDE_PRE_MOOD_TRACKER });
  };

  // Handle post-practice mood tracking completion
  const handlePostMoodComplete = (moodData) => {
    dispatch({ type: ACTIONS.HIDE_POST_MOOD_TRACKER });
    // Complete session with mood data
    completeAndNavigate(state.preMoodData, moodData);
  };

  // Handle post-practice mood tracking skip
  const handlePostMoodSkip = () => {
    dispatch({ type: ACTIONS.HIDE_POST_MOOD_TRACKER });
    // Complete session without mood data
    completeAndNavigate();
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!exercise) {
    return (
      <PracticeLayout>
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="text-center">
            <Text variant="body">Exercise not found</Text>
            <Button onClick={() => navigate("/breathing")} className="mt-4">
              Back to Breathing Exercises
            </Button>
          </div>
        </div>
      </PracticeLayout>
    );
  }

  // Don't render main practice interface if mood tracker is showing
  if (state.showPreMoodTracker && breathingPrefs.showMoodCheck) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <MoodTracker
          title={t("screens.practice.howFeelingBefore")}
          onComplete={handlePreMoodComplete}
          onSkip={handlePreMoodSkip}
          onDontShowAgain={toggleBreathingMoodCheck}
          isPostPractice={false}
        />
      </div>
    );
  }

  if (state.showPostMoodTracker) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <MoodTracker
          title={t("screens.practice.howFeelingAfter")}
          onComplete={handlePostMoodComplete}
          onSkip={handlePostMoodSkip}
          onDontShowAgain={toggleBreathingMoodCheck}
          isPostPractice={true}
        />
      </div>
    );
  }

  // Calculate progress percentage
  const progressPercent =
    totalCycles > 0 ? (state.currentCycle / totalCycles) * 100 : 0;

  // Render header
  const renderHeader = () => (
    <PracticeHeader
      title={exercise.nameEnglish}
      onExit={handleExit}
      exitButtonStyle="circular"
      progressBar={
        <div className="h-1.5 rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      }
    />
  );

  // Render footer with controls
  const renderFooter = () => (
    <div className="border-t border-border bg-background px-4 pb-4 pt-6">
      <div className="mx-auto flex max-w-sm items-center justify-center gap-6">
        {/* Reset button - always visible, disabled before start */}
        <button
          onClick={handleReset}
          disabled={!state.sessionStarted}
          className="flex size-12 items-center justify-center rounded-full bg-muted/40 text-muted-foreground backdrop-blur-md transition-all hover:scale-105 hover:bg-muted/50 hover:text-foreground active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
          aria-label="Reset"
        >
          <RotateCcw className="size-5" />
        </button>

        {/* Play/Pause button */}
        <button
          onClick={
            !state.sessionStarted
              ? handleStart
              : state.isPaused
                ? handleResume
                : handlePause
          }
          className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:bg-primary/90 active:scale-95"
          aria-label={
            !state.sessionStarted
              ? "Start practice"
              : state.isPaused
                ? "Resume"
                : "Pause"
          }
        >
          {!state.sessionStarted || state.isPaused ? (
            <Play className="ml-1 size-7" />
          ) : (
            <Pause className="size-7" />
          )}
        </button>

        {/* Spacer for symmetry */}
        <div className="w-12" />
      </div>
    </div>
  );

  return (
    <PracticeLayout header={renderHeader()} footer={renderFooter()}>
      <ContentBody size="sm" centered padding="md">
        {/* Timer and cycle info - above breathing circle */}
        <div className="my-4 text-center">
          {/* Cycle count - always visible */}
          <p className="mb-2 text-xs text-muted-foreground">
            {t("screens.breathingPractice.rounds")} {state.currentCycle}{" "}
            {t("common.of")} {totalCycles}
          </p>

          {/* Timer - always visible */}
          <div className="mb-2">
            <div className="text-2xl font-light text-foreground sm:text-3xl">
              {formatTime(state.timeRemaining)}
            </div>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {t("screens.practice.remaining")}
            </p>
          </div>
        </div>

        {/* Breathing guide - replaces PoseImage in yoga practice */}
        <div className="mx-auto flex items-center justify-center">
          <BreathingGuide
            exercise={exercise}
            isActive={state.isActive}
            onCycleComplete={handleCycleComplete}
          />
        </div>
      </ContentBody>
    </PracticeLayout>
  );
}

export default BreathingPractice;
