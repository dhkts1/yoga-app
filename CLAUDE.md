# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
**Name**: Mindful Yoga App
**Type**: Mobile-first React PWA with offline support
**Status**: MVP Complete - Ready for Beta Testing
**Philosophy**: "Breathe First, Features Later" - Simple, calming yoga practice app

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (usually http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (ESLint configured for React)
npm run lint

# Format code with Prettier
npm run format

# Run E2E tests with Playwright
npm run test:e2e
npm run test:e2e:ui      # Interactive UI mode
npm run test:e2e:debug   # Debug mode
npm run test:e2e:report  # View test report
```

## High-Level Architecture

### Core Application Flow
1. **App.jsx** - Main router with animated route transitions (Framer Motion)
2. **AppLayout Pattern** - Fixed header/footer with scrollable content (mobile-first)
3. **Practice Flow**: Welcome → Sessions → Practice (with timer) → Complete → Insights
4. **Program Flow**: Programs → Program Detail → Week Detail → Session Preview → Practice → Complete
5. **State Management**: Zustand stores with automatic localStorage persistence
6. **PWA Setup**: Service worker with offline caching via vite-plugin-pwa

### Key Architectural Patterns

**State Management** (`/src/stores/`)
- `progress.js` - Practice tracking, streaks, mood analytics, session history (with optional program support)
- `programProgress.js` - Multi-week program enrollment, week progression, and completion tracking
- `preferences.js` - User settings and voice coaching preferences
- All use Zustand with persist middleware for automatic localStorage sync

**Voice Coaching** (`/src/services/voice.js`)
- Web Speech API service with 3 personalities: gentle, motivational, minimal
- Singleton instance with coaching schedules and pose announcements
- Methods: `announceNewPose()`, `giveEncouragement()`, `remindToBreathe()`, `announceSessionComplete()`

**Data Layer** (`/src/data/`)
- `poses.js` - 12 yoga poses with full metadata (instructions, benefits, tips, modifications)
- `poses_extended.js` - Extended pose library for programs (additional poses beyond MVP)
- `sessions.js` - Pre-built sessions (5/10/15 min yoga)
- `programs.js` - Multi-week structured programs (e.g., 13-week Iyengar Foundation)
- `breathing.js` - Breathing exercises (Box, 4-7-8, Energizing, Alternate Nostril)
- `customSessions.js` - User-created custom sessions

**Layout System** (`/src/components/`)
- `AppLayout.jsx` - Consistent mobile-first layout with fixed header/footer
- `/layouts/` - Specialized layouts (DefaultLayout, PracticeLayout, FullscreenLayout)
- `/headers/` - Reusable header components
- `/footers/` - Reusable footer components

**Design System** (`/src/components/design-system/`)
- Complete token-based system: colors, spacing, typography, animations
- Components: Button, Card, Typography, Container, Progress, Overlay, Icon
- Mobile-first responsive design (320px minimum)
- Tailwind CSS extended with custom design tokens

### Critical Services & Stores

**Progress Store** (`/src/stores/progress.js`)
- Tracks: streaks, session history, total practice time, mood tracking
- Key methods:
  - `completeSession(sessionData)` - Records yoga session (accepts optional programId/weekNumber/dayNumber)
  - `completeBreathingSession(breathingData)` - Records breathing practice
  - `getStreakStatus()` - Current streak info
  - `getPracticeHeatmap()` - Calendar visualization data
  - `getMoodAnalytics(days)` - Mood improvement analytics
  - `getMostPracticedPoses(limit)` - Analytics
  - `getTimeOfDayDistribution()` - Practice patterns
  - `getProgramSessions(programId)` - All sessions for a program
  - `getProgramWeekStats(programId, weekNumber, totalDays)` - Week completion stats
  - `isProgramDayCompleted(programId, weekNumber, dayNumber)` - Day completion check
- Auto-persists to localStorage with version migration support
- 100% backward compatible: program fields are optional

**Program Progress Store** (`/src/stores/programProgress.js`)
- Manages multi-week program enrollment and progression
- Key methods:
  - `startProgram(programId)` - Begin a new program at week 1
  - `resumeProgram(programId)` - Resume a paused program
  - `pauseProgram()` - Pause current active program
  - `completeWeek(weekNumber, sessionCount, notes)` - Mark week complete and unlock next
  - `saveWeekNotes(programId, weekNumber, notes)` - Save reflections
  - `getActiveProgram()` - Current program and week
  - `isProgramComplete(programId, totalWeeks)` - Check completion status
- Division of responsibilities:
  - `progress.js` stores session completions (single source of truth)
  - `programProgress.js` queries `progress.js` for completion data
  - No data duplication between stores

**Voice Service** (`/src/services/voice.js`)
- Web Speech API wrapper for coaching
- Personality system: gentle (default), motivational, minimal
- Configurable: volume, rate, pitch
- Methods:
  - `announceSessionStart(sessionName)` - Welcome message
  - `announceNewPose(poseName, instructions)` - Pose introduction
  - `giveFormCorrection(commonMistakes)` - Helpful corrections
  - `giveEncouragement()` - Random encouragement
  - `remindToBreathe()` - Breathing reminders
  - `announceSessionComplete()` - Completion message
  - `setPersonality(personality)` - Change coaching style
  - `setEnabled(boolean)` - Toggle on/off

### Mobile-First Design Principles

**Core Constraints**
- Mobile baseline: 375px minimum viewport (iPhone SE)
- No horizontal scrolling
- Touch-first interactions (tap to select, no drag-and-drop)
- Safe area support for iOS notch/home indicator

**AppLayout Component** (`/src/components/AppLayout.jsx`)
- Fixed header and footer with scrollable content area
- Automatic safe area padding: `env(safe-area-inset-*)`
- Flexible configuration: optional header/footer per screen
- Eliminates layout shift during navigation

**Interaction Patterns**
- Minimum 44px touch targets
- Bottom actions in fixed footer for thumb reach
- Tap-to-select primary interaction method
- Fixed vs scrollable: clear separation of UI layers

### Route Structure

```
/                          Welcome screen with quick start
/sessions                  Session selection (yoga + breathing)
/sessions/:id/preview      Session detail view
/sessions/builder          Custom session builder
/programs                  Multi-week program selection
/programs/:id              Program detail view
/programs/:id/week/:num    Week detail view with daily sessions
/practice                  Main practice timer screen
/breathing                 Breathing exercise selection
/breathing/practice        Breathing practice screen
/complete                  Session completion
/insights (or /progress)   Analytics dashboard
/settings                  User preferences
/poses                     Pose library
```

### Data Models

**Pose Object**
```javascript
{
  id: string,
  nameEnglish: string,
  nameSanskrit: string,
  category: 'standing' | 'seated' | 'balance' | 'flexibility' | 'strength',
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  duration: number, // seconds
  instructions: string[],
  benefits: string[],
  tips: string[],
  commonMistakes: string[],
  modifications: { beginner, advanced, pregnancy }
}
```

**Session Object**
```javascript
{
  id: string,
  name: string,
  duration: number, // minutes
  poses: Array<{ poseId, duration, transition }>,
  category: string,
  difficulty: string
}
```

**Program Object**
```javascript
{
  id: string,
  name: string,
  description: string,
  style: 'iyengar' | 'vinyasa' | 'hatha' | 'restorative',
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed',
  totalWeeks: number,
  author: string, // optional
  weeks: Array<{
    weekNumber: number,
    name: string,
    focus: string,
    description: string,
    recommendedSessions: string[], // session IDs
    practiceFrequency: string,
    notes: string, // optional
    isMilestone: boolean
  }>
}
```

**Practice Session Record** (stored in progress)
```javascript
{
  id: string,
  sessionId: string,
  sessionName: string,
  duration: number, // minutes
  completedAt: ISO date string,
  poses: array,
  preMood: 1-5,
  postMood: 1-5,
  preEnergy: 1-5,
  postEnergy: 1-5,
  moodImprovement: number,
  energyImprovement: number,
  // Optional program fields (backward compatible)
  programId: string | null,    // e.g., 'iyengar-foundation-13'
  weekNumber: number | null,   // e.g., 1, 2, 3
  dayNumber: number | null     // e.g., 1-7
}
```

**Program Progress State** (programProgress store)
```javascript
{
  activeProgram: {
    programId: string,
    startedAt: ISO date string,
    currentWeek: number  // 1-indexed
  } | null,

  completedWeeks: [{
    programId: string,
    weekNumber: number,
    completedAt: ISO date string,
    sessionsCompleted: number,
    notes: string | undefined
  }],

  weekNotes: {
    'programId-weekNumber': 'note text'
  },

  pausedPrograms: [{
    programId: string,
    pausedAt: ISO date string,
    weekNumber: number
  }]
}
```

## Multi-Week Programs Feature

### Overview
Multi-week programs provide structured, progressive yoga courses spanning 8-13 weeks. Programs guide practitioners through carefully sequenced learning journeys with weekly focuses, milestone tracking, and progress unlocking.

**Key Characteristics:**
- **Progressive Unlocking**: Weeks unlock sequentially as previous weeks complete
- **Structured Learning**: Each week has specific focus areas and recommended sessions
- **Personal Reflection**: Week-by-week note-taking for practice journaling
- **Milestone Tracking**: Special weeks marked as significant achievements
- **Flexible Pacing**: Start, pause, resume, or reset programs as needed

### Program Types (Currently Available)
1. **Iyengar Foundation (13 weeks)** - Beginner-focused alignment and technique
2. **Vinyasa Flow Builder (8 weeks)** - Mixed difficulty dynamic flow practice

### User Journey

**1. Discovery Phase** (`/programs`)
- Browse available programs with status badges (Not Started, Active, Paused, Completed)
- View program metadata: duration, style, difficulty, author
- See progress for started programs with completion percentage

**2. Program Detail** (`/programs/:programId`)
- View complete program overview and description
- See all weeks with lock/unlock status
- Visual progress tracking (current week, completion %)
- Program controls: Start, Pause, Resume, Reset
- Sequential week access (must complete previous week to unlock next)

**3. Week Detail** (`/programs/:programId/week/:weekNumber`)
- Week-specific focus and description
- Practice frequency guidance
- Recommended sessions list with metadata
- Personal notes section (auto-saves)
- "Mark Week Complete" button (unlocks next week)
- Session navigation with program context preservation

**4. Practice Integration**
- Sessions launched from week detail carry program context
- Session completion automatically records programId/weekNumber/dayNumber
- Completion data flows to both stores (progress.js and programProgress.js)

**5. Progress Tracking**
- Active program card on Insights dashboard (via ProgramProgressCard)
- Week completion history with session counts
- Personal reflections preserved per week
- Cross-program analytics possible via progress store queries

### Data Flow Architecture

**Two-Store System (Separation of Concerns):**

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

**Data Consistency Pattern:**
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

### Component Architecture

**Programs.jsx** - Program selection screen
- Lists all available programs with styled badges
- Shows progress for started programs
- Status indicators: active, paused, completed, not-started
- Animated card list with staggered reveals

**ProgramDetail.jsx** - Program overview and week list
- Progress visualization with current week indicator
- Program controls (start/pause/resume/reset with confirmation)
- Week cards with lock/unlock status
- Milestone week indicators (Award icon)
- Sequential access enforcement (must complete week N to unlock week N+1)

**WeekDetail.jsx** - Weekly practice view
- Week metadata: focus, description, practice frequency
- Guidance notes display (if present in week data)
- Recommended sessions list with navigation
- Personal notes textarea (auto-save on blur)
- "Mark Week Complete" button (requires confirmation)
- Program context passed to session preview via navigation state

**ProgramProgressCard.jsx** - Dashboard widget
- Displayed on Insights screen when program is active
- Shows current week, progress percentage, week name/focus
- "Continue Week N" button navigating to program detail
- Style-specific badge colors

### State Management Details

**Active Program Rules:**
- Only one program can be active at a time
- Starting new program automatically deactivates previous
- Active programs can be paused (moved to pausedPrograms array)
- Paused programs can be resumed (restored to active slot)

**Week Completion Logic:**
- Week completion unlocks next week in sequence
- Completion records: programId, weekNumber, completedAt, sessionsCompleted, notes
- isWeekCompleted() checks completedWeeks array
- Week unlocking: week 1 always unlocked, week N requires week N-1 completed

**Program Status States:**
- `not-started`: No completion records, not in active/paused
- `active`: Currently in activeProgram slot, not all weeks completed
- `paused`: In pausedPrograms array
- `completed`: All weeks marked complete (completedWeeks.length >= totalWeeks)

**Note Storage:**
- Notes keyed by 'programId-weekNumber' in weekNotes object
- Notes persist independently of week completion
- Can be added/edited before completing week
- Auto-saved on textarea blur
- Included in completion record when week marked complete

### Testing Considerations

**Program Flow Testing:**
- Verify sequential unlocking (can't skip weeks)
- Test pause/resume preserves current week
- Confirm reset clears all completion data
- Validate only one active program at a time

**Data Integrity Testing:**
- Session completion with program context saves correctly
- Week stats accurately reflect session completions
- No data duplication between stores
- Backward compatibility: sessions without program fields work normally

**UI/UX Testing:**
- Lock icons on unavailable weeks
- Milestone week visual indicators
- Progress bars update correctly
- Status badges accurate (active/paused/completed)
- Confirmation dialogs prevent accidental resets/completions

**Mobile Responsiveness:**
- Program cards render correctly on 375px viewports
- Long program names truncate appropriately (line-clamp-2)
- Badge wrapping on small screens
- Touch targets meet 44px minimum
- Fixed "Complete Week" button accessible on mobile

## Tech Stack

- **Framework**: React 18 + Vite 5
- **Routing**: React Router v7.9.3
- **State**: Zustand 5.0.8 with persist middleware
- **Styling**: Tailwind CSS 3.4.4 + custom design system
- **Animations**: Framer Motion 12.23.22
- **Voice**: Web Speech API + react-text-to-speech
- **Icons**: Lucide React 0.419.0
- **PWA**: vite-plugin-pwa 1.0.3
- **Build**: Vite with manual chunk splitting
- **Code Quality**: ESLint + Prettier with Tailwind plugin

## Important Notes

- **No user accounts** - Everything stored locally via localStorage
- **JavaScript files** - Using .jsx (not TypeScript) for rapid prototyping
- **Mobile-first** - All features optimized for 375px baseline
- **Abstract illustrations** - SVG geometric shapes (no photos)
- **Zero ESLint errors** - Code quality enforced
- **PWA enabled** - Full offline functionality
- **Mood tracking optional** - Users can skip pre/post tracking
- **Voice coaching toggleable** - Can be disabled during practice

## Key Features Status

✅ **Completed MVP+**
- 12 yoga poses with full metadata (+ extended pose library for programs)
- 4 pre-built sessions + custom session builder
- Multi-week programs (8-13 week structured courses)
- Progressive unlocking system with milestone tracking
- Visual timer with pause/resume and auto-advance
- Progress tracking with streak counter
- Mood tracking (pre/post practice)
- Practice insights dashboard with analytics
- Voice coaching (3 personalities)
- Breathing exercises with visual guide
- PWA with offline support
- Mobile-responsive AppLayout (320px+)
- ESLint compliance (0 errors, 0 warnings)

## File Structure Highlights

```
src/
├── App.jsx                    # Main router with animated transitions
├── components/
│   ├── AppLayout.jsx          # Fixed header/footer layout
│   ├── ProgramProgressCard.jsx # Active program widget (Insights dashboard)
│   ├── design-system/         # Complete design system
│   ├── layouts/               # Specialized layouts
│   ├── headers/               # Header components
│   ├── footers/               # Footer components
│   ├── charts/                # Analytics visualizations
│   └── ui/                    # shadcn/ui components
├── screens/
│   ├── Welcome.jsx            # Landing with quick start
│   ├── Sessions.jsx           # Session selection
│   ├── Programs.jsx           # Multi-week program selection
│   ├── ProgramDetail.jsx      # Program overview with week list
│   ├── WeekDetail.jsx         # Week-specific view with sessions
│   ├── Practice.jsx           # Main practice timer
│   ├── Breathing.jsx          # Breathing selection
│   ├── BreathingPractice.jsx  # Breathing timer
│   ├── Complete.jsx           # Session completion
│   ├── Insights.jsx           # Analytics dashboard
│   └── Settings.jsx           # User preferences
├── data/
│   ├── poses.js               # 12 yoga poses (MVP)
│   ├── poses_extended.js      # Extended pose library for programs
│   ├── sessions.js            # Pre-built sessions
│   ├── programs.js            # Multi-week programs (Iyengar, Vinyasa)
│   ├── breathing.js           # Breathing exercises
│   └── customSessions.js      # User sessions
├── stores/
│   ├── progress.js            # Practice tracking (Zustand) - session records
│   ├── programProgress.js     # Program progression (Zustand) - enrollment/weeks
│   └── preferences.js         # User settings (Zustand)
├── services/
│   └── voice.js               # Voice coaching service
└── utils/
    ├── recommendations.js     # AI session suggestions
    └── sessionCategories.js   # Session organization
```

## Development Workflow

1. **Adding a new pose**: Update `/src/data/poses.js` or `/src/data/poses_extended.js` with full metadata
2. **Creating a session**: Update `/src/data/sessions.js` with pose sequence
3. **Creating a program**: Update `/src/data/programs.js` with week-by-week structure
   - Define program metadata: name, description, style, difficulty, totalWeeks, author
   - Create weeks array with: weekNumber, name, focus, description, recommendedSessions[], practiceFrequency, notes, isMilestone
   - Ensure recommended sessions exist in sessions.js
4. **Modifying voice coaching**: Edit `/src/services/voice.js` personality logic
5. **Adding analytics**: Extend `/src/stores/progress.js` with new methods
6. **UI components**: Use design system from `/src/components/design-system/`
7. **Mobile testing**: Use Chrome DevTools at 375px viewport (iPhone SE)

### Program Feature Development
- **Division of Responsibilities**: `progress.js` stores session completions (single source of truth), `programProgress.js` manages program enrollment and week progression
- **Backward Compatibility**: All program fields are optional in session records
- **Querying Pattern**: `programProgress.js` queries `progress.js` for completion data (no duplication)
- **Adding Program Context to Sessions**: Pass programContext via navigation state when launching sessions from WeekDetail
- **Session Completion Tracking**: When completing a session with program context, pass programId, weekNumber, dayNumber to `completeSession()`
- **Week Progress Queries**: Use `isProgramDayCompleted()` to check individual session completions within a week
- **See**: `PROGRESS_STORE_CHANGES.md` for detailed integration guide

## Testing Approach

- **Mobile responsiveness**: Test at 375px viewport (iPhone SE baseline)
- **Touch interactions**: Verify 44px minimum touch targets
- **Offline functionality**: Test with network disabled
- **Voice coaching**: Test all 3 personalities
- **Analytics**: Verify data persistence across sessions
- **E2E tests**: Playwright for critical user flows
- **Program flows**: Test sequential unlocking, pause/resume, reset with confirmation
- **Data integrity**: Verify program context in session completions, no store duplication
- **Week progress**: Confirm session completion tracking within weeks, accurate progress bars

---

*MVP Complete - September 2024*
*Ready for beta testing and user feedback*
