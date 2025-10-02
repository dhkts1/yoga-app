import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

/**
 * MoodTracker Component
 *
 * Pre/post practice mood and energy tracking with:
 * - 5 emoji mood selection (😔 😐 🙂 😊 😄)
 * - 1-5 energy level scale with visual indicators
 * - Smooth animations and transitions
 * - Optional tracking - users can skip
 * - Non-judgmental language
 */

const MOOD_OPTIONS = [
  { emoji: '😔', value: 1, label: 'Down' },
  { emoji: '😐', value: 2, label: 'Okay' },
  { emoji: '🙂', value: 3, label: 'Good' },
  { emoji: '😊', value: 4, label: 'Happy' },
  { emoji: '😄', value: 5, label: 'Great' }
];

const ENERGY_LEVELS = [
  { value: 1, label: 'Very Low', color: 'bg-state-error/30' },
  { value: 2, label: 'Low', color: 'bg-state-warning/30' },
  { value: 3, label: 'Moderate', color: 'bg-gold/30' },
  { value: 4, label: 'High', color: 'bg-state-success/30' },
  { value: 5, label: 'Very High', color: 'bg-state-success/50' }
];

function MoodTracker({
  title = "How are you feeling?",
  onComplete,
  onSkip,
  isPostPractice = false,
  onDontShowAgain,
  className = ""
}) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedEnergy, setSelectedEnergy] = useState(null);
  const [showEnergyStep, setShowEnergyStep] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    // Auto-advance to energy selection after mood is selected
    setTimeout(() => {
      setShowEnergyStep(true);
    }, 300);
  };

  const handleEnergySelect = (energy) => {
    setSelectedEnergy(energy);
    // Auto-complete after energy is selected
    setTimeout(() => {
      if (dontShowAgain && onDontShowAgain) {
        onDontShowAgain();
      }
      onComplete({ mood: selectedMood, energy: energy }); // Use parameter, not stale state
    }, 300);
  };

  const handleSkip = () => {
    if (dontShowAgain && onDontShowAgain) {
      onDontShowAgain();
    }
    onSkip();
  };

  return (
    <div className={`bg-card rounded-2xl p-4 sm:p-6 shadow-lg max-w-sm mx-4 sm:mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-primary mb-2">
          {title}
        </h3>
        <p className="text-sm text-secondary">
          {isPostPractice
            ? "Let's see how your practice went"
            : "This helps us understand your starting point"
          }
        </p>
      </div>

      {/* Mood Selection */}
      {!showEnergyStep && (
        <div className="animate-fade-in">
          <h4 className="text-sm font-medium text-muted-foreground mb-4 text-center">
            How's your mood right now?
          </h4>

          <div className="grid grid-cols-5 gap-1 sm:gap-2 mb-6">
            {MOOD_OPTIONS.map((mood) => (
              <motion.button
                key={mood.value}
                onClick={() => handleMoodSelect(mood)}
                whileTap={{
                  scale: 1.2,
                  rotate: [0, -5, 5, 0],
                  transition: {
                    scale: { type: 'spring', stiffness: 300, damping: 15 },
                    rotate: { type: 'tween', duration: 0.3 }
                  }
                }}
                className={`
                  relative aspect-square rounded-xl border-2 transition-all duration-300
                  hover:scale-105 min-h-[44px] flex items-center justify-center
                  ${selectedMood?.value === mood.value
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border hover:border-primary/50 hover:bg-muted'
                  }
                `}
                aria-label={`Mood: ${mood.label}`}
              >
                <span className="text-2xl" role="img" aria-label={mood.label}>
                  {mood.emoji}
                </span>
                {selectedMood?.value === mood.value && (
                  <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-primary bg-card rounded-full" />
                )}
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-1 sm:gap-2 mb-6">
            {MOOD_OPTIONS.map((mood) => (
              <p key={mood.value} className="text-xs text-center text-secondary">
                {mood.label}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Energy Level Selection */}
      {showEnergyStep && (
        <div className="animate-fade-in">
          <h4 className="text-sm font-medium text-muted-foreground mb-4 text-center">
            What's your energy level?
          </h4>

          <div className="space-y-3 mb-6">
            {ENERGY_LEVELS.map((level) => (
              <motion.button
                key={level.value}
                onClick={() => handleEnergySelect(level)}
                whileTap={{
                  scale: 1.02,
                  transition: { type: 'spring', stiffness: 400, damping: 20 }
                }}
                className={`
                  w-full p-3 rounded-lg border-2 transition-all duration-300
                  hover:scale-[1.02] min-h-[44px]
                  flex items-center justify-between
                  ${selectedEnergy?.value === level.value
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border hover:border-primary/50 hover:bg-muted'
                  }
                `}
                aria-label={`Energy level: ${level.label}`}
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={selectedEnergy?.value === level.value ? {
                      scale: [1, 1.2, 1],
                      transition: { duration: 0.3 }
                    } : {}}
                    className={`w-6 h-6 rounded-full ${level.color} transition-all duration-300`}
                  />
                  <span className="text-sm font-medium text-primary">
                    {level.label}
                  </span>
                </div>

                {/* Energy indicator bars */}
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <motion.div
                      key={index}
                      animate={selectedEnergy?.value === level.value && index < level.value ? {
                        scaleY: [1, 1.3, 1],
                        transition: { duration: 0.3, delay: index * 0.05 }
                      } : {}}
                      className={`w-1.5 h-4 rounded-full transition-all duration-300 ${
                        index < level.value ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                {selectedEnergy?.value === level.value && (
                  <CheckCircle className="h-5 w-5 text-primary ml-2" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Progress indicator */}
      <div className="flex justify-center space-x-2 mb-6">
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
          selectedMood ? 'bg-primary' : 'bg-muted'
        }`} />
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
          showEnergyStep ? 'bg-primary' : 'bg-muted'
        }`} />
      </div>

      {/* Don't show again and Skip options */}
      <div className="space-y-3">
        {/* Don't show again checkbox */}
        <label className="flex items-center justify-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="w-4 h-4 text-muted-foreground border-primary rounded focus:ring-sage-500"
          />
          <span className="text-sm text-secondary">
            Don't show mood tracking again
          </span>
        </label>

        {/* Skip button */}
        <div className="text-center">
          <button
            onClick={handleSkip}
            className="text-sm text-secondary hover:text-primary transition-colors duration-200 underline"
          >
            Skip this step
          </button>
        </div>
      </div>
    </div>
  );
}

export default MoodTracker;