# Design Token Migration Strategy

## Executive Summary

**Status**: 🔴 **52 Token Violations Found**
**Priority**: HIGH - Inconsistent semantic color usage breaking design system
**Estimated Migration Time**: 2-3 hours
**Risk Level**: LOW (automated script with backup/rollback)

### Quick Stats
- **Total JSX Files**: 63
- **Files with violations**: 22
- **Semantic violations**: 37 instances
- **Non-token colors**: 15 instances (blue, green, red, purple, yellow, orange, amber, emerald, gray)
- **Good token usage**: 147 bg-sage, 283 text-sage, 32 bg-cream instances
- **State token usage**: Only 2 instances (should be ~30+)

---

## 1. Token Inventory

### 1.1 Color Tokens

#### Primary Palette
| Token | Hex | Usage | Purpose |
|-------|-----|-------|---------|
| `sage-50` | #F7F8F7 | Lightest backgrounds | Hover states, secondary backgrounds |
| `sage-100` | #E8ECE8 | Light backgrounds | Track backgrounds, borders |
| `sage-200` | #D1DAD0 | Borders | Default borders |
| `sage-300` | #B5C4B4 | Medium borders | Focus borders |
| `sage-400` | #9BB29A | Interactive elements | Hover states |
| `sage-500` | #8FA68E | **PRIMARY** | Buttons, active states |
| `sage-600` | #758974 | Primary hover | Button hover, links |
| `sage-700` | #5C6E5B | Dark sage | Secondary text |
| `sage-800` | #3F4A3F | Very dark | Headings |
| `sage-900` | #2A332A | Darkest | Primary text |

#### Cream Palette
| Token | Hex | Usage | Purpose |
|-------|-----|-------|---------|
| `cream-50` | #FDFBF7 | Lightest cream | Subtle backgrounds |
| `cream-100` | #F5F3F0 | **PRIMARY CREAM** | Secondary backgrounds |
| `cream-200` | #F0EDE9 | Cream borders | Dividers |
| `cream-300` | #E8E6E3 | Medium cream | Cards |

#### Gold Accent
| Token | Hex | Usage | Purpose |
|-------|-----|-------|---------|
| `gold-50` | #FDFBF5 | Light gold bg | Celebration backgrounds |
| `gold-100` | #F7F2E6 | Soft gold | Hover states |
| `gold-500` | #D4AF37 | **ACCENT** | Highlights, awards |

#### Semantic Colors (CRITICAL - Underutilized)
| Token | Hex | Current Usage | Should Be Used For |
|-------|-----|---------------|-------------------|
| `state-success` | #10B981 | 2 instances | ✅ Completed states, success badges, progress bars |
| `state-warning` | #F59E0B | 0 instances | ⚠️ Milestone badges, warnings |
| `state-error` | #E8B4B8 | 1 instance | ❌ Error states, delete actions |
| `state-info` | #3B82F6 | 0 instances | ℹ️ Info badges, breathing exercises |

#### Text Colors (Semantic)
| Token | Color | Purpose |
|-------|-------|---------|
| `text-primary` | #2C2C2C | Primary headings, body text |
| `text-secondary` | #5C6E5B | Secondary text, labels |
| `text-muted` | #9CA3AF | Muted hints, placeholders |
| `text-inverse` | #FFFFFF | Text on dark backgrounds |
| `text-sage` | #758974 | Sage-themed text |

#### Background Colors (Semantic)
| Token | Color | Purpose |
|-------|-------|---------|
| `bg-background` | #FAFAFA | Main app background |
| `bg-background-secondary` | #F5F3F0 | Card backgrounds |
| `bg-background-sage` | #8FA68E | Sage backgrounds |
| `bg-background-overlay` | rgba(245,243,240,0.95) | Modal overlays |

#### Interactive Colors
| Token | Color | Purpose |
|-------|-------|---------|
| `interactive-primary` | #8FA68E | Default interactive state |
| `interactive-primary-hover` | #758974 | Hover state |
| `interactive-primary-active` | #5C6E5B | Active/pressed state |
| `interactive-secondary-hover` | #F7F8F7 | Secondary hover |

### 1.2 Spacing Tokens

#### Base Grid (8px)
```
0: 0px
1: 4px    (xs)
2: 8px    (sm)
3: 12px
4: 16px   (md)
5: 20px
6: 24px   (lg)
8: 32px   (xl)
10: 40px
12: 48px  (2xl)
16: 64px  (3xl)
20: 80px
24: 96px  (4xl)
```

#### Touch Targets
- `touch`: 44px (minimum iOS touch target)
- `touch-lg`: 56px (comfortable touch target)

#### Safe Areas
- `safe-top`, `safe-bottom`, `safe-left`, `safe-right`: env(safe-area-inset-*)

### 1.3 Typography Tokens

| Token | Size | Line Height | Letter Spacing |
|-------|------|-------------|----------------|
| `text-xs` | 14px | 20px | 0.025em |
| `text-sm` | 16px | 24px | 0.025em |
| `text-base` | 18px | 28px | 0.025em |
| `text-lg` | 20px | 32px | 0.025em |
| `text-xl` | 24px | 36px | 0.025em |
| `text-2xl` | 32px | 44px | 0.025em |
| `text-3xl` | 48px | 56px | 0.025em |
| `text-4xl` | 64px | 72px | 0.025em |

### 1.4 Animation Tokens

#### Keyframes
- `breathe`: 4s infinite breathing effect
- `fade-in`: 300ms fade in
- `slide-up`: 300ms slide up
- `pulse-gentle`: 2s gentle pulse
- `glow`: 2s sage glow effect

#### Timing Functions
- `ease-breathe`: cubic-bezier(0.4, 0.0, 0.2, 1)
- `ease-gentle`: cubic-bezier(0.25, 0.46, 0.45, 0.94)
- `ease-calm`: cubic-bezier(0.23, 1, 0.32, 1)

### 1.5 Shadow Tokens

| Token | Effect | Usage |
|-------|--------|-------|
| `shadow-xs` | Minimal shadow | Subtle elevation |
| `shadow-sm` | Small shadow | Cards |
| `shadow-md` | Medium shadow | Modals |
| `shadow-sage` | Sage-tinted shadow | Sage buttons |
| `shadow-glow-sage` | Sage glow | Focus states |

---

## 2. Usage Analysis

### 2.1 Token Violations by Type

#### ❌ Non-Token Colors (52 violations)

**Severity: HIGH**
```
bg-green-600:     14 instances  → Should be: state-success
bg-green-50:       3 instances  → Should be: state-success/10 or sage-50
bg-green-200:      2 instances  → Should be: state-success/20
bg-green-100:      2 instances  → Should be: state-success/10

bg-blue-100:       3 instances  → Should be: state-info/10 or sage-100
bg-blue-50:        1 instance   → Should be: state-info/5

bg-red-100:        4 instances  → Should be: state-error/10
bg-red-50:         3 instances  → Should be: state-error/5
bg-red-600:        4 instances  → Should be: state-error
text-red-500:      2 instances  → Should be: text-state-error
hover:bg-red-500:  3 instances  → Should be: hover:bg-state-error

bg-purple-100:     3 instances  → Should be: sage-100 or custom
bg-purple-50:      1 instance   → Should be: sage-50

bg-amber-100:      2 instances  → Should be: state-warning/10
bg-amber-500:      2 instances  → Should be: state-warning
bg-amber-50:       2 instances  → Should be: gold-50

bg-yellow-100:     1 instance   → Should be: state-warning/10
bg-yellow-200:     1 instance   → Should be: state-warning/20

bg-orange-100:     1 instance   → Should be: state-warning/10
bg-orange-200:     1 instance   → Should be: state-warning/20

bg-gray-100:       3 instances  → Should be: sage-100 or cream-100
bg-gray-200:       2 instances  → Should be: sage-200
bg-emerald-200:    1 instance   → Should be: state-success/20
```

#### ⚠️ Hardcoded Values (0 violations)
No arbitrary hex values found - excellent!

#### ⚠️ Hardcoded Spacing (0 violations - all valid)
All spacing uses either token values or valid vh/vw units for responsive design.

### 2.2 Files with Violations (22 files)

**Priority 1 - Program/Week Management (High Visibility)**
1. `src/screens/Programs.jsx` - 7 violations (status badges)
2. `src/screens/ProgramDetail.jsx` - 3 violations (status badges)
3. `src/screens/WeekDetail.jsx` - 6 violations (completed badges, progress bars)

**Priority 2 - Session Management**
4. `src/screens/Sessions.jsx` - 2 violations (delete buttons)
5. `src/screens/SessionBuilder.jsx` - 3 violations (error states)
6. `src/screens/SessionDetail.jsx` - 0 violations ✅
7. `src/screens/Complete.jsx` - 5 violations (improvement badges)

**Priority 3 - Core Features**
8. `src/screens/Settings.jsx` - 5 violations (danger zone)
9. `src/screens/PoseLibrary.jsx` - 4 violations (difficulty badges)
10. `src/screens/Breathing.jsx` - 2 violations (exercise types)

**Priority 4 - Components**
11. `src/components/MoodTracker.jsx` - 5 violations (energy levels)
12. `src/components/SessionHistoryModal.jsx` - 2 violations (type badges)
13. `src/components/ProgramProgressCard.jsx` - 3 violations (style badges)
14. `src/components/design-system/Typography.jsx` - 4 violations (badge variants)
15. `src/components/design-system/Progress.jsx` - 4 violations (track/fill)
16. `src/components/design-system/Button.jsx` - 2 violations (danger variant)
17. `src/components/design-system/Overlay.jsx` - 2 violations (confirm buttons)
18. `src/components/design-system/MobileTester.jsx` - 4 violations (debug UI)
19. `src/components/SelectablePoseCard.jsx` - 2 violations (delete button)
20. `src/components/ui/switch.jsx` - 1 violation (unchecked state)

**Priority 5 - Testing (Non-blocking)**
21. `tests/e2e/programs-flow.spec.js` - Test selectors (update after component migration)
22. `DESIGN_SYSTEM.md` - Documentation example

### 2.3 Frequency Analysis

**✅ Good Token Usage**
```
bg-sage-*:           147 occurrences  (35 files) - ✅ EXCELLENT
text-sage-*:         283 occurrences  (37 files) - ✅ EXCELLENT
bg-cream-*:           32 occurrences  (15 files) - ✅ GOOD
text-primary/secondary/muted: 157 occurrences - ✅ EXCELLENT
bg-background:        24 occurrences  (14 files) - ✅ GOOD
```

**❌ State Token Underutilization**
```
bg-state-*:           2 occurrences   (2 files)  - ❌ CRITICAL
text-state-*:         0 occurrences              - ❌ CRITICAL
border-state-*:       0 occurrences              - ❌ CRITICAL

Should be 30+ occurrences for proper semantic usage
```

---

## 3. Semantic Mapping Guide

### 3.1 Status Badges

#### Program Status
```jsx
// ❌ WRONG
<Badge className="bg-green-600 text-white">Active</Badge>
<Badge className="bg-amber-500 text-white">Paused</Badge>
<Badge className="bg-green-600 text-white">Completed</Badge>

// ✅ CORRECT
<Badge className="bg-sage-600 text-white">Active</Badge>
<Badge className="bg-state-warning text-white">Paused</Badge>
<Badge className="bg-state-success text-white">Completed</Badge>
```

**Rationale**:
- "Active" means currently in use → sage (brand color)
- "Paused" means temporary hold → warning state
- "Completed" means success → success state

#### Difficulty Levels
```jsx
// ❌ WRONG
<Badge className="bg-blue-100 text-blue-800">Beginner</Badge>
<Badge className="bg-purple-100 text-purple-800">Intermediate</Badge>
<Badge className="bg-red-100 text-red-800">Advanced</Badge>
<Badge className="bg-gray-100 text-gray-800">Mixed</Badge>

// ✅ CORRECT
<Badge className="bg-sage-100 text-sage-800">Beginner</Badge>
<Badge className="bg-sage-200 text-sage-900">Intermediate</Badge>
<Badge className="bg-sage-300 text-sage-900">Advanced</Badge>
<Badge className="bg-cream-200 text-sage-800">Mixed</Badge>
```

**Rationale**: Use tonal variations of brand colors (sage) for difficulty, not arbitrary colors

#### Yoga Styles
```jsx
// ❌ WRONG
<Badge className="bg-blue-100 text-blue-700">Vinyasa</Badge>
<Badge className="bg-purple-100 text-purple-700">Restorative</Badge>

// ✅ CORRECT
<Badge className="bg-accent/20 text-accent">Vinyasa</Badge>
<Badge className="bg-sage-100 text-sage-700">Restorative</Badge>
```

**Rationale**: Use accent (gold) for dynamic styles, sage for calming styles

### 3.2 Progress Indicators

#### Progress Bars
```jsx
// ❌ WRONG
<div className="bg-sage-100">
  <div className="bg-green-600 h-full" style={{ width: '60%' }} />
</div>

// ✅ CORRECT
<div className="bg-sage-100">
  <div className="bg-state-success h-full" style={{ width: '60%' }} />
</div>
```

**Rationale**: Progress toward completion = success state (semantic meaning)

#### Completed Sessions
```jsx
// ❌ WRONG
<div className="bg-green-50 border-green-200">
  <CheckCircle className="text-green-700" />
  <span className="text-green-700">Completed</span>
</div>

// ✅ CORRECT
<div className="bg-state-success/10 border-state-success/20">
  <CheckCircle className="text-state-success" />
  <span className="text-state-success">Completed</span>
</div>
```

**Rationale**: Consistent semantic color for all completion indicators

### 3.3 Mood & Energy Tracking

#### Energy Levels (Gradient Scale)
```jsx
// ❌ WRONG
const ENERGY_LEVELS = [
  { value: 1, color: 'bg-red-200' },       // Very Low
  { value: 2, color: 'bg-orange-200' },    // Low
  { value: 3, color: 'bg-yellow-200' },    // Moderate
  { value: 4, color: 'bg-green-200' },     // High
  { value: 5, color: 'bg-emerald-200' }    // Very High
];

// ✅ CORRECT
const ENERGY_LEVELS = [
  { value: 1, color: 'bg-state-error/20' },     // Very Low
  { value: 2, color: 'bg-state-warning/20' },   // Low
  { value: 3, color: 'bg-gold-200' },           // Moderate
  { value: 4, color: 'bg-state-success/20' },   // High
  { value: 5, color: 'bg-state-success/30' }    // Very High
];
```

**Rationale**: Use semantic state colors with opacity for gradient scale

### 3.4 Improvement Metrics

#### Session Complete Insights
```jsx
// ❌ WRONG
<Card className="bg-green-50 border-green-200 text-green-800">
  <TrendingUp /> Mood Improved
</Card>
<Card className="bg-blue-50 border-blue-200 text-blue-800">
  <Activity /> Energy Stable
</Card>
<Card className="bg-amber-50 border-amber-200 text-amber-800">
  <Zap /> Streak Active
</Card>

// ✅ CORRECT
<Card className="bg-state-success/10 border-state-success/20 text-state-success">
  <TrendingUp /> Mood Improved
</Card>
<Card className="bg-state-info/10 border-state-info/20 text-state-info">
  <Activity /> Energy Stable
</Card>
<Card className="bg-gold-50 border-accent text-accent">
  <Zap /> Streak Active
</Card>
```

**Rationale**:
- Improvement = success
- Neutral info = info state
- Achievement/streak = gold accent

### 3.5 Breathing Exercises

#### Exercise Type Badges
```jsx
// ❌ WRONG
<Card className="bg-blue-100">Box Breathing</Card>
<Card className="bg-orange-100">Energizing Breath</Card>
<Card className="bg-purple-100">4-7-8 Breath</Card>

// ✅ CORRECT
<Card className="bg-state-info/10">Box Breathing</Card>
<Card className="bg-state-warning/10">Energizing Breath</Card>
<Card className="bg-sage-100">4-7-8 Breath</Card>
```

**Rationale**: Calming = sage, energizing = warning, structured = info

### 3.6 Danger/Error States

#### Delete Actions
```jsx
// ❌ WRONG
<button className="text-red-600 hover:bg-red-50">
  <Trash2 /> Delete
</button>

// ✅ CORRECT
<button className="text-state-error hover:bg-state-error/5">
  <Trash2 /> Delete
</button>
```

#### Danger Zone (Settings)
```jsx
// ❌ WRONG
<Card className="border-red-200 bg-red-50">
  <div className="bg-red-100 text-red-700">
    <AlertTriangle />
  </div>
  <Button className="bg-red-600 hover:bg-red-700">Reset All Data</Button>
</Card>

// ✅ CORRECT
<Card className="border-state-error/20 bg-state-error/5">
  <div className="bg-state-error/10 text-state-error">
    <AlertTriangle />
  </div>
  <Button className="bg-state-error hover:bg-state-error/90">Reset All Data</Button>
</Card>
```

**Rationale**: Use semantic error state for all destructive actions

### 3.7 Milestone Indicators

#### Milestone Weeks
```jsx
// ❌ WRONG
<Badge className="bg-amber-500 text-white">
  <Award /> Milestone Week
</Badge>

// ✅ CORRECT
<Badge className="bg-state-warning text-white">
  <Award /> Milestone Week
</Badge>
```

**Rationale**: Milestone = important/attention-worthy = warning state (amber)

---

## 4. Migration Rules

### 4.1 Status & Completion (Priority 1)

**Rule 1: Completed State**
```bash
FIND: bg-green-600 text-white.*Completed
REPLACE: bg-state-success text-white
FILES: Programs.jsx, ProgramDetail.jsx, WeekDetail.jsx
COUNT: ~6 instances
REASON: Semantic success state for all completions
```

**Rule 2: Completed Session Backgrounds**
```bash
FIND: bg-green-50
REPLACE: bg-state-success/10
FILES: WeekDetail.jsx, tests/e2e/programs-flow.spec.js
COUNT: ~3 instances
REASON: Semantic success with 10% opacity
```

**Rule 3: Progress Bar Fill**
```bash
FIND: bg-green-600.*(?=h-full|h-2)
REPLACE: bg-state-success
FILES: WeekDetail.jsx, tests/e2e/programs-flow.spec.js
COUNT: ~12 instances
REASON: Progress toward completion = success
```

**Rule 4: Progress Track (Success Variant)**
```bash
FIND: bg-green-100
REPLACE: bg-state-success/10
FILES: design-system/Progress.jsx
COUNT: ~2 instances
REASON: Semantic success track background
```

**Rule 5: Success Text**
```bash
FIND: text-green-700
REPLACE: text-state-success
FILES: WeekDetail.jsx, PoseLibrary.jsx
COUNT: ~3 instances
REASON: Success text color
```

**Rule 6: Success Borders**
```bash
FIND: border-green-200
REPLACE: border-state-success/20
FILES: WeekDetail.jsx, Complete.jsx
COUNT: ~4 instances
REASON: Success border with opacity
```

**Rule 7: Active Program Badge**
```bash
# NO CHANGE NEEDED - Already correct!
# bg-sage-600 text-white for "Active" badge is semantically correct
```

**Rule 8: Paused State**
```bash
FIND: bg-amber-500 text-white.*Paused
REPLACE: bg-state-warning text-white
FILES: Programs.jsx, WeekDetail.jsx
COUNT: ~2 instances
REASON: Paused = warning state (temporary hold)
```

**Rule 9: Milestone Badge**
```bash
FIND: bg-amber-500 text-white.*Milestone
REPLACE: bg-state-warning text-white
FILES: WeekDetail.jsx
COUNT: ~1 instance
REASON: Milestone = attention-worthy = warning
```

### 4.2 Difficulty & Style Badges (Priority 2)

**Rule 10: Beginner Difficulty**
```bash
FIND: bg-blue-100 text-blue-800.*[Bb]eginner
REPLACE: bg-sage-100 text-sage-800
FILES: Programs.jsx
COUNT: ~1 instance
REASON: Brand color for difficulty levels
```

**Rule 11: Intermediate Difficulty**
```bash
FIND: bg-purple-100 text-purple-800.*[Ii]ntermediate
REPLACE: bg-sage-200 text-sage-900
FILES: Programs.jsx
COUNT: ~1 instance
REASON: Darker sage for higher difficulty
```

**Rule 12: Advanced Difficulty**
```bash
FIND: bg-red-100 text-red-800.*[Aa]dvanced
REPLACE: bg-sage-300 text-sage-900
FILES: Programs.jsx, PoseLibrary.jsx
COUNT: ~2 instances
REASON: Darkest sage for advanced
```

**Rule 13: Mixed Difficulty**
```bash
FIND: bg-gray-100 text-gray-800.*[Mm]ixed
REPLACE: bg-cream-200 text-sage-800
FILES: Programs.jsx
COUNT: ~2 instances
REASON: Cream for mixed/neutral
```

**Rule 14: Restorative Style**
```bash
FIND: bg-purple-50 text-purple-700.*[Rr]estorative
REPLACE: bg-sage-50 text-sage-700
FILES: Programs.jsx
COUNT: ~1 instance
REASON: Calming sage for restorative
```

**Rule 15: Style Fallback**
```bash
FIND: bg-gray-100 text-gray-800 border-0
REPLACE: bg-cream-100 text-sage-800 border-0
FILES: Programs.jsx, ProgramProgressCard.jsx
COUNT: ~2 instances
REASON: Warm cream instead of cold gray
```

### 4.3 Breathing Exercises (Priority 3)

**Rule 16: Box Breathing (Calming)**
```bash
FIND: bg: 'bg-blue-100'.*(?=.*Box)
REPLACE: bg: 'bg-state-info/10'
FILES: Breathing.jsx
COUNT: ~1 instance
REASON: Structured breathing = info state
```

**Rule 17: Energizing Breath**
```bash
FIND: bg: 'bg-orange-100'.*(?=.*Energizing)
REPLACE: bg: 'bg-state-warning/10'
FILES: Breathing.jsx
COUNT: ~1 instance
REASON: Energizing = warning (amber) color
```

**Rule 18: 4-7-8 Breath**
```bash
FIND: bg: 'bg-purple-100'
REPLACE: bg: 'bg-sage-100'
FILES: Breathing.jsx
COUNT: ~1 instance
REASON: Calming technique = sage
```

### 4.4 Mood & Energy Tracking (Priority 3)

**Rule 19: Energy Level - Very Low**
```bash
FIND: { value: 1, label: 'Very Low', color: 'bg-red-200' }
REPLACE: { value: 1, label: 'Very Low', color: 'bg-state-error/20' }
FILES: MoodTracker.jsx
COUNT: ~1 instance
REASON: Semantic error state for low energy
```

**Rule 20: Energy Level - Low**
```bash
FIND: { value: 2, label: 'Low', color: 'bg-orange-200' }
REPLACE: { value: 2, label: 'Low', color: 'bg-state-warning/20' }
FILES: MoodTracker.jsx
COUNT: ~1 instance
REASON: Semantic warning state
```

**Rule 21: Energy Level - Moderate**
```bash
FIND: { value: 3, label: 'Moderate', color: 'bg-yellow-200' }
REPLACE: { value: 3, label: 'Moderate', color: 'bg-gold-200' }
FILES: MoodTracker.jsx
COUNT: ~1 instance
REASON: Gold for neutral/moderate
```

**Rule 22: Energy Level - High**
```bash
FIND: { value: 4, label: 'High', color: 'bg-green-200' }
REPLACE: { value: 4, label: 'High', color: 'bg-state-success/20' }
FILES: MoodTracker.jsx
COUNT: ~1 instance
REASON: Semantic success state
```

**Rule 23: Energy Level - Very High**
```bash
FIND: { value: 5, label: 'Very High', color: 'bg-emerald-200' }
REPLACE: { value: 5, label: 'Very High', color: 'bg-state-success/30' }
FILES: MoodTracker.jsx
COUNT: ~1 instance
REASON: Success with higher opacity
```

### 4.5 Improvement Metrics (Priority 3)

**Rule 24: Mood Improvement Badge**
```bash
FIND: color: "bg-green-50 border-green-200 text-green-800"
REPLACE: color: "bg-state-success/10 border-state-success/20 text-state-success"
FILES: Complete.jsx
COUNT: ~2 instances
REASON: Improvement = success
```

**Rule 25: Energy Stable Badge**
```bash
FIND: color: "bg-blue-50 border-blue-200 text-blue-800"
REPLACE: color: "bg-state-info/10 border-state-info/20 text-state-info"
FILES: Complete.jsx
COUNT: ~1 instance
REASON: Neutral info = info state
```

**Rule 26: Streak/Achievement Badge**
```bash
FIND: color: "bg-amber-50 border-amber-200 text-amber-800"
REPLACE: color: "bg-gold-50 border-accent text-accent"
FILES: Complete.jsx
COUNT: ~1 instance
REASON: Achievement = gold accent
```

**Rule 27: Celebration Card**
```bash
FIND: className=".*border-accent bg-amber-50
REPLACE: className="border-accent bg-gold-50
FILES: Complete.jsx
COUNT: ~1 instance
REASON: Use gold token, not amber
```

### 4.6 Danger/Error States (Priority 4)

**Rule 28: Delete Button**
```bash
FIND: text-red-500 hover:text-red-600 hover:bg-red-50
REPLACE: text-state-error hover:text-state-error hover:bg-state-error/5
FILES: SelectablePoseCard.jsx
COUNT: ~1 instance
REASON: Semantic error state
```

**Rule 29: Delete Icon in Lists**
```bash
FIND: hover:bg-red-100
REPLACE: hover:bg-state-error/10
FILES: Sessions.jsx
COUNT: ~2 instances
REASON: Delete action hover state
```

**Rule 30: Error Card Background**
```bash
FIND: border-red-200 bg-red-50
REPLACE: border-state-error/20 bg-state-error/5
FILES: SessionBuilder.jsx, Settings.jsx
COUNT: ~2 instances
REASON: Error state container
```

**Rule 31: Danger Zone Button**
```bash
FIND: bg-red-600 hover:bg-red-700
REPLACE: bg-state-error hover:bg-state-error/90
FILES: Settings.jsx
COUNT: ~1 instance
REASON: Destructive action button
```

**Rule 32: Danger Icon Container**
```bash
FIND: bg-red-100 text-red-700
REPLACE: bg-state-error/10 text-state-error
FILES: Settings.jsx
COUNT: ~2 instances
REASON: Error state iconography
```

### 4.7 Session Type Badges (Priority 4)

**Rule 33: Yoga Session Badge**
```bash
FIND: bg-blue-100 text-blue-800.*(?=.*yoga)
REPLACE: bg-sage-100 text-sage-800
FILES: SessionHistoryModal.jsx
COUNT: ~1 instance
REASON: Yoga = sage brand color
```

**Rule 34: Breathing Session Badge**
```bash
FIND: bg-purple-100 text-purple-800.*(?=.*breathing)
REPLACE: bg-state-info/10 text-state-info
FILES: SessionHistoryModal.jsx
COUNT: ~1 instance
REASON: Breathing exercise = info
```

### 4.8 Design System Components (Priority 4)

**Rule 35: Typography Badge - Success**
```bash
FIND: success: 'bg-green-100 text-green-800 border-green-200'
REPLACE: success: 'bg-state-success/10 text-state-success border-state-success/20'
FILES: design-system/Typography.jsx
COUNT: ~1 instance
REASON: Semantic state mapping
```

**Rule 36: Typography Badge - Warning**
```bash
FIND: warning: 'bg-yellow-100 text-yellow-800 border-yellow-200'
REPLACE: warning: 'bg-state-warning/10 text-state-warning border-state-warning/20'
FILES: design-system/Typography.jsx
COUNT: ~1 instance
REASON: Semantic state mapping
```

**Rule 37: Typography Badge - Error**
```bash
FIND: error: 'bg-red-100 text-red-800 border-red-200'
REPLACE: error: 'bg-state-error/10 text-state-error border-state-error/20'
FILES: design-system/Typography.jsx
COUNT: ~1 instance
REASON: Semantic state mapping
```

**Rule 38: Typography Badge - Secondary**
```bash
FIND: secondary: 'bg-gray-100 text-gray-800 border-gray-200'
REPLACE: secondary: 'bg-cream-100 text-sage-800 border-cream-200'
FILES: design-system/Typography.jsx
COUNT: ~1 instance
REASON: Warm cream instead of gray
```

**Rule 39: Progress Success Variant**
```bash
FIND: fill: 'bg-green-500'
REPLACE: fill: 'bg-state-success'
FILES: design-system/Progress.jsx
COUNT: ~1 instance
REASON: Success state for progress
```

**Rule 40: Progress Muted Track**
```bash
FIND: track: 'bg-gray-200'
REPLACE: track: 'bg-sage-100'
FILES: design-system/Progress.jsx
COUNT: ~1 instance
REASON: Sage for muted elements
```

**Rule 41: Progress Muted Fill**
```bash
FIND: fill: 'bg-gray-400'
REPLACE: fill: 'bg-sage-300'
FILES: design-system/Progress.jsx
COUNT: ~1 instance
REASON: Sage for muted progress
```

**Rule 42: Button Danger Hover**
```bash
FIND: 'hover:bg-red-500 hover:shadow-lg'
REPLACE: 'hover:bg-state-error hover:shadow-lg'
FILES: design-system/Button.jsx
COUNT: ~1 instance
REASON: Semantic error state
```

**Rule 43: Button Danger Active**
```bash
FIND: 'active:bg-red-600 active:scale-\[0.98\]'
REPLACE: 'active:bg-state-error/90 active:scale-[0.98]'
FILES: design-system/Button.jsx
COUNT: ~1 instance
REASON: Active error state
```

**Rule 44: Overlay Confirm Button**
```bash
FIND: confirmButton: 'bg-state-error hover:bg-red-500 text-white'
REPLACE: confirmButton: 'bg-state-error hover:bg-state-error/90 text-white'
FILES: design-system/Overlay.jsx
COUNT: ~1 instance
REASON: Consistent error state hover
```

**Rule 45: Switch Unchecked State**
```bash
FIND: data-\[state=unchecked\]:bg-gray-200
REPLACE: data-[state=unchecked]:bg-sage-200
FILES: ui/switch.jsx
COUNT: ~1 instance
REASON: Brand color for unchecked
```

### 4.9 Pose Library (Priority 5)

**Rule 46: Easy Difficulty**
```bash
FIND: 'bg-green-100 text-green-700'.*(?=.*Easy)
REPLACE: 'bg-sage-100 text-sage-700'
FILES: PoseLibrary.jsx
COUNT: ~1 instance
REASON: Sage for difficulty levels
```

**Rule 47: Medium Difficulty**
```bash
FIND: 'bg-amber-100 text-amber-700'.*(?=.*Medium)
REPLACE: 'bg-sage-200 text-sage-800'
FILES: PoseLibrary.jsx
COUNT: ~1 instance
REASON: Darker sage for medium
```

**Rule 48: Hard Difficulty**
```bash
FIND: 'bg-red-100 text-red-700'.*(?=.*Hard)
REPLACE: 'bg-sage-300 text-sage-900'
FILES: PoseLibrary.jsx
COUNT: ~1 instance
REASON: Darkest sage for hard
```

### 4.10 Program Style Badges (Priority 5)

**Rule 49: Vinyasa Style**
```bash
FIND: vinyasa: 'bg-blue-100 text-blue-700'
REPLACE: vinyasa: 'bg-accent/20 text-accent'
FILES: ProgramProgressCard.jsx
COUNT: ~1 instance
REASON: Gold accent for dynamic style
```

**Rule 50: Hatha Style**
```bash
FIND: hatha: 'bg-amber-100 text-amber-700'
REPLACE: hatha: 'bg-gold-100 text-accent'
FILES: ProgramProgressCard.jsx
COUNT: ~1 instance
REASON: Gold token for balanced style
```

**Rule 51: Restorative Style**
```bash
FIND: restorative: 'bg-purple-100 text-purple-700'
REPLACE: restorative: 'bg-sage-100 text-sage-700'
FILES: ProgramProgressCard.jsx
COUNT: ~1 instance
REASON: Calming sage for restorative
```

---

## 5. Migration Script Usage

### 5.1 Automated Migration Script

Location: `/Users/gil/git/yoga-app/scripts/migrate-tokens.sh`

**Features:**
- ✅ Automatic backup before changes
- ✅ Dry-run mode for testing
- ✅ ESLint validation after migration
- ✅ Rollback capability
- ✅ Detailed migration log
- ✅ Progress reporting

### 5.2 Running the Migration

#### Step 1: Review Current State
```bash
# Check for violations
npm run lint

# Review current token usage
git status
git diff
```

#### Step 2: Dry Run (Recommended)
```bash
cd /Users/gil/git/yoga-app
chmod +x scripts/migrate-tokens.sh
./scripts/migrate-tokens.sh --dry-run
```

This will:
- Show all planned replacements
- Count instances per rule
- Identify affected files
- **NO CHANGES MADE**

#### Step 3: Execute Migration
```bash
./scripts/migrate-tokens.sh
```

This will:
1. Create backup in `.token-migration-backup/`
2. Apply all 51 migration rules
3. Run ESLint to check for breaks
4. Generate migration log

#### Step 4: Verify Changes
```bash
# Check git diff
git diff

# Run linter
npm run lint

# Start dev server and test
npm run dev
```

#### Step 5: Manual Testing Checklist

**Critical Screens to Test:**
- [ ] Programs screen - status badges
- [ ] Program detail - progress bars
- [ ] Week detail - completion states
- [ ] Session complete - improvement badges
- [ ] Settings - danger zone
- [ ] Mood tracker - energy levels
- [ ] Breathing exercises - type badges
- [ ] Pose library - difficulty badges

**Visual Checks:**
- [ ] Completed badges are green (state-success)
- [ ] Active badges are sage
- [ ] Paused badges are amber (state-warning)
- [ ] Milestone badges are amber (state-warning)
- [ ] Delete buttons are pink (state-error)
- [ ] Progress bars are green (state-success)
- [ ] Energy levels show gradient from red → amber → gold → green
- [ ] No jarring color differences

#### Step 6: E2E Test Updates

After migration, update test selectors:
```bash
# Update test file
vi tests/e2e/programs-flow.spec.js

# Replace test selectors
.bg-green-600 → .bg-state-success
.bg-green-50 → .bg-state-success\/10

# Run tests
npm run test:e2e
```

### 5.3 Rollback Procedure

If migration causes issues:

```bash
# Option 1: Git rollback (if not committed)
git checkout .

# Option 2: Restore from backup
./scripts/migrate-tokens.sh --rollback

# Option 3: Manual restoration
cp -r .token-migration-backup/* src/
```

### 5.4 Migration Log

The script generates: `.token-migration-log.txt`

Contains:
- Timestamp
- Rules applied
- Files modified
- Replacement counts
- ESLint results
- Any errors

---

## 6. Post-Migration Validation

### 6.1 Automated Checks

```bash
# ESLint (should pass)
npm run lint

# Build (should succeed)
npm run build

# Type check (if using TypeScript)
npm run type-check
```

### 6.2 Visual Testing Checklist

#### Programs & Weeks (HIGH PRIORITY)
- [ ] Programs screen shows correct status badges:
  - Active → sage-600 ✅
  - Paused → state-warning (amber) ✅
  - Completed → state-success (green) ✅
- [ ] Difficulty badges use sage tones (100/200/300) ✅
- [ ] Style badges use sage/gold/cream ✅
- [ ] Progress bars use state-success fill ✅
- [ ] Completed sessions have state-success/10 background ✅
- [ ] Milestone badges use state-warning (amber) ✅

#### Session Management
- [ ] Delete buttons use state-error (pink) ✅
- [ ] Error cards use state-error/5 background ✅
- [ ] Session type badges (yoga/breathing) correct ✅

#### Mood & Energy
- [ ] Energy levels show semantic gradient:
  - Very Low → state-error/20 (light pink)
  - Low → state-warning/20 (light amber)
  - Moderate → gold-200 (light gold)
  - High → state-success/20 (light green)
  - Very High → state-success/30 (green)
- [ ] Mood improvement badges use state-success ✅

#### Breathing Exercises
- [ ] Box Breathing → state-info/10 (light blue) ✅
- [ ] Energizing → state-warning/10 (light amber) ✅
- [ ] 4-7-8 → sage-100 (light sage) ✅

#### Settings
- [ ] Danger zone uses state-error consistently ✅
- [ ] Reset button uses state-error ✅
- [ ] Warning icons use state-error/10 background ✅

### 6.3 Browser Testing

**Browsers to Test:**
- [ ] Chrome/Edge (Chromium)
- [ ] Safari (iOS/macOS)
- [ ] Firefox

**Viewports:**
- [ ] Mobile (375px - iPhone SE)
- [ ] Tablet (768px)
- [ ] Desktop (1280px)

### 6.4 Accessibility Validation

**Color Contrast (WCAG AA):**
- [ ] state-success text on white ≥ 4.5:1
- [ ] state-warning text on white ≥ 4.5:1
- [ ] state-error text on white ≥ 4.5:1
- [ ] state-info text on white ≥ 4.5:1

**Test with:**
```bash
# Chrome DevTools Lighthouse
# - Accessibility score should remain 100
# - No new contrast errors
```

### 6.5 Performance Check

```bash
# Build size should not increase
npm run build
# Check dist/ size

# No runtime errors
npm run dev
# Open browser console
# Navigate through all screens
# Check for errors
```

---

## 7. Risk Assessment

### 7.1 Migration Risks

| Risk | Severity | Probability | Mitigation |
|------|----------|-------------|------------|
| Visual regression | Medium | Low | Manual testing checklist |
| E2E test failures | Medium | High | Update test selectors |
| ESLint errors | Low | Low | Automated check in script |
| Color contrast issues | Low | Very Low | State tokens pre-validated |
| Build failures | Low | Very Low | TypeScript not used |
| Rollback needed | Low | Low | Automatic backup |

### 7.2 Breaking Changes

**None Expected** - This is a pure style migration with:
- ✅ No prop changes
- ✅ No component API changes
- ✅ No state management changes
- ✅ No routing changes
- ✅ Only className value replacements

### 7.3 User-Facing Impact

**Zero Impact Expected:**
- Visual changes are intentional (consistent semantic colors)
- No functionality changes
- No performance changes
- Better semantic meaning
- Improved maintainability

---

## 8. Success Metrics

### 8.1 Quantitative Goals

- ✅ **0** arbitrary hex color values
- ✅ **0** non-token color classes (blue, green, red, purple, yellow, orange, amber, emerald, gray)
- ✅ **30+** state token usages (currently 2)
- ✅ **100%** ESLint pass rate
- ✅ **100%** E2E test pass rate (after selector updates)
- ✅ **0** console errors on all screens

### 8.2 Qualitative Goals

- ✅ Consistent semantic color usage across app
- ✅ Predictable color meanings (green always = success, amber = warning, etc.)
- ✅ Easier maintenance (change state-success once, affects all completions)
- ✅ Better developer experience (semantic names vs arbitrary colors)
- ✅ Improved design system adherence

### 8.3 Before/After Comparison

**Before:**
- 52 token violations
- 15 different non-token color families
- Inconsistent completion colors (green-600 vs state-success)
- Arbitrary difficulty colors (blue/purple/red)
- Mixed energy level colors (red/orange/yellow/green/emerald)

**After:**
- 0 token violations ✅
- 100% design system compliance ✅
- Consistent semantic colors ✅
- Sage-based difficulty scale ✅
- Semantic energy level gradient ✅

---

## 9. Next Steps

### 9.1 Immediate Actions

1. **Review this document** with team
2. **Run dry-run** to preview changes
3. **Execute migration** script
4. **Test critical paths** (programs, sessions, mood tracking)
5. **Update E2E tests** with new selectors
6. **Commit changes** with descriptive message

### 9.2 Post-Migration

1. **Update DESIGN_SYSTEM.md** with migration notes
2. **Add linting rule** to prevent non-token colors (if possible with ESLint plugin)
3. **Document semantic color meanings** for team
4. **Create visual regression tests** (optional - Chromatic/Percy)

### 9.3 Future Improvements

1. **Dark mode support** using state token opacity variants
2. **Theme switching** (easily change state-success from green to another color)
3. **Additional state tokens** if needed (state-pending, state-archived, etc.)
4. **Automated token validation** in CI/CD pipeline

---

## 10. Migration Command Summary

```bash
# 1. Review violations
grep -r "bg-green-\|bg-blue-\|bg-red-\|bg-purple-\|bg-yellow-\|bg-orange-\|bg-amber-\|bg-emerald-\|bg-gray-" src/ --include="*.jsx"

# 2. Dry run
./scripts/migrate-tokens.sh --dry-run

# 3. Execute migration
./scripts/migrate-tokens.sh

# 4. Verify
npm run lint
git diff

# 5. Test
npm run dev
npm run test:e2e

# 6. Rollback if needed
./scripts/migrate-tokens.sh --rollback

# 7. Commit
git add .
git commit -m "Migrate to semantic design tokens

- Replace 52 non-token color instances with semantic state tokens
- Standardize completion states to state-success
- Use state-warning for paused/milestone badges
- Use state-error for delete/danger actions
- Implement semantic energy level gradient
- Update difficulty badges to sage scale
- Ensure 100% design system compliance

See TOKEN_MIGRATION.md for full details"
```

---

## Appendix A: Token Reference Card

### Quick Reference for Developers

**Completion/Success:**
- Badge: `bg-state-success text-white`
- Background: `bg-state-success/10`
- Border: `border-state-success/20`
- Text: `text-state-success`
- Progress bar: `bg-state-success`

**Warning/Attention:**
- Badge: `bg-state-warning text-white`
- Background: `bg-state-warning/10`
- Border: `border-state-warning/20`
- Text: `text-state-warning`

**Error/Danger:**
- Badge: `bg-state-error text-white`
- Background: `bg-state-error/5`
- Border: `border-state-error/20`
- Text: `text-state-error`
- Button: `bg-state-error hover:bg-state-error/90`

**Info/Neutral:**
- Badge: `bg-state-info/10 text-state-info`
- Background: `bg-state-info/5`
- Text: `text-state-info`

**Active/Brand:**
- Badge: `bg-sage-600 text-white`
- Button: `bg-sage-600 hover:bg-sage-700`
- Border: `border-sage-400`

**Difficulty Scale:**
- Beginner: `bg-sage-100 text-sage-800`
- Intermediate: `bg-sage-200 text-sage-900`
- Advanced: `bg-sage-300 text-sage-900`

**Achievement/Milestone:**
- Badge: `bg-state-warning text-white` (for milestones)
- Celebration: `bg-gold-50 border-accent text-accent`

---

**Document Version**: 1.0
**Created**: 2025-10-02
**Last Updated**: 2025-10-02
**Total Rules**: 51
**Estimated Impact**: 52 replacements across 22 files
**Estimated Time**: 2-3 hours (including testing)
