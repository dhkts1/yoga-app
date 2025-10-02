import { useState, useEffect, useCallback } from 'react';

/**
 * Generic hook for managing any data in localStorage with automatic JSON serialization
 *
 * Features:
 * - Automatic JSON serialization/deserialization
 * - Multi-tab synchronization via storage events
 * - Graceful error handling for corrupted data
 * - SSR-safe (checks for window/localStorage availability)
 * - Type-safe with initial value fallback
 * - Stable setValue function via useCallback
 *
 * @template T
 * @param {string} key - localStorage key
 * @param {T} initialValue - Default value if key doesn't exist
 * @returns {[T, (value: T | ((prev: T) => T)) => void, () => void, Error|null]} [value, setValue, removeValue, error]
 *
 * @example
 * // Simple string storage
 * const [name, setName, removeName] = useLocalStorage('userName', 'Guest');
 *
 * @example
 * // Object storage with draft auto-save
 * const [draft, setDraft, clearDraft] = useLocalStorage('sessionDraft', {
 *   name: '',
 *   poses: []
 * });
 *
 * @example
 * // Functional updates (like useState)
 * const [count, setCount] = useLocalStorage('counter', 0);
 * setCount(prev => prev + 1);
 */
const useLocalStorage = (key, initialValue) => {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    // SSR-safe: Check if window is available
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Get from localStorage by key
      const item = window.localStorage.getItem(key);

      // Parse stored JSON or return initialValue if doesn't exist
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error (corrupted data), return initialValue
      console.warn(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Error state for tracking localStorage failures
  const [error, setError] = useState(null);

  /**
   * setValue wrapper that saves to localStorage
   * Supports both direct values and functional updates like useState
   */
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function (like useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }

      // Clear error on successful save
      setError(null);
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
      setError(error);
    }
  }, [key, storedValue]);

  /**
   * Remove value from localStorage and reset to initialValue
   */
  const removeValue = useCallback(() => {
    try {
      // Remove from localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }

      // Reset to initial value
      setStoredValue(initialValue);
      setError(null);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      setError(error);
    }
  }, [key, initialValue]);

  /**
   * Multi-tab synchronization via storage events
   * Automatically syncs state when localStorage changes in other tabs
   */
  useEffect(() => {
    // SSR-safe: Only add listener if window is available
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e) => {
      // Only respond to changes to our specific key
      if (e.key === key) {
        try {
          // Update state with new value from other tab
          const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
          setStoredValue(newValue);
          setError(null);
        } catch (error) {
          console.warn(`Error syncing localStorage key "${key}" from other tab:`, error);
          setError(error);
          setStoredValue(initialValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue, error];
};

export default useLocalStorage;
