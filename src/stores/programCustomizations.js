import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Program Customizations Store
 *
 * Manages per-program duration overrides with localStorage persistence.
 * Stores custom pose durations for sessions within programs.
 *
 * Structure:
 * {
 *   [programId]: {
 *     [sessionId]: {
 *       [poseIndex]: durationInSeconds
 *     }
 *   }
 * }
 */
const useProgramCustomizationsStore = create(
  persist(
    (set, get) => ({
      // Duration overrides by program -> session -> pose index
      durationOverrides: {},

      /**
       * Set a custom duration for a specific pose in a program's session.
       * @param {string} programId - The program ID
       * @param {string} sessionId - The session ID
       * @param {number} poseIndex - Index of the pose in the session
       * @param {number} duration - Duration in seconds (must be multiple of 15)
       */
      setDuration: (programId, sessionId, poseIndex, duration) => {
        // Validate duration is a multiple of 15 and within range
        const validDuration = Math.max(
          15,
          Math.min(300, Math.round(duration / 15) * 15),
        );

        set((state) => ({
          durationOverrides: {
            ...state.durationOverrides,
            [programId]: {
              ...state.durationOverrides[programId],
              [sessionId]: {
                ...state.durationOverrides[programId]?.[sessionId],
                [poseIndex]: validDuration,
              },
            },
          },
        }));
      },

      /**
       * Set all durations for a session at once.
       * @param {string} programId - The program ID
       * @param {string} sessionId - The session ID
       * @param {Object} durations - Object mapping pose index to duration
       */
      setSessionDurations: (programId, sessionId, durations) => {
        set((state) => ({
          durationOverrides: {
            ...state.durationOverrides,
            [programId]: {
              ...state.durationOverrides[programId],
              [sessionId]: durations,
            },
          },
        }));
      },

      /**
       * Get custom duration for a pose, or null if not customized.
       * @param {string} programId - The program ID
       * @param {string} sessionId - The session ID
       * @param {number} poseIndex - Index of the pose
       * @returns {number|null} Custom duration or null
       */
      getDuration: (programId, sessionId, poseIndex) => {
        const state = get();
        return (
          state.durationOverrides[programId]?.[sessionId]?.[poseIndex] ?? null
        );
      },

      /**
       * Get all custom durations for a session.
       * @param {string} programId - The program ID
       * @param {string} sessionId - The session ID
       * @returns {Object} Object mapping pose index to custom duration
       */
      getSessionDurations: (programId, sessionId) => {
        const state = get();
        return state.durationOverrides[programId]?.[sessionId] ?? {};
      },

      /**
       * Get all custom durations for a program.
       * @param {string} programId - The program ID
       * @returns {Object} Object mapping session IDs to their customizations
       */
      getProgramDurations: (programId) => {
        const state = get();
        return state.durationOverrides[programId] ?? {};
      },

      /**
       * Check if a program has any customizations.
       * @param {string} programId - The program ID
       * @returns {boolean} True if program has customizations
       */
      hasCustomizations: (programId) => {
        const state = get();
        const programOverrides = state.durationOverrides[programId];
        if (!programOverrides) return false;

        // Check if any session has any overrides
        return Object.values(programOverrides).some(
          (session) => Object.keys(session).length > 0,
        );
      },

      /**
       * Reset all customizations for a specific session.
       * @param {string} programId - The program ID
       * @param {string} sessionId - The session ID
       */
      resetSession: (programId, sessionId) => {
        set((state) => {
          const newProgramOverrides = { ...state.durationOverrides[programId] };
          delete newProgramOverrides[sessionId];

          return {
            durationOverrides: {
              ...state.durationOverrides,
              [programId]: newProgramOverrides,
            },
          };
        });
      },

      /**
       * Reset all customizations for a program.
       * @param {string} programId - The program ID
       */
      resetProgram: (programId) => {
        set((state) => {
          const newOverrides = { ...state.durationOverrides };
          delete newOverrides[programId];
          return { durationOverrides: newOverrides };
        });
      },

      /**
       * Reset all customizations.
       */
      resetAll: () => {
        set({ durationOverrides: {} });
      },

      /**
       * Apply customizations to a session's poses array.
       * Returns a new array with custom durations applied.
       * @param {string} programId - The program ID
       * @param {string} sessionId - The session ID
       * @param {Array} poses - Original poses array
       * @returns {Array} Poses array with custom durations applied
       */
      applyToSession: (programId, sessionId, poses) => {
        const state = get();
        const customDurations = state.durationOverrides[programId]?.[sessionId];

        if (!customDurations || Object.keys(customDurations).length === 0) {
          return poses;
        }

        return poses.map((pose, index) => {
          const customDuration = customDurations[index];
          if (customDuration !== undefined) {
            return { ...pose, duration: customDuration };
          }
          return pose;
        });
      },
    }),
    {
      name: "yoga-program-customizations",
      version: 1,
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Failed to load program customizations:", error);
        }
      },
      serialize: (state) => {
        try {
          return JSON.stringify(state);
        } catch (error) {
          console.error("Failed to save program customizations:", error);
          if (error.name === "QuotaExceededError" || error.code === 22) {
            console.warn(
              "localStorage quota exceeded for program customizations",
            );
          }
          return "{}";
        }
      },
      deserialize: (str) => {
        try {
          return JSON.parse(str);
        } catch (error) {
          console.error("Failed to parse program customizations:", error);
          return undefined;
        }
      },
    },
  ),
);

export default useProgramCustomizationsStore;
