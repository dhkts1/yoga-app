import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Sunrise,
  Flame,
  Star,
  ChevronRight,
  Sparkles,
  BookOpen,
  Calendar,
  Play,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PullToRefresh from "react-simple-pull-to-refresh";
import {
  Text,
  ContentBody,
  GradientButton,
  ProgressRing,
} from "../components/design-system";
import { DefaultLayout } from "../components/layouts";
import { PageHeader } from "../components/headers";
import useProgressStore from "../stores/progress";
import usePreferencesStore from "../stores/preferences";
import useProgramProgressStore from "../stores/programProgress";
import { getSessionById } from "../data/sessions";
import { getBreathingExerciseById } from "../data/breathing";
import {
  getSmartRecommendation,
  getRecommendationButtonText,
} from "../utils/recommendations";
import { getProgramById } from "../data/programs";
import useTranslation from "../hooks/useTranslation";
import { haptics } from "../utils/haptics";
import { STAGGER_FADE } from "../utils/animations";

function Welcome() {
  const navigate = useNavigate();
  const { t, isRTL } = useTranslation();

  // Optimize Zustand selectors for progress store
  const getStreakStatus = useProgressStore((state) => state.getStreakStatus);
  const totalSessions = useProgressStore((state) => state.totalSessions);
  const practiceHistory = useProgressStore((state) => state.practiceHistory);
  const breathingHistory = useProgressStore((state) => state.breathingHistory);
  const getRecentAllSessions = useProgressStore(
    (state) => state.getRecentAllSessions,
  );
  const streakStatus = getStreakStatus();

  // Optimize Zustand selectors for program progress store
  const activeProgram = useProgramProgressStore((state) => state.activeProgram);
  const getCurrentWeek = useProgramProgressStore(
    (state) => state.getCurrentWeek,
  );

  // Optimize Zustand selectors for preferences store
  const isMilestoneCelebrated = usePreferencesStore(
    (state) => state.isMilestoneCelebrated,
  );
  const markMilestoneCelebrated = usePreferencesStore(
    (state) => state.markMilestoneCelebrated,
  );

  // React Compiler handles optimization automatically
  const allHistory = [...(practiceHistory || []), ...(breathingHistory || [])];
  const primaryRecommendation = getSmartRecommendation(new Date(), allHistory);
  const recentSessions = getRecentAllSessions(3);

  // Milestone celebration state
  const [milestoneState, setMilestoneState] = useState({
    show: false,
    milestone: null,
  });

  // Milestone values
  const MILESTONES = [3, 7, 30];

  // Compute milestone during render (not in effect)
  const currentStreak = streakStatus.streak;
  let activeMilestone = null;
  for (const milestone of MILESTONES) {
    if (currentStreak >= milestone && !isMilestoneCelebrated(milestone)) {
      activeMilestone = milestone;
      break; // Use the first uncelebrated milestone
    }
  }

  // Update state during render if milestone changed
  if (activeMilestone && activeMilestone !== milestoneState.milestone) {
    markMilestoneCelebrated(activeMilestone);
    setMilestoneState({ show: true, milestone: activeMilestone });
  }

  // Effect only for timer (external system synchronization)
  useEffect(() => {
    if (milestoneState.show) {
      const timer = setTimeout(() => {
        setMilestoneState((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [milestoneState.show]);

  // Time-based greeting per PRD requirements
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12)
      return { text: t("screens.welcome.goodMorning"), icon: Sunrise };
    if (hour < 17)
      return { text: t("screens.welcome.goodAfternoon"), icon: Sun };
    return { text: t("screens.welcome.goodEvening"), icon: Moon };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  // Calculate daily progress (sessions today / goal of 5)
  const todaysSessions = allHistory.filter((s) => {
    const sessionDate = new Date(s.completedAt);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString();
  }).length;
  const dailyGoal = 5;
  const dailyProgress = Math.min((todaysSessions / dailyGoal) * 100, 100);

  // Quick Start handler - smart recommendation based on patterns
  const handleQuickStart = () => {
    if (!primaryRecommendation) {
      // Fallback to default
      navigate("/practice?session=morning-energizer");
      return;
    }

    // Check if it's a breathing exercise or yoga session
    const breathingExercise = getBreathingExerciseById(
      primaryRecommendation.sessionId,
    );
    if (breathingExercise) {
      navigate(
        `/breathing/practice?exercise=${primaryRecommendation.sessionId}&duration=${breathingExercise.defaultDuration}`,
      );
    } else {
      navigate(`/practice?session=${primaryRecommendation.sessionId}`);
    }
  };

  // Navigate to recently practiced session
  const handleRecentSessionClick = (session) => {
    const breathingExercise = getBreathingExerciseById(session.exerciseId);
    if (breathingExercise) {
      navigate(
        `/breathing/practice?exercise=${session.exerciseId}&duration=${breathingExercise.defaultDuration}`,
      );
    } else {
      navigate(`/practice?session=${session.sessionId}`);
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    haptics.light();
    // Simulate refresh delay (data already reactive via Zustand)
    await new Promise((resolve) => setTimeout(resolve, 800));
    return;
  };

  return (
    <DefaultLayout
      header={<PageHeader title="" subtitle="" showBack={false} />}
      background="aurora"
    >
      <PullToRefresh
        onRefresh={handleRefresh}
        pullingContent=""
        className="h-full"
      >
        <div className="min-h-full">
          <ContentBody size="sm" spacing="none" className="pb-6">
            <motion.div
              variants={STAGGER_FADE.container}
              initial="hidden"
              animate="visible"
            >
              {/* Time-based greeting */}
              <motion.div
                className="-mt-4 mb-6 flex flex-col items-center justify-start text-center"
                variants={STAGGER_FADE.item}
              >
                <GreetingIcon className="mx-auto mb-2 size-10 text-aurora-violet" />
                <h1 className="text-2xl font-bold text-foreground">
                  {greeting.text}
                </h1>
              </motion.div>

              {/* Streak Badge - Glass pill with glow when active */}
              {totalSessions > 0 && streakStatus.streak > 0 && (
                <motion.div
                  className="mb-6 flex justify-center"
                  variants={STAGGER_FADE.item}
                >
                  <motion.div
                    initial={{ scale: 1, opacity: 0 }}
                    animate={
                      milestoneState.show
                        ? {
                            scale: [1, 1.3, 1],
                            rotate: [0, 5, -5, 0],
                            opacity: 1,
                          }
                        : { opacity: 1 }
                    }
                    transition={{ duration: 0.6, times: [0, 0.5, 1] }}
                    className="glass-card glow-aurora relative inline-flex items-center gap-2 rounded-full px-4 py-2"
                  >
                    <Flame className="size-4 text-power" />
                    <Text
                      variant="caption"
                      className="font-semibold text-foreground"
                    >
                      {streakStatus.streak} {t("screens.welcome.dayStreak")}
                    </Text>
                    <div className="flex space-x-0.5">
                      {Array.from({
                        length: Math.min(streakStatus.streak, 3),
                      }).map((_, i) => (
                        <Star
                          key={i}
                          className="size-3 fill-current text-power"
                        />
                      ))}
                    </div>

                    {/* Sparkle effects during celebration */}
                    <AnimatePresence>
                      {milestoneState.show && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                            animate={{ opacity: 1, scale: 1.5, rotate: 180 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className="absolute -right-2 -top-2"
                          >
                            <Sparkles className="drop-shadow-glow-power size-5 text-power" />
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                            animate={{ opacity: 1, scale: 1.5, rotate: -180 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="absolute -bottom-2 -left-2"
                          >
                            <Sparkles className="drop-shadow-glow-power size-5 text-power" />
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )}

              {/* Milestone Achievement Message */}
              <AnimatePresence>
                {milestoneState.show && milestoneState.milestone && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card mb-4 rounded-lg px-4 py-2"
                  >
                    <Text
                      variant="body"
                      className="text-center font-medium text-foreground"
                    >
                      {milestoneState.milestone}{" "}
                      {t("screens.welcome.milestoneCelebration")}
                    </Text>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress Ring - Daily Progress */}
              {totalSessions > 0 && (
                <motion.div
                  className="mb-6 flex justify-center"
                  variants={STAGGER_FADE.item}
                >
                  <ProgressRing
                    progress={dailyProgress}
                    size={140}
                    strokeWidth={10}
                  >
                    <span className="text-3xl font-bold text-foreground">
                      {todaysSessions}/{dailyGoal}
                    </span>
                    <span className="text-sm text-muted-foreground">today</span>
                  </ProgressRing>
                </motion.div>
              )}

              {/* Main CTA - Gradient Button */}
              <motion.div className="mb-4 w-full" variants={STAGGER_FADE.item}>
                <GradientButton
                  onClick={handleQuickStart}
                  size="lg"
                  className="w-full"
                >
                  <Play className="size-5" />
                  {getRecommendationButtonText(
                    primaryRecommendation,
                    totalSessions > 0,
                  )}
                </GradientButton>

                {/* Recommendation reason below button */}
                {primaryRecommendation && primaryRecommendation.reason && (
                  <Text
                    variant="caption"
                    className="mt-3 block text-center text-muted-foreground"
                  >
                    {primaryRecommendation.reason}
                  </Text>
                )}
              </motion.div>

              {/* Secondary CTA - Browse All */}
              <motion.button
                onClick={() => navigate("/sessions")}
                className="mb-6 flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                variants={STAGGER_FADE.item}
              >
                {t("screens.welcome.browseAll")}
                <ChevronRight className={`size-4 ${isRTL ? "rtl-flip" : ""}`} />
              </motion.button>

              {/* Program Discovery Section - Glass card with gradient border */}
              {activeProgram ? (
                // Active Program Card
                <motion.div
                  className="mb-6 w-full"
                  variants={STAGGER_FADE.item}
                >
                  <Text
                    variant="body"
                    className="mb-3 block font-medium text-muted-foreground"
                  >
                    {t("screens.welcome.yourProgram")}
                  </Text>
                  <button
                    onClick={() => {
                      const program = getProgramById(activeProgram.programId);
                      const currentWeek = getCurrentWeek(
                        activeProgram.programId,
                      );
                      if (program) {
                        navigate(
                          `/programs/${activeProgram.programId}/week/${currentWeek}`,
                        );
                      }
                    }}
                    className="glass-card gradient-border hover:glow-aurora w-full rounded-xl p-4 pl-6 text-left transition-all"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="mr-3 min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <BookOpen className="size-5 shrink-0 text-aurora-violet" />
                          <Text
                            variant="body"
                            className="font-medium text-foreground"
                          >
                            {getProgramById(activeProgram.programId)?.name}
                          </Text>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="size-4 shrink-0" />
                          <span>
                            {t("common.week")}{" "}
                            {getCurrentWeek(activeProgram.programId)}{" "}
                            {t("common.of")}{" "}
                            {
                              getProgramById(activeProgram.programId)
                                ?.totalWeeks
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <Text variant="caption" className="text-muted-foreground">
                        {t("screens.welcome.continueJourney")}
                      </Text>
                      <ChevronRight
                        className={`size-5 text-aurora-violet ${isRTL ? "rtl-flip" : ""}`}
                      />
                    </div>
                  </button>
                </motion.div>
              ) : (
                // Discover Programs CTA
                <motion.div
                  className="mb-6 w-full"
                  variants={STAGGER_FADE.item}
                >
                  <button
                    onClick={() => navigate("/programs")}
                    className="glass-card gradient-border hover:glow-aurora w-full rounded-xl p-4 pl-6 text-left transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="mr-3 min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <BookOpen className="size-5 shrink-0 text-aurora-violet" />
                          <Text
                            variant="body"
                            className="font-medium text-foreground"
                          >
                            {t("screens.welcome.discoverPrograms")}
                          </Text>
                        </div>
                        <Text
                          variant="caption"
                          className="leading-relaxed text-muted-foreground"
                        >
                          {t("screens.welcome.programsDescription")}
                        </Text>
                      </div>
                      <ChevronRight
                        className={`mt-1 size-5 shrink-0 text-aurora-violet ${isRTL ? "rtl-flip" : ""}`}
                      />
                    </div>
                  </button>
                </motion.div>
              )}

              {/* Recently Practiced - Horizontal scrolling glass cards */}
              {recentSessions.length > 0 && (
                <motion.div className="w-full" variants={STAGGER_FADE.item}>
                  <Text
                    variant="body"
                    className="mb-3 block font-medium text-muted-foreground"
                  >
                    {t("screens.welcome.recentlyPracticed")}
                  </Text>
                  <div className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
                    {recentSessions.map((session, index) => {
                      const sessionData =
                        getSessionById(session.sessionId) ||
                        getBreathingExerciseById(session.exerciseId);
                      if (!sessionData) return null;

                      const isBreathing = !!session.exerciseId;
                      const sessionName = isBreathing
                        ? sessionData.nameEnglish
                        : sessionData.name;
                      const sanskritName = isBreathing
                        ? sessionData.nameSanskrit
                        : null;
                      const duration = session.duration;

                      return (
                        <motion.button
                          key={`recent-${index}`}
                          onClick={() => handleRecentSessionClick(session)}
                          className="glass-card hover:glow-aurora min-w-40 shrink-0 rounded-xl p-3 text-left transition-all"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                        >
                          <Text
                            variant="body"
                            className="mb-1 font-medium text-foreground"
                          >
                            {sessionName}
                          </Text>
                          {sanskritName && (
                            <Text
                              variant="caption"
                              className="mb-2 text-muted-foreground"
                            >
                              {sanskritName}
                            </Text>
                          )}
                          <Text
                            variant="caption"
                            className="text-aurora-violet"
                          >
                            {duration} {t("common.min")}
                          </Text>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </ContentBody>
        </div>
      </PullToRefresh>
    </DefaultLayout>
  );
}

export default Welcome;
