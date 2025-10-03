/**
 * StorageWarning Component
 * Shows warning when device storage is running low (>80%)
 *
 * Prevents data loss by alerting users before storage is full
 */

import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { getStorageQuota } from '../utils/dataExport';

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
    <div className="fixed bottom-20 left-4 right-4 bg-amber-500 text-white p-4 rounded-lg shadow-lg z-40 animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium mb-1">Storage Almost Full</h3>
          <p className="text-sm opacity-90 mb-2">
            Your device storage is at {storageInfo.percent}%. Export your data to create a backup.
          </p>
          <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${storageInfo.percent}%` }}
            />
          </div>
        </div>
        <button
          onClick={() => setShowWarning(false)}
          className="text-white/80 hover:text-white transition-colors flex-shrink-0"
          aria-label="Dismiss warning"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default StorageWarning;
