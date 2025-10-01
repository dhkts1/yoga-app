# Duplicate Session Bug Fix

## Problem
The Welcome screen was showing duplicate entries of "5-min Morning Energizer" (or any session completed multiple times) in the "Continue your practice" section.

## Root Cause
The `getRecentAllSessions()` function in `/src/stores/progress.js` was returning ALL recent session completion records, without deduplication. If a user completed the same session multiple times, each completion would appear as a separate entry.

### Example Before Fix:
```
practiceHistory: [
  { id: 'session_001', sessionId: 'morning-energizer', completedAt: '2025-10-01T08:00' },
  { id: 'session_002', sessionId: 'morning-energizer', completedAt: '2025-10-01T09:00' },
  { id: 'session_003', sessionId: 'stress-relief', completedAt: '2025-10-01T10:00' }
]

getRecentAllSessions(3) returned all 3 records
→ User sees: "5-min Morning Energizer" twice, "Stress Relief" once
```

## Solution
Modified `getRecentAllSessions()` to deduplicate by:
- **Yoga sessions**: `sessionId` (e.g., 'morning-energizer')
- **Breathing sessions**: `exerciseId` (e.g., 'box-breathing')

The function now:
1. Sorts all sessions by completion time (most recent first)
2. Deduplicates using a Set to track seen session/exercise IDs
3. Returns only the most recent completion of each unique session
4. Stops once it has the requested count of unique sessions

### Example After Fix:
```
practiceHistory: [
  { id: 'session_001', sessionId: 'morning-energizer', completedAt: '2025-10-01T08:00' },
  { id: 'session_002', sessionId: 'morning-energizer', completedAt: '2025-10-01T09:00' },
  { id: 'session_003', sessionId: 'stress-relief', completedAt: '2025-10-01T10:00' }
]

getRecentAllSessions(3) returns:
  { id: 'session_002', sessionId: 'morning-energizer', completedAt: '2025-10-01T09:00' }, // Most recent Morning Energizer
  { id: 'session_003', sessionId: 'stress-relief', completedAt: '2025-10-01T10:00' }

→ User sees: "5-min Morning Energizer" once, "Stress Relief" once
```

## Files Modified
- `/src/stores/progress.js` - Lines 289-315

## Code Changes
```javascript
// BEFORE
getRecentAllSessions: (count = 5) => {
  const state = get();
  const combined = [...state.practiceHistory, ...state.breathingHistory]
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, count);
  return combined;
},

// AFTER
getRecentAllSessions: (count = 5) => {
  const state = get();
  const combined = [...state.practiceHistory, ...state.breathingHistory]
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  // Deduplicate by sessionId (yoga) or exerciseId (breathing)
  const seen = new Set();
  const unique = [];

  for (const session of combined) {
    const key = session.type === 'breathing'
      ? `breathing_${session.exerciseId}`
      : `yoga_${session.sessionId}`;

    if (!seen.has(key)) {
      seen.add(key);
      unique.push(session);

      // Stop once we have enough unique sessions
      if (unique.length >= count) break;
    }
  }

  return unique;
},
```

## Test Scenarios

### Scenario 1: Multiple completions of same session
1. Complete "5-min Morning Energizer" three times
2. Navigate to Welcome screen
3. **Expected**: Only one "5-min Morning Energizer" entry appears, showing the most recent completion

### Scenario 2: Mixed sessions
1. Complete "Morning Energizer" twice
2. Complete "Stress Relief" once
3. Complete "Box Breathing" once
4. Navigate to Welcome screen
5. **Expected**: Up to 2 unique sessions shown (as per `.slice(0, 2)` in Welcome.jsx)

### Scenario 3: Yoga + Breathing mix
1. Complete "Morning Energizer" twice
2. Complete "4-7-8 Breathing" twice
3. **Expected**: Both session types appear once each

## Behavior Preserved
- Sessions are still sorted by most recent completion
- The "last practiced" timestamp shows the actual most recent completion
- All historical data remains intact in `practiceHistory` and `breathingHistory`
- Only the display logic is changed for user experience

## Related Functionality
This fix complements the new `getLastSession()` function used for Quick Start, which returns the absolute most recent session (including duplicates) for resuming practice.
