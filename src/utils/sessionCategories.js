import { sessions } from '../data/sessions';
import { breathingExercises } from '../data/breathing';

/**
 * Session Categories Utility
 *
 * Provides categorization and filtering logic for yoga sessions and breathing exercises.
 * Used by the Sessions/Discover screen to organize content by purpose and time of day.
 */

// Category definitions with metadata
export const categories = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'morning', label: 'Morning', icon: '🌅' },
  { id: 'evening', label: 'Evening', icon: '🌙' },
  { id: 'sleep', label: 'Sleep', icon: '💤' },
  { id: 'energy', label: 'Energy', icon: '⚡' },
  { id: 'breathing', label: 'Breathing', icon: '🫁' },
  { id: 'custom', label: 'Custom', icon: '🎨' }
];

// Session to category mapping
const sessionCategoryMap = {
  'morning-energizer': ['morning', 'energy'],
  'lunch-break-relief': ['energy'],
  'evening-wind-down': ['evening', 'sleep'],
  'quick-reset': ['energy'],
  'desk-relief': ['energy', 'morning'],
  'hip-openers': ['evening'],
  'sleep-prep': ['evening', 'sleep'],
  'core-flow': ['morning', 'energy'],
  'balance-challenge': ['morning'],
  'full-practice': ['morning']
};

// Breathing exercise to category mapping
const breathingCategoryMap = {
  'box-breathing': ['breathing'],
  'four-seven-eight': ['breathing', 'sleep'],
  'energizing-breath': ['breathing', 'energy'],
  'alternate-nostril': ['breathing']
};

/**
 * Get all categories that a session belongs to
 */
export const getSessionCategories = (sessionId) => {
  return sessionCategoryMap[sessionId] || [];
};

/**
 * Get all categories that a breathing exercise belongs to
 */
export const getBreathingExerciseCategories = (exerciseId) => {
  return breathingCategoryMap[exerciseId] || [];
};

/**
 * Check if a session belongs to a specific category
 */
export const sessionMatchesCategory = (sessionId, categoryId) => {
  if (categoryId === 'all') return true;
  const categories = getSessionCategories(sessionId);
  return categories.includes(categoryId);
};

/**
 * Check if a breathing exercise belongs to a specific category
 */
export const breathingExerciseMatchesCategory = (exerciseId, categoryId) => {
  if (categoryId === 'all') return true;
  if (categoryId === 'breathing') return true; // All breathing exercises in breathing category
  const categories = getBreathingExerciseCategories(exerciseId);
  return categories.includes(categoryId);
};

/**
 * Check if a custom session should be shown in a category
 */
export const customSessionMatchesCategory = (categoryId) => {
  return categoryId === 'all' || categoryId === 'custom';
};

/**
 * Filter pre-built sessions by category
 */
export const filterSessionsByCategory = (categoryId) => {
  if (categoryId === 'all') return sessions;
  if (categoryId === 'custom') return [];

  return sessions.filter(session =>
    sessionMatchesCategory(session.id, categoryId)
  );
};

/**
 * Filter breathing exercises by category
 */
export const filterBreathingExercisesByCategory = (categoryId) => {
  if (categoryId === 'all') return breathingExercises;
  if (categoryId === 'custom') return [];
  if (categoryId === 'breathing') return breathingExercises;

  return breathingExercises.filter(exercise =>
    breathingExerciseMatchesCategory(exercise.id, categoryId)
  );
};

/**
 * Filter custom sessions by category
 */
export const filterCustomSessionsByCategory = (customSessions, categoryId) => {
  if (categoryId === 'all' || categoryId === 'custom') return customSessions;
  return [];
};

/**
 * Get count of items in each category
 */
export const getCategoryCounts = (customSessions = []) => {
  const counts = {
    all: sessions.length + breathingExercises.length + customSessions.length,
    morning: 0,
    evening: 0,
    sleep: 0,
    energy: 0,
    breathing: breathingExercises.length,
    custom: customSessions.length
  };

  // Count pre-built sessions
  sessions.forEach(session => {
    const sessionCategories = getSessionCategories(session.id);
    sessionCategories.forEach(cat => {
      if (counts[cat] !== undefined) {
        counts[cat]++;
      }
    });
  });

  // Count breathing exercises (already counted in breathing category)
  breathingExercises.forEach(exercise => {
    const exerciseCategories = getBreathingExerciseCategories(exercise.id);
    exerciseCategories.forEach(cat => {
      if (cat !== 'breathing' && counts[cat] !== undefined) {
        counts[cat]++;
      }
    });
  });

  return counts;
};

/**
 * Check if a category has any content
 */
export const categoryHasContent = (categoryId, customSessions = []) => {
  const counts = getCategoryCounts(customSessions);
  return counts[categoryId] > 0;
};
