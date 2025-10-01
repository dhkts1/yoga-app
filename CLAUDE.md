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
4. **State Management**: Zustand stores with automatic localStorage persistence
5. **PWA Setup**: Service worker with offline caching via vite-plugin-pwa

### Key Architectural Patterns

**State Management** (`/src/stores/`)
- `progress.js` - Practice tracking, streaks, mood analytics, session history
- `preferences.js` - User settings and voice coaching preferences
- Both use Zustand with persist middleware for automatic localStorage sync

**Voice Coaching** (`/src/services/voice.js`)
- Web Speech API service with 3 personalities: gentle, motivational, minimal
- Singleton instance with coaching schedules and pose announcements
- Methods: `announceNewPose()`, `giveEncouragement()`, `remindToBreathe()`, `announceSessionComplete()`

**Data Layer** (`/src/data/`)
- `poses.js` - 12 yoga poses with full metadata (instructions, benefits, tips, modifications)
- `sessions.js` - Pre-built sessions (5/10/15 min yoga)
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
  - `completeSession(sessionData)` - Records yoga session
  - `completeBreathingSession(breathingData)` - Records breathing practice
  - `getStreakStatus()` - Current streak info
  - `getPracticeHeatmap()` - Calendar visualization data
  - `getMoodAnalytics(days)` - Mood improvement analytics
  - `getMostPracticedPoses(limit)` - Analytics
  - `getTimeOfDayDistribution()` - Practice patterns
- Auto-persists to localStorage with version migration support

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
  energyImprovement: number
}
```

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
- 12 yoga poses with full metadata
- 4 pre-built sessions + custom session builder
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
│   ├── design-system/         # Complete design system
│   ├── layouts/               # Specialized layouts
│   ├── headers/               # Header components
│   ├── footers/               # Footer components
│   ├── charts/                # Analytics visualizations
│   └── ui/                    # shadcn/ui components
├── screens/
│   ├── Welcome.jsx            # Landing with quick start
│   ├── Sessions.jsx           # Session selection
│   ├── Practice.jsx           # Main practice timer
│   ├── Breathing.jsx          # Breathing selection
│   ├── BreathingPractice.jsx  # Breathing timer
│   ├── Complete.jsx           # Session completion
│   ├── Insights.jsx           # Analytics dashboard
│   └── Settings.jsx           # User preferences
├── data/
│   ├── poses.js               # 12 yoga poses
│   ├── sessions.js            # Pre-built sessions
│   ├── breathing.js           # Breathing exercises
│   └── customSessions.js      # User sessions
├── stores/
│   ├── progress.js            # Practice tracking (Zustand)
│   └── preferences.js         # User settings (Zustand)
├── services/
│   └── voice.js               # Voice coaching service
└── utils/
    ├── recommendations.js     # AI session suggestions
    └── sessionCategories.js   # Session organization
```

## Development Workflow

1. **Adding a new pose**: Update `/src/data/poses.js` with full metadata
2. **Creating a session**: Update `/src/data/sessions.js` with pose sequence
3. **Modifying voice coaching**: Edit `/src/services/voice.js` personality logic
4. **Adding analytics**: Extend `/src/stores/progress.js` with new methods
5. **UI components**: Use design system from `/src/components/design-system/`
6. **Mobile testing**: Use Chrome DevTools at 375px viewport (iPhone SE)

## Testing Approach

- **Mobile responsiveness**: Test at 375px viewport (iPhone SE baseline)
- **Touch interactions**: Verify 44px minimum touch targets
- **Offline functionality**: Test with network disabled
- **Voice coaching**: Test all 3 personalities
- **Analytics**: Verify data persistence across sessions
- **E2E tests**: Playwright for critical user flows

---

*MVP Complete - September 2024*
*Ready for beta testing and user feedback*
