# TypeScript Types - Usage Examples

This document provides practical examples of using the TypeScript types in your `.jsx` files.

## Quick Reference

```javascript
// Import types in JSDoc comments
/** @type {import('../types').TypeName} */

// Common imports
import('../types').Pose
import('../types').Session
import('../types').BreathingExercise
import('../types').PracticeSession
import('../types').UserPreferences
```

---

## Example 1: Pose Card Component

```jsx
/**
 * Display a yoga pose card
 * @param {import('../types').Pose} pose - The pose to display
 * @returns {JSX.Element}
 */
function PoseCard({ pose }) {
  return (
    <div className="pose-card">
      <span className="emoji">{pose.emoji}</span>
      <h3>{pose.nameEnglish}</h3>
      <p className="sanskrit">{pose.nameSanskrit}</p>
      <p className="duration">{pose.duration}s</p>

      <div className="details">
        <p>{pose.description}</p>

        <h4>Benefits</h4>
        <ul>
          {pose.benefits.map((benefit, i) => (
            <li key={i}>{benefit}</li>
          ))}
        </ul>

        <h4>Instructions</h4>
        <ol>
          {pose.instructions.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>

        {pose.modifications.beginner && (
          <div className="modification">
            <strong>For Beginners:</strong> {pose.modifications.beginner}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Example 2: Session Selection

```jsx
/**
 * Get a session by ID with full type safety
 * @param {string} sessionId
 * @returns {import('../types').Session | undefined}
 */
export function getSessionById(sessionId) {
  /** @type {import('../types').Session[]} */
  const sessions = [
    {
      id: 'morning-energizer',
      name: '5-min Morning Energizer',
      duration: 5,
      focus: 'energy',
      bodyPart: 'full',
      difficulty: 'beginner',
      description: 'A gentle way to wake up your body and mind',
      poses: [
        { poseId: 'mountain-pose', duration: 30, transition: 'Take a deep breath' },
        { poseId: 'downward-dog', duration: 45, transition: 'Walk forward' }
      ]
    }
  ];

  return sessions.find(s => s.id === sessionId);
}

/**
 * Session list component
 * @param {{ sessions: import('../types').Session[] }} props
 */
function SessionList({ sessions }) {
  return (
    <div className="session-list">
      {sessions.map(session => (
        <div key={session.id} className="session-card">
          <h3>{session.name}</h3>
          <p>{session.description}</p>
          <div className="meta">
            <span>{session.duration} min</span>
            <span>{session.difficulty}</span>
            <span>{session.focus}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Example 3: Breathing Exercise Practice

```jsx
import { useState, useEffect } from 'react';

/**
 * Breathing practice component
 * @param {{ exercise: import('../types').BreathingExercise, duration: number }} props
 */
function BreathingPractice({ exercise, duration }) {
  /** @type {import('../types').BreathingPhase} */
  const [currentPhase, setCurrentPhase] = useState('inhale');
  const [cyclesCompleted, setcyclesCompleted] = useState(0);

  // Calculate total cycles
  const totalCycles = Math.floor((duration * 60) / exercise.cycleLength);

  // Get current phase duration
  const phaseDuration = exercise.pattern[currentPhase];

  // Get voice instruction for current phase
  const instruction = exercise.voiceInstructions[currentPhase];

  return (
    <div className="breathing-practice">
      <h2>{exercise.nameEnglish}</h2>
      <p className="sanskrit">{exercise.nameSanskrit}</p>

      <div className="phase-indicator">
        <h3>{currentPhase.toUpperCase()}</h3>
        <p>{instruction}</p>
        <p>{phaseDuration} seconds</p>
      </div>

      <div className="progress">
        <p>Cycle {cyclesCompleted + 1} of {totalCycles}</p>
      </div>

      <div className="pattern">
        <p>Inhale: {exercise.pattern.inhale}s</p>
        <p>Hold: {exercise.pattern.holdIn}s</p>
        <p>Exhale: {exercise.pattern.exhale}s</p>
        <p>Hold: {exercise.pattern.holdOut}s</p>
      </div>
    </div>
  );
}
```

---

## Example 4: Progress Tracking

```jsx
import useProgressStore from '../stores/progress';

/**
 * Complete a session and track it
 * @param {import('../types').Session} session
 * @param {number} preMood
 * @param {number} postMood
 */
function completeYogaSession(session, preMood, postMood) {
  const { completeSession } = useProgressStore();

  /** @type {import('../types').SessionCompletionData} */
  const sessionData = {
    sessionId: session.id,
    sessionName: session.name,
    duration: session.duration,
    preMood: preMood,
    postMood: postMood,
    preEnergy: 3,
    postEnergy: 4
  };

  /** @type {import('../types').PracticeSession} */
  const completedSession = completeSession(sessionData);

  console.log(`Session completed! ID: ${completedSession.id}`);
  console.log(`Mood improvement: ${completedSession.moodImprovement}`);

  return completedSession;
}

/**
 * Progress statistics component
 */
function ProgressStats() {
  const store = useProgressStore();

  /** @type {import('../types').StreakStatusInfo} */
  const streakInfo = store.getStreakStatus();

  /** @type {import('../types').AnalyticsSummary} */
  const analytics = store.getAnalyticsSummary();

  /** @type {import('../types').MoodAnalytics} */
  const moodData = store.getMoodAnalytics(30);

  return (
    <div className="progress-stats">
      <div className="streak">
        <h3>Current Streak</h3>
        <p className="count">{streakInfo.streak} days</p>
        <p className="message">{streakInfo.message}</p>
      </div>

      <div className="this-week">
        <h3>This Week</h3>
        <p>{analytics.thisWeek.sessions} sessions</p>
        <p>{analytics.thisWeek.minutes} minutes</p>
        <p>{analytics.thisWeek.avgPerDay} avg/day</p>
      </div>

      <div className="mood">
        <h3>Mood Impact</h3>
        <p>Average improvement: {moodData.averageMoodImprovement}</p>
        <p>Trend: {moodData.moodTrend}</p>
        <p>Success rate: {moodData.improvementRate}%</p>
      </div>

      <div className="overall">
        <h3>All Time</h3>
        <p>Total sessions: {analytics.overall.totalSessions}</p>
        <p>Total minutes: {analytics.overall.totalMinutes}</p>
        <p>Longest streak: {analytics.overall.longestStreak}</p>
      </div>
    </div>
  );
}
```

---

## Example 5: User Preferences

```jsx
import usePreferencesStore from '../stores/preferences';

/**
 * Voice settings panel
 */
function VoiceSettingsPanel() {
  const store = usePreferencesStore();

  /** @type {import('../types').VoiceSettings} */
  const voiceSettings = store.getVoiceSettings();

  /**
   * Update voice personality
   * @param {import('../types').VoicePersonality} personality
   */
  const handlePersonalityChange = (personality) => {
    store.setVoicePersonality(personality);
  };

  /**
   * Update voice speed
   * @param {number} speed - Speed between 0.8 and 1.2
   */
  const handleSpeedChange = (speed) => {
    store.setVoiceSpeed(speed);
  };

  return (
    <div className="voice-settings">
      <h3>Voice Coaching</h3>

      <label>
        <input
          type="checkbox"
          checked={voiceSettings.enabled}
          onChange={() => store.toggleVoice()}
        />
        Enable Voice Coaching
      </label>

      {voiceSettings.enabled && (
        <>
          <div className="personality">
            <label>Personality</label>
            <select
              value={voiceSettings.personality}
              onChange={e => handlePersonalityChange(e.target.value)}
            >
              <option value="gentle">Gentle Guide</option>
              <option value="motivational">Motivational Coach</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>

          <div className="speed">
            <label>Speed: {voiceSettings.speed}x</label>
            <input
              type="range"
              min="0.8"
              max="1.2"
              step="0.1"
              value={voiceSettings.speed}
              onChange={e => handleSpeedChange(parseFloat(e.target.value))}
            />
          </div>

          <div className="volume">
            <label>Volume: {Math.round(voiceSettings.volume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={voiceSettings.volume}
              onChange={e => store.setVoiceVolume(parseFloat(e.target.value))}
            />
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Practice settings component
 */
function PracticeSettingsPanel() {
  const store = usePreferencesStore();

  /** @type {import('../types').PracticeSettings} */
  const settings = store.getPracticeSettings();

  return (
    <div className="practice-settings">
      <h3>Practice Settings</h3>

      <label>
        <input
          type="checkbox"
          checked={settings.autoAdvance}
          onChange={() => store.toggleAutoAdvance()}
        />
        Auto-advance to next pose
      </label>

      <label>
        <input
          type="checkbox"
          checked={settings.showTips}
          onChange={() => store.toggleShowTips()}
        />
        Show helpful tips
      </label>

      <div className="rest-duration">
        <label>Rest between poses</label>
        <select
          value={settings.restDuration}
          onChange={e => store.setRestDuration(parseInt(e.target.value))}
        >
          <option value="0">No rest</option>
          <option value="5">5 seconds</option>
          <option value="10">10 seconds</option>
          <option value="15">15 seconds</option>
        </select>
      </div>
    </div>
  );
}
```

---

## Example 6: Custom Hooks with Types

```jsx
import { useMemo } from 'react';
import useProgressStore from '../stores/progress';
import { poses } from '../data/poses';

/**
 * Custom hook to get recent sessions with full pose data
 * @param {number} count - Number of recent sessions
 * @returns {Array<import('../types').PracticeSession & { enrichedPoses: import('../types').Pose[] }>}
 */
function useRecentSessionsWithPoses(count = 5) {
  const { practiceHistory } = useProgressStore();

  return useMemo(() => {
    return practiceHistory
      .slice(-count)
      .reverse()
      .map(session => ({
        ...session,
        enrichedPoses: session.poses?.map(pose =>
          poses.find(p => p.id === pose.id)
        ).filter(Boolean) || []
      }));
  }, [practiceHistory, count]);
}

/**
 * Custom hook for favorite sessions
 * @returns {{
 *   favorites: import('../types').Session[],
 *   toggleFavorite: (sessionId: string) => void,
 *   isFavorite: (sessionId: string) => boolean
 * }}
 */
function useFavorites() {
  const {
    favoriteSessions,
    toggleFavoriteSession,
    isFavoriteSession
  } = usePreferencesStore();

  const { sessions } = require('../data/sessions');

  /** @type {import('../types').Session[]} */
  const favorites = useMemo(() => {
    return favoriteSessions
      .map(id => sessions.find(s => s.id === id))
      .filter(Boolean);
  }, [favoriteSessions]);

  return {
    favorites,
    toggleFavorite: toggleFavoriteSession,
    isFavorite: isFavoriteSession
  };
}
```

---

## Example 7: Analytics Dashboard

```jsx
import useProgressStore from '../stores/progress';

/**
 * Analytics dashboard component
 */
function AnalyticsDashboard() {
  const store = useProgressStore();

  /** @type {import('../types').ChartDataPoint[]} */
  const mostPracticedPoses = store.getMostPracticedPoses(5);

  /** @type {import('../types').ChartDataPoint[]} */
  const favoriteSessions = store.getFavoriteSessions(5);

  /** @type {import('../types').ChartDataPoint[]} */
  const timeOfDay = store.getTimeOfDayDistribution();

  /** @type {import('../types').PracticeCalendar} */
  const calendar = store.getPracticeHeatmap();

  return (
    <div className="analytics-dashboard">
      <section className="most-practiced">
        <h3>Most Practiced Poses</h3>
        <ul>
          {mostPracticedPoses.map(pose => (
            <li key={pose.label}>
              {pose.label}: {pose.value} times
            </li>
          ))}
        </ul>
      </section>

      <section className="favorite-sessions">
        <h3>Favorite Sessions</h3>
        <ul>
          {favoriteSessions.map(session => (
            <li key={session.label}>
              {session.label}: {session.value} times
            </li>
          ))}
        </ul>
      </section>

      <section className="time-distribution">
        <h3>When You Practice</h3>
        <ul>
          {timeOfDay.map(slot => (
            <li key={slot.label}>
              {slot.label}: {slot.value} sessions
            </li>
          ))}
        </ul>
      </section>

      <section className="practice-calendar">
        <h3>Practice Calendar</h3>
        {Object.entries(calendar).map(([date, data]) => (
          <div key={date} className="calendar-day">
            <span>{date}</span>
            <span>{data.sessions} sessions</span>
            <span>{data.totalMinutes} min</span>
          </div>
        ))}
      </section>
    </div>
  );
}
```

---

## Example 8: Type Guards and Validation

```jsx
/**
 * Check if a session is a breathing session
 * @param {import('../types').CompletedSession} session
 * @returns {session is import('../types').BreathingSession}
 */
function isBreathingSession(session) {
  return session.type === 'breathing';
}

/**
 * Check if a session is a yoga session
 * @param {import('../types').CompletedSession} session
 * @returns {session is import('../types').PracticeSession}
 */
function isYogaSession(session) {
  return !session.type || session.type !== 'breathing';
}

/**
 * Display any completed session
 * @param {import('../types').CompletedSession} session
 */
function SessionDisplay({ session }) {
  if (isBreathingSession(session)) {
    return (
      <div className="breathing-session">
        <h3>{session.exerciseName}</h3>
        <p>Breathing Exercise</p>
        <p>{session.completedCycles} / {session.targetCycles} cycles</p>
        <p>Category: {session.category}</p>
      </div>
    );
  }

  if (isYogaSession(session)) {
    return (
      <div className="yoga-session">
        <h3>{session.sessionName}</h3>
        <p>Yoga Session</p>
        <p>{session.poses?.length || 0} poses</p>
      </div>
    );
  }

  return null;
}
```

---

## Example 9: Form Validation with Types

```jsx
import { useState } from 'react';

/**
 * Mood check form
 * @param {{
 *   onSubmit: (data: Pick<import('../types').MoodData, 'preMood' | 'preEnergy'>) => void
 * }} props
 */
function MoodCheckForm({ onSubmit }) {
  const [preMood, setPreMood] = useState(3);
  const [preEnergy, setPreEnergy] = useState(3);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate mood range (1-5)
    if (preMood < 1 || preMood > 5 || preEnergy < 1 || preEnergy > 5) {
      alert('Please select values between 1 and 5');
      return;
    }

    /** @type {Pick<import('../types').MoodData, 'preMood' | 'preEnergy'>} */
    const moodData = {
      preMood,
      preEnergy
    };

    onSubmit(moodData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>How are you feeling?</label>
        <input
          type="range"
          min="1"
          max="5"
          value={preMood}
          onChange={e => setPreMood(parseInt(e.target.value))}
        />
        <span>{preMood}</span>
      </div>

      <div>
        <label>Energy level?</label>
        <input
          type="range"
          min="1"
          max="5"
          value={preEnergy}
          onChange={e => setPreEnergy(parseInt(e.target.value))}
        />
        <span>{preEnergy}</span>
      </div>

      <button type="submit">Start Practice</button>
    </form>
  );
}
```

---

## Example 10: Helper Functions with Types

```jsx
/**
 * Filter sessions by focus
 * @param {import('../types').Session[]} sessions
 * @param {import('../types').SessionFocus} focus
 * @returns {import('../types').Session[]}
 */
export function filterSessionsByFocus(sessions, focus) {
  return sessions.filter(s => s.focus === focus);
}

/**
 * Get total duration of sessions
 * @param {import('../types').Session[]} sessions
 * @returns {number} Total duration in minutes
 */
export function getTotalDuration(sessions) {
  return sessions.reduce((total, s) => total + s.duration, 0);
}

/**
 * Sort poses by difficulty
 * @param {import('../types').Pose[]} poses
 * @returns {import('../types').Pose[]}
 */
export function sortPosesByDifficulty(poses) {
  const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
  return [...poses].sort((a, b) =>
    difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
  );
}

/**
 * Calculate breathing cycles for duration
 * @param {import('../types').BreathingExercise} exercise
 * @param {number} durationMinutes
 * @returns {number} Number of cycles
 */
export function calculateBreathingCycles(exercise, durationMinutes) {
  const totalSeconds = durationMinutes * 60;
  return Math.floor(totalSeconds / exercise.cycleLength);
}

/**
 * Format session duration
 * @param {import('../types').Session | import('../types').BreathingExercise} item
 * @returns {string}
 */
export function formatDuration(item) {
  const minutes = item.duration;
  if (minutes < 1) return `${minutes * 60}s`;
  if (minutes === 1) return '1 min';
  return `${minutes} mins`;
}
```

---

## Tips for Best Results

### 1. Enable Type Checking in VSCode

Add to `.vscode/settings.json`:
```json
{
  "javascript.suggest.autoImports": true,
  "javascript.validate.enable": true
}
```

### 2. Use Consistent Import Patterns

```javascript
// ✅ Good - specific type
/** @type {import('../types').Pose} */

// ❌ Avoid - importing entire module
/** @type {import('../types/index.ts').Pose} */
```

### 3. Leverage Type Inference

```javascript
// ✅ Type is inferred from store
const { completeSession } = useProgressStore();
const result = completeSession(data); // result is PracticeSession

// ❌ Unnecessary explicit typing
/** @type {import('../types').PracticeSession} */
const result = completeSession(data);
```

### 4. Document Complex Types

```javascript
/**
 * @typedef {Object} SessionWithPoses
 * @property {import('../types').Session} session - The session
 * @property {import('../types').Pose[]} poses - Enriched pose data
 */

/**
 * @type {SessionWithPoses[]}
 */
const enrichedSessions = [];
```

---

For more examples, see:
- `/src/stores/progress.js` - Progress tracking examples
- `/src/stores/preferences.js` - Preferences examples
- `/src/data/poses.js` - Pose data structure
