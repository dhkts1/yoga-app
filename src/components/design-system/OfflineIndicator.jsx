import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * OfflineIndicator shows a subtle banner when the app is offline
 * Following the design system's calming aesthetic
 */
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            duration: 0.3
          }}
          className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground px-4 py-2 text-center text-sm font-medium shadow-natural-md"
        >
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-muted rounded-full animate-pulse" />
            You're currently offline. Your practice will still work perfectly!
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default OfflineIndicator;