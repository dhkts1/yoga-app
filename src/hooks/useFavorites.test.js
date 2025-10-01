import { renderHook } from '@testing-library/react';
import { describe, test, expect, beforeEach } from 'vitest';
import { useFavorites } from './useFavorites';
import usePreferencesStore from '../stores/preferences';

// Mock the preferences store
vi.mock('../stores/preferences');

describe('useFavorites', () => {
  beforeEach(() => {
    // Reset mock before each test
    vi.clearAllMocks();
  });

  describe('Session filtering', () => {
    test('should separate sessions into favorites and non-favorites', () => {
      const sessions = [
        { id: 'session1', name: 'Morning Flow' },
        { id: 'session2', name: 'Evening Stretch' },
        { id: 'session3', name: 'Power Yoga' }
      ];

      usePreferencesStore.mockReturnValue({
        getFavoriteSessionIds: () => ['session1', 'session3'],
        getFavoriteExerciseIds: () => []
      });

      const { result } = renderHook(() => useFavorites(sessions, 'session'));

      expect(result.current.favorites).toHaveLength(2);
      expect(result.current.nonFavorites).toHaveLength(1);
      expect(result.current.favorites.map(s => s.id)).toEqual(['session1', 'session3']);
      expect(result.current.nonFavorites.map(s => s.id)).toEqual(['session2']);
    });

    test('should handle no favorites', () => {
      const sessions = [
        { id: 'session1', name: 'Morning Flow' },
        { id: 'session2', name: 'Evening Stretch' }
      ];

      usePreferencesStore.mockReturnValue({
        getFavoriteSessionIds: () => [],
        getFavoriteExerciseIds: () => []
      });

      const { result } = renderHook(() => useFavorites(sessions, 'session'));

      expect(result.current.favorites).toHaveLength(0);
      expect(result.current.nonFavorites).toHaveLength(2);
    });

    test('should handle all favorites', () => {
      const sessions = [
        { id: 'session1', name: 'Morning Flow' },
        { id: 'session2', name: 'Evening Stretch' }
      ];

      usePreferencesStore.mockReturnValue({
        getFavoriteSessionIds: () => ['session1', 'session2'],
        getFavoriteExerciseIds: () => []
      });

      const { result } = renderHook(() => useFavorites(sessions, 'session'));

      expect(result.current.favorites).toHaveLength(2);
      expect(result.current.nonFavorites).toHaveLength(0);
    });
  });

  describe('Breathing exercise filtering', () => {
    test('should separate exercises into favorites and non-favorites', () => {
      const exercises = [
        { id: 'ex1', name: '4-7-8 Breathing' },
        { id: 'ex2', name: 'Box Breathing' },
        { id: 'ex3', name: 'Alternate Nostril' }
      ];

      usePreferencesStore.mockReturnValue({
        getFavoriteSessionIds: () => [],
        getFavoriteExerciseIds: () => ['ex2']
      });

      const { result } = renderHook(() => useFavorites(exercises, 'breathing'));

      expect(result.current.favorites).toHaveLength(1);
      expect(result.current.nonFavorites).toHaveLength(2);
      expect(result.current.favorites[0].id).toBe('ex2');
    });
  });

  describe('Edge cases', () => {
    test('should handle empty items array', () => {
      usePreferencesStore.mockReturnValue({
        getFavoriteSessionIds: () => ['session1'],
        getFavoriteExerciseIds: () => []
      });

      const { result } = renderHook(() => useFavorites([], 'session'));

      expect(result.current.favorites).toEqual([]);
      expect(result.current.nonFavorites).toEqual([]);
      expect(result.current.favoriteIds).toEqual(['session1']);
    });

    test('should handle null items', () => {
      usePreferencesStore.mockReturnValue({
        getFavoriteSessionIds: () => [],
        getFavoriteExerciseIds: () => []
      });

      const { result } = renderHook(() => useFavorites(null, 'session'));

      expect(result.current.favorites).toEqual([]);
      expect(result.current.nonFavorites).toEqual([]);
    });

    test('should handle invalid type parameter', () => {
      const sessions = [{ id: 'session1', name: 'Test' }];

      usePreferencesStore.mockReturnValue({
        getFavoriteSessionIds: () => [],
        getFavoriteExerciseIds: () => []
      });

      // Suppress console.error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useFavorites(sessions, 'invalid'));

      expect(result.current.favorites).toEqual([]);
      expect(result.current.nonFavorites).toEqual(sessions);
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('Invalid type')
      );

      consoleError.mockRestore();
    });

    test('should filter out items without id', () => {
      const sessions = [
        { id: 'session1', name: 'Valid' },
        { name: 'Invalid - no id' },
        { id: 'session2', name: 'Valid' }
      ];

      usePreferencesStore.mockReturnValue({
        getFavoriteSessionIds: () => ['session1'],
        getFavoriteExerciseIds: () => []
      });

      // Suppress console.warn for this test
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { result } = renderHook(() => useFavorites(sessions, 'session'));

      expect(result.current.favorites).toHaveLength(1);
      expect(result.current.nonFavorites).toHaveLength(1);
      expect(consoleWarn).toHaveBeenCalledWith(
        'Item without id found:',
        expect.objectContaining({ name: 'Invalid - no id' })
      );

      consoleWarn.mockRestore();
    });
  });

  describe('Performance', () => {
    test('should maintain invariant: total items = favorites + non-favorites', () => {
      const sessions = [
        { id: 'session1', name: 'Test 1' },
        { id: 'session2', name: 'Test 2' },
        { id: 'session3', name: 'Test 3' },
        { id: 'session4', name: 'Test 4' }
      ];

      usePreferencesStore.mockReturnValue({
        getFavoriteSessionIds: () => ['session1', 'session3'],
        getFavoriteExerciseIds: () => []
      });

      const { result } = renderHook(() => useFavorites(sessions, 'session'));

      const total = result.current.favorites.length + result.current.nonFavorites.length;
      expect(total).toBe(sessions.length);
    });
  });
});
