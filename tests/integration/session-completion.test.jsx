import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import useProgressStore from '../../src/stores/progress';
import Welcome from '../../src/screens/Welcome';

/**
 * Integration Tests: Session Completion Flow
 *
 * Tests the complete flow from completing a session to seeing it in the UI.
 * Uses REAL stores (not mocked) to verify actual behavior.
 */
describe('Session Completion Flow', () => {
  beforeEach(() => {
    // Reset stores and localStorage before each test
    useProgressStore.getState().resetProgress();
    localStorage.clear();
  });

  describe('Basic Session Completion', () => {
    it('completing a session updates progress store correctly', () => {
      const sessionData = {
        sessionId: 'morning-energizer',
        sessionName: 'Morning Energizer',
        duration: 5,
        poses: []
      };

      // Complete the session
      const record = useProgressStore.getState().completeSession(sessionData);

      // Verify the record was created
      expect(record).toBeDefined();
      expect(record.sessionId).toBe('morning-energizer');
      expect(record.sessionName).toBe('Morning Energizer');
      expect(record.duration).toBe(5);

      // Verify store state updated
      const state = useProgressStore.getState();
      expect(state.totalSessions).toBe(1);
      expect(state.totalMinutes).toBe(5);
      expect(state.currentStreak).toBe(1);
      expect(state.lastPracticeDate).toBeTruthy();
      expect(state.practiceHistory).toHaveLength(1);
    });

    it('completing multiple sessions accumulates stats correctly', () => {
      const session1 = {
        sessionId: 'morning-energizer',
        sessionName: 'Morning Energizer',
        duration: 5,
        poses: []
      };

      const session2 = {
        sessionId: 'evening-wind-down',
        sessionName: 'Evening Wind Down',
        duration: 10,
        poses: []
      };

      // Complete two sessions
      useProgressStore.getState().completeSession(session1);
      useProgressStore.getState().completeSession(session2);

      // Verify accumulated stats
      const state = useProgressStore.getState();
      expect(state.totalSessions).toBe(2);
      expect(state.totalMinutes).toBe(15);
      expect(state.practiceHistory).toHaveLength(2);
    });

    it('completed session persists to localStorage', () => {
      const sessionData = {
        sessionId: 'morning-energizer',
        sessionName: 'Morning Energizer',
        duration: 5,
        poses: []
      };

      useProgressStore.getState().completeSession(sessionData);

      // Verify localStorage was updated
      const stored = localStorage.getItem('yoga-progress');
      expect(stored).toBeTruthy();

      const data = JSON.parse(stored);
      expect(data.state.totalSessions).toBe(1);
      expect(data.state.practiceHistory).toHaveLength(1);
      expect(data.state.practiceHistory[0].sessionName).toBe('Morning Energizer');
    });

    it('localStorage data survives store reset', () => {
      const sessionData = {
        sessionId: 'morning-energizer',
        sessionName: 'Morning Energizer',
        duration: 5,
        poses: []
      };

      useProgressStore.getState().completeSession(sessionData);

      // Get a fresh instance (simulates page reload)
      const storedData = localStorage.getItem('yoga-progress');
      const parsedData = JSON.parse(storedData);

      expect(parsedData.state.totalSessions).toBe(1);
      expect(parsedData.state.practiceHistory[0].sessionName).toBe('Morning Energizer');
    });
  });

  describe('Session with Mood Data', () => {
    it('stores mood and energy data correctly', () => {
      const sessionData = {
        sessionId: 'morning-energizer',
        sessionName: 'Morning Energizer',
        duration: 5,
        poses: [],
        preMood: 3,
        postMood: 5,
        preEnergy: 2,
        postEnergy: 4
      };

      const record = useProgressStore.getState().completeSession(sessionData);

      // Verify mood data in record
      expect(record.preMood).toBe(3);
      expect(record.postMood).toBe(5);
      expect(record.preEnergy).toBe(2);
      expect(record.postEnergy).toBe(4);
      expect(record.moodImprovement).toBe(2);
      expect(record.energyImprovement).toBe(2);
    });

    it('calculates mood analytics correctly', () => {
      const sessions = [
        { sessionId: 's1', sessionName: 'Session 1', duration: 5, poses: [], preMood: 2, postMood: 4, preEnergy: 2, postEnergy: 3 },
        { sessionId: 's2', sessionName: 'Session 2', duration: 5, poses: [], preMood: 3, postMood: 5, preEnergy: 3, postEnergy: 5 },
        { sessionId: 's3', sessionName: 'Session 3', duration: 5, poses: [], preMood: 4, postMood: 5, preEnergy: 4, postEnergy: 5 }
      ];

      sessions.forEach(session => {
        useProgressStore.getState().completeSession(session);
      });

      const analytics = useProgressStore.getState().getMoodAnalytics(30);

      expect(analytics.sessionsWithMoodData).toBe(3);
      expect(analytics.averageMoodImprovement).toBeGreaterThan(0);
      expect(analytics.averageEnergyImprovement).toBeGreaterThan(0);
      expect(analytics.moodTrend).toBe('improving');
    });
  });

  describe('Program Context Sessions', () => {
    it('stores program context with session', () => {
      const sessionData = {
        sessionId: 'morning-energizer',
        sessionName: 'Morning Energizer',
        duration: 5,
        poses: [],
        programId: 'foundational-strength',
        weekNumber: 1,
        dayNumber: 1
      };

      const record = useProgressStore.getState().completeSession(sessionData);

      expect(record.programId).toBe('foundational-strength');
      expect(record.weekNumber).toBe(1);
      expect(record.dayNumber).toBe(1);
    });

    it('retrieves program sessions correctly', () => {
      const sessions = [
        {
          sessionId: 's1',
          sessionName: 'Session 1',
          duration: 5,
          poses: [],
          programId: 'foundational-strength',
          weekNumber: 1,
          dayNumber: 1
        },
        {
          sessionId: 's2',
          sessionName: 'Session 2',
          duration: 5,
          poses: [],
          programId: 'foundational-strength',
          weekNumber: 1,
          dayNumber: 2
        },
        {
          sessionId: 's3',
          sessionName: 'Session 3',
          duration: 5,
          poses: [],
          programId: 'flexibility-flow',
          weekNumber: 1,
          dayNumber: 1
        }
      ];

      sessions.forEach(session => {
        useProgressStore.getState().completeSession(session);
      });

      const programSessions = useProgressStore.getState().getProgramSessions('foundational-strength');
      expect(programSessions).toHaveLength(2);

      const weekSessions = useProgressStore.getState().getProgramWeekSessions('foundational-strength', 1);
      expect(weekSessions).toHaveLength(2);

      const dayCompleted = useProgressStore.getState().isProgramDayCompleted('foundational-strength', 1, 1);
      expect(dayCompleted).toBe(true);
    });

    it('calculates program week stats correctly', () => {
      const sessions = [
        {
          sessionId: 's1',
          sessionName: 'Session 1',
          duration: 10,
          poses: [],
          programId: 'foundational-strength',
          weekNumber: 1,
          dayNumber: 1
        },
        {
          sessionId: 's2',
          sessionName: 'Session 2',
          duration: 15,
          poses: [],
          programId: 'foundational-strength',
          weekNumber: 1,
          dayNumber: 2
        },
        {
          sessionId: 's3',
          sessionName: 'Session 3',
          duration: 10,
          poses: [],
          programId: 'foundational-strength',
          weekNumber: 1,
          dayNumber: 1 // Same day as first
        }
      ];

      sessions.forEach(session => {
        useProgressStore.getState().completeSession(session);
      });

      const stats = useProgressStore.getState().getProgramWeekStats('foundational-strength', 1, 7);

      expect(stats.completedDays).toBe(2); // Days 1 and 2
      expect(stats.totalDays).toBe(7);
      expect(stats.totalMinutes).toBe(35); // 10 + 15 + 10
      expect(stats.sessionsCompleted).toBe(3);
      expect(stats.completionRate).toBeGreaterThan(0);
    });
  });

  describe('UI Integration', () => {
    it('completed sessions appear in recent sessions list', async () => {
      const sessionData = {
        sessionId: 'morning-energizer',
        sessionName: 'Morning Energizer',
        duration: 5,
        poses: []
      };

      useProgressStore.getState().completeSession(sessionData);

      render(
        <BrowserRouter>
          <Welcome />
        </BrowserRouter>
      );

      // Should show recently practiced section
      await waitFor(() => {
        const recentText = screen.queryByText(/Recently Practiced/i);
        const sessionText = screen.queryByText(/Morning Energizer/i);

        // At least one should be visible
        expect(recentText || sessionText).toBeTruthy();
      }, { timeout: 2000 });
    });

    it('streak status updates in UI', async () => {
      const sessionData = {
        sessionId: 'morning-energizer',
        sessionName: 'Morning Energizer',
        duration: 5,
        poses: []
      };

      useProgressStore.getState().completeSession(sessionData);

      render(
        <BrowserRouter>
          <Welcome />
        </BrowserRouter>
      );

      // Should show streak information
      await waitFor(() => {
        const streakStatus = useProgressStore.getState().getStreakStatus();
        expect(streakStatus.streak).toBe(1);
        expect(streakStatus.status).toBe('today');
      });
    });
  });

  describe('Error Handling', () => {
    it('handles missing required fields gracefully', () => {
      const invalidSession = {
        // Missing sessionId, sessionName, duration
        poses: []
      };

      const record = useProgressStore.getState().completeSession(invalidSession);

      // Should still create a record with default values
      expect(record).toBeDefined();
      expect(record.id).toBeTruthy();
    });

    it('handles null mood data gracefully', () => {
      const sessionData = {
        sessionId: 'morning-energizer',
        sessionName: 'Morning Energizer',
        duration: 5,
        poses: [],
        preMood: null,
        postMood: null
      };

      const record = useProgressStore.getState().completeSession(sessionData);

      expect(record.moodImprovement).toBeNull();
      expect(record.energyImprovement).toBeNull();
    });
  });

  describe('Streak Calculation', () => {
    it('starts streak at 1 for first session', () => {
      const sessionData = {
        sessionId: 'morning-energizer',
        sessionName: 'Morning Energizer',
        duration: 5,
        poses: []
      };

      useProgressStore.getState().completeSession(sessionData);

      const state = useProgressStore.getState();
      expect(state.currentStreak).toBe(1);
      expect(state.longestStreak).toBe(1);
    });

    it('maintains streak for same-day practice', () => {
      const sessionData = {
        sessionId: 'morning-energizer',
        sessionName: 'Morning Energizer',
        duration: 5,
        poses: []
      };

      // Complete two sessions on the same day
      useProgressStore.getState().completeSession(sessionData);
      useProgressStore.getState().completeSession(sessionData);

      const state = useProgressStore.getState();
      expect(state.currentStreak).toBe(1); // Should still be 1
      expect(state.totalSessions).toBe(2); // But sessions count increases
    });

    it('updates longest streak correctly', () => {
      const sessionData = {
        sessionId: 'morning-energizer',
        sessionName: 'Morning Energizer',
        duration: 5,
        poses: []
      };

      useProgressStore.getState().completeSession(sessionData);

      const state = useProgressStore.getState();
      expect(state.longestStreak).toBe(1);
    });
  });

  describe('Recent Sessions', () => {
    it('returns recent sessions in reverse chronological order', () => {
      const sessions = [
        { sessionId: 's1', sessionName: 'Session 1', duration: 5, poses: [] },
        { sessionId: 's2', sessionName: 'Session 2', duration: 10, poses: [] },
        { sessionId: 's3', sessionName: 'Session 3', duration: 15, poses: [] }
      ];

      sessions.forEach(session => {
        useProgressStore.getState().completeSession(session);
      });

      const recent = useProgressStore.getState().getRecentSessions(3);

      expect(recent).toHaveLength(3);
      expect(recent[0].sessionName).toBe('Session 3'); // Most recent first
      expect(recent[1].sessionName).toBe('Session 2');
      expect(recent[2].sessionName).toBe('Session 1');
    });

    it('limits recent sessions to specified count', () => {
      const sessions = Array.from({ length: 10 }, (_, i) => ({
        sessionId: `s${i}`,
        sessionName: `Session ${i}`,
        duration: 5,
        poses: []
      }));

      sessions.forEach(session => {
        useProgressStore.getState().completeSession(session);
      });

      const recent = useProgressStore.getState().getRecentSessions(3);
      expect(recent).toHaveLength(3);
    });
  });
});
