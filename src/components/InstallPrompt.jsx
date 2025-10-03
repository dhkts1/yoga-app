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
    <div className="fixed bottom-20 left-4 right-4 bg-card p-4 rounded-lg shadow-lg border border-border z-40 animate-slide-up">
      <h3 className="font-medium mb-2 text-foreground">Install Mindful Yoga</h3>
      <p className="text-sm text-muted-foreground mb-3">
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
