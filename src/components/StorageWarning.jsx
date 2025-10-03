/**
 * StorageWarning Component
 * Shows warning when device storage is running low (>80%)
 *
 * Prevents data loss by alerting users before storage is full
 */

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { getStorageQuota } from "../utils/dataExport";

function StorageWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [storageInfo, setStorageInfo] = useState(null);

  useEffect(() => {
    const checkStorage = async () => {
      const quota = await getStorageQuota();
      if (quota && parseFloat(quota.percent) > 80) {
        setStorageInfo(quota);
        setShowWarning(true);
      }
    };

    checkStorage();
  }, []);

  if (!showWarning || !storageInfo) return null;

  return (
    <div className="fixed inset-x-4 bottom-20 z-40 rounded-lg bg-state-warning p-4 text-white shadow-lg duration-300 animate-in slide-in-from-bottom-2">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 font-medium">Storage Almost Full</h3>
          <p className="mb-2 text-sm opacity-90">
            Your device storage is at {storageInfo.percent}%. Export your data
            to create a backup.
          </p>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${storageInfo.percent}%` }}
            />
          </div>
        </div>
        <button
          onClick={() => setShowWarning(false)}
          className="shrink-0 text-white/80 transition-colors hover:text-white"
          aria-label="Dismiss warning"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
}

export default StorageWarning;
