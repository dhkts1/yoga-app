# useCollapsibleSections Hook

## Overview
A reusable React hook for managing collapsible/accordion section state with support for individual toggle, batch operations, and state checking.

## Installation
```javascript
import useCollapsibleSections from '../hooks/useCollapsibleSections';
```

## API Reference

### Parameters
- `initialState` (Object): Initial open/closed state for sections
  - Keys: Section IDs (string)
  - Values: Boolean (true = open, false = closed)
  - Default: `{}`

### Return Value
Object containing:
- `openSections` (Object): Current state object mapping section IDs to boolean open/closed states
- `toggleSection` (Function): Toggle individual section - `(sectionId: string) => void`
- `openAll` (Function): Open all sections - `() => void`
- `closeAll` (Function): Close all sections - `() => void`
- `isOpen` (Function): Check if section is open - `(sectionId: string) => boolean`

## Usage Examples

### Example 1: Settings Screen (Current Implementation)
```javascript
function Settings() {
  const { openSections, toggleSection } = useCollapsibleSections({
    practice: false,
    popups: false,
    notifications: false,
    data: false,
    about: false
  });

  return (
    <Container>
      <SettingsSection
        id="practice"
        title="Practice Settings"
        subtitle="Customize your practice experience"
        icon={Clock}
        isOpen={openSections.practice}
        onToggle={() => toggleSection('practice')}
      >
        {/* Settings content */}
      </SettingsSection>

      <SettingsSection
        id="notifications"
        title="Notifications"
        subtitle="Reminders and alerts"
        icon={Bell}
        isOpen={openSections.notifications}
        onToggle={() => toggleSection('notifications')}
      >
        {/* Notification settings */}
      </SettingsSection>
    </Container>
  );
}
```

### Example 2: FAQ Page
```javascript
function FAQ() {
  const { openSections, toggleSection, isOpen, closeAll } = useCollapsibleSections({
    'what-is-yoga': false,
    'how-to-start': false,
    'practice-frequency': true, // Start with one expanded
    'equipment-needed': false
  });

  const faqs = [
    { id: 'what-is-yoga', question: 'What is yoga?', answer: '...' },
    { id: 'how-to-start', question: 'How do I start?', answer: '...' },
    { id: 'practice-frequency', question: 'How often should I practice?', answer: '...' },
    { id: 'equipment-needed', question: 'What equipment do I need?', answer: '...' }
  ];

  return (
    <div>
      <button onClick={closeAll}>Collapse All</button>
      {faqs.map(faq => (
        <AccordionItem
          key={faq.id}
          question={faq.question}
          answer={faq.answer}
          isOpen={isOpen(faq.id)}
          onToggle={() => toggleSection(faq.id)}
        />
      ))}
    </div>
  );
}
```

### Example 3: Filter Panel
```javascript
function FilterPanel() {
  const { openSections, toggleSection, openAll, closeAll } = useCollapsibleSections({
    categories: true,  // Important filters start open
    priceRange: true,
    brand: false,
    rating: false,
    availability: false
  });

  return (
    <aside className="filter-panel">
      <div className="filter-controls">
        <button onClick={openAll}>Expand All</button>
        <button onClick={closeAll}>Collapse All</button>
      </div>

      <FilterSection
        title="Categories"
        isOpen={openSections.categories}
        onToggle={() => toggleSection('categories')}
      >
        {/* Category checkboxes */}
      </FilterSection>

      <FilterSection
        title="Price Range"
        isOpen={openSections.priceRange}
        onToggle={() => toggleSection('priceRange')}
      >
        {/* Price slider */}
      </FilterSection>

      <FilterSection
        title="Brand"
        isOpen={openSections.brand}
        onToggle={() => toggleSection('brand')}
      >
        {/* Brand checkboxes */}
      </FilterSection>
    </aside>
  );
}
```

### Example 4: Help Documentation
```javascript
function HelpDocs() {
  const { openSections, toggleSection, isOpen } = useCollapsibleSections({
    'getting-started': true, // Show first section by default
    'advanced-features': false,
    'troubleshooting': false,
    'keyboard-shortcuts': false,
    'api-reference': false
  });

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: PlayCircle },
    { id: 'advanced-features', title: 'Advanced Features', icon: Zap },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: AlertCircle },
    { id: 'keyboard-shortcuts', title: 'Keyboard Shortcuts', icon: Keyboard },
    { id: 'api-reference', title: 'API Reference', icon: Code }
  ];

  return (
    <div className="docs">
      {sections.map(section => (
        <DocSection
          key={section.id}
          title={section.title}
          icon={section.icon}
          isOpen={isOpen(section.id)}
          onToggle={() => toggleSection(section.id)}
        >
          <DocsContent sectionId={section.id} />
        </DocSection>
      ))}
    </div>
  );
}
```

### Example 5: Dynamic Sections from Data
```javascript
function DynamicAccordion({ items }) {
  // Generate initial state from data
  const initialState = items.reduce((acc, item) => {
    acc[item.id] = item.defaultOpen || false;
    return acc;
  }, {});

  const { openSections, toggleSection } = useCollapsibleSections(initialState);

  return (
    <div>
      {items.map(item => (
        <Accordion
          key={item.id}
          title={item.title}
          isOpen={openSections[item.id]}
          onToggle={() => toggleSection(item.id)}
        >
          {item.content}
        </Accordion>
      ))}
    </div>
  );
}
```

## Use Cases

### Ideal For:
- **Settings screens** with multiple collapsible sections
- **FAQ pages** with expandable questions
- **Help/Documentation** with collapsible topics
- **Filter panels** with expandable filter categories
- **Product descriptions** with expandable details
- **Course content** with expandable modules
- **Form sections** with progressive disclosure
- **Sidebar navigation** with collapsible menus

### Not Ideal For:
- **Tabs** - Use a dedicated tabs component instead
- **Single collapsible** - useState is simpler for a single item
- **Complex state dependencies** - Consider custom state management
- **Controlled state from parent** - Pass state directly as props

## Features

### Individual Toggle
Toggle any section independently:
```javascript
toggleSection('practice'); // Toggle practice section
```

### Batch Operations
Open or close all sections at once:
```javascript
openAll();  // Expand all sections
closeAll(); // Collapse all sections
```

### State Checking
Check if a specific section is open:
```javascript
if (isOpen('notifications')) {
  // Section is expanded
}
```

### Performance
- All methods are memoized with `useCallback`
- Prevents unnecessary re-renders
- Efficient for large numbers of sections

## Implementation Notes

### State Management
- Uses React's `useState` for local state
- All methods are wrapped in `useCallback` for optimization
- State is a simple object mapping section IDs to boolean values

### Accessibility Considerations
When implementing accordion UI with this hook, remember to:
- Add `aria-expanded` to toggle buttons (example in SettingsSection.jsx)
- Add `aria-controls` to link buttons with content
- Use semantic HTML (button elements for toggle)
- Ensure keyboard navigation works (Enter/Space on buttons)
- Provide clear visual indicators (chevrons, icons)

### Styling Recommendations
- Use smooth transitions for expand/collapse animations
- Provide visual feedback on hover/focus
- Use icons (ChevronDown, Plus/Minus) to indicate state
- Consider slide/fade animations for content reveal
- Maintain consistent padding/spacing

## Testing

### Manual Testing Checklist
- [ ] Each section toggles independently
- [ ] Open all works correctly
- [ ] Close all works correctly
- [ ] isOpen returns accurate state
- [ ] Multiple rapid toggles work smoothly
- [ ] State persists during re-renders
- [ ] Keyboard navigation functions properly

### Unit Test Example
```javascript
import { renderHook, act } from '@testing-library/react-hooks';
import useCollapsibleSections from './useCollapsibleSections';

test('should toggle section state', () => {
  const { result } = renderHook(() =>
    useCollapsibleSections({ section1: false, section2: false })
  );

  expect(result.current.openSections.section1).toBe(false);

  act(() => {
    result.current.toggleSection('section1');
  });

  expect(result.current.openSections.section1).toBe(true);
});

test('should open all sections', () => {
  const { result } = renderHook(() =>
    useCollapsibleSections({ section1: false, section2: false })
  );

  act(() => {
    result.current.openAll();
  });

  expect(result.current.openSections.section1).toBe(true);
  expect(result.current.openSections.section2).toBe(true);
});
```

## Migration Guide

### From Manual State Management
**Before:**
```javascript
const [openSections, setOpenSections] = useState({
  section1: false,
  section2: false
});

const toggleSection = (section) => {
  setOpenSections(prev => ({
    ...prev,
    [section]: !prev[section]
  }));
};
```

**After:**
```javascript
const { openSections, toggleSection } = useCollapsibleSections({
  section1: false,
  section2: false
});
```

### Benefits
- **Reduced boilerplate**: 10+ lines → 4 lines
- **Built-in utilities**: openAll, closeAll, isOpen included
- **Performance**: Memoized callbacks prevent re-renders
- **Reusability**: Same logic across multiple components
- **Consistency**: Standard API across the application

## Related Components
- `SettingsSection.jsx` - Accordion component using this hook
- `CategoryTabs.jsx` - Alternative pattern for exclusive selection

## Changelog

### v1.0.0 (2024-10-02)
- Initial release
- Extracted from Settings.jsx manual state management
- Added comprehensive JSDoc documentation
- Added openAll, closeAll, isOpen utility methods
- Memoized all callbacks for performance
