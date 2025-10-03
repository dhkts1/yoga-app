// Analytics Store - Separate analytics methods for better code organization
// Uses progress store as source of truth (no state duplication)
// Follows Single Responsibility Principle

import { create } from 'zustand';
import useProgressStore from './progress';

const useAnalyticsStore = create(() => ({
  // Get mood analytics
  getMoodAnalytics: (days = 30) => {
    const { practiceHistory, breathingHistory } = useProgressStore.getState();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const allSessions = [...practiceHistory, ...breathingHistory];
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
    const { practiceHistory, breathingHistory } = useProgressStore.getState();
    const allSessions = [...practiceHistory, ...breathingHistory];
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

  // Get practice heatmap data for calendar visualization
  getPracticeHeatmap: () => {
    const { practiceHistory, breathingHistory } = useProgressStore.getState();
    const calendar = {};

    // Include both yoga and breathing sessions
    const allSessions = [...practiceHistory, ...breathingHistory];

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
    const { practiceHistory } = useProgressStore.getState();
    const poseCount = {};

    // Count poses from yoga sessions
    practiceHistory.forEach(session => {
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
    const { practiceHistory, breathingHistory } = useProgressStore.getState();
    const sessionCount = {};

    // Count yoga sessions
    practiceHistory.forEach(session => {
      const sessionName = session.sessionName || 'Unknown Session';
      sessionCount[sessionName] = (sessionCount[sessionName] || 0) + 1;
    });

    // Count breathing sessions
    breathingHistory.forEach(session => {
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
    const { practiceHistory, breathingHistory } = useProgressStore.getState();
    const timeSlots = {
      'Morning (6-12)': 0,
      'Afternoon (12-17)': 0,
      'Evening (17-21)': 0,
      'Night (21-6)': 0
    };

    // Analyze all sessions
    const allSessions = [...practiceHistory, ...breathingHistory];

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
    const { practiceHistory } = useProgressStore.getState();
    const bodyPartCount = {};

    practiceHistory.forEach(session => {
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
    const progressStore = useProgressStore.getState();
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
    const newHistory = [...progressStore.recommendationHistory, record].slice(-100);

    // Update progress store state
    useProgressStore.setState({
      recommendationHistory: newHistory
    });

    return record;
  },

  // Track favorite actions (for analytics)
  trackFavoriteAction: (actionData) => {
    const progressStore = useProgressStore.getState();
    const record = {
      id: `fav_${Date.now()}`,
      itemId: actionData.itemId,
      type: actionData.type, // 'session' or 'breathing'
      action: actionData.action, // 'add' or 'remove'
      timestamp: new Date().toISOString(),
      timeOfDay: new Date().getHours()
    };

    // Keep last 100 favorite action records
    const newHistory = [...progressStore.favoriteHistory, record].slice(-100);

    // Update progress store state
    useProgressStore.setState({
      favoriteHistory: newHistory
    });

    return record;
  },

  // Get favorite analytics
  getFavoriteAnalytics: () => {
    const { favoriteHistory } = useProgressStore.getState();
    if (favoriteHistory.length === 0) {
      return {
        totalActions: 0,
        addCount: 0,
        removeCount: 0,
        mostFavorited: [],
        favoritesByType: { session: 0, breathing: 0 }
      };
    }

    const addActions = favoriteHistory.filter(f => f.action === 'add');
    const removeActions = favoriteHistory.filter(f => f.action === 'remove');

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
      totalActions: favoriteHistory.length,
      addCount: addActions.length,
      removeCount: removeActions.length,
      mostFavorited,
      favoritesByType
    };
  },

  // Get recommendation analytics
  getRecommendationAnalytics: () => {
    const { recommendationHistory } = useProgressStore.getState();
    if (recommendationHistory.length === 0) {
      return {
        totalRecommendations: 0,
        acceptanceRate: 0,
        mostAcceptedCategory: null,
        bestTimeOfDay: null
      };
    }

    const accepted = recommendationHistory.filter(r => r.accepted);
    const acceptanceRate = (accepted.length / recommendationHistory.length) * 100;

    // Find most accepted category
    const categoryAcceptance = {};
    recommendationHistory.forEach(rec => {
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
      totalRecommendations: recommendationHistory.length,
      acceptanceRate: Math.round(acceptanceRate),
      mostAcceptedCategory,
      bestTimeOfDay: bestTimeOfDay ? parseInt(bestTimeOfDay) : null,
      categoryBreakdown: categoryAcceptance
    };
  },

  // Get weekly/monthly analytics summary
  getAnalyticsSummary: () => {
    const { practiceHistory, breathingHistory, totalSessions, totalMinutes, longestStreak, currentStreak } = useProgressStore.getState();
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const allSessions = [...practiceHistory, ...breathingHistory];

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
        totalSessions,
        totalMinutes,
        avgSessionLength,
        longestStreak,
        currentStreak
      }
    };
  }
}));

export default useAnalyticsStore;
