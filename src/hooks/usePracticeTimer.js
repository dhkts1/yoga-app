import { useState, useEffect, useRef, useCallback } from "react";
import { useTestMode } from "./useTestMode";
import notificationService from "../services/notification";
import { haptics } from "../utils/haptics";
import usePreferencesStore from "../stores/preferences";

/**
 * Custom hook for managing practice timer state and logic.
 *
 * Handles:
 * - Pose timer countdown with play/pause
 * - Rest periods between poses
 * - Automatic pose advancement
 * - Session timing for progress tracking
 * - Test mode integration for E2E tests
 *
 * @param {Object} params - Hook configuration
 * @param {Object} params.session - Session data with poses array
 * @param {number} params.restDuration - Rest period duration from preferences (seconds)
 * @param {Function} params.onSessionComplete - Callback when session completes
 *
 * @returns {Object} Timer state and controls
 */
export function usePracticeTimer({ session, restDuration, onSessionComplete }) {
  const { getEffectiveDuration } = useTestMode();

  // Get transition notification settings from preferences
  // Select individual fields to avoid new object creation on every render
  const transitionBeepEnabled = usePreferencesStore(
    (state) => state.transitionBeepEnabled,
  );
  const transitionBeepVolume = usePreferencesStore(
    (state) => state.transitionBeepVolume,
  );
  const transitionBeepDelay = usePreferencesStore(
    (state) => state.transitionBeepDelay,
  );
  const transitionBeepFrequency = usePreferencesStore(
    (state) => state.transitionBeepFrequency,
  );
  const transitionVibrationEnabled = usePreferencesStore(
    (state) => state.transitionVibrationEnabled,
  );

  // Pose navigation state
  const [currentPoseIndexInternal, setCurrentPoseIndexInternal] = useState(0);

  // Derive current pose data from session and internal index
  const currentPoseData = session?.poses?.[currentPoseIndexInternal];

  // Track which pose index we're currently timing for
  const [timedPoseIndex, setTimedPoseIndex] = useState(-1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Rest period state
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);

  // Transition state (for beep + delay before advancing)
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimerRef = useRef(null);
  const beepPlayedRef = useRef(false); // Track if beep already played for current pose

  // Session timing for accurate progress tracking
  const sessionStartTimeRef = useRef(null);
  const [totalPracticeTime, setTotalPracticeTime] = useState(0); // in seconds
  const lastResumeTimeRef = useRef(null);

  // Refs to capture latest values for transition callback (prevents stale closures)
  const restDurationRef = useRef(restDuration);
  const getEffectiveDurationRef = useRef(getEffectiveDuration);
  const onSessionCompleteRef = useRef(onSessionComplete);
  const sessionRef = useRef(session);
  const transitionBeepDelayRef = useRef(transitionBeepDelay);

  // Keep refs in sync with latest values
  useEffect(() => {
    restDurationRef.current = restDuration;
    getEffectiveDurationRef.current = getEffectiveDuration;
    onSessionCompleteRef.current = onSessionComplete;
    sessionRef.current = session;
    transitionBeepDelayRef.current = transitionBeepDelay;
  }, [
    restDuration,
    getEffectiveDuration,
    onSessionComplete,
    session,
    transitionBeepDelay,
  ]);

  // Cleanup transition timer on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  // Reset timer when pose changes during render - React Compiler friendly
  if (
    currentPoseIndexInternal !== timedPoseIndex &&
    currentPoseData?.duration
  ) {
    setTimedPoseIndex(currentPoseIndexInternal);
    setTimeRemaining(getEffectiveDuration(currentPoseData.duration));
  }

  // Reset beep flag when pose changes - in effect to avoid ref mutation during render
  useEffect(() => {
    beepPlayedRef.current = false;
  }, [currentPoseIndexInternal]);

  // Timer countdown logic
  useEffect(() => {
    let interval;
    if (isPlaying && timeRemaining > 0 && !isResting && !isTransitioning) {
      // Get timer speed from test mode (default 1000ms = 1 second)
      const timerSpeed =
        typeof window !== "undefined" && window.__TIMER_SPEED__
          ? 1000 / window.__TIMER_SPEED__ // e.g., 100x speed = 10ms intervals
          : 1000;

      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;

          // Play beep at configured delay time remaining (advance warning)
          if (
            newTime === transitionBeepDelay &&
            !beepPlayedRef.current &&
            (transitionBeepEnabled || transitionVibrationEnabled)
          ) {
            beepPlayedRef.current = true;

            if (transitionBeepEnabled) {
              notificationService.loadSettings({
                enabled: true,
                volume: transitionBeepVolume,
                frequency: transitionBeepFrequency,
              });
              notificationService.playTransition();
            }

            if (transitionVibrationEnabled) {
              haptics.transition();
            }
          }

          if (newTime <= 0) {
            const isLastPose =
              sessionRef.current &&
              currentPoseIndexInternal === sessionRef.current.poses.length - 1;

            // Use transition delay if configured (read from ref to get latest value)
            const currentTransitionDelay = transitionBeepDelayRef.current;

            if (currentTransitionDelay > 0) {
              // Enter transitioning state with delay
              setIsTransitioning(true);

              // Wait for delay, then advance
              const effectiveDelay = getEffectiveDurationRef.current(
                currentTransitionDelay,
              );
              const delayMs =
                typeof window !== "undefined" && window.__TIMER_SPEED__
                  ? (effectiveDelay * 1000) / window.__TIMER_SPEED__
                  : effectiveDelay * 1000;

              // Clear any existing transition timer before setting new one
              if (transitionTimerRef.current) {
                clearTimeout(transitionTimerRef.current);
              }

              transitionTimerRef.current = setTimeout(() => {
                setIsTransitioning(false);

                if (isLastPose) {
                  // Session complete - trigger callback
                  setIsPlaying(false);
                  const callback = onSessionCompleteRef.current;
                  if (callback) {
                    callback();
                  }
                } else if (restDurationRef.current > 0) {
                  // Enter rest period
                  const effectiveRestDuration = getEffectiveDurationRef.current(
                    restDurationRef.current,
                  );
                  setIsResting(true);
                  setRestTimeRemaining(effectiveRestDuration);
                } else {
                  // No rest period - advance immediately
                  setCurrentPoseIndexInternal((prevIndex) => prevIndex + 1);
                }
              }, delayMs);
            } else {
              // No delay - advance immediately
              if (isLastPose) {
                // Session complete - trigger callback
                setIsPlaying(false);
                const callback = onSessionCompleteRef.current;
                if (callback) {
                  callback();
                }
              } else if (restDurationRef.current > 0) {
                // Enter rest period
                const effectiveRestDuration = getEffectiveDurationRef.current(
                  restDurationRef.current,
                );
                setIsResting(true);
                setRestTimeRemaining(effectiveRestDuration);
              } else {
                // No rest period - advance immediately
                setCurrentPoseIndexInternal((prevIndex) => prevIndex + 1);
              }
            }
            return 0;
          }
          return newTime;
        });
      }, timerSpeed);
    }
    return () => {
      clearInterval(interval);
      // NOTE: Do NOT clear transitionTimerRef.current here!
      // The transition timeout needs to complete even if the effect re-runs.
      // It will be cleared when a new transition starts (line 154-156).
    };
  }, [
    isPlaying,
    timeRemaining,
    currentPoseIndexInternal,
    isResting,
    isTransitioning,
    transitionBeepEnabled,
    transitionBeepVolume,
    transitionBeepDelay,
    transitionBeepFrequency,
    transitionVibrationEnabled,
  ]);

  // Rest timer countdown logic
  useEffect(() => {
    let interval;
    if (isPlaying && isResting && restTimeRemaining > 0) {
      // Get timer speed from test mode
      const timerSpeed =
        typeof window !== "undefined" && window.__TIMER_SPEED__
          ? 1000 / window.__TIMER_SPEED__
          : 1000;

      interval = setInterval(() => {
        setRestTimeRemaining((prev) => {
          const newTime = prev - 1;

          if (newTime <= 0) {
            // Rest complete - advance to next pose
            setIsResting(false);
            setCurrentPoseIndexInternal((prevIndex) => prevIndex + 1);
            return 0;
          }
          return newTime;
        });
      }, timerSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isResting, restTimeRemaining]);

  /**
   * Toggle play/pause state and track practice time.
   */
  const handlePlayPause = () => {
    const now = Date.now();

    if (!sessionStarted && !isPlaying) {
      // First time starting the session
      setSessionStarted(true);
      sessionStartTimeRef.current = now;
      lastResumeTimeRef.current = now;
    } else if (!isPlaying) {
      // Resuming from pause
      lastResumeTimeRef.current = now;
    } else {
      // Pausing - add elapsed time since last resume
      if (lastResumeTimeRef.current) {
        const elapsedSinceResume = (now - lastResumeTimeRef.current) / 1000;
        setTotalPracticeTime((prev) => prev + elapsedSinceResume);
      }
    }

    setIsPlaying(!isPlaying);
  };

  /**
   * Advance to next pose or complete session.
   * When skipping a pose, triggers rest period if configured (restDuration > 0).
   */
  const handleNextPose = () => {
    if (isResting) {
      // Skip rest period and advance to next pose immediately
      setIsResting(false);
      setRestTimeRemaining(0);
      setCurrentPoseIndexInternal((prev) => prev + 1);
      return;
    }

    if (session && currentPoseIndexInternal < session.poses.length - 1) {
      // Check if rest period should be triggered when skipping
      // Guard against undefined/NaN restDuration values
      const effectiveRestDuration = getEffectiveDuration(restDuration ?? 0);
      if (
        typeof effectiveRestDuration === "number" &&
        !isNaN(effectiveRestDuration) &&
        effectiveRestDuration > 0
      ) {
        // Enter rest period before advancing to next pose
        setIsResting(true);
        setRestTimeRemaining(effectiveRestDuration);
      } else {
        // No rest period - advance immediately
        setCurrentPoseIndexInternal((prev) => prev + 1);
      }
      // Keep playing - don't pause
    } else {
      // Session complete
      if (onSessionComplete) {
        onSessionComplete();
      }
    }
  };

  /**
   * Go back to previous pose.
   */
  const handlePreviousPose = () => {
    if (isResting) {
      // Cancel rest and go back to previous pose
      setIsResting(false);
      setRestTimeRemaining(0);
    }

    if (currentPoseIndexInternal > 0) {
      setCurrentPoseIndexInternal((prev) => prev - 1);
      // Keep playing - don't pause
    }
  };

  /**
   * Auto-start practice when triggered.
   */
  const startPractice = useCallback(() => {
    const now = Date.now();
    setSessionStarted(true);
    sessionStartTimeRef.current = now;
    lastResumeTimeRef.current = now;
    setIsPlaying(true);
  }, []);

  /**
   * Get final practice time including current active session.
   * @returns {number} Total practice time in seconds
   */
  const getFinalPracticeTime = () => {
    const now = Date.now();
    let finalPracticeTime = totalPracticeTime;

    // Add current active session time if playing
    if (lastResumeTimeRef.current) {
      finalPracticeTime += (now - lastResumeTimeRef.current) / 1000;
    }

    return finalPracticeTime;
  };

  /**
   * Format seconds as MM:SS.
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  /**
   * Calculate progress percentage for current pose.
   * @returns {number} Progress percentage (0-100)
   */
  const getProgressPercent = () => {
    if (!currentPoseData) return 0;
    return (
      ((currentPoseData.duration - timeRemaining) / currentPoseData.duration) *
      100
    );
  };

  return {
    // Timer state
    timeRemaining,
    isPlaying,
    sessionStarted,
    isResting,
    restTimeRemaining,
    isTransitioning,
    currentPoseIndex: currentPoseIndexInternal,
    totalPracticeTime,

    // Control functions
    handlePlayPause,
    handleNextPose,
    handlePreviousPose,
    startPractice,

    // Utility functions
    getFinalPracticeTime,
    formatTime,
    getProgressPercent,
  };
}
