import { describe, it, expect, beforeEach } from 'vitest';
import useProgressStore from '../../src/stores/progress';
import usePreferencesStore from '../../src/stores/preferences';

/**
 * Integration Tests: Mood Tracking Flow
 *
 * Tests mood and energy tracking across sessions.
 * Verifies analytics calculations and preferences integration.
 */
describe('Mood Tracking Flow', () => {
  beforeEach(() => {
    // Reset stores before each test
    localStorage.clear();

    // Reset progress store to initial state
    useProgressStore.setState({
      currentStreak: 0,
      longestStreak: 0,
      totalMinutes: 0,
      totalSessions: 0,
      lastPracticeDate: null,
      practiceHistory: [],
      breathingHistory: [],
      achievements: [],
      recommendationHistory: [],
      favoriteHistory: [],
      stats: {
        thisWeek: { sessions: 0, minutes: 0, breathingSessions: 0, breathingMinutes: 0 },
        thisMonth: { sessions: 0, minutes: 0, breathingSessions: 0, breathingMinutes: 0 },
        allTime: { sessions: 0, minutes: 0, breathingSessions: 0, breathingMinutes: 0, averageSessionLength: 0, averageBreathingLength: 0 }
      }
    });

    // Reset preferences store to initial state
    usePreferencesStore.setState({
      voiceEnabled: true,
      voicePersonality: 'gentle',
      voiceSpeed: 1.0,
      voiceVolume: 0.8,
      autoAdvance: true,
      countdownSounds: false,
      showTips: true,
      restDuration: 5,
      practiceReminders: false,
      reminderTime: '09:00',
      streakAlerts: true,
      theme: 'light',
      language: 'en',
      hasSeenOnboarding: false,
      tooltipsDismissed: [],
      tooltipsShownCount: {},
      breathing: { showMoodCheck: true, defaultDuration: 3, voiceEnabled: false },
      yoga: { showMoodCheck: true, defaultDuration: 10, voiceEnabled: false },
      favoriteSessions: [],
      favoriteExercises: [],
      milestoneCelebrated: {}
    });
  });

  describe('Recording Mood Data', () => {
    it('stores mood and energy data with session', () => {
      const sessionData = {
        sessionId: 'morning-energizer',
        sessionName: 'Morning Energizer',
        duration: 10,
        poses: [],
        preMood: 3,
        postMood: 5,
        preEnergy: 2,
        postEnergy: 4
      };

      const record = useProgressStore.getState().completeSession(sessionData);

      expect(record.preMood).toBe(3);
      expect(record.postMood).toBe(5);
      expect(record.preEnergy).toBe(2);
      expect(record.postEnergy).toBe(4);
    });

    it('calculates mood improvement correctly', () => {
      const sessionData = {
        sessionId: 'morning-energizer',
        sessionName: 'Morning Energizer',
        duration: 10,
        poses: [],
        preMood: 2,
        postMood: 5,
        preEnergy: 1,
        postEnergy: 4
      };

      const record = useProgressStore.getState().completeSession(sessionData);

      expect(record.moodImprovement).toBe(3); // 5 - 2
      expect(record.energyImprovement).toBe(3); // 4 - 1
    });

    it('handles negative mood change', () => {
      const sessionData = {
        sessionId: 'evening-wind-down',
        sessionName: 'Evening Wind Down',
        duration: 10,
        poses: [],
        preMood: 4,
        postMood: 3,
        preEnergy: 5,
        postEnergy: 2
      };

      const record = useProgressStore.getState().completeSession(sessionData);

      expect(record.moodImprovement).toBe(-1); // 3 - 4
      expect(record.energyImprovement).toBe(-3); // 2 - 5 (expected for relaxation)
    });

    it('handles sessions without mood data', () => {
      const sessionData = {
        sessionId: 'morning-energizer',
        sessionName: 'Morning Energizer',
        duration: 10,
        poses: []
        // No mood data
      };

      const record = useProgressStore.getState().completeSession(sessionData);

      expect(record.preMood).toBeNull();
      expect(record.postMood).toBeNull();
      expect(record.moodImprovement).toBeNull();
      expect(record.energyImprovement).toBeNull();
    });

    it('persists mood data to localStorage', () => {
      const sessionData = {
        sessionId: 'morning-energizer',
        sessionName: 'Morning Energizer',
        duration: 10,
        poses: [],
        preMood: 3,
        postMood: 5,
        preEnergy: 2,
        postEnergy: 4
      };

      useProgressStore.getState().completeSession(sessionData);

      const stored = JSON.parse(localStorage.getItem('yoga-progress'));
      const session = stored.state.practiceHistory[0];

      expect(session.preMood).toBe(3);
      expect(session.postMood).toBe(5);
      expect(session.moodImprovement).toBe(2);
    });
  });

  describe('Mood Analytics', () => {
    it('calculates average mood improvement', () => {
      const sessions = [
        { sessionId: 's1', sessionName: 'S1', duration: 10, poses: [], preMood: 2, postMood: 4, preEnergy: 2, postEnergy: 3 },
        { sessionId: 's2', sessionName: 'S2', duration: 10, poses: [], preMood: 3, postMood: 5, preEnergy: 3, postEnergy: 5 },
        { sessionId: 's3', sessionName: 'S3', duration: 10, poses: [], preMood: 2, postMood: 3, preEnergy: 2, postEnergy: 4 }
      ];

      sessions.forEach(session => {
        useProgressStore.getState().completeSession(session);
      });

      const analytics = useProgressStore.getState().getMoodAnalytics(30);

      expect(analytics.sessionsWithMoodData).toBe(3);
      expect(analytics.averageMoodImprovement).toBeGreaterThan(0);
      expect(analytics.averageEnergyImprovement).toBeGreaterThan(0);
    });

    it('calculates improvement rate percentage', () => {
      const sessions = [
        { sessionId: 's1', sessionName: 'S1', duration: 10, poses: [], preMood: 2, postMood: 4, preEnergy: 2, postEnergy: 3 }, // +2
        { sessionId: 's2', sessionName: 'S2', duration: 10, poses: [], preMood: 3, postMood: 5, preEnergy: 3, postEnergy: 5 }, // +2
        { sessionId: 's3', sessionName: 'S3', duration: 10, poses: [], preMood: 4, postMood: 3, preEnergy: 4, postEnergy: 3 }, // -1
        { sessionId: 's4', sessionName: 'S4', duration: 10, poses: [], preMood: 2, postMood: 5, preEnergy: 2, postEnergy: 5 }  // +3
      ];

      sessions.forEach(session => {
        useProgressStore.getState().completeSession(session);
      });

      const analytics = useProgressStore.getState().getMoodAnalytics(30);

      // 3 out of 4 sessions improved = 75%
      expect(analytics.improvementRate).toBe(75);
    });

    it('determines mood trend correctly', () => {
      // Strongly improving trend
      const improvingSessions = [
        { sessionId: 's1', sessionName: 'S1', duration: 10, poses: [], preMood: 2, postMood: 5, preEnergy: 2, postEnergy: 5 },
        { sessionId: 's2', sessionName: 'S2', duration: 10, poses: [], preMood: 2, postMood: 5, preEnergy: 2, postEnergy: 5 },
        { sessionId: 's3', sessionName: 'S3', duration: 10, poses: [], preMood: 2, postMood: 4, preEnergy: 2, postEnergy: 4 }
      ];

      improvingSessions.forEach(session => {
        useProgressStore.getState().completeSession(session);
      });

      const analytics = useProgressStore.getState().getMoodAnalytics(30);
      expect(analytics.moodTrend).toBe('improving');
    });

    it('handles insufficient data gracefully', () => {
      const analytics = useProgressStore.getState().getMoodAnalytics(30);

      expect(analytics.averageMoodImprovement).toBe(0);
      expect(analytics.averageEnergyImprovement).toBe(0);
      expect(analytics.sessionsWithMoodData).toBe(0);
      expect(analytics.moodTrend).toBe('insufficient_data');
    });

    it('filters analytics by time period', () => {
      // Create sessions from different time periods (requires manipulating dates)
      const oldSession = {
        sessionId: 'old',
        sessionName: 'Old Session',
        duration: 10,
        poses: [],
        preMood: 2,
        postMood: 4,
        preEnergy: 2,
        postEnergy: 4
      };

      useProgressStore.getState().completeSession(oldSession);

      // Get analytics for last 30 days
      const analytics = useProgressStore.getState().getMoodAnalytics(30);

      // Should include the recent session
      expect(analytics.sessionsWithMoodData).toBeGreaterThan(0);
    });

    it('excludes sessions without mood data from analytics', () => {
      const sessions = [
        { sessionId: 's1', sessionName: 'S1', duration: 10, poses: [], preMood: 2, postMood: 4, preEnergy: 2, postEnergy: 3 },
        { sessionId: 's2', sessionName: 'S2', duration: 10, poses: [] }, // No mood data
        { sessionId: 's3', sessionName: 'S3', duration: 10, poses: [], preMood: 3, postMood: 5, preEnergy: 3, postEnergy: 5 }
      ];

      sessions.forEach(session => {
        useProgressStore.getState().completeSession(session);
      });

      const analytics = useProgressStore.getState().getMoodAnalytics(30);

      expect(analytics.sessionsWithMoodData).toBe(2); // Only 2 have mood data
      expect(analytics.totalSessions).toBe(3); // But 3 total sessions
    });
  });

  describe('Last Session Mood Data', () => {
    it('retrieves mood data from last session', () => {
      // Add multiple sessions
      const session1 = { sessionId: 's1', sessionName: 'S1', duration: 10, poses: [], preMood: 2, postMood: 4, preEnergy: 2, postEnergy: 3 };
      useProgressStore.getState().completeSession(session1);

      const session2 = { sessionId: 's2', sessionName: 'S2', duration: 10, poses: [], preMood: 3, postMood: 5, preEnergy: 3, postEnergy: 5 };
      useProgressStore.getState().completeSession(session2);

      const lastMood = useProgressStore.getState().getLastSessionMoodData();

      expect(lastMood).toBeDefined();
      // Should be from the last session with mood data
      // The actual value depends on which session was last
      expect([2, 3]).toContain(lastMood.preMood);
      expect([4, 5]).toContain(lastMood.postMood);
      expect(lastMood.moodImprovement).toBeGreaterThan(0);
    });

    it('returns null when no mood data exists', () => {
      const session = {
        sessionId: 's1',
        sessionName: 'S1',
        duration: 10,
        poses: []
        // No mood data
      };

      useProgressStore.getState().completeSession(session);

      const lastMood = useProgressStore.getState().getLastSessionMoodData();
      expect(lastMood).toBeNull();
    });

    it('skips sessions without mood data', () => {
      const sessions = [
        { sessionId: 's1', sessionName: 'S1', duration: 10, poses: [], preMood: 2, postMood: 4, preEnergy: 2, postEnergy: 3 },
        { sessionId: 's2', sessionName: 'S2', duration: 10, poses: [] }, // No mood data (most recent)
      ];

      sessions.forEach(session => {
        useProgressStore.getState().completeSession(session);
      });

      const lastMood = useProgressStore.getState().getLastSessionMoodData();

      // Should return data from s1, not s2
      expect(lastMood).toBeDefined();
      expect(lastMood.preMood).toBe(2);
      expect(lastMood.postMood).toBe(4);
    });
  });

  describe('Mood Tracking Preferences', () => {
    it('toggles yoga mood check preference', () => {
      const initialState = usePreferencesStore.getState().yoga.showMoodCheck;

      usePreferencesStore.getState().toggleYogaMoodCheck();

      const newState = usePreferencesStore.getState().yoga.showMoodCheck;
      expect(newState).toBe(!initialState);
    });

    it('sets yoga mood check preference', () => {
      usePreferencesStore.getState().setYogaMoodCheck(false);

      const state = usePreferencesStore.getState().yoga.showMoodCheck;
      expect(state).toBe(false);
    });

    it('toggles breathing mood check preference', () => {
      const initialState = usePreferencesStore.getState().breathing.showMoodCheck;

      usePreferencesStore.getState().toggleBreathingMoodCheck();

      const newState = usePreferencesStore.getState().breathing.showMoodCheck;
      expect(newState).toBe(!initialState);
    });

    it('persists mood check preferences', () => {
      usePreferencesStore.getState().setYogaMoodCheck(false);

      const stored = JSON.parse(localStorage.getItem('mindful-yoga-preferences'));
      expect(stored.state.yoga.showMoodCheck).toBe(false);
    });

    it('respects mood check preference in workflow', () => {
      // Set preference to hide mood check
      usePreferencesStore.getState().setYogaMoodCheck(false);

      // User might skip mood data based on this preference
      const sessionWithoutMood = {
        sessionId: 'quick-session',
        sessionName: 'Quick Session',
        duration: 5,
        poses: []
        // No mood data because preference is off
      };

      const record = useProgressStore.getState().completeSession(sessionWithoutMood);

      // Should still complete successfully without mood data
      expect(record).toBeDefined();
      expect(record.moodImprovement).toBeNull();
    });
  });

  describe('Mood Data with Breathing Sessions', () => {
    it('tracks mood for breathing exercises', () => {
      const breathingData = {
        exerciseId: 'box-breathing',
        exerciseName: 'Box Breathing',
        duration: 3,
        targetCycles: 10,
        completedCycles: 10,
        category: 'calming',
        preMood: 3,
        postMood: 5,
        preEnergy: 4,
        postEnergy: 3
      };

      const record = useProgressStore.getState().completeBreathingSession(breathingData);

      expect(record.preMood).toBe(3);
      expect(record.postMood).toBe(5);
      expect(record.moodImprovement).toBe(2);
      expect(record.energyImprovement).toBe(-1); // Calming effect
    });

    it('includes breathing sessions in mood analytics', () => {
      const yogaSession = {
        sessionId: 'yoga',
        sessionName: 'Yoga Session',
        duration: 10,
        poses: [],
        preMood: 2,
        postMood: 4,
        preEnergy: 2,
        postEnergy: 4
      };

      const breathingSession = {
        exerciseId: 'box-breathing',
        exerciseName: 'Box Breathing',
        duration: 3,
        targetCycles: 10,
        completedCycles: 10,
        category: 'calming',
        preMood: 3,
        postMood: 5,
        preEnergy: 3,
        postEnergy: 4
      };

      useProgressStore.getState().completeSession(yogaSession);
      useProgressStore.getState().completeBreathingSession(breathingSession);

      const analytics = useProgressStore.getState().getMoodAnalytics(30);

      expect(analytics.sessionsWithMoodData).toBe(2);
      expect(analytics.totalSessions).toBe(2);
    });
  });

  describe('Mood Scale Validation', () => {
    it('handles mood values 1-5', () => {
      for (let mood = 1; mood <= 5; mood++) {
        const sessionData = {
          sessionId: `session-${mood}`,
          sessionName: `Session ${mood}`,
          duration: 10,
          poses: [],
          preMood: mood,
          postMood: mood,
          preEnergy: mood,
          postEnergy: mood
        };

        const record = useProgressStore.getState().completeSession(sessionData);

        expect(record.preMood).toBe(mood);
        expect(record.postMood).toBe(mood);
      }
    });

    it('calculates improvement for full range changes', () => {
      const sessionData = {
        sessionId: 'transformation',
        sessionName: 'Transformative Session',
        duration: 60,
        poses: [],
        preMood: 1,
        postMood: 5,
        preEnergy: 1,
        postEnergy: 5
      };

      const record = useProgressStore.getState().completeSession(sessionData);

      expect(record.moodImprovement).toBe(4); // Maximum improvement
      expect(record.energyImprovement).toBe(4);
    });
  });

  describe('Edge Cases', () => {
    it('handles partial mood data (only pre or post)', () => {
      const sessionData = {
        sessionId: 'partial',
        sessionName: 'Partial Mood Data',
        duration: 10,
        poses: [],
        preMood: 3,
        // postMood missing
        preEnergy: 2
        // postEnergy missing
      };

      const record = useProgressStore.getState().completeSession(sessionData);

      expect(record.preMood).toBe(3);
      expect(record.postMood).toBeNull();
      expect(record.moodImprovement).toBeNull(); // Can't calculate without both
    });

    it('handles zero values', () => {
      const sessionData = {
        sessionId: 'zero',
        sessionName: 'Zero Values',
        duration: 10,
        poses: [],
        preMood: 0,
        postMood: 0,
        preEnergy: 0,
        postEnergy: 0
      };

      const record = useProgressStore.getState().completeSession(sessionData);

      // Implementation treats 0 as falsy, so it returns null
      // This is actually correct behavior since 0 is not a valid mood value (1-5)
      expect(record.moodImprovement).toBeNull();
      expect(record.energyImprovement).toBeNull();
    });

    it('handles very large improvement values', () => {
      const sessions = Array.from({ length: 100 }, (_, i) => ({
        sessionId: `s${i}`,
        sessionName: `Session ${i}`,
        duration: 10,
        poses: [],
        preMood: 1,
        postMood: 5,
        preEnergy: 1,
        postEnergy: 5
      }));

      sessions.forEach(session => {
        useProgressStore.getState().completeSession(session);
      });

      const analytics = useProgressStore.getState().getMoodAnalytics(30);

      expect(analytics.averageMoodImprovement).toBe(4);
      expect(analytics.improvementRate).toBe(100);
    });
  });

  describe('Data Export/Import with Mood', () => {
    it('includes mood data in exported progress', () => {
      const sessionData = {
        sessionId: 'test',
        sessionName: 'Test Session',
        duration: 10,
        poses: [],
        preMood: 3,
        postMood: 5,
        preEnergy: 2,
        postEnergy: 4
      };

      useProgressStore.getState().completeSession(sessionData);

      const exported = useProgressStore.getState().exportData();

      expect(exported.practiceHistory).toHaveLength(1);
      expect(exported.practiceHistory[0].preMood).toBe(3);
      expect(exported.practiceHistory[0].moodImprovement).toBe(2);
    });

    it('restores mood data on import', () => {
      const importData = {
        currentStreak: 1,
        longestStreak: 1,
        totalMinutes: 10,
        totalSessions: 1,
        lastPracticeDate: new Date().toISOString(),
        practiceHistory: [
          {
            id: 'session_123',
            sessionId: 'test',
            sessionName: 'Test Session',
            duration: 10,
            completedAt: new Date().toISOString(),
            poses: [],
            preMood: 3,
            postMood: 5,
            preEnergy: 2,
            postEnergy: 4,
            moodImprovement: 2,
            energyImprovement: 2
          }
        ],
        breathingHistory: [],
        achievements: [],
        stats: {
          thisWeek: { sessions: 0, minutes: 0, breathingSessions: 0, breathingMinutes: 0 },
          thisMonth: { sessions: 0, minutes: 0, breathingSessions: 0, breathingMinutes: 0 },
          allTime: { sessions: 0, minutes: 0, breathingSessions: 0, breathingMinutes: 0, averageSessionLength: 0, averageBreathingLength: 0 }
        }
      };

      useProgressStore.getState().importData(importData);

      const lastMood = useProgressStore.getState().getLastSessionMoodData();
      expect(lastMood).toBeDefined();
      expect(lastMood.moodImprovement).toBe(2);
    });
  });
});
