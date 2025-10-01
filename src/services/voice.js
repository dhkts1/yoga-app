// Voice Coaching Service - Web Speech API implementation for yoga guidance
// Provides encouraging coaching, form corrections, and breathing reminders
// Integrates with preferences store for user settings

class VoiceCoachingService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.isEnabled = true;
    this.currentVoice = null;
    this.volume = 0.8;
    this.rate = 0.9;
    this.pitch = 1.0;
    this.personality = 'gentle'; // 'gentle' | 'motivational' | 'minimal'

    // Initialize voices when available
    this.initializeVoices();

    // Handle voice changes (some browsers load voices asynchronously)
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        this.initializeVoices();
      };
    }
  }

  // Load settings from preferences store
  loadSettings(preferences) {
    if (preferences) {
      this.isEnabled = preferences.enabled ?? this.isEnabled;
      this.personality = preferences.personality ?? this.personality;
      this.rate = preferences.speed ?? this.rate;
      this.volume = preferences.volume ?? this.volume;
    }
  }

  // Apply personality to messages
  applyPersonality(messages) {
    if (this.personality === 'minimal') {
      // Use shorter, more direct messages
      return messages.slice(0, 1); // Return only first option
    } else if (this.personality === 'motivational') {
      // Prefer energetic messages (if available, use last message which tends to be more energetic)
      return messages.length > 1 ? [messages[messages.length - 1]] : messages;
    }
    // 'gentle' personality uses all messages as-is
    return messages;
  }

  initializeVoices() {
    this.voices = this.synth.getVoices();

    // Prefer natural, calming voices
    // Look for female voices which tend to be more calming for yoga
    const preferredVoices = [
      'Samantha', // macOS
      'Google UK English Female', // Chrome
      'Microsoft Zira Desktop', // Windows
      'Karen', // macOS
      'Fiona' // macOS
    ];

    for (const voiceName of preferredVoices) {
      const voice = this.voices.find(v => v.name.includes(voiceName));
      if (voice) {
        this.currentVoice = voice;
        break;
      }
    }

    // Fallback to first English voice
    if (!this.currentVoice) {
      this.currentVoice = this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];
    }
  }

  // Core speak method with error handling
  speak(text, options = {}) {
    if (!this.isEnabled || !text) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Apply voice settings
    if (this.currentVoice) {
      utterance.voice = this.currentVoice;
    }

    utterance.volume = options.volume || this.volume;
    utterance.rate = options.rate || this.rate;
    utterance.pitch = options.pitch || this.pitch;

    // Error handling
    utterance.onerror = (event) => {
      console.warn('Speech synthesis error:', event.error);
    };

    this.synth.speak(utterance);
  }

  // Coaching prompts for different yoga scenarios
  announceSessionStart(sessionName) {
    let messages = [
      `Welcome to your ${sessionName} practice. Let's begin with mindful breathing.`,
      `Ready to start your ${sessionName}? Take a deep breath and let's flow together.`,
      `Time for your ${sessionName}. Find your breath and let's create some space.`
    ];

    if (this.personality === 'minimal') {
      messages = [`Starting ${sessionName}`];
    } else if (this.personality === 'motivational') {
      messages = [
        `Let's do this! ${sessionName} time. Bring your energy!`,
        `Ready to crush your ${sessionName}? Let's go!`,
        `${sessionName} - let's make it happen!`
      ];
    }

    const filteredMessages = this.applyPersonality(messages);
    this.speak(this.getRandomMessage(filteredMessages), { rate: 0.8 });
  }

  announcePoseTransition(currentPose, nextPose, timeRemaining) {
    if (timeRemaining <= 5 && timeRemaining > 0) {
      const messages = [
        `${timeRemaining} more seconds in ${currentPose}`,
        `Hold for ${timeRemaining} more`,
        `Almost there, ${timeRemaining} seconds`
      ];
      this.speak(this.getRandomMessage(messages), { rate: 1.0 });
    } else if (timeRemaining === 0 && nextPose) {
      const messages = [
        `Beautiful. Now let's move into ${nextPose}`,
        `Wonderful. Transition mindfully to ${nextPose}`,
        `Nice work. Let's flow into ${nextPose}`
      ];
      this.speak(this.getRandomMessage(messages), { rate: 0.9 });
    }
  }

  announceNewPose(poseName, instructions = []) {
    // First announce the pose
    setTimeout(() => {
      this.speak(`${poseName}`, { rate: 0.8 });
    }, 1000);

    // Then provide a key instruction after a pause
    if (instructions.length > 0) {
      setTimeout(() => {
        const instruction = instructions[0]; // Use first instruction as primary cue
        this.speak(instruction, { rate: 0.9 });
      }, 3000);
    }
  }

  // Encouraging form corrections and general motivation
  giveFormCorrection(commonMistakes = []) {
    if (commonMistakes.length === 0) return;

    const correctionPrefix = [
      "Remember to",
      "Focus on",
      "Don't forget to"
    ];

    const mistake = commonMistakes[Math.floor(Math.random() * commonMistakes.length)];
    const prefix = correctionPrefix[Math.floor(Math.random() * correctionPrefix.length)];

    // Convert mistake to positive instruction
    const positiveInstruction = this.convertToPositiveInstruction(mistake);

    this.speak(`${prefix} ${positiveInstruction}`, { rate: 0.9 });
  }

  giveEncouragement() {
    let encouragements = [
      "You're doing beautifully",
      "Great work, keep breathing",
      "You've got this",
      "Beautiful practice",
      "Nice and steady",
      "Breathe into the pose",
      "Trust your body",
      "You're exactly where you need to be",
      "Feel your strength",
      "Let your breath guide you"
    ];

    if (this.personality === 'minimal') {
      encouragements = ["Good", "Nice", "Keep going"];
    } else if (this.personality === 'motivational') {
      encouragements = [
        "You're crushing it!",
        "Amazing work! Keep pushing!",
        "Absolutely killing it!",
        "That's the spirit! Strong!",
        "Powerful! You've got this!",
        "Yes! Feel that strength!",
        "Incredible! Keep that energy!"
      ];
    }

    const filteredEncouragements = this.applyPersonality(encouragements);
    this.speak(this.getRandomMessage(filteredEncouragements), { rate: 0.8, pitch: 1.1 });
  }

  remindToBreathe() {
    const breathingReminders = [
      "Don't forget to breathe",
      "Let your breath flow naturally",
      "Take a deep breath",
      "Breathe deeply into the pose",
      "Use your breath to deepen the stretch",
      "Inhale space, exhale tension"
    ];

    this.speak(this.getRandomMessage(breathingReminders), { rate: 0.8 });
  }

  announceSessionComplete() {
    let completionMessages = [
      "Beautiful practice. Take a moment to notice how you feel.",
      "Wonderful work today. Thank you for showing up for yourself.",
      "Your practice is complete. Rest in the benefits of your effort.",
      "Well done. Carry this sense of calm with you."
    ];

    if (this.personality === 'minimal') {
      completionMessages = ["Practice complete", "Well done", "Finished"];
    } else if (this.personality === 'motivational') {
      completionMessages = [
        "Outstanding work! You showed up and crushed it!",
        "Yes! Practice complete. You're a champion!",
        "Boom! Another amazing practice. You're unstoppable!",
        "Incredible session! Be proud of what you accomplished!"
      ];
    }

    const filteredMessages = this.applyPersonality(completionMessages);
    this.speak(this.getRandomMessage(filteredMessages), { rate: 0.7, pitch: 0.9 });
  }

  // Utility methods
  getRandomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)];
  }

  convertToPositiveInstruction(mistake) {
    // Convert common mistakes to positive instructions
    const conversions = {
      'locking knees too tightly': 'keep a soft bend in your knees',
      'hunching shoulders': 'relax your shoulders away from your ears',
      'holding breath': 'breathe naturally',
      'putting too much weight on wrists': 'press through your palms and engage your arms',
      'rounding the back': 'lengthen your spine',
      'front knee collapsing inward': 'keep your front knee tracking over your ankle',
      'forcing the twist': 'twist gently with your breath',
      'knees splaying outward': 'keep your knees parallel',
      'placing foot on knee joint': 'place your foot above or below the knee',
      'tensing neck and shoulders': 'soften your neck and shoulders'
    };

    return conversions[mistake.toLowerCase()] || mistake;
  }

  // Settings management
  setEnabled(enabled) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.synth.cancel(); // Stop any current speech
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  setRate(rate) {
    this.rate = Math.max(0.5, Math.min(2, rate));
  }

  setPersonality(personality) {
    if (['gentle', 'motivational', 'minimal'].includes(personality)) {
      this.personality = personality;
    } else {
      console.warn(`Invalid personality: ${personality}. Using 'gentle'.`);
      this.personality = 'gentle';
    }
  }

  getPersonality() {
    return this.personality;
  }

  // Stop all speech
  stop() {
    this.synth.cancel();
  }

  // Get available voices for settings
  getAvailableVoices() {
    return this.voices.filter(voice => voice.lang.startsWith('en'));
  }

  setVoice(voiceURI) {
    const voice = this.voices.find(v => v.voiceURI === voiceURI);
    if (voice) {
      this.currentVoice = voice;
    }
  }
}

// Create singleton instance
const voiceCoaching = new VoiceCoachingService();

export default voiceCoaching;

// Coaching schedule helpers for different pose types
export const getCoachingSchedule = (pose, duration) => {
  const schedule = [];
  const midPoint = Math.floor(duration / 2);

  // Initial pose announcement (immediate)
  schedule.push({
    time: 0,
    action: 'announce',
    data: { pose: pose.nameEnglish, instructions: pose.instructions }
  });

  // Form correction reminder (1/4 through)
  if (duration > 20) {
    schedule.push({
      time: Math.floor(duration / 4),
      action: 'formCorrection',
      data: { mistakes: pose.commonMistakes }
    });
  }

  // Breathing reminder (midpoint)
  if (duration > 15) {
    schedule.push({
      time: midPoint,
      action: 'breathe'
    });
  }

  // Encouragement (3/4 through)
  if (duration > 20) {
    schedule.push({
      time: Math.floor(duration * 0.75),
      action: 'encourage'
    });
  }

  // Countdown for longer poses
  if (duration > 30) {
    schedule.push({
      time: duration - 10,
      action: 'countdown',
      data: { timeRemaining: 10 }
    });
  }

  // Final countdown
  schedule.push({
    time: duration - 5,
    action: 'countdown',
    data: { timeRemaining: 5 }
  });

  return schedule;
};