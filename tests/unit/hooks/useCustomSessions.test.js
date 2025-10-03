import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import useCustomSessions from '../../../src/hooks/useCustomSessions';

describe('useCustomSessions', () => {
  const STORAGE_KEY = 'customSessions';

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  const mockSession1 = {
    id: 'custom-1',
    name: 'Morning Flow',
    duration: 15,
    poses: [
      { id: 'pose1', name: 'Mountain Pose', duration: 60 },
      { id: 'pose2', name: 'Downward Dog', duration: 90 }
    ]
  };

  const mockSession2 = {
    id: 'custom-2',
    name: 'Evening Stretch',
    duration: 10,
    poses: [
      { id: 'pose3', name: 'Child\'s Pose', duration: 120 }
    ]
  };

  describe('Initial state', () => {
    test('should initialize with empty sessions array', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sessions).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    test('should load existing sessions from localStorage on mount', async () => {
      const existingSessions = [mockSession1, mockSession2];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingSessions));

      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sessions).toEqual(existingSessions);
    });

    test('should handle corrupted localStorage data gracefully', async () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json {{{');

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sessions).toEqual([]);
      expect(result.current.error).toBeTruthy();
      expect(consoleError).toHaveBeenCalled();

      consoleError.mockRestore();
    });

    test('should handle non-array data in localStorage', async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: 'an array' }));

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sessions).toEqual([]);
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('not an array')
      );

      consoleError.mockRestore();
    });
  });

  describe('getAll method', () => {
    test('should return all sessions', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.add(mockSession1);
        result.current.add(mockSession2);
      });

      const allSessions = result.current.getAll();
      expect(allSessions).toHaveLength(2);
      expect(allSessions).toContainEqual(mockSession1);
      expect(allSessions).toContainEqual(mockSession2);
    });

    test('should return empty array when no sessions exist', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.getAll()).toEqual([]);
    });
  });

  describe('getById method', () => {
    test('should return session by ID', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.add(mockSession1);
      });

      const session = result.current.getById('custom-1');
      expect(session).toEqual(mockSession1);
    });

    test('should return null for non-existent ID', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const session = result.current.getById('non-existent');
      expect(session).toBeNull();
    });

    test('should return null for invalid ID', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      expect(result.current.getById(null)).toBeNull();
      expect(result.current.getById(undefined)).toBeNull();
      expect(result.current.getById('')).toBeNull();

      expect(consoleWarn).toHaveBeenCalledTimes(3);
      consoleWarn.mockRestore();
    });
  });

  describe('add method', () => {
    test('should add new session to state and localStorage', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.add(mockSession1);
      });

      expect(result.current.sessions).toContainEqual(mockSession1);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toContainEqual(mockSession1);
    });

    test('should throw error for invalid session object', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(() => {
        act(() => {
          result.current.add(null);
        });
      }).toThrow('Invalid session object');

      expect(() => {
        act(() => {
          result.current.add('not an object');
        });
      }).toThrow('Invalid session object');
    });

    test('should throw error for session without ID', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(() => {
        act(() => {
          result.current.add({ name: 'No ID Session' });
        });
      }).toThrow('Session must have an ID');
    });

    test('should throw error for duplicate session ID', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.add(mockSession1);
      });

      expect(() => {
        act(() => {
          result.current.add(mockSession1);
        });
      }).toThrow('already exists');
    });

    test('should add multiple different sessions', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.add(mockSession1);
        result.current.add(mockSession2);
      });

      expect(result.current.sessions).toHaveLength(2);
    });
  });

  describe('update method', () => {
    test('should update existing session', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.add(mockSession1);
      });

      const updates = { name: 'Updated Morning Flow', duration: 20 };

      act(() => {
        const success = result.current.update('custom-1', updates);
        expect(success).toBe(true);
      });

      const updated = result.current.getById('custom-1');
      expect(updated.name).toBe('Updated Morning Flow');
      expect(updated.duration).toBe(20);
      expect(updated.poses).toEqual(mockSession1.poses); // Unchanged fields preserved
    });

    test('should preserve original ID when updating', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.add(mockSession1);
      });

      act(() => {
        result.current.update('custom-1', { id: 'different-id', name: 'New Name' });
      });

      const session = result.current.getById('custom-1');
      expect(session).toBeTruthy();
      expect(session.id).toBe('custom-1'); // ID should not change
      expect(session.name).toBe('New Name');
    });

    test('should return false for non-existent session', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      act(() => {
        const success = result.current.update('non-existent', { name: 'Test' });
        expect(success).toBe(false);
      });

      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('not found')
      );
      consoleWarn.mockRestore();
    });

    test('should return false for invalid parameters', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      act(() => {
        expect(result.current.update(null, { name: 'Test' })).toBe(false);
        expect(result.current.update('id', null)).toBe(false);
        expect(result.current.update('', { name: 'Test' })).toBe(false);
      });

      expect(consoleWarn).toHaveBeenCalled();
      consoleWarn.mockRestore();
    });

    test('should update localStorage after successful update', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.add(mockSession1);
      });

      act(() => {
        result.current.update('custom-1', { name: 'Updated Name' });
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      const storedSession = stored.find(s => s.id === 'custom-1');
      expect(storedSession.name).toBe('Updated Name');
    });
  });

  describe('remove method', () => {
    test('should remove session from state and localStorage', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.add(mockSession1);
        result.current.add(mockSession2);
      });

      expect(result.current.sessions).toHaveLength(2);

      act(() => {
        const success = result.current.remove('custom-1');
        expect(success).toBe(true);
      });

      expect(result.current.sessions).toHaveLength(1);
      expect(result.current.getById('custom-1')).toBeNull();
      expect(result.current.getById('custom-2')).toBeTruthy();

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toHaveLength(1);
      expect(stored.find(s => s.id === 'custom-1')).toBeUndefined();
    });

    test('should return false for non-existent session', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      act(() => {
        const success = result.current.remove('non-existent');
        expect(success).toBe(false);
      });

      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('not found')
      );
      consoleWarn.mockRestore();
    });

    test('should return false for invalid ID', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      act(() => {
        expect(result.current.remove(null)).toBe(false);
        expect(result.current.remove(undefined)).toBe(false);
        expect(result.current.remove('')).toBe(false);
      });

      expect(consoleWarn).toHaveBeenCalled();
      consoleWarn.mockRestore();
    });
  });

  describe('Multi-tab synchronization', () => {
    test('should sync when storage event is triggered', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Simulate another tab updating localStorage
      const updatedSessions = [mockSession1, mockSession2];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));

      // Trigger storage event (simulates change from another tab)
      act(() => {
        const storageEvent = new StorageEvent('storage', {
          key: STORAGE_KEY,
          newValue: JSON.stringify(updatedSessions),
          oldValue: null
        });
        window.dispatchEvent(storageEvent);
      });

      await waitFor(() => {
        expect(result.current.sessions).toEqual(updatedSessions);
      });
    });

    test('should ignore storage events for other keys', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.add(mockSession1);
      });

      const originalSessions = result.current.sessions;

      // Trigger storage event for different key
      act(() => {
        const storageEvent = new StorageEvent('storage', {
          key: 'otherKey',
          newValue: JSON.stringify([mockSession2]),
          oldValue: null
        });
        window.dispatchEvent(storageEvent);
      });

      // Sessions should remain unchanged
      expect(result.current.sessions).toEqual(originalSessions);
    });
  });

  describe('Error handling', () => {
    test('should handle localStorage quota exceeded error', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Mock localStorage.setItem to throw quota exceeded error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      act(() => {
        result.current.add(mockSession1);
      });

      expect(result.current.error).toBeTruthy();
      expect(consoleError).toHaveBeenCalled();

      // Restore
      Storage.prototype.setItem = originalSetItem;
      consoleError.mockRestore();
    });

    test('should clear error after successful operation', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Cause an error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('Test error');
      });

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      act(() => {
        result.current.add(mockSession1);
      });

      expect(result.current.error).toBeTruthy();

      // Restore normal operation
      Storage.prototype.setItem = originalSetItem;

      act(() => {
        result.current.add(mockSession2);
      });

      expect(result.current.error).toBeNull();

      consoleError.mockRestore();
    });
  });

  describe('Method stability', () => {
    test('methods should be stable across re-renders', async () => {
      const { result, rerender } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const methods1 = {
        getAll: result.current.getAll,
        getById: result.current.getById,
        add: result.current.add,
        update: result.current.update,
        remove: result.current.remove
      };

      rerender();

      const methods2 = {
        getAll: result.current.getAll,
        getById: result.current.getById,
        add: result.current.add,
        update: result.current.update,
        remove: result.current.remove
      };

      // Methods should maintain reference equality (useCallback)
      expect(methods1.getAll).toBe(methods2.getAll);
      expect(methods1.getById).toBe(methods2.getById);
      expect(methods1.add).toBe(methods2.add);
      expect(methods1.update).toBe(methods2.update);
      expect(methods1.remove).toBe(methods2.remove);
    });
  });
});
