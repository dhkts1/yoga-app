import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Program Progress Store
 *
 * Tracks user progress through multi-week yoga programs including:
 * - Active program state and current week
 * - Completed weeks history with session counts
 * - Week-by-week notes and reflections
 * - Paused programs for resuming later
 *
 * @typedef {Object} ActiveProgram
 * @property {string} programId - Unique program identifier
 * @property {string} startedAt - ISO date when program was started
 * @property {number} currentWeek - Current week number (1-indexed)
 *
 * @typedef {Object} CompletedWeek
 * @property {string} programId - Program identifier
 * @property {number} weekNumber - Week number (1-indexed)
 * @property {string} completedAt - ISO date when week was completed
 * @property {number} sessionsCompleted - Number of sessions completed this week
 * @property {string} [notes] - Optional notes from completion
 *
 * @typedef {Object} PausedProgram
 * @property {string} programId - Program identifier
 * @property {string} pausedAt - ISO date when paused
 * @property {number} weekNumber - Week number when paused
 */

const useProgramProgressStore = create(
  persist(
    (set, get) => ({
      // ==================== STATE ====================

      /**
       * Currently active program
       * @type {ActiveProgram | null}
       */
      activeProgram: null,

      /**
       * History of all completed weeks across all programs
       * @type {CompletedWeek[]}
       */
      completedWeeks: [],

      /**
       * Notes and reflections keyed by 'programId-weekNumber'
       * @type {Record<string, string>}
       */
      weekNotes: {},

      /**
       * Programs that have been paused
       * @type {PausedProgram[]}
       */
      pausedPrograms: [],

      // ==================== ACTIONS ====================

      /**
       * Start a new program
       * Clears any existing active program and begins at week 1
       *
       * @param {string} programId - ID of program to start
       * @returns {void}
       */
      startProgram: (programId) => {
        const now = new Date().toISOString();

        set((state) => ({
          activeProgram: {
            programId,
            startedAt: now,
            currentWeek: 1,
          },
          // Remove from paused if it was there
          pausedPrograms: state.pausedPrograms.filter(
            (p) => p.programId !== programId
          ),
        }));
      },

      /**
       * Complete the current week and advance to next
       * Records completion in history and updates current week
       *
       * @param {string} programId - Program identifier
       * @param {number} weekNumber - Week number being completed
       * @param {number} sessionsCompleted - Number of sessions completed
       * @param {string} [notes] - Optional completion notes
       * @returns {void}
       */
      completeWeek: (programId, weekNumber, sessionsCompleted, notes) => {
        const now = new Date().toISOString();

        set((state) => {
          const completedWeek = {
            programId,
            weekNumber,
            completedAt: now,
            sessionsCompleted,
            notes: notes || state.weekNotes[`${programId}-${weekNumber}`],
          };

          // If this is the active program, advance to next week
          const updatedActiveProgram =
            state.activeProgram?.programId === programId
              ? {
                  ...state.activeProgram,
                  currentWeek: weekNumber + 1,
                }
              : state.activeProgram;

          return {
            completedWeeks: [...state.completedWeeks, completedWeek],
            activeProgram: updatedActiveProgram,
          };
        });
      },

      /**
       * Pause the current active program
       * Moves program to paused list and clears active slot
       *
       * @param {string} programId - Program to pause
       * @returns {void}
       */
      pauseProgram: (programId) => {
        const now = new Date().toISOString();

        set((state) => {
          if (!state.activeProgram || state.activeProgram.programId !== programId) {
            return state;
          }

          const pausedProgram = {
            programId,
            pausedAt: now,
            weekNumber: state.activeProgram.currentWeek,
          };

          return {
            activeProgram: null,
            pausedPrograms: [...state.pausedPrograms, pausedProgram],
          };
        });
      },

      /**
       * Resume a previously paused program
       * Restores program to active slot from paused list
       *
       * @param {string} programId - Program to resume
       * @returns {void}
       */
      resumeProgram: (programId) => {
        const now = new Date().toISOString();

        set((state) => {
          const pausedProgram = state.pausedPrograms.find(
            (p) => p.programId === programId
          );

          if (!pausedProgram) {
            return state;
          }

          return {
            activeProgram: {
              programId,
              startedAt: now,
              currentWeek: pausedProgram.weekNumber,
            },
            pausedPrograms: state.pausedPrograms.filter(
              (p) => p.programId !== programId
            ),
          };
        });
      },

      /**
       * Add or update notes for a specific week
       * Notes are stored separately and can be added before week completion
       *
       * @param {string} programId - Program identifier
       * @param {number} weekNumber - Week number (1-indexed)
       * @param {string} note - Note text
       * @returns {void}
       */
      addWeekNote: (programId, weekNumber, note) => {
        set((state) => ({
          weekNotes: {
            ...state.weekNotes,
            [`${programId}-${weekNumber}`]: note,
          },
        }));
      },

      /**
       * Reset a program to start from week 1
       * Clears completion history for this program
       *
       * @param {string} programId - Program to reset
       * @returns {void}
       */
      resetProgram: (programId) => {
        const now = new Date().toISOString();

        set((state) => ({
          activeProgram:
            state.activeProgram?.programId === programId
              ? {
                  programId,
                  startedAt: now,
                  currentWeek: 1,
                }
              : state.activeProgram,
          completedWeeks: state.completedWeeks.filter(
            (w) => w.programId !== programId
          ),
          weekNotes: Object.fromEntries(
            Object.entries(state.weekNotes).filter(
              ([key]) => !key.startsWith(`${programId}-`)
            )
          ),
          pausedPrograms: state.pausedPrograms.filter(
            (p) => p.programId !== programId
          ),
        }));
      },

      // ==================== SELECTORS ====================

      /**
       * Get current week number for a program
       * Returns 1 if program hasn't been started
       *
       * @param {string} programId - Program identifier
       * @returns {number} Current week number (1-indexed)
       */
      getCurrentWeek: (programId) => {
        const state = get();

        if (state.activeProgram?.programId === programId) {
          return state.activeProgram.currentWeek;
        }

        const paused = state.pausedPrograms.find((p) => p.programId === programId);
        if (paused) {
          return paused.weekNumber;
        }

        return 1;
      },

      /**
       * Calculate program completion percentage
       *
       * @param {string} programId - Program identifier
       * @param {number} totalWeeks - Total weeks in program
       * @returns {number} Percentage complete (0-100)
       */
      getProgramProgress: (programId, totalWeeks) => {
        const state = get();
        const completedCount = state.completedWeeks.filter(
          (w) => w.programId === programId
        ).length;

        return totalWeeks > 0 ? Math.round((completedCount / totalWeeks) * 100) : 0;
      },

      /**
       * Get all completed weeks for a program
       *
       * @param {string} programId - Program identifier
       * @returns {CompletedWeek[]} Array of completed weeks sorted by week number
       */
      getCompletedWeeks: (programId) => {
        const state = get();
        return state.completedWeeks
          .filter((w) => w.programId === programId)
          .sort((a, b) => a.weekNumber - b.weekNumber);
      },

      /**
       * Get note for a specific week
       *
       * @param {string} programId - Program identifier
       * @param {number} weekNumber - Week number (1-indexed)
       * @returns {string} Note text or empty string
       */
      getWeekNote: (programId, weekNumber) => {
        const state = get();
        return state.weekNotes[`${programId}-${weekNumber}`] || '';
      },

      /**
       * Check if a specific week has been completed
       *
       * @param {string} programId - Program identifier
       * @param {number} weekNumber - Week number (1-indexed)
       * @returns {boolean} True if week is completed
       */
      isWeekCompleted: (programId, weekNumber) => {
        const state = get();
        return state.completedWeeks.some(
          (w) => w.programId === programId && w.weekNumber === weekNumber
        );
      },

      /**
       * Get program status
       *
       * @param {string} programId - Program identifier
       * @returns {'active' | 'paused' | 'not-started' | 'completed'} Program status
       */
      getProgramStatus: (programId, totalWeeks) => {
        const state = get();

        if (state.activeProgram?.programId === programId) {
          const completedCount = state.completedWeeks.filter(
            (w) => w.programId === programId
          ).length;
          return completedCount >= totalWeeks ? 'completed' : 'active';
        }

        if (state.pausedPrograms.some((p) => p.programId === programId)) {
          return 'paused';
        }

        const hasCompletions = state.completedWeeks.some(
          (w) => w.programId === programId
        );

        if (hasCompletions) {
          const completedCount = state.completedWeeks.filter(
            (w) => w.programId === programId
          ).length;
          return completedCount >= totalWeeks ? 'completed' : 'paused';
        }

        return 'not-started';
      },

      /**
       * Get total sessions completed across a program
       *
       * @param {string} programId - Program identifier
       * @returns {number} Total sessions completed
       */
      getTotalSessionsCompleted: (programId) => {
        const state = get();
        return state.completedWeeks
          .filter((w) => w.programId === programId)
          .reduce((sum, week) => sum + week.sessionsCompleted, 0);
      },

      /**
       * Get program start date
       *
       * @param {string} programId - Program identifier
       * @returns {string | null} ISO date string or null if not started
       */
      getProgramStartDate: (programId) => {
        const state = get();

        if (state.activeProgram?.programId === programId) {
          return state.activeProgram.startedAt;
        }

        const firstCompleted = state.completedWeeks
          .filter((w) => w.programId === programId)
          .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt))[0];

        return firstCompleted ? firstCompleted.completedAt : null;
      },

      /**
       * Get all programs with any progress
       *
       * @returns {string[]} Array of unique program IDs
       */
      getAllProgramsWithProgress: () => {
        const state = get();
        const programIds = new Set();

        if (state.activeProgram) {
          programIds.add(state.activeProgram.programId);
        }

        state.pausedPrograms.forEach((p) => programIds.add(p.programId));
        state.completedWeeks.forEach((w) => programIds.add(w.programId));

        return Array.from(programIds);
      },
    }),
    {
      name: 'yoga-program-progress',
      version: 1,
      // Error handling for localStorage operations
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to load saved program progress data:', error);
        }
      },
      serialize: (state) => {
        try {
          return JSON.stringify(state);
        } catch (error) {
          console.error('Failed to save program progress data:', error);

          // Check if it's a quota exceeded error
          if (error.name === 'QuotaExceededError' || error.code === 22) {
            console.warn('localStorage quota exceeded for program progress');
          }

          return '{}';
        }
      },
      deserialize: (str) => {
        try {
          return JSON.parse(str);
        } catch (error) {
          console.error('Failed to parse saved program progress data:', error);
          console.warn('Program progress data corrupted - resetting to defaults');
          return undefined;
        }
      }
    }
  )
);

export default useProgramProgressStore;