# TypeScript Types for Yoga App

## Overview

This directory contains comprehensive TypeScript type definitions for all data models in the Mindful Yoga App. These types provide:

- **IDE Support**: Autocomplete and type checking in VSCode and other editors
- **Documentation**: Inline documentation for all data structures
- **Type Safety**: Catch errors before runtime
- **Future Migration**: Foundation for eventual TypeScript migration

## File Structure

```
src/types/
├── index.ts          # All type definitions
└── README.md         # This file
```

## Using Types in .jsx Files

Even though the app uses `.jsx` files, you can still benefit from TypeScript types using JSDoc comments.

### Method 1: Import Types in JSDoc

```javascript
/**
 * @param {import('../types').Pose} pose - The yoga pose to display
 * @returns {JSX.Element}
 */
function PoseCard(pose) {
  return (
    <div>
      <h2>{pose.nameEnglish}</h2>
      <p>{pose.nameSanskrit}</p>
    </div>
  );
}
```

### Method 2: Type Variables

```javascript
/** @type {import('../types').Session[]} */
const sessions = getSessions();

/** @type {import('../types').BreathingExercise} */
const exercise = getExerciseById('box-breathing');
```

### Method 3: Type Function Parameters

```javascript
/**
 * Complete a yoga session
 * @param {import('../types').SessionCompletionData} sessionData
 * @returns {import('../types').PracticeSession}
 */
export function completeSession(sessionData) {
  // Implementation
}
```

### Method 4: Complex Return Types

```javascript
/**
 * Get practice statistics
 * @returns {import('../types').AnalyticsSummary}
 */
export function getAnalyticsSummary() {
  // Implementation
}
```

## Type Categories

### 1. Core Data Types

#### Poses (`Pose`)
- Complete pose definition with instructions, benefits, modifications
- Used in: `src/data/poses.js`

#### Sessions (`Session`, `CustomSession`)
- Pre-built and custom yoga sessions
- Used in: `src/data/sessions.js`

#### Breathing Exercises (`BreathingExercise`)
- Pranayama exercises with patterns and instructions
- Used in: `src/data/breathing.js`

### 2. Progress Tracking Types

#### Practice Records (`PracticeSession`, `BreathingSession`)
- Completed session records with mood tracking
- Used in: `src/stores/progress.js`

#### Statistics (`ProgressStats`, `AnalyticsSummary`)
- Time-based analytics and summaries
- Used in: Insights dashboard

#### Achievements (`Achievement`)
- Unlockable badges and milestones

### 3. User Preferences Types

#### Settings (`VoiceSettings`, `PracticeSettings`, `NotificationSettings`)
- User configuration and preferences
- Used in: `src/stores/preferences.js`

#### Favorites Management
- Track favorite sessions and exercises

### 4. Utility Types

#### Enums
- `PoseCategory`: 'standing' | 'seated' | 'balance' | etc.
- `DifficultyLevel`: 'beginner' | 'intermediate' | 'advanced'
- `SessionFocus`: 'energy' | 'relax' | 'flexibility' | etc.
- `VoicePersonality`: 'gentle' | 'motivational' | 'minimal'

#### Analytics
- `ChartDataPoint`: For visualization components
- `MoodAnalytics`: Mood tracking insights
- `CalendarDay`: Practice calendar data

## Common Patterns

### 1. Working with Poses

```javascript
/** @type {import('../types').Pose} */
const pose = getPoseById('mountain-pose');

// Access typed properties
console.log(pose.nameEnglish);        // string
console.log(pose.duration);           // number
console.log(pose.category);           // PoseCategory
console.log(pose.instructions);       // string[]
console.log(pose.modifications.beginner); // string | undefined
```

### 2. Session Completion

```javascript
/** @type {import('../types').SessionCompletionData} */
const completionData = {
  sessionId: 'morning-energizer',
  sessionName: '5-min Morning Energizer',
  duration: 5,
  poses: selectedPoses,
  preMood: 3,
  postMood: 4,
  preEnergy: 2,
  postEnergy: 4
};

/** @type {import('../types').PracticeSession} */
const completed = completeSession(completionData);
```

### 3. Breathing Exercises

```javascript
/** @type {import('../types').BreathingExercise} */
const exercise = getBreathingExerciseById('box-breathing');

// Access pattern
const { inhale, holdIn, exhale, holdOut } = exercise.pattern;

// Voice instructions
const instruction = exercise.voiceInstructions.inhale;
```

### 4. Progress Analytics

```javascript
/** @type {import('../types').AnalyticsSummary} */
const summary = getAnalyticsSummary();

console.log(summary.thisWeek.sessions);      // number
console.log(summary.overall.longestStreak);  // number

/** @type {import('../types').MoodAnalytics} */
const moodData = getMoodAnalytics(30);

console.log(moodData.averageMoodImprovement); // number
console.log(moodData.moodTrend);              // MoodTrend
```

### 5. User Preferences

```javascript
/** @type {import('../types').VoiceSettings} */
const voiceSettings = getVoiceSettings();

console.log(voiceSettings.personality);  // VoicePersonality
console.log(voiceSettings.speed);        // number (0.8-1.2)

/** @type {import('../types').PracticeSettings} */
const practiceSettings = getPracticeSettings();

console.log(practiceSettings.autoAdvance);   // boolean
console.log(practiceSettings.restDuration);  // number
```

## Type Coverage

### Data Files
- ✅ `src/data/poses.js` - 100% coverage with `Pose` type
- ✅ `src/data/sessions.js` - 100% coverage with `Session` type
- ✅ `src/data/breathing.js` - 100% coverage with `BreathingExercise` type

### Store Files
- ✅ `src/stores/progress.js` - Complete coverage
  - PracticeSession
  - BreathingSession
  - ProgressStats
  - Achievement
  - All analytics types

- ✅ `src/stores/preferences.js` - Complete coverage
  - UserPreferences
  - VoiceSettings
  - PracticeSettings
  - NotificationSettings

### Component Props
- ✅ SessionCompletionData
- ✅ BreathingCompletionData
- ✅ RecommendationData
- ✅ FavoriteActionData

## VSCode Setup

To get full IntelliSense support in `.jsx` files:

1. **Enable JavaScript type checking** (optional but recommended):

   Add to `.vscode/settings.json`:
   ```json
   {
     "javascript.suggest.autoImports": true,
     "javascript.validate.enable": true,
     "js/ts.implicitProjectConfig.checkJs": true
   }
   ```

2. **Use JSDoc comments** as shown in examples above

3. **Import types** using the `import('../types')` syntax

## Benefits

### For Development
- ✅ Autocomplete for all data structures
- ✅ Catch typos and missing properties
- ✅ Better refactoring support
- ✅ Inline documentation in editor

### For Maintenance
- ✅ Single source of truth for data models
- ✅ Easy to see all fields and their purposes
- ✅ Clear type constraints (enums, ranges)
- ✅ Documentation built into types

### For Migration
- ✅ Ready for TypeScript conversion
- ✅ Types already validated against actual data
- ✅ Can gradually migrate file by file

## Type Validation

All types have been validated against actual data files:

```javascript
// poses.js structure matches Pose interface ✅
{
  id: string,
  emoji: string,
  nameEnglish: string,
  nameSanskrit: string,
  category: PoseCategory,
  difficulty: DifficultyLevel,
  duration: number,
  imageUrl: string,
  description: string,
  instructions: string[],
  benefits: string[],
  tips: string[],
  commonMistakes: string[],
  modifications: {
    beginner?: string,
    advanced?: string,
    // ... etc
  },
  breathingCues: string
}
```

## Examples from Actual Code

### From Practice Store

```javascript
/**
 * @param {import('../types').SessionCompletionData} sessionData
 * @returns {import('../types').PracticeSession}
 */
completeSession: (sessionData) => {
  const sessionRecord = {
    id: `session_${Date.now()}`,
    sessionId: sessionData.sessionId,
    sessionName: sessionData.sessionName,
    duration: sessionData.duration,
    completedAt: now.toISOString(),
    poses: sessionData.poses || [],
    date: today,
    preMood: sessionData.preMood || null,
    postMood: sessionData.postMood || null,
    // ... etc
  };

  return sessionRecord;
}
```

### From Preferences Store

```javascript
/**
 * @returns {import('../types').VoiceSettings}
 */
getVoiceSettings: () => {
  const state = get();
  return {
    enabled: state.voiceEnabled,
    personality: state.voicePersonality,
    speed: state.voiceSpeed,
    volume: state.voiceVolume
  };
}
```

## Field Ambiguities & Notes

### Pose Type
- ✅ All fields from actual data covered
- ✅ `bodyParts` marked optional (used in analytics but not in pose definitions)
- ✅ `name` marked optional (alias for `nameEnglish` in some contexts)

### Session Type
- ✅ All fields validated against sessions.js
- ✅ Custom sessions have same structure but user-created

### Breathing Exercise
- ✅ Complete pattern validation
- ✅ Voice instructions for all phases
- ✅ All helper function return types covered

### Practice Session
- ✅ Mood tracking fields all optional (may not be collected)
- ✅ `type` field differentiates yoga vs breathing sessions
- ✅ Calculated fields (moodImprovement, energyImprovement) always present if pre/post exist

### Preferences
- ✅ Legacy `breathing` and `yoga` objects kept for backwards compatibility
- ✅ All new settings properly typed
- ✅ Tooltip tracking with proper types

## Migration Path

When ready to migrate to TypeScript:

1. Rename `.jsx` to `.tsx`
2. Import types directly: `import { Pose, Session } from '../types'`
3. Use types natively: `const pose: Pose = getPoseById('mountain-pose')`
4. Remove JSDoc comments (types are now native)

## Questions?

Common questions and answers:

**Q: Do I need to use these types?**
A: No, but they provide helpful autocomplete and documentation in your editor.

**Q: Will this slow down the app?**
A: No, types are only used during development. They don't affect runtime performance.

**Q: What if I find a missing field?**
A: Update `src/types/index.ts` and the field will be available everywhere.

**Q: Can I add my own types?**
A: Yes! Add them to `index.ts` and they'll be available throughout the app.

---

**Generated**: 2025-10-01
**Version**: 1.0
**Total Types**: 50+ interfaces and type definitions
**Coverage**: 100% of data models
