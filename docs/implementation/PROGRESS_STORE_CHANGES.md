# Progress Store Changes for Program Support

## Summary
Enhanced `progress.js` to support optional program tracking while maintaining full backward compatibility.

## Changes Made

### 1. Session Record Model Enhancement (Lines 92-95)
Added three optional fields to session records:
```javascript
{
  // ... existing fields ...
  programId: sessionData.programId || null,      // e.g., 'flexibility-focus'
  weekNumber: sessionData.weekNumber || null,    // e.g., 1, 2, 3, 4
  dayNumber: sessionData.dayNumber || null,      // e.g., 1-7
  // ... existing fields ...
}
```

### 2. New Program Analytics Methods (Lines 774-829)

#### `getProgramSessions(programId)`
Returns all sessions completed for a specific program.
```javascript
const flexibilitySessions = getProgramSessions('flexibility-focus');
```

#### `getProgramWeekSessions(programId, weekNumber)`
Returns all sessions for a specific week within a program.
```javascript
const week1Sessions = getProgramWeekSessions('flexibility-focus', 1);
```

#### `getProgramDaySessions(programId, weekNumber, dayNumber)`
Returns sessions for a specific day (supports repeating same day).
```javascript
const day1Sessions = getProgramDaySessions('flexibility-focus', 1, 1);
```

#### `isProgramDayCompleted(programId, weekNumber, dayNumber)`
Boolean check if a specific program day has been completed.
```javascript
const isComplete = isProgramDayCompleted('flexibility-focus', 1, 1);
```

#### `getProgramWeekStats(programId, weekNumber, totalDays)`
Returns completion statistics for a program week.
```javascript
const stats = getProgramWeekStats('flexibility-focus', 1, 7);
// Returns:
// {
//   completedDays: 5,
//   totalDays: 7,
//   completionRate: 71,
//   totalMinutes: 75,
//   sessionsCompleted: 5
// }
```

## Usage Example

### When Completing a Program Session
```javascript
import useProgressStore from '@/stores/progress';

const { completeSession } = useProgressStore();

// Regular session (backward compatible)
completeSession({
  sessionId: 'morning-flow-5',
  sessionName: 'Morning Flow',
  duration: 5,
  poses: [...]
});

// Program session (new)
completeSession({
  sessionId: 'morning-flow-5',
  sessionName: 'Morning Flow',
  duration: 5,
  poses: [...],
  programId: 'flexibility-focus',  // NEW
  weekNumber: 1,                    // NEW
  dayNumber: 1                      // NEW
});
```

### Querying Program Progress
```javascript
import useProgressStore from '@/stores/progress';

const {
  isProgramDayCompleted,
  getProgramWeekStats
} = useProgressStore();

// Check if today's session is complete
const isDayComplete = isProgramDayCompleted('flexibility-focus', 1, 3);

// Get week completion stats
const weekStats = getProgramWeekStats('flexibility-focus', 1, 7);
console.log(`Week 1: ${weekStats.completionRate}% complete`);
```

## Backward Compatibility

✅ **100% Backward Compatible**
- Existing sessions without program fields continue to work
- All existing methods unchanged
- Optional fields default to `null`
- No migration needed for existing data

## Integration with programProgress.js

**Division of Responsibilities:**

### progress.js (this file)
- Records session completions (the "what" and "when")
- Stores program context (programId, weekNumber, dayNumber)
- Provides querying methods for program sessions
- Handles all session-level analytics

### programProgress.js (separate store)
- Tracks program enrollment and active programs
- Manages week unlock progression (Week 1 → Week 2 → etc.)
- Stores program-level metadata (startedAt, currentWeek, etc.)
- Handles program-level logic (unlock next week, completion status)

**No Data Duplication:**
- Session completion only recorded once in progress.js
- programProgress.js queries progress.js for completion data
- Single source of truth for "did user complete this session?"

## Testing Considerations

When testing program features:
1. Test session completion with program context
2. Verify `isProgramDayCompleted()` accurately reflects completion
3. Confirm `getProgramWeekStats()` calculates correctly
4. Validate backward compatibility with non-program sessions
5. Test mixed history (some program sessions, some regular sessions)

## Next Steps

This store is now ready to support:
1. Program week progression logic in `programProgress.js`
2. Program day UI showing completion status
3. Program analytics (completion rates, time spent, etc.)
4. Session history filtering by program

---

**File Modified:** `/Users/gil/git/yoga-app/src/stores/progress.js`
**Lines Changed:** 92-95 (session record), 774-829 (new methods)
**Breaking Changes:** None
**Migration Required:** No
