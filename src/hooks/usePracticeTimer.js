import { useState, useEffect, useRef } from 'react';
import { useTestMode } from './useTestMode';

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
 * @param {Object} params.currentPoseData - Current pose data with duration
 * @param {Object} params.session - Session data with poses array
 * @param {number} params.currentPoseIndex - Index of current pose
 * @param {number} params.restDuration - Rest period duration from preferences (seconds)
 * @param {Function} params.onSessionComplete - Callback when session completes
 *
 * @returns {Object} Timer state and controls
 */
export function usePracticeTimer({
  currentPoseData,
  session,
  currentPoseIndex,
  restDuration,
  onSessionComplete
}) {
  const { getEffectiveDuration } = useTestMode();

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(
    getEffectiveDuration(currentPoseData?.duration || 0)
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Rest period state
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);

  // Pose navigation state
  const [currentPoseIndexInternal, setCurrentPoseIndexInternal] = useState(currentPoseIndex);

  // Session timing for accurate progress tracking
  const sessionStartTimeRef = useRef(null);
  const [totalPracticeTime, setTotalPracticeTime] = useState(0); // in seconds
  const lastResumeTimeRef = useRef(null);

  // Sync internal pose index with prop
  useEffect(() => {
    setCurrentPoseIndexInternal(currentPoseIndex);
  }, [currentPoseIndex]);

  // Initialize timer when pose changes
  useEffect(() => {
    if (currentPoseData) {
      setTimeRemaining(getEffectiveDuration(currentPoseData.duration));
    }
  }, [currentPoseIndexInternal, currentPoseData, getEffectiveDuration]);

  // Timer countdown logic
  useEffect(() => {
    let interval;
    if (isPlaying && timeRemaining > 0 && !isResting) {
      // Get timer speed from test mode (default 1000ms = 1 second)
      const timerSpeed = (typeof window !== 'undefined' && window.__TIMER_SPEED__)
        ? 1000 / window.__TIMER_SPEED__ // e.g., 100x speed = 10ms intervals
        : 1000;

      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;

          if (newTime <= 0) {
            const isLastPose = session && currentPoseIndexInternal === session.poses.length - 1;

            if (isLastPose) {
              // Session complete - trigger callback
              setIsPlaying(false);
              if (onSessionComplete) {
                onSessionComplete();
              }
            } else if (restDuration > 0) {
              // Enter rest period
              const effectiveRestDuration = getEffectiveDuration(restDuration);
              setIsResting(true);
              setRestTimeRemaining(effectiveRestDuration);
              // Keep playing during rest
            } else {
              // No rest period - advance immediately
              setCurrentPoseIndexInternal(prevIndex => prevIndex + 1);
              // Keep playing - don't stop between poses
            }
            return 0;
          }
          return newTime;
        });
      }, timerSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, currentPoseIndexInternal, session, isResting, restDuration, getEffectiveDuration, onSessionComplete]);

  // Rest timer countdown logic
  useEffect(() => {
    let interval;
    if (isPlaying && isResting && restTimeRemaining > 0) {
      // Get timer speed from test mode
      const timerSpeed = (typeof window !== 'undefined' && window.__TIMER_SPEED__)
        ? 1000 / window.__TIMER_SPEED__
        : 1000;

      interval = setInterval(() => {
        setRestTimeRemaining((prev) => {
          const newTime = prev - 1;

          if (newTime <= 0) {
            // Rest complete - advance to next pose
            setIsResting(false);
            setCurrentPoseIndexInternal(prevIndex => prevIndex + 1);
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
        setTotalPracticeTime(prev => prev + elapsedSinceResume);
      }
    }

    setIsPlaying(!isPlaying);
  };

  /**
   * Advance to next pose or complete session.
   */
  const handleNextPose = () => {
    if (isResting) {
      // Skip rest period and advance to next pose immediately
      setIsResting(false);
      setRestTimeRemaining(0);
      setCurrentPoseIndexInternal(prev => prev + 1);
      return;
    }

    if (session && currentPoseIndexInternal < session.poses.length - 1) {
      setCurrentPoseIndexInternal(prev => prev + 1);
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
      setCurrentPoseIndexInternal(prev => prev - 1);
      // Keep playing - don't pause
    }
  };

  /**
   * Auto-start practice when triggered.
   */
  const startPractice = () => {
    const now = Date.now();
    setSessionStarted(true);
    sessionStartTimeRef.current = now;
    lastResumeTimeRef.current = now;
    setIsPlaying(true);
  };

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
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Calculate progress percentage for current pose.
   * @returns {number} Progress percentage (0-100)
   */
  const getProgressPercent = () => {
    if (!currentPoseData) return 0;
    return ((currentPoseData.duration - timeRemaining) / currentPoseData.duration) * 100;
  };

  return {
    // Timer state
    timeRemaining,
    isPlaying,
    sessionStarted,
    isResting,
    restTimeRemaining,
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
    getProgressPercent
  };
}
