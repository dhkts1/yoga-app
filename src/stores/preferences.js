import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Preferences Store
 *
 * Manages user preferences and settings with localStorage persistence.
 * Includes voice settings, practice preferences, notifications, onboarding, and favorites.
 */
const usePreferencesStore = create(
  persist(
    (set, get) => ({
      // Voice Coaching Settings
      voiceEnabled: true,
      voicePersonality: 'gentle', // 'gentle' | 'motivational' | 'minimal'
      voiceSpeed: 1.0, // 0.8 - 1.2
      voiceVolume: 0.8, // 0.0 - 1.0

      // Practice Settings
      autoAdvance: true, // Auto-advance to next pose
      countdownSounds: false, // Play sounds during countdown
      showTips: true, // Show tip overlays during practice

      // Notification Settings (for future implementation)
      practiceReminders: false,
      reminderTime: '09:00', // HH:MM format
      streakAlerts: true,

      // Display Preferences
      theme: 'light', // 'light' | 'dark' (future)

      // Onboarding state
      hasSeenOnboarding: false,  // Whether user has completed initial onboarding
      tooltipsDismissed: [],  // Array of dismissed tooltip IDs
      tooltipsShownCount: {}, // Track how many times each tooltip has been shown

      // Legacy breathing/yoga preferences (kept for backwards compatibility)
      breathing: {
        showMoodCheck: true,  // Whether to show mood tracking before/after breathing
        defaultDuration: 3,   // Default duration in minutes
        voiceEnabled: false,  // Whether voice guidance is enabled by default
      },

      yoga: {
        showMoodCheck: true,  // Whether to show mood tracking for yoga
        defaultDuration: 10, // Default duration in minutes
        voiceEnabled: false,
      },

      // Favorites
      favoriteSessions: [],     // Array of favorited session IDs
      favoriteExercises: [],    // Array of favorited breathing exercise IDs

      // Milestone celebrations
      milestoneCelebrated: {},  // Track which milestones have been celebrated (e.g., {3: true, 7: true, 30: true})

      // Actions - Voice Settings
      updateVoiceSettings: (settings) => {
        const currentState = get();
        const newSettings = {};

        if (typeof settings.voiceEnabled === 'boolean') {
          newSettings.voiceEnabled = settings.voiceEnabled;
        }
        if (settings.voicePersonality && ['gentle', 'motivational', 'minimal'].includes(settings.voicePersonality)) {
          newSettings.voicePersonality = settings.voicePersonality;
        }
        if (typeof settings.voiceSpeed === 'number') {
          newSettings.voiceSpeed = Math.max(0.8, Math.min(1.2, settings.voiceSpeed));
        }
        if (typeof settings.voiceVolume === 'number') {
          newSettings.voiceVolume = Math.max(0.0, Math.min(1.0, settings.voiceVolume));
        }

        set(newSettings);
        return { ...currentState, ...newSettings };
      },

      toggleVoice: () => {
        const state = get();
        const newEnabled = !state.voiceEnabled;
        set({ voiceEnabled: newEnabled });
        return newEnabled;
      },

      setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),

      setVoicePersonality: (personality) => {
        if (!['gentle', 'motivational', 'minimal'].includes(personality)) {
          console.warn(`Invalid voice personality: ${personality}. Using 'gentle' as default.`);
          personality = 'gentle';
        }
        set({ voicePersonality: personality });
        return personality;
      },

      setVoiceSpeed: (speed) => {
        const clampedSpeed = Math.max(0.8, Math.min(1.2, speed));
        set({ voiceSpeed: clampedSpeed });
        return clampedSpeed;
      },

      setVoiceVolume: (volume) => {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        set({ voiceVolume: clampedVolume });
        return clampedVolume;
      },

      getVoiceSettings: () => {
        const state = get();
        return {
          enabled: state.voiceEnabled,
          personality: state.voicePersonality,
          speed: state.voiceSpeed,
          volume: state.voiceVolume
        };
      },

      // Actions - Practice Settings
      toggleAutoAdvance: () => {
        const state = get();
        const newAutoAdvance = !state.autoAdvance;
        set({ autoAdvance: newAutoAdvance });
        return newAutoAdvance;
      },

      toggleCountdownSounds: () => {
        const state = get();
        const newCountdownSounds = !state.countdownSounds;
        set({ countdownSounds: newCountdownSounds });
        return newCountdownSounds;
      },

      toggleShowTips: () => {
        const state = get();
        const newShowTips = !state.showTips;
        set({ showTips: newShowTips });
        return newShowTips;
      },

      getPracticeSettings: () => {
        const state = get();
        return {
          autoAdvance: state.autoAdvance,
          countdownSounds: state.countdownSounds,
          showTips: state.showTips
        };
      },

      // Actions - Notifications
      togglePracticeReminders: () => {
        const state = get();
        const newReminders = !state.practiceReminders;
        set({ practiceReminders: newReminders });
        return newReminders;
      },

      setPracticeReminders: (enabled) => set({ practiceReminders: enabled }),

      setReminderTime: (time) => {
        // Validate time format HH:MM
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(time)) {
          console.warn(`Invalid time format: ${time}. Expected HH:MM format.`);
          return get().reminderTime;
        }
        set({ reminderTime: time });
        return time;
      },

      toggleStreakAlerts: () => {
        const state = get();
        const newStreakAlerts = !state.streakAlerts;
        set({ streakAlerts: newStreakAlerts });
        return newStreakAlerts;
      },

      setStreakAlerts: (enabled) => set({ streakAlerts: enabled }),

      // Actions - Display
      setTheme: (theme) => {
        if (!['light', 'dark'].includes(theme)) {
          console.warn(`Invalid theme: ${theme}. Using 'light' as default.`);
          theme = 'light';
        }
        set({ theme });
        return theme;
      },

      // Actions - Onboarding
      markOnboardingComplete: () => {
        set({ hasSeenOnboarding: true });
        return true;
      },

      completeOnboarding: () => set({ hasSeenOnboarding: true }), // Legacy alias

      resetOnboarding: () => set({ hasSeenOnboarding: false }),

      // Tooltip management
      dismissTooltip: (tooltipId) => set((state) => ({
        tooltipsDismissed: [...new Set([...state.tooltipsDismissed, tooltipId])]
      })),

      isTooltipDismissed: (tooltipId) => {
        const state = get();
        return state.tooltipsDismissed.includes(tooltipId);
      },

      incrementTooltipShown: (tooltipId) => set((state) => ({
        tooltipsShownCount: {
          ...state.tooltipsShownCount,
          [tooltipId]: (state.tooltipsShownCount[tooltipId] || 0) + 1
        }
      })),

      getTooltipShownCount: (tooltipId) => {
        const state = get();
        return state.tooltipsShownCount[tooltipId] || 0;
      },

      resetTooltips: () => set({
        tooltipsDismissed: [],
        tooltipsShownCount: {}
      }),

      // Legacy breathing/yoga methods (kept for backwards compatibility)
      toggleBreathingMoodCheck: () => set((state) => ({
        breathing: {
          ...state.breathing,
          showMoodCheck: !state.breathing.showMoodCheck
        }
      })),

      toggleYogaMoodCheck: () => set((state) => ({
        yoga: {
          ...state.yoga,
          showMoodCheck: !state.yoga.showMoodCheck
        }
      })),

      setYogaMoodCheck: (value) => set((state) => ({
        yoga: {
          ...state.yoga,
          showMoodCheck: value
        }
      })),

      setBreathingDefaultDuration: (duration) => set((state) => ({
        breathing: {
          ...state.breathing,
          defaultDuration: duration
        }
      })),

      toggleBreathingVoice: () => set((state) => ({
        breathing: {
          ...state.breathing,
          voiceEnabled: !state.breathing.voiceEnabled
        }
      })),

      // Session favorites management
      addFavoriteSession: (sessionId) => set((state) => {
        if (!state.favoriteSessions.includes(sessionId)) {
          return {
            favoriteSessions: [...state.favoriteSessions, sessionId]
          };
        }
        return state;
      }),

      removeFavoriteSession: (sessionId) => set((state) => ({
        favoriteSessions: state.favoriteSessions.filter(id => id !== sessionId)
      })),

      toggleFavoriteSession: (sessionId) => {
        const state = get();
        if (state.favoriteSessions.includes(sessionId)) {
          return state.removeFavoriteSession(sessionId);
        } else {
          return state.addFavoriteSession(sessionId);
        }
      },

      isFavoriteSession: (sessionId) => {
        const state = get();
        return state.favoriteSessions.includes(sessionId);
      },

      isFavorite: (sessionId) => {
        // Alias for backwards compatibility
        return get().isFavoriteSession(sessionId);
      },

      getFavoriteSessionIds: () => {
        const state = get();
        return state.favoriteSessions;
      },

      // Breathing exercise favorites management
      addFavoriteExercise: (exerciseId) => set((state) => {
        if (!state.favoriteExercises.includes(exerciseId)) {
          return {
            favoriteExercises: [...state.favoriteExercises, exerciseId]
          };
        }
        return state;
      }),

      removeFavoriteExercise: (exerciseId) => set((state) => ({
        favoriteExercises: state.favoriteExercises.filter(id => id !== exerciseId)
      })),

      toggleFavoriteExercise: (exerciseId) => {
        const state = get();
        if (state.favoriteExercises.includes(exerciseId)) {
          return state.removeFavoriteExercise(exerciseId);
        } else {
          return state.addFavoriteExercise(exerciseId);
        }
      },

      isFavoriteExercise: (exerciseId) => {
        const state = get();
        return state.favoriteExercises.includes(exerciseId);
      },

      getFavoriteExerciseIds: () => {
        const state = get();
        return state.favoriteExercises;
      },

      getAllFavorites: () => {
        const state = get();
        return {
          sessions: state.favoriteSessions,
          exercises: state.favoriteExercises,
          total: state.favoriteSessions.length + state.favoriteExercises.length
        };
      },

      // Milestone celebration management
      markMilestoneCelebrated: (milestone) => set((state) => ({
        milestoneCelebrated: {
          ...state.milestoneCelebrated,
          [milestone]: true
        }
      })),

      isMilestoneCelebrated: (milestone) => {
        const state = get();
        return state.milestoneCelebrated[milestone] === true;
      },

      resetMilestoneCelebrations: () => set({ milestoneCelebrated: {} }),

      // Data Export/Import
      exportPreferences: () => {
        const state = get();
        return {
          version: 1,
          timestamp: new Date().toISOString(),
          preferences: {
            voice: {
              enabled: state.voiceEnabled,
              personality: state.voicePersonality,
              speed: state.voiceSpeed,
              volume: state.voiceVolume
            },
            practice: {
              autoAdvance: state.autoAdvance,
              countdownSounds: state.countdownSounds,
              showTips: state.showTips
            },
            notifications: {
              practiceReminders: state.practiceReminders,
              reminderTime: state.reminderTime,
              streakAlerts: state.streakAlerts
            },
            display: {
              theme: state.theme
            },
            onboarding: {
              hasSeenOnboarding: state.hasSeenOnboarding,
              tooltipsDismissed: state.tooltipsDismissed,
              tooltipsShownCount: state.tooltipsShownCount
            },
            favorites: {
              sessions: state.favoriteSessions,
              exercises: state.favoriteExercises
            },
            // Legacy settings
            breathing: state.breathing,
            yoga: state.yoga
          }
        };
      },

      importPreferences: (data) => {
        try {
          if (!data || !data.preferences) {
            throw new Error('Invalid preferences data format');
          }

          const prefs = data.preferences;

          // Import voice settings
          if (prefs.voice) {
            set({
              voiceEnabled: prefs.voice.enabled ?? true,
              voicePersonality: prefs.voice.personality ?? 'gentle',
              voiceSpeed: prefs.voice.speed ?? 1.0,
              voiceVolume: prefs.voice.volume ?? 0.8
            });
          }

          // Import practice settings
          if (prefs.practice) {
            set({
              autoAdvance: prefs.practice.autoAdvance ?? true,
              countdownSounds: prefs.practice.countdownSounds ?? false,
              showTips: prefs.practice.showTips ?? true
            });
          }

          // Import notification settings
          if (prefs.notifications) {
            set({
              practiceReminders: prefs.notifications.practiceReminders ?? false,
              reminderTime: prefs.notifications.reminderTime ?? '09:00',
              streakAlerts: prefs.notifications.streakAlerts ?? true
            });
          }

          // Import display settings
          if (prefs.display) {
            set({
              theme: prefs.display.theme ?? 'light'
            });
          }

          // Import onboarding state
          if (prefs.onboarding) {
            set({
              hasSeenOnboarding: prefs.onboarding.hasSeenOnboarding ?? false,
              tooltipsDismissed: prefs.onboarding.tooltipsDismissed ?? [],
              tooltipsShownCount: prefs.onboarding.tooltipsShownCount ?? {}
            });
          }

          // Import favorites
          if (prefs.favorites) {
            set({
              favoriteSessions: prefs.favorites.sessions ?? [],
              favoriteExercises: prefs.favorites.exercises ?? []
            });
          }

          // Import legacy settings
          if (prefs.breathing) {
            set({ breathing: prefs.breathing });
          }
          if (prefs.yoga) {
            set({ yoga: prefs.yoga });
          }

          return true;
        } catch (error) {
          console.error('Failed to import preferences:', error);
          return false;
        }
      },

      // Legacy getPreferences method
      getPreferences: () => {
        const state = get();
        return {
          hasSeenOnboarding: state.hasSeenOnboarding,
          breathing: state.breathing,
          yoga: state.yoga,
          favoriteSessions: state.favoriteSessions,
          favoriteExercises: state.favoriteExercises,
          tooltipsDismissed: state.tooltipsDismissed,
          tooltipsShownCount: state.tooltipsShownCount
        };
      },

      // Reset to defaults
      resetToDefaults: () => {
        set({
          // Voice coaching settings
          voiceEnabled: true,
          voicePersonality: 'gentle',
          voiceSpeed: 1.0,
          voiceVolume: 0.8,

          // Practice settings
          autoAdvance: true,
          countdownSounds: false,
          showTips: true,

          // Notifications
          practiceReminders: false,
          reminderTime: '09:00',
          streakAlerts: true,

          // Display
          theme: 'light',

          // Onboarding
          hasSeenOnboarding: false,
          tooltipsDismissed: [],
          tooltipsShownCount: {},

          // Favorites
          favoriteSessions: [],
          favoriteExercises: [],

          // Legacy settings
          breathing: {
            showMoodCheck: true,
            defaultDuration: 3,
            voiceEnabled: false,
          },
          yoga: {
            showMoodCheck: true,
            defaultDuration: 10,
            voiceEnabled: false,
          }
        });
        return true;
      },

      // Legacy alias
      resetPreferences: () => {
        return get().resetToDefaults();
      }
    }),
    {
      name: 'mindful-yoga-preferences', // localStorage key
      version: 1,
      migrate: (persistedState, version) => {
        // Handle migrations if we change the store structure
        if (version === 0) {
          // Migrate from version 0 to 1
          return {
            ...persistedState,
            // Add new voice settings with defaults
            voiceEnabled: persistedState.voiceEnabled ?? true,
            voicePersonality: persistedState.voicePersonality ?? 'gentle',
            voiceSpeed: persistedState.voiceSpeed ?? 1.0,
            voiceVolume: persistedState.voiceVolume ?? 0.8,
            // Add new practice settings
            autoAdvance: persistedState.autoAdvance ?? true,
            countdownSounds: persistedState.countdownSounds ?? false,
            showTips: persistedState.showTips ?? true,
            // Add notifications
            practiceReminders: persistedState.practiceReminders ?? false,
            reminderTime: persistedState.reminderTime ?? '09:00',
            streakAlerts: persistedState.streakAlerts ?? true,
            // Add display
            theme: persistedState.theme ?? 'light',
            // Add tooltips
            tooltipsDismissed: persistedState.tooltipsDismissed ?? [],
            tooltipsShownCount: persistedState.tooltipsShownCount ?? {}
          };
        }
        return persistedState;
      }
    }
  )
);

export default usePreferencesStore;
