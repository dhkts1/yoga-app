# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Name**: Mindful Yoga App
**Type**: Mobile-first React PWA with offline support
**Status**: MVP Complete - Ready for Beta Testing
**Philosophy**: "Breathe First, Features Later" - Simple, calming yoga practice app

---

## Quick Start

### Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint check (includes Tailwind CSS linting)
npm run format       # Prettier formatting (with Tailwind plugin)

# Testing
npm run test:e2e           # Run E2E tests with Playwright
npm run test:e2e:ui        # Interactive test UI
npm run test:e2e:debug     # Debug tests step-by-step
npm run test:e2e:report    # View HTML test report
npm run test:a11y          # Run accessibility tests
```

### Core Application Flow

1. **Practice Flow**: Welcome → Sessions → Practice → Complete → Insights
2. **Program Flow**: Programs → Program Detail → Week Detail → Practice → Complete
3. **State**: Zustand stores with localStorage persistence
4. **Routing**: React Router with animated transitions (Framer Motion)
5. **Layout**: AppLayout pattern (fixed header/footer, scrollable content)

---

## Architecture

### Tech Stack

- **Framework**: React 18 + Vite 5
- **Routing**: React Router v7.9.3
- **State**: Zustand 5.0.8 with persist middleware
- **Styling**: Tailwind CSS 3.4.4 + custom design system
- **Animations**: Framer Motion 12.23.22
- **Voice**: Web Speech API
- **Icons**: Lucide React 0.419.0
- **PWA**: vite-plugin-pwa 1.0.3
- **Testing**: Playwright 1.55.1

### State Management (`/src/stores/`)

**progress.js** - Practice tracking (Single Source of Truth)
- Session history, streaks, mood analytics
- Program session tracking (optional programId/weekNumber/dayNumber fields)
- Key methods: `completeSession()`, `getStreakStatus()`, `getProgramWeekStats()`
- Auto-persists to localStorage with version migration (`yoga-progress` key)
- 100% backward compatible
- Includes localStorage quota exceeded handling

**programProgress.js** - Multi-week program enrollment
- Active program management, week progression
- Queries `progress.js` for completion data (no duplication)
- Key methods: `startProgram()`, `completeWeek()`, `pauseProgram()`
- Persists to localStorage (`yoga-program-progress` key)

**preferences.js** - User settings
- Voice coaching preferences, app settings
- Persisted with Zustand middleware (`yoga-preferences` key)

### Data Layer (`/src/data/`)

- `poses.js` - 12 core yoga poses with full metadata
- `poses_extended.js` - Extended library for programs
- `sessions.js` - Pre-built sessions (5/10/15 min)
- `programs.js` - Multi-week structured programs (8-13 weeks)
- `breathing.js` - Breathing exercises (Box, 4-7-8, etc.)
- `customSessions.js` - User-created sessions

### Design System (`/src/components/design-system/`)

Complete token-based system with:
- **Layout**: ContentBody - Unified content wrapper for all screens
- **Components**: Badge, Button, Card, Stat, Tab, EmptyState, Typography
- **Mobile-first responsive** (375px baseline)
- **Calming sage/gold palette**
- **44px minimum touch targets**
- See: `/docs/NEW_APIS.md` for quick reference

**Design System Color Tokens** (MUST USE - No hardcoded Tailwind colors):
- **State colors**: `state-success`, `state-warning`, `state-error`, `state-info`
- **Semantic colors**: `primary`, `accent`, `destructive`, `muted`, `foreground`, `background`
- **Palette colors**: `sage-*`, `cream-*`, `gold-*`
- **UI tokens**: `border`, `input`, `popover`, `ring`, `card`
- **Never use**: `green-*`, `red-*`, `blue-*`, `amber-*`, `gray-*`, `purple-*`, etc.
- Theme-aware: All tokens automatically support light/dark mode

**ContentBody Usage:**
```jsx
// Centered content (Welcome, Practice, Complete)
<ContentBody size="sm" centered>
  {content}
</ContentBody>

// Scrolling lists (Sessions, Programs)
<ContentBody size="md" spacing="md">
  {list}
</ContentBody>

// Wide dashboards (Insights, Settings)
<ContentBody size="lg" spacing="lg">
  {dashboard}
</ContentBody>
```

### Custom Hooks (`/src/hooks/`)

- `usePracticeTimer.js` - Timer logic with pause/resume
- `useMoodTracking.js` - Pre/post practice mood flow
- `useLocalStorage.js` - Generic localStorage with multi-tab sync
- `useCustomSessions.js` - CRUD for custom sessions
- `useCollapsibleSections.js` - Accordion state management
- See: `/docs/hooks/README.md` for full documentation

---

## Routes

```
/                          Welcome screen
/sessions                  Session selection
/sessions/:id/preview      Session detail
/sessions/builder          Custom session builder
/programs                  Multi-week programs
/programs/:id              Program detail
/programs/:id/week/:num    Week detail
/practice                  Practice timer
/breathing                 Breathing exercises
/breathing/practice        Breathing practice
/complete                  Session completion
/insights                  Analytics dashboard
/settings                  User preferences
/poses                     Pose library
```

---

## Data Models

### Session Record (stored in progress.js)
```javascript
{
  id: string,
  sessionId: string,
  sessionName: string,
  duration: number,
  completedAt: ISO string,
  poses: array,
  preMood: 1-5,
  postMood: 1-5,
  preEnergy: 1-5,
  postEnergy: 1-5,
  // Optional program fields (backward compatible)
  programId: string | null,
  weekNumber: number | null,
  dayNumber: number | null
}
```

### Program Object
```javascript
{
  id: string,
  name: string,
  description: string,
  style: 'iyengar' | 'vinyasa' | 'hatha' | 'restorative',
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed',
  totalWeeks: number,
  weeks: Array<{
    weekNumber: number,
    name: string,
    focus: string,
    recommendedSessions: string[]
  }>
}
```

---

## Development Workflow

### Adding Features

1. **New pose**: Update `/src/data/poses.js` with metadata
2. **New session**: Add to `/src/data/sessions.js`
3. **New program**: Add to `/src/data/programs.js` with week structure
4. **UI components**: Use design system from `/src/components/design-system/`
5. **Analytics**: Extend `/src/stores/progress.js`

### Multi-Week Programs

- **Data Flow**: `progress.js` stores completions → `programProgress.js` manages enrollment
- **Completion**: Pass programId/weekNumber/dayNumber to `completeSession()`
- **Queries**: Use `getProgramWeekStats()` for week progress
- **See**: `/docs/features/PROGRAMS_GUIDE.md` for complete guide

### Git Hooks (Code Quality)

**Pre-commit Hook** (via Husky + lint-staged)
- Automatically runs before every `git commit`
- **Step 1**: Lints staged files with ESLint (auto-fixes when possible)
- **Step 2**: Formats staged files with Prettier
- **Step 3**: Runs all tests (`npm test` with dot reporter)
- Blocks commits if ESLint errors or tests fail

**Configuration:**
- `.husky/pre-commit` - Main hook script
- `package.json` → `lint-staged` - File patterns and commands
- Only processes staged files (fast & efficient)

**What happens on commit:**
```bash
git commit -m "Your message"
# → Runs ESLint --fix on *.{js,jsx}
# → Runs Prettier --write on *.{js,jsx}
# → Runs npm test (all unit/integration tests)
# → Commits if all checks pass
```

**Benefits:**
- Zero ESLint errors in codebase at all times
- All tests pass before any commit
- Consistent code formatting automatically
- Catch issues before code review
- No manual `npm run lint` or `npm test` needed

**See:** `/docs/GIT_HOOKS.md` for complete documentation and troubleshooting

### Mobile-First Design

- **Baseline**: 375px viewport (iPhone SE)
- **Touch targets**: 44px minimum
- **Layout**: Fixed header/footer, scrollable content (AppLayout) + ContentBody for consistent body layout
- **Body Wrapper**: ContentBody component provides responsive max-widths (sm: 384px, md: 672px, lg: 896px)
- **Safe areas**: iOS notch support via `env(safe-area-inset-*)`
- **Testing**: Chrome DevTools at 375px

---

## File Structure

```
src/
├── App.jsx                    # Main router
├── components/
│   ├── AppLayout.jsx          # Fixed header/footer layout
│   ├── design-system/         # Design tokens & components
│   ├── layouts/               # Specialized layouts
│   ├── headers/               # Header components
│   ├── footers/               # Footer components
│   └── ui/                    # shadcn/ui components
├── screens/
│   ├── Welcome.jsx
│   ├── Sessions.jsx
│   ├── Programs.jsx
│   ├── Practice.jsx
│   ├── Complete.jsx
│   ├── Insights.jsx
│   └── Settings.jsx
├── data/
│   ├── poses.js
│   ├── sessions.js
│   ├── programs.js
│   └── breathing.js
├── stores/
│   ├── progress.js
│   ├── programProgress.js
│   └── preferences.js
├── hooks/
│   ├── usePracticeTimer.js
│   ├── useMoodTracking.js
│   ├── useLocalStorage.js
│   └── useCustomSessions.js
├── services/
│   └── voice.js               # Web Speech API wrapper
└── utils/
    ├── badges.js              # Badge configuration
    ├── animations.js          # Framer Motion variants
    └── recommendations.js     # Session suggestions
```

---

## Testing

### E2E Testing (Playwright)
```bash
npm run test:e2e         # All tests
npm run test:e2e:ui      # Interactive mode
npm run test:e2e:debug   # Debug mode
npm run test:e2e:report  # View report
npm run test:a11y        # Accessibility tests
```

**Configuration**:
- Location: `/tests/e2e/` (E2E), `/tests/a11y/` (Accessibility)
- Viewport: 375px (iPhone 13)
- Server: Auto-starts on `http://localhost:5173`
- Parallelization: Enabled for speed
- Config: `playwright.config.js` (mobile-first, 20s timeout)

**Test Coverage**:
- Mobile responsiveness at 375px
- Touch interactions (44px targets)
- Program flow (unlock, pause, resume)
- Session completion tracking
- Data persistence
- WCAG AA compliance (via @axe-core/playwright)

---

## Key Features

✅ **Completed MVP+**
- 12 yoga poses + extended library for programs
- 4 pre-built sessions + custom session builder
- 10 multi-week programs (8-13 weeks each)
- Progressive unlocking with milestone tracking
- Visual timer with pause/resume
- Progress tracking with streaks
- Mood tracking (pre/post practice)
- Analytics dashboard
- Voice coaching (3 personalities: gentle, motivational, minimal)
- Breathing exercises with visual guide
- PWA with offline support
- Design system with 15+ reusable components
- Pre-commit hooks enforce: ESLint compliance, all tests passing, auto-documentation updates

---

## Important Notes

- **No user accounts** - All data stored locally via localStorage
- **JavaScript** - Using .jsx (not TypeScript) for rapid prototyping
- **Mobile-first** - All features optimized for 375px baseline
- **PWA enabled** - Full offline functionality via service worker (vite-plugin-pwa with Workbox)
- **Voice coaching** - Toggleable, 3 personalities available
- **Mood tracking** - Optional, users can skip
- **Code Style**: Prettier with Tailwind plugin, ESLint with relaxed rules for rapid development (prop-types off, exhaustive-deps off)
- **ESLint Tailwind Plugin**: `eslint-plugin-tailwindcss` enforces best practices (no contradicting classes, shorthands, arbitrary values)
- **Git Hooks**: Pre-commit hook automatically runs ESLint + Prettier + Tests (via Husky + lint-staged)

---

## Documentation

### Essential Guides
- **`/docs/NEW_APIS.md`** - Quick reference for components, hooks, utilities
- **`/docs/features/PROGRAMS_GUIDE.md`** - Multi-week programs complete guide
- **`/docs/deployment/ANDROID_BUILD.md`** - Android APK build instructions
- **`/docs/GIT_HOOKS.md`** - Pre-commit hooks setup and troubleshooting
- **`/REFACTORING_SUMMARY.md`** - Recent refactoring overview

### Additional Resources
- **`/docs/hooks/`** - Custom hooks documentation
- **`/docs/design-system/`** - Design system components
- **`/docs/implementation/`** - Feature implementation history
- **`/docs/testing/`** - Testing strategies and reports
- **`/PRD.md`** - Product requirements document
- **`/README.md`** - Project overview for general audience

### Refactoring Highlights (October 2025)
- **ContentBody component** - Unified body layout system (eliminated 135 lines of duplication)
- **Design system color tokens** - Replaced ALL hardcoded Tailwind colors (green-*, red-*, etc.) with semantic tokens
- **ESLint Tailwind plugin** - Automated Tailwind CSS best practices enforcement
- 4 new design system components (Badge, Stat, Tab, EmptyState)
- Badge utility system (eliminated 114 lines of duplication)
- localStorage hooks (eliminated 94 lines of duplication)
- Centralized design tokens with full light/dark mode support
- Mobile-first patterns across all components
- Consistent spacing and responsive behavior across 9 core screens
- **Git Hooks** - Pre-commit automation: ESLint + Prettier + Tests (via Husky + lint-staged)

---

**MVP Complete**: September 2024
**Latest Update**: October 2025
**Status**: Ready for beta testing
