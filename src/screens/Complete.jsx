import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  Home,
  RotateCcw,
  Star,
  Wind,
  Trophy,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { getSessionById } from "../data/sessions";
import { getWeekByNumber } from "../data/programs";
import useProgressStore from "../stores/progress";
import useProgramProgressStore from "../stores/programProgress";
import { FullscreenLayout } from "../components/layouts";
import { ContentBody, GradientButton, Text } from "../components/design-system";
import { calculateMoodImprovement } from "../utils/moodCalculator.jsx";
import { useReducedMotion } from "../hooks/useReducedMotion";
import useTranslation from "../hooks/useTranslation";
import { haptics } from "../utils/haptics";
import { CELEBRATE } from "../utils/animations";

function Complete() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const sessionId = searchParams.get("session") || "morning-energizer";

  // Check if this is a breathing session from location state
  const isBreathingSession = location.state?.sessionType === "breathing";
  const breathingExerciseName = location.state?.exerciseName;
  const breathingDuration = location.state?.duration;

  // Get mood data from location state
  const preMoodData = location.state?.preMoodData;
  const postMoodData = location.state?.postMoodData;
  const sessionMoodData = location.state?.sessionMoodData;

  // Get program context from location state (optional)
  const programContext = location.state?.programContext; // { programId, weekNumber, dayNumber }

  // Warn if location state is missing (direct navigation to /complete)
  // The UI still works with fallbacks, but mood data will be lost
  if (!location.state && process.env.NODE_ENV === "development") {
    console.warn(
      "Complete page accessed without navigation state. Mood tracking data may be incomplete.",
    );
  }

  const session = !isBreathingSession ? getSessionById(sessionId) : null;
  const { completeSession, getStreakStatus, getProgramWeekSessions } =
    useProgressStore();
  const { completeWeek, isWeekCompleted } = useProgramProgressStore();

  const shouldReduceMotion = useReducedMotion();

  // State to track recording and streak status
  const [recordingState, setRecordingState] = useState({
    hasRecorded: false,
    streakStatus: null,
  });

  // Compute week completion info after recording is complete
  const weekCompletionInfo = (() => {
    if (
      !recordingState.hasRecorded ||
      !programContext?.programId ||
      !programContext?.weekNumber
    ) {
      return null;
    }

    const { programId, weekNumber } = programContext;
    const weekDef = getWeekByNumber(programId, weekNumber);

    if (!weekDef) return null;

    // Get all sessions completed this week
    const weekSessions = getProgramWeekSessions(programId, weekNumber);
    const completedSessionIds = [
      ...new Set(weekSessions.map((s) => s.sessionId)),
    ];

    // Check if all recommended sessions for this week are completed
    const recommendedSessionIds = weekDef.recommendedSessions || [];
    const allRecommendedCompleted =
      recommendedSessionIds.length > 0 &&
      recommendedSessionIds.every((id) => completedSessionIds.includes(id));

    // Only return info if week was just completed
    if (allRecommendedCompleted && isWeekCompleted(programId, weekNumber)) {
      return {
        weekNumber,
        weekName: weekDef.name,
        programId,
        sessionsCompleted: weekSessions.length,
        isMilestone: weekDef.isMilestone,
      };
    }

    return null;
  })();

  // Confetti celebration and haptic feedback when component mounts
  useEffect(() => {
    // Success haptic feedback on completion
    haptics.success();

    if (!shouldReduceMotion) {
      const timer = setTimeout(() => {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#14b8a6", "#8b5cf6", "#f97316", "#06b6d4", "#a855f7"],
            disableForReducedMotion: true,
          });
        } catch (e) {
          // Confetti is decorative - don't interrupt completion flow if it fails
          console.warn("Confetti animation failed:", e);
        }
      }, 300); // Slight delay for better effect

      return () => clearTimeout(timer);
    }
  }, [shouldReduceMotion]);

  // Record session completion when component mounts
  useEffect(() => {
    // Prevent duplicate recordings
    if (recordingState.hasRecorded) return;

    const recordKey = session?.id || (isBreathingSession ? "breathing" : "");
    if (!recordKey || (!session && !isBreathingSession)) return;

    // Use queueMicrotask to defer setState and prevent cascading renders
    queueMicrotask(() => {
      if (isBreathingSession) {
        // Breathing session already recorded in BreathingPractice
        // Just get the streak status
        const status = getStreakStatus();
        setRecordingState({ hasRecorded: true, streakStatus: status });
      } else {
        // Get actual duration from URL params or fallback to theoretical duration
        const actualDuration = parseInt(searchParams.get("duration"));
        const fallbackDuration = Math.round(
          session.poses.reduce((total, pose) => total + pose.duration, 0) / 60,
        );
        const durationInMinutes = actualDuration || fallbackDuration;

        // Record the yoga session with mood data and program context
        completeSession({
          sessionId: session.id,
          sessionName: session.name,
          duration: durationInMinutes,
          poses: session.poses,
          ...(sessionMoodData || {}),
          // Add program tracking fields if available
          ...(programContext?.programId && {
            programId: programContext.programId,
            weekNumber: programContext.weekNumber,
            dayNumber: programContext.dayNumber,
          }),
        });

        // Check if this session completes a program week
        if (programContext?.programId && programContext?.weekNumber) {
          const { programId, weekNumber } = programContext;

          // Get week definition from programs.js
          const weekDef = getWeekByNumber(programId, weekNumber);

          if (weekDef) {
            // Get all sessions completed this week (including the one we just recorded)
            const weekSessions = getProgramWeekSessions(programId, weekNumber);

            // Extract unique session IDs completed this week
            const completedSessionIds = [
              ...new Set(weekSessions.map((s) => s.sessionId)),
            ];

            // Check if all recommended sessions for this week are now completed
            const recommendedSessionIds = weekDef.recommendedSessions || [];
            const allRecommendedCompleted =
              recommendedSessionIds.length > 0 &&
              recommendedSessionIds.every((id) =>
                completedSessionIds.includes(id),
              );

            // Check if week wasn't already marked as completed
            const weekAlreadyCompleted = isWeekCompleted(programId, weekNumber);

            if (allRecommendedCompleted && !weekAlreadyCompleted) {
              // Week just completed! Mark it in program progress
              completeWeek(programId, weekNumber, weekSessions.length);
            }
          }
        }

        // Get updated streak status
        const status = getStreakStatus();
        setRecordingState({ hasRecorded: true, streakStatus: status });
      }
    });
  }, [
    recordingState.hasRecorded,
    session,
    completeSession,
    getStreakStatus,
    isBreathingSession,
    programContext,
    getProgramWeekSessions,
    completeWeek,
    isWeekCompleted,
    searchParams,
    sessionMoodData,
  ]);

  const handleGoHome = () => {
    // If completed as part of a program, return to week detail page
    if (programContext?.programId && programContext?.weekNumber) {
      navigate(
        `/programs/${programContext.programId}/week/${programContext.weekNumber}`,
      );
    } else {
      navigate("/");
    }
  };

  const handlePracticeAgain = () => {
    if (isBreathingSession) {
      navigate("/breathing");
    } else {
      navigate(`/practice?session=${sessionId}`);
    }
  };

  // Calculate mood improvement
  const moodImprovementInfo = calculateMoodImprovement(
    preMoodData,
    postMoodData,
  );

  return (
    <FullscreenLayout showBottomNav={false} background="aurora">
      <div className="bg-aurora-animated min-h-full">
        <ContentBody size="sm" centered padding="lg" spacing="md">
          <motion.div
            variants={CELEBRATE.container}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            {/* Success Icon with aurora text effect */}
            <motion.div className="mb-6 text-center" variants={CELEBRATE.item}>
              {isBreathingSession ? (
                <motion.div
                  animate={
                    shouldReduceMotion ? {} : { rotate: [0, 10, -10, 0] }
                  }
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative"
                >
                  <Wind className="mx-auto mb-4 size-20 text-aurora-teal" />
                  <motion.div
                    className="absolute -right-2 -top-2"
                    animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Sparkles className="size-6 text-power" />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  animate={shouldReduceMotion ? {} : { scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative"
                >
                  <CheckCircle className="mx-auto mb-4 size-20 text-aurora-violet" />
                  <motion.div
                    className="absolute -right-2 -top-2"
                    animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Sparkles className="size-6 text-power" />
                  </motion.div>
                </motion.div>
              )}
              <h1 className="mb-2 text-3xl font-bold text-aurora">
                {t("screens.complete.title")}
              </h1>
              <Text variant="body" className="text-muted-foreground">
                {isBreathingSession
                  ? breathingExerciseName
                  : `${session?.name || "session"}`}
              </Text>
              {isBreathingSession && breathingDuration && (
                <Text variant="caption" className="mt-1 text-muted-foreground">
                  {breathingDuration} {t("common.minute")}
                </Text>
              )}
            </motion.div>

            {/* Stats Card - Glass effect */}
            <motion.div
              className="glass-card mb-6 w-full rounded-xl p-5"
              variants={CELEBRATE.item}
            >
              <Text
                variant="body"
                className="mb-4 text-center font-medium text-foreground"
              >
                {t("screens.complete.wellDone")}
              </Text>
              {recordingState.streakStatus && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <Text
                    variant="body"
                    className="mb-2 text-center font-medium text-foreground"
                  >
                    {recordingState.streakStatus.message}
                  </Text>
                  {recordingState.streakStatus.streak > 0 && (
                    <div className="flex items-center justify-center space-x-1">
                      {Array.from({
                        length: Math.min(recordingState.streakStatus.streak, 7),
                      }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.7 + i * 0.05 }}
                        >
                          <Star className="size-5 fill-current text-power" />
                        </motion.div>
                      ))}
                      {recordingState.streakStatus.streak > 7 && (
                        <span className="ml-1 text-sm font-semibold text-power">
                          +{recordingState.streakStatus.streak - 7}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
              <Text
                variant="caption"
                className="mt-3 block text-center text-muted-foreground"
              >
                {t("screens.complete.journeyStep")}
              </Text>
            </motion.div>

            {/* Mood Improvement Display - Glass card */}
            {moodImprovementInfo && (
              <motion.div
                className="glass-card mb-6 w-full rounded-xl p-4"
                variants={CELEBRATE.item}
              >
                <div className="flex items-center space-x-3">
                  {moodImprovementInfo.icon}
                  <div className="flex-1">
                    <Text
                      variant="body"
                      className="font-medium text-foreground"
                    >
                      {moodImprovementInfo.message}
                    </Text>
                    <Text
                      variant="caption"
                      className="mt-1 text-muted-foreground"
                    >
                      {moodImprovementInfo.detail}
                    </Text>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Week Completion Display - Special celebration card */}
            {weekCompletionInfo && (
              <motion.div
                className="glass-card glow-aurora mb-6 w-full rounded-xl border-2 border-power/50 p-4"
                variants={CELEBRATE.item}
              >
                <div className="flex items-start space-x-3">
                  <Trophy className="mt-0.5 size-6 shrink-0 text-power" />
                  <div className="flex-1">
                    <Text
                      variant="body"
                      className="mb-1 font-semibold text-power"
                    >
                      {weekCompletionInfo.isMilestone
                        ? t("screens.complete.milestoneAchievement")
                        : t("screens.complete.weekComplete")}
                    </Text>
                    <Text
                      variant="body"
                      className="mb-1 font-medium text-foreground"
                    >
                      {weekCompletionInfo.weekName}
                    </Text>
                    <Text variant="caption" className="text-muted-foreground">
                      {t("screens.complete.completedSessions", {
                        count: weekCompletionInfo.sessionsCompleted,
                      })}
                    </Text>
                    {weekCompletionInfo.isMilestone && (
                      <Text
                        variant="caption"
                        className="mt-2 italic text-muted-foreground"
                      >
                        {t("screens.complete.significantMilestone")}
                      </Text>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div className="w-full space-y-3" variants={CELEBRATE.item}>
              <GradientButton
                onClick={handleGoHome}
                size="lg"
                className="w-full"
              >
                <Home className="size-5" />
                <span>{t("screens.complete.backToHome")}</span>
              </GradientButton>

              <button
                onClick={handlePracticeAgain}
                className="glass-card hover:glow-aurora flex w-full items-center justify-center space-x-2 rounded-xl px-6 py-3 text-foreground transition-all active:scale-[0.98]"
              >
                <RotateCcw className="size-5" />
                <span>{t("screens.complete.practiceAgain")}</span>
              </button>
            </motion.div>
          </motion.div>
        </ContentBody>
      </div>

      {/* Floating aurora orbs - using CSS variables for theme support */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -right-20 -top-20 size-40 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--aurora-teal)), transparent)",
          }}
          animate={
            shouldReduceMotion
              ? {}
              : { scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }
          }
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 size-32 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--aurora-violet)), transparent)",
          }}
          animate={
            shouldReduceMotion
              ? {}
              : { scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }
          }
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute left-1/4 top-1/3 size-6 rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--aurora-coral)), transparent)",
          }}
          animate={
            shouldReduceMotion
              ? {}
              : { scale: [1, 1.5, 1], opacity: [0.4, 0.6, 0.4] }
          }
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />
      </div>
    </FullscreenLayout>
  );
}

export default Complete;
