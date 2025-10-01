// Progress Store - Track user's yoga practice progress and statistics
// Uses Zustand for simple state management with localStorage persistence

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper function to check if two dates are the same day
const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
};

// Helper function to check if a date is yesterday
const isYesterday = (date) => {
  if (!date) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
};

// Helper function to check if a date is today
const isToday = (date) => {
  if (!date) return false;
  return isSameDay(date, new Date());
};

// Helper function to get days since date
const getDaysSince = (date) => {
  if (!date) return 0;
  const now = new Date();
  const then = new Date(date);
  const diffTime = Math.abs(now - then);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const useProgressStore = create(
  persist(
    (set, get) => ({
      // Core progress data
      currentStreak: 0,
      longestStreak: 0,
      totalMinutes: 0,
      totalSessions: 0,
      lastPracticeDate: null,
      practiceHistory: [], // Array of practice session objects
      breathingHistory: [], // Array of breathing session objects
      achievements: [],
      recommendationHistory: [], // Track recommendation acceptance for analytics
      favoriteHistory: [], // Track favorite actions for analytics

      // Statistics breakdown
      stats: {
        thisWeek: {
          sessions: 0,
          minutes: 0,
          breathingSessions: 0,
          breathingMinutes: 0
        },
        thisMonth: {
          sessions: 0,
          minutes: 0,
          breathingSessions: 0,
          breathingMinutes: 0
        },
        allTime: {
          sessions: 0,
          minutes: 0,
          breathingSessions: 0,
          breathingMinutes: 0,
          averageSessionLength: 0,
          averageBreathingLength: 0
        }
      },

      // Actions
      completeSession: (sessionData) => {
        const state = get();
        const now = new Date();
        const today = now.toDateString();

        // Create session record
        const sessionRecord = {
          id: `session_${Date.now()}`,
          sessionId: sessionData.sessionId,
          sessionName: sessionData.sessionName,
          duration: sessionData.duration, // in minutes
          completedAt: now.toISOString(),
          poses: sessionData.poses || [],
          date: today,
          // Mood tracking data
          preMood: sessionData.preMood || null,
          preEnergy: sessionData.preEnergy || null,
          postMood: sessionData.postMood || null,
          postEnergy: sessionData.postEnergy || null,
          moodImprovement: sessionData.postMood && sessionData.preMood
            ? sessionData.postMood - sessionData.preMood
            : null,
          energyImprovement: sessionData.postEnergy && sessionData.preEnergy
            ? sessionData.postEnergy - sessionData.preEnergy
            : null
        };

        // Calculate new streak
        let newStreak = state.currentStreak;

        if (!state.lastPracticeDate) {
          // First session ever
          newStreak = 1;
        } else if (isToday(state.lastPracticeDate)) {
          // Already practiced today - don't increment streak but record session
          newStreak = state.currentStreak;
        } else if (isYesterday(state.lastPracticeDate)) {
          // Practiced yesterday - continue streak
          newStreak = state.currentStreak + 1;
        } else {
          // Gap in practice - reset streak
          newStreak = 1;
        }

        // Update longest streak if current is longer
        const newLongestStreak = Math.max(state.longestStreak, newStreak);

        // Add to practice history (keep last 100 sessions)
        const newHistory = [...state.practiceHistory, sessionRecord].slice(-100);

        // Update totals
        const newTotalMinutes = state.totalMinutes + sessionData.duration;
        const newTotalSessions = state.totalSessions + 1;

        // Calculate statistics
        const newStats = calculateStats(newHistory);

        // Check for new achievements
        const newAchievements = checkAchievements(state, {
          streak: newStreak,
          totalSessions: newTotalSessions,
          totalMinutes: newTotalMinutes
        });

        set({
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          totalMinutes: newTotalMinutes,
          totalSessions: newTotalSessions,
          lastPracticeDate: now.toISOString(),
          practiceHistory: newHistory,
          stats: newStats,
          achievements: [...state.achievements, ...newAchievements]
        });

        return sessionRecord;
      },

      // Complete breathing session
      completeBreathingSession: (breathingData) => {
        const state = get();
        const now = new Date();
        const today = now.toDateString();

        // Create breathing session record
        const breathingRecord = {
          id: `breathing_${Date.now()}`,
          exerciseId: breathingData.exerciseId,
          exerciseName: breathingData.exerciseName,
          duration: breathingData.duration, // in minutes
          completedAt: now.toISOString(),
          targetCycles: breathingData.targetCycles || 0,
          completedCycles: breathingData.completedCycles || 0,
          category: breathingData.category || 'calming',
          date: today,
          type: 'breathing',
          // Mood tracking data
          preMood: breathingData.preMood || null,
          preEnergy: breathingData.preEnergy || null,
          postMood: breathingData.postMood || null,
          postEnergy: breathingData.postEnergy || null,
          moodImprovement: breathingData.postMood && breathingData.preMood
            ? breathingData.postMood - breathingData.preMood
            : null,
          energyImprovement: breathingData.postEnergy && breathingData.preEnergy
            ? breathingData.postEnergy - breathingData.preEnergy
            : null
        };

        // Calculate new streak (breathing counts toward practice streak)
        let newStreak = state.currentStreak;

        if (!state.lastPracticeDate) {
          // First session ever
          newStreak = 1;
        } else if (isToday(state.lastPracticeDate)) {
          // Already practiced today - don't increment streak but record session
          newStreak = state.currentStreak;
        } else if (isYesterday(state.lastPracticeDate)) {
          // Practiced yesterday - continue streak
          newStreak = state.currentStreak + 1;
        } else {
          // Gap in practice - reset streak
          newStreak = 1;
        }

        // Update longest streak if current is longer
        const newLongestStreak = Math.max(state.longestStreak, newStreak);

        // Add to breathing history (keep last 100 sessions)
        const newBreathingHistory = [...state.breathingHistory, breathingRecord].slice(-100);

        // Update totals (breathing sessions count toward overall totals)
        const newTotalMinutes = state.totalMinutes + breathingData.duration;
        const newTotalSessions = state.totalSessions + 1;

        // Calculate statistics (including breathing sessions)
        const combinedHistory = [...state.practiceHistory, ...newBreathingHistory];
        const newStats = calculateStats(combinedHistory);

        // Check for new achievements
        const newAchievements = checkAchievements(state, {
          streak: newStreak,
          totalSessions: newTotalSessions,
          totalMinutes: newTotalMinutes
        });

        set({
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          totalMinutes: newTotalMinutes,
          totalSessions: newTotalSessions,
          lastPracticeDate: now.toISOString(),
          breathingHistory: newBreathingHistory,
          stats: newStats,
          achievements: [...state.achievements, ...newAchievements]
        });

        return breathingRecord;
      },

      // Get streak status for display
      getStreakStatus: () => {
        const state = get();

        if (!state.lastPracticeDate) {
          return {
            status: 'new',
            message: 'Start your first practice!',
            streak: 0
          };
        }

        if (isToday(state.lastPracticeDate)) {
          return {
            status: 'today',
            message: `Great job! ${state.currentStreak} day streak`,
            streak: state.currentStreak
          };
        }

        if (isYesterday(state.lastPracticeDate)) {
          return {
            status: 'continue',
            message: `Practice today to continue your ${state.currentStreak} day streak`,
            streak: state.currentStreak
          };
        }

        return {
          status: 'broken',
          message: 'Start a new streak today!',
          streak: 0,
          daysSince: getDaysSince(state.lastPracticeDate)
        };
      },

      // Get recent practice sessions for display
      getRecentSessions: (count = 5) => {
        const state = get();
        return state.practiceHistory
          .slice(-count)
          .reverse(); // Most recent first
      },

      // Get recent breathing sessions for display
      getRecentBreathingSessions: (count = 5) => {
        const state = get();
        return state.breathingHistory
          .slice(-count)
          .reverse(); // Most recent first
      },

      // Get combined recent sessions (yoga + breathing)
      // Deduplicates by sessionId/exerciseId to show unique session types only
      getRecentAllSessions: (count = 5) => {
        const state = get();
        const combined = [...state.practiceHistory, ...state.breathingHistory]
          .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

        // Deduplicate by sessionId (yoga) or exerciseId (breathing)
        const seen = new Set();
        const unique = [];

        for (const session of combined) {
          const key = session.type === 'breathing'
            ? `breathing_${session.exerciseId}`
            : `yoga_${session.sessionId}`;

          if (!seen.has(key)) {
            seen.add(key);
            unique.push(session);

            // Stop once we have enough unique sessions
            if (unique.length >= count) break;
          }
        }

        return unique;
      },

      // Get the most recent session for Quick Start functionality
      getLastSession: () => {
        const state = get();
        const allSessions = [...state.practiceHistory, ...state.breathingHistory];
        if (allSessions.length === 0) return null;

        const sortedSessions = allSessions.sort((a, b) =>
          new Date(b.completedAt) - new Date(a.completedAt)
        );
        return sortedSessions[0];
      },

      // Get practice calendar data (for showing practice days)
      getPracticeCalendar: () => {
        const state = get();
        const calendar = {};

        // Include both yoga and breathing sessions
        const allSessions = [...state.practiceHistory, ...state.breathingHistory];

        allSessions.forEach(session => {
          const date = new Date(session.completedAt).toDateString();
          if (!calendar[date]) {
            calendar[date] = {
              sessions: 0,
              totalMinutes: 0,
              yogaSessions: 0,
              breathingSessions: 0,
              date: date
            };
          }
          calendar[date].sessions += 1;
          calendar[date].totalMinutes += session.duration;

          if (session.type === 'breathing') {
            calendar[date].breathingSessions += 1;
          } else {
            calendar[date].yogaSessions += 1;
          }
        });

        return calendar;
      },

      // Reset progress (for debugging/testing)
      resetProgress: () => {
        set({
          currentStreak: 0,
          longestStreak: 0,
          totalMinutes: 0,
          totalSessions: 0,
          lastPracticeDate: null,
          practiceHistory: [],
          breathingHistory: [],
          achievements: [],
          stats: {
            thisWeek: { sessions: 0, minutes: 0, breathingSessions: 0, breathingMinutes: 0 },
            thisMonth: { sessions: 0, minutes: 0, breathingSessions: 0, breathingMinutes: 0 },
            allTime: { sessions: 0, minutes: 0, breathingSessions: 0, breathingMinutes: 0, averageSessionLength: 0, averageBreathingLength: 0 }
          }
        });
      },

      // Export data for backup
      exportData: () => {
        return get();
      },

      // Import data from backup
      importData: (data) => {
        set(data);
      },

      // Get mood analytics
      getMoodAnalytics: (days = 30) => {
        const state = get();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const allSessions = [...state.practiceHistory, ...state.breathingHistory];
        const recentSessions = allSessions.filter(session =>
          new Date(session.completedAt) >= cutoffDate &&
          session.preMood != null && session.postMood != null
        );

        if (recentSessions.length === 0) {
          return {
            averageMoodImprovement: 0,
            averageEnergyImprovement: 0,
            sessionsWithMoodData: 0,
            totalSessions: allSessions.filter(s => new Date(s.completedAt) >= cutoffDate).length,
            moodTrend: 'insufficient_data'
          };
        }

        const totalMoodImprovement = recentSessions.reduce((sum, session) =>
          sum + (session.moodImprovement || 0), 0
        );
        const totalEnergyImprovement = recentSessions.reduce((sum, session) =>
          sum + (session.energyImprovement || 0), 0
        );

        const averageMoodImprovement = totalMoodImprovement / recentSessions.length;
        const averageEnergyImprovement = totalEnergyImprovement / recentSessions.length;

        // Determine mood trend
        let moodTrend = 'stable';
        if (averageMoodImprovement > 0.5) moodTrend = 'improving';
        else if (averageMoodImprovement < -0.5) moodTrend = 'declining';

        return {
          averageMoodImprovement: Math.round(averageMoodImprovement * 100) / 100,
          averageEnergyImprovement: Math.round(averageEnergyImprovement * 100) / 100,
          sessionsWithMoodData: recentSessions.length,
          totalSessions: allSessions.filter(s => new Date(s.completedAt) >= cutoffDate).length,
          moodTrend,
          improvementRate: Math.round((recentSessions.filter(s => s.moodImprovement > 0).length / recentSessions.length) * 100)
        };
      },

      // Get mood improvement for last session
      getLastSessionMoodData: () => {
        const state = get();
        const allSessions = [...state.practiceHistory, ...state.breathingHistory];
        const lastSession = allSessions
          .filter(session => session.preMood != null && session.postMood != null)
          .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];

        return lastSession ? {
          preMood: lastSession.preMood,
          preEnergy: lastSession.preEnergy,
          postMood: lastSession.postMood,
          postEnergy: lastSession.postEnergy,
          moodImprovement: lastSession.moodImprovement,
          energyImprovement: lastSession.energyImprovement
        } : null;
      },

      // Analytics Methods for Insights Dashboard

      // Get practice heatmap data for calendar visualization
      getPracticeHeatmap: () => {
        const state = get();
        const calendar = {};

        // Include both yoga and breathing sessions
        const allSessions = [...state.practiceHistory, ...state.breathingHistory];

        allSessions.forEach(session => {
          const date = new Date(session.completedAt).toDateString();
          if (!calendar[date]) {
            calendar[date] = {
              sessions: 0,
              totalMinutes: 0,
              yogaSessions: 0,
              breathingSessions: 0,
              date: date
            };
          }
          calendar[date].sessions += 1;
          calendar[date].totalMinutes += session.duration;

          if (session.type === 'breathing') {
            calendar[date].breathingSessions += 1;
          } else {
            calendar[date].yogaSessions += 1;
          }
        });

        return calendar;
      },

      // Get most practiced poses (from session history)
      getMostPracticedPoses: (limit = 5) => {
        const state = get();
        const poseCount = {};

        // Count poses from yoga sessions
        state.practiceHistory.forEach(session => {
          if (session.poses && Array.isArray(session.poses)) {
            session.poses.forEach(pose => {
              const poseName = pose.nameEnglish || pose.name || 'Unknown Pose';
              poseCount[poseName] = (poseCount[poseName] || 0) + 1;
            });
          }
        });

        // Convert to array and sort
        return Object.entries(poseCount)
          .map(([label, value]) => ({ label, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, limit);
      },

      // Get favorite sessions based on frequency
      getFavoriteSessions: (limit = 5) => {
        const state = get();
        const sessionCount = {};

        // Count yoga sessions
        state.practiceHistory.forEach(session => {
          const sessionName = session.sessionName || 'Unknown Session';
          sessionCount[sessionName] = (sessionCount[sessionName] || 0) + 1;
        });

        // Count breathing sessions
        state.breathingHistory.forEach(session => {
          const sessionName = session.exerciseName || 'Unknown Breathing Exercise';
          sessionCount[sessionName] = (sessionCount[sessionName] || 0) + 1;
        });

        // Convert to array and sort
        return Object.entries(sessionCount)
          .map(([label, value]) => ({ label, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, limit);
      },

      // Get time of day distribution
      getTimeOfDayDistribution: () => {
        const state = get();
        const timeSlots = {
          'Morning (6-12)': 0,
          'Afternoon (12-17)': 0,
          'Evening (17-21)': 0,
          'Night (21-6)': 0
        };

        // Analyze all sessions
        const allSessions = [...state.practiceHistory, ...state.breathingHistory];

        allSessions.forEach(session => {
          const hour = new Date(session.completedAt).getHours();

          if (hour >= 6 && hour < 12) {
            timeSlots['Morning (6-12)']++;
          } else if (hour >= 12 && hour < 17) {
            timeSlots['Afternoon (12-17)']++;
          } else if (hour >= 17 && hour < 21) {
            timeSlots['Evening (17-21)']++;
          } else {
            timeSlots['Night (21-6)']++;
          }
        });

        return Object.entries(timeSlots).map(([label, value]) => ({ label, value }));
      },

      // Get body part focus breakdown (from yoga sessions)
      getBodyPartFocus: () => {
        const state = get();
        const bodyPartCount = {};

        state.practiceHistory.forEach(session => {
          if (session.poses && Array.isArray(session.poses)) {
            session.poses.forEach(pose => {
              if (pose.bodyParts && Array.isArray(pose.bodyParts)) {
                pose.bodyParts.forEach(bodyPart => {
                  bodyPartCount[bodyPart] = (bodyPartCount[bodyPart] || 0) + 1;
                });
              }
            });
          }
        });

        return Object.entries(bodyPartCount)
          .map(([label, value]) => ({ label, value }))
          .sort((a, b) => b.value - a.value);
      },

      // Track recommendation acceptance (for ML improvements)
      trackRecommendation: (recommendationData) => {
        const state = get();
        const record = {
          id: `rec_${Date.now()}`,
          sessionId: recommendationData.sessionId,
          reason: recommendationData.reason,
          category: recommendationData.category,
          confidence: recommendationData.confidence,
          accepted: recommendationData.accepted, // true if user clicked it
          timestamp: new Date().toISOString(),
          timeOfDay: new Date().getHours()
        };

        // Keep last 100 recommendation records
        const newHistory = [...state.recommendationHistory, record].slice(-100);

        set({
          recommendationHistory: newHistory
        });

        return record;
      },

      // Track favorite actions (for analytics)
      trackFavoriteAction: (actionData) => {
        const state = get();
        const record = {
          id: `fav_${Date.now()}`,
          itemId: actionData.itemId,
          type: actionData.type, // 'session' or 'breathing'
          action: actionData.action, // 'add' or 'remove'
          timestamp: new Date().toISOString(),
          timeOfDay: new Date().getHours()
        };

        // Keep last 100 favorite action records
        const newHistory = [...state.favoriteHistory, record].slice(-100);

        set({
          favoriteHistory: newHistory
        });

        return record;
      },

      // Get favorite analytics
      getFavoriteAnalytics: () => {
        const state = get();
        if (state.favoriteHistory.length === 0) {
          return {
            totalActions: 0,
            addCount: 0,
            removeCount: 0,
            mostFavorited: [],
            favoritesByType: { session: 0, breathing: 0 }
          };
        }

        const addActions = state.favoriteHistory.filter(f => f.action === 'add');
        const removeActions = state.favoriteHistory.filter(f => f.action === 'remove');

        // Count favorites by item
        const itemCount = {};
        addActions.forEach(action => {
          const key = `${action.type}_${action.itemId}`;
          itemCount[key] = (itemCount[key] || 0) + 1;
        });

        // Most favorited items
        const mostFavorited = Object.entries(itemCount)
          .map(([key, count]) => {
            const [type, itemId] = key.split('_');
            return { type, itemId, count };
          })
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // Favorites by type
        const favoritesByType = {
          session: addActions.filter(a => a.type === 'session').length,
          breathing: addActions.filter(a => a.type === 'breathing').length
        };

        return {
          totalActions: state.favoriteHistory.length,
          addCount: addActions.length,
          removeCount: removeActions.length,
          mostFavorited,
          favoritesByType
        };
      },

      // Get recommendation analytics
      getRecommendationAnalytics: () => {
        const state = get();
        if (state.recommendationHistory.length === 0) {
          return {
            totalRecommendations: 0,
            acceptanceRate: 0,
            mostAcceptedCategory: null,
            bestTimeOfDay: null
          };
        }

        const accepted = state.recommendationHistory.filter(r => r.accepted);
        const acceptanceRate = (accepted.length / state.recommendationHistory.length) * 100;

        // Find most accepted category
        const categoryAcceptance = {};
        state.recommendationHistory.forEach(rec => {
          if (!categoryAcceptance[rec.category]) {
            categoryAcceptance[rec.category] = { total: 0, accepted: 0 };
          }
          categoryAcceptance[rec.category].total += 1;
          if (rec.accepted) categoryAcceptance[rec.category].accepted += 1;
        });

        const mostAcceptedCategory = Object.entries(categoryAcceptance)
          .sort((a, b) => (b[1].accepted / b[1].total) - (a[1].accepted / a[1].total))[0]?.[0];

        // Find best time of day for acceptance
        const timeAcceptance = {};
        accepted.forEach(rec => {
          const hour = rec.timeOfDay;
          timeAcceptance[hour] = (timeAcceptance[hour] || 0) + 1;
        });

        const bestTimeOfDay = Object.entries(timeAcceptance)
          .sort((a, b) => b[1] - a[1])[0]?.[0];

        return {
          totalRecommendations: state.recommendationHistory.length,
          acceptanceRate: Math.round(acceptanceRate),
          mostAcceptedCategory,
          bestTimeOfDay: bestTimeOfDay ? parseInt(bestTimeOfDay) : null,
          categoryBreakdown: categoryAcceptance
        };
      },

      // Get weekly/monthly analytics summary
      getAnalyticsSummary: () => {
        const state = get();
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const allSessions = [...state.practiceHistory, ...state.breathingHistory];

        const thisWeekSessions = allSessions.filter(
          session => new Date(session.completedAt) >= oneWeekAgo
        );
        const thisMonthSessions = allSessions.filter(
          session => new Date(session.completedAt) >= oneMonthAgo
        );

        const avgSessionLength = allSessions.length > 0
          ? Math.round(allSessions.reduce((sum, s) => sum + s.duration, 0) / allSessions.length)
          : 0;

        return {
          thisWeek: {
            sessions: thisWeekSessions.length,
            minutes: thisWeekSessions.reduce((sum, s) => sum + s.duration, 0),
            avgPerDay: Math.round((thisWeekSessions.length / 7) * 10) / 10
          },
          thisMonth: {
            sessions: thisMonthSessions.length,
            minutes: thisMonthSessions.reduce((sum, s) => sum + s.duration, 0),
            avgPerDay: Math.round((thisMonthSessions.length / 30) * 10) / 10
          },
          overall: {
            totalSessions: state.totalSessions,
            totalMinutes: state.totalMinutes,
            avgSessionLength,
            longestStreak: state.longestStreak,
            currentStreak: state.currentStreak
          }
        };
      }
    }),
    {
      name: 'yoga-progress', // localStorage key
      version: 1,
      migrate: (persistedState, version) => {
        // Handle migrations if we change the store structure
        if (version === 0) {
          // Migrate from version 0 to 1
          return {
            ...persistedState,
            achievements: [],
            breathingHistory: [],
            recommendationHistory: [],
            favoriteHistory: [],
            stats: {
              thisWeek: { sessions: 0, minutes: 0, breathingSessions: 0, breathingMinutes: 0 },
              thisMonth: { sessions: 0, minutes: 0, breathingSessions: 0, breathingMinutes: 0 },
              allTime: { sessions: 0, minutes: 0, breathingSessions: 0, breathingMinutes: 0, averageSessionLength: 0, averageBreathingLength: 0 }
            }
          };
        }
        return persistedState;
      }
    }
  )
);

// Helper function to calculate weekly/monthly stats
function calculateStats(practiceHistory) {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const thisWeekSessions = practiceHistory.filter(
    session => new Date(session.completedAt) >= oneWeekAgo
  );

  const thisMonthSessions = practiceHistory.filter(
    session => new Date(session.completedAt) >= oneMonthAgo
  );

  const totalSessions = practiceHistory.length;
  const totalMinutes = practiceHistory.reduce((sum, session) => sum + session.duration, 0);

  return {
    thisWeek: {
      sessions: thisWeekSessions.length,
      minutes: thisWeekSessions.reduce((sum, session) => sum + session.duration, 0)
    },
    thisMonth: {
      sessions: thisMonthSessions.length,
      minutes: thisMonthSessions.reduce((sum, session) => sum + session.duration, 0)
    },
    allTime: {
      sessions: totalSessions,
      minutes: totalMinutes,
      averageSessionLength: totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0
    }
  };
}

// Helper function to check for new achievements
function checkAchievements(currentState, newData) {
  const achievements = [];
  const existingAchievements = currentState.achievements.map(a => a.id);

  // Achievement definitions
  const achievementChecks = [
    {
      id: 'first_session',
      name: 'First Steps',
      description: 'Complete your first yoga session',
      check: () => newData.totalSessions === 1,
      icon: '🧘'
    },
    {
      id: 'streak_3',
      name: 'Getting Started',
      description: 'Practice 3 days in a row',
      check: () => newData.streak === 3,
      icon: '🔥'
    },
    {
      id: 'streak_7',
      name: 'One Week Strong',
      description: 'Practice 7 days in a row',
      check: () => newData.streak === 7,
      icon: '🌟'
    },
    {
      id: 'streak_30',
      name: 'Monthly Master',
      description: 'Practice 30 days in a row',
      check: () => newData.streak === 30,
      icon: '💎'
    },
    {
      id: 'sessions_10',
      name: 'Committed Practitioner',
      description: 'Complete 10 sessions',
      check: () => newData.totalSessions === 10,
      icon: '🏆'
    },
    {
      id: 'sessions_50',
      name: 'Yoga Enthusiast',
      description: 'Complete 50 sessions',
      check: () => newData.totalSessions === 50,
      icon: '🌺'
    },
    {
      id: 'minutes_60',
      name: 'Hour of Peace',
      description: 'Practice for 60 total minutes',
      check: () => newData.totalMinutes >= 60,
      icon: '⏰'
    },
    {
      id: 'minutes_300',
      name: 'Five Hours of Flow',
      description: 'Practice for 5 total hours',
      check: () => newData.totalMinutes >= 300,
      icon: '🕰️'
    }
  ];

  // Check each achievement
  achievementChecks.forEach(achievement => {
    if (!existingAchievements.includes(achievement.id) && achievement.check()) {
      achievements.push({
        ...achievement,
        unlockedAt: new Date().toISOString()
      });
    }
  });

  return achievements;
}

export default useProgressStore;