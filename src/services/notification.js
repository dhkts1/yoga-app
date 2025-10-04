// Audio Notification Service - Web Audio API implementation for practice transitions
// Provides audio beep notifications when poses complete
// Integrates with preferences store for user settings

class NotificationService {
  constructor() {
    this.audioContext = null;
    this.isEnabled = false;
    this.volume = 0.5; // Default 50% volume
    this.frequency = 432; // Default frequency (432Hz - calming "healing frequency")
    this.oscillatorType = "sine"; // Sine wave is the calmest
    this.duration = 0.3; // 300ms duration

    // Initialize AudioContext lazily (requires user interaction on iOS)
    this.initAudioContext = this.initAudioContext.bind(this);
  }

  // Initialize AudioContext (call after user interaction)
  initAudioContext() {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
      } catch (error) {
        console.warn("Web Audio API not supported:", error);
        this.audioContext = null;
      }
    }
    return this.audioContext;
  }

  // Load settings from preferences store
  loadSettings(preferences) {
    if (preferences) {
      this.isEnabled = preferences.enabled ?? this.isEnabled;
      this.volume = preferences.volume ?? this.volume;
      this.frequency = preferences.frequency ?? this.frequency;
    }
  }

  /**
   * Play beep notification sound
   * Uses Web Audio API to generate a calming sine wave tone
   */
  playBeep() {
    if (!this.isEnabled) return;

    // Initialize audio context if needed
    const context = this.initAudioContext();
    if (!context) {
      console.warn("AudioContext not available");
      return;
    }

    try {
      // Create oscillator (sound generator)
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      // Connect nodes: oscillator -> gain -> output
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      // Configure sound with current settings
      oscillator.frequency.value = this.frequency;
      oscillator.type = this.oscillatorType;
      gainNode.gain.value = this.volume; // 0-1.0

      // Play sound
      const startTime = context.currentTime;
      oscillator.start(startTime);
      oscillator.stop(startTime + this.duration);

      // Cleanup after sound finishes
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    } catch (error) {
      console.warn("Failed to play beep:", error);
    }
  }

  /**
   * Play transition notification (pose completion)
   * Wrapper for playBeep with semantic naming
   */
  playTransition() {
    this.playBeep();
  }

  // Settings management
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  setFrequency(frequency) {
    // Allow customization of frequency (200-1000Hz for calm tones)
    this.frequency = Math.max(200, Math.min(1000, frequency));
  }

  // Get current settings
  getSettings() {
    return {
      enabled: this.isEnabled,
      volume: this.volume,
      frequency: this.frequency,
    };
  }

  // Check if Web Audio API is supported
  isSupported() {
    return !!(window.AudioContext || window.webkitAudioContext);
  }

  // Resume audio context (needed after user interaction on some browsers)
  resume() {
    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

  // Close audio context (cleanup)
  close() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
