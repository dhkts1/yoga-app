import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
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
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const breathControls = useAnimation();

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

  // Animate breathing circle based on phase with framer-motion
  useEffect(() => {
    if (!isActive || !exercise) return;

    const phaseDuration = exercise.pattern[currentPhase];

    // Calculate target scale and easing based on phase
    let targetScale = 0.5;
    let easingType = 'easeInOut';

    switch (currentPhase) {
      case 'inhale':
        targetScale = 1.0;
        easingType = 'easeIn';
        break;
      case 'holdIn':
        targetScale = 1.0;
        easingType = 'linear';
        break;
      case 'exhale':
        targetScale = 0.5;
        easingType = 'easeOut';
        break;
      case 'holdOut':
        targetScale = 0.5;
        easingType = 'linear';
        break;
    }

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    breathControls.start({
      scale: targetScale,
      transition: {
        duration: prefersReducedMotion ? 0 : phaseDuration,
        ease: easingType
      }
    });
  }, [currentPhase, isActive, exercise, breathControls]);

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

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Progress indicator */}
      {totalCycles > 0 && (
        <div className="mb-6 w-full max-w-xs">
          <div className="flex justify-between items-center mb-2">
            <Text variant="caption" className="text-secondary">
              Cycle {currentCycle} of {totalCycles}
            </Text>
            <Text variant="caption" className="text-secondary">
              {Math.round(overallProgress)}%
            </Text>
          </div>
          <div className="w-full bg-cream-200 rounded-full h-2">
            <div
              className="bg-sage-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Main breathing circle */}
      <div className="relative flex items-center justify-center mb-8 w-56 h-56">
        {/* Phase progress ring - positioned absolutely */}
        <div className="absolute inset-0 flex items-center justify-center">
          <CircularProgress
            value={phaseProgress * 100}
            size={224}
            className="text-accent"
            strokeWidth={3}
            showValue={false}
          />
        </div>

        {/* Outer ring for reference - centered */}
        <div className="absolute w-48 h-48 rounded-full border-2 border-sage-200 opacity-30" />

        {/* Animated breathing circle - centered with framer-motion */}
        <motion.div
          animate={breathControls}
          initial={{ scale: 0.5 }}
          className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 shadow-lg flex items-center justify-center"
          style={{
            opacity: isAnimating ? 0.8 : 0.6
          }}
        >
          {/* Inner circle for depth */}
          <div className="w-24 h-24 rounded-full bg-sage-300 opacity-50" />
        </motion.div>
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