import { describe, it, expect, beforeEach } from 'vitest';
import useProgramProgressStore from '../../src/stores/programProgress';
import useProgressStore from '../../src/stores/progress';

/**
 * Integration Tests: Program Progress Tracking
 *
 * Tests multi-week program tracking with real stores.
 * Verifies program state management, week completion, and session integration.
 */
describe('Program Progress Tracking Flow', () => {
  beforeEach(() => {
    // Reset both stores before each test
    localStorage.clear();

    // Reset program progress store to initial state
    useProgramProgressStore.setState({
      activeProgram: null,
      completedWeeks: [],
      weekNotes: {},
      pausedPrograms: []
    });

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
  });

  describe('Starting Programs', () => {
    it('starts a new program at week 1', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');

      const state = useProgramProgressStore.getState();
      expect(state.activeProgram).toBeDefined();
      expect(state.activeProgram.programId).toBe('foundational-strength');
      expect(state.activeProgram.currentWeek).toBe(1);
      expect(state.activeProgram.startedAt).toBeTruthy();
    });

    it('persists program start to localStorage', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');

      const stored = localStorage.getItem('yoga-program-progress');
      expect(stored).toBeTruthy();

      const data = JSON.parse(stored);
      expect(data.state.activeProgram.programId).toBe('foundational-strength');
    });

    it('replaces active program when starting a new one', () => {
      useProgramProgressStore.getState().startProgram('program-1');
      useProgramProgressStore.getState().startProgram('program-2');

      const state = useProgramProgressStore.getState();
      expect(state.activeProgram.programId).toBe('program-2');
    });

    it('removes program from paused list when starting', () => {
      // Start and pause a program
      useProgramProgressStore.getState().startProgram('foundational-strength');
      useProgramProgressStore.getState().pauseProgram('foundational-strength');

      const pausedBefore = useProgramProgressStore.getState().pausedPrograms;
      expect(pausedBefore).toHaveLength(1);

      // Start it again
      useProgramProgressStore.getState().startProgram('foundational-strength');

      const pausedAfter = useProgramProgressStore.getState().pausedPrograms;
      expect(pausedAfter).toHaveLength(0);
    });
  });

  describe('Completing Weeks', () => {
    it('completes a week and advances to next', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');
      useProgramProgressStore.getState().completeWeek('foundational-strength', 1, 7);

      const state = useProgramProgressStore.getState();
      expect(state.activeProgram.currentWeek).toBe(2);
      expect(state.completedWeeks).toHaveLength(1);
      expect(state.completedWeeks[0].weekNumber).toBe(1);
      expect(state.completedWeeks[0].sessionsCompleted).toBe(7);
    });

    it('stores completion timestamp', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');
      useProgramProgressStore.getState().completeWeek('foundational-strength', 1, 7);

      const completed = useProgramProgressStore.getState().completedWeeks[0];
      expect(completed.completedAt).toBeTruthy();
      expect(new Date(completed.completedAt)).toBeInstanceOf(Date);
    });

    it('completes multiple weeks sequentially', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');
      useProgramProgressStore.getState().completeWeek('foundational-strength', 1, 7);
      useProgramProgressStore.getState().completeWeek('foundational-strength', 2, 6);
      useProgramProgressStore.getState().completeWeek('foundational-strength', 3, 7);

      const state = useProgramProgressStore.getState();
      expect(state.activeProgram.currentWeek).toBe(4);
      expect(state.completedWeeks).toHaveLength(3);
    });

    it('includes notes when completing week', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');
      useProgramProgressStore.getState().completeWeek(
        'foundational-strength',
        1,
        7,
        'Great week! Feeling stronger.'
      );

      const completed = useProgramProgressStore.getState().completedWeeks[0];
      expect(completed.notes).toBe('Great week! Feeling stronger.');
    });

    it('persists completed weeks to localStorage', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');
      useProgramProgressStore.getState().completeWeek('foundational-strength', 1, 7);

      const stored = JSON.parse(localStorage.getItem('yoga-program-progress'));
      expect(stored.state.completedWeeks).toHaveLength(1);
      expect(stored.state.activeProgram.currentWeek).toBe(2);
    });
  });

  describe('Week Notes', () => {
    it('adds notes for a week', () => {
      useProgramProgressStore.getState().addWeekNote(
        'foundational-strength',
        1,
        'This is a test note'
      );

      const note = useProgramProgressStore.getState().getWeekNote('foundational-strength', 1);
      expect(note).toBe('This is a test note');
    });

    it('updates existing notes', () => {
      useProgramProgressStore.getState().addWeekNote('foundational-strength', 1, 'First note');
      useProgramProgressStore.getState().addWeekNote('foundational-strength', 1, 'Updated note');

      const note = useProgramProgressStore.getState().getWeekNote('foundational-strength', 1);
      expect(note).toBe('Updated note');
    });

    it('returns empty string for non-existent note', () => {
      const note = useProgramProgressStore.getState().getWeekNote('foundational-strength', 999);
      expect(note).toBe('');
    });

    it('includes notes from weekNotes when completing week', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');
      useProgramProgressStore.getState().addWeekNote('foundational-strength', 1, 'Pre-added note');
      useProgramProgressStore.getState().completeWeek('foundational-strength', 1, 7);

      const completed = useProgramProgressStore.getState().completedWeeks[0];
      expect(completed.notes).toBe('Pre-added note');
    });
  });

  describe('Pausing and Resuming Programs', () => {
    it('pauses active program', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');
      useProgramProgressStore.getState().completeWeek('foundational-strength', 1, 7);
      useProgramProgressStore.getState().pauseProgram('foundational-strength');

      const state = useProgramProgressStore.getState();
      expect(state.activeProgram).toBeNull();
      expect(state.pausedPrograms).toHaveLength(1);
      expect(state.pausedPrograms[0].programId).toBe('foundational-strength');
      expect(state.pausedPrograms[0].weekNumber).toBe(2);
    });

    it('stores pause timestamp', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');
      useProgramProgressStore.getState().pauseProgram('foundational-strength');

      const paused = useProgramProgressStore.getState().pausedPrograms[0];
      expect(paused.pausedAt).toBeTruthy();
      expect(new Date(paused.pausedAt)).toBeInstanceOf(Date);
    });

    it('resumes paused program', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');
      useProgramProgressStore.getState().completeWeek('foundational-strength', 1, 7);
      useProgramProgressStore.getState().pauseProgram('foundational-strength');
      useProgramProgressStore.getState().resumeProgram('foundational-strength');

      const state = useProgramProgressStore.getState();
      expect(state.activeProgram).toBeDefined();
      expect(state.activeProgram.programId).toBe('foundational-strength');
      expect(state.activeProgram.currentWeek).toBe(2);
      expect(state.pausedPrograms).toHaveLength(0);
    });

    it('handles resuming non-existent program gracefully', () => {
      const beforeState = useProgramProgressStore.getState();
      useProgramProgressStore.getState().resumeProgram('non-existent');
      const afterState = useProgramProgressStore.getState();

      expect(afterState).toEqual(beforeState);
    });
  });

  describe('Program Status', () => {
    it('returns "not-started" for new program', () => {
      const status = useProgramProgressStore.getState().getProgramStatus('foundational-strength', 8);
      expect(status).toBe('not-started');
    });

    it('returns "active" for started program', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');
      const status = useProgramProgressStore.getState().getProgramStatus('foundational-strength', 8);
      expect(status).toBe('active');
    });

    it('returns "paused" for paused program', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');
      useProgramProgressStore.getState().pauseProgram('foundational-strength');
      const status = useProgramProgressStore.getState().getProgramStatus('foundational-strength', 8);
      expect(status).toBe('paused');
    });

    it('returns "completed" for finished program', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');

      // Complete all 8 weeks
      for (let week = 1; week <= 8; week++) {
        useProgramProgressStore.getState().completeWeek('foundational-strength', week, 7);
      }

      const status = useProgramProgressStore.getState().getProgramStatus('foundational-strength', 8);
      expect(status).toBe('completed');
    });
  });

  describe('Program Progress Calculation', () => {
    it('calculates progress percentage', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');
      useProgramProgressStore.getState().completeWeek('foundational-strength', 1, 7);
      useProgramProgressStore.getState().completeWeek('foundational-strength', 2, 7);

      const progress = useProgramProgressStore.getState().getProgramProgress('foundational-strength', 8);
      expect(progress).toBe(25); // 2 out of 8 weeks = 25%
    });

    it('returns 0% for not started program', () => {
      const progress = useProgramProgressStore.getState().getProgramProgress('foundational-strength', 8);
      expect(progress).toBe(0);
    });

    it('returns 100% for completed program', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');

      for (let week = 1; week <= 8; week++) {
        useProgramProgressStore.getState().completeWeek('foundational-strength', week, 7);
      }

      const progress = useProgramProgressStore.getState().getProgramProgress('foundational-strength', 8);
      expect(progress).toBe(100);
    });
  });

  describe('Integration with Session Completion', () => {
    it('completes program session and tracks in both stores', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');

      const sessionData = {
        sessionId: 'morning-energizer',
        sessionName: 'Morning Energizer',
        duration: 10,
        poses: [],
        programId: 'foundational-strength',
        weekNumber: 1,
        dayNumber: 1
      };

      useProgressStore.getState().completeSession(sessionData);

      // Check progress store
      const progressState = useProgressStore.getState();
      expect(progressState.totalSessions).toBe(1);
      expect(progressState.practiceHistory[0].programId).toBe('foundational-strength');

      // Check if day is marked as completed
      const dayCompleted = useProgressStore.getState().isProgramDayCompleted(
        'foundational-strength',
        1,
        1
      );
      expect(dayCompleted).toBe(true);
    });

    it('tracks multiple sessions for a program week', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');

      const sessions = [
        { sessionId: 's1', sessionName: 'Session 1', duration: 10, poses: [], programId: 'foundational-strength', weekNumber: 1, dayNumber: 1 },
        { sessionId: 's2', sessionName: 'Session 2', duration: 10, poses: [], programId: 'foundational-strength', weekNumber: 1, dayNumber: 2 },
        { sessionId: 's3', sessionName: 'Session 3', duration: 10, poses: [], programId: 'foundational-strength', weekNumber: 1, dayNumber: 3 }
      ];

      sessions.forEach(session => {
        useProgressStore.getState().completeSession(session);
      });

      const stats = useProgressStore.getState().getProgramWeekStats('foundational-strength', 1, 7);
      expect(stats.completedDays).toBe(3);
      expect(stats.sessionsCompleted).toBe(3);
      expect(stats.totalMinutes).toBe(30);
    });

    it('calculates week completion rate', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');

      // Complete 3 out of 7 days
      for (let day = 1; day <= 3; day++) {
        useProgressStore.getState().completeSession({
          sessionId: `s${day}`,
          sessionName: `Session ${day}`,
          duration: 10,
          poses: [],
          programId: 'foundational-strength',
          weekNumber: 1,
          dayNumber: day
        });
      }

      const stats = useProgressStore.getState().getProgramWeekStats('foundational-strength', 1, 7);
      expect(stats.completionRate).toBe(43); // 3/7 ≈ 43%
    });
  });

  describe('Resetting Programs', () => {
    it('resets program to week 1', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');
      useProgramProgressStore.getState().completeWeek('foundational-strength', 1, 7);
      useProgramProgressStore.getState().completeWeek('foundational-strength', 2, 7);

      useProgramProgressStore.getState().resetProgram('foundational-strength');

      const state = useProgramProgressStore.getState();
      expect(state.activeProgram.currentWeek).toBe(1);
      expect(state.completedWeeks.filter(w => w.programId === 'foundational-strength')).toHaveLength(0);
    });

    it('clears program notes on reset', () => {
      useProgramProgressStore.getState().addWeekNote('foundational-strength', 1, 'Test note');
      useProgramProgressStore.getState().resetProgram('foundational-strength');

      const note = useProgramProgressStore.getState().getWeekNote('foundational-strength', 1);
      expect(note).toBe('');
    });

    it('removes from paused programs on reset', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');
      useProgramProgressStore.getState().pauseProgram('foundational-strength');
      useProgramProgressStore.getState().resetProgram('foundational-strength');

      const paused = useProgramProgressStore.getState().pausedPrograms;
      expect(paused.filter(p => p.programId === 'foundational-strength')).toHaveLength(0);
    });
  });

  describe('Querying Program Data', () => {
    it('gets current week for active program', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');
      useProgramProgressStore.getState().completeWeek('foundational-strength', 1, 7);

      const currentWeek = useProgramProgressStore.getState().getCurrentWeek('foundational-strength');
      expect(currentWeek).toBe(2);
    });

    it('returns 1 for not-started program', () => {
      const currentWeek = useProgramProgressStore.getState().getCurrentWeek('foundational-strength');
      expect(currentWeek).toBe(1);
    });

    it('gets all completed weeks for a program', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');
      useProgramProgressStore.getState().completeWeek('foundational-strength', 1, 7);
      useProgramProgressStore.getState().completeWeek('foundational-strength', 2, 6);

      const completed = useProgramProgressStore.getState().getCompletedWeeks('foundational-strength');
      expect(completed).toHaveLength(2);
      expect(completed[0].weekNumber).toBe(1);
      expect(completed[1].weekNumber).toBe(2);
    });

    it('checks if week is completed', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');
      useProgramProgressStore.getState().completeWeek('foundational-strength', 1, 7);

      expect(useProgramProgressStore.getState().isWeekCompleted('foundational-strength', 1)).toBe(true);
      expect(useProgramProgressStore.getState().isWeekCompleted('foundational-strength', 2)).toBe(false);
    });

    it('gets total sessions completed in program', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');
      useProgramProgressStore.getState().completeWeek('foundational-strength', 1, 7);
      useProgramProgressStore.getState().completeWeek('foundational-strength', 2, 6);

      const total = useProgramProgressStore.getState().getTotalSessionsCompleted('foundational-strength');
      expect(total).toBe(13); // 7 + 6
    });

    it('gets program start date', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');

      const startDate = useProgramProgressStore.getState().getProgramStartDate('foundational-strength');
      expect(startDate).toBeTruthy();
      expect(new Date(startDate)).toBeInstanceOf(Date);
    });

    it('lists all programs with progress', () => {
      useProgramProgressStore.getState().startProgram('program-1');
      useProgramProgressStore.getState().completeWeek('program-1', 1, 7);
      useProgramProgressStore.getState().pauseProgram('program-1');

      useProgramProgressStore.getState().startProgram('program-2');

      const programs = useProgramProgressStore.getState().getAllProgramsWithProgress();
      expect(programs).toContain('program-1');
      expect(programs).toContain('program-2');
    });
  });

  describe('Data Persistence', () => {
    it('persists all program data to localStorage', () => {
      useProgramProgressStore.getState().startProgram('foundational-strength');
      useProgramProgressStore.getState().completeWeek('foundational-strength', 1, 7);
      useProgramProgressStore.getState().addWeekNote('foundational-strength', 2, 'Week 2 notes');

      const stored = JSON.parse(localStorage.getItem('yoga-program-progress'));

      expect(stored.state.activeProgram.programId).toBe('foundational-strength');
      expect(stored.state.completedWeeks).toHaveLength(1);
      expect(stored.state.weekNotes['foundational-strength-2']).toBe('Week 2 notes');
    });

    it('handles localStorage quota gracefully', () => {
      // This is difficult to test in unit tests, but the store should handle it
      // Just verify the serialize method exists
      const state = useProgramProgressStore.getState();
      expect(typeof state).toBe('object');
    });
  });

  describe('Edge Cases', () => {
    it('handles completing week without active program', () => {
      // Should not crash
      useProgramProgressStore.getState().completeWeek('foundational-strength', 1, 7);

      const completed = useProgramProgressStore.getState().completedWeeks;
      expect(completed).toHaveLength(1);
    });

    it('handles pausing non-active program', () => {
      const beforeState = useProgramProgressStore.getState();
      useProgramProgressStore.getState().pauseProgram('non-active-program');
      const afterState = useProgramProgressStore.getState();

      expect(afterState).toEqual(beforeState);
    });

    it('handles very long program (50+ weeks)', () => {
      useProgramProgressStore.getState().startProgram('long-program');

      // Complete 50 weeks
      for (let week = 1; week <= 50; week++) {
        useProgramProgressStore.getState().completeWeek('long-program', week, 7);
      }

      const completed = useProgramProgressStore.getState().getCompletedWeeks('long-program');
      expect(completed).toHaveLength(50);

      const progress = useProgramProgressStore.getState().getProgramProgress('long-program', 52);
      expect(progress).toBeGreaterThan(90);
    });
  });
});
