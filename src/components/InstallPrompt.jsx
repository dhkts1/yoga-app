import { useState, useEffect } from 'react';
import { Button } from './design-system';
import { haptics } from '../utils/haptics';

/**
 * PWA Install Prompt Component
 *
 * Shows a prompt to install the app when the browser's
 * beforeinstallprompt event fires (PWA installability detected)
 */
function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();

      // Store the event so it can be triggered later
      setDeferredPrompt(e);

      // Show our custom install prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Add haptic feedback
    haptics.medium();

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User response to install prompt: ${outcome}`);

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    haptics.light();
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-x-4 bottom-20 z-40 animate-slide-up rounded-lg border border-border bg-card p-4 shadow-lg">
      <h3 className="mb-2 font-medium text-foreground">Install Mindful Yoga</h3>
      <p className="mb-3 text-sm text-muted-foreground">
        Install our app for quick access and offline practice
      </p>
      <div className="flex gap-2">
        <Button onClick={handleInstall} variant="primary" size="sm">
          Install
        </Button>
        <Button onClick={handleDismiss} variant="ghost" size="sm">
          Not Now
        </Button>
      </div>
    </div>
  );
}

export default InstallPrompt;
