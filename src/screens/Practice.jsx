import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { getSessionById } from "../data/sessions";
import { getPoseById } from "../data/poses";
import { getCustomSessionWithPoses } from "../data/customSessions";
import usePreferencesStore from "../stores/preferences";
import useCustomSessions from "../hooks/useCustomSessions";
import PoseImage from "../components/PoseImage";
import MoodTracker from "../components/MoodTracker";
import { PracticeLayout } from "../components/layouts";
import { ContentBody } from "../components/design-system";
import { PracticeHeader } from "../components/headers";
import { PracticeControls } from "../components/practice/PracticeControls";
import { PracticeTipsOverlay } from "../components/practice/PracticeTipsOverlay";
import { usePracticeTimer } from "../hooks/usePracticeTimer";
import { useMoodTracking } from "../hooks/useMoodTracking";
import useTranslation from "../hooks/useTranslation";
import { useSwipeable } from "react-swipeable";
import { haptics } from "../utils/haptics";

function Practice() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session");
  const customSessionId = searchParams.get("customSession");
  const { t } = useTranslation();

  // Get program context from navigation state (if practicing as part of a program)
  const programContext = location.state?.programContext || null;
  const { programName, weekNumber, dayNumber } = programContext || {};

  // Use custom sessions hook
  const { getById: getCustomSessionById, isLoading: customSessionsLoading } =
    useCustomSessions();

  // Load session based on type
  const [session, setSession] = useState(null);
  const sessionLoadedRef = useRef(false);

  // Synchronizing with external data (URL params + custom sessions hook)
  useEffect(() => {
    // Prevent cascading renders by only loading session once per session change
    const sessionKey = `${sessionId}-${customSessionId}`;
    if (sessionLoadedRef.current === sessionKey) {
      return;
    }

    if (customSessionId) {
      // Wait for custom sessions to load
      if (customSessionsLoading) {
        return;
      }

      // Load custom session using hook
      const customSession = getCustomSessionById(customSessionId);
      if (customSession) {
        sessionLoadedRef.current = sessionKey;
        // Synchronizing with external data source - legitimate setState in effect
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSession(getCustomSessionWithPoses(customSession));
      } else {
        console.error("Custom session not found:", customSessionId);
        navigate("/sessions");
      }
    } else {
      // Load pre-built session
      const prebuiltSession = getSessionById(sessionId || "morning-energizer");
      sessionLoadedRef.current = sessionKey;
      // Synchronizing with external data source - legitimate setState in effect
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSession(prebuiltSession);
    }
  }, [
    sessionId,
    customSessionId,
    navigate,
    getCustomSessionById,
    customSessionsLoading,
  ]);

  // Preferences store for rest duration
  const restDuration = usePreferencesStore((state) => state.restDuration);

  const [showTips, setShowTips] = useState(false);

  // Practice timer hook - manages timer, rest periods, and pose progression
  const timerHook = usePracticeTimer({
    session,
    restDuration,
    onSessionComplete: () => {
      // Trigger post-practice mood tracker when session completes
      moodHook.showPostMood();
    },
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
    getProgressPercent,
  } = timerHook;

  // Mood tracking hook - manages pre/post mood tracking flow
  const moodHook = useMoodTracking({
    sessionId,
    getFinalPracticeTime,
    programContext,
  });

  const {
    showPreMoodTracker,
    showPostMoodTracker,
    handlePreMoodComplete,
    handlePreMoodSkip,
    handleDontShowMoodAgain,
    handlePostMoodComplete,
    handlePostMoodSkip,
  } = moodHook;

  // Get current pose data based on timer's currentPoseIndex
  const currentPoseData = session?.poses?.[currentPoseIndex];

  // For custom sessions, pose data is already included
  const pose =
    currentPoseData?.poseData ||
    (currentPoseData ? getPoseById(currentPoseData.poseId) : null);

  // Auto-start practice when mood tracker is dismissed
  useEffect(() => {
    if (!showPreMoodTracker && !sessionStarted && session && pose) {
      // Immediate start - no delay needed
      startPractice();
    }
  }, [showPreMoodTracker, sessionStarted, session, pose, startPractice]);

  const handleExit = () => {
    // If user started the session but didn't complete it, we don't record progress
    // This maintains the principle that only completed sessions count toward progress

    // If practicing as part of a program, return to week detail page
    if (programContext?.programId && programContext?.weekNumber) {
      navigate(
        `/programs/${programContext.programId}/week/${programContext.weekNumber}`,
      );
    } else {
      navigate("/");
    }
  };

  // Keyboard shortcuts for practice screen (WCAG 2.1 AA compliance)
  useEffect(() => {
    // Only enable keyboard shortcuts when practice is active (not during mood trackers)
    if (showPreMoodTracker || showPostMoodTracker || !sessionStarted) {
      return;
    }

    const handleKeyDown = (e) => {
      // Prevent default for our keyboard shortcuts
      if (["Space", "ArrowLeft", "ArrowRight", "Escape"].includes(e.code)) {
        e.preventDefault();
      }

      switch (e.code) {
        case "Space":
          // Play/Pause
          handlePlayPause();
          break;
        case "ArrowRight":
          // Next pose (skip forward)
          if (!isResting && currentPoseIndex < session.poses.length - 1) {
            handleNextPose();
          }
          break;
        case "ArrowLeft":
          // Previous pose (skip back)
          if (!isResting && currentPoseIndex > 0) {
            handlePreviousPose();
          }
          break;
        case "Escape":
          // Exit practice
          handleExit();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    showPreMoodTracker,
    showPostMoodTracker,
    sessionStarted,
    isResting,
    currentPoseIndex,
    session,
    handlePlayPause,
    handleNextPose,
    handlePreviousPose,
    handleExit,
  ]);

  // Swipe gestures for pose navigation (mobile)
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      // Swipe left = next pose
      if (
        !isResting &&
        !showPreMoodTracker &&
        !showPostMoodTracker &&
        sessionStarted
      ) {
        if (currentPoseIndex < session.poses.length - 1) {
          haptics.medium();
          handleNextPose();
        }
      }
    },
    onSwipedRight: () => {
      // Swipe right = previous pose
      if (
        !isResting &&
        !showPreMoodTracker &&
        !showPostMoodTracker &&
        sessionStarted
      ) {
        if (currentPoseIndex > 0) {
          haptics.medium();
          handlePreviousPose();
        }
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: false, // Only touch, not mouse
    trackTouch: true,
  });

  const progressPercent = getProgressPercent();

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="mb-2 text-lg text-foreground">
            {t("screens.practice.sessionNotFound")}
          </p>
          <button
            onClick={() => navigate("/sessions")}
            className="text-muted-foreground hover:text-muted-foreground"
          >
            {t("screens.practice.backToSessions")}
          </button>
        </div>
      </div>
    );
  }

  if (!pose) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg text-foreground">
            {t("screens.practice.loadingPose")}
          </p>
        </div>
      </div>
    );
  }

  // Don't render main practice interface if mood tracker is showing
  if (showPreMoodTracker) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <MoodTracker
          title={t("screens.practice.howFeelingBefore")}
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
          title={t("screens.practice.howFeelingAfter")}
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
      title=""
      onExit={handleExit}
      exitButtonStyle="circular"
      actions={
        <button
          onClick={() => setShowTips(!showTips)}
          className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted"
          aria-label={t(
            showTips
              ? "screens.practice.closeTips"
              : "screens.practice.showTips",
          )}
        >
          <HelpCircle className="size-5" />
        </button>
      }
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
    const nextPose =
      nextPoseData?.poseData ||
      (nextPoseData ? getPoseById(nextPoseData.poseId) : null);

    return (
      <PracticeLayout header={renderHeader()} footer={renderFooter()}>
        <ContentBody size="sm" centered padding="none" {...swipeHandlers}>
          {/* Session name and program context - directly under header */}
          <div className="-mt-1 px-4 text-center">
            {programContext && (
              <div className="mb-1">
                <p className="text-lg font-medium text-foreground sm:text-xl">
                  {programName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Week {weekNumber}, Day {dayNumber}
                </p>
              </div>
            )}
            <h1 className="text-xl font-medium text-muted-foreground">
              {session.name}
            </h1>
          </div>

          <div className="px-4 pt-3">
            {/* Rest Screen */}
            <div className="animate-fade-in">
              <div className="space-y-6 text-center">
                {/* Rest Message */}
                <div>
                  <h2 className="mb-2 text-3xl font-light text-muted-foreground sm:text-4xl">
                    {t("screens.practice.restTransition")}
                  </h2>
                  <p className="text-base text-muted-foreground sm:text-lg">
                    {t("screens.practice.prepareNext")}
                  </p>
                </div>

                {/* Countdown Timer with ARIA live region */}
                <div className="my-8">
                  <div
                    className="mb-2 text-7xl font-light text-foreground sm:text-8xl"
                    aria-live="assertive"
                    aria-atomic="true"
                  >
                    {restTimeRemaining}
                  </div>
                  <p className="text-base text-muted-foreground sm:text-lg">
                    {t("screens.practice.secondsRemaining")}
                  </p>
                </div>

                {/* Next Pose Preview */}
                {nextPose && (
                  <div className="mb-8">
                    <p className="mb-2 text-sm text-muted-foreground">
                      {t("screens.practice.nextPoseLabel")}
                    </p>
                    <p className="mb-1 text-3xl font-medium text-foreground sm:text-4xl">
                      {nextPose.nameEnglish}
                      {nextPoseData?.side && (
                        <span className="ml-2 text-xl font-normal text-muted-foreground">
                          (
                          {nextPoseData.side === "right"
                            ? t("screens.practice.rightSide")
                            : t("screens.practice.leftSide")}
                          )
                        </span>
                      )}
                    </p>
                    <p className="text-lg italic text-muted-foreground sm:text-xl">
                      {nextPose.nameSanskrit}
                    </p>
                  </div>
                )}

                {/* Skip Rest Button */}
                <button
                  onClick={handleNextPose}
                  className="mt-6 rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-xl active:scale-95"
                >
                  {t("screens.practice.skipRest")}
                </button>
              </div>
            </div>
          </div>
        </ContentBody>
      </PracticeLayout>
    );
  }

  return (
    <PracticeLayout header={renderHeader()} footer={renderFooter()}>
      <ContentBody size="sm" centered padding="none" {...swipeHandlers}>
        {/* Session name and program context - directly under header */}
        <div className="-mt-1 px-4 text-center">
          {programContext && (
            <div className="mb-1">
              <p className="text-lg font-medium text-foreground sm:text-xl">
                {programName}
              </p>
              <p className="text-sm text-muted-foreground">
                Week {weekNumber}, Day {dayNumber}
              </p>
            </div>
          )}
          <h1 className="text-xl font-medium text-muted-foreground">
            {session.name}
          </h1>
        </div>

        <div className="px-4 pt-3">
          {/* Pose illustration with beautiful SVG */}
          <div className="mx-auto mb-3 flex items-center justify-center">
            <PoseImage poseId={pose.id} size="xl" className="drop-shadow-lg" />
          </div>

          {/* Pose Info */}
          <div className="text-center">
            <h2 className="mb-1 text-xl font-medium text-foreground sm:text-2xl">
              {pose.nameEnglish}
              {currentPoseData?.side && (
                <span className="ml-2 text-lg font-normal text-muted-foreground">
                  (
                  {currentPoseData.side === "right"
                    ? t("screens.practice.rightSide")
                    : t("screens.practice.leftSide")}
                  )
                </span>
              )}
            </h2>
            <p className="mb-1 text-sm italic text-muted-foreground sm:text-base">
              {pose.nameSanskrit}
            </p>
            {/* Pose count - moved from header */}
            <p className="mb-1 text-sm text-muted-foreground">
              {t("screens.practice.poseOf", {
                current: currentPoseIndex + 1,
                total: session?.poses?.length || 0,
              })}
            </p>

            {/* Timer with ARIA live region */}
            <div className="mb-2">
              <div
                className="text-3xl font-light text-foreground sm:text-4xl"
                aria-live="polite"
                aria-atomic="true"
              >
                {formatTime(timeRemaining)}
              </div>
              <p className="text-sm text-muted-foreground sm:text-base">
                {t("screens.practice.remaining")}
              </p>
            </div>

            {/* Next Pose Preview */}
            {currentPoseIndex < session.poses.length - 1 && (
              <div className="mb-3">
                <p className="text-lg font-medium text-foreground sm:text-xl">
                  {t("screens.practice.nextPoseLabel")}{" "}
                  {
                    getPoseById(session.poses[currentPoseIndex + 1].poseId)
                      ?.nameEnglish
                  }
                  {session.poses[currentPoseIndex + 1]?.side && (
                    <span className="ml-1 text-lg font-normal text-muted-foreground">
                      (
                      {session.poses[currentPoseIndex + 1].side === "right"
                        ? t("screens.practice.rightSide")
                        : t("screens.practice.leftSide")}
                      )
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Pose description - hidden on very small screens */}
            {pose.description && (
              <p className="mb-3 hidden text-base leading-relaxed text-muted-foreground sm:block">
                {pose.description}
              </p>
            )}
          </div>
        </div>
      </ContentBody>

      {/* Enhanced Tips Overlay */}
      <PracticeTipsOverlay pose={pose} show={showTips} />
    </PracticeLayout>
  );
}

export default Practice;
