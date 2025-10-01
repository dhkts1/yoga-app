# Custom Hooks

## useCustomSessions

Centralized hook for managing custom yoga sessions in localStorage with multi-tab synchronization.

### Features
- ✅ Atomic state + localStorage updates
- ✅ Multi-tab synchronization via storage events
- ✅ Graceful error handling (corrupted data → empty array)
- ✅ Input validation and duplicate ID prevention
- ✅ Performance optimized (useCallback for all methods)
- ✅ JSDoc comments for TypeScript-like autocomplete
- ✅ Zero memory leaks (automatic cleanup)

### Usage

```javascript
import useCustomSessions from '../hooks/useCustomSessions';

function MyComponent() {
  const {
    // State
    sessions,      // Array of all custom sessions
    isLoading,     // True during initial load
    error,         // Last error that occurred (or null)

    // Methods
    getAll,        // Get all sessions
    getById,       // Get single session by ID
    add,           // Add new session
    update,        // Update existing session
    remove         // Delete session
  } = useCustomSessions();

  // Example: Display all sessions
  return (
    <div>
      {sessions.map(session => (
        <div key={session.id}>{session.name}</div>
      ))}
    </div>
  );
}
```

### API

#### State

**`sessions: Array<CustomSession>`**
- Array of all custom sessions
- Always an array (never null/undefined)
- Updates automatically on storage events (multi-tab sync)

**`isLoading: boolean`**
- `true` during initial load from localStorage
- `false` once loaded (even if error occurred)

**`error: Error | null`**
- Last error that occurred during operations
- `null` if no errors
- Cleared on successful operations

#### Methods

**`getAll(): Array<CustomSession>`**
```javascript
const allSessions = getAll();
console.log(allSessions); // [{ id: '...', name: '...' }, ...]
```

**`getById(id: string): CustomSession | null`**
```javascript
const session = getById('custom-123');
if (session) {
  console.log(session.name);
} else {
  console.log('Session not found');
}
```

**`add(session: CustomSession): void`**
```javascript
try {
  add({
    id: 'custom-123',
    name: 'Morning Flow',
    poses: [{ poseId: 'warrior1', duration: 30 }],
    // ... other properties
  });
  console.log('Session added successfully');
} catch (error) {
  console.error('Failed to add:', error.message);
  // Possible errors:
  // - "Invalid session object"
  // - "Session must have an ID"
  // - "Session with ID custom-123 already exists"
}
```

**`update(id: string, updates: Partial<CustomSession>): boolean`**
```javascript
const success = update('custom-123', {
  name: 'Updated Morning Flow',
  description: 'New description'
});

if (success) {
  console.log('Session updated');
} else {
  console.log('Session not found');
}

// Note: ID is always preserved (cannot be changed)
update('custom-123', { id: 'hacked-id' }); // ID remains 'custom-123'
```

**`remove(id: string): boolean`**
```javascript
const success = remove('custom-123');

if (success) {
  console.log('Session deleted');
} else {
  console.log('Session not found');
}
```

### Real-World Examples

#### Example 1: Sessions List Screen

```javascript
import useCustomSessions from '../hooks/useCustomSessions';

function SessionsList() {
  const { sessions, remove } = useCustomSessions();

  const handleDelete = (sessionId) => {
    if (confirm('Delete this session?')) {
      const success = remove(sessionId);
      if (!success) {
        alert('Session not found');
      }
    }
  };

  return (
    <div>
      {sessions.map(session => (
        <div key={session.id}>
          <h3>{session.name}</h3>
          <button onClick={() => handleDelete(session.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

#### Example 2: Practice Screen

```javascript
import { useSearchParams } from 'react-router-dom';
import useCustomSessions from '../hooks/useCustomSessions';

function PracticeScreen() {
  const [searchParams] = useSearchParams();
  const customSessionId = searchParams.get('customSession');
  const { getById } = useCustomSessions();

  const session = getById(customSessionId);

  if (!session) {
    return <div>Session not found</div>;
  }

  return <PracticeComponent session={session} />;
}
```

#### Example 3: Session Builder

```javascript
import { useNavigate } from 'react-router-dom';
import useCustomSessions from '../hooks/useCustomSessions';
import { createCustomSession } from '../data/customSessions';

function SessionBuilder() {
  const navigate = useNavigate();
  const { add, update, getById } = useCustomSessions();
  const [name, setName] = useState('');
  const [poses, setPoses] = useState([]);

  const handleSave = () => {
    try {
      const sessionData = createCustomSession(name, poses);

      // Check if editing existing session
      const editId = new URLSearchParams(window.location.search).get('edit');
      if (editId) {
        const success = update(editId, sessionData);
        if (!success) {
          alert('Session not found');
          return;
        }
      } else {
        add(sessionData);
      }

      navigate('/sessions');
    } catch (error) {
      alert(`Failed to save: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSave}>
      {/* Form fields */}
      <button type="submit">Save Session</button>
    </form>
  );
}
```

### Error Handling

The hook handles errors gracefully:

```javascript
// Corrupted localStorage data
localStorage.setItem('customSessions', 'invalid-json{]');
const { sessions, error } = useCustomSessions();
console.log(sessions); // [] (empty array, no crash)
console.log(error); // SyntaxError object

// Duplicate ID
const { add } = useCustomSessions();
add({ id: 'test-1', name: 'First' });
try {
  add({ id: 'test-1', name: 'Duplicate' });
} catch (error) {
  console.error(error.message); // "Session with ID test-1 already exists"
}

// Invalid input
try {
  add(null); // throws "Invalid session object"
  add({ name: 'No ID' }); // throws "Session must have an ID"
} catch (error) {
  console.error(error.message);
}
```

### Multi-tab Synchronization

The hook automatically synchronizes across browser tabs:

```javascript
// Tab 1
const { add } = useCustomSessions();
add({ id: 'test-1', name: 'New Session' });

// Tab 2 (automatically receives update)
const { sessions } = useCustomSessions();
// sessions array now includes the new session from Tab 1
```

### Performance Notes

1. **Stable Method References**: All methods use `useCallback`, so they can be safely added to dependency arrays without causing infinite loops.

```javascript
const { getById } = useCustomSessions();

useEffect(() => {
  const session = getById('custom-123');
  // ... do something with session
}, [getById]); // Safe: getById reference is stable
```

2. **Automatic Cleanup**: Storage event listeners are automatically cleaned up on component unmount (no memory leaks).

3. **Atomic Updates**: State and localStorage are always updated together (no inconsistencies).

### Migration Guide

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed migration instructions from direct localStorage usage.

### CustomSession Type

```typescript
interface CustomSession {
  id: string;                    // Unique identifier (e.g., "custom-1234")
  name: string;                  // Session name
  duration: number;              // Duration in minutes
  focus: string;                 // Focus area (e.g., "custom")
  bodyPart: string;              // Target body part (e.g., "custom")
  difficulty: string;            // Difficulty level (e.g., "custom")
  description: string;           // Session description
  poses: Array<{                 // Array of poses
    poseId: string;              // Reference to pose in poses.js
    duration: number;            // Duration in seconds (15-120)
  }>;
  totalDurationSeconds: number;  // Total duration in seconds
  createdAt: string;             // ISO timestamp
  isCustom: boolean;             // Always true for custom sessions
}
```

### Related Files

- **Hook**: `/src/hooks/useCustomSessions.js`
- **Migration Guide**: `/src/hooks/MIGRATION_GUIDE.md`
- **Custom Session Utilities**: `/src/data/customSessions.js`
- **Usage**: `/src/screens/Sessions.jsx`, `/src/screens/Practice.jsx`

### Troubleshooting

**Q: Sessions not appearing after adding?**
- Check browser console for errors
- Verify session object has required fields (especially `id`)
- Check if duplicate ID error is being thrown

**Q: Multi-tab sync not working?**
- Storage events only fire in *other* tabs (not the one that made the change)
- Check if localStorage is enabled in browser
- Verify no errors in console

**Q: Getting "already exists" error?**
- Session with that ID already exists
- Use `update()` instead of `add()` for existing sessions
- Or generate a new unique ID

**Q: Data lost after page refresh?**
- Check if localStorage is enabled
- Check browser console for errors during save
- Verify localStorage quota not exceeded (very rare)
