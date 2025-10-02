# New APIs Quick Reference
**For Developers**: Quick copy-paste examples for new components, hooks, and utilities

---

## 🎨 Design System Components

### Badge Component
**Location**: `/src/components/design-system/Badge.jsx`

```jsx
import { Badge } from '@/components/design-system';
import { Play, Award, Clock } from 'lucide-react';

// Status badges
<Badge variant="status-active">Active</Badge>
<Badge variant="status-paused">Paused</Badge>
<Badge variant="status-completed" icon={<Award />}>Completed</Badge>

// Difficulty badges
<Badge variant="difficulty-beginner" size="sm">Beginner</Badge>
<Badge variant="difficulty-intermediate">Intermediate</Badge>
<Badge variant="difficulty-advanced">Advanced</Badge>

// Yoga style badges
<Badge variant="style-iyengar">Iyengar</Badge>
<Badge variant="style-vinyasa">Vinyasa Flow</Badge>

// Semantic badges
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>

// Clickable badge (44px touch target)
<Badge variant="info" icon={<Clock />} onClick={handleClick}>
  10 weeks
</Badge>

// Icon on right
<Badge variant="success" icon={<Award />} iconPosition="right">
  Milestone
</Badge>
```

**Props**:
```typescript
{
  variant: 'status-active' | 'status-paused' | 'status-completed' | 'status-not-started' |
           'difficulty-beginner' | 'difficulty-intermediate' | 'difficulty-advanced' | 'difficulty-mixed' |
           'style-iyengar' | 'style-vinyasa' | 'style-hatha' | 'style-restorative' |
           'success' | 'warning' | 'error' | 'info' | 'default',
  size: 'sm' | 'default' | 'lg',
  icon: ReactNode,
  iconPosition: 'left' | 'right',
  onClick: () => void,
  className: string
}
```

---

### Stat Component
**Location**: `/src/components/design-system/Stat.jsx`

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
/>

// Stat grid (responsive 1→2→3 columns)
<StatGrid columns={3} gap="lg">
  <Stat value="7 days" label="Streak" icon={<Flame />} trend="up" />
  <Stat value="4.2" label="Mood Improvement" icon={<Heart />} trend="up" />
  <Stat value="3 weeks" label="Practice Duration" icon={<Calendar />} />
</StatGrid>

// Without animation
<Stat value="12 min" label="Avg Session" animate={false} />
```

**Props**:
```typescript
Stat {
  variant: 'default' | 'highlight' | 'compact',
  value: string | number,
  label: string,
  icon: ReactNode,
  trend: 'up' | 'down' | 'neutral',
  trendValue: string,
  description: string,
  animate: boolean,
  className: string
}

StatGrid {
  columns: 1 | 2 | 3 | 4,
  gap: 'sm' | 'default' | 'lg',
  children: ReactNode
}
```

---

### Tab Component
**Location**: `/src/components/design-system/Tab.jsx`

```jsx
import { Tab, TabPanel } from '@/components/design-system';
import { Calendar, Heart, TrendingUp } from 'lucide-react';
import { useState } from 'react';

const [activeTab, setActiveTab] = useState('sessions');

// Simple string tabs
<Tab
  tabs={['sessions', 'programs', 'breathing']}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="pills"
/>

// Tabs with icons and counts
<Tab
  tabs={[
    { label: 'Sessions', value: 'sessions', icon: <Calendar />, count: 12 },
    { label: 'Favorites', value: 'favorites', icon: <Heart />, count: 5 },
    { label: 'Analytics', value: 'analytics', icon: <TrendingUp /> }
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="underline"
  fullWidth
/>

// Button variant
<Tab
  tabs={['Beginner', 'Intermediate', 'Advanced']}
  activeTab={difficulty}
  onTabChange={setDifficulty}
  variant="buttons"
/>

// With TabPanels for content
<>
  <Tab
    tabs={['Overview', 'Progress', 'Insights']}
    activeTab={activeTab}
    onTabChange={setActiveTab}
    variant="pills"
  />

  <TabPanel value="overview" activeTab={activeTab}>
    <OverviewContent />
  </TabPanel>

  <TabPanel value="progress" activeTab={activeTab}>
    <ProgressContent />
  </TabPanel>

  <TabPanel value="insights" activeTab={activeTab} animate={false}>
    <InsightsContent />
  </TabPanel>
</>
```

**Props**:
```typescript
Tab {
  tabs: Array<string | {
    label: string,
    value: string,
    icon?: ReactNode,
    count?: number
  }>,
  activeTab: string,
  onTabChange: (tab: string) => void,
  variant: 'pills' | 'underline' | 'buttons',
  fullWidth: boolean,
  scrollable: boolean,
  className: string
}

TabPanel {
  value: string,
  activeTab: string,
  children: ReactNode,
  animate: boolean,
  className: string
}
```

---

### EmptyState Component
**Location**: `/src/components/design-system/EmptyState.jsx`

```jsx
import { EmptyState } from '@/components/design-system';
import { Calendar, Plus, Search, Heart } from 'lucide-react';

// Basic empty state
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

// Compact (no search results)
<EmptyState
  size="sm"
  variant="muted"
  icon={<Search className="w-6 h-6" />}
  title="No results found"
  description="Try adjusting your search terms"
/>

// Large with secondary action
<EmptyState
  size="lg"
  variant="sage"
  icon={<Heart className="w-10 h-10" />}
  title="You're doing great!"
  description="Complete this week's sessions to unlock the next milestone."
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
  illustration={<CustomSVG />}
  title="Take a moment"
  description="Breathe deeply and center yourself."
  action={{ label: 'Begin', onClick: handleStart }}
  animate={false}
/>
```

**Props**:
```typescript
{
  variant: 'default' | 'sage' | 'muted',
  size: 'sm' | 'default' | 'lg',
  icon: ReactNode,
  illustration: ReactNode,
  title: string,
  description: string,
  action: {
    label: string,
    onClick: () => void,
    variant?: string,
    size?: string,
    icon?: ReactNode
  },
  secondaryAction: {
    label: string,
    onClick: () => void,
    variant?: string,
    size?: string,
    icon?: ReactNode
  },
  animate: boolean,
  className: string
}
```

---

## 🏷️ Badge Utilities

### StatusBadge Component (Recommended)
**Location**: `/src/components/design-system/StatusBadge.jsx`

```jsx
import { StatusBadge } from '@/components/design-system';

// Program status
<StatusBadge type="programStatus" value="active" />
<StatusBadge type="programStatus" value="paused" />
<StatusBadge type="programStatus" value="completed" />
<StatusBadge type="programStatus" value="not-started" />

// Difficulty
<StatusBadge type="difficulty" value="beginner" />
<StatusBadge type="difficulty" value="intermediate" />
<StatusBadge type="difficulty" value="advanced" />

// Yoga style
<StatusBadge type="style" value="iyengar" />
<StatusBadge type="style" value="vinyasa" />
<StatusBadge type="style" value="hatha" />

// Week status (complex state)
<StatusBadge
  type="weekStatus"
  value={{
    isCompleted: true,
    isCurrent: false,
    isActive: true,
    isUnlocked: true
  }}
/>

// Breathing category
<StatusBadge type="category" value="calming" />
<StatusBadge type="category" value="energizing" />
```

**Props**:
```typescript
{
  type: 'programStatus' | 'difficulty' | 'style' | 'weekStatus' | 'category',
  value: string | {
    isCompleted: boolean,
    isCurrent: boolean,
    isActive: boolean,
    isUnlocked: boolean
  }
}
```

---

### Badge Utility Functions (Advanced)
**Location**: `/src/utils/badges.js`

```jsx
import { Badge } from '@/components/ui/badge';
import {
  getProgramStatusBadge,
  getWeekStatusBadge,
  getDifficultyBadge,
  getStyleBadge,
  getCategoryColors,
  getCategoryBadge
} from '@/utils/badges';

// Get badge config
const statusConfig = getProgramStatusBadge('active');
// Returns: { className, Icon, iconProps, children }

// Render badge
const { Icon, iconProps, children, className } = statusConfig;
<Badge className={className}>
  {Icon && <Icon {...iconProps} />}
  {children}
</Badge>

// Week status (returns null if no badge needed)
const weekConfig = getWeekStatusBadge({
  isCompleted: false,
  isCurrent: true,
  isActive: true,
  isUnlocked: true
});

if (weekConfig) {
  const { Icon, iconProps, children, className } = weekConfig;
  <Badge className={className}>
    {Icon && <Icon {...iconProps} />}
    {children}
  </Badge>
}

// Breathing category colors (inline styling)
const { bg, text } = getCategoryColors('calming');
<span className={`${bg} ${text} px-3 py-1 rounded-full text-sm`}>
  Calming
</span>

// All utilities at once
import { badgeUtils } from '@/utils/badges';
const config = badgeUtils.getDifficultyBadge('beginner');
```

**API**:
```typescript
getProgramStatusBadge(status: 'active' | 'paused' | 'completed' | 'not-started'): BadgeConfig

getWeekStatusBadge({
  isCompleted: boolean,
  isCurrent: boolean,
  isActive: boolean,
  isUnlocked: boolean
}): BadgeConfig | null

getDifficultyBadge(difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed'): BadgeConfig

getStyleBadge(style: 'iyengar' | 'vinyasa' | 'hatha' | 'restorative'): BadgeConfig

getCategoryColors(category: 'calming' | 'relaxing' | 'energizing' | 'balancing'): {
  bg: string,
  text: string
}

getCategoryBadge(category: 'calming' | 'relaxing' | 'energizing' | 'balancing'): BadgeConfig

// BadgeConfig type
{
  className: string,
  Icon?: LucideIcon,
  iconProps?: { className: string },
  children: string,
  variant?: string
}
```

---

## 🪝 Custom Hooks

### useLocalStorage Hook
**Location**: `/src/hooks/useLocalStorage.js`

```jsx
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEffect } from 'react';

// Basic usage
const [value, setValue, removeValue, error] = useLocalStorage('myKey', defaultValue);

// Draft auto-save
const [draft, setDraft, clearDraft] = useLocalStorage('sessionBuilderDraft', {
  name: '',
  poses: []
});

const [name, setName] = useState(draft.name || '');
const [poses, setPoses] = useState(draft.poses || []);

useEffect(() => {
  setDraft({
    name,
    poses,
    lastModified: new Date().toISOString()
  });
}, [name, poses, setDraft]);

// User preferences
const [settings, setSettings] = useLocalStorage('appSettings', {
  voiceEnabled: true,
  personality: 'gentle',
  theme: 'light'
});

const toggleVoice = () => {
  setSettings(prev => ({ ...prev, voiceEnabled: !prev.voiceEnabled }));
};

// Functional updates (like setState)
const [count, setCount] = useLocalStorage('counter', 0);
setCount(prev => prev + 1);

// Remove value
const [token, setToken, removeToken] = useLocalStorage('authToken', null);
const logout = () => {
  removeToken();
  navigate('/login');
};

// Error handling
const [data, setData, remove, error] = useLocalStorage('myData', []);
if (error) {
  console.error('localStorage error:', error);
}
```

**API**:
```typescript
useLocalStorage<T>(
  key: string,
  initialValue: T
): [
  value: T,
  setValue: (value: T | ((prev: T) => T)) => void,
  removeValue: () => void,
  error: Error | null
]
```

**Features**:
- ✅ Automatic JSON serialization/deserialization
- ✅ Multi-tab synchronization (storage events)
- ✅ Graceful error handling (corrupted data)
- ✅ SSR-safe (checks for window/localStorage)
- ✅ Functional updates supported
- ✅ Stable setValue reference (useCallback)

---

### useCustomSessions Hook
**Location**: `/src/hooks/useCustomSessions.js`

```jsx
import useCustomSessions from '@/hooks/useCustomSessions';

const {
  // State
  sessions,    // All custom sessions (always array)
  isLoading,   // True during initial load
  error,       // Last error or null

  // Methods
  getAll,      // Get all sessions
  getById,     // Get single session
  add,         // Add new session
  update,      // Update existing
  remove       // Delete session
} = useCustomSessions();

// Display all sessions
{sessions.map(session => (
  <SessionCard key={session.id} session={session} />
))}

// Get single session
const session = getById('custom-123');
if (session) {
  console.log(session.name);
}

// Add new session
try {
  add({
    id: 'custom-123',
    name: 'Morning Flow',
    poses: [{ poseId: 'warrior1', duration: 30 }],
    duration: 10,
    // ... other fields
  });
} catch (error) {
  console.error('Failed to add:', error.message);
  // Possible errors:
  // - "Invalid session object"
  // - "Session must have an ID"
  // - "Session with ID already exists"
}

// Update session
const success = update('custom-123', {
  name: 'Updated Morning Flow',
  description: 'New description'
});

if (success) {
  console.log('Updated successfully');
} else {
  console.log('Session not found');
}

// Delete session
const handleDelete = (sessionId) => {
  if (confirm('Delete this session?')) {
    const success = remove(sessionId);
    if (!success) {
      alert('Session not found');
    }
  }
};

// Loading state
if (isLoading) {
  return <LoadingSpinner />;
}

// Error state
if (error) {
  return <ErrorMessage error={error} />;
}
```

**API**:
```typescript
useCustomSessions(): {
  sessions: Array<CustomSession>,
  isLoading: boolean,
  error: Error | null,
  getAll: () => Array<CustomSession>,
  getById: (id: string) => CustomSession | null,
  add: (session: CustomSession) => void,
  update: (id: string, updates: Partial<CustomSession>) => boolean,
  remove: (id: string) => boolean
}
```

---

## 🎨 Design Tokens

### Colors

```jsx
// Import design tokens (if needed)
import { colors } from '@/design-system/tokens';

// Sage (primary)
className="bg-sage-50 text-sage-900"
className="border-sage-300 hover:bg-sage-100"

// Cream (backgrounds)
className="bg-cream-50 text-sage-900"

// Gold (accent)
className="bg-gold text-white"
className="border-gold/20"

// State colors
className="text-state-success"
className="bg-state-error/10"
className="border-state-warning"
```

### Spacing

```jsx
// Touch targets
className="min-h-touch min-w-touch" // 44px

// Safe areas (iOS)
className="pt-safe pb-safe" // env(safe-area-inset-*)

// Standard gaps
className="gap-2 gap-4 gap-6 gap-8"
className="p-2 p-4 p-6 p-8"
```

### Animations

```jsx
// Transition easings
className="transition-all ease-gentle duration-300"
className="transition-transform ease-calm duration-500"

// Shadows
className="shadow-sage hover:shadow-sage-lg"
```

---

## 📦 Import Cheat Sheet

```javascript
// Design System Components (all in one)
import {
  Badge, Stat, StatGrid, Tab, TabPanel, EmptyState,
  Button, Card, Typography, Container, Progress, Icon
} from '@/components/design-system';

// Badge Utilities
import { StatusBadge } from '@/components/design-system';
import { getProgramStatusBadge, getDifficultyBadge } from '@/utils/badges';

// Custom Hooks
import { useLocalStorage } from '@/hooks/useLocalStorage';
import useCustomSessions from '@/hooks/useCustomSessions';
import useFavorites from '@/hooks/useFavorites';
import useMoodTracking from '@/hooks/useMoodTracking';
import usePracticeTimer from '@/hooks/usePracticeTimer';

// shadcn/ui Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

// Icons
import { Play, Pause, CheckCircle2, Lock, Award } from 'lucide-react';
```

---

## 🚀 Common Patterns

### Program Status Display
```jsx
<div className="flex items-center gap-2">
  <StatusBadge type="programStatus" value={programStatus} />
  <StatusBadge type="style" value={program.style} />
  <StatusBadge type="difficulty" value={program.difficulty} />
</div>
```

### Analytics Dashboard
```jsx
<StatGrid columns={3} gap="lg">
  <Stat
    value={streakDays}
    label="Day Streak"
    icon={<Flame />}
    trend="up"
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

### Tabbed Navigation
```jsx
const [activeTab, setActiveTab] = useState('all');

<Tab
  tabs={[
    { label: 'All', value: 'all', count: allSessions.length },
    { label: 'Yoga', value: 'yoga', count: yogaSessions.length },
    { label: 'Breathing', value: 'breathing', count: breathingSessions.length }
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="pills"
  fullWidth
/>

<TabPanel value="all" activeTab={activeTab}>
  <SessionsList sessions={allSessions} />
</TabPanel>
```

### Empty States
```jsx
{sessions.length === 0 ? (
  <EmptyState
    icon={<Calendar className="w-8 h-8" />}
    title="No sessions yet"
    description="Create your first custom session to get started."
    action={{
      label: 'Create Session',
      onClick: () => navigate('/sessions/builder'),
      icon: <Plus />
    }}
  />
) : (
  <SessionGrid sessions={sessions} />
)}
```

### Draft Auto-save
```jsx
const [draft, setDraft, clearDraft] = useLocalStorage('builderDraft', {
  name: '',
  poses: []
});

const [name, setName] = useState(draft.name);
const [poses, setPoses] = useState(draft.poses);

useEffect(() => {
  setDraft({ name, poses, lastModified: new Date().toISOString() });
}, [name, poses, setDraft]);

const handleSave = () => {
  // Save logic
  clearDraft(); // Clear draft after successful save
};
```

---

## 📖 Full Documentation

For complete details, see:
- **REFACTORING_SUMMARY.md** - Comprehensive refactoring overview
- **DESIGN_SYSTEM_COMPONENTS.md** - Component usage guide with examples
- **src/hooks/README.md** - Custom hooks API reference
- **CLAUDE.md** - Project architecture and development guide

---

**Last Updated**: October 2, 2025
**Quick Reference**: Bookmark this page for fast copy-paste access to all new APIs
