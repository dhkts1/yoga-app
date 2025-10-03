/**
 * Data Validation Utilities
 * Detect and recover from corrupted localStorage data
 *
 * Ensures data integrity by:
 * - Validating JSON structure
 * - Checking required fields
 * - Backing up corrupted data
 * - Providing safe recovery
 */

/**
 * Validate progress store data
 * @param {any} data - Data to validate
 * @returns {boolean} - True if valid
 */
export const validateProgressData = (data) => {
  if (!data) return false;

  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;

    // Check for Zustand persist structure
    if (typeof parsed.state !== 'object') return false;

    const state = parsed.state;

    // Check required fields
    if (typeof state.totalSessions !== 'number') return false;
    if (typeof state.currentStreak !== 'number') return false;
    if (!Array.isArray(state.practiceHistory)) return false;
    if (!Array.isArray(state.breathingHistory)) return false;

    return true;
  } catch (error) {
    console.error('Progress data validation failed:', error);
    return false;
  }
};

/**
 * Validate program progress store data
 * @param {any} data - Data to validate
 * @returns {boolean} - True if valid
 */
export const validateProgramProgressData = (data) => {
  if (!data) return false;

  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;

    // Check for Zustand persist structure
    if (typeof parsed.state !== 'object') return false;

    const state = parsed.state;

    // Check required fields
    if (state.activeProgram !== null && typeof state.activeProgram !== 'object') {
      return false;
    }
    if (!Array.isArray(state.completedPrograms)) return false;

    return true;
  } catch (error) {
    console.error('Program progress data validation failed:', error);
    return false;
  }
};

/**
 * Validate preferences store data
 * @param {any} data - Data to validate
 * @returns {boolean} - True if valid
 */
export const validatePreferencesData = (data) => {
  if (!data) return false;

  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;

    // Check for Zustand persist structure
    if (typeof parsed.state !== 'object') return false;

    const state = parsed.state;

    // Check required fields
    if (typeof state.yoga !== 'object') return false;
    if (typeof state.breathing !== 'object') return false;

    return true;
  } catch (error) {
    console.error('Preferences data validation failed:', error);
    return false;
  }
};

/**
 * Validate and repair a localStorage store
 * Backs up corrupted data and returns validated data or null
 *
 * @param {string} storeName - localStorage key
 * @param {Function} validator - Validation function
 * @returns {Object|null} - Validated data or null if corrupted
 */
export const validateAndRepair = (storeName, validator) => {
  const data = localStorage.getItem(storeName);

  if (!data) {
    console.warn(`${storeName} is empty, will initialize with defaults`);
    return null;
  }

  try {
    const parsed = JSON.parse(data);

    // Run validation
    if (!validator(parsed)) {
      throw new Error('Validation failed');
    }

    return parsed;
  } catch (error) {
    console.error(`${storeName} is corrupted:`, error.message);

    // Move corrupted data to backup
    const backupKey = `${storeName}-corrupted-${Date.now()}`;
    localStorage.setItem(backupKey, data);

    // Remove corrupted data
    localStorage.removeItem(storeName);

    console.warn(`Corrupted data backed up to ${backupKey}`);

    return null;
  }
};

/**
 * Run validation on all stores and report issues
 * @returns {Object} - Validation report
 */
export const validateAllStores = () => {
  const report = {
    valid: [],
    invalid: [],
    missing: []
  };

  const stores = [
    {
      name: 'yoga-progress',
      validator: validateProgressData
    },
    {
      name: 'yoga-program-progress',
      validator: validateProgramProgressData
    },
    {
      name: 'yoga-preferences',
      validator: validatePreferencesData
    }
  ];

  stores.forEach(({ name, validator }) => {
    const data = localStorage.getItem(name);

    if (!data) {
      report.missing.push(name);
    } else if (validator(data)) {
      report.valid.push(name);
    } else {
      report.invalid.push(name);
    }
  });

  return report;
};

/**
 * Clean up old corrupted data backups
 * Keeps only last 3 backups per store
 */
export const cleanupCorruptedBackups = () => {
  const backupKeys = Object.keys(localStorage).filter(key =>
    key.includes('-corrupted-')
  );

  // Group by store name
  const grouped = backupKeys.reduce((acc, key) => {
    const storeName = key.split('-corrupted-')[0];
    if (!acc[storeName]) acc[storeName] = [];
    acc[storeName].push(key);
    return acc;
  }, {});

  // Keep only last 3 backups per store
  Object.values(grouped).forEach(keys => {
    if (keys.length > 3) {
      // Sort by timestamp (newest first)
      const sorted = keys.sort((a, b) => {
        const tsA = parseInt(a.split('-corrupted-')[1]);
        const tsB = parseInt(b.split('-corrupted-')[1]);
        return tsB - tsA;
      });

      // Remove oldest backups
      sorted.slice(3).forEach(key => {
        localStorage.removeItem(key);
        console.log(`Cleaned up old backup: ${key}`);
      });
    }
  });
};
