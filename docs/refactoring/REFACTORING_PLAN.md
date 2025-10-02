# Design System Refactoring Plan
**Mindful Yoga App - Component Audit & Systematic Refactoring**

Generated: October 2, 2025
Total Files Audited: 66 JSX files (14 screens + 52 components)

---

## Executive Summary

### Current State Analysis
- **794 className instances** across 14 screens (avg 57 per screen)
- **534 hardcoded color/spacing instances** (bg-, text-, border-)
- **Mixed component architecture**: Custom design system exists but underutilized
- **Duplication**: 300+ lines of repeated card markup across screens
- **shadcn/ui components**: 27 installed, only 6 actively imported (Badge, Progress, Switch, Dialog, Tabs, Skeleton)

### Design System Assets Available
**Custom Design System** (`/src/components/design-system/`):
- ✅ Button - Full-featured with variants (primary, secondary, ghost, outline, destructive, link)
- ✅ Card - 6 variants (default, elevated, outlined, glass, sage, cream) + sub-components (CardHeader, CardTitle, CardContent, CardFooter)
- ✅ Typography - Heading, Text, PoseName, Timer, Label, HelperText, Quote, Badge, Link
- ✅ Container - Mobile-safe container component
- ✅ Progress - Progress bar component
- ✅ Icon - Icon wrapper component

**shadcn/ui Components** (`/src/components/ui/`):
- Badge, Button, Card, Dialog, Tabs, Skeleton, Switch, Progress, Checkbox, Radio Group, Slider, Alert, Avatar, Dropdown Menu, Separator, Label, Toast/Toaster

### Estimated Impact
- **Code Reduction**: ~500-700 lines eliminated through component consolidation
- **Consistency Gains**: 100% of screens using design system tokens
- **Maintainability**: Single source of truth for styling patterns
- **Performance**: Minimal (existing components already use React.memo where needed)

### Total Estimated Effort
- **120-140 hours** across 3 weeks
- **40-45 hours per week** (sustainable pace)
- **Risk Level**: Low (no breaking changes to functionality)

---

## 1. Screen-by-Screen Analysis

### Complexity Scoring System
- **1 (Simple)**: 10-20 changes, straightforward replacements
- **2 (Easy)**: 20-40 changes, some conditional logic
- **3 (Moderate)**: 40-70 changes, multiple component types
- **4 (Complex)**: 70-100 changes, nested structures, state management
- **5 (Very Complex)**: 100+ changes, major restructuring needed

| Screen | className Count | Hardcoded Colors | Complexity Score | Estimated Hours | Priority | Notes |
|--------|----------------|------------------|------------------|-----------------|----------|-------|
| **Welcome.jsx** | 52 | 30 | 4 | 8-10h | HIGH | Heavy button usage, program cards, streak badges |
| **Sessions.jsx** | 106 | 57 | 5 | 12-14h | HIGH | Most complex screen, 4 card variants, recommendations |
| **Settings.jsx** | 126 | 100 | 4 | 10-12h | MEDIUM | Collapsible sections, form controls, dialogs |
| **Insights.jsx** | 25 | 10 | 2 | 4-5h | MEDIUM | Already uses design system well, minor cleanup |
| **Programs.jsx** | 33 | 25 | 3 | 6-8h | HIGH | Badge variants, progress bars, status indicators |
| **ProgramDetail.jsx** | 51 | 26 | 3 | 6-8h | MEDIUM | Week cards, lock states, milestone indicators |
| **WeekDetail.jsx** | 64 | 40 | 3 | 7-9h | MEDIUM | Session cards, notes textarea, completion button |
| **SessionDetail.jsx** | 77 | 56 | 4 | 8-10h | HIGH | Pose cards, metadata, favorite integration |
| **Practice.jsx** | 69 | 48 | 4 | 9-11h | HIGH | Timer UI, controls, mood tracker integration |
| **Complete.jsx** | 42 | 36 | 3 | 6-7h | MEDIUM | Celebration UI, stats display, action buttons |
| **Breathing.jsx** | 47 | 33 | 3 | 5-7h | MEDIUM | Exercise cards, duration selector |
| **BreathingPractice.jsx** | 34 | 18 | 2 | 4-5h | LOW | Timer UI, simple controls |
| **SessionBuilder.jsx** | 31 | 19 | 3 | 6-8h | MEDIUM | Form controls, pose selection, drag-drop |
| **PoseLibrary.jsx** | 37 | 36 | 3 | 5-7h | MEDIUM | Grid layout, filter controls, pose cards |

**Total Screen Refactoring**: 97-121 hours

---

## 2. Component-by-Component Analysis

### Top 15 High-Usage Components

| Component | Current State | Refactoring Need | Complexity | Estimated Hours | Priority |
|-----------|--------------|------------------|------------|-----------------|----------|
| **SessionCard.jsx** | ✅ **EXCELLENT** - Already unified, uses minimal hardcoding | Minor cleanup only | 1 | 1-2h | LOW |
| **MoodTracker.jsx** | Good structure, some hardcoded colors | Replace bg-/text- with design tokens | 2 | 3-4h | MEDIUM |
| **BottomNav.jsx** | Gradient bg, hardcoded colors | Use design system colors, Badge component | 2 | 3-4h | MEDIUM |
| **CategoryTabs.jsx** | Custom dropdown, inconsistent spacing | Could use shadcn Tabs or DropdownMenu | 3 | 4-5h | HIGH |
| **ProgramProgressCard.jsx** | ✅ **EXCELLENT** - Already uses design system | No changes needed | 1 | 0h | SKIP |
| **SessionHistoryModal.jsx** | Dialog structure, hardcoded styling | Use shadcn Dialog component | 3 | 4-5h | MEDIUM |
| **BreathingGuide.jsx** | Custom SVG animation, inline styles | Keep as-is (specialized component) | 1 | 1h | LOW |
| **PoseImage.jsx** | Simple component, minimal styling | Minor cleanup | 1 | 1h | LOW |
| **FeatureTooltip.jsx** | Custom tooltip logic | Consider replacing with shadcn Tooltip | 2 | 3-4h | LOW |
| **FavoriteButton.jsx** | Star icon with hardcoded colors | Use design system Button + Icon | 2 | 2-3h | MEDIUM |
| **Onboarding.jsx** | Carousel with hardcoded styling | Use design system Card + Button | 3 | 5-6h | MEDIUM |
| **SelectablePoseCard.jsx** | Custom card with selection state | Consolidate with SessionCard pattern | 3 | 4-5h | HIGH |
| **SkeletonLoader.jsx** | ✅ Uses shadcn Skeleton | No changes needed | 1 | 0h | SKIP |
| **StatCard.jsx** | ✅ **EXCELLENT** - Already uses design system | No changes needed | 1 | 0h | SKIP |
| **HeatmapCalendar.jsx** | Complex grid, hardcoded colors | Replace colors with design tokens | 3 | 5-6h | MEDIUM |

**Total Component Refactoring**: 36-49 hours

---

## 3. Design System Gaps & Opportunities

### Missing Components (Should Create)
1. **StatusBadge** - Consolidate all status indicators (active, paused, completed, milestone)
   - Variants: program-status, week-status, session-status
   - Auto-icon selection based on status
   - Estimated: 3-4 hours

2. **MetadataRow** - Reusable metadata display (duration • poses • difficulty)
   - Icon + text pattern
   - Dot separator utility
   - Estimated: 2-3 hours

3. **ActionCard** - Interactive card with consistent hover states
   - Replaces 8+ custom card implementations
   - Built on design system Card
   - Estimated: 4-5 hours

4. **FormSection** - Collapsible section pattern (Settings screen)
   - Accordion-like behavior
   - Consistent spacing
   - Estimated: 3-4 hours

### shadcn/ui Integration Opportunities
- **Replace custom CategoryTabs** → shadcn Tabs or DropdownMenu (↓30 lines)
- **Replace custom dialogs** → shadcn Dialog (↓50 lines in Settings)
- **Use shadcn Alert** for info boxes (↓20 lines across screens)
- **Use shadcn Separator** for dividers (↓15 lines)

**Total Gap Filling**: 12-16 hours

---

## 4. Priority Matrix (High/Low Impact vs Effort)

### 🟢 High Impact, Low Effort (DO FIRST - Quick Wins)
**Week 1 Focus - 38-46 hours**

1. **Global Color Replacement** (6-8h)
   - Find/replace hardcoded colors with design tokens
   - `bg-sage-50` → Use Card variant="sage"
   - `text-sage-900` → Use Text variant with semantic colors
   - **Files**: All screens
   - **Impact**: Immediate consistency across app

2. **Button Standardization** (8-10h)
   - Replace all `<button>` with design system Button
   - Consolidate className strings
   - **Files**: Welcome (8 buttons), Sessions (12 buttons), Programs (6 buttons)
   - **Impact**: Consistent touch targets, hover states, accessibility

3. **Badge Consolidation** (6-8h)
   - Create StatusBadge component
   - Replace 15+ custom badge implementations
   - **Files**: Programs, ProgramDetail, WeekDetail, Sessions
   - **Impact**: Single source of truth for status indicators

4. **Typography Cleanup** (8-10h)
   - Replace `<h1>-<h6>` with Heading component
   - Replace `<p>` with Text component
   - **Files**: All screens with heavy text (Welcome, Settings, Insights)
   - **Impact**: Consistent font sizes, line heights, mobile scaling

5. **Card Variant Usage** (10-12h)
   - Replace `<div className="bg-white rounded-xl...">` with Card component
   - Use CardHeader, CardTitle, CardContent for structure
   - **Files**: Welcome, Programs, Settings
   - **Impact**: ↓200 lines of repeated markup

---

### 🟡 High Impact, High Effort (PLAN CAREFULLY)
**Week 2-3 Focus - 45-55 hours**

1. **Sessions.jsx Refactor** (12-14h)
   - Most complex screen (106 className instances)
   - 4 card variants (favorite, recommended, recent, custom)
   - Action buttons (edit, delete, favorite)
   - **Approach**: Build reusable patterns first, then apply
   - **Risk**: High user traffic screen, needs thorough testing

2. **SessionDetail.jsx Overhaul** (8-10h)
   - 77 className instances
   - Pose cards, metadata display, favorite integration
   - **Dependencies**: Finish SelectablePoseCard first
   - **Risk**: Medium, part of practice flow

3. **Practice.jsx Refactor** (9-11h)
   - Complex timer UI
   - Controls (play, pause, skip)
   - MoodTracker integration
   - **Dependencies**: MoodTracker cleanup first
   - **Risk**: HIGH - Core practice flow, extensive E2E tests

4. **Settings.jsx Modernization** (10-12h)
   - 126 className instances (highest count)
   - Collapsible sections (5 sections)
   - Form controls (Switch, Input, Checkbox)
   - Custom dialog
   - **Approach**: Create FormSection component first
   - **Risk**: Medium, less frequently used

5. **SelectablePoseCard Consolidation** (4-5h)
   - Merge with SessionCard pattern
   - Add selectable variant
   - Update SessionBuilder to use
   - **Risk**: Low, isolated component

---

### 🔵 Low Impact, Low Effort (BUNDLE TOGETHER)
**Sprinkle throughout Week 1-3 - 18-24 hours**

1. **BottomNav Polish** (3-4h)
   - Replace gradient with design system colors
   - Use Badge for notification dots
   - Minor cleanup

2. **MoodTracker Colors** (3-4h)
   - Replace hardcoded emoji background colors
   - Use design system color palette

3. **BreathingGuide Cleanup** (1h)
   - Minimal changes (specialized animation component)

4. **PoseImage Cleanup** (1h)
   - Minor prop consolidation

5. **FavoriteButton Refactor** (2-3h)
   - Use design system Button component
   - Standardize icon sizing

6. **Onboarding Modernization** (5-6h)
   - Use design system Card + Button
   - Consistent spacing

7. **HeatmapCalendar Colors** (5-6h)
   - Replace hardcoded heat colors with design tokens
   - Document color scale

---

### 🔴 Low Impact, High Effort (DEFER OR SKIP)
**Post-MVP - Not included in 3-week plan**

1. **FeatureTooltip Replacement** (6-8h)
   - Replace with shadcn Tooltip
   - Migration complex due to custom positioning logic
   - **Decision**: DEFER - Current implementation works well

2. **CategoryTabs Rebuild** (8-10h)
   - Replace with shadcn Tabs or DropdownMenu
   - Requires UX decision on tabs vs dropdown
   - **Decision**: DEFER - Current implementation functional

3. **SessionHistoryModal Rebuild** (6-8h)
   - Replace with shadcn Dialog
   - Moderate complexity, infrequently used
   - **Decision**: DEFER to Week 4 if time permits

---

## 5. Three-Week Sprint Plan

### 🗓️ Week 1: Foundation & Quick Wins (40-46 hours)

**Day 1-2 (Monday-Tuesday): Global Patterns** - 16-18h
- ✅ Create StatusBadge component (3-4h)
- ✅ Create MetadataRow component (2-3h)
- ✅ Create ActionCard component (4-5h)
- ✅ Document new components in Storybook/docs (2h)
- ✅ Global color token replacement (5-6h)
  - Scripts: Find/replace common patterns
  - Manual review of edge cases

**Day 3-4 (Wednesday-Thursday): Button & Typography** - 16-18h
- ✅ Welcome.jsx refactor (8-10h)
  - Replace 8 buttons with Button component
  - Typography (Heading, Text)
  - Program cards with ActionCard
  - Streak badge with StatusBadge
- ✅ Programs.jsx refactor (8-10h)
  - Replace 6 buttons
  - StatusBadge for program states
  - Progress bars (already using design system)
  - Typography cleanup

**Day 5 (Friday): Badge & Card Consolidation** - 8-10h
- ✅ Badge consolidation across all screens (6-8h)
  - Programs, ProgramDetail, WeekDetail, Sessions
  - Status indicators, difficulty badges, style badges
- ✅ Card variant usage in Settings (2h)
  - Replace divs with Card component

**Weekend Buffer**: Review, test, adjust

---

### 🗓️ Week 2: Complex Screens & Components (42-50 hours)

**Day 1 (Monday): SessionBuilder & PoseLibrary** - 11-15h
- ✅ SessionBuilder.jsx refactor (6-8h)
  - Form controls (use shadcn components)
  - Pose selection UI
  - Action buttons
- ✅ PoseLibrary.jsx refactor (5-7h)
  - Grid layout cleanup
  - Filter controls
  - Pose cards

**Day 2-3 (Tuesday-Wednesday): Sessions.jsx - CRITICAL** - 12-14h
- ✅ Day 2: Build reusable patterns (6-7h)
  - Recommended section template
  - Favorite section template
  - Custom section template
- ✅ Day 3: Apply patterns & cleanup (6-7h)
  - Replace all card markup
  - Action buttons (Edit, Delete, Favorite)
  - Category tabs integration
  - **Testing**: Extensive manual + E2E tests

**Day 4 (Thursday): SessionDetail.jsx** - 8-10h
- ✅ SelectablePoseCard consolidation (4-5h)
- ✅ SessionDetail refactor (4-5h)
  - Pose cards
  - Metadata display with MetadataRow
  - Favorite button integration

**Day 5 (Friday): Settings.jsx** - 10-12h
- ✅ Create FormSection component (3-4h)
- ✅ Settings screen refactor (7-8h)
  - 5 collapsible sections
  - Form controls (Switch, Input, Checkbox)
  - Dialog for "Clear Data" confirmation

**Weekend Buffer**: Regression testing, bug fixes

---

### 🗓️ Week 3: Practice Flow & Polishing (38-44 hours)

**Day 1-2 (Monday-Tuesday): Practice Flow - HIGH RISK** - 18-22h
- ✅ MoodTracker cleanup (3-4h)
  - Replace hardcoded colors
  - Use design system tokens
- ✅ Practice.jsx refactor (9-11h)
  - Timer UI (use Timer component)
  - Controls (Button component)
  - MoodTracker integration
  - **Testing**: Extensive E2E tests (timer, pause, skip, mood tracking)
- ✅ Complete.jsx refactor (6-7h)
  - Celebration UI
  - Stats display with StatCard
  - Action buttons

**Day 3 (Wednesday): Breathing Screens** - 9-12h
- ✅ Breathing.jsx refactor (5-7h)
  - Exercise cards
  - Duration selector
- ✅ BreathingPractice.jsx refactor (4-5h)
  - Timer UI
  - Simple controls

**Day 4 (Thursday): WeekDetail & ProgramDetail** - 13-17h
- ✅ WeekDetail.jsx refactor (7-9h)
  - Session cards
  - Notes textarea
  - Completion button
- ✅ ProgramDetail.jsx refactor (6-8h)
  - Week cards
  - Lock states
  - Milestone indicators

**Day 5 (Friday): Low-Effort Components & Final Polish** - 8-10h
- ✅ BottomNav polish (3-4h)
- ✅ FavoriteButton refactor (2-3h)
- ✅ Onboarding modernization (3h)
- ✅ Final review and testing (2h)
  - Cross-browser testing (Chrome, Safari, Firefox)
  - Mobile responsive testing (375px, 390px, 428px)
  - Accessibility audit (keyboard nav, screen readers)

**Weekend**: Final regression testing, documentation updates

---

## 6. Risk Assessment & Mitigation

### Breaking Changes Risk: LOW ✅
- **No API changes**: All refactoring is UI-only
- **No state management changes**: Zustand stores unchanged
- **Props compatibility**: New components accept similar props to current markup

### Testing Strategy

**Phase 1: Component-Level Testing** (Already covered)
- ✅ Design system components have PropTypes validation
- ✅ SessionCard already tested in multiple contexts
- ✅ StatCard, ProgramProgressCard proven in production

**Phase 2: Screen-Level Testing** (Manual + E2E)
- **Manual Testing Checklist** (per screen):
  - [ ] All buttons clickable and navigate correctly
  - [ ] Touch targets ≥ 44px
  - [ ] Text readable at 375px viewport
  - [ ] No horizontal scrolling
  - [ ] Colors match design system
  - [ ] Animations smooth (or disabled if prefers-reduced-motion)

- **E2E Test Coverage** (Playwright):
  - ✅ Practice flow (existing tests)
  - ✅ Session selection (existing tests)
  - 🆕 Add: Program enrollment flow
  - 🆕 Add: Mood tracking flow
  - 🆕 Add: Settings changes persistence

**Phase 3: Regression Testing** (End of each week)
- [ ] Run full E2E suite
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Mobile device testing (iOS Safari, Android Chrome)
- [ ] Accessibility audit (WAVE, Lighthouse)

### Rollback Plan
- **Git Strategy**: Feature branches per screen (`refactor/welcome`, `refactor/sessions`)
- **Merge Strategy**: Squash commits per screen for clean rollback points
- **Version Control**: Tag releases (`v2.0.0-refactor-week1`, etc.)

### Performance Monitoring
- **Before/After Metrics**:
  - Bundle size (expect minimal change, possibly ↓5-10KB due to deduplication)
  - Lighthouse scores (expect ↑accessibility score due to semantic components)
  - First Contentful Paint (expect no regression)
  - Time to Interactive (expect no regression)

---

## 7. Success Criteria

### Quantitative Metrics
- ✅ **100% of screens** use design system components (0% raw HTML for buttons/headings/cards)
- ✅ **0 hardcoded colors** in screen files (all use design tokens)
- ✅ **ESLint 0 errors, 0 warnings** maintained
- ✅ **Bundle size ↓5-10KB** (or no regression)
- ✅ **E2E test suite 100% passing**

### Qualitative Metrics
- ✅ **Consistent visual language** across all screens
- ✅ **Developer velocity ↑**: New features use design system by default
- ✅ **Onboarding friction ↓**: New developers understand component patterns faster
- ✅ **Accessibility ↑**: Lighthouse accessibility score ≥95 (currently ~90)

### Code Quality Metrics
- ✅ **500-700 lines removed** (measured via git diff)
- ✅ **Component reuse ↑40%** (measured via grep for common patterns)
- ✅ **Design system adoption 100%** (measured via grep for design system imports)

---

## 8. Post-Refactor Maintenance Plan

### Documentation Updates
1. **Update CLAUDE.md** with new component patterns
2. **Create COMPONENT_GUIDE.md** with usage examples
3. **Update Storybook** (if implemented) with new components

### Developer Guidelines
1. **No raw HTML elements** for UI components (buttons, headings, cards)
2. **Always use design system imports** from `/components/design-system`
3. **New components** must follow design system patterns
4. **Color usage** only via design tokens (no hardcoded hex/rgb)

### Monitoring & Metrics
1. **Weekly audits**: Run grep for hardcoded colors
2. **PR checklist**: "Uses design system components? ✅"
3. **Component inventory**: Track new components added to design system

---

## 9. Recommended Starting Point

**🎯 Start Here: Week 1, Day 1 - Foundation Components**

### Why This Order?
1. **Build foundations first** (StatusBadge, MetadataRow, ActionCard) → Enables faster refactoring of screens
2. **Quick wins establish momentum** (global color replacement) → Visible progress immediately
3. **Low-risk screens first** (Welcome, Programs) → Build confidence before tackling complex screens
4. **Complex screens mid-sprint** (Sessions, Settings) → Team is warmed up, patterns established
5. **High-risk screens late** (Practice flow) → Maximum preparation time, proven patterns

### First Action Items (Next 2 Hours)
1. ✅ Create `StatusBadge.jsx` component (1h)
   - Variants: program-status, week-status, session-status, milestone
   - Auto-icon selection based on status
   - Usage: Programs, ProgramDetail, WeekDetail

2. ✅ Create `MetadataRow.jsx` component (1h)
   - Icon + text pattern with dot separators
   - Usage: SessionCard, Welcome recent sessions, Programs

3. 🚀 **Start refactoring Welcome.jsx** (next 8-10h)
   - Immediate visual impact on landing page
   - Establishes patterns for rest of app

---

## 10. Complexity Distribution Summary

### Screens by Complexity
- **Simple (1-2)**: 2 screens → 8-10 hours
- **Moderate (3)**: 8 screens → 52-64 hours
- **Complex (4)**: 3 screens → 26-32 hours
- **Very Complex (5)**: 1 screen → 12-14 hours

### Components by Complexity
- **No Changes (0)**: 3 components → 0 hours
- **Simple (1-2)**: 7 components → 8-13 hours
- **Moderate (3)**: 5 components → 22-27 hours

### Total Breakdown
- **Screens**: 97-121 hours
- **Components**: 36-49 hours
- **New Components**: 12-16 hours
- **Buffer (10%)**: 14-19 hours

**Grand Total**: **159-205 hours** (conservative estimate)
**Aggressive 3-Week Plan**: **120-140 hours** (focused on high-impact items only)

---

## Appendices

### A. Design System Token Reference

**Colors** (from Tailwind config):
- Primary: `sage-*` (50-950)
- Accent: `accent` (#D4AF37 gold)
- Semantic: `text-primary`, `text-secondary`, `text-muted`
- Backgrounds: `bg-cream`, `bg-sage-50`, `bg-white`
- States: `state-error`, `state-success`

**Spacing** (Tailwind defaults):
- Padding: `p-2`, `p-4`, `p-6`, `p-8`
- Margin: `m-2`, `m-4`, `m-6`, `m-8`
- Gap: `gap-2`, `gap-4`, `gap-6`

**Typography**:
- Headings: Use `<Heading level={1-6} />` component
- Body: Use `<Text variant="body|secondary|muted|small|caption|large|lead" />` component
- Specialized: `<PoseName>`, `<Timer>`, `<Label>`, `<Quote>`

**Components**:
- Buttons: `<Button variant="primary|secondary|ghost|outline|destructive|link" size="sm|default|lg" />`
- Cards: `<Card variant="default|elevated|outlined|glass|sage|cream" padding="none|xs|sm|default|lg|xl" />`
- Badges: `<Badge variant="default|success|warning|error|secondary|gold" size="sm|default|lg" />`

### B. Before/After Examples

**Before (Welcome.jsx)**:
```jsx
<button
  onClick={() => navigate('/sessions')}
  className="mb-8 text-sage-600 hover:text-sage-700 font-medium text-sm flex items-center gap-1 transition-colors"
>
  Browse All Sessions
  <ChevronRight className="h-4 w-4" />
</button>
```

**After**:
```jsx
<Button
  onClick={() => navigate('/sessions')}
  variant="link"
  size="sm"
  icon={<ChevronRight />}
  iconPosition="right"
  className="mb-8"
>
  Browse All Sessions
</Button>
```

**Before (Programs.jsx)**:
```jsx
<div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-sage-100">
  <div className="flex items-start gap-3">
    <BookOpen className="h-6 w-6 text-sage-600 flex-shrink-0 mt-1" />
    <div>
      <h2 className="text-lg font-medium text-sage-900 mb-2">
        Begin Your Journey
      </h2>
      <p className="text-sm text-sage-700 leading-relaxed">
        Choose a multi-week program...
      </p>
    </div>
  </div>
</div>
```

**After**:
```jsx
<Card variant="default" padding="default" className="mb-6">
  <CardHeader>
    <div className="flex items-start gap-3">
      <Icon component={BookOpen} className="mt-1" />
      <div>
        <CardTitle as="h2">Begin Your Journey</CardTitle>
        <CardDescription>
          Choose a multi-week program...
        </CardDescription>
      </div>
    </div>
  </CardHeader>
</Card>
```

### C. Grep Commands for Auditing

```bash
# Count hardcoded className instances per screen
grep -r "className=" src/screens/*.jsx | wc -l

# Find hardcoded colors
grep -r "bg-\|text-\|border-" src/screens/*.jsx | wc -l

# Find raw HTML button elements
grep -r "<button" src/screens/*.jsx | wc -l

# Find raw HTML heading elements
grep -r "<h[1-6]" src/screens/*.jsx | wc -l

# Audit design system usage
grep -r "from.*design-system" src/screens/*.jsx | wc -l
```

### D. Decision Log

**Decision 1**: Use custom design system over pure shadcn/ui
- **Rationale**: Custom system already established, mobile-optimized, matches brand
- **Trade-off**: Maintain custom components vs leverage shadcn community
- **Outcome**: Hybrid approach - keep custom, augment with shadcn where beneficial

**Decision 2**: Defer FeatureTooltip replacement
- **Rationale**: Custom positioning logic complex, current implementation works well
- **Trade-off**: Consistency vs risk of breaking tooltip system
- **Outcome**: Keep current implementation, document as exception

**Decision 3**: Aggressive 3-week timeline
- **Rationale**: Focus on high-impact changes only, defer low-impact/high-effort items
- **Trade-off**: Complete coverage vs sustainable pace
- **Outcome**: 120-140 hour estimate focuses on 80% of value

**Decision 4**: Feature branches per screen
- **Rationale**: Clean rollback points, easier code review
- **Trade-off**: More PR overhead vs granular control
- **Outcome**: Merge screens independently, squash commits for clean history

---

**End of Refactoring Plan**
*Generated with systematic PDDL-inspired analysis*
*Ready for team review and sprint planning*
