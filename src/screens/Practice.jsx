import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { HelpCircle, BookMarked } from 'lucide-react';
import { getSessionById } from '../data/sessions';
import { getPoseById } from '../data/poses';
import { getCustomSessionWithPoses } from '../data/customSessions';
import usePreferencesStore from '../stores/preferences';
import useCustomSessions from '../hooks/useCustomSessions';
import PoseImage from '../components/PoseImage';
import MoodTracker from '../components/MoodTracker';
import { PracticeLayout } from '../components/layouts';
import FeatureTooltip from '../components/FeatureTooltip';
import { PracticeHeader } from '../components/headers';
import { PracticeControls } from '../components/practice/PracticeControls';
import { PracticeTipsOverlay } from '../components/practice/PracticeTipsOverlay';
import { usePracticeTimer } from '../hooks/usePracticeTimer';
import { useMoodTracking } from '../hooks/useMoodTracking';

function Practice() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const customSessionId = searchParams.get('customSession');

  // Get program context from navigation state (if practicing as part of a program)
  const programContext = location.state?.programContext || null;
  const { programName, weekNumber, dayNumber } = programContext || {};

  // Refs for tooltip targeting
  const tipsButtonRef = useRef(null);

  // Use custom sessions hook
  const { getById: getCustomSessionById } = useCustomSessions();

  // Load session based on type
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (customSessionId) {
      // Load custom session using hook
      const customSession = getCustomSessionById(customSessionId);
      if (customSession) {
        setSession(getCustomSessionWithPoses(customSession));
      } else {
        console.error('Custom session not found:', customSessionId);
        navigate('/sessions');
      }
    } else {
      // Load pre-built session
      const prebuiltSession = getSessionById(sessionId || 'morning-energizer');
      setSession(prebuiltSession);
    }
  }, [sessionId, customSessionId, navigate, getCustomSessionById]);
  // Preferences store for tooltips and rest duration
  const {
    isTooltipDismissed,
    dismissTooltip,
    getTooltipShownCount,
    restDuration,
  } = usePreferencesStore();

  const [showTips, setShowTips] = useState(false);

  // Tooltip visibility state
  const [showTipsTooltip, setShowTipsTooltip] = useState(false);

  // Practice timer hook - manages timer, rest periods, and pose progression
  const timerHook = usePracticeTimer({
    currentPoseData: session?.poses?.[0], // Initial pose data
    session,
    currentPoseIndex: 0,
    restDuration,
    onSessionComplete: () => {
      // Trigger post-practice mood tracker when session completes
      moodHook.showPostMood();
    }
  });

  const {
    timeRemaining,
    isPlaying,
    sessionStarted,
    isResting,
    restTimeRemaining,
    currentPoseIndex,
    handlePlayPause,
    handleNextPose,
    handlePreviousPose,
    startPractice,
    getFinalPracticeTime,
    formatTime,
    getProgressPercent
  } = timerHook;

  // Mood tracking hook - manages pre/post mood tracking flow
  const moodHook = useMoodTracking({
    sessionId,
    getFinalPracticeTime,
    programContext
  });

  const {
    showPreMoodTracker,
    showPostMoodTracker,
    handlePreMoodComplete,
    handlePreMoodSkip,
    handleDontShowMoodAgain,
    handlePostMoodComplete,
    handlePostMoodSkip
  } = moodHook;

  // Get current pose data based on timer's currentPoseIndex
  const currentPoseData = session?.poses?.[currentPoseIndex];

  // For custom sessions, pose data is already included
  const pose = currentPoseData?.poseData ||
               (currentPoseData ? getPoseById(currentPoseData.poseId) : null);

  // Auto-start practice when mood tracker is dismissed
  useEffect(() => {
    if (!showPreMoodTracker && !sessionStarted && session && pose) {
      // Small delay to let the UI settle
      const timer = setTimeout(() => {
        startPractice();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showPreMoodTracker, sessionStarted, session, pose, startPractice]);

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

  const handleExit = () => {
    // If user started the session but didn't complete it, we don't record progress
    // This maintains the principle that only completed sessions count toward progress

    // If practicing as part of a program, return to week detail page
    if (programContext?.programId && programContext?.weekNumber) {
      navigate(`/programs/${programContext.programId}/week/${programContext.weekNumber}`);
    } else {
      navigate('/');
    }
  };

  const progressPercent = getProgressPercent();

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
    <PracticeHeader
      title={session.name}
      onExit={handleExit}
      exitButtonStyle="circular"
      actions={
        <>
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
        </>
      }
      progressBar={
        <div className="h-1.5 rounded-full bg-cream-200">
          <div
            className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      }
    />
  );

  // Render footer content using PracticeControls component
  const renderFooter = () => (
    <PracticeControls
      isPlaying={isPlaying}
      currentPoseIndex={currentPoseIndex}
      session={session}
      onPlayPause={handlePlayPause}
      onPreviousPose={handlePreviousPose}
      onNextPose={handleNextPose}
    />
  );

  // Show rest screen when resting
  if (isResting && session) {
    const nextPoseData = session.poses[currentPoseIndex + 1];
    const nextPose = nextPoseData?.poseData ||
                     (nextPoseData ? getPoseById(nextPoseData.poseId) : null);

    return (
      <PracticeLayout
        header={renderHeader()}
        footer={renderFooter()}
        contentClassName="px-4 pb-6"
      >
        {/* Program context badge - moved from header */}
        {programContext && (
          <div className="flex items-center justify-center gap-1.5 mb-3 mt-2">
            <div className="inline-flex items-center gap-1.5 bg-sage-50 border border-sage-200 rounded-full px-3 py-1.5">
              <BookMarked className="h-3.5 w-3.5 text-sage-600" />
              <p className="text-xs text-sage-600">
                {programName} • Week {weekNumber}, Day {dayNumber}
              </p>
            </div>
          </div>
        )}

        {/* Rest Screen */}
        <div className="flex flex-col items-center justify-center h-full animate-fade-in">
          <div className="text-center space-y-6">
            {/* Rest Message */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-light text-sage-700 mb-2">
                Rest & Transition
              </h2>
              <p className="text-sm sm:text-base text-sage-600">
                Take a moment to prepare for the next pose
              </p>
            </div>

            {/* Countdown Timer */}
            <div className="my-8">
              <div className="text-6xl sm:text-7xl font-light text-primary mb-2">
                {restTimeRemaining}
              </div>
              <p className="text-sm sm:text-base text-secondary">seconds remaining</p>
            </div>

            {/* Next Pose Preview */}
            {nextPose && (
              <div className="bg-sage-50 rounded-xl p-4 border border-sage-200">
                <p className="text-xs sm:text-sm text-sage-600 mb-1">Next Pose:</p>
                <p className="text-lg sm:text-xl font-medium text-sage-800">
                  {nextPose.nameEnglish}
                  {nextPoseData?.side && (
                    <span className="ml-2 text-base font-normal text-sage-600">
                      ({nextPoseData.side === 'right' ? 'Right Side' : 'Left Side'})
                    </span>
                  )}
                </p>
                <p className="text-xs sm:text-sm text-sage-500 italic">
                  {nextPose.nameSanskrit}
                </p>
              </div>
            )}

            {/* Skip Rest Button */}
            <button
              onClick={handleNextPose}
              className="mt-6 px-8 py-3 rounded-full bg-sage-600 hover:bg-sage-700 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
            >
              Skip Rest
            </button>
          </div>
        </div>
      </PracticeLayout>
    );
  }

  return (
    <PracticeLayout
      header={renderHeader()}
      footer={renderFooter()}
      contentClassName="px-4 pb-6"
    >
      {/* Program context badge - moved from header */}
      {programContext && (
        <div className="flex items-center justify-center gap-1.5 mb-3 mt-2">
          <div className="inline-flex items-center gap-1.5 bg-sage-50 border border-sage-200 rounded-full px-3 py-1.5">
            <BookMarked className="h-3.5 w-3.5 text-sage-600" />
            <p className="text-xs text-sage-600">
              {programName} • Week {weekNumber}, Day {dayNumber}
            </p>
          </div>
        </div>
      )}

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
          {currentPoseData?.side && (
            <span className="ml-2 text-base font-normal text-sage-600">
              ({currentPoseData.side === 'right' ? 'Right Side' : 'Left Side'})
            </span>
          )}
        </h2>
        <p className="mb-1 text-xs sm:text-sm text-secondary italic">
          {pose.nameSanskrit}
        </p>
        {/* Pose count - moved from header */}
        <p className="text-xs text-sage-500 mb-1">
          Pose {currentPoseIndex + 1} of {session?.poses?.length || 0}
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
      <PracticeTipsOverlay pose={pose} show={showTips} />
    </PracticeLayout>
  );
}

export default Practice;