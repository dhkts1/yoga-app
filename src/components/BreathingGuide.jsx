import { useState, useEffect, useRef } from 'react';
import { Text, CircularProgress } from './design-system';
import { getBreathingInstruction } from '../data/breathing';

/**
 * BreathingGuide Component
 *
 * Visual breathing guide with expanding/contracting circle animation
 * and text instructions that sync with the breathing pattern.
 *
 * Features:
 * - Smooth CSS transitions (300ms) matching app design
 * - Visual breathing circle that expands/contracts
 * - Text instructions for each phase
 * - Progress indicator
 * - Configurable breathing patterns
 */
function BreathingGuide({
  exercise,
  isActive = false,
  onCycleComplete,
  currentCycle = 0,
  totalCycles = 0,
  className = ''
}) {
  const [currentPhase, setCurrentPhase] = useState('inhale');
  const [timeInPhase, setTimeInPhase] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [circleScale, setCircleScale] = useState(0.5);
  const phaseStartScaleRef = useRef(0.5); // Track scale at phase start
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // Get current phase duration from exercise pattern
  const getCurrentPhaseDuration = () => {
    return exercise.pattern[currentPhase] * 1000; // convert to milliseconds
  };

  // Move to next phase in the breathing cycle
  const moveToNextPhase = () => {
    const phases = ['inhale', 'holdIn', 'exhale', 'holdOut'];
    const currentIndex = phases.indexOf(currentPhase);
    const nextPhase = phases[(currentIndex + 1) % phases.length];

    setCurrentPhase(nextPhase);
    setTimeInPhase(0);

    // If we completed a full cycle (returned to inhale), notify parent
    if (nextPhase === 'inhale' && currentPhase === 'holdOut') {
      onCycleComplete?.();
    }
  };

  // Start breathing cycle when active
  useEffect(() => {
    if (!isActive || !exercise) {
      return;
    }

    setIsAnimating(true);

    // Clear any existing timers
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Update time in current phase every 100ms for smooth progress
    intervalRef.current = setInterval(() => {
      setTimeInPhase(prev => {
        const newTime = prev + 100;
        const phaseDuration = getCurrentPhaseDuration();

        if (newTime >= phaseDuration) {
          // Phase complete, move to next
          timeoutRef.current = setTimeout(moveToNextPhase, 0);
          return 0;
        }

        return newTime;
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isActive, exercise, currentPhase]);

  // Stop animation when not active
  useEffect(() => {
    if (!isActive) {
      setIsAnimating(false);
      setCurrentPhase('inhale');
      setTimeInPhase(0);

      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [isActive]);

  // Save the scale when entering a new phase
  useEffect(() => {
    if (timeInPhase === 0) {
      phaseStartScaleRef.current = circleScale;
    }
  }, [currentPhase, timeInPhase, circleScale]);

  // Calculate circle scale based on current phase and time progress
  useEffect(() => {
    if (!isActive || !exercise) {
      setCircleScale(0.5);
      phaseStartScaleRef.current = 0.5;
      return;
    }

    const phaseDuration = getCurrentPhaseDuration();
    const progress = phaseDuration > 0 ? Math.min(timeInPhase / phaseDuration, 1) : 0;
    const startScale = phaseStartScaleRef.current;

    switch (currentPhase) {
      case 'inhale':
        // Expand from start scale to 1.0
        setCircleScale(startScale + ((1.0 - startScale) * progress));
        break;
      case 'holdIn':
        // Stay at current scale (already at 1.0 from inhale)
        break;
      case 'exhale':
        // Contract from start scale to 0.5
        setCircleScale(startScale - ((startScale - 0.5) * progress));
        break;
      case 'holdOut':
        // Stay at current scale (already at 0.5 from exhale)
        break;
    }
  }, [currentPhase, timeInPhase, isActive, exercise]);

  if (!exercise) {
    return null;
  }

  // Calculate circle scale based on phase and progress
  // This function is currently unused but kept for potential future animation enhancements
  // const getCircleScale = () => {
  //   const phaseProgress = timeInPhase / getCurrentPhaseDuration();
  //
  //   switch (currentPhase) {
  //     case 'inhale':
  //       // Expand from 0.5 to 1.0
  //       return 0.5 + (0.5 * phaseProgress);
  //     case 'holdIn':
  //       // Stay at full size
  //       return 1.0;
  //     case 'exhale':
  //       // Contract from 1.0 to 0.5
  //       return 1.0 - (0.5 * phaseProgress);
  //     case 'holdOut':
  //       // Stay at small size
  //       return 0.5;
  //     default:
  //       return 0.5;
  //   }
  // };

  // Get phase display text
  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'holdIn':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'holdOut':
        return 'Rest';
      default:
        return 'Breathe';
    }
  };

  // Get instruction text from exercise data
  const getInstructionText = () => {
    return getBreathingInstruction(exercise, currentPhase);
  };

  // Calculate overall progress
  const overallProgress = totalCycles > 0 ? (currentCycle / totalCycles) * 100 : 0;

  // Calculate circle scale and phase progress for breathing animation
  // const circleScale = getCircleScale(); // Currently unused, keeping function for potential future use
  const phaseDuration = getCurrentPhaseDuration();
  const phaseProgress = phaseDuration > 0 ? Math.min(timeInPhase / phaseDuration, 1) : 0;

  // For exhale, reverse the progress (100 to 0 instead of 0 to 100)
  const displayProgress = currentPhase === 'exhale' ? (1 - phaseProgress) * 100 : phaseProgress * 100;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Main breathing circle with controls */}
      <div className="relative flex items-center justify-center mb-8 w-56 h-56">
        {/* Phase progress ring - positioned absolutely */}
        <div className="absolute inset-0 flex items-center justify-center">
          <CircularProgress
            value={displayProgress}
            size={224}
            className="text-accent"
            strokeWidth={3}
            showValue={false}
          />
        </div>

        {/* Outer ring for reference - centered */}
        <div className="absolute w-48 h-48 rounded-full border-2 border-sage-200 opacity-30" />

        {/* Animated breathing circle - synced with timer */}
        <div
          className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 shadow-lg flex items-center justify-center transition-transform duration-75 ease-linear"
          style={{
            transform: `scale(${circleScale})`,
            opacity: isAnimating ? 0.8 : 0.6
          }}
        >
          {/* Inner circle for depth */}
          <div className="w-24 h-24 rounded-full bg-sage-300 opacity-50" />
        </div>
      </div>

      {/* Phase text and instructions */}
      <div className="text-center max-w-sm">
        <Text variant="h2" className="mb-2 font-medium text-primary">
          {getPhaseText()}
        </Text>

        <Text variant="body" className="text-secondary mb-4">
          {getInstructionText()}
        </Text>

        {/* Current phase duration display */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-sage-500" />
          <Text variant="caption" className="text-secondary">
            {exercise.pattern[currentPhase]}s
          </Text>
          <div className="w-2 h-2 rounded-full bg-sage-500" />
        </div>
      </div>

      {/* Exercise name and pattern display */}
      <div className="mt-6 text-center">
        <Text variant="caption" className="text-secondary mb-1">
          {exercise.nameEnglish}
        </Text>
        <Text variant="caption" className="text-sage-600">
          {exercise.pattern.inhale}-{exercise.pattern.holdIn}-{exercise.pattern.exhale}-{exercise.pattern.holdOut} pattern
        </Text>
      </div>
    </div>
  );
}

export default BreathingGuide;