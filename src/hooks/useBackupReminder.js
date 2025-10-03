/**
 * useBackupReminder Hook
 * Reminds users to backup their data every 30 days
 *
 * Prevents data loss by encouraging regular backups
 */

import { useEffect, useState, useRef } from 'react';
import { shouldShowBackupReminder, getBackupInfo } from '../utils/dataExport';

export function useBackupReminder() {
  const [showReminder, setShowReminder] = useState(false);
  const [backupInfo, setBackupInfo] = useState(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;

      // Check if reminder should be shown
      const shouldShow = shouldShowBackupReminder();
      setShowReminder(shouldShow);

      // Get backup info
      const info = getBackupInfo();
      setBackupInfo(info);
    }
  }, []);

  return {
    showReminder,
    backupInfo,
    dismissReminder: () => setShowReminder(false)
  };
}

export default useBackupReminder;
