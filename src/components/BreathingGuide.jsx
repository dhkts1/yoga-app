import { useState, useEffect, useRef, useMemo } from 'react';
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
  className = ''
  // Note: currentCycle and totalCycles props are passed by parent but not used in this component
}) {
  const [currentPhase, setCurrentPhase] = useState('inhale');
  const [timeInPhase, setTimeInPhase] = useState(0);
  const [phaseStartScale, setPhaseStartScale] = useState(0.5); // Track scale at phase start
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // Derive isAnimating from isActive - no setState in effect needed
  const isAnimating = isActive;

  // Get current phase duration from exercise pattern
  const getCurrentPhaseDuration = () => {
    if (!exercise) return 0;
    return exercise.pattern[currentPhase] * 1000; // convert to milliseconds
  };

  // Move to next phase in the breathing cycle
  const moveToNextPhase = (currentScale) => {
    const phases = ['inhale', 'holdIn', 'exhale', 'holdOut'];
    const currentIndex = phases.indexOf(currentPhase);
    const nextPhase = phases[(currentIndex + 1) % phases.length];

    setCurrentPhase(nextPhase);
    setTimeInPhase(0);

    // Save current scale as the start scale for next phase
    setPhaseStartScale(currentScale);

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

    // Clear any existing timers
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Update time in current phase every 100ms for smooth progress
    intervalRef.current = setInterval(() => {
      setTimeInPhase(prev => {
        const newTime = prev + 100;
        const phaseDuration = getCurrentPhaseDuration();

        if (newTime >= phaseDuration) {
          // Calculate current scale before transitioning
          const progress = 1; // Phase complete
          let currentScale = phaseStartScale;

          if (currentPhase === 'inhale') {
            currentScale = phaseStartScale + ((1.0 - phaseStartScale) * progress);
          } else if (currentPhase === 'exhale') {
            currentScale = phaseStartScale - ((phaseStartScale - 0.5) * progress);
          }

          // Phase complete, move to next with current scale
          timeoutRef.current = setTimeout(() => moveToNextPhase(currentScale), 0);
          return 0;
        }

        return newTime;
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Reset state when effect cleanup runs (e.g., when isActive becomes false)
      if (!isActive) {
        setCurrentPhase('inhale');
        setTimeInPhase(0);
        setPhaseStartScale(0.5);
      }
    };
  }, [isActive, exercise, currentPhase]);

  // Calculate circle scale using useMemo - derived from phase and time
  const circleScale = useMemo(() => {
    if (!isActive || !exercise) {
      return 0.5;
    }

    const phaseDuration = getCurrentPhaseDuration();
    const progress = phaseDuration > 0 ? Math.min(timeInPhase / phaseDuration, 1) : 0;

    switch (currentPhase) {
      case 'inhale':
        return phaseStartScale + ((1.0 - phaseStartScale) * progress);
      case 'holdIn':
        return phaseStartScale; // Stay at current scale
      case 'exhale':
        return phaseStartScale - ((phaseStartScale - 0.5) * progress);
      case 'holdOut':
        return phaseStartScale; // Stay at current scale
      default:
        return 0.5;
    }
  }, [isActive, exercise, currentPhase, timeInPhase, phaseStartScale]);

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

  // Calculate circle scale and phase progress for breathing animation
  // const circleScale = getCircleScale(); // Currently unused, keeping function for potential future use
  const phaseDuration = getCurrentPhaseDuration();
  const phaseProgress = phaseDuration > 0 ? Math.min(timeInPhase / phaseDuration, 1) : 0;

  // For exhale, reverse the progress (100 to 0 instead of 0 to 100)
  const displayProgress = currentPhase === 'exhale' ? (1 - phaseProgress) * 100 : phaseProgress * 100;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Main breathing circle with controls */}
      <div className="relative mb-8 flex size-56 items-center justify-center">
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
        <div className="absolute size-48 rounded-full border-2 border-border opacity-30" />

        {/* Animated breathing circle - synced with timer */}
        <div
          className="absolute flex size-48 items-center justify-center rounded-full bg-gradient-to-br from-sage-400 to-sage-600 shadow-lg transition-transform duration-75 ease-linear"
          style={{
            transform: `scale(${circleScale})`,
            opacity: isAnimating ? 0.8 : 0.6
          }}
        >
          {/* Inner circle for depth */}
          <div className="size-24 rounded-full bg-muted opacity-50" />
        </div>
      </div>

      {/* Phase text and instructions */}
      <div className="max-w-sm text-center">
        <Text variant="h2" className="mb-2 font-medium text-foreground">
          {getPhaseText()}
        </Text>

        <Text variant="body" className="mb-4 text-muted-foreground">
          {getInstructionText()}
        </Text>

        {/* Current phase duration display */}
        <div className="flex items-center justify-center space-x-2">
          <div className="bg-muted0 size-2 rounded-full" />
          <Text variant="caption" className="text-muted-foreground">
            {exercise.pattern[currentPhase]}s
          </Text>
          <div className="bg-muted0 size-2 rounded-full" />
        </div>
      </div>

      {/* Exercise name and pattern display */}
      <div className="mt-6 text-center">
        <Text variant="caption" className="mb-1 text-muted-foreground">
          {exercise.nameEnglish}
        </Text>
        <Text variant="caption" className="text-muted-foreground">
          {exercise.pattern.inhale}-{exercise.pattern.holdIn}-{exercise.pattern.exhale}-{exercise.pattern.holdOut} pattern
        </Text>
      </div>
    </div>
  );
}

export default BreathingGuide;