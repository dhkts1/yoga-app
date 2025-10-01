import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing custom yoga sessions in localStorage
 *
 * Features:
 * - Centralized localStorage operations
 * - Multi-tab synchronization via storage events
 * - Graceful error handling for corrupted data
 * - Atomic updates (state + localStorage)
 * - Stable methods via useCallback
 *
 * @returns {Object} Custom sessions API
 * @property {Array} sessions - Array of custom session objects
 * @property {Function} getAll - Get all custom sessions
 * @property {Function} getById - Get custom session by ID
 * @property {Function} add - Add new custom session
 * @property {Function} update - Update existing custom session
 * @property {Function} remove - Delete custom session
 * @property {boolean} isLoading - Loading state during initial load
 * @property {Error|null} error - Last error that occurred
 *
 * @example
 * const { sessions, getById, add, update, remove } = useCustomSessions();
 *
 * // Get specific session
 * const session = getById('custom-123');
 *
 * // Add new session
 * add({ id: 'custom-123', name: 'Morning Flow', poses: [...] });
 *
 * // Update session
 * update('custom-123', { name: 'Updated Morning Flow' });
 *
 * // Delete session
 * remove('custom-123');
 */
const useCustomSessions = () => {
  const STORAGE_KEY = 'customSessions';

  // State management
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Load sessions from localStorage with error handling
   * @returns {Array} Array of sessions or empty array on error
   */
  const loadSessions = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      // Validate that parsed data is an array
      if (!Array.isArray(parsed)) {
        console.error('Custom sessions data is not an array, resetting to empty array');
        return [];
      }

      return parsed;
    } catch (err) {
      console.error('Failed to load custom sessions:', err);
      setError(err);
      // Return empty array on error (graceful degradation)
      return [];
    }
  }, []);

  /**
   * Save sessions to localStorage atomically with state
   * @param {Array} newSessions - Sessions array to save
   */
  const saveSessions = useCallback((newSessions) => {
    try {
      // Validate input
      if (!Array.isArray(newSessions)) {
        throw new Error('Sessions must be an array');
      }

      // Atomic update: state first, then localStorage
      setSessions(newSessions);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions));
      setError(null);
    } catch (err) {
      console.error('Failed to save custom sessions:', err);
      setError(err);
    }
  }, []);

  /**
   * Get all custom sessions
   * @returns {Array} All custom sessions
   */
  const getAll = useCallback(() => {
    return sessions;
  }, [sessions]);

  /**
   * Get custom session by ID
   * @param {string} id - Session ID to find
   * @returns {Object|null} Session object or null if not found
   */
  const getById = useCallback((id) => {
    if (!id) {
      console.warn('getById called with invalid ID:', id);
      return null;
    }
    return sessions.find(session => session.id === id) || null;
  }, [sessions]);

  /**
   * Add new custom session
   * @param {Object} session - Session object to add
   * @throws {Error} If session is invalid or ID already exists
   */
  const add = useCallback((session) => {
    if (!session || typeof session !== 'object') {
      throw new Error('Invalid session object');
    }

    if (!session.id) {
      throw new Error('Session must have an ID');
    }

    // Check for duplicate ID
    const exists = sessions.find(s => s.id === session.id);
    if (exists) {
      throw new Error(`Session with ID ${session.id} already exists`);
    }

    const newSessions = [...sessions, session];
    saveSessions(newSessions);
  }, [sessions, saveSessions]);

  /**
   * Update existing custom session
   * @param {string} id - Session ID to update
   * @param {Object} updates - Partial session object with updates
   * @returns {boolean} True if updated, false if not found
   */
  const update = useCallback((id, updates) => {
    if (!id || !updates || typeof updates !== 'object') {
      console.warn('Invalid update parameters:', { id, updates });
      return false;
    }

    const sessionIndex = sessions.findIndex(s => s.id === id);
    if (sessionIndex === -1) {
      console.warn(`Session with ID ${id} not found`);
      return false;
    }

    const newSessions = [...sessions];
    newSessions[sessionIndex] = {
      ...newSessions[sessionIndex],
      ...updates,
      id // Preserve original ID (prevent ID changes)
    };

    saveSessions(newSessions);
    return true;
  }, [sessions, saveSessions]);

  /**
   * Delete custom session by ID
   * @param {string} id - Session ID to delete
   * @returns {boolean} True if deleted, false if not found
   */
  const remove = useCallback((id) => {
    if (!id) {
      console.warn('remove called with invalid ID:', id);
      return false;
    }

    const newSessions = sessions.filter(s => s.id !== id);

    // Check if anything was actually removed
    if (newSessions.length === sessions.length) {
      console.warn(`Session with ID ${id} not found`);
      return false;
    }

    saveSessions(newSessions);
    return true;
  }, [sessions, saveSessions]);

  // Initial load on mount
  useEffect(() => {
    const initialSessions = loadSessions();
    setSessions(initialSessions);
    setIsLoading(false);
  }, [loadSessions]);

  // Multi-tab synchronization via storage events
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only respond to changes to our storage key
      if (e.key === STORAGE_KEY) {
        const updatedSessions = loadSessions();
        setSessions(updatedSessions);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup event listener on unmount (prevent memory leaks)
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadSessions]);

  return {
    // State
    sessions,
    isLoading,
    error,

    // Methods
    getAll,
    getById,
    add,
    update,
    remove
  };
};

export default useCustomSessions;
