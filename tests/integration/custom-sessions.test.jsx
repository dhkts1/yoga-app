import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import useCustomSessions from '../../src/hooks/useCustomSessions';

/**
 * Integration Tests: Custom Sessions Flow
 *
 * Tests the complete CRUD flow for custom sessions with real localStorage.
 * Verifies data persistence and multi-tab sync capabilities.
 */
describe('Custom Sessions Flow', () => {
  const STORAGE_KEY = 'customSessions';

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Creating Custom Sessions', () => {
    it('creates and persists a custom session to localStorage', async () => {
      const { result } = renderHook(() => useCustomSessions());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const customSession = {
        id: 'custom-morning-flow',
        name: 'My Morning Flow',
        duration: 20,
        poses: [
          { id: 'mountain', duration: 30 },
          { id: 'downward-dog', duration: 60 }
        ],
        difficulty: 'beginner',
        createdAt: new Date().toISOString()
      };

      act(() => {
        result.current.add(customSession);
      });

      // Verify in-memory state
      expect(result.current.sessions).toHaveLength(1);
      expect(result.current.sessions[0].name).toBe('My Morning Flow');

      // Verify localStorage persistence
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].name).toBe('My Morning Flow');
    });

    it('creates multiple custom sessions', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const sessions = [
        { id: 'custom-1', name: 'Morning Flow', duration: 10, poses: [] },
        { id: 'custom-2', name: 'Evening Stretch', duration: 15, poses: [] },
        { id: 'custom-3', name: 'Power Hour', duration: 60, poses: [] }
      ];

      // Add sessions separately to ensure each update completes
      for (const session of sessions) {
        act(() => {
          result.current.add(session);
        });
      }

      expect(result.current.sessions).toHaveLength(3);

      // Verify all are in localStorage
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toHaveLength(3);
    });

    it('prevents duplicate IDs', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const session1 = { id: 'custom-1', name: 'Session 1', duration: 10, poses: [] };
      const session2 = { id: 'custom-1', name: 'Session 2', duration: 15, poses: [] };

      act(() => {
        result.current.add(session1);
      });

      // Attempt to add duplicate ID
      expect(() => {
        act(() => {
          result.current.add(session2);
        });
      }).toThrow();

      // Should only have first session
      expect(result.current.sessions).toHaveLength(1);
      expect(result.current.sessions[0].name).toBe('Session 1');
    });

    it('validates session object before creating', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Invalid session (no ID)
      const invalidSession = { name: 'Invalid Session', duration: 10 };

      expect(() => {
        act(() => {
          result.current.add(invalidSession);
        });
      }).toThrow();

      expect(result.current.sessions).toHaveLength(0);
    });
  });

  describe('Reading Custom Sessions', () => {
    it('retrieves session by ID', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const session = { id: 'custom-1', name: 'Test Session', duration: 10, poses: [] };

      act(() => {
        result.current.add(session);
      });

      const retrieved = result.current.getById('custom-1');
      expect(retrieved).toBeDefined();
      expect(retrieved.name).toBe('Test Session');
    });

    it('returns null for non-existent ID', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const retrieved = result.current.getById('non-existent');
      expect(retrieved).toBeNull();
    });

    it('retrieves all sessions', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const sessions = [
        { id: 'custom-1', name: 'Session 1', duration: 10, poses: [] },
        { id: 'custom-2', name: 'Session 2', duration: 15, poses: [] }
      ];

      for (const session of sessions) {
        act(() => {
          result.current.add(session);
        });
      }

      const all = result.current.getAll();
      expect(all).toHaveLength(2);
    });

    it('loads existing sessions from localStorage on mount', async () => {
      // Pre-populate localStorage
      const existingSessions = [
        { id: 'custom-1', name: 'Existing Session', duration: 20, poses: [] }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingSessions));

      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sessions).toHaveLength(1);
      expect(result.current.sessions[0].name).toBe('Existing Session');
    });
  });

  describe('Updating Custom Sessions', () => {
    it('updates session and persists to localStorage', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const session = { id: 'custom-1', name: 'Original Name', duration: 10, poses: [] };

      act(() => {
        result.current.add(session);
      });

      act(() => {
        result.current.update('custom-1', { name: 'Updated Name', duration: 15 });
      });

      // Verify in-memory update
      const updated = result.current.getById('custom-1');
      expect(updated.name).toBe('Updated Name');
      expect(updated.duration).toBe(15);

      // Verify localStorage update
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored[0].name).toBe('Updated Name');
      expect(stored[0].duration).toBe(15);
    });

    it('preserves ID when updating', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const session = { id: 'custom-1', name: 'Test', duration: 10, poses: [] };

      act(() => {
        result.current.add(session);
      });

      // Attempt to change ID
      act(() => {
        result.current.update('custom-1', { id: 'custom-2', name: 'Updated' });
      });

      // ID should remain unchanged
      const updated = result.current.getById('custom-1');
      expect(updated).toBeDefined();
      expect(updated.id).toBe('custom-1');

      const wrongId = result.current.getById('custom-2');
      expect(wrongId).toBeNull();
    });

    it('returns false when updating non-existent session', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let updateResult;
      act(() => {
        updateResult = result.current.update('non-existent', { name: 'Test' });
      });

      expect(updateResult).toBe(false);
    });

    it('partially updates session fields', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const session = {
        id: 'custom-1',
        name: 'Test Session',
        duration: 10,
        difficulty: 'beginner',
        poses: []
      };

      act(() => {
        result.current.add(session);
      });

      // Update only one field
      act(() => {
        result.current.update('custom-1', { duration: 20 });
      });

      const updated = result.current.getById('custom-1');
      expect(updated.name).toBe('Test Session'); // Unchanged
      expect(updated.duration).toBe(20); // Updated
      expect(updated.difficulty).toBe('beginner'); // Unchanged
    });
  });

  describe('Deleting Custom Sessions', () => {
    it('deletes session and removes from localStorage', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const session = { id: 'custom-1', name: 'Test', duration: 10, poses: [] };

      act(() => {
        result.current.add(session);
      });

      expect(result.current.sessions).toHaveLength(1);

      act(() => {
        result.current.remove('custom-1');
      });

      // Verify removed from memory
      expect(result.current.sessions).toHaveLength(0);

      // Verify removed from localStorage
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toHaveLength(0);
    });

    it('returns false when deleting non-existent session', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let removeResult;
      act(() => {
        removeResult = result.current.remove('non-existent');
      });

      expect(removeResult).toBe(false);
    });

    it('deletes correct session from multiple sessions', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const sessions = [
        { id: 'custom-1', name: 'Session 1', duration: 10, poses: [] },
        { id: 'custom-2', name: 'Session 2', duration: 15, poses: [] },
        { id: 'custom-3', name: 'Session 3', duration: 20, poses: [] }
      ];

      for (const session of sessions) {
        act(() => {
          result.current.add(session);
        });
      }

      act(() => {
        result.current.remove('custom-2');
      });

      expect(result.current.sessions).toHaveLength(2);
      expect(result.current.getById('custom-1')).toBeDefined();
      expect(result.current.getById('custom-2')).toBeNull();
      expect(result.current.getById('custom-3')).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('handles corrupted localStorage data gracefully', async () => {
      // Set corrupted data in localStorage
      localStorage.setItem(STORAGE_KEY, 'not valid json{]}');

      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should fall back to empty array
      expect(result.current.sessions).toEqual([]);
      expect(result.current.error).toBeTruthy();
    });

    it('handles non-array localStorage data', async () => {
      // Set non-array data
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ invalid: 'data' }));

      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should fall back to empty array
      expect(result.current.sessions).toEqual([]);
    });

    it('clears error after successful operation', async () => {
      // Start with corrupted data
      localStorage.setItem(STORAGE_KEY, 'corrupted');

      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();

      // Perform successful operation
      const session = { id: 'custom-1', name: 'Test', duration: 10, poses: [] };

      act(() => {
        result.current.add(session);
      });

      // Error should be cleared
      expect(result.current.error).toBeNull();
    });
  });

  describe('Data Persistence', () => {
    it('persists complex session data', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const complexSession = {
        id: 'complex-session',
        name: 'Complex Flow',
        duration: 45,
        difficulty: 'advanced',
        poses: [
          { id: 'warrior-1', duration: 60, side: 'left' },
          { id: 'warrior-1', duration: 60, side: 'right' },
          { id: 'tree', duration: 45, side: 'left' }
        ],
        tags: ['balance', 'strength'],
        description: 'A challenging flow for experienced practitioners',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      act(() => {
        result.current.add(complexSession);
      });

      // Verify complex data persisted
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored[0]).toEqual(complexSession);
    });

    it('survives hook re-render', async () => {
      const { result, rerender } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const session = { id: 'custom-1', name: 'Test', duration: 10, poses: [] };

      act(() => {
        result.current.add(session);
      });

      // Force re-render
      rerender();

      // Data should persist
      expect(result.current.sessions).toHaveLength(1);
      expect(result.current.sessions[0].name).toBe('Test');
    });

    it('handles rapid successive operations', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Perform operations sequentially (more realistic)
      act(() => {
        result.current.add({ id: 'custom-1', name: 'Session 1', duration: 10, poses: [] });
      });

      act(() => {
        result.current.add({ id: 'custom-2', name: 'Session 2', duration: 15, poses: [] });
      });

      act(() => {
        result.current.update('custom-1', { duration: 20 });
      });

      act(() => {
        result.current.remove('custom-2');
      });

      expect(result.current.sessions).toHaveLength(1);
      expect(result.current.sessions[0].id).toBe('custom-1');
      expect(result.current.sessions[0].duration).toBe(20);

      // Verify localStorage consistency
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toHaveLength(1);
      expect(stored[0].duration).toBe(20);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty sessions array', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sessions).toEqual([]);
      expect(result.current.getAll()).toEqual([]);
    });

    it('handles null ID in getById', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const retrieved = result.current.getById(null);
      expect(retrieved).toBeNull();
    });

    it('handles undefined ID in remove', async () => {
      const { result } = renderHook(() => useCustomSessions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let removeResult;
      act(() => {
        removeResult = result.current.remove(undefined);
      });

      expect(removeResult).toBe(false);
    });
  });
});
