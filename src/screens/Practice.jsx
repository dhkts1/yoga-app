import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, X, HelpCircle } from 'lucide-react';
import { getSessionById } from '../data/sessions';
import { getPoseById } from '../data/poses';
import { getCustomSessionWithPoses } from '../data/customSessions';
import usePreferencesStore from '../stores/preferences';
import PoseImage from '../components/PoseImage';
import MoodTracker from '../components/MoodTracker';
import { PracticeLayout } from '../components/layouts';
import FeatureTooltip from '../components/FeatureTooltip';

function Practice() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const customSessionId = searchParams.get('customSession');

  // Refs for tooltip targeting
  const tipsButtonRef = useRef(null);

  // Load session based on type
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (customSessionId) {
      // Load custom session from localStorage
      try {
        const customSessions = JSON.parse(localStorage.getItem('customSessions') || '[]');
        const customSession = customSessions.find(s => s.id === customSessionId);
        if (customSession) {
          setSession(getCustomSessionWithPoses(customSession));
        } else {
          console.error('Custom session not found:', customSessionId);
          navigate('/sessions');
        }
      } catch (error) {
        console.error('Failed to load custom session:', error);
        navigate('/sessions');
      }
    } else {
      // Load pre-built session
      const prebuiltSession = getSessionById(sessionId || 'morning-energizer');
      setSession(prebuiltSession);
    }
  }, [sessionId, customSessionId, navigate]);
  // Preferences store for tooltips and mood tracking (must be before mood tracking state)
  const {
    isTooltipDismissed,
    dismissTooltip,
    getTooltipShownCount,
    yoga,
    restDuration,
  } = usePreferencesStore();

  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Rest period state
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);

  // Mood tracking state - initialize based on preferences
  const [showPreMoodTracker, setShowPreMoodTracker] = useState(yoga?.showMoodCheck ?? true);
  const [showPostMoodTracker, setShowPostMoodTracker] = useState(false);
  const [preMoodData, setPreMoodData] = useState(null);

  // Session timing for accurate progress tracking
  const sessionStartTimeRef = useRef(null);
  const [totalPracticeTime, setTotalPracticeTime] = useState(0); // in seconds
  const lastResumeTimeRef = useRef(null);

  // Tooltip visibility state
  const [showTipsTooltip, setShowTipsTooltip] = useState(false);

  // Initialize test mode from sessionStorage on mount (for E2E tests)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isTestMode = sessionStorage.getItem('__TEST_MODE__') === 'true';
      if (isTestMode) {
        window.__TEST_MODE__ = true;
        window.__TIMER_SPEED__ = parseInt(sessionStorage.getItem('__TIMER_SPEED__') || '100', 10);
      }
    }
  }, []); // Run once on mount

  const currentPoseData = session?.poses?.[currentPoseIndex];

  // For custom sessions, pose data is already included
  const pose = currentPoseData?.poseData ||
               (currentPoseData ? getPoseById(currentPoseData.poseId) : null);

  // Initialize timer with the first pose duration
  // In test mode, use much shorter durations for fast testing
  const getEffectiveDuration = (duration) => {
    if (typeof window !== 'undefined') {
      // Check sessionStorage FIRST (available during initial render, before useEffect runs)
      const isTestMode = sessionStorage.getItem('__TEST_MODE__') === 'true' || window.__TEST_MODE__;
      if (isTestMode) {
        // Ensure window properties are set for timer interval
        if (!window.__TEST_MODE__) {
          window.__TEST_MODE__ = true;
          window.__TIMER_SPEED__ = parseInt(sessionStorage.getItem('__TIMER_SPEED__') || '100', 10);
        }
        return 1; // 1 second per pose in test mode
      }
    }
    return duration;
  };

  const [timeRemaining, setTimeRemaining] = useState(
    getEffectiveDuration(currentPoseData?.duration || 0)
  );

  // Initialize timer when pose changes
  useEffect(() => {
    if (currentPoseData && pose) {
      setTimeRemaining(getEffectiveDuration(currentPoseData.duration));
    }
  }, [currentPoseIndex, currentPoseData, pose]);

  // Auto-start practice when mood tracker is dismissed
  useEffect(() => {
    if (!showPreMoodTracker && !sessionStarted && session && pose) {
      // Small delay to let the UI settle
      const timer = setTimeout(() => {
        const now = Date.now();
        setSessionStarted(true);
        sessionStartTimeRef.current = now;
        lastResumeTimeRef.current = now;
        setIsPlaying(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showPreMoodTracker, sessionStarted, session, pose]);

  // Check tooltip conditions for first practice session
  useEffect(() => {
    if (!sessionStarted) return;

    // Tooltip: Tips Icon
    // Show when: First 3 practices
    const tipsDismissed = isTooltipDismissed('tooltip-tips-icon');
    const tipsShownCount = getTooltipShownCount('tooltip-tips-icon');

    if (!tipsDismissed && tipsShownCount < 3 && !showTips) {
      const timer = setTimeout(() => {
        setShowTipsTooltip(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [sessionStarted, showTips, isTooltipDismissed, getTooltipShownCount]);

  // Handle Tips tooltip dismiss
  const handleTipsTooltipDismiss = () => {
    setShowTipsTooltip(false);
    dismissTooltip('tooltip-tips-icon');
  };

  // Timer countdown logic with voice coaching triggers
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
            const isLastPose = session && currentPoseIndex === session.poses.length - 1;

            if (isLastPose) {
              // Session complete - show post-practice mood tracker
              setShowPostMoodTracker(true);
              setIsPlaying(false);
            } else if (restDuration > 0) {
              // Enter rest period
              const effectiveRestDuration = getEffectiveDuration(restDuration);
              setIsResting(true);
              setRestTimeRemaining(effectiveRestDuration);
              // Keep playing during rest
            } else {
              // No rest period - advance immediately
              setCurrentPoseIndex(prevIndex => prevIndex + 1);
              // Keep playing - don't stop between poses
            }
            return 0;
          }
          return newTime;
        });
      }, timerSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, currentPoseIndex, session?.poses?.length || 0, isResting, restDuration]);

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
            setCurrentPoseIndex(prevIndex => prevIndex + 1);
            return 0;
          }
          return newTime;
        });
      }, timerSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isResting, restTimeRemaining]);

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

  const handleNextPose = () => {
    if (isResting) {
      // Skip rest period and advance to next pose immediately
      setIsResting(false);
      setRestTimeRemaining(0);
      setCurrentPoseIndex(prev => prev + 1);
      return;
    }

    if (session && currentPoseIndex < session.poses.length - 1) {
      setCurrentPoseIndex(prev => prev + 1);
      // Keep playing - don't pause
    } else {
      // Session complete

      // Show post-practice mood tracker instead of navigating immediately
      setShowPostMoodTracker(true);
    }
  };

  const handlePreviousPose = () => {
    if (isResting) {
      // Cancel rest and go back to previous pose
      setIsResting(false);
      setRestTimeRemaining(0);
    }

    if (currentPoseIndex > 0) {
      setCurrentPoseIndex(prev => prev - 1);
      // Keep playing - don't pause
    }
  };

  const handleExit = () => {
    // If user started the session but didn't complete it, we don't record progress
    // This maintains the principle that only completed sessions count toward progress
    navigate('/');
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

  // Handle don't show mood tracker again
  const handleDontShowMoodAgain = () => {
    usePreferencesStore.getState().setYogaMoodCheck(false);
  };

  // Handle post-practice mood tracking completion
  const handlePostMoodComplete = (moodData) => {
    setShowPostMoodTracker(false);

    // Navigate to Complete screen with mood data
    const now = Date.now();
    let finalPracticeTime = totalPracticeTime;

    // Add current active session time if playing
    if (lastResumeTimeRef.current) {
      finalPracticeTime += (now - lastResumeTimeRef.current) / 1000;
    }

    // Navigate with mood data in state
    navigate(`/complete?session=${sessionId}&duration=${Math.round(finalPracticeTime / 60)}`, {
      state: {
        preMoodData,
        postMoodData: moodData,
        sessionMoodData: {
          preMood: preMoodData?.mood?.value,
          preEnergy: preMoodData?.energy?.value,
          postMood: moodData?.mood?.value,
          postEnergy: moodData?.energy?.value
        }
      }
    });
  };

  // Handle post-practice mood tracking skip
  const handlePostMoodSkip = () => {
    setShowPostMoodTracker(false);

    // Navigate to Complete screen without mood data
    const now = Date.now();
    let finalPracticeTime = totalPracticeTime;

    // Add current active session time if playing
    if (lastResumeTimeRef.current) {
      finalPracticeTime += (now - lastResumeTimeRef.current) / 1000;
    }

    navigate(`/complete?session=${sessionId}&duration=${Math.round(finalPracticeTime / 60)}`);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = currentPoseData
    ? ((currentPoseData.duration - timeRemaining) / currentPoseData.duration) * 100
    : 0;

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg text-primary mb-2">Session not found</p>
          <button
            onClick={() => navigate('/sessions')}
            className="text-sage-600 hover:text-sage-700"
          >
            ← Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  if (!pose) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg text-primary">Loading pose...</p>
        </div>
      </div>
    );
  }

  // Don't render main practice interface if mood tracker is showing
  if (showPreMoodTracker) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <MoodTracker
          title="How are you feeling before practice?"
          onComplete={handlePreMoodComplete}
          onSkip={handlePreMoodSkip}
          onDontShowAgain={handleDontShowMoodAgain}
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
          onDontShowAgain={handleDontShowMoodAgain}
          isPostPractice={true}
        />
      </div>
    );
  }

  // Render header content
  const renderHeader = () => (
    <>
      {/* Header Controls */}
      <div className="flex items-center justify-between p-3 px-4 relative z-[60]">
        <button
          onClick={handleExit}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 text-sage-700 hover:bg-sage-200 transition-colors flex-shrink-0"
          aria-label="Exit practice"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center min-w-0 flex-1 mx-3">
          <h1 className="text-sm font-medium text-primary truncate">{session.name}</h1>
          <p className="text-xs text-secondary">
            {currentPoseIndex + 1} of {session?.poses?.length || 0}
          </p>
        </div>

        <div className="flex space-x-1 flex-shrink-0">
          <button
            ref={tipsButtonRef}
            onClick={() => {
              // Dismiss tooltip if opening tips
              if (!showTips && showTipsTooltip) {
                dismissTooltip('tooltip-tips-icon');
                setShowTipsTooltip(false);
              }
              setShowTips(!showTips);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 text-sage-700 hover:bg-sage-200 transition-colors"
            aria-label={showTips ? 'Close tips' : 'Show tips'}
          >
            <HelpCircle className="h-5 w-5" />
          </button>

          {/* Tooltip: Tips Icon */}
          <FeatureTooltip
            id="tooltip-tips-icon"
            content="Get form tips and alignment cues"
            position="bottom"
            target={tipsButtonRef}
            show={showTipsTooltip}
            onDismiss={handleTipsTooltipDismiss}
            delay={0}
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mx-4 mb-2 h-1.5 rounded-full bg-cream-200">
        <div
          className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </>
  );

  // Render footer content
  const renderFooter = () => (
    <div className="p-4">
      <div className="flex items-center justify-center gap-6 max-w-sm mx-auto">
        <button
          onClick={handlePreviousPose}
          disabled={currentPoseIndex === 0}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-700 hover:bg-sage-200 disabled:opacity-30 disabled:hover:bg-sage-100 transition-colors"
          aria-label="Previous pose"
        >
          <SkipBack className="h-5 w-5" />
        </button>

        <button
          onClick={handlePlayPause}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 active:scale-95"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="h-7 w-7" />
          ) : (
            <Play className="h-7 w-7 ml-1" />
          )}
        </button>

        <button
          onClick={handleNextPose}
          disabled={!session || currentPoseIndex === session.poses.length - 1}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-700 hover:bg-sage-200 disabled:opacity-30 disabled:hover:bg-sage-100 transition-colors"
          aria-label="Skip to next pose"
        >
          <SkipForward className="h-5 w-5" />
        </button>
      </div>

      {/* Next pose preview OR End Session button */}
      {session && currentPoseIndex < session.poses.length - 1 ? (
        <div className="mt-3 text-center">
          <p className="text-xs text-secondary">
            Next: {getPoseById(session.poses[currentPoseIndex + 1].poseId)?.nameEnglish}
          </p>
        </div>
      ) : session && currentPoseIndex === session.poses.length - 1 && (
        <div className="mt-3 flex justify-center">
          <button
            onClick={handleNextPose}
            className="px-6 py-2.5 rounded-full bg-sage-600 hover:bg-sage-700 text-white text-sm font-medium transition-colors"
          >
            End Session
          </button>
        </div>
      )}
    </div>
  );

  return (
    <PracticeLayout
      header={renderHeader()}
      footer={renderFooter()}
      contentClassName="px-4 pb-6"
    >
      {/* Pose illustration with beautiful SVG */}
      <div className="mx-auto mb-3 flex items-center justify-center">
        <PoseImage
          pose={pose}
          size="large"
          className="drop-shadow-lg"
        />
      </div>

      {/* Pose Info */}
      <div className="text-center">
        <h2 className="mb-1 text-lg sm:text-xl font-medium text-primary">
          {pose.nameEnglish}
        </h2>
        <p className="mb-1 text-xs sm:text-sm text-secondary italic">
          {pose.nameSanskrit}
        </p>

        {/* Timer */}
        <div className="mb-2">
          <div className="text-2xl sm:text-3xl font-light text-primary">
            {formatTime(timeRemaining)}
          </div>
          <p className="text-xs sm:text-sm text-secondary">remaining</p>
        </div>

        {/* Pose description - hidden on very small screens */}
        {pose.description && (
          <p className="hidden sm:block mb-3 text-sm text-sage-700 px-4 leading-relaxed">
            {pose.description}
          </p>
        )}
      </div>

      {/* Enhanced Tips Overlay */}
      {showTips && pose && (
        <div className="animate-fade-in fixed inset-x-4 bottom-32 max-h-[40vh] overflow-y-auto rounded-lg bg-white p-3 shadow-lg z-50 mx-safe-left mr-safe-right">
          <h3 className="mb-2 font-medium text-primary text-base">Pose Guidance</h3>

          {/* Benefits */}
          <div className="mb-3">
            <h4 className="text-sm font-medium text-sage-700 mb-1">Benefits:</h4>
            <ul className="space-y-1">
              {pose.benefits?.slice(0, 3).map((benefit, index) => (
                <li key={index} className="text-xs text-secondary">
                  • {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Form Tips */}
          <div className="mb-3">
            <h4 className="text-sm font-medium text-sage-700 mb-1">Alignment Tips:</h4>
            <ul className="space-y-1">
              {pose.tips?.map((tip, index) => (
                <li key={index} className="text-xs text-secondary">
                  • {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes */}
          {pose.commonMistakes && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-sage-700 mb-1">Avoid:</h4>
              <ul className="space-y-1">
                {pose.commonMistakes.slice(0, 2).map((mistake, index) => (
                  <li key={index} className="text-xs text-red-600">
                    • {mistake}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Breathing */}
          {pose.breathingCues && (
            <div className="p-2 bg-sage-50 rounded-md">
              <p className="text-xs text-sage-700">
                <span className="font-medium">Breathing:</span> {pose.breathingCues}
              </p>
            </div>
          )}
        </div>
      )}
    </PracticeLayout>
  );
}

export default Practice;