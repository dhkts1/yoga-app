import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

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
  className = "",
  isOpen = true
}) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedEnergy, setSelectedEnergy] = useState(null);
  const [showEnergyStep, setShowEnergyStep] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Focus trap for accessibility
  const modalRef = useFocusTrap(isOpen, onSkip);

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
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mood-tracker-title"
      className={`mx-4 max-w-sm rounded-2xl bg-card p-4 shadow-lg sm:mx-auto sm:p-6 ${className}`}
    >
      {/* Header */}
      <div className="mb-6 text-center">
        <h3 id="mood-tracker-title" className="mb-2 text-lg font-medium text-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isPostPractice
            ? "Let's see how your practice went"
            : "This helps us understand your starting point"
          }
        </p>
      </div>

      {/* Mood Selection */}
      {!showEnergyStep && (
        <div className="animate-fade-in">
          <h4 className="mb-4 text-center text-sm font-medium text-muted-foreground">
            How's your mood right now?
          </h4>

          <div className="mb-6 grid grid-cols-5 gap-1 sm:gap-2">
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
                  relative flex aspect-square min-h-touch items-center justify-center
                  rounded-xl border-2 transition-all duration-300 hover:scale-105
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
                  <CheckCircle className="absolute -right-1 -top-1 size-4 rounded-full bg-card text-foreground" />
                )}
              </motion.button>
            ))}
          </div>

          <div className="mb-6 grid grid-cols-5 gap-1 sm:gap-2">
            {MOOD_OPTIONS.map((mood) => (
              <p key={mood.value} className="text-center text-xs text-muted-foreground">
                {mood.label}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Energy Level Selection */}
      {showEnergyStep && (
        <div className="animate-fade-in">
          <h4 className="mb-4 text-center text-sm font-medium text-muted-foreground">
            What's your energy level?
          </h4>

          <div className="mb-6 space-y-3">
            {ENERGY_LEVELS.map((level) => (
              <motion.button
                key={level.value}
                onClick={() => handleEnergySelect(level)}
                whileTap={{
                  scale: 1.02,
                  transition: { type: 'spring', stiffness: 400, damping: 20 }
                }}
                className={`
                  flex min-h-touch w-full items-center justify-between rounded-lg
                  border-2 p-3
                  transition-all duration-300 hover:scale-[1.02]
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
                    className={`size-6 rounded-full ${level.color} transition-all duration-300`}
                  />
                  <span className="text-sm font-medium text-foreground">
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
                      className={`h-4 w-1.5 rounded-full transition-all duration-300 ${
                        index < level.value ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                {selectedEnergy?.value === level.value && (
                  <CheckCircle className="ml-2 size-5 text-foreground" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Progress indicator */}
      <div className="mb-6 flex justify-center space-x-2">
        <div className={`size-2 rounded-full transition-all duration-300 ${
          selectedMood ? 'bg-primary' : 'bg-muted'
        }`} />
        <div className={`size-2 rounded-full transition-all duration-300 ${
          showEnergyStep ? 'bg-primary' : 'bg-muted'
        }`} />
      </div>

      {/* Don't show again and Skip options */}
      <div className="space-y-3">
        {/* Don't show again checkbox */}
        <label className="flex cursor-pointer items-center justify-center gap-2">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="size-4 rounded border-primary text-muted-foreground focus:ring-ring"
          />
          <span className="text-sm text-muted-foreground">
            Don't show mood tracking again
          </span>
        </label>

        {/* Skip button */}
        <div className="text-center">
          <button
            onClick={handleSkip}
            className="text-sm text-muted-foreground underline transition-colors duration-200 hover:text-foreground"
          >
            Skip this step
          </button>
        </div>
      </div>
    </div>
  );
}

export default MoodTracker;