# useLocalStorage Hook Documentation

Generic React hook for managing localStorage with automatic JSON serialization, multi-tab sync, and error handling.

## API

```javascript
const [value, setValue, removeValue, error] = useLocalStorage(key, initialValue);
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | `string` | ✅ | localStorage key to use |
| `initialValue` | `any` | ✅ | Default value if key doesn't exist in localStorage |

### Returns

Returns an array with 4 elements:

| Index | Name | Type | Description |
|-------|------|------|-------------|
| 0 | `value` | `T` | Current value from localStorage (or initialValue) |
| 1 | `setValue` | `(value: T \| ((prev: T) => T)) => void` | Function to update value (like useState) |
| 2 | `removeValue` | `() => void` | Function to remove value and reset to initialValue |
| 3 | `error` | `Error \| null` | Last error that occurred (or null) |

## Features

✅ **Automatic JSON Serialization**: No need to manually JSON.stringify/parse
✅ **Multi-tab Sync**: Changes in one tab automatically reflect in others
✅ **Error Handling**: Graceful fallback on corrupted data
✅ **SSR Safe**: Checks for window/localStorage availability
✅ **Functional Updates**: Supports updater functions like useState
✅ **Stable References**: setValue uses useCallback for performance
✅ **Type Safe**: Works with any JSON-serializable type

## Usage Examples

### Basic String Storage

```javascript
import useLocalStorage from '../hooks/useLocalStorage';

function MyComponent() {
  const [name, setName, removeName] = useLocalStorage('userName', 'Guest');

  return (
    <div>
      <p>Hello, {name}!</p>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={removeName}>Reset</button>
    </div>
  );
}
```

### Object Storage with Draft Auto-save

```javascript
import useLocalStorage from '../hooks/useLocalStorage';

function SessionBuilder() {
  const [draft, setDraft, clearDraft] = useLocalStorage('sessionDraft', {
    name: '',
    poses: []
  });

  // Sync local state with draft
  const [name, setName] = useState(draft.name);
  const [poses, setPoses] = useState(draft.poses);

  // Auto-save on changes
  useEffect(() => {
    setDraft({ name, poses });
  }, [name, poses, setDraft]);

  const handleSave = () => {
    // Save session...
    clearDraft(); // Remove draft after saving
  };

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      {/* ... */}
    </form>
  );
}
```

### Functional Updates

```javascript
const [count, setCount] = useLocalStorage('counter', 0);

// Direct value
setCount(5);

// Functional update (like useState)
setCount(prev => prev + 1);
```

### Array Storage

```javascript
const [items, setItems, clearItems] = useLocalStorage('todoItems', []);

const addItem = (item) => {
  setItems(prev => [...prev, item]);
};

const removeItem = (id) => {
  setItems(prev => prev.filter(item => item.id !== id));
};
```

### Error Handling

```javascript
const [data, setData, removeData, error] = useLocalStorage('userData', null);

if (error) {
  console.error('localStorage error:', error);
  // Handle error (e.g., show notification)
}
```

## Multi-tab Synchronization

The hook automatically syncs changes across browser tabs using the `storage` event:

```javascript
// Tab 1
const [theme, setTheme] = useLocalStorage('theme', 'light');
setTheme('dark');

// Tab 2 (automatically receives update)
const [theme] = useLocalStorage('theme', 'light');
// theme is now 'dark' without any manual refresh
```

**Important**: Storage events only fire in *other* tabs, not the tab that made the change.

## Error Scenarios

### Corrupted Data

```javascript
// Manually corrupt localStorage
localStorage.setItem('myKey', 'invalid-json{]');

// Hook gracefully handles it
const [value, setValue, removeValue, error] = useLocalStorage('myKey', {});
console.log(value);  // {} (initialValue)
console.log(error);  // SyntaxError: Unexpected token...
```

### localStorage Disabled

```javascript
// If localStorage is not available (e.g., private browsing with restrictions)
const [value, setValue] = useLocalStorage('myKey', 'default');
console.log(value);  // 'default' (falls back to initialValue)
```

### Quota Exceeded

```javascript
// If localStorage quota is exceeded (rare)
const [largeData, setLargeData, , error] = useLocalStorage('large', []);
setLargeData(veryLargeArray);

if (error) {
  console.error('Quota exceeded:', error);
  // Handle by reducing data size or clearing old data
}
```

## Performance Considerations

### Stable Function References

The `setValue` function is memoized with `useCallback`, so it's safe to use in dependency arrays:

```javascript
const [value, setValue] = useLocalStorage('myKey', 0);

useEffect(() => {
  // setValue reference is stable, no infinite loop
  const timer = setInterval(() => {
    setValue(prev => prev + 1);
  }, 1000);
  return () => clearInterval(timer);
}, [setValue]); // Safe dependency
```

### Avoiding Excessive Updates

Be mindful of updating localStorage too frequently (e.g., on every keystroke):

```javascript
// ❌ Bad: Updates localStorage on every keystroke
const [text, setText] = useLocalStorage('draft', '');
<input value={text} onChange={(e) => setText(e.target.value)} />

// ✅ Better: Debounce updates
const [text, setText] = useState('');
const [draft, setDraft] = useLocalStorage('draft', '');

useEffect(() => {
  const timer = setTimeout(() => {
    setDraft(text);
  }, 500); // Save after 500ms of no typing
  return () => clearTimeout(timer);
}, [text, setDraft]);
```

## Comparison with Other Hooks

### vs `useState`

```javascript
// useState: In-memory only, lost on refresh
const [count, setCount] = useState(0);

// useLocalStorage: Persists across refreshes
const [count, setCount] = useLocalStorage('count', 0);
```

### vs `useCustomSessions`

```javascript
// useCustomSessions: Specific to custom yoga sessions
const { sessions, add, remove } = useCustomSessions();

// useLocalStorage: Generic, works with any data
const [sessions, setSessions] = useLocalStorage('customSessions', []);
```

**When to use which:**
- Use `useCustomSessions` for custom session management (higher-level API)
- Use `useLocalStorage` for other localStorage needs (lower-level API)

## TypeScript Support

While the hook is currently in JavaScript, here's how you'd type it in TypeScript:

```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [
  T,
  (value: T | ((prev: T) => T)) => void,
  () => void,
  Error | null
];

// Usage with type inference
const [user, setUser] = useLocalStorage<User>('user', { name: '', email: '' });
```

## SSR Compatibility

The hook safely handles server-side rendering by checking for `window`:

```javascript
// Server-side: Returns initialValue without errors
const [value] = useLocalStorage('key', 'default');
console.log(value); // 'default' (no localStorage on server)

// Client-side: Reads from actual localStorage
const [value] = useLocalStorage('key', 'default');
console.log(value); // Value from localStorage or 'default'
```

## Best Practices

### 1. Use Descriptive Keys

```javascript
// ❌ Bad
const [data, setData] = useLocalStorage('d', {});

// ✅ Good
const [userData, setUserData] = useLocalStorage('app_user_profile', {});
```

### 2. Provide Sensible Defaults

```javascript
// ❌ Bad: undefined causes issues
const [settings] = useLocalStorage('settings', undefined);

// ✅ Good: Provide a default object
const [settings] = useLocalStorage('settings', {
  theme: 'light',
  notifications: true
});
```

### 3. Clean Up When Done

```javascript
const [draft, setDraft, clearDraft] = useLocalStorage('draft', {});

const handleSave = () => {
  saveDraftToServer(draft);
  clearDraft(); // Remove draft after saving
};
```

### 4. Handle Errors Gracefully

```javascript
const [data, setData, , error] = useLocalStorage('critical-data', null);

useEffect(() => {
  if (error) {
    // Log error for debugging
    console.error('localStorage error:', error);

    // Show user-friendly message
    toast.error('Failed to save your data. Please try again.');

    // Optionally: Report to error tracking service
    errorReportingService.captureException(error);
  }
}, [error]);
```

## Limitations

| Limitation | Description | Workaround |
|------------|-------------|------------|
| **JSON Serialization** | Cannot store functions, symbols, or circular references | Only store plain data structures |
| **Storage Size** | localStorage has ~5-10MB limit | Compress data or use IndexedDB for large datasets |
| **Synchronous API** | Blocking operation for large data | Keep stored values small |
| **No Encryption** | Data stored in plain text | Don't store sensitive data or encrypt before storing |
| **Storage Events** | Only fire in other tabs | Accept this behavior or use BroadcastChannel API |

## Related Hooks

- **`useCustomSessions`**: Higher-level hook for custom yoga session management
- **`useFavorites`**: Manages favorite items with localStorage persistence
- **`usePreferencesStore`**: Zustand store for user preferences (uses persist middleware)

## Troubleshooting

### Issue: Value not persisting

**Possible Causes:**
1. Browser's localStorage disabled (private browsing)
2. Quota exceeded
3. Browser security settings

**Solution:**
```javascript
const [value, , , error] = useLocalStorage('key', 'default');
if (error) {
  console.error('Persistence error:', error);
  // Fallback to in-memory state
}
```

### Issue: Stale data across tabs

**Possible Causes:**
1. Multiple hook instances with same key
2. Direct localStorage manipulation outside hook

**Solution:**
- Ensure only one hook instance per key per component
- Always use setValue, never `localStorage.setItem` directly

### Issue: Performance degradation

**Possible Causes:**
1. Storing large objects
2. Frequent updates

**Solution:**
```javascript
// Debounce updates
const [localState, setLocalState] = useState(initialValue);
const [, setPersistedState] = useLocalStorage('key', initialValue);

useEffect(() => {
  const timer = setTimeout(() => {
    setPersistedState(localState);
  }, 500);
  return () => clearTimeout(timer);
}, [localState, setPersistedState]);
```

## Migration from Direct localStorage

### Before

```javascript
function MyComponent() {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem('myKey');
      return saved ? JSON.parse(saved) : 'default';
    } catch {
      return 'default';
    }
  });

  useEffect(() => {
    localStorage.setItem('myKey', JSON.stringify(value));
  }, [value]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'myKey') {
        setValue(e.newValue ? JSON.parse(e.newValue) : 'default');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
}
```

### After

```javascript
function MyComponent() {
  const [value, setValue] = useLocalStorage('myKey', 'default');
}
```

**Lines Saved**: ~18 lines → 1 line

---

**Related Documentation:**
- [Custom Hooks README](/src/hooks/README.md)
- [useCustomSessions Documentation](/src/hooks/README.md#usecustomsessions)
- [Refactoring Summary](/LOCALSTORAGE_HOOKS_REFACTOR.md)
