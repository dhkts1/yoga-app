# Design System Components - Usage Guide

## Overview
Four new design system components following "Breathe First, Features Later" philosophy with calming sage green, cream, and gold color palette.

## Components

### 1. Badge Component
**File**: `/src/components/design-system/Badge.jsx`

**Purpose**: Status indicators, difficulty levels, yoga styles, and semantic tags.

**Variants**:
- **Status**: `status-active`, `status-paused`, `status-completed`, `status-not-started`
- **Difficulty**: `difficulty-beginner`, `difficulty-intermediate`, `difficulty-advanced`, `difficulty-mixed`
- **Style**: `style-iyengar`, `style-vinyasa`, `style-hatha`, `style-restorative`
- **Semantic**: `success`, `warning`, `error`, `info`, `default`

**Sizes**: `sm`, `default`, `lg`

**Props**:
```javascript
{
  variant: string,          // See variants above
  size: 'sm' | 'default' | 'lg',
  icon: ReactNode,          // Optional icon
  iconPosition: 'left' | 'right',
  onClick: function,        // Makes badge clickable with 44px touch target
  className: string         // Additional styles
}
```

**Usage Examples**:

```jsx
import { Badge } from '@/components/design-system';
import { Award, Clock } from 'lucide-react';

// Program status badges
<Badge variant="status-active">Active</Badge>
<Badge variant="status-paused">Paused</Badge>
<Badge variant="status-completed" icon={<Award className="w-3 h-3" />}>
  Completed
</Badge>

// Difficulty indicators
<Badge variant="difficulty-beginner" size="sm">Beginner</Badge>
<Badge variant="difficulty-intermediate">Intermediate</Badge>
<Badge variant="difficulty-advanced" size="lg">Advanced</Badge>

// Yoga style badges
<Badge variant="style-iyengar">Iyengar</Badge>
<Badge variant="style-vinyasa">Vinyasa Flow</Badge>
<Badge variant="style-restorative">Restorative</Badge>

// Clickable badges
<Badge
  variant="info"
  icon={<Clock className="w-3 h-3" />}
  onClick={() => console.log('Badge clicked')}
>
  10 weeks
</Badge>

// With icon on right
<Badge
  variant="success"
  icon={<Award className="w-3 h-3" />}
  iconPosition="right"
>
  Milestone Week
</Badge>
```

**Color Mapping**:
- Active: Sage (#8FA68E)
- Paused: Amber
- Completed: Green
- Not Started: Gray
- Beginner: Blue
- Intermediate: Purple
- Advanced: Red
- Iyengar: Sage
- Vinyasa: Gold
- Restorative: Purple

---

### 2. Stat Component
**File**: `/src/components/design-system/Stat.jsx`

**Purpose**: Display analytics and statistics with optional trend indicators.

**Variants**: `default`, `highlight`, `compact`

**Props**:
```javascript
{
  variant: 'default' | 'highlight' | 'compact',
  value: string | number,     // Main statistic value (required)
  label: string,              // Description label (required)
  icon: ReactNode,            // Optional icon
  trend: 'up' | 'down' | 'neutral',
  trendValue: string,         // e.g., "+15%"
  description: string,        // Additional context
  animate: boolean,           // Framer Motion animations (default: true)
  className: string
}
```

**Usage Examples**:

```jsx
import { Stat, StatGrid } from '@/components/design-system';
import { Flame, Heart, Calendar, Trophy } from 'lucide-react';

// Single stat
<Stat
  value="7 days"
  label="Current Streak"
  icon={<Flame className="w-5 h-5" />}
  trend="up"
  trendValue="+2"
/>

// Highlighted stat (sage background)
<Stat
  variant="highlight"
  value="42"
  label="Total Sessions"
  icon={<Trophy className="w-5 h-5" />}
  description="Across all programs"
/>

// Compact stat
<Stat
  variant="compact"
  value="85%"
  label="Completion Rate"
  trend="neutral"
/>

// Stat grid for dashboard layouts
<StatGrid columns={3} gap="lg">
  <Stat
    value="7 days"
    label="Current Streak"
    icon={<Flame className="w-5 h-5" />}
    trend="up"
  />
  <Stat
    value="4.2"
    label="Avg Mood Improvement"
    icon={<Heart className="w-5 h-5" />}
    trend="up"
    trendValue="+0.3"
  />
  <Stat
    value="3 weeks"
    label="Practice Duration"
    icon={<Calendar className="w-5 h-5" />}
  />
</StatGrid>

// No animation (for static displays)
<Stat
  value="12 min"
  label="Average Session"
  animate={false}
/>
```

**StatGrid Props**:
```javascript
{
  columns: 1 | 2 | 3 | 4,     // Responsive grid columns
  gap: 'sm' | 'default' | 'lg',
  children: ReactNode
}
```

---

### 3. Tab Component
**File**: `/src/components/design-system/Tab.jsx`

**Purpose**: Accessible tabbed navigation with multiple visual styles.

**Variants**: `pills`, `underline`, `buttons`

**Props**:
```javascript
{
  tabs: Array<string | {     // Tab configuration (required)
    label: string,
    value: string,
    icon?: ReactNode,
    count?: number
  }>,
  activeTab: string,          // Current active tab (required)
  onTabChange: function,      // Tab change handler (required)
  variant: 'pills' | 'underline' | 'buttons',
  fullWidth: boolean,         // Stretch tabs to full width
  scrollable: boolean,        // Enable horizontal scrolling (default: true)
  className: string
}
```

**Usage Examples**:

```jsx
import { Tab, TabPanel } from '@/components/design-system';
import { Calendar, Heart, TrendingUp } from 'lucide-react';
import { useState } from 'react';

// Simple string tabs (pills variant)
const [activeTab, setActiveTab] = useState('sessions');

<Tab
  tabs={['sessions', 'programs', 'breathing']}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="pills"
/>

// Tabs with icons and counts
<Tab
  tabs={[
    {
      label: 'Sessions',
      value: 'sessions',
      icon: <Calendar className="w-4 h-4" />,
      count: 12
    },
    {
      label: 'Favorites',
      value: 'favorites',
      icon: <Heart className="w-4 h-4" />,
      count: 5
    },
    {
      label: 'Analytics',
      value: 'analytics',
      icon: <TrendingUp className="w-4 h-4" />
    }
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="underline"
/>

// Button variant with full width
<Tab
  tabs={['Beginner', 'Intermediate', 'Advanced']}
  activeTab={difficulty}
  onTabChange={setDifficulty}
  variant="buttons"
  fullWidth
/>

// With TabPanel for content
<div>
  <Tab
    tabs={['Overview', 'Progress', 'Insights']}
    activeTab={activeTab}
    onTabChange={setActiveTab}
    variant="pills"
  />

  <TabPanel value="overview" activeTab={activeTab}>
    <p>Overview content...</p>
  </TabPanel>

  <TabPanel value="progress" activeTab={activeTab} animate={false}>
    <p>Progress content...</p>
  </TabPanel>

  <TabPanel value="insights" activeTab={activeTab}>
    <p>Insights content...</p>
  </TabPanel>
</div>
```

**TabPanel Props**:
```javascript
{
  value: string,              // Panel identifier
  activeTab: string,          // Current active tab
  children: ReactNode,
  animate: boolean,           // Fade-in animation (default: true)
  className: string
}
```

**Accessibility Features**:
- Full ARIA role/state support (`role="tab"`, `aria-selected`, etc.)
- Keyboard navigation (Enter/Space to activate)
- Proper focus management
- TabPanel auto-hides when not active

---

### 4. EmptyState Component
**File**: `/src/components/design-system/EmptyState.jsx`

**Purpose**: Calming empty state displays with encouragement and actions.

**Variants**: `default`, `sage`, `muted`

**Sizes**: `sm`, `default`, `lg`

**Props**:
```javascript
{
  variant: 'default' | 'sage' | 'muted',
  size: 'sm' | 'default' | 'lg',
  icon: ReactNode,            // Icon display (rounded background)
  illustration: ReactNode,    // Custom illustration/SVG
  title: string,              // Main heading
  description: string,        // Supporting text
  action: {                   // Primary action button
    label: string,
    onClick: function,
    variant?: string,         // Button variant
    size?: string,            // Button size
    icon?: ReactNode
  },
  secondaryAction: {          // Secondary action button
    label: string,
    onClick: function,
    variant?: string,
    size?: string,
    icon?: ReactNode
  },
  animate: boolean,           // Staggered animations (default: true)
  className: string
}
```

**Usage Examples**:

```jsx
import { EmptyState } from '@/components/design-system';
import { Calendar, Plus, Search, Heart } from 'lucide-react';

// No sessions yet
<EmptyState
  icon={<Calendar className="w-8 h-8" />}
  title="No sessions yet"
  description="Start your mindful yoga journey by completing your first session."
  action={{
    label: 'Start First Session',
    onClick: () => navigate('/sessions'),
    icon: <Plus className="w-4 h-4" />
  }}
/>

// No search results (compact)
<EmptyState
  size="sm"
  variant="muted"
  icon={<Search className="w-6 h-6" />}
  title="No results found"
  description="Try adjusting your search terms"
/>

// Program completion encouragement
<EmptyState
  size="lg"
  variant="sage"
  icon={<Heart className="w-10 h-10" />}
  title="You're doing great!"
  description="Complete this week's sessions to unlock the next milestone in your journey."
  action={{
    label: 'Continue Practice',
    onClick: () => navigate('/programs/current'),
    variant: 'primary'
  }}
  secondaryAction={{
    label: 'View Progress',
    onClick: () => navigate('/insights'),
    variant: 'ghost'
  }}
/>

// With custom illustration
<EmptyState
  illustration={
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Custom SVG illustration */}
    </svg>
  }
  title="Take a moment"
  description="Breathe deeply and center yourself before beginning."
  action={{
    label: 'Begin Session',
    onClick: handleStart
  }}
  animate={false}
/>
```

**Animation Details**:
- Staggered reveal: icon → title → description → actions
- Icon scales in with spring easing
- Content fades up with gentle timing
- Can be disabled with `animate={false}`

---

## Design Tokens Used

All components use tokens from `/Users/gil/git/yoga-app/tailwind.config.js`:

**Colors**:
- Sage: `sage-50` through `sage-900` (primary: `#8FA68E`)
- Cream: `cream-50` through `cream-900` (primary: `#F5F3F0`)
- Gold: `gold-50` through `gold-900` (primary: `#D4AF37`)
- State: `state-success`, `state-warning`, `state-error`, `state-info`

**Spacing**:
- Touch targets: `min-h-touch` (44px), `min-w-touch` (44px)
- Safe areas: `safe-top`, `safe-bottom`, `safe-left`, `safe-right`

**Transitions**:
- `ease-gentle`: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- `ease-calm`: `cubic-bezier(0.23, 1, 0.32, 1)`

**Shadows**:
- `shadow-sage`: Sage-tinted shadow
- `shadow-sage-lg`: Larger sage shadow

---

## Mobile-First Principles

All components follow mobile-first design:

1. **Touch Targets**: Minimum 44px when interactive
2. **Responsive Sizing**: Mobile → tablet → desktop progression
3. **Scrollable Tabs**: Horizontal scroll on mobile (hidden scrollbar)
4. **Flexible Badges**: Full-width on mobile via parent containers
5. **Stat Grids**: 1 column → 2 columns → 3/4 columns
6. **EmptyState**: Compact spacing on small screens

---

## Accessibility Features

- **ARIA roles/states**: All interactive components
- **Keyboard navigation**: Tab focus, Enter/Space activation
- **Focus indicators**: Visible focus rings (sage-500)
- **Semantic HTML**: Proper heading hierarchy, button elements
- **Color contrast**: WCAG AA compliant (text on backgrounds)
- **Reduced motion**: Animations respect `prefers-reduced-motion`

---

## Import Patterns

```javascript
// Named imports (recommended)
import { Badge, Stat, Tab, EmptyState } from '@/components/design-system';

// Individual imports
import { Badge } from '@/components/design-system/Badge';
import { Stat, StatGrid } from '@/components/design-system/Stat';
import { Tab, TabPanel } from '@/components/design-system/Tab';
import { EmptyState } from '@/components/design-system/EmptyState';
```

---

## Integration Examples

### Program Status Display
```jsx
<div className="flex items-center gap-2">
  <Badge variant={`status-${program.status}`}>
    {program.status}
  </Badge>
  <Badge variant={`style-${program.style}`}>
    {program.style}
  </Badge>
  <Badge variant={`difficulty-${program.difficulty}`} size="sm">
    {program.difficulty}
  </Badge>
</div>
```

### Analytics Dashboard
```jsx
<StatGrid columns={3}>
  <Stat
    value={streakDays}
    label="Day Streak"
    icon={<Flame />}
    trend={streakTrend}
    trendValue={`+${streakIncrease}`}
  />
  <Stat
    variant="highlight"
    value={totalSessions}
    label="Total Sessions"
    icon={<Calendar />}
  />
  <Stat
    value={avgMoodImprovement.toFixed(1)}
    label="Mood Improvement"
    icon={<Heart />}
    trend="up"
  />
</StatGrid>
```

### Session Filtering
```jsx
const [category, setCategory] = useState('all');

<Tab
  tabs={[
    { label: 'All', value: 'all', count: sessions.length },
    { label: 'Yoga', value: 'yoga', count: yogaSessions.length },
    { label: 'Breathing', value: 'breathing', count: breathingSessions.length }
  ]}
  activeTab={category}
  onTabChange={setCategory}
  variant="pills"
  fullWidth
/>
```

### Empty Program List
```jsx
{programs.length === 0 ? (
  <EmptyState
    icon={<Calendar className="w-8 h-8" />}
    title="No programs available"
    description="Check back soon for structured multi-week yoga programs."
    action={{
      label: 'Explore Sessions',
      onClick: () => navigate('/sessions')
    }}
  />
) : (
  <ProgramGrid programs={programs} />
)}
```

---

## Testing

All components pass ESLint with zero errors and include:
- PropTypes validation
- forwardRef support
- Proper displayName
- Accessibility attributes
- Mobile-safe dimensions

Run lint check:
```bash
npm run lint -- src/components/design-system/Badge.jsx
npm run lint -- src/components/design-system/Stat.jsx
npm run lint -- src/components/design-system/Tab.jsx
npm run lint -- src/components/design-system/EmptyState.jsx
```

---

**Created**: October 2025
**Philosophy**: "Breathe First, Features Later" - Calming, accessible, mobile-first design
