import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
  Target,
  Clock,
  Heart,
  Activity,
  BarChart3,
  Download,
  Smile,
  Zap
} from 'lucide-react';
import { Button, Heading, Text, ContentBody, Stat } from '../components/design-system';
import { DefaultLayout } from '../components/layouts';
import { PageHeader } from '../components/headers';
import useProgressStore from '../stores/progress';
import useAnalyticsStore from '../stores/analytics';
import SimpleBarChart from '../components/charts/SimpleBarChart';
import HeatmapCalendar from '../components/charts/HeatmapCalendar';
import SessionHistoryModal from '../components/SessionHistoryModal';
import { ProgramProgressCard } from '../components/cards';
import useTranslation from '../hooks/useTranslation';

function Insights() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDaySessions, setSelectedDaySessions] = useState([]);

  // Get data from stores - using selectors for better performance
  const totalSessions = useProgressStore(state => state.totalSessions);
  const practiceHistory = useProgressStore(state => state.practiceHistory);
  const breathingHistory = useProgressStore(state => state.breathingHistory);

  // Get analytics methods from analytics store
  const getPracticeHeatmap = useAnalyticsStore(state => state.getPracticeHeatmap);
  const getMostPracticedPoses = useAnalyticsStore(state => state.getMostPracticedPoses);
  const getFavoriteSessions = useAnalyticsStore(state => state.getFavoriteSessions);
  const getTimeOfDayDistribution = useAnalyticsStore(state => state.getTimeOfDayDistribution);
  const getBodyPartFocus = useAnalyticsStore(state => state.getBodyPartFocus);
  const getMoodAnalytics = useAnalyticsStore(state => state.getMoodAnalytics);
  const getAnalyticsSummary = useAnalyticsStore(state => state.getAnalyticsSummary);

  // Memoize expensive analytics calculations
  const heatmapData = useMemo(() => getPracticeHeatmap(30), [getPracticeHeatmap]);
  const mostPracticedPoses = useMemo(() => getMostPracticedPoses(5), [getMostPracticedPoses]);
  const favoriteSessions = useMemo(() => getFavoriteSessions(5), [getFavoriteSessions]);
  const timeDistribution = useMemo(() => getTimeOfDayDistribution(), [getTimeOfDayDistribution]);
  const bodyPartFocus = useMemo(() => getBodyPartFocus(), [getBodyPartFocus]);
  const moodAnalytics = useMemo(() => getMoodAnalytics(30), [getMoodAnalytics]);
  const summary = useMemo(() => getAnalyticsSummary(), [getAnalyticsSummary]);

  // Memoize calculated insights
  const averageSessionLength = useMemo(() => summary.overall.avgSessionLength, [summary]);
  const practiceConsistency = useMemo(() => summary.thisMonth.avgPerDay, [summary]);
  const weeklyTrend = useMemo(() => summary.thisWeek.sessions > 0 ? 'up' : 'neutral', [summary]);

  // Memoize favorite time of day calculation
  const favoriteTime = useMemo(() =>
    timeDistribution.reduce((max, current) =>
      current.value > max.value ? current : max,
      { label: 'Not enough data', value: 0 }
    ),
    [timeDistribution]
  );

  // Get mood trend text
  const getMoodTrendText = () => {
    if (moodAnalytics.moodTrend === 'insufficient_data') {
      return 'No mood data yet';
    }
    switch (moodAnalytics.moodTrend) {
      case 'improving': return 'Mood improving ✨';
      case 'stable': return 'Mood stable 😌';
      case 'declining': return 'Consider more practice 💙';
      default: return 'Tracking your wellbeing';
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  // Handle calendar day click
  const handleDayClick = (day) => {
    // Filter sessions for the selected day
    const allSessions = [...practiceHistory, ...breathingHistory];
    const daySessions = allSessions.filter(session => {
      const sessionDate = new Date(session.completedAt).toDateString();
      return sessionDate === day.dateString;
    });

    // Sort by time (most recent first)
    daySessions.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    setSelectedDate(day.dateString);
    setSelectedDaySessions(daySessions);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedDaySessions([]);
  };

  if (totalSessions < 5) {
    return (
      <DefaultLayout header={<PageHeader title={t('screens.insights.title')} showBack={false} />}>
        <div className="flex flex-1 items-center justify-center px-4 py-8 text-center">
          <div className="mx-auto max-w-sm">
            <Activity className="mx-auto mb-4 size-16 text-sage-300" />
            <Heading level={2} className="mb-2">
              {t('screens.insights.morePracticeNeeded')}
            </Heading>
            <Text variant="secondary" className="mb-6">
              {t('screens.insights.unlockInsights', { count: 5 - totalSessions, plural: 5 - totalSessions !== 1 ? 's' : '' })}
            </Text>
            <Button onClick={() => navigate('/sessions')} variant="primary">
              {t('screens.insights.startPracticing')}
            </Button>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
      <DefaultLayout
        header={
          <PageHeader
            title={t('screens.insights.title')}
            subtitle={t('screens.insights.subtitle')}
            showBack={false}
            actions={
              <button
                onClick={handleExportPDF}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-muted-foreground print:hidden"
                aria-label={t('screens.insights.exportPDF')}
              >
                <Download className="size-5" />
              </button>
            }
          />
        }
        className="print:p-0"
      >
        <ContentBody size="lg" spacing="lg" className="print:p-4">
          {/* Key Metrics Grid - 2x2 Compact Tiles */}
          <div className="mb-6 grid w-full min-w-0 grid-cols-2 gap-2 sm:gap-3">
            <Stat
              label={t('screens.insights.totalSessions')}
              value={summary.overall.totalSessions}
              icon={<Target className="size-5" />}
              description={`${summary.thisWeek.sessions} ${t('screens.insights.thisWeek')}`}
              trend={weeklyTrend}
              variant="compact"
            />
            <Stat
              label={t('screens.insights.totalMinutes')}
              value={`${summary.overall.totalMinutes} ${t('common.min')}`}
              icon={<Clock className="size-5" />}
              description={`${summary.thisMonth.minutes} ${t('screens.insights.thisMonth')}`}
              variant="compact"
            />
            <Stat
              label={t('screens.insights.averageLength')}
              value={`${averageSessionLength} ${t('common.min')}`}
              icon={<Activity className="size-5" />}
              description={t('screens.insights.perSession')}
              variant="compact"
            />
            <Stat
              label={t('screens.insights.currentStreak')}
              value={`${summary.overall.currentStreak} ${t('common.days')}`}
              icon={<Activity className="size-5" />}
              description={t('screens.insights.best', { count: summary.overall.longestStreak })}
              variant="compact"
            />
          </div>

          {/* Active Program Progress */}
          <div className="mb-8 w-full">
            <ProgramProgressCard />
          </div>

          {/* Practice Calendar */}
          <div className="mb-8 w-full">
            <HeatmapCalendar
              title={t('screens.insights.practiceFrequency')}
              practiceData={heatmapData}
              days={30}
              onDayClick={handleDayClick}
              selectedDate={selectedDate}
            />
          </div>

          {/* Analytics Grid */}
          <div className="mb-8 grid w-full min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
            {/* Most Practiced Poses */}
            <div className="w-full overflow-hidden">
              <SimpleBarChart
                title={t('screens.insights.mostPracticedPoses')}
                data={mostPracticedPoses}
                maxItems={5}
              />
            </div>

            {/* Favorite Sessions */}
            <div className="w-full overflow-hidden">
              <SimpleBarChart
                title={t('screens.insights.favoriteSessions')}
                data={favoriteSessions}
                maxItems={5}
              />
            </div>

            {/* Time of Day */}
            <div className="w-full overflow-hidden">
              <SimpleBarChart
                title={t('screens.insights.practiceTimeDistribution')}
                data={timeDistribution}
                maxItems={4}
              />
            </div>

            {/* Body Part Focus */}
            <div className="w-full overflow-hidden">
              <SimpleBarChart
                title={t('screens.insights.bodyPartFocus')}
                data={bodyPartFocus.slice(0, 5)}
                maxItems={5}
              />
            </div>
          </div>

          {/* Wellbeing Insights */}
          {moodAnalytics.sessionsWithMoodData > 0 && (
            <div className="mb-8 grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Stat
                label={t('screens.insights.moodImprovement')}
                value={`+${moodAnalytics.averageMoodImprovement}`}
                icon={<Smile className="size-5" />}
                description={getMoodTrendText()}
                trend={moodAnalytics.moodTrend === 'improving' ? 'up' : 'neutral'}
                variant="compact"
              />
              <Stat
                label={t('screens.insights.energyBoost')}
                value={`+${moodAnalytics.averageEnergyImprovement}`}
                icon={<Zap className="size-5" />}
                description={t('screens.insights.sessionsImproved', { percent: moodAnalytics.improvementRate })}
                variant="compact"
              />
              <Stat
                label={t('screens.insights.wellbeingSessions')}
                value={`${moodAnalytics.sessionsWithMoodData} ${t('common.of')} ${moodAnalytics.totalSessions}`}
                icon={<Heart className="size-5" />}
                description={t('screens.insights.sessionsWithTracking')}
                variant="compact"
              />
            </div>
          )}

          {/* Insights & Encouragement */}
          <div className="w-full rounded-lg bg-muted p-6">
            <div className="flex items-start space-x-3">
              <BarChart3 className="mt-1 size-6 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">{/* Prevent text overflow */}
                <Heading level={3} className="mb-2">
                  {t('screens.insights.yourInsights')}
                </Heading>
                <div className="space-y-2 text-sm">
                  {practiceConsistency > 0.5 && (
                    <Text variant="body">
                      {t('screens.insights.consistencyMessage', { avg: practiceConsistency })}
                    </Text>
                  )}
                  {favoriteTime.value > 0 && (
                    <Text variant="body">
                      {t('screens.insights.favoriteTimeMessage', { time: favoriteTime.label.toLowerCase(), count: favoriteTime.value })}
                    </Text>
                  )}
                  {mostPracticedPoses.length > 0 && (
                    <Text variant="body">
                      {t('screens.insights.topPoseMessage', { pose: mostPracticedPoses[0].label, count: mostPracticedPoses[0].value })}
                    </Text>
                  )}
                  {summary.overall.longestStreak >= 7 && (
                    <Text variant="body">
                      {t('screens.insights.longestStreakMessage', { count: summary.overall.longestStreak })}
                    </Text>
                  )}
                  {moodAnalytics.averageMoodImprovement > 0 && (
                    <Text variant="body">
                      {t('screens.insights.moodImprovementMessage', { improvement: moodAnalytics.averageMoodImprovement })}
                    </Text>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer for print */}
          <div className="hidden border-t pt-4 text-center text-sm text-muted-foreground print:block">
            <Text variant="caption">
              Practice Insights • Generated on {new Date().toLocaleDateString()} • Total Sessions: {totalSessions}
            </Text>
          </div>

        {/* Session History Modal */}
        <SessionHistoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedDate={selectedDate}
          sessions={selectedDaySessions}
        />
        </ContentBody>

        {/* Print Styles */}
        <style suppressHydrationWarning>{`
          @media print {
            body { font-size: 12px; }
            .print\\:hidden { display: none !important; }
            .print\\:block { display: block !important; }
            .print\\:p-0 { padding: 0 !important; }
            .print\\:p-4 { padding: 1rem !important; }
            .print\\:mb-4 { margin-bottom: 1rem !important; }
            .print\\:bg-white { background-color: #FFFFFF !important; } /* White for print (standard) */

            /* Ensure charts print well */
            .grid { break-inside: avoid; }
            .rounded-lg { border: 1px solid #e5e5e5; }

            /* Page breaks */
            .mb-8 { page-break-inside: avoid; }

            /* Color adjustments for print */
            .bg-muted { background-color: #f9f9f9 !important; }
            .text-muted-foreground { color: #333 !important; }

            /* Hide footer on print */
            [data-footer] { display: none !important; }
          }
        `}</style>
      </DefaultLayout>
  );
}

export default Insights;