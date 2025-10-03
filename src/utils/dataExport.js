/**
 * Data Export/Import Utilities
 * Comprehensive backup and restore for all localStorage data
 *
 * Prevents data loss by allowing users to:
 * - Export all practice data to JSON file
 * - Import backup files to restore data
 * - Monitor storage quota usage
 * - Detect and handle corrupted data
 */

/**
 * Export all app data to downloadable JSON file
 * Includes all stores: progress, programProgress, preferences, customSessions
 */
export const exportData = () => {
  const data = {
    // All localStorage keys used by the app
    progress: localStorage.getItem('yoga-progress'),
    programProgress: localStorage.getItem('yoga-program-progress'),
    preferences: localStorage.getItem('yoga-preferences'),
    customSessions: localStorage.getItem('yoga-custom-sessions'),
    favorites: localStorage.getItem('yoga-favorites'),

    // Metadata
    exportDate: new Date().toISOString(),
    version: '1.0',
    appVersion: '1.0.0'
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mindful-yoga-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // Update last backup date
  localStorage.setItem('last-backup-date', new Date().toISOString());
};

/**
 * Import data from backup file
 * @param {File} file - JSON backup file
 * @returns {Promise<Object>} - Imported data object
 * @throws {Error} - If file is invalid or corrupted
 */
export const importData = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        // Validate data structure
        if (!data.version || !data.exportDate) {
          throw new Error('Invalid backup file format - missing version or exportDate');
        }

        // Validate that at least one store exists
        const hasData = data.progress || data.programProgress || data.preferences;
        if (!hasData) {
          throw new Error('Backup file appears to be empty');
        }

        // Create backup of current data before import
        const currentData = {
          progress: localStorage.getItem('yoga-progress'),
          programProgress: localStorage.getItem('yoga-program-progress'),
          preferences: localStorage.getItem('yoga-preferences'),
          customSessions: localStorage.getItem('yoga-custom-sessions'),
          favorites: localStorage.getItem('yoga-favorites'),
          backupDate: new Date().toISOString()
        };

        // Store as emergency backup
        localStorage.setItem(
          `yoga-backup-before-import-${Date.now()}`,
          JSON.stringify(currentData)
        );

        // Restore each store (only if present in backup)
        if (data.progress) {
          localStorage.setItem('yoga-progress', data.progress);
        }
        if (data.programProgress) {
          localStorage.setItem('yoga-program-progress', data.programProgress);
        }
        if (data.preferences) {
          localStorage.setItem('yoga-preferences', data.preferences);
        }
        if (data.customSessions) {
          localStorage.setItem('yoga-custom-sessions', data.customSessions);
        }
        if (data.favorites) {
          localStorage.setItem('yoga-favorites', data.favorites);
        }

        // Update last restore date
        localStorage.setItem('last-restore-date', new Date().toISOString());

        resolve(data);
      } catch (error) {
        reject(new Error(`Import failed: ${error.message}`));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Get total localStorage usage in KB
 * @returns {string} - Size in KB (e.g., "45.23")
 */
export const getDataSize = () => {
  let total = 0;
  for (let key in localStorage) {
    if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return (total / 1024).toFixed(2); // KB
};

/**
 * Get storage quota information (if available)
 * Uses modern Storage Manager API
 * @returns {Promise<Object|null>} - Quota info or null if unavailable
 */
export const getStorageQuota = async () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      return {
        usage: (estimate.usage / 1024 / 1024).toFixed(2), // MB
        quota: (estimate.quota / 1024 / 1024).toFixed(2), // MB
        percent: ((estimate.usage / estimate.quota) * 100).toFixed(1),
        usageBytes: estimate.usage,
        quotaBytes: estimate.quota
      };
    } catch (error) {
      console.warn('Failed to get storage estimate:', error);
      return null;
    }
  }
  return null;
};

/**
 * Check if backup reminder should be shown
 * @returns {boolean} - True if reminder should show
 */
export const shouldShowBackupReminder = () => {
  const lastBackup = localStorage.getItem('last-backup-date');
  const dismissed = sessionStorage.getItem('backup-reminder-dismissed');

  // Don't show if dismissed this session
  if (dismissed) return false;

  // Show if never backed up
  if (!lastBackup) return true;

  // Show if 30+ days since last backup
  const daysSinceBackup = Math.floor(
    (Date.now() - new Date(lastBackup)) / (1000 * 60 * 60 * 24)
  );

  return daysSinceBackup >= 30;
};

/**
 * Dismiss backup reminder for current session
 */
export const dismissBackupReminder = () => {
  sessionStorage.setItem('backup-reminder-dismissed', 'true');
};

/**
 * Get backup statistics
 * @returns {Object} - Backup info
 */
export const getBackupInfo = () => {
  const lastBackup = localStorage.getItem('last-backup-date');
  const lastRestore = localStorage.getItem('last-restore-date');

  return {
    lastBackupDate: lastBackup,
    lastRestoreDate: lastRestore,
    daysSinceBackup: lastBackup
      ? Math.floor((Date.now() - new Date(lastBackup)) / (1000 * 60 * 60 * 24))
      : null,
    hasNeverBackedUp: !lastBackup
  };
};
