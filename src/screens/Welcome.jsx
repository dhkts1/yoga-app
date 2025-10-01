import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { Sun, Moon, Sunrise, Flame, Star, ChevronRight, Sparkles, BookOpen, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Heading, Text } from '../components/design-system';
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

function Welcome() {
  const navigate = useNavigate();

  // Refs for tooltip targeting
  const quickStartRef = useRef(null);

  // Progress store
  const { getStreakStatus, totalSessions, practiceHistory, breathingHistory, getRecentAllSessions } = useProgressStore();
  const streakStatus = getStreakStatus();

  // Program progress store
  const { activeProgram, getCurrentWeek } = useProgramProgressStore();

  // Preferences store for tooltips and milestones
  const {
    isTooltipDismissed,
    dismissTooltip,
    getTooltipShownCount,
    incrementTooltipShown,
    isMilestoneCelebrated,
    markMilestoneCelebrated
  } = usePreferencesStore();

  // Get smart recommendation based on user history
  const allHistory = [...(practiceHistory || []), ...(breathingHistory || [])];
  const primaryRecommendation = getSmartRecommendation(new Date(), allHistory);

  // Get recently practiced sessions for "Recently Practiced" section
  const recentSessions = getRecentAllSessions(3);

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
    if (hour < 12) return { text: "Good Morning", icon: Sunrise };
    if (hour < 17) return { text: "Good Afternoon", icon: Sun };
    return { text: "Good Evening", icon: Moon };
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

  return (
    <DefaultLayout
      header={<PageHeader title="Today" showBack={false} />}
    >
      <div className="w-full max-w-sm mx-auto px-4 py-6 flex flex-col items-center">
        {/* Time-based greeting */}
        <div className="mb-6 text-center">
          <GreetingIcon className="mx-auto mb-4 h-12 w-12 text-sage-600" />
          <Heading level={1} className="mb-2">
            {greeting.text}
          </Heading>
          <Text variant="secondary">
            Ready for your mindful practice?
          </Text>
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
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full relative"
          >
            <Flame className="h-4 w-4 text-accent" />
            <Text variant="caption" className="font-medium text-accent">
              {streakStatus.streak} day streak
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
                    <Sparkles className="h-5 w-5 text-gold" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                    animate={{ opacity: 1, scale: 1.5, rotate: -180 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="absolute -bottom-2 -left-2"
                  >
                    <Sparkles className="h-5 w-5 text-gold" />
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
              className="mb-4 px-4 py-2 bg-gold/20 rounded-lg"
            >
              <Text variant="body" className="text-center font-medium text-gold-700">
                🎉 {celebratedMilestone} Day Streak!
              </Text>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main CTA - ONE dominant action */}
        <div className="w-full mb-6">
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
          className="mb-8 text-sage-600 hover:text-sage-700 font-medium text-sm flex items-center gap-1 transition-colors"
        >
          Browse All Sessions
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Program Discovery Section */}
        {activeProgram ? (
          // Active Program Card
          <div className="w-full mb-8">
            <Text variant="body" className="text-secondary font-medium mb-4 block">
              Your Program
            </Text>
            <button
              onClick={() => {
                const program = getProgramById(activeProgram.programId);
                const currentWeek = getCurrentWeek(activeProgram.programId);
                if (program) {
                  navigate(`/programs/${activeProgram.programId}/week/${currentWeek}`);
                }
              }}
              className="w-full p-5 bg-gradient-to-br from-sage-50 to-cream-50 rounded-xl shadow-sm hover:shadow-md transition-all text-left border border-sage-200 hover:border-sage-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 mr-3">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-sage-600 flex-shrink-0" />
                    <Text variant="body" className="font-medium text-primary">
                      {getProgramById(activeProgram.programId)?.name}
                    </Text>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>Week {getCurrentWeek(activeProgram.programId)} of {getProgramById(activeProgram.programId)?.totalWeeks}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <Text variant="caption" className="text-sage-600">
                  Continue your journey
                </Text>
                <ChevronRight className="h-5 w-5 text-sage-600" />
              </div>
            </button>
          </div>
        ) : (
          // Discover Programs CTA
          <div className="w-full mb-8">
            <button
              onClick={() => navigate('/programs')}
              className="w-full p-5 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all text-left border border-purple-200 hover:border-purple-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-3">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    <Text variant="body" className="font-medium text-primary">
                      Discover Multi-Week Programs
                    </Text>
                  </div>
                  <Text variant="caption" className="text-secondary leading-relaxed">
                    Build a deeper practice with structured 8-13 week yoga journeys
                  </Text>
                </div>
                <ChevronRight className="h-5 w-5 text-purple-600 flex-shrink-0 mt-1" />
              </div>
            </button>
          </div>
        )}

        {/* Recently Practiced - only show if user has history */}
        {recentSessions.length > 0 && (
          <div className="w-full">
            <Text variant="body" className="text-secondary font-medium mb-4 block">
              Recently Practiced
            </Text>
            <div className="space-y-3">
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
                    className="w-full p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left border border-sage-100 hover:border-sage-200"
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
                        {duration} min
                      </Text>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </DefaultLayout>
  );
}

export default Welcome;
