import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Sun, Moon, Sunrise, Flame, Star, ChevronRight, Sparkles, BookOpen, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { Button, Heading, Text, ContentBody } from '../components/design-system';
import { DefaultLayout } from '../components/layouts';
import { PageHeader } from '../components/headers';
import useProgressStore from '../stores/progress';
import usePreferencesStore from '../stores/preferences';
import useProgramProgressStore from '../stores/programProgress';
import { getSessionById } from '../data/sessions';
import { getBreathingExerciseById } from '../data/breathing';
import { getSmartRecommendation, getRecommendationButtonText } from '../utils/recommendations';
import { getProgramById } from '../data/programs';
import useTranslation from '../hooks/useTranslation';
import { haptics } from '../utils/haptics';

function Welcome() {
  const navigate = useNavigate();
  const { t, isRTL } = useTranslation();

  // Optimize Zustand selectors for progress store
  const getStreakStatus = useProgressStore(state => state.getStreakStatus);
  const totalSessions = useProgressStore(state => state.totalSessions);
  const practiceHistory = useProgressStore(state => state.practiceHistory);
  const breathingHistory = useProgressStore(state => state.breathingHistory);
  const getRecentAllSessions = useProgressStore(state => state.getRecentAllSessions);
  const streakStatus = useMemo(() => getStreakStatus(), [getStreakStatus]);

  // Optimize Zustand selectors for program progress store
  const activeProgram = useProgramProgressStore(state => state.activeProgram);
  const getCurrentWeek = useProgramProgressStore(state => state.getCurrentWeek);

  // Optimize Zustand selectors for preferences store
  const isMilestoneCelebrated = usePreferencesStore(state => state.isMilestoneCelebrated);
  const markMilestoneCelebrated = usePreferencesStore(state => state.markMilestoneCelebrated);

  // React Compiler handles memoization automatically
  const allHistory = [...(practiceHistory || []), ...(breathingHistory || [])];
  const primaryRecommendation = getSmartRecommendation(new Date(), allHistory);
  const recentSessions = getRecentAllSessions(3);

  // Milestone celebration state
  const [milestoneState, setMilestoneState] = useState({ show: false, milestone: null });

  // Milestone values
  const MILESTONES = [3, 7, 30];

  // Check for milestone achievements
  useEffect(() => {
    const currentStreak = streakStatus.streak;

    // Find the highest milestone achieved that hasn't been celebrated yet
    for (const milestone of MILESTONES) {
      if (currentStreak >= milestone && !isMilestoneCelebrated(milestone)) {
        // Set milestone state in one update
        setMilestoneState({ show: true, milestone });
        markMilestoneCelebrated(milestone);

        // Auto-hide after 3 seconds
        const timer = setTimeout(() => {
          setMilestoneState(prev => ({ ...prev, show: false }));
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [streakStatus.streak, isMilestoneCelebrated, markMilestoneCelebrated]);

  // Time-based greeting per PRD requirements
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: t('screens.welcome.goodMorning'), icon: Sunrise };
    if (hour < 17) return { text: t('screens.welcome.goodAfternoon'), icon: Sun };
    return { text: t('screens.welcome.goodEvening'), icon: Moon };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  // Quick Start handler - smart recommendation based on patterns
  const handleQuickStart = () => {
    if (!primaryRecommendation) {
      // Fallback to default
      navigate('/practice?session=morning-energizer');
      return;
    }

    // Check if it's a breathing exercise or yoga session
    const breathingExercise = getBreathingExerciseById(primaryRecommendation.sessionId);
    if (breathingExercise) {
      navigate(`/breathing/practice?exercise=${primaryRecommendation.sessionId}&duration=${breathingExercise.defaultDuration}`);
    } else {
      navigate(`/practice?session=${primaryRecommendation.sessionId}`);
    }
  };

  // Navigate to recently practiced session
  const handleRecentSessionClick = (session) => {
    const breathingExercise = getBreathingExerciseById(session.exerciseId);
    if (breathingExercise) {
      navigate(`/breathing/practice?exercise=${session.exerciseId}&duration=${breathingExercise.defaultDuration}`);
    } else {
      navigate(`/practice?session=${session.sessionId}`);
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    haptics.light();
    // Simulate refresh delay (data already reactive via Zustand)
    await new Promise(resolve => setTimeout(resolve, 800));
    return;
  };

  return (
    <DefaultLayout
      header={<PageHeader title="" subtitle="" showBack={false} />}
    >
      <PullToRefresh onRefresh={handleRefresh} pullingContent="" className="h-full">
        <ContentBody size="sm" spacing="none">
        {/* Time-based greeting */}
        <div className="-mt-6 mb-4 flex flex-col items-center justify-start text-center">
          <GreetingIcon className="mx-auto mb-1 size-12 text-muted-foreground" />
          <Heading level={1}>
            {greeting.text}
          </Heading>
        </div>

        {/* Compact Streak Badge - only show if user has practiced */}
        {totalSessions > 0 && streakStatus.streak > 0 && (
          <motion.div
            initial={{ scale: 1 }}
            animate={milestoneState.show ? {
              scale: [1, 1.3, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 0.6, times: [0, 0.5, 1] }}
            className="relative -mt-4 mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2"
          >
            <Flame className="size-4 text-accent" />
            <Text variant="caption" className="font-medium text-accent">
              {streakStatus.streak} {t('screens.welcome.dayStreak')}
            </Text>
            <div className="flex space-x-0.5">
              {Array.from({ length: Math.min(streakStatus.streak, 3) }).map((_, i) => (
                <Star key={i} className="size-3 fill-current text-accent" />
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
                    <Sparkles className="size-5 text-accent" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                    animate={{ opacity: 1, scale: 1.5, rotate: -180 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="absolute -bottom-2 -left-2"
                  >
                    <Sparkles className="size-5 text-accent" />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
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
              className="mb-3 rounded-lg bg-gold/20 px-4 py-2"
            >
              <Text variant="body" className="text-center font-medium text-accent">
                🎉 {milestoneState.milestone} {t('screens.welcome.milestoneCelebration')}
              </Text>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main CTA - ONE dominant action */}
        <div className="mb-4 w-full">
          <Button
            onClick={handleQuickStart}
            variant="primary"
            size="lg"
            className="h-16 w-full text-lg"
          >
            {getRecommendationButtonText(primaryRecommendation, totalSessions > 0)}
          </Button>

          {/* Recommendation reason below button */}
          {primaryRecommendation && primaryRecommendation.reason && (
            <Text variant="caption" className="mt-3 block text-center text-muted-foreground">
              {primaryRecommendation.reason}
            </Text>
          )}
        </div>

        {/* Secondary CTA - Browse All */}
        <button
          onClick={() => navigate('/sessions')}
          className="mb-3 flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-muted-foreground"
        >
          {t('screens.welcome.browseAll')}
          {isRTL ? <ChevronRight className="rtl-flip size-4" /> : <ChevronRight className="size-4" />}
        </button>

        {/* Program Discovery Section */}
        {activeProgram ? (
          // Active Program Card
          <div className="mb-6 w-full">
            <Text variant="body" className="mb-4 block font-medium text-muted-foreground">
              {t('screens.welcome.yourProgram')}
            </Text>
            <button
              onClick={() => {
                const program = getProgramById(activeProgram.programId);
                const currentWeek = getCurrentWeek(activeProgram.programId);
                if (program) {
                  navigate(`/programs/${activeProgram.programId}/week/${currentWeek}`);
                }
              }}
              className="w-full rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:border-primary hover:shadow-md"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="mr-3 min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <BookOpen className="size-5 shrink-0 text-muted-foreground" />
                    <Text variant="body" className="font-medium text-foreground">
                      {getProgramById(activeProgram.programId)?.name}
                    </Text>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="size-4 shrink-0" />
                    <span>{t('common.week')} {getCurrentWeek(activeProgram.programId)} {t('common.of')} {getProgramById(activeProgram.programId)?.totalWeeks}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <Text variant="caption" className="text-muted-foreground">
                  {t('screens.welcome.continueJourney')}
                </Text>
                {isRTL ? <ChevronRight className="rtl-flip size-5 text-muted-foreground" /> : <ChevronRight className="size-5 text-muted-foreground" />}
              </div>
            </button>
          </div>
        ) : (
          // Discover Programs CTA
          <div className="mb-6 w-full">
            <button
              onClick={() => navigate('/programs')}
              className="w-full rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:border-primary hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="mr-3 min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <BookOpen className="size-5 shrink-0 text-accent" />
                    <Text variant="body" className="font-medium text-foreground">
                      {t('screens.welcome.discoverPrograms')}
                    </Text>
                  </div>
                  <Text variant="caption" className="leading-relaxed text-muted-foreground">
                    {t('screens.welcome.programsDescription')}
                  </Text>
                </div>
                {isRTL ? <ChevronRight className="rtl-flip mt-1 size-5 shrink-0 text-accent" /> : <ChevronRight className="mt-1 size-5 shrink-0 text-accent" />}
              </div>
            </button>
          </div>
        )}

        {/* Recently Practiced - only show if user has history */}
        {recentSessions.length > 0 && (
          <div className="w-full">
            <Text variant="body" className="mb-3 block font-medium text-muted-foreground">
              {t('screens.welcome.recentlyPracticed')}
            </Text>
            <div className="space-y-2">
              {recentSessions.map((session, index) => {
                const sessionData = getSessionById(session.sessionId) || getBreathingExerciseById(session.exerciseId);
                if (!sessionData) return null;

                const isBreathing = !!session.exerciseId;
                const sessionName = isBreathing
                  ? sessionData.nameEnglish
                  : sessionData.name;
                const sanskritName = isBreathing ? sessionData.nameSanskrit : null;
                const duration = session.duration;

                return (
                  <button
                    key={`recent-${index}`}
                    onClick={() => handleRecentSessionClick(session)}
                    className="w-full rounded-xl border border-border bg-card p-3 text-left shadow-sm transition-all hover:border-primary hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="mr-3 min-w-0 flex-1">
                        <Text variant="body" className="font-medium text-foreground">
                          {sessionName}
                        </Text>
                        {sanskritName && (
                          <Text variant="caption" className="text-muted-foreground">
                            {sanskritName}
                          </Text>
                        )}
                      </div>
                      <Text variant="body" className="shrink-0 text-muted-foreground">
                        {duration} {t('common.min')}
                      </Text>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        </ContentBody>
      </PullToRefresh>
    </DefaultLayout>
  );
}

export default Welcome;
