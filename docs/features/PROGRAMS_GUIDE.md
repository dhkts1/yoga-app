# Multi-Week Programs - Complete Guide

## Overview
Multi-week programs provide structured, progressive yoga courses spanning 8-13 weeks. Programs guide practitioners through carefully sequenced learning journeys with weekly focuses, milestone tracking, and progress unlocking.

**Key Characteristics:**
- **Progressive Unlocking**: Weeks unlock sequentially as previous weeks complete
- **Structured Learning**: Each week has specific focus areas and recommended sessions
- **Personal Reflection**: Week-by-week note-taking for practice journaling
- **Milestone Tracking**: Special weeks marked as significant achievements
- **Flexible Pacing**: Start, pause, resume, or reset programs as needed

---

## Program Types (Currently Available)

1. **Iyengar Foundation (13 weeks)** - Beginner-focused alignment and technique
2. **Vinyasa Flow Builder (8 weeks)** - Mixed difficulty dynamic flow practice
3. **Foundations of Breath & Movement (8 weeks)** - Breath-centered Hatha practice
4. **Therapeutic Yoga for Back Care (10 weeks)** - Therapeutic sequences for spinal health
5. **The Eight Limbs Journey (12 weeks)** - Exploration of Patanjali's eight-limbed yoga
6. **Pranayama Mastery (10 weeks)** - Intensive breath control course
7. **Strength & Stability (10 weeks)** - Building physical strength and endurance
8. **Inversion Intensive (12 weeks)** - Advanced inversion practice
9. **Backbending Journey (12 weeks)** - Progressive backbend exploration
10. **Restorative & Therapeutic Practice (13 weeks)** - Deep healing and restoration

---

## User Journey

### 1. Discovery Phase (`/programs`)
- Browse available programs with status badges (Not Started, Active, Paused, Completed)
- View program metadata: duration, style, difficulty, author
- See progress for started programs with completion percentage

### 2. Program Detail (`/programs/:programId`)
- View complete program overview and description
- See all weeks with lock/unlock status
- Visual progress tracking (current week, completion %)
- Program controls: Start, Pause, Resume, Reset
- Sequential week access (must complete previous week to unlock next)

### 3. Week Detail (`/programs/:programId/week/:weekNumber`)
- Week-specific focus and description
- Practice frequency guidance
- Recommended sessions list with metadata
- Personal notes section (auto-saves)
- "Mark Week Complete" button (unlocks next week)
- Session navigation with program context preservation

### 4. Practice Integration
- Sessions launched from week detail carry program context
- Session completion automatically records programId/weekNumber/dayNumber
- Completion data flows to both stores (progress.js and programProgress.js)

### 5. Progress Tracking
- Active program card on Insights dashboard (via ProgramProgressCard)
- Week completion history with session counts
- Personal reflections preserved per week
- Cross-program analytics possible via progress store queries

---

## Data Flow Architecture

### Two-Store System (Separation of Concerns)

**Progress Store** (`progress.js`) - Session Records (Single Source of Truth)
- Stores all completed yoga sessions with optional program fields
- 100% backward compatible: program fields are optional
- Query methods:
  - `getProgramSessions(programId)` - All sessions for a program
  - `getProgramWeekStats(programId, weekNumber, totalDays)` - Week completion stats
  - `isProgramDayCompleted(programId, weekNumber, dayNumber)` - Day completion check

**Program Progress Store** (`programProgress.js`) - Program State Management
- Manages program enrollment and week progression
- No session data duplication - queries progress.js for completion info
- Division of responsibilities:
  - Enrollment: startProgram, pauseProgram, resumeProgram, resetProgram
  - Progression: completeWeek, getCurrentWeek, isWeekCompleted
  - Reflection: addWeekNote, getWeekNote
  - Analytics: getProgramProgress, getProgramStatus, getTotalSessionsCompleted

### Data Consistency Pattern

```javascript
// Session completion (in SessionDetail or Practice screen)
progressStore.completeSession({
  ...sessionData,
  programId: 'iyengar-foundation-13',
  weekNumber: 3,
  dayNumber: 2
});

// Week completion (in WeekDetail screen)
// This queries progress.js to get actual session completion data
const stats = progressStore.getProgramWeekStats(programId, weekNumber);
programProgressStore.completeWeek(programId, weekNumber, stats.completedCount, notes);
```

---

## Component Architecture

### Programs.jsx - Program selection screen
- Lists all available programs with styled badges
- Shows progress for started programs
- Status indicators: active, paused, completed, not-started
- Animated card list with staggered reveals

### ProgramDetail.jsx - Program overview and week list
- Progress visualization with current week indicator
- Program controls (start/pause/resume/reset with confirmation)
- Week cards with lock/unlock status
- Milestone week indicators (Award icon)
- Sequential access enforcement (must complete week N to unlock week N+1)

### WeekDetail.jsx - Weekly practice view
- Week metadata: focus, description, practice frequency
- Guidance notes display (if present in week data)
- Recommended sessions list with navigation
- Personal notes textarea (auto-save on blur)
- "Mark Week Complete" button (requires confirmation)
- Program context passed to session preview via navigation state

### ProgramProgressCard.jsx - Dashboard widget
- Displayed on Insights screen when program is active
- Shows current week, progress percentage, week name/focus
- "Continue Week N" button navigating to program detail
- Style-specific badge colors

---

## State Management Details

### Active Program Rules
- Only one program can be active at a time
- Starting new program automatically deactivates previous
- Active programs can be paused (moved to pausedPrograms array)
- Paused programs can be resumed (restored to active slot)

### Week Completion Logic
- Week completion unlocks next week in sequence
- Completion records: programId, weekNumber, completedAt, sessionsCompleted, notes
- isWeekCompleted() checks completedWeeks array
- Week unlocking: week 1 always unlocked, week N requires week N-1 completed

### Program Status States
- `not-started`: No completion records, not in active/paused
- `active`: Currently in activeProgram slot, not all weeks completed
- `paused`: In pausedPrograms array
- `completed`: All weeks marked complete (completedWeeks.length >= totalWeeks)

### Note Storage
- Notes keyed by 'programId-weekNumber' in weekNotes object
- Notes persist independently of week completion
- Can be added/edited before completing week
- Auto-saved on textarea blur
- Included in completion record when week marked complete

---

## Testing Considerations

### Program Flow Testing
- Verify sequential unlocking (can't skip weeks)
- Test pause/resume preserves current week
- Confirm reset clears all completion data
- Validate only one active program at a time

### Data Integrity Testing
- Session completion with program context saves correctly
- Week stats accurately reflect session completions
- No data duplication between stores
- Backward compatibility: sessions without program fields work normally

### UI/UX Testing
- Lock icons on unavailable weeks
- Milestone week visual indicators
- Progress bars update correctly
- Status badges accurate (active/paused/completed)
- Confirmation dialogs prevent accidental resets/completions

### Mobile Responsiveness
- Program cards render correctly on 375px viewports
- Long program names truncate appropriately (line-clamp-2)
- Badge wrapping on small screens
- Touch targets meet 44px minimum
- Fixed "Complete Week" button accessible on mobile

---

## Development Workflow

### Division of Responsibilities
- `progress.js` stores session completions (single source of truth)
- `programProgress.js` manages program enrollment and week progression

### Backward Compatibility
All program fields are optional in session records

### Querying Pattern
`programProgress.js` queries `progress.js` for completion data (no duplication)

### Adding Program Context to Sessions
Pass programContext via navigation state when launching sessions from WeekDetail

### Session Completion Tracking
When completing a session with program context, pass programId, weekNumber, dayNumber to `completeSession()`

### Week Progress Queries
Use `isProgramDayCompleted()` to check individual session completions within a week

---

**Reference**: See `docs/implementation/PROGRESS_STORE_CHANGES.md` for detailed progress store changes
