import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Session Customizations Store
 *
 * Manages per-session duration overrides with localStorage persistence.
 * Stores custom pose durations for pre-built sessions.
 *
 * Structure:
 * {
 *   [sessionId]: {
 *     [poseIndex]: durationInSeconds
 *   }
 * }
 */
const useSessionCustomizationsStore = create(
  persist(
    (set, get) => ({
      // Duration overrides by session -> pose index
      durationOverrides: {},

      /**
       * Set a custom duration for a specific pose in a session.
       * @param {string} sessionId - The session ID
       * @param {number} poseIndex - Index of the pose in the session
       * @param {number} duration - Duration in seconds (must be multiple of 15)
       */
      setDuration: (sessionId, poseIndex, duration) => {
        // Validate duration is a multiple of 15 and within range
        const validDuration = Math.max(
          15,
          Math.min(300, Math.round(duration / 15) * 15),
        );

        set((state) => ({
          durationOverrides: {
            ...state.durationOverrides,
            [sessionId]: {
              ...state.durationOverrides[sessionId],
              [poseIndex]: validDuration,
            },
          },
        }));
      },

      /**
       * Set all durations for a session at once.
       * @param {string} sessionId - The session ID
       * @param {Object} durations - Object mapping pose index to duration
       */
      setSessionDurations: (sessionId, durations) => {
        set((state) => ({
          durationOverrides: {
            ...state.durationOverrides,
            [sessionId]: durations,
          },
        }));
      },

      /**
       * Get custom duration for a pose, or null if not customized.
       * @param {string} sessionId - The session ID
       * @param {number} poseIndex - Index of the pose
       * @returns {number|null} Custom duration or null
       */
      getDuration: (sessionId, poseIndex) => {
        const state = get();
        return state.durationOverrides[sessionId]?.[poseIndex] ?? null;
      },

      /**
       * Get all custom durations for a session.
       * @param {string} sessionId - The session ID
       * @returns {Object} Object mapping pose index to custom duration
       */
      getSessionDurations: (sessionId) => {
        const state = get();
        return state.durationOverrides[sessionId] ?? {};
      },

      /**
       * Check if a session has any customizations.
       * @param {string} sessionId - The session ID
       * @returns {boolean} True if session has customizations
       */
      hasCustomizations: (sessionId) => {
        const state = get();
        const sessionOverrides = state.durationOverrides[sessionId];
        if (!sessionOverrides) return false;
        return Object.keys(sessionOverrides).length > 0;
      },

      /**
       * Reset all customizations for a session.
       * @param {string} sessionId - The session ID
       */
      resetSession: (sessionId) => {
        set((state) => {
          const newOverrides = { ...state.durationOverrides };
          delete newOverrides[sessionId];
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
       * @param {string} sessionId - The session ID
       * @param {Array} poses - Original poses array
       * @returns {Array} Poses array with custom durations applied
       */
      applyToSession: (sessionId, poses) => {
        const state = get();
        const customDurations = state.durationOverrides[sessionId];

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
      name: "yoga-session-customizations",
      version: 1,
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Failed to load session customizations:", error);
        }
      },
      serialize: (state) => {
        try {
          return JSON.stringify(state);
        } catch (error) {
          console.error("Failed to save session customizations:", error);
          if (error.name === "QuotaExceededError" || error.code === 22) {
            console.warn(
              "localStorage quota exceeded for session customizations",
            );
          }
          return "{}";
        }
      },
      deserialize: (str) => {
        try {
          return JSON.parse(str);
        } catch (error) {
          console.error("Failed to parse session customizations:", error);
          return undefined;
        }
      },
    },
  ),
);

export default useSessionCustomizationsStore;
