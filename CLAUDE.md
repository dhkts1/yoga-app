# 🧘 Yoga App - Project Memory

## Project Overview
**Name**: Mindful Yoga App
**Type**: Mobile-first React PWA with offline support
**Status**: MVP Complete - Ready for Beta Testing
**Started**: September 2024
**Philosophy**: "Breathe First, Features Later" - Simple, calming yoga practice app

## Key Design Decisions

### Visual Style
- **Illustrations**: Clean, abstract, calming (not photos)
- **Colors**: Sage green (#8FA68E), warm cream (#F5F3F0), muted gold (#D4AF37)
- **Typography**: Inter, minimum 18px for readability at arm's length
- **Animations**: 300ms breath-like transitions

### User Experience
- **Zero-friction start**: Practice within 2 taps
- **Pose names**: English prominent with Sanskrit subtitles
- **Navigation**: Maximum 2 levels deep
- **Touch targets**: 44px minimum

### Audio/Coaching
- **Multiple personalities**: Gentle Guide, Motivational Coach, Minimal
- **Content**: Encouragement + form corrections + breathing reminders
- **Examples**: "You're doing great!", "Remember to lock your knees", "Notice your breath"

### Content Organization
- **Pre-built Sessions**: 5, 10, 15 minute curated sequences
- **Custom Sessions**: Build-your-own with any poses
- **Breathing Exercises**: Guided pranayama sessions
- **By Focus**: Morning Energy, Stress Relief, Sleep Preparation
- **By Body Part**: Back, Hips, Core, Shoulders, Full Body

### Progress System
- **Streak counter**: Daily practice tracking
- **Mood tracking**: Pre/post practice feelings
- **Practice insights**: Time analysis and patterns
- **Stats**: Total time, sessions completed, favorite poses
- **Non-judgmental**: No pressure, just encouragement

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (usually on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter (ESLint configured for React)
npm run lint

# Format code with Prettier
npm run format
```

## High-Level Architecture

### Core Application Flow
1. **AppLayout** - Consistent layout with fixed header/footer and content area
2. **App.jsx** - Main router setup with 5 routes (Welcome, Sessions, Practice, Complete, Insights)
3. **Practice Flow** - Welcome → Sessions → Practice (with timer) → Complete → Insights
4. **State Management** - Zustand store for progress and mood tracking with localStorage persistence
5. **PWA Setup** - Service worker with offline caching via vite-plugin-pwa

### Key Architectural Patterns
- **Component Composition**: Design system components (`/src/components/design-system/`) wrap base UI
- **Data Layer**: Static pose/session data in `/src/data/` with helper functions
- **Progress Persistence**: Zustand store auto-saves to localStorage on every change
- **Voice Integration**: Web Speech API service for optional coaching
- **Responsive Images**: PoseImage component with SVG illustrations and emoji fallbacks
- **AppLayout Pattern**: Fixed header/footer with content area for consistent mobile UX
- **Tap-to-Select**: Mobile-optimized interactions throughout the app

## Design System

### Component Library
Complete design system created in `/src/design-system/` and `/src/components/design-system/`:

**Core Components:**
- `Button` - Primary/secondary variants with breath-like transitions
- `Card` - PoseCard and SessionCard for yoga content
- `Typography` - Semantic text components (H1, H2, Body, Caption)
- `Container` - Responsive layout with safe areas
- `Progress` - Timer and session progress indicators
- `Overlay` - Tips, pause screens with slide animations
- `Icon` - Yoga-specific icon set
- `Stack` - Flexbox layout helper

**Design Tokens:**
- Colors: Full sage/cream/gold palette with 50-900 shades
- Typography: Inter font, 18px minimum for arm's length
- Spacing: 8px grid system
- Animations: 300ms organic transitions
- Shadows: Natural depth system
- Breakpoints: Mobile-first (320px min)

### Design System Files
- `DESIGN_SYSTEM.md` - Complete usage documentation
- `DESIGN_SYSTEM_VALIDATION.md` - PRD compliance checklist
- `/src/design-system/tokens/` - All design tokens
- `/src/components/design-system/` - Component library
- `tailwind.config.js` - Updated with full design system

## Current Implementation Status

### Critical Services & Stores

**Progress Store** (`/src/stores/progress.js`)
- Tracks streaks, session history, total practice time
- Mood tracking with pre/post practice feelings
- Practice insights and analytics
- Auto-persists to localStorage
- Handles timezone-aware streak calculations
- Methods: `completeSession()`, `getStreakStatus()`, `trackMood()`, `getInsights()`

**Voice Service** (`/src/services/voice.js`)
- Web Speech API wrapper for coaching
- Configurable voice personalities (Gentle Guide, Motivational Coach, Minimal)
- Methods: `announceNewPose()`, `provideEncouragement()`, `breathingReminder()`

**Data Helpers** (`/src/data/`)
- `getPoseById()`, `getSessionById()` - Data access functions
- 12 poses with full metadata (instructions, benefits, tips, modifications)
- 4 pre-built sessions (5/10/15 min yoga + breathing exercise)
- Custom session builder utilities

### Design System Integration
The app uses a comprehensive design system at `/src/components/design-system/` with:
- **Tokens**: Colors (sage/cream/gold), spacing (8px grid), typography (18px min)
- **Components**: Button, Card, Typography, Container, Progress, Overlay, Icon
- **Tailwind Config**: Extended with design tokens and custom animations
- All components follow mobile-first responsive design (320px minimum)

## Core User Stories (Completed)
1. ✅ **Instant Start**: User can begin practice in 2 taps
2. ✅ **Form Guidance**: User receives helpful corrections via tips overlay
3. ✅ **Progress Tracking**: User sees their consistency with streaks and insights
4. ✅ **Voice Selection**: User chooses preferred coaching style (Gentle/Motivational/Minimal)
5. ✅ **Session Variety**: User selects pre-built sessions or builds custom ones
6. ✅ **Mood Tracking**: User tracks emotional state before/after practice
7. ✅ **Breathing Exercises**: User can practice guided pranayama

## Design Tokens
```css
/* Colors */
--primary: #8FA68E;      /* Sage green */
--secondary: #F5F3F0;    /* Warm cream */
--accent: #D4AF37;       /* Muted gold */
--text-primary: #2C2C2C; /* Deep charcoal */

/* Spacing */
--space-unit: 8px;
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;

/* Typography */
--font-base: 18px;
--font-large: 24px;
--font-small: 16px;
```

## Current Feature Status

### Completed MVP Features
- ✅ 12 yoga poses with abstract SVG illustrations
- ✅ 4 pre-built sessions (5/10/15 min yoga + breathing exercise)
- ✅ Custom session builder with pose selection
- ✅ Visual timer with pause/resume and auto-advance
- ✅ Progress tracking with streak counter (localStorage)
- ✅ Mood tracking (pre/post practice)
- ✅ Practice insights dashboard with analytics
- ✅ Voice coaching via Web Speech API (3 personalities)
- ✅ PWA with offline support
- ✅ Mobile-responsive with AppLayout (320px+)
- ✅ Tips overlay for form guidance
- ✅ Breathing exercises with guided pranayama
- ✅ Complete ESLint compliance (0 errors, 0 warnings)

### Beta Testing Status
- ✅ Chrome DevTools testing at 375px viewport
- ✅ All screens working perfectly on mobile
- ✅ No horizontal scrolling issues
- ✅ All features functional and tested
- ✅ App ready for user testing

### Known Limitations
- Voice coaching uses browser TTS (not custom recordings)
- SVG illustrations are abstract geometric shapes
- No user accounts (all data local)
- No social features

## Technical Improvements

### Code Quality
- ✅ **ESLint Compliance**: Zero errors, zero warnings
- ✅ **Mobile-First Design**: Responsive from 320px+
- ✅ **AppLayout Pattern**: Consistent header/footer across all screens
- ✅ **Tap-to-Select**: Mobile-optimized interactions
- ✅ **Performance**: Optimized bundle with chunk splitting

### Architecture Enhancements
- ✅ **Component Composition**: Consistent design system usage
- ✅ **State Management**: Zustand with automatic localStorage sync
- ✅ **Error Boundaries**: Graceful error handling
- ✅ **Service Workers**: PWA with offline capabilities
- ✅ **Voice Integration**: Configurable coaching personalities

### Testing Results
- ✅ **Chrome DevTools**: Tested at 375px viewport (iPhone SE)
- ✅ **Screen Navigation**: All screens accessible and functional
- ✅ **Touch Interactions**: All buttons and selections work properly
- ✅ **Performance**: Fast loading and smooth animations
- ✅ **Offline**: App works without internet connection

## Key Metrics to Track
- First session completion rate (target: >70%)
- Return rate day 2 (target: >50%)
- Average sessions per week (target: 3+)
- App load time (target: <2s)
- User satisfaction (target: 4.5+ stars)

## Important Notes
- **No user accounts** in MVP - everything local
- **No social features** initially - focus on personal practice
- **Abstract illustrations** only - no perfect body photos
- **Simplicity over features** - hide complexity
- **Encouragement over achievement** - supportive tone
- **Using JavaScript** (.jsx files) not TypeScript initially for faster prototyping

## Tech Stack
- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **State**: Zustand with localStorage persistence
- **Styling**: Tailwind CSS + shadcn/ui components + custom design system
- **PWA**: vite-plugin-pwa with Workbox for offline support
- **Voice**: Web Speech API with multiple personalities
- **Layout**: AppLayout component for consistent mobile UX
- **Build**: Vite with chunk splitting and optimizations
- **Linting**: ESLint configured for React (zero errors/warnings)

## Next Steps for Beta

### User Testing Phase
1. **Beta Deployment**: Deploy to production environment
2. **User Recruitment**: Find 10-20 beta testers
3. **Feedback Collection**: Gather usage data and user feedback
4. **Iteration**: Based on real user behavior and needs

### Potential Enhancements (Post-Beta)
- Custom voice recordings for coaching
- More detailed pose illustrations
- Additional breathing exercises
- Advanced progress analytics
- Social features (if requested)
- More session varieties

### File Structure
```
yoga-app/
├── PRD.md                      # Product Requirements Document
├── CLAUDE.md                   # This file - project memory
├── src/
│   ├── components/
│   │   ├── AppLayout.jsx       # Fixed header/footer layout
│   │   ├── design-system/      # Complete design system
│   │   ├── ui/                 # shadcn/ui components
│   │   └── [other components]
│   ├── screens/
│   │   ├── Welcome.jsx         # Landing screen
│   │   ├── Sessions.jsx        # Session selection
│   │   ├── Practice.jsx        # Main practice timer
│   │   ├── Complete.jsx        # Session completion
│   │   └── Insights.jsx        # Progress dashboard
│   ├── data/
│   │   ├── poses.js           # 12 yoga poses
│   │   └── sessions.js        # 4 pre-built sessions
│   ├── stores/
│   │   └── progress.js        # Zustand store with persistence
│   ├── services/
│   │   └── voice.js          # Web Speech API wrapper
│   └── [other directories]
```

## References
- [PRD Document](./PRD.md) - Complete product requirements
- [React + shadcn Template](https://github.com/RanitManik/React.shadcn.JS-Template) - Base template
- Design system documentation in `/src/components/design-system/`

---

*MVP Complete - September 2024*
*Ready for beta testing and user feedback*