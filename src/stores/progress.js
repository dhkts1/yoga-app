// Progress Store - Track user's yoga practice progress and statistics
// Uses Zustand for simple state management with localStorage persistence

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper function to handle localStorage quota exceeded
const handleQuotaExceeded = (storeName) => {
  console.warn(`localStorage quota exceeded for ${storeName} - attempting cleanup`);
  try {
    // This would be called if we need to trim old data
    // For now, just log - could implement automatic cleanup in future
    const keys = Object.keys(localStorage);
    console.log('Current localStorage usage:', keys.map(key => ({
      key,
      size: localStorage.getItem(key)?.length || 0
    })));
  } catch (error) {
    console.error('Failed to analyze localStorage:', error);
  }
};

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

// Helper function to calculate new streak based on last practice date
const calculateNewStreak = (currentStreak, lastPracticeDate) => {
  if (!lastPracticeDate) return 1; // First session ever
  if (isToday(lastPracticeDate)) return currentStreak; // Already practiced today
  if (isYesterday(lastPracticeDate)) return currentStreak + 1; // Continue streak
  return 1; // Gap in practice - reset streak
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
          // Program tracking (optional)
          programId: sessionData.programId || null,
          weekNumber: sessionData.weekNumber || null,
          dayNumber: sessionData.dayNumber || null,
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
        const newStreak = calculateNewStreak(state.currentStreak, state.lastPracticeDate);

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
        const newStreak = calculateNewStreak(state.currentStreak, state.lastPracticeDate);

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

      // Program-specific analytics methods

      // Get sessions for a specific program
      getProgramSessions: (programId) => {
        const state = get();
        return state.practiceHistory.filter(session => session.programId === programId);
      },

      // Get sessions for a specific week within a program
      getProgramWeekSessions: (programId, weekNumber) => {
        const state = get();
        return state.practiceHistory.filter(
          session => session.programId === programId && session.weekNumber === weekNumber
        );
      },

      // Get sessions for a specific day within a program week
      getProgramDaySessions: (programId, weekNumber, dayNumber) => {
        const state = get();
        return state.practiceHistory.filter(
          session =>
            session.programId === programId &&
            session.weekNumber === weekNumber &&
            session.dayNumber === dayNumber
        );
      },

      // Check if a specific program day has been completed
      isProgramDayCompleted: (programId, weekNumber, dayNumber) => {
        const state = get();
        return state.practiceHistory.some(
          session =>
            session.programId === programId &&
            session.weekNumber === weekNumber &&
            session.dayNumber === dayNumber
        );
      },

      // Get completion stats for a program week
      getProgramWeekStats: (programId, weekNumber, totalDays) => {
        const state = get();
        const weekSessions = state.practiceHistory.filter(
          session => session.programId === programId && session.weekNumber === weekNumber
        );

        const completedDays = new Set(weekSessions.map(s => s.dayNumber)).size;
        const totalMinutes = weekSessions.reduce((sum, s) => sum + s.duration, 0);

        return {
          completedDays,
          totalDays,
          completionRate: totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0,
          totalMinutes,
          sessionsCompleted: weekSessions.length
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
      },
      // Error handling for localStorage operations
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to load saved progress data:', error);
          // Could show user notification here in future
        }
      },
      serialize: (state) => {
        try {
          return JSON.stringify(state);
        } catch (error) {
          console.error('Failed to save progress data:', error);

          // Check if it's a quota exceeded error
          if (error.name === 'QuotaExceededError' || error.code === 22) {
            handleQuotaExceeded('yoga-progress');
          }

          // Return empty object to prevent crashes
          return '{}';
        }
      },
      deserialize: (str) => {
        try {
          return JSON.parse(str);
        } catch (error) {
          console.error('Failed to parse saved progress data:', error);
          console.warn('Progress data corrupted - resetting to defaults');
          // Return undefined to use initial state
          return undefined;
        }
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