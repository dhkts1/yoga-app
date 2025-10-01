import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
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
import { Button, Heading, Text } from '../components/design-system';
import { DefaultLayout } from '../components/layouts';
import { PageHeader } from '../components/headers';
import useProgressStore from '../stores/progress';
import StatCard from '../components/charts/StatCard';
import SimpleBarChart from '../components/charts/SimpleBarChart';
import HeatmapCalendar from '../components/charts/HeatmapCalendar';
import SessionHistoryModal from '../components/SessionHistoryModal';

function Insights() {
  const navigate = useNavigate();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDaySessions, setSelectedDaySessions] = useState([]);

  // Get analytics data from store
  const {
    totalSessions,
    practiceHistory,
    breathingHistory,
    getPracticeHeatmap,
    getMostPracticedPoses,
    getFavoriteSessions,
    getTimeOfDayDistribution,
    getBodyPartFocus,
    getMoodAnalytics,
    getAnalyticsSummary
  } = useProgressStore();

  // Fetch all analytics data
  const heatmapData = getPracticeHeatmap(30);
  const mostPracticedPoses = getMostPracticedPoses(5);
  const favoriteSessions = getFavoriteSessions(5);
  const timeDistribution = getTimeOfDayDistribution();
  const bodyPartFocus = getBodyPartFocus();
  const moodAnalytics = getMoodAnalytics(30);
  const summary = getAnalyticsSummary();

  // Calculate some insights
  const averageSessionLength = summary.overall.avgSessionLength;
  const practiceConsistency = summary.thisMonth.avgPerDay;
  const weeklyTrend = summary.thisWeek.sessions > 0 ? 'up' : 'neutral';

  // Determine favorite time of day
  const favoriteTime = timeDistribution.reduce((max, current) =>
    current.value > max.value ? current : max,
    { label: 'Not enough data', value: 0 }
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
      <DefaultLayout header={<PageHeader title="Progress" backPath="/" />}>
        <div className="px-4 py-8 text-center flex-1 flex items-center justify-center">
          <div className="max-w-sm mx-auto">
            <Activity className="h-16 w-16 text-sage-300 mx-auto mb-4" />
            <Heading level={2} className="mb-2">
              More Practice Needed
            </Heading>
            <Text variant="secondary" className="mb-6">
              Complete at least 5 sessions to unlock your insights dashboard.
              You're {5 - totalSessions} session{5 - totalSessions !== 1 ? 's' : ''} away!
            </Text>
            <Button onClick={() => navigate('/sessions')} variant="primary">
              Start Practicing
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
            title="Practice Insights"
            subtitle="Your mindful journey analytics"
            backPath="/"
            actions={
              <button
                onClick={handleExportPDF}
                className="print:hidden text-sage-600 hover:text-sage-700 p-2 rounded-lg hover:bg-sage-50 transition-colors"
                aria-label="Export PDF"
              >
                <Download className="h-5 w-5" />
              </button>
            }
          />
        }
        className="print:p-0"
        contentClassName="pb-24 !overflow-visible"
      >
        <div className="px-4 py-6 print:p-4 max-w-full">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full min-w-0">
            <StatCard
              title="Total Sessions"
              value={summary.overall.totalSessions}
              icon={Target}
              trend={`${summary.thisWeek.sessions} this week`}
              trendDirection={weeklyTrend}
            />
            <StatCard
              title="Total Minutes"
              value={summary.overall.totalMinutes}
              subtitle="min"
              icon={Clock}
              trend={`${summary.thisMonth.minutes} this month`}
            />
            <StatCard
              title="Average Length"
              value={averageSessionLength}
              subtitle="min"
              icon={Activity}
              trend="Per session"
            />
            <StatCard
              title="Current Streak"
              value={summary.overall.currentStreak}
              subtitle="days"
              icon={Activity}
              trend={`Best: ${summary.overall.longestStreak} days`}
            />
          </div>

          {/* Practice Calendar */}
          <div className="mb-8 w-full overflow-visible">
            <HeatmapCalendar
              title="Practice Frequency (Last 30 Days)"
              practiceData={heatmapData}
              days={30}
              onDayClick={handleDayClick}
              selectedDate={selectedDate}
            />
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full min-w-0">
            {/* Most Practiced Poses */}
            <div className="w-full overflow-hidden">
              <SimpleBarChart
                title="Most Practiced Poses"
                data={mostPracticedPoses}
                maxItems={5}
              />
            </div>

            {/* Favorite Sessions */}
            <div className="w-full overflow-hidden">
              <SimpleBarChart
                title="Favorite Sessions"
                data={favoriteSessions}
                maxItems={5}
              />
            </div>

            {/* Time of Day */}
            <div className="w-full overflow-hidden">
              <SimpleBarChart
                title="Practice Time Distribution"
                data={timeDistribution}
                maxItems={4}
              />
            </div>

            {/* Body Part Focus */}
            <div className="w-full overflow-hidden">
              <SimpleBarChart
                title="Body Part Focus"
                data={bodyPartFocus.slice(0, 5)}
                maxItems={5}
              />
            </div>
          </div>

          {/* Wellbeing Insights */}
          {moodAnalytics.sessionsWithMoodData > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 w-full min-w-0">
              <StatCard
                title="Mood Improvement"
                value={`+${moodAnalytics.averageMoodImprovement}`}
                subtitle="avg per session"
                icon={Smile}
                trend={getMoodTrendText()}
                trendDirection={moodAnalytics.moodTrend === 'improving' ? 'up' : 'neutral'}
              />
              <StatCard
                title="Energy Boost"
                value={`+${moodAnalytics.averageEnergyImprovement}`}
                subtitle="avg per session"
                icon={Zap}
                trend={`${moodAnalytics.improvementRate}% sessions improved mood`}
              />
              <StatCard
                title="Wellbeing Sessions"
                value={moodAnalytics.sessionsWithMoodData}
                subtitle={`of ${moodAnalytics.totalSessions}`}
                icon={Heart}
                trend="Sessions with mood tracking"
              />
            </div>
          )}

          {/* Insights & Encouragement */}
          <div className="bg-sage-50 rounded-lg p-6 w-full">
            <div className="flex items-start space-x-3">
              <BarChart3 className="h-6 w-6 text-sage-600 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">{/* Prevent text overflow */}
                <Heading level={3} className="mb-2">
                  Your Practice Insights
                </Heading>
                <div className="space-y-2 text-sm">
                  {practiceConsistency > 0.5 && (
                    <Text variant="body">
                      🌟 You're practicing {practiceConsistency} times per day on average this month - great consistency!
                    </Text>
                  )}
                  {favoriteTime.value > 0 && (
                    <Text variant="body">
                      ⏰ You're most energetic during {favoriteTime.label.toLowerCase()} -
                      {favoriteTime.value} of your sessions happen then.
                    </Text>
                  )}
                  {mostPracticedPoses.length > 0 && (
                    <Text variant="body">
                      🧘 Your go-to pose is {mostPracticedPoses[0].label} -
                      you've practiced it {mostPracticedPoses[0].value} times.
                    </Text>
                  )}
                  {summary.overall.longestStreak >= 7 && (
                    <Text variant="body">
                      🔥 Your longest streak of {summary.overall.longestStreak} days shows real dedication to your practice.
                    </Text>
                  )}
                  {moodAnalytics.averageMoodImprovement > 0 && (
                    <Text variant="body">
                      💙 Practice consistently improves your mood by {moodAnalytics.averageMoodImprovement} points on average.
                    </Text>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer for print */}
          <div className="print:block hidden text-center text-sm text-secondary border-t pt-4">
            <Text variant="caption">
              Practice Insights • Generated on {new Date().toLocaleDateString()} • Total Sessions: {totalSessions}
            </Text>
          </div>
        </div>

        {/* Session History Modal */}
        <SessionHistoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedDate={selectedDate}
          sessions={selectedDaySessions}
        />

        {/* Print Styles */}
        <style suppressHydrationWarning>{`
          @media print {
            body { font-size: 12px; }
            .print\\:hidden { display: none !important; }
            .print\\:block { display: block !important; }
            .print\\:p-0 { padding: 0 !important; }
            .print\\:p-4 { padding: 1rem !important; }
            .print\\:mb-4 { margin-bottom: 1rem !important; }
            .print\\:bg-white { background-color: white !important; }

            /* Ensure charts print well */
            .grid { break-inside: avoid; }
            .rounded-lg { border: 1px solid #e5e5e5; }

            /* Page breaks */
            .mb-8 { page-break-inside: avoid; }

            /* Color adjustments for print */
            .bg-sage-50 { background-color: #f9f9f9 !important; }
            .text-sage-600 { color: #333 !important; }

            /* Hide footer on print */
            [data-footer] { display: none !important; }
          }
        `}</style>
      </DefaultLayout>
  );
}

export default Insights;