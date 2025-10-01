/**
 * TypeScript Type Definitions for Mindful Yoga App
 *
 * This file provides comprehensive type definitions for all data models in the app.
 * These types can be used in TypeScript files and referenced in JSDoc comments for .jsx files.
 *
 * Usage in .jsx files:
 * @type {import('../types').Pose}
 * @param {import('../types').Session} session
 * @returns {import('../types').PracticeSession}
 */

// ============================================================================
// Enums and Literal Types
// ============================================================================

/** Pose categories */
export type PoseCategory = 'standing' | 'seated' | 'balance' | 'flexibility' | 'backbend' | 'core' | 'restorative';

/** Difficulty levels */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

/** Session focus areas */
export type SessionFocus = 'energy' | 'relax' | 'flexibility' | 'strength' | 'balance' | 'full';

/** Body parts targeted by sessions */
export type BodyPart = 'full' | 'back' | 'hips' | 'core' | 'shoulders' | 'neck' | 'legs' | 'breathing';

/** Breathing exercise categories */
export type BreathingCategory = 'calming' | 'relaxing' | 'energizing' | 'balancing';

/** Voice personalities for coaching */
export type VoicePersonality = 'gentle' | 'motivational' | 'minimal';

/** Breathing phases */
export type BreathingPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

/** Streak statuses */
export type StreakStatus = 'new' | 'today' | 'continue' | 'broken';

/** Mood trend indicators */
export type MoodTrend = 'improving' | 'stable' | 'declining' | 'insufficient_data';

/** Theme options */
export type Theme = 'light' | 'dark';

// ============================================================================
// Pose Types
// ============================================================================

/**
 * Pose modifications for different skill levels and conditions
 */
export interface PoseModifications {
  /** Modification for beginners */
  beginner?: string;
  /** Modification for advanced practitioners */
  advanced?: string;
  /** Modification for pregnancy */
  pregnancy?: string;
  /** Modification for tight muscles */
  tight?: string;
  /** Modification for wrist issues */
  wrists?: string;
  /** Modification for knee issues */
  knees?: string;
  /** Modification for back issues */
  back?: string;
  /** Modification for shoulder issues */
  shoulders?: string;
  /** Modification for balance assistance */
  balance?: string;
  /** Modification for core strengthening */
  core?: string;
  /** Restorative variation */
  restorative?: string;
}

/**
 * Complete pose definition with all metadata
 */
export interface Pose {
  /** Unique identifier for the pose */
  id: string;
  /** Emoji representing the pose */
  emoji: string;
  /** English name of the pose */
  nameEnglish: string;
  /** Sanskrit name of the pose */
  nameSanskrit: string;
  /** Category/type of pose */
  category: PoseCategory;
  /** Difficulty level */
  difficulty: DifficultyLevel;
  /** Default duration in seconds */
  duration: number;
  /** Path to pose illustration image */
  imageUrl: string;
  /** Detailed description of the pose */
  description: string;
  /** Step-by-step instructions */
  instructions: string[];
  /** Health and wellness benefits */
  benefits: string[];
  /** Helpful tips for practitioners */
  tips: string[];
  /** Common mistakes to avoid */
  commonMistakes: string[];
  /** Modifications for different levels and conditions */
  modifications: PoseModifications;
  /** Breathing guidance for the pose */
  breathingCues: string;
  /** Whether this pose should be done on both sides (e.g., Warrior I left and right) */
  requiresBothSides?: boolean;
  /** Optional: Body parts targeted (for analytics) */
  bodyParts?: string[];
  /** Optional: Pose name for display */
  name?: string;
}

// ============================================================================
// Session Types
// ============================================================================

/**
 * Individual pose within a session with timing and transitions
 */
export interface SessionPose {
  /** ID of the pose from poses.js */
  poseId: string;
  /** Duration to hold this pose in seconds */
  duration: number;
  /** Transition instruction to next pose */
  transition: string;
  /** Which side for poses that require both sides (e.g., 'left' or 'right') */
  side?: 'left' | 'right';
}

/**
 * Pre-built yoga session definition
 */
export interface Session {
  /** Unique identifier for the session */
  id: string;
  /** Display name of the session */
  name: string;
  /** Total duration in minutes */
  duration: number;
  /** Primary focus of the session */
  focus: SessionFocus;
  /** Body part or area targeted */
  bodyPart: BodyPart;
  /** Difficulty level */
  difficulty: DifficultyLevel;
  /** Description of the session */
  description: string;
  /** Sequence of poses in the session */
  poses: SessionPose[];
}

/**
 * Custom session created by user
 */
export interface CustomSession {
  /** Unique identifier */
  id: string;
  /** User-defined name */
  name: string;
  /** Total estimated duration in minutes */
  duration: number;
  /** Selected poses with durations */
  poses: SessionPose[];
  /** When the session was created */
  createdAt: string;
  /** Optional description */
  description?: string;
  /** Optional focus area */
  focus?: SessionFocus;
}

// ============================================================================
// Breathing Exercise Types
// ============================================================================

/**
 * Breathing pattern definition
 */
export interface BreathingPattern {
  /** Inhale duration in seconds */
  inhale: number;
  /** Hold after inhale duration in seconds */
  holdIn: number;
  /** Exhale duration in seconds */
  exhale: number;
  /** Hold after exhale duration in seconds */
  holdOut: number;
}

/**
 * Voice instructions for breathing phases
 */
export interface BreathingVoiceInstructions {
  /** Instruction for inhale phase */
  inhale: string;
  /** Instruction for hold-in phase */
  holdIn: string;
  /** Instruction for exhale phase */
  exhale: string;
  /** Instruction for hold-out phase */
  holdOut: string;
}

/**
 * Complete breathing exercise definition
 */
export interface BreathingExercise {
  /** Unique identifier */
  id: string;
  /** Emoji representing the exercise */
  emoji: string;
  /** English name */
  nameEnglish: string;
  /** Sanskrit name */
  nameSanskrit: string;
  /** Category of breathing exercise */
  category: BreathingCategory;
  /** Difficulty level */
  difficulty: DifficultyLevel;
  /** Breathing pattern with all phases */
  pattern: BreathingPattern;
  /** Total length of one breathing cycle in seconds */
  cycleLength: number;
  /** Default practice duration in minutes */
  defaultDuration: number;
  /** Detailed description */
  description: string;
  /** Step-by-step instructions */
  instructions: string[];
  /** Health and wellness benefits */
  benefits: string[];
  /** Helpful tips */
  tips: string[];
  /** Best use cases */
  bestFor: string[];
  /** Voice instructions for each phase */
  voiceInstructions: BreathingVoiceInstructions;
}

/**
 * Breathing duration option
 */
export interface BreathingDuration {
  /** Duration value in minutes */
  value: number;
  /** Display label */
  label: string;
  /** Description of this duration */
  description: string;
}

// ============================================================================
// Progress Tracking Types
// ============================================================================

/**
 * Mood tracking data
 */
export interface MoodData {
  /** Mood rating before practice (1-5) */
  preMood: number | null;
  /** Energy level before practice (1-5) */
  preEnergy: number | null;
  /** Mood rating after practice (1-5) */
  postMood: number | null;
  /** Energy level after practice (1-5) */
  postEnergy: number | null;
  /** Calculated mood improvement */
  moodImprovement: number | null;
  /** Calculated energy improvement */
  energyImprovement: number | null;
}

/**
 * Completed yoga practice session record
 */
export interface PracticeSession {
  /** Unique identifier */
  id: string;
  /** ID of the session template used */
  sessionId: string;
  /** Name of the session */
  sessionName: string;
  /** Duration in minutes */
  duration: number;
  /** ISO timestamp when completed */
  completedAt: string;
  /** Poses practiced in this session */
  poses?: Pose[];
  /** Date string for grouping */
  date: string;
  /** Mood tracking data */
  preMood?: number | null;
  preEnergy?: number | null;
  postMood?: number | null;
  postEnergy?: number | null;
  moodImprovement?: number | null;
  energyImprovement?: number | null;
  /** Optional session type marker */
  type?: 'yoga';
}

/**
 * Completed breathing session record
 */
export interface BreathingSession {
  /** Unique identifier */
  id: string;
  /** ID of the breathing exercise used */
  exerciseId: string;
  /** Name of the exercise */
  exerciseName: string;
  /** Duration in minutes */
  duration: number;
  /** ISO timestamp when completed */
  completedAt: string;
  /** Target number of cycles */
  targetCycles?: number;
  /** Actual completed cycles */
  completedCycles?: number;
  /** Exercise category */
  category?: BreathingCategory;
  /** Date string for grouping */
  date: string;
  /** Session type marker */
  type: 'breathing';
  /** Mood tracking data */
  preMood?: number | null;
  preEnergy?: number | null;
  postMood?: number | null;
  postEnergy?: number | null;
  moodImprovement?: number | null;
  energyImprovement?: number | null;
}

/**
 * Union type for any completed session
 */
export type CompletedSession = PracticeSession | BreathingSession;

/**
 * Statistics for a time period
 */
export interface PeriodStats {
  /** Number of yoga sessions */
  sessions: number;
  /** Total minutes of yoga */
  minutes: number;
  /** Number of breathing sessions */
  breathingSessions: number;
  /** Total minutes of breathing */
  breathingMinutes: number;
}

/**
 * All-time statistics
 */
export interface AllTimeStats extends PeriodStats {
  /** Average session length in minutes */
  averageSessionLength: number;
  /** Average breathing session length in minutes */
  averageBreathingLength: number;
}

/**
 * Complete statistics breakdown
 */
export interface ProgressStats {
  /** This week's stats */
  thisWeek: PeriodStats;
  /** This month's stats */
  thisMonth: PeriodStats;
  /** All-time stats */
  allTime: AllTimeStats;
}

/**
 * Achievement/badge definition
 */
export interface Achievement {
  /** Unique achievement ID */
  id: string;
  /** Display name */
  name: string;
  /** Description of how to earn it */
  description: string;
  /** Check function (internal use) */
  check?: () => boolean;
  /** Icon emoji */
  icon: string;
  /** When this achievement was unlocked */
  unlockedAt?: string;
}

/**
 * Streak status information
 */
export interface StreakStatusInfo {
  /** Current streak status */
  status: StreakStatus;
  /** Display message */
  message: string;
  /** Current streak count */
  streak: number;
  /** Days since last practice (only for broken status) */
  daysSince?: number;
}

/**
 * Practice calendar day data
 */
export interface CalendarDay {
  /** Total sessions on this day */
  sessions: number;
  /** Total minutes practiced */
  totalMinutes: number;
  /** Number of yoga sessions */
  yogaSessions: number;
  /** Number of breathing sessions */
  breathingSessions: number;
  /** Date string */
  date: string;
}

/**
 * Practice calendar (date string -> day data)
 */
export type PracticeCalendar = Record<string, CalendarDay>;

/**
 * Mood analytics summary
 */
export interface MoodAnalytics {
  /** Average mood improvement across sessions */
  averageMoodImprovement: number;
  /** Average energy improvement across sessions */
  averageEnergyImprovement: number;
  /** Number of sessions with mood data */
  sessionsWithMoodData: number;
  /** Total sessions in period */
  totalSessions: number;
  /** Overall mood trend */
  moodTrend: MoodTrend;
  /** Percentage of sessions with positive mood improvement */
  improvementRate?: number;
}

/**
 * Chart data point for analytics
 */
export interface ChartDataPoint {
  /** Label for the data point */
  label: string;
  /** Value for the data point */
  value: number;
}

/**
 * Recommendation tracking data
 */
export interface RecommendationRecord {
  /** Unique record ID */
  id: string;
  /** Recommended session ID */
  sessionId: string;
  /** Reason for recommendation */
  reason: string;
  /** Category of recommendation */
  category: string;
  /** Confidence score */
  confidence?: number;
  /** Whether user accepted the recommendation */
  accepted: boolean;
  /** When recommendation was shown */
  timestamp: string;
  /** Hour of day (0-23) */
  timeOfDay: number;
}

/**
 * Favorite action tracking
 */
export interface FavoriteActionRecord {
  /** Unique record ID */
  id: string;
  /** Item that was favorited/unfavorited */
  itemId: string;
  /** Type of item */
  type: 'session' | 'breathing';
  /** Action performed */
  action: 'add' | 'remove';
  /** When action occurred */
  timestamp: string;
  /** Hour of day (0-23) */
  timeOfDay: number;
}

/**
 * Favorite analytics summary
 */
export interface FavoriteAnalytics {
  /** Total favorite actions */
  totalActions: number;
  /** Number of add actions */
  addCount: number;
  /** Number of remove actions */
  removeCount: number;
  /** Most favorited items */
  mostFavorited: Array<{
    type: 'session' | 'breathing';
    itemId: string;
    count: number;
  }>;
  /** Breakdown by type */
  favoritesByType: {
    session: number;
    breathing: number;
  };
}

/**
 * Recommendation analytics summary
 */
export interface RecommendationAnalytics {
  /** Total recommendations shown */
  totalRecommendations: number;
  /** Acceptance rate percentage */
  acceptanceRate: number;
  /** Category with highest acceptance rate */
  mostAcceptedCategory: string | null;
  /** Best time of day for recommendations (hour 0-23) */
  bestTimeOfDay: number | null;
  /** Detailed breakdown by category */
  categoryBreakdown?: Record<string, { total: number; accepted: number }>;
}

/**
 * Analytics summary for insights dashboard
 */
export interface AnalyticsSummary {
  /** This week's summary */
  thisWeek: {
    sessions: number;
    minutes: number;
    avgPerDay: number;
  };
  /** This month's summary */
  thisMonth: {
    sessions: number;
    minutes: number;
    avgPerDay: number;
  };
  /** Overall summary */
  overall: {
    totalSessions: number;
    totalMinutes: number;
    avgSessionLength: number;
    longestStreak: number;
    currentStreak: number;
  };
}

// ============================================================================
// Preferences Types
// ============================================================================

/**
 * Voice coaching settings
 */
export interface VoiceSettings {
  /** Whether voice coaching is enabled */
  enabled: boolean;
  /** Voice personality type */
  personality: VoicePersonality;
  /** Voice playback speed (0.8-1.2) */
  speed: number;
  /** Voice volume (0.0-1.0) */
  volume: number;
}

/**
 * Practice settings
 */
export interface PracticeSettings {
  /** Auto-advance to next pose */
  autoAdvance: boolean;
  /** Play countdown sounds */
  countdownSounds: boolean;
  /** Show tip overlays */
  showTips: boolean;
  /** Rest duration between poses in seconds */
  restDuration: number;
}

/**
 * Notification settings
 */
export interface NotificationSettings {
  /** Enable practice reminders */
  practiceReminders: boolean;
  /** Reminder time in HH:MM format */
  reminderTime: string;
  /** Enable streak alerts */
  streakAlerts: boolean;
}

/**
 * Legacy breathing preferences
 */
export interface BreathingPreferences {
  /** Show mood check for breathing */
  showMoodCheck: boolean;
  /** Default duration in minutes */
  defaultDuration: number;
  /** Voice enabled for breathing */
  voiceEnabled: boolean;
}

/**
 * Legacy yoga preferences
 */
export interface YogaPreferences {
  /** Show mood check for yoga */
  showMoodCheck: boolean;
  /** Default duration in minutes */
  defaultDuration: number;
  /** Voice enabled for yoga */
  voiceEnabled: boolean;
}

/**
 * Complete user preferences
 */
export interface UserPreferences {
  // Voice settings
  voiceEnabled: boolean;
  voicePersonality: VoicePersonality;
  voiceSpeed: number;
  voiceVolume: number;

  // Practice settings
  autoAdvance: boolean;
  countdownSounds: boolean;
  showTips: boolean;
  restDuration: number;

  // Notification settings
  practiceReminders: boolean;
  reminderTime: string;
  streakAlerts: boolean;

  // Display preferences
  theme: Theme;

  // Onboarding state
  hasSeenOnboarding: boolean;
  tooltipsDismissed: string[];
  tooltipsShownCount: Record<string, number>;

  // Legacy preferences
  breathing: BreathingPreferences;
  yoga: YogaPreferences;

  // Favorites
  favoriteSessions: string[];
  favoriteExercises: string[];

  // Milestone tracking
  milestoneCelebrated: Record<number, boolean>;
}

/**
 * Exported preferences data structure
 */
export interface ExportedPreferences {
  /** Export format version */
  version: number;
  /** Export timestamp */
  timestamp: string;
  /** Preferences data */
  preferences: {
    voice: VoiceSettings;
    practice: PracticeSettings;
    notifications: NotificationSettings;
    display: { theme: Theme };
    onboarding: {
      hasSeenOnboarding: boolean;
      tooltipsDismissed: string[];
      tooltipsShownCount: Record<string, number>;
    };
    favorites: {
      sessions: string[];
      exercises: string[];
    };
    breathing: BreathingPreferences;
    yoga: YogaPreferences;
  };
}

// ============================================================================
// Component Props Types (commonly used)
// ============================================================================

/**
 * Session completion data passed to complete session
 */
export interface SessionCompletionData {
  /** Session template ID */
  sessionId: string;
  /** Session display name */
  sessionName: string;
  /** Duration in minutes */
  duration: number;
  /** Poses practiced */
  poses?: Pose[];
  /** Pre-practice mood (1-5) */
  preMood?: number | null;
  /** Pre-practice energy (1-5) */
  preEnergy?: number | null;
  /** Post-practice mood (1-5) */
  postMood?: number | null;
  /** Post-practice energy (1-5) */
  postEnergy?: number | null;
}

/**
 * Breathing session completion data
 */
export interface BreathingCompletionData {
  /** Exercise ID */
  exerciseId: string;
  /** Exercise display name */
  exerciseName: string;
  /** Duration in minutes */
  duration: number;
  /** Target cycles */
  targetCycles?: number;
  /** Completed cycles */
  completedCycles?: number;
  /** Exercise category */
  category?: BreathingCategory;
  /** Pre-practice mood (1-5) */
  preMood?: number | null;
  /** Pre-practice energy (1-5) */
  preEnergy?: number | null;
  /** Post-practice mood (1-5) */
  postMood?: number | null;
  /** Post-practice energy (1-5) */
  postEnergy?: number | null;
}

/**
 * Recommendation data for tracking
 */
export interface RecommendationData {
  /** Recommended session ID */
  sessionId: string;
  /** Reason for recommendation */
  reason: string;
  /** Category of recommendation */
  category: string;
  /** Confidence score */
  confidence?: number;
  /** Whether user accepted it */
  accepted: boolean;
}

/**
 * Favorite action data for tracking
 */
export interface FavoriteActionData {
  /** Item ID */
  itemId: string;
  /** Item type */
  type: 'session' | 'breathing';
  /** Action performed */
  action: 'add' | 'remove';
}

// ============================================================================
// JSDoc Type Definitions for .jsx files
// ============================================================================

/**
 * @typedef {Object} Pose
 * @property {string} id
 * @property {string} emoji
 * @property {string} nameEnglish
 * @property {string} nameSanskrit
 * @property {PoseCategory} category
 * @property {DifficultyLevel} difficulty
 * @property {number} duration
 * @property {string} imageUrl
 * @property {string} description
 * @property {string[]} instructions
 * @property {string[]} benefits
 * @property {string[]} tips
 * @property {string[]} commonMistakes
 * @property {PoseModifications} modifications
 * @property {string} breathingCues
 * @property {boolean} [requiresBothSides]
 */

/**
 * @typedef {Object} Session
 * @property {string} id
 * @property {string} name
 * @property {number} duration
 * @property {SessionFocus} focus
 * @property {BodyPart} bodyPart
 * @property {DifficultyLevel} difficulty
 * @property {string} description
 * @property {SessionPose[]} poses
 */

/**
 * @typedef {Object} BreathingExercise
 * @property {string} id
 * @property {string} emoji
 * @property {string} nameEnglish
 * @property {string} nameSanskrit
 * @property {BreathingCategory} category
 * @property {DifficultyLevel} difficulty
 * @property {BreathingPattern} pattern
 * @property {number} cycleLength
 * @property {number} defaultDuration
 * @property {string} description
 * @property {string[]} instructions
 * @property {string[]} benefits
 * @property {string[]} tips
 * @property {string[]} bestFor
 * @property {BreathingVoiceInstructions} voiceInstructions
 */

/**
 * @typedef {Object} PracticeSession
 * @property {string} id
 * @property {string} sessionId
 * @property {string} sessionName
 * @property {number} duration
 * @property {string} completedAt
 * @property {Pose[]} [poses]
 * @property {string} date
 * @property {number|null} [preMood]
 * @property {number|null} [preEnergy]
 * @property {number|null} [postMood]
 * @property {number|null} [postEnergy]
 * @property {number|null} [moodImprovement]
 * @property {number|null} [energyImprovement]
 */

// Export type utilities
export type { };
