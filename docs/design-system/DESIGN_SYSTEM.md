# 🧘 Mindful Yoga App - Design System

> **Philosophy**: "Breathe First, Features Later" - Every interaction should feel as natural and calming as taking a deep breath.

## Table of Contents
- [Overview](#overview)
- [Design Tokens](#design-tokens)
- [Components](#components)
- [Usage Guidelines](#usage-guidelines)
- [Accessibility](#accessibility)
- [Mobile-First Principles](#mobile-first-principles)
- [Animation Philosophy](#animation-philosophy)

## Overview

This design system is built for mindful yoga practice, prioritizing readability at arm's length, calming interactions, and accessibility. Every component follows our core philosophy of creating a breathing space in digital form.

### Key Principles
1. **Arm's Length Readability**: Minimum 18px font size
2. **Touch-Friendly**: 44px minimum touch targets
3. **Calming Aesthetics**: Sage, cream, and gold color palette
4. **Breath-Like Animations**: 300ms transitions with organic easing
5. **Mobile-First**: Optimized for yoga practice contexts

## Design Tokens

### Colors

#### Primary Palette
```javascript
// Sage Green - Primary brand color
sage: {
  50: '#F7F8F7',    // Lightest - subtle backgrounds
  500: '#8FA68E',   // Primary - buttons, accents
  600: '#758974',   // Hover states
  900: '#2A332A'    // Text on light backgrounds
}

// Warm Cream - Secondary brand color
cream: {
  100: '#F5F3F0',   // Primary cream
  300: '#E8E6E3'    // Borders, subtle accents
}

// Muted Gold - Accent color
gold: {
  500: '#D4AF37'    // Highlights, badges
}
```

#### Semantic Colors
```javascript
// Text colors for different contexts
text: {
  primary: '#2C2C2C',    // Main content
  secondary: '#6B6B6B',  // Supporting text
  sage: '#758974'        // Special text on light
}

// State colors for feedback
state: {
  success: '#10B981',
  warning: '#F59E0B',
  error: '#E8B4B8'      // Soft pink (non-alarming)
}
```

### Typography

#### Font Scale (Optimized for arm's length reading)
```javascript
fontSize: {
  'base': '18px',     // Primary reading size
  'lg': '20px',       // Pose names
  'xl': '24px',       // Section headings
  '2xl': '32px',      // Page titles
  '3xl': '48px'       // Timer display
}
```

#### Semantic Text Styles
```javascript
// Pre-defined styles for common use cases
styles: {
  body: '18px/28px normal',      // Main content
  poseName: '20px/32px medium',  // Pose titles
  timer: '48px/56px semibold',   // Timer display
  sanskrit: '16px/24px italic'   // Sanskrit names
}
```

### Spacing

#### 8px Grid System
```javascript
spacing: {
  'xs': '4px',     // Tiny gaps
  'sm': '8px',     // Small gaps
  'md': '16px',    // Default spacing
  'lg': '24px',    // Section spacing
  'xl': '32px',    // Large gaps
  'touch': '44px'  // Minimum touch target
}
```

### Animations

#### Duration & Easing
```javascript
duration: {
  normal: '300ms',    // Standard transitions
  breath: '4000ms'    // Full breath cycle
}

easing: {
  gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',  // Smooth movement
  breathe: 'cubic-bezier(0.4, 0.0, 0.2, 1)',      // Breathing rhythm
  calm: 'cubic-bezier(0.23, 1, 0.32, 1)'          // Very smooth
}
```

## Components

### Button

Calming, accessible buttons with breath-like hover states.

#### Variants
```jsx
// Primary action - sage green background
<Button variant="primary">Start Practice</Button>

// Secondary action - transparent with sage border
<Button variant="secondary">Learn More</Button>

// Ghost - minimal styling for subtle actions
<Button variant="ghost">Skip</Button>
```

#### Sizes
```jsx
<Button size="sm">Small</Button>      // 40px height
<Button size="default">Default</Button> // 48px height
<Button size="lg">Large</Button>     // 56px height
```

#### States
- **Default**: Sage background, white text
- **Hover**: Darker sage, subtle shadow
- **Active**: Scale down to 98%, darker background
- **Disabled**: 50% opacity, no interactions
- **Loading**: Spinner with reduced opacity text

### Card

Flexible containers for poses, sessions, and content.

#### Basic Usage
```jsx
<Card variant="default" padding="default" interactive>
  <CardHeader>
    <CardTitle>Mountain Pose</CardTitle>
    <CardDescription>Tadasana</CardDescription>
  </CardHeader>
  <CardContent>
    Standing pose for grounding and alignment.
  </CardContent>
</Card>
```

#### Specialized Cards
```jsx
// For pose displays
<PoseCard
  pose={poseData}
  onClick={handlePoseClick}
/>

// For session listings
<SessionCard
  session={sessionData}
  onClick={handleSessionClick}
/>
```

### Typography

Semantic typography optimized for yoga practice.

#### Headings
```jsx
<Heading level={1}>Page Title</Heading>      // 32px
<Heading level={2}>Section Title</Heading>  // 24px
<Heading level={3}>Pose Name</Heading>      // 20px
```

#### Specialized Text
```jsx
// Pose names with Sanskrit
<PoseName sanskrit="Tadasana">
  Mountain Pose
</PoseName>

// Timer display
<Timer variant="large">5:30</Timer>

// Inspirational quotes
<Quote author="Patanjali">
  Yoga is the cessation of fluctuations of the mind.
</Quote>
```

### Layout Containers

Responsive containers for consistent spacing.

#### Container Sizes
```jsx
<Container size="default">     // max-width: 1024px
<Container size="sm">          // max-width: 768px
<Container size="full">        // max-width: 100%
```

#### Layout Patterns
```jsx
// Vertical stacking with consistent gaps
<Stack spacing="lg" align="center">
  <Heading>Welcome</Heading>
  <Text>Begin your practice</Text>
  <Button>Start</Button>
</Stack>

// Responsive grid for poses/sessions
<Grid columns="poses" gap="md">
  {poses.map(pose => <PoseCard key={pose.id} pose={pose} />)}
</Grid>
```

### Progress Indicators

Calming progress visualization for practice tracking.

#### Timer Component
```jsx
<Timer
  totalSeconds={300}
  remainingSeconds={180}
  size={180}
  onComplete={handleComplete}
  paused={isPaused}
/>
```

#### Session Progress
```jsx
<SessionProgress
  currentPose={3}
  totalPoses={8}
  poses={sessionPoses}
  variant="default"
/>
```

### Overlays & Modals

Gentle overlays for tips, pauses, and confirmations.

#### Tips Overlay
```jsx
<TipsOverlay
  open={showTips}
  onClose={() => setShowTips(false)}
  pose={currentPose}
  tips={[
    "Keep feet hip-width apart",
    "Engage your core gently",
    "Breathe deeply and slowly"
  ]}
/>
```

#### Pause Overlay
```jsx
<PauseOverlay
  open={isPaused}
  onResume={handleResume}
  onEnd={handleEndSession}
  sessionName="Morning Flow"
  currentPose={3}
  totalPoses={8}
/>
```

## Usage Guidelines

### Do's ✅

- **Use consistent spacing**: Stick to the 8px grid system
- **Prioritize readability**: Never go below 18px for body text
- **Make touch targets large**: Minimum 44px for mobile
- **Use semantic colors**: text-primary for main content, text-secondary for supporting
- **Apply gentle animations**: Use the predefined easing curves
- **Test on real devices**: Especially at arm's length during yoga practice

### Don'ts ❌

- **Don't use harsh colors**: Avoid bright, jarring colors that break the calm
- **Don't make tiny touch targets**: Small buttons frustrate during practice
- **Don't overuse animations**: Too much motion can be distracting
- **Don't ignore arm's length**: Test readability from yoga mat distance
- **Don't use complex interactions**: Keep everything simple and intuitive

### Component Combinations

#### Practice Screen Layout
```jsx
<PracticeLayout
  timer={<Timer totalSeconds={300} remainingSeconds={180} />}
  pose={<PoseCard pose={currentPose} />}
  controls={
    <Stack direction="row" spacing="md" justify="center">
      <Button variant="ghost" icon={<SkipPreviousIcon />} />
      <Button variant="primary" icon={<PauseIcon />}>Pause</Button>
      <Button variant="ghost" icon={<SkipNextIcon />} />
    </Stack>
  }
  tips={
    <TipsOverlay
      open={showTips}
      onClose={() => setShowTips(false)}
      pose={currentPose}
    />
  }
/>
```

#### Session Browser
```jsx
<PageWrapper title="Choose Your Practice">
  <Section>
    <Container>
      <Grid columns="sessions" gap="lg">
        {sessions.map(session => (
          <SessionCard
            key={session.id}
            session={session}
            onClick={() => startSession(session)}
          />
        ))}
      </Grid>
    </Container>
  </Section>
</PageWrapper>
```

## Accessibility

### WCAG AA Compliance

- **Color Contrast**: 4.5:1 minimum for all text
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Keyboard Navigation**: Full keyboard support for all components
- **Screen Readers**: Semantic HTML and proper ARIA labels
- **Motion Preferences**: Respect `prefers-reduced-motion`

### Touch Accessibility

- **44px Minimum**: All touch targets meet or exceed 44px
- **Spacing**: Adequate spacing between interactive elements
- **Feedback**: Visual and haptic feedback for interactions

### Yoga-Specific Accessibility

- **Arm's Length**: All text readable from yoga mat distance (3-4 feet)
- **Large Timers**: Timer displays use large, high-contrast text
- **Voice Alternatives**: Visual cues for all audio information
- **Pause-Friendly**: Easy to pause/resume during practice

## Mobile-First Principles

### Breakpoint Strategy
```javascript
screens: {
  'xs': '320px',    // Small phones
  'sm': '480px',    // Large phones
  'md': '768px',    // Tablets
  'lg': '1024px',   // Laptops
}
```

### Responsive Patterns

#### Typography Scaling
```css
/* Base: 18px on mobile, scales up on larger screens */
.text-base {
  font-size: 18px;
  line-height: 28px;
}

@media (min-width: 768px) {
  .text-base {
    font-size: 20px;
    line-height: 32px;
  }
}
```

#### Touch Target Optimization
```css
/* Ensure minimum 44px touch targets */
.min-touch {
  min-height: 44px;
  min-width: 44px;
}

/* Larger targets on smaller screens */
@media (max-width: 480px) {
  .touch-friendly {
    padding: 16px;
  }
}
```

### Layout Adaptations

- **Mobile**: Single column, full-width cards
- **Tablet**: Two-column grids, side navigation
- **Desktop**: Three-column grids, sidebar layouts

## Animation Philosophy

### Breathing-Inspired Motion

All animations should feel like natural breathing - smooth, rhythmic, and calming.

#### Key Principles
1. **Gentle Timing**: 300ms standard, up to 4s for breathing animations
2. **Organic Easing**: No linear animations, use bezier curves
3. **Purposeful Motion**: Every animation has a clear purpose
4. **Respect Preferences**: Honor `prefers-reduced-motion`

#### Animation Types

**Micro-interactions**
```css
/* Button hover - gentle scale and shadow */
.button:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 6px rgba(143, 166, 142, 0.2);
  transition: all 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

**Page Transitions**
```css
/* Gentle slide between screens */
.page-enter {
  opacity: 0;
  transform: translateY(10px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
}
```

**Breathing Animations**
```css
/* Gentle breathing rhythm for meditation elements */
@keyframes breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

.breathing-element {
  animation: breathe 4s cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
}
```

### Implementation Examples

#### Component with Breathing Effect
```jsx
const BreathingCard = () => (
  <Card className="animate-breathe hover:animate-none">
    <CardContent>
      <Text>Focus on your breath</Text>
    </CardContent>
  </Card>
);
```

#### Respectful Motion
```jsx
const MotionRespectingButton = () => (
  <Button className="motion-safe:hover:scale-105 motion-reduce:hover:scale-100">
    Start Practice
  </Button>
);
```

## Testing Guidelines

### Manual Testing Checklist

#### Visual Testing
- [ ] Test on 320px width (smallest supported)
- [ ] Verify 18px minimum font size
- [ ] Check color contrast ratios
- [ ] Test at arm's length (3-4 feet away)

#### Interaction Testing
- [ ] All touch targets minimum 44px
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Animations feel natural

#### Accessibility Testing
- [ ] Screen reader compatibility
- [ ] High contrast mode support
- [ ] Motion preferences respected
- [ ] Color-blind friendly

### Automated Testing

```javascript
// Example accessibility test
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('Button has no accessibility violations', async () => {
  const { container } = render(<Button>Test Button</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Migration Guide

### From Existing Components

If you're updating existing components to use the design system:

1. **Replace hardcoded colors** with design tokens
2. **Update font sizes** to meet 18px minimum
3. **Add proper touch targets** (44px minimum)
4. **Implement focus indicators** for accessibility
5. **Add gentle animations** with proper easing

### Example Migration

**Before:**
```jsx
<button className="bg-blue-500 text-sm p-2 rounded">
  Click me
</button>
```

**After:**
```jsx
<Button variant="primary" size="default">
  Click me
</Button>
```

---

## Support

For questions about the design system or requests for new components, please refer to the component library source files in `/src/components/design-system/` or consult the design tokens in `/src/design-system/tokens/`.

Remember: Every component should make the user feel like they can breathe a little easier. 🧘‍♀️