import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Sunrise,
  Flame,
  ChevronRight,
  Play,
  Wind,
  Plus,
  Clock,
  Zap,
  BookOpen,
  Calendar,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Panel,
  SectionHeader,
  StatSparkline,
  Badge,
} from "../components/design-system";
import ContentBody from "../components/design-system/ContentBody";
import { DefaultLayout } from "../components/layouts";
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

function Welcome() {
  const navigate = useNavigate();
  const { t, isRTL } = useTranslation();

  // Progress store selectors
  const getStreakStatus = useProgressStore((state) => state.getStreakStatus);
  const totalSessions = useProgressStore((state) => state.totalSessions);
  const practiceHistory = useProgressStore((state) => state.practiceHistory);
  const breathingHistory = useProgressStore((state) => state.breathingHistory);
  const getRecentAllSessions = useProgressStore(
    (state) => state.getRecentAllSessions,
  );
  const streakStatus = getStreakStatus();

  // Program progress store
  const activeProgram = useProgramProgressStore((state) => state.activeProgram);
  const getCurrentWeek = useProgramProgressStore(
    (state) => state.getCurrentWeek,
  );

  // Preferences store
  const isMilestoneCelebrated = usePreferencesStore(
    (state) => state.isMilestoneCelebrated,
  );
  const markMilestoneCelebrated = usePreferencesStore(
    (state) => state.markMilestoneCelebrated,
  );

  // Computed values
  const allHistory = [...(practiceHistory || []), ...(breathingHistory || [])];
  const primaryRecommendation = getSmartRecommendation(new Date(), allHistory);
  const recentSessions = getRecentAllSessions(3);

  // Milestone celebration
  const [milestoneState, setMilestoneState] = useState({
    show: false,
    milestone: null,
  });

  const MILESTONES = [3, 7, 30];
  const currentStreak = streakStatus.streak;
  let activeMilestone = null;
  for (const milestone of MILESTONES) {
    if (currentStreak >= milestone && !isMilestoneCelebrated(milestone)) {
      activeMilestone = milestone;
      break;
    }
  }

  if (activeMilestone && activeMilestone !== milestoneState.milestone) {
    markMilestoneCelebrated(activeMilestone);
    setMilestoneState({ show: true, milestone: activeMilestone });
  }

  useEffect(() => {
    if (milestoneState.show) {
      const timer = setTimeout(() => {
        setMilestoneState((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [milestoneState.show]);

  // Time-based greeting
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

  // Daily progress
  const todaysSessions = allHistory.filter((s) => {
    const sessionDate = new Date(s.completedAt);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString();
  }).length;

  // Generate sparkline data from last 7 days
  const getWeeklyData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const count = allHistory.filter(
        (s) => new Date(s.completedAt).toDateString() === dateStr,
      ).length;
      data.push(count);
    }
    return data;
  };

  // Quick start handler
  const handleQuickStart = () => {
    haptics.light();
    if (!primaryRecommendation) {
      navigate("/practice?session=morning-energizer");
      return;
    }

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

  // Recent session click
  const handleRecentSessionClick = (session) => {
    haptics.light();
    const breathingExercise = getBreathingExerciseById(session.exerciseId);
    if (breathingExercise) {
      navigate(
        `/breathing/practice?exercise=${session.exerciseId}&duration=${breathingExercise.defaultDuration}`,
      );
    } else {
      navigate(`/practice?session=${session.sessionId}`);
    }
  };

  return (
    <DefaultLayout header={null} background="default">
      <ContentBody size="md" spacing="md" className="pb-24 pt-4">
        {/* Greeting Header */}
        <motion.div
          className="flex items-center justify-between py-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <GreetingIcon className="size-6 text-accent" />
            <h1 className="font-display text-xl font-semibold text-foreground">
              {greeting.text}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {streakStatus.streak > 0 && (
              <Badge variant="active" size="sm">
                <Flame className="size-3" />
                {streakStatus.streak}d
              </Badge>
            )}
            <button
              onClick={() => navigate("/settings")}
              className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
              aria-label="Settings"
            >
              <Settings className="size-5" />
            </button>
          </div>
        </motion.div>

        {/* Milestone Toast */}
        <AnimatePresence>
          {milestoneState.show && milestoneState.milestone && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-4 rounded-lg border border-accent/30 bg-accent/10 p-3"
            >
              <p className="text-center text-sm font-medium text-accent">
                🎉 {milestoneState.milestone}{" "}
                {t("screens.welcome.milestoneCelebration")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Data Rail - Stats */}
        {totalSessions > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Panel className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                <StatSparkline
                  label="This Week"
                  value={getWeeklyData().reduce((a, b) => a + b, 0)}
                  delta={todaysSessions}
                  deltaLabel="today"
                  data={getWeeklyData()}
                  layout="stacked"
                />
                <StatSparkline
                  label="Streak"
                  value={`${streakStatus.streak}d`}
                  data={getWeeklyData()}
                  sparklineColor="hsl(var(--state-success))"
                  layout="stacked"
                />
              </div>
            </Panel>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-4"
        >
          <SectionHeader
            title="quick start"
            showDivider={false}
            className="mb-3"
          />

          {/* Primary CTA */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleQuickStart}
            icon={<Play className="size-5" />}
            className="mb-3"
          >
            {getRecommendationButtonText(
              primaryRecommendation,
              totalSessions > 0,
            )}
          </Button>

          {primaryRecommendation?.reason && (
            <p className="mb-4 text-center text-xs text-muted-foreground">
              {primaryRecommendation.reason}
            </p>
          )}

          {/* Quick Action Buttons Row */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/practice?session=morning-energizer")}
              className="h-auto flex-col gap-1 py-3"
            >
              <Clock className="size-4 text-accent" />
              <span className="text-xs">5 min</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/breathing")}
              className="h-auto flex-col gap-1 py-3"
            >
              <Wind className="size-4 text-accent" />
              <span className="text-xs">Breathe</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/sessions/builder")}
              className="h-auto flex-col gap-1 py-3"
            >
              <Plus className="size-4 text-accent" />
              <span className="text-xs">Custom</span>
            </Button>
          </div>
        </motion.div>

        {/* Active Program Card */}
        {activeProgram && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <SectionHeader
              title="your program"
              showDivider={false}
              className="mb-3"
            />
            <Panel
              hoverable
              className="cursor-pointer"
              onClick={() => {
                const program = getProgramById(activeProgram.programId);
                const currentWeek = getCurrentWeek(activeProgram.programId);
                if (program) {
                  navigate(
                    `/programs/${activeProgram.programId}/week/${currentWeek}`,
                  );
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <BookOpen className="size-4 shrink-0 text-accent" />
                    <span className="truncate font-medium text-foreground">
                      {getProgramById(activeProgram.programId)?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="size-3" />
                    <span>
                      Week {getCurrentWeek(activeProgram.programId)} of{" "}
                      {getProgramById(activeProgram.programId)?.totalWeeks}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  className={`size-5 text-muted-foreground ${isRTL ? "rtl-flip" : ""}`}
                />
              </div>
            </Panel>
          </motion.div>
        )}

        {/* Discover Programs (if no active) */}
        {!activeProgram && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <Panel
              hoverable
              className="cursor-pointer"
              onClick={() => navigate("/programs")}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Zap className="size-4 text-accent" />
                    <span className="font-medium text-foreground">
                      {t("screens.welcome.discoverPrograms")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("screens.welcome.programsDescription")}
                  </p>
                </div>
                <ChevronRight
                  className={`size-5 text-muted-foreground ${isRTL ? "rtl-flip" : ""}`}
                />
              </div>
            </Panel>
          </motion.div>
        )}

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <SectionHeader
              title="recently practiced"
              showDivider={false}
              className="mb-3"
              action={
                <button
                  onClick={() => navigate("/sessions")}
                  className="text-xs text-accent hover:text-accent/80"
                >
                  View all
                </button>
              }
            />
            <div className="space-y-2">
              {recentSessions.map((session, index) => {
                const sessionData =
                  getSessionById(session.sessionId) ||
                  getBreathingExerciseById(session.exerciseId);
                if (!sessionData) return null;

                const isBreathing = !!session.exerciseId;
                const sessionName = isBreathing
                  ? sessionData.nameEnglish
                  : sessionData.name;

                return (
                  <Panel
                    key={`recent-${index}`}
                    hoverable
                    padding="sm"
                    className="cursor-pointer"
                    onClick={() => handleRecentSessionClick(session)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-md bg-accent/10">
                          {isBreathing ? (
                            <Wind className="size-4 text-accent" />
                          ) : (
                            <Play className="size-4 text-accent" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {sessionName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.duration} min
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`size-4 text-muted-foreground ${isRTL ? "rtl-flip" : ""}`}
                      />
                    </div>
                  </Panel>
                );
              })}
            </div>
          </motion.div>
        )}
      </ContentBody>
    </DefaultLayout>
  );
}

export default Welcome;
