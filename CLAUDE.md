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
  - `pauseProgram(programId)` - Pause current active program
  - `completeWeek(programId, weekNumber, sessionCount, notes)` - Mark week complete and unlock next
  - `addWeekNote(programId, weekNumber, notes)` - Save reflections
  - `getCurrentWeek(programId)` - Get current week number
  - `getProgramStatus(programId, totalWeeks)` - Check program status
  - `isWeekCompleted(programId, weekNumber)` - Check if week is completed
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
3. **Foundations of Breath & Movement (8 weeks)** - Breath-centered Hatha practice
4. **Therapeutic Yoga for Back Care (10 weeks)** - Therapeutic sequences for spinal health
5. **The Eight Limbs Journey (12 weeks)** - Exploration of Patanjali's eight-limbed yoga
6. **Pranayama Mastery (10 weeks)** - Intensive breath control course
7. **Strength & Stability (10 weeks)** - Building physical strength and endurance
8. **Inversion Intensive (12 weeks)** - Advanced inversion practice
9. **Backbending Journey (12 weeks)** - Progressive backbend exploration
10. **Restorative & Therapeutic Practice (13 weeks)** - Deep healing and restoration

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
- **Testing**: Playwright 1.55.1 for E2E tests

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
- Multi-week programs (10 programs ranging from 8-13 weeks)
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

## Testing Approach

### E2E Testing with Playwright
- **Location**: `/tests/e2e/` directory
- **Config**: `playwright.config.js` configured for mobile-first testing
- **Viewport**: Tests run at iPhone 13 dimensions (375px baseline)
- **Server**: Auto-starts dev server on `http://localhost:5173`
- **Timeout**: 20 seconds per test for fast feedback
- **Parallelization**: Tests run in parallel for speed

### Test Coverage Areas
- **Mobile responsiveness**: Test at 375px viewport (iPhone SE baseline)
- **Touch interactions**: Verify 44px minimum touch targets
- **Offline functionality**: Test with network disabled
- **Voice coaching**: Test all 3 personalities
- **Analytics**: Verify data persistence across sessions
- **E2E tests**: Playwright for critical user flows
- **Program flows**: Test sequential unlocking, pause/resume, reset with confirmation
- **Data integrity**: Verify program context in session completions, no store duplication
- **Week progress**: Confirm session completion tracking within weeks, accurate progress bars

### Running Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Debug tests
npm run test:e2e:debug

# View HTML test report
npm run test:e2e:report
```

## Building Android APK

### Overview
The app can be packaged as an Android APK using Capacitor, which wraps the PWA in a native Android container. This allows distribution via APK file sharing or Google Play Store.

### Prerequisites
- **Java JDK 17**: Required for Android build (verify with `java -version`)
- **Android SDK**: Optional for command-line builds (Android Studio includes it)
- **Node.js**: Already installed for web development

### Initial Setup (One-time)

**1. Install Capacitor dependencies:**
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

**2. Initialize Capacitor:**
```bash
npx cap init "Mindful Yoga" "com.mindfulyoga.app" --web-dir=dist
```

**3. Build the web app:**
```bash
npm run build
```

**4. Add Android platform:**
```bash
npx cap add android
```

This creates an `android/` directory with the full Android Studio project (gitignored).

**5. Sync web assets:**
```bash
npx cap sync android
```

### Build Process

**Option 1: Command Line (Quick Debug Build)**
```bash
cd android
./gradlew assembleDebug
```
- Output: `android/app/build/outputs/apk/debug/app-debug.apk`
- Ready to install on devices via USB or file sharing

**Option 2: Android Studio (Full IDE)**
```bash
npx cap open android
```
Then in Android Studio:
- Build → Build Bundle(s) / APK(s) → Build APK(s)
- More control over build variants and signing

**Option 3: Release Build (Signed for Distribution)**
```bash
cd android
./gradlew assembleRelease
```
- Requires keystore setup for signing (see below)
- Output: `android/app/build/outputs/apk/release/app-release.apk`

### Installing APK on Device

**Via USB (ADB):**
```bash
cd android
./gradlew installDebug
```
- Requires USB debugging enabled on Android device
- Automatic install when connected

**Via File Transfer:**
1. Copy APK from `android/app/build/outputs/apk/debug/app-debug.apk`
2. Transfer to Android device (email, cloud storage, USB)
3. Open APK in file manager to install
4. May need to enable "Install from unknown sources"

### Updating the App

**When you make changes to web code:**
```bash
# 1. Rebuild web assets
npm run build

# 2. Sync to Android project
npx cap sync android

# 3. Rebuild APK
cd android
./gradlew assembleDebug
```

**When you modify Android native code:**
```bash
# Just rebuild
cd android
./gradlew assembleDebug
```

### Configuration Files

**capacitor.config.json** (Project root)
```json
{
  "appId": "com.mindfulyoga.app",
  "appName": "Mindful Yoga",
  "webDir": "dist"
}
```

**android/app/src/main/res/values/strings.xml**
- App name and package configuration
- Auto-generated, generally no changes needed

**android/variables.gradle**
- SDK versions and dependency versions
- Default settings work for most cases

### Java Version Compatibility Fix

**Issue:** Capacitor requires Java 21 by default, but Java 17 is more widely installed.

**Solution Applied:**
Added to `android/build.gradle`:
```gradle
subprojects {
    afterEvaluate { project ->
        if (project.hasProperty("android")) {
            android {
                compileOptions {
                    sourceCompatibility JavaVersion.VERSION_17
                    targetCompatibility JavaVersion.VERSION_17
                }
            }
        }
    }
}
```

This overrides all subprojects to use Java 17 compatibility.

### Release Build Setup (For Production)

**1. Generate signing keystore:**
```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -alias yoga-app -keyalg RSA -keysize 2048 -validity 10000
```

**2. Create `android/keystore.properties`:**
```properties
storeFile=my-release-key.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=yoga-app
keyPassword=YOUR_KEY_PASSWORD
```

**3. Update `android/app/build.gradle`:**
Add before `android` block:
```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Add to `android.buildTypes.release`:
```gradle
release {
    if (keystorePropertiesFile.exists()) {
        signingConfig signingConfigs.release
    }
    minifyEnabled false
    proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
}
```

**4. Build signed release APK:**
```bash
cd android
./gradlew assembleRelease
```

### Troubleshooting

**Build fails with "invalid source release: 21":**
- Your system has Java 17 but Capacitor expects Java 21
- Solution applied: Java 17 compatibility override in build.gradle

**"flatDir should be avoided" warnings:**
- Safe to ignore, this is a Capacitor default configuration

**APK won't install on device:**
- Enable "Install from unknown sources" in Android settings
- For release builds, ensure APK is properly signed

**Changes not appearing in APK:**
- Run `npm run build` first
- Then `npx cap sync android`
- Then rebuild APK

### Directory Structure

```
android/                              # Android Studio project (gitignored)
├── app/
│   ├── src/main/
│   │   ├── assets/public/           # Web app assets (synced from dist/)
│   │   ├── res/                     # Android resources (icons, strings)
│   │   ├── AndroidManifest.xml      # Android app manifest
│   │   └── java/                    # Java/Kotlin code (minimal)
│   ├── build.gradle                 # App-level build config
│   └── capacitor.build.gradle       # Capacitor auto-generated config
├── build.gradle                     # Project-level build config
├── variables.gradle                 # SDK versions and dependencies
└── gradle/                          # Gradle wrapper

capacitor.config.json                # Capacitor configuration (not gitignored)
```

### Notes

- **PWA features preserved**: Offline support, service worker, localStorage all work
- **No code changes needed**: Same React app runs in native wrapper
- **Automatic updates**: For debug builds, just rebuild and reinstall
- **Native plugins available**: Can add Capacitor plugins for camera, GPS, etc.
- **App store ready**: Release builds can be submitted to Google Play Store

## Additional Documentation

### Recent Refactoring (October 2025)
The codebase underwent significant refactoring to improve maintainability:

- **REFACTORING_SUMMARY.md** - Comprehensive overview (208+ lines eliminated)
- **NEW_APIS.md** - Quick reference for new components, hooks, and utilities
- **DESIGN_SYSTEM_COMPONENTS.md** - Design system component usage guide
- **src/hooks/README.md** - Custom hooks API reference

Key improvements:
- 4 new design system components (Badge, Stat, Tab, EmptyState)
- Badge utility system eliminating 114 lines of duplication
- localStorage hooks eliminating 94 lines of duplication
- Centralized design tokens for consistent styling
- Mobile-first patterns across all new components

---

*MVP Complete - September 2024*
*Ready for beta testing and user feedback*
