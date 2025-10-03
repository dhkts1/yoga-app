import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect, useMemo } from 'react';
import { Sun, Moon, Sunrise, Flame, Star, ChevronRight, Sparkles, BookOpen, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { Button, Heading, Text, ContentBody } from '../components/design-system';
import { DefaultLayout } from '../components/layouts';
import { PageHeader } from '../components/headers';
import useProgressStore from '../stores/progress';
import usePreferencesStore from '../stores/preferences';
import useProgramProgressStore from '../stores/programProgress';
import FeatureTooltip from '../components/FeatureTooltip';
import { getSessionById } from '../data/sessions';
import { getBreathingExerciseById } from '../data/breathing';
import { getSmartRecommendation, getRecommendationButtonText } from '../utils/recommendations';
import { getProgramById } from '../data/programs';
import useTranslation from '../hooks/useTranslation';
import { haptics } from '../utils/haptics';

function Welcome() {
  const navigate = useNavigate();
  const { t, isRTL } = useTranslation();

  // Refs for tooltip targeting
  const quickStartRef = useRef(null);

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
  const isTooltipDismissed = usePreferencesStore(state => state.isTooltipDismissed);
  const dismissTooltip = usePreferencesStore(state => state.dismissTooltip);
  const getTooltipShownCount = usePreferencesStore(state => state.getTooltipShownCount);
  const incrementTooltipShown = usePreferencesStore(state => state.incrementTooltipShown);
  const isMilestoneCelebrated = usePreferencesStore(state => state.isMilestoneCelebrated);
  const markMilestoneCelebrated = usePreferencesStore(state => state.markMilestoneCelebrated);

  // Memoize smart recommendation based on user history
  const allHistory = useMemo(() =>
    [...(practiceHistory || []), ...(breathingHistory || [])],
    [practiceHistory, breathingHistory]
  );
  const primaryRecommendation = useMemo(() =>
    getSmartRecommendation(new Date(), allHistory),
    [allHistory]
  );

  // Memoize recently practiced sessions
  const recentSessions = useMemo(() =>
    getRecentAllSessions(3),
    [getRecentAllSessions]
  );

  // Tooltip visibility state
  const [showQuickStartTooltip, setShowQuickStartTooltip] = useState(false);
  const [hasUsedQuickStart, setHasUsedQuickStart] = useState(false);

  // Milestone celebration state
  const [showMilestoneCelebration, setShowMilestoneCelebration] = useState(false);
  const [celebratedMilestone, setCelebratedMilestone] = useState(null);

  // Milestone values
  const MILESTONES = [3, 7, 30];

  // Check tooltip conditions on mount and when dependencies change
  useEffect(() => {
    // Tooltip: Quick Start
    // Show when: First 2 visits, hasn't used Quick Start yet
    const quickStartDismissed = isTooltipDismissed('tooltip-quick-start');
    const quickStartShownCount = getTooltipShownCount('tooltip-quick-start');

    if (!quickStartDismissed && quickStartShownCount < 2 && !hasUsedQuickStart) {
      setShowQuickStartTooltip(true);
      incrementTooltipShown('tooltip-quick-start');
    }
  }, [totalSessions]);

  // Check for milestone achievements and trigger celebration
  useEffect(() => {
    const currentStreak = streakStatus.streak;

    // Find the highest milestone achieved that hasn't been celebrated yet
    for (const milestone of MILESTONES) {
      if (currentStreak >= milestone && !isMilestoneCelebrated(milestone)) {
        // Trigger celebration
        setCelebratedMilestone(milestone);
        setShowMilestoneCelebration(true);
        markMilestoneCelebrated(milestone);

        // Auto-hide after 3 seconds
        const timer = setTimeout(() => {
          setShowMilestoneCelebration(false);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [streakStatus.streak, isMilestoneCelebrated, markMilestoneCelebrated]);

  // Handle Quick Start tooltip dismiss
  const handleQuickStartDismiss = () => {
    setShowQuickStartTooltip(false);
    dismissTooltip('tooltip-quick-start');
  };

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
    // Mark that Quick Start has been used (dismiss tooltip)
    setHasUsedQuickStart(true);
    if (showQuickStartTooltip) {
      dismissTooltip('tooltip-quick-start');
      setShowQuickStartTooltip(false);
    }

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
      <PullToRefresh onRefresh={handleRefresh} pullingContent="">
        <ContentBody size="sm" spacing="none">
        {/* Time-based greeting */}
        <div className="min-h-[20vh] flex flex-col items-center justify-center mb-0 text-center">
          <GreetingIcon className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
          <Heading level={1}>
            {greeting.text}
          </Heading>
        </div>

        {/* Compact Streak Badge - only show if user has practiced */}
        {totalSessions > 0 && streakStatus.streak > 0 && (
          <motion.div
            initial={{ scale: 1 }}
            animate={showMilestoneCelebration ? {
              scale: [1, 1.3, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 0.6, times: [0, 0.5, 1] }}
            className="mb-4 -mt-4 inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full relative"
          >
            <Flame className="h-4 w-4 text-accent" />
            <Text variant="caption" className="font-medium text-accent">
              {streakStatus.streak} {t('screens.welcome.dayStreak')}
            </Text>
            <div className="flex space-x-0.5">
              {Array.from({ length: Math.min(streakStatus.streak, 3) }).map((_, i) => (
                <Star key={i} className="h-3 w-3 text-accent fill-current" />
              ))}
            </div>

            {/* Sparkle effects during celebration */}
            <AnimatePresence>
              {showMilestoneCelebration && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                    animate={{ opacity: 1, scale: 1.5, rotate: 180 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sparkles className="h-5 w-5 text-accent" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                    animate={{ opacity: 1, scale: 1.5, rotate: -180 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="absolute -bottom-2 -left-2"
                  >
                    <Sparkles className="h-5 w-5 text-accent" />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Milestone Achievement Message */}
        <AnimatePresence>
          {showMilestoneCelebration && celebratedMilestone && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-3 px-4 py-2 bg-gold/20 rounded-lg"
            >
              <Text variant="body" className="text-center font-medium text-accent">
                🎉 {celebratedMilestone} {t('screens.welcome.milestoneCelebration')}
              </Text>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main CTA - ONE dominant action */}
        <div className="w-full mb-4">
          <div ref={quickStartRef} className="relative">
            <Button
              onClick={handleQuickStart}
              variant="primary"
              size="lg"
              className="w-full h-16 text-lg"
            >
              {getRecommendationButtonText(primaryRecommendation, totalSessions > 0)}
            </Button>

            {/* Tooltip: Quick Start */}
            <FeatureTooltip
              id="tooltip-quick-start"
              content="Start your practice instantly!"
              position="bottom"
              target={quickStartRef}
              show={showQuickStartTooltip}
              onDismiss={handleQuickStartDismiss}
              delay={2000}
            />
          </div>

          {/* Recommendation reason below button */}
          {primaryRecommendation && primaryRecommendation.reason && (
            <Text variant="caption" className="mt-3 text-center text-secondary block">
              {primaryRecommendation.reason}
            </Text>
          )}
        </div>

        {/* Secondary CTA - Browse All */}
        <button
          onClick={() => navigate('/sessions')}
          className="mb-6 text-muted-foreground hover:text-muted-foreground font-medium text-sm flex items-center gap-1 transition-colors"
        >
          {t('screens.welcome.browseAll')}
          {isRTL ? <ChevronRight className="h-4 w-4 rtl-flip" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {/* Program Discovery Section */}
        {activeProgram ? (
          // Active Program Card
          <div className="w-full mb-6">
            <Text variant="body" className="text-secondary font-medium mb-4 block">
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
              className="w-full p-4 bg-card rounded-xl shadow-sm hover:shadow-md transition-all text-left border border-border hover:border-primary"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 mr-3">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <Text variant="body" className="font-medium text-primary">
                      {getProgramById(activeProgram.programId)?.name}
                    </Text>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>{t('common.week')} {getCurrentWeek(activeProgram.programId)} {t('common.of')} {getProgramById(activeProgram.programId)?.totalWeeks}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <Text variant="caption" className="text-muted-foreground">
                  {t('screens.welcome.continueJourney')}
                </Text>
                {isRTL ? <ChevronRight className="h-5 w-5 text-muted-foreground rtl-flip" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
              </div>
            </button>
          </div>
        ) : (
          // Discover Programs CTA
          <div className="w-full mb-6">
            <button
              onClick={() => navigate('/programs')}
              className="w-full p-4 bg-card rounded-xl shadow-sm hover:shadow-md transition-all text-left border border-border hover:border-primary"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-3">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-accent flex-shrink-0" />
                    <Text variant="body" className="font-medium text-primary">
                      {t('screens.welcome.discoverPrograms')}
                    </Text>
                  </div>
                  <Text variant="caption" className="text-muted-foreground leading-relaxed">
                    {t('screens.welcome.programsDescription')}
                  </Text>
                </div>
                {isRTL ? <ChevronRight className="h-5 w-5 text-accent flex-shrink-0 mt-1 rtl-flip" /> : <ChevronRight className="h-5 w-5 text-accent flex-shrink-0 mt-1" />}
              </div>
            </button>
          </div>
        )}

        {/* Recently Practiced - only show if user has history */}
        {recentSessions.length > 0 && (
          <div className="w-full">
            <Text variant="body" className="text-secondary font-medium mb-3 block">
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
                    className="w-full p-3 bg-card rounded-xl shadow-sm hover:shadow-md transition-all text-left border border-border hover:border-primary"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 mr-3">
                        <Text variant="body" className="font-medium text-primary">
                          {sessionName}
                        </Text>
                        {sanskritName && (
                          <Text variant="caption" className="text-secondary">
                            {sanskritName}
                          </Text>
                        )}
                      </div>
                      <Text variant="body" className="text-secondary flex-shrink-0">
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
