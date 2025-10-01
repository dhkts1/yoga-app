// Smart Session Recommendation Engine
// Analyzes user practice patterns and provides personalized session recommendations
// Based on time of day, practice history, mood correlations, and user preferences

import { sessions } from '../data/sessions';
import { breathingExercises } from '../data/breathing';

/**
 * Analyze user's practice patterns from history
 * @param {Array} practiceHistory - Array of completed sessions
 * @returns {Object} - Pattern analysis results
 */
export function analyzePracticePatterns(practiceHistory) {
  if (!practiceHistory || practiceHistory.length === 0) {
    return {
      favoriteTimeOfDay: null,
      averageDuration: 0,
      favoriteSessions: [],
      moodCorrelations: {},
      practiceFrequency: 0,
      totalSessions: 0
    };
  }

  // Combine yoga and breathing sessions
  const allSessions = practiceHistory;

  // Calculate favorite time of day
  const timeSlots = {
    morning: 0,    // 5am-11am
    midday: 0,     // 11am-3pm
    afternoon: 0,  // 3pm-6pm
    evening: 0,    // 6pm-10pm
    night: 0       // 10pm-5am
  };

  allSessions.forEach(session => {
    const hour = new Date(session.completedAt).getHours();

    if (hour >= 5 && hour < 11) timeSlots.morning++;
    else if (hour >= 11 && hour < 15) timeSlots.midday++;
    else if (hour >= 15 && hour < 18) timeSlots.afternoon++;
    else if (hour >= 18 && hour < 22) timeSlots.evening++;
    else timeSlots.night++;
  });

  const favoriteTimeOfDay = Object.entries(timeSlots)
    .sort((a, b) => b[1] - a[1])[0][0];

  // Calculate average duration
  const totalDuration = allSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const averageDuration = Math.round(totalDuration / allSessions.length);

  // Find favorite sessions (most practiced)
  const sessionCounts = {};
  allSessions.forEach(session => {
    const key = session.sessionId || session.exerciseId;
    if (key) {
      sessionCounts[key] = (sessionCounts[key] || 0) + 1;
    }
  });

  const favoriteSessions = Object.entries(sessionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([sessionId, count]) => ({ sessionId, count }));

  // Calculate mood correlations (which sessions improve mood most)
  const moodCorrelations = {};
  allSessions
    .filter(s => s.moodImprovement != null)
    .forEach(session => {
      const key = session.sessionId || session.exerciseId;
      if (key) {
        if (!moodCorrelations[key]) {
          moodCorrelations[key] = {
            totalImprovement: 0,
            count: 0,
            averageImprovement: 0
          };
        }
        moodCorrelations[key].totalImprovement += session.moodImprovement;
        moodCorrelations[key].count += 1;
      }
    });

  // Calculate averages
  Object.keys(moodCorrelations).forEach(key => {
    const data = moodCorrelations[key];
    data.averageImprovement = data.totalImprovement / data.count;
  });

  // Calculate practice frequency (sessions per week)
  const daysSinceFirstSession = getDaysSinceDate(allSessions[0].completedAt);
  const practiceFrequency = daysSinceFirstSession > 0
    ? Math.round((allSessions.length / daysSinceFirstSession) * 7 * 10) / 10
    : 0;

  return {
    favoriteTimeOfDay,
    averageDuration,
    favoriteSessions,
    moodCorrelations,
    practiceFrequency,
    totalSessions: allSessions.length
  };
}

/**
 * Get smart session recommendation based on context
 * @param {Date} currentTime - Current time
 * @param {Array} practiceHistory - User's practice history
 * @returns {Object} - Recommendation with session ID, reason, and confidence
 */
export function getSmartRecommendation(currentTime = new Date(), practiceHistory = []) {
  const hour = currentTime.getHours();
  const patterns = analyzePracticePatterns(practiceHistory);

  // For new users (no history), use time-based defaults
  if (!practiceHistory || practiceHistory.length === 0) {
    return getTimeBasedRecommendation(hour);
  }

  // Check for strong favorites (practiced 3+ times)
  const strongFavorite = patterns.favoriteSessions.find(s => s.count >= 3);
  if (strongFavorite) {
    // Recommend favorite, but still consider time of day
    const timeAppropriate = isSessionAppropriateForTime(strongFavorite.sessionId, hour);
    if (timeAppropriate || strongFavorite.count >= 5) {
      return {
        sessionId: strongFavorite.sessionId,
        reason: '',
        confidence: Math.min(strongFavorite.count / 10, 0.95),
        category: 'history'
      };
    }
  }

  // Check for consistent practice time
  if (patterns.totalSessions >= 3) {
    const currentTimeSlot = getTimeSlot(hour);
    if (currentTimeSlot === patterns.favoriteTimeOfDay) {
      // User usually practices at this time - recommend appropriate session
      const timeBasedRec = getTimeBasedRecommendation(hour);
      return {
        ...timeBasedRec,
        reason: 'Perfect for your usual practice time',
        confidence: 0.8,
        category: 'routine'
      };
    }
  }

  // Check mood-based recommendations
  const lastSession = practiceHistory[practiceHistory.length - 1];
  if (lastSession && lastSession.preMood !== undefined) {
    const moodBasedRec = getMoodBasedRecommendation(lastSession.preMood, patterns.moodCorrelations);
    if (moodBasedRec) {
      return moodBasedRec;
    }
  }

  // Default to time-based recommendation with pattern awareness
  const timeBasedRec = getTimeBasedRecommendation(hour);
  return {
    ...timeBasedRec,
    confidence: 0.7,
    category: 'time'
  };
}

/**
 * Get multiple top recommendations
 * @param {Array} practiceHistory - User's practice history
 * @param {number} limit - Number of recommendations to return
 * @returns {Array} - Array of session recommendations with reasons
 */
export function getTopRecommendations(practiceHistory = [], limit = 3) {
  const recommendations = [];
  const patterns = analyzePracticePatterns(practiceHistory);
  const hour = new Date().getHours();
  const seenSessions = new Set();

  // 1. Add primary recommendation
  const primary = getSmartRecommendation(new Date(), practiceHistory);
  recommendations.push({
    ...primary,
    isPrimary: true
  });
  seenSessions.add(primary.sessionId);

  // 2. Add time-appropriate session
  const timeRec = getTimeBasedRecommendation(hour);
  if (!seenSessions.has(timeRec.sessionId)) {
    recommendations.push({
      ...timeRec,
      isPrimary: false
    });
    seenSessions.add(timeRec.sessionId);
  }

  // 3. Add favorite sessions
  if (patterns.favoriteSessions.length > 0) {
    for (const fav of patterns.favoriteSessions) {
      if (recommendations.length >= limit) break;
      if (!seenSessions.has(fav.sessionId)) {
        const sessionData = getSessionData(fav.sessionId);
        if (sessionData) {
          recommendations.push({
            sessionId: fav.sessionId,
            reason: `You've loved this ${fav.count}x`,
            confidence: 0.8,
            category: 'favorite',
            isPrimary: false
          });
          seenSessions.add(fav.sessionId);
        }
      }
    }
  }

  // 4. Add mood-boosting sessions if we have mood data
  if (patterns.moodCorrelations && Object.keys(patterns.moodCorrelations).length > 0) {
    const bestMoodSession = Object.entries(patterns.moodCorrelations)
      .sort((a, b) => b[1].averageImprovement - a[1].averageImprovement)[0];

    if (bestMoodSession && !seenSessions.has(bestMoodSession[0]) && recommendations.length < limit) {
      const sessionData = getSessionData(bestMoodSession[0]);
      if (sessionData) {
        recommendations.push({
          sessionId: bestMoodSession[0],
          reason: 'Great for your mood',
          confidence: 0.75,
          category: 'mood',
          isPrimary: false
        });
        seenSessions.add(bestMoodSession[0]);
      }
    }
  }

  // 5. Fill remaining slots with diverse options
  const allSessionIds = [...sessions.map(s => s.id), ...breathingExercises.map(b => b.id)];
  for (const sessionId of allSessionIds) {
    if (recommendations.length >= limit) break;
    if (!seenSessions.has(sessionId)) {
      const sessionData = getSessionData(sessionId);
      if (sessionData) {
        recommendations.push({
          sessionId,
          reason: isSessionAppropriateForTime(sessionId, hour)
            ? 'Perfect for now'
            : 'Try something new',
          confidence: 0.6,
          category: 'explore',
          isPrimary: false
        });
        seenSessions.add(sessionId);
      }
    }
  }

  return recommendations.slice(0, limit);
}

// ============= Helper Functions =============

function getTimeSlot(hour) {
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 15) return 'midday';
  if (hour >= 15 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

function getTimeBasedRecommendation(hour) {
  const timeSlot = getTimeSlot(hour);

  const recommendations = {
    morning: {
      sessionId: 'morning-energizer',
      reason: 'Start your day with energy',
      confidence: 0.9,
      category: 'time'
    },
    midday: {
      sessionId: 'lunch-break-relief',
      reason: 'Perfect for a midday reset',
      confidence: 0.9,
      category: 'time'
    },
    afternoon: {
      sessionId: 'lunch-break-relief',
      reason: 'Release afternoon tension',
      confidence: 0.85,
      category: 'time'
    },
    evening: {
      sessionId: 'evening-wind-down',
      reason: 'Unwind from your day',
      confidence: 0.9,
      category: 'time'
    },
    night: {
      sessionId: 'evening-wind-down',
      reason: 'Prepare for restful sleep',
      confidence: 0.85,
      category: 'time'
    }
  };

  return recommendations[timeSlot] || recommendations.morning;
}

function getMoodBasedRecommendation(preMood, moodCorrelations) {
  // Pre-mood scale: 1 (down) to 5 (great)

  // If feeling down or okay, recommend energizing or mood-boosting sessions
  if (preMood <= 2) {
    // Find session with best mood improvement
    const bestMoodSession = Object.entries(moodCorrelations)
      .filter(([, data]) => data.averageImprovement > 0.5)
      .sort((a, b) => b[1].averageImprovement - a[1].averageImprovement)[0];

    if (bestMoodSession) {
      return {
        sessionId: bestMoodSession[0],
        reason: 'This always lifts your spirits',
        confidence: 0.85,
        category: 'mood'
      };
    }

    // Fallback to morning energizer for low mood
    return {
      sessionId: 'morning-energizer',
      reason: 'Boost your energy and mood',
      confidence: 0.75,
      category: 'mood'
    };
  }

  return null; // No specific mood-based recommendation
}

function isSessionAppropriateForTime(sessionId, hour) {
  const timeSlot = getTimeSlot(hour);
  const sessionData = getSessionData(sessionId);

  if (!sessionData) return false;

  // Check if session focus matches time of day
  const appropriateFocus = {
    morning: ['energy', 'strength'],
    midday: ['relax', 'balance'],
    afternoon: ['relax', 'balance'],
    evening: ['relax', 'sleep'],
    night: ['relax', 'sleep', 'calming']
  };

  const focus = sessionData.focus || sessionData.category;
  return appropriateFocus[timeSlot]?.includes(focus);
}

function getSessionData(sessionId) {
  // Check yoga sessions first
  const yogaSession = sessions.find(s => s.id === sessionId);
  if (yogaSession) return yogaSession;

  // Check breathing exercises
  const breathingExercise = breathingExercises.find(b => b.id === sessionId);
  return breathingExercise;
}

function getDaysSinceDate(dateString) {
  if (!dateString) return 0;
  const then = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - then);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get recommendation button text based on context
 * @param {Object} recommendation - Recommendation object
 * @param {boolean} hasHistory - Whether user has practice history
 * @returns {string} - Button text
 */
export function getRecommendationButtonText(recommendation, hasHistory = false) {
  if (!hasHistory) {
    return 'Quick Start';
  }

  const categoryTexts = {
    history: 'Start Your Favorite',
    routine: 'Start Your Usual Practice',
    mood: 'Boost Your Mood',
    time: getTimeBasedButtonText(),
    explore: 'Start Practice'
  };

  return categoryTexts[recommendation.category] || 'Start Practice';
}

function getTimeBasedButtonText() {
  const hour = new Date().getHours();
  const timeSlot = getTimeSlot(hour);

  const texts = {
    morning: 'Start Your Morning',
    midday: 'Take a Practice Break',
    afternoon: 'Afternoon Reset',
    evening: 'Unwind This Evening',
    night: 'Evening Wind-down'
  };

  return texts[timeSlot] || 'Start Practice';
}

/**
 * Get recommendation tag text (small descriptive label)
 * @param {Object} recommendation - Recommendation object
 * @returns {string} - Tag text
 */
export function getRecommendationTag(recommendation) {
  const hour = new Date().getHours();
  const timeSlot = getTimeSlot(hour);

  const categoryTags = {
    history: 'Your favorite',
    routine: `Your ${timeSlot} practice`,
    mood: 'Mood booster',
    time: {
      morning: 'Morning pick-me-up',
      midday: 'Midday reset',
      afternoon: 'Afternoon energy',
      evening: 'Evening calm',
      night: 'Sleep prep'
    }[timeSlot],
    favorite: 'You loved this',
    explore: 'Try this'
  };

  return categoryTags[recommendation.category] || recommendation.reason;
}
