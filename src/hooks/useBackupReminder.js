/**
 * useBackupReminder Hook
 * Reminds users to backup their data every 30 days
 *
 * Prevents data loss by encouraging regular backups
 */

import { useState } from "react";
import { shouldShowBackupReminder, getBackupInfo } from "../utils/dataExport";

export function useBackupReminder() {
  // Lazy initialization - compute once during initial render
  const [showReminder, setShowReminder] = useState(() =>
    shouldShowBackupReminder(),
  );
  const [backupInfo] = useState(() => getBackupInfo());

  return {
    showReminder,
    backupInfo,
    dismissReminder: () => setShowReminder(false),
  };
}

export default useBackupReminder;
