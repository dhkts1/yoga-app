import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import usePreferencesStore from '../stores/preferences';

/**
 * Custom hook for managing mood tracking flow (pre/post practice).
 *
 * Handles:
 * - Pre-practice mood tracker visibility and completion
 * - Post-practice mood tracker visibility and completion
 * - Navigation to completion screen with mood data
 * - "Don't show again" preference management
 * - Skip functionality for both pre/post tracking
 *
 * @param {Object} params - Hook configuration
 * @param {string} params.sessionId - Session ID for navigation
 * @param {Function} params.getFinalPracticeTime - Function to get total practice time
 * @param {Object|null} params.programContext - Optional program context for navigation
 *
 * @returns {Object} Mood tracking state and handlers
 */
export function useMoodTracking({ sessionId, getFinalPracticeTime, programContext }) {
  const navigate = useNavigate();
  const { yoga } = usePreferencesStore();

  // Mood tracking state - initialize based on preferences
  const [showPreMoodTracker, setShowPreMoodTracker] = useState(yoga?.showMoodCheck ?? true);
  const [showPostMoodTracker, setShowPostMoodTracker] = useState(false);
  const [preMoodData, setPreMoodData] = useState(null);

  /**
   * Handle pre-practice mood tracking completion.
   * Stores mood data and hides the tracker to start practice.
   *
   * @param {Object} moodData - Mood data from MoodTracker component
   */
  const handlePreMoodComplete = (moodData) => {
    setPreMoodData(moodData);
    setShowPreMoodTracker(false);
  };

  /**
   * Handle pre-practice mood tracking skip.
   * Hides tracker without storing data.
   */
  const handlePreMoodSkip = () => {
    setShowPreMoodTracker(false);
  };

  /**
   * Handle "don't show mood tracker again" preference.
   * Updates global preferences to disable mood tracking.
   */
  const handleDontShowMoodAgain = () => {
    usePreferencesStore.getState().setYogaMoodCheck(false);
  };

  /**
   * Handle post-practice mood tracking completion.
   * Navigates to completion screen with full mood data.
   *
   * @param {Object} moodData - Post-practice mood data from MoodTracker
   */
  const handlePostMoodComplete = (moodData) => {
    setShowPostMoodTracker(false);

    // Get final practice time
    const finalPracticeTime = getFinalPracticeTime();

    // Navigate with mood data and program context in state
    navigate(`/complete?session=${sessionId}&duration=${Math.round(finalPracticeTime / 60)}`, {
      state: {
        preMoodData,
        postMoodData: moodData,
        sessionMoodData: {
          preMood: preMoodData?.mood?.value,
          preEnergy: preMoodData?.energy?.value,
          postMood: moodData?.mood?.value,
          postEnergy: moodData?.energy?.value
        },
        // Pass program context through if present
        ...(programContext && { programContext })
      }
    });
  };

  /**
   * Handle post-practice mood tracking skip.
   * Navigates to completion screen without mood data.
   */
  const handlePostMoodSkip = () => {
    setShowPostMoodTracker(false);

    // Get final practice time
    const finalPracticeTime = getFinalPracticeTime();

    navigate(`/complete?session=${sessionId}&duration=${Math.round(finalPracticeTime / 60)}`, {
      // Pass program context through if present
      ...(programContext && { state: { programContext } })
    });
  };

  /**
   * Trigger post-practice mood tracker.
   * Called when session completes.
   */
  const showPostMood = useCallback(() => {
    setShowPostMoodTracker(true);
  }, []);

  return {
    // State
    showPreMoodTracker,
    showPostMoodTracker,
    preMoodData,

    // Pre-practice handlers
    handlePreMoodComplete,
    handlePreMoodSkip,
    handleDontShowMoodAgain,

    // Post-practice handlers
    handlePostMoodComplete,
    handlePostMoodSkip,
    showPostMood
  };
}
