import { useMemo } from 'react';
import usePreferencesStore from '../stores/preferences';

/**
 * Custom hook for filtering items into favorites and non-favorites
 *
 * PDDL-Inspired Design:
 * - Preconditions: Items array must have objects with 'id' field
 * - Effects: Returns filtered arrays without mutating original data
 * - Invariants: Total items = favorites + non-favorites
 * - External Validation: useMemo ensures performance optimization
 *
 * @template T - Generic type for items (must have 'id' property)
 * @param {T[]} items - Array of items to filter (each must have an 'id' field)
 * @param {'session' | 'breathing'} type - Type of items to determine which favorites to use
 * @returns {{
 *   favorites: T[],
 *   nonFavorites: T[],
 *   favoriteIds: string[]
 * }} Object containing filtered arrays and favorite IDs
 *
 * @example
 * // For sessions
 * const { favorites, nonFavorites, favoriteIds } = useFavorites(sessions, 'session');
 *
 * @example
 * // For breathing exercises
 * const { favorites, nonFavorites, favoriteIds } = useFavorites(exercises, 'breathing');
 */
export function useFavorites(items, type) {
  // PDDL State Acquisition: Get favorite IDs from store based on type
  // Note: Hooks must be called unconditionally (React Rules of Hooks)
  const { getFavoriteSessionIds, getFavoriteExerciseIds } = usePreferencesStore();

  // PDDL Effect Computation: Filter items into favorites and non-favorites
  // External Validation: useMemo provides performance verification (only recomputes when dependencies change)
  const result = useMemo(() => {
    // PDDL Precondition Check: Validate type parameter
    if (type !== 'session' && type !== 'breathing') {
      console.error(`Invalid type: ${type}. Expected 'session' or 'breathing'`);
      return {
        favorites: [],
        nonFavorites: items || [],
        favoriteIds: []
      };
    }

    // Get appropriate favorite IDs based on type
    const favoriteIds = type === 'session'
      ? getFavoriteSessionIds()
      : getFavoriteExerciseIds();
    // Precondition: Handle edge case of empty or invalid items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        favorites: [],
        nonFavorites: [],
        favoriteIds: favoriteIds || []
      };
    }

    // Precondition: Validate that favoriteIds is an array
    const validFavoriteIds = Array.isArray(favoriteIds) ? favoriteIds : [];

    // Effect: Partition items into favorites and non-favorites
    const favorites = items.filter(item => {
      // Precondition: Ensure item has an id property
      if (!item || typeof item.id === 'undefined') {
        console.warn('Item without id found:', item);
        return false;
      }
      return validFavoriteIds.includes(item.id);
    });

    const nonFavorites = items.filter(item => {
      // Precondition: Ensure item has an id property
      if (!item || typeof item.id === 'undefined') {
        console.warn('Item without id found:', item);
        return false;
      }
      return !validFavoriteIds.includes(item.id);
    });

    // Invariant Verification: Total items should equal favorites + non-favorites
    const totalFiltered = favorites.length + nonFavorites.length;
    const validItems = items.filter(item => item && typeof item.id !== 'undefined');
    if (totalFiltered !== validItems.length) {
      console.warn(
        `Invariant violation: Total filtered (${totalFiltered}) !== Valid items (${validItems.length})`
      );
    }

    return {
      favorites,
      nonFavorites,
      favoriteIds: validFavoriteIds
    };
  }, [items, type, getFavoriteSessionIds, getFavoriteExerciseIds]); // Dependencies: Recompute when items, type, or store methods change

  return result;
}

export default useFavorites;
