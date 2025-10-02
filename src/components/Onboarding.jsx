/**
 * Onboarding Component
 *
 * First-time user experience introducing app features.
 * Shows once when user first opens the app, with option to skip.
 * Features abstract SVG illustrations matching app design system.
 */

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Sparkles, Navigation, Heart, Volume2 } from 'lucide-react';
import { Button } from './design-system/Button';
import { Heading, Text } from './design-system/Typography';
import usePreferencesStore from '../stores/preferences';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { hasSeenOnboarding, completeOnboarding } = usePreferencesStore();

  const handleComplete = () => {
    completeOnboarding();
    setIsVisible(false);
  };

  const handleSkip = () => {
    completeOnboarding();
    setIsVisible(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Don't show if already completed
  useEffect(() => {
    if (!hasSeenOnboarding) {
      // Small delay for smooth entrance
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [hasSeenOnboarding]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isVisible) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'Enter':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'Escape':
          handleSkip();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, currentStep]);

  // Don't render if already seen onboarding
  if (hasSeenOnboarding) {
    return null;
  }

  const steps = [
    {
      title: "Welcome to Mindful Yoga",
      description: "Find peace through movement. Start your journey to a more mindful you with guided yoga and breathing exercises.",
      illustration: <WelcomeIllustration />,
      icon: Sparkles,
    },
    {
      title: "Quick Start Your Practice",
      description: "Tap the Quick Start button to instantly begin a session. We'll remember your preferences and pick up where you left off.",
      illustration: <QuickStartIllustration />,
      icon: Sparkles,
    },
    {
      title: "Easy Navigation",
      description: "Explore sessions, track insights, and manage your practice using the simple navigation at the bottom of your screen.",
      illustration: <NavigationIllustration />,
      icon: Navigation,
    },
    {
      title: "Track Your Mood",
      description: "Check in with yourself before and after each practice. Watch how yoga transforms your emotional state over time.",
      illustration: <MoodIllustration />,
      icon: Heart,
    },
    {
      title: "Voice Coaching",
      description: "Toggle voice guidance on or off anytime. Choose from gentle encouragement, motivational coaching, or peaceful silence.",
      illustration: <VoiceIllustration />,
      icon: Volume2,
    },
  ];

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className={`
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/50 backdrop-blur-sm
        transition-opacity duration-300
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) {
          handleSkip();
        }
      }}
    >
      {/* Onboarding Card */}
      <div
        className={`
          relative
          w-full max-w-md mx-4
          bg-muted rounded-2xl
          shadow-2xl
          overflow-hidden
          transition-all duration-300
          ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        `}
      >
        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="
            absolute top-4 right-4 z-10
            p-2 rounded-full
            text-muted-foreground hover:text-foreground
            hover:bg-muted
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-sage-500
          "
          aria-label="Skip onboarding"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content Container */}
        <div className="p-8 pb-6">
          {/* Illustration */}
          <div className="flex justify-center mb-6">
            <div className="w-48 h-48 flex items-center justify-center">
              {currentStepData.illustration}
            </div>
          </div>

          {/* Icon + Title */}
          <div className="flex items-center justify-center mb-4">
            <StepIcon className="h-6 w-6 text-accent mr-2" />
            <Heading level={2} className="text-center" id="onboarding-title">
              {currentStepData.title}
            </Heading>
          </div>

          {/* Description */}
          <Text variant="body" className="text-center text-secondary mb-6">
            {currentStepData.description}
          </Text>

          {/* Progress Dots */}
          <div className="flex justify-center items-center gap-2 mb-6">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`
                  transition-all duration-300
                  rounded-full
                  focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2
                  ${index === currentStep
                    ? 'w-8 h-2 bg-secondary'
                    : 'w-2 h-2 bg-muted hover:bg-sage-400'
                  }
                `}
                aria-label={`Go to step ${index + 1}`}
                aria-current={index === currentStep ? 'step' : undefined}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {/* Previous Button */}
            {currentStep > 0 && (
              <Button
                onClick={handlePrev}
                variant="secondary"
                size="lg"
                className="flex-1"
                icon={<ChevronLeft className="h-5 w-5" />}
                iconPosition="left"
              >
                Back
              </Button>
            )}

            {/* Next/Get Started Button */}
            <Button
              onClick={handleNext}
              variant="primary"
              size="lg"
              className={currentStep === 0 ? 'w-full' : 'flex-1'}
              icon={currentStep < steps.length - 1 ? <ChevronRight className="h-5 w-5" /> : undefined}
              iconPosition="right"
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
            </Button>
          </div>

          {/* Step Counter */}
          <Text variant="caption" className="text-center mt-4 text-secondary">
            Step {currentStep + 1} of {steps.length}
          </Text>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-muted rounded-full -translate-y-16 translate-x-16 opacity-50" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/20 rounded-full translate-y-12 -translate-x-12 opacity-50" />
      </div>
    </div>
  );
};

// Abstract SVG Illustrations matching app design system

const WelcomeIllustration = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    {/* Calming lotus-like shapes */}
    <circle cx="100" cy="100" r="60" fill="#8FA68E" opacity="0.2" />
    <circle cx="100" cy="100" r="45" fill="#8FA68E" opacity="0.3" />
    <circle cx="100" cy="100" r="30" fill="#8FA68E" opacity="0.5" />

    {/* Petal shapes */}
    <ellipse cx="100" cy="60" rx="15" ry="40" fill="#D4AF37" opacity="0.6" />
    <ellipse cx="100" cy="140" rx="15" ry="40" fill="#D4AF37" opacity="0.6" />
    <ellipse cx="60" cy="100" rx="40" ry="15" fill="#D4AF37" opacity="0.6" />
    <ellipse cx="140" cy="100" rx="40" ry="15" fill="#D4AF37" opacity="0.6" />

    {/* Center dot */}
    <circle cx="100" cy="100" r="8" fill="#2C2C2C" />
  </svg>
);

const QuickStartIllustration = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    {/* Lightning bolt / energy shape */}
    <circle cx="100" cy="100" r="70" fill="#F5F3F0" stroke="#8FA68E" strokeWidth="3" />

    {/* Play button / start symbol */}
    <polygon
      points="80,60 80,140 150,100"
      fill="#8FA68E"
      opacity="0.8"
    />

    {/* Energy rings */}
    <circle cx="100" cy="100" r="85" fill="none" stroke="#D4AF37" strokeWidth="2" opacity="0.4" />
    <circle cx="100" cy="100" r="95" fill="none" stroke="#D4AF37" strokeWidth="2" opacity="0.2" />

    {/* Sparkle dots */}
    <circle cx="50" cy="70" r="3" fill="#D4AF37" />
    <circle cx="150" cy="70" r="3" fill="#D4AF37" />
    <circle cx="50" cy="130" r="3" fill="#D4AF37" />
    <circle cx="150" cy="130" r="3" fill="#D4AF37" />
  </svg>
);

const NavigationIllustration = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    {/* Bottom navigation bar representation */}
    <rect x="30" y="140" width="140" height="40" rx="8" fill="#8FA68E" opacity="0.3" />

    {/* Navigation icons */}
    <circle cx="60" cy="160" r="8" fill="#8FA68E" />
    <circle cx="100" cy="160" r="8" fill="#D4AF37" />
    <circle cx="140" cy="160" r="8" fill="#8FA68E" />

    {/* Screen representation */}
    <rect x="40" y="40" width="120" height="80" rx="8" fill="#F5F3F0" stroke="#8FA68E" strokeWidth="2" />

    {/* Content lines */}
    <line x1="55" y1="60" x2="110" y2="60" stroke="#8FA68E" strokeWidth="3" opacity="0.5" />
    <line x1="55" y1="75" x2="145" y2="75" stroke="#8FA68E" strokeWidth="2" opacity="0.3" />
    <line x1="55" y1="85" x2="130" y2="85" stroke="#8FA68E" strokeWidth="2" opacity="0.3" />
    <line x1="55" y1="95" x2="145" y2="95" stroke="#8FA68E" strokeWidth="2" opacity="0.3" />

    {/* Connecting line from screen to nav */}
    <line x1="100" y1="120" x2="100" y2="140" stroke="#D4AF37" strokeWidth="2" strokeDasharray="4,4" opacity="0.6" />
  </svg>
);

const MoodIllustration = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    {/* Heart shape */}
    <path
      d="M100,170 C100,170 40,130 40,90 C40,70 50,60 65,60 C80,60 90,70 100,85 C110,70 120,60 135,60 C150,60 160,70 160,90 C160,130 100,170 100,170 Z"
      fill="#8FA68E"
      opacity="0.6"
    />

    {/* Inner heart */}
    <path
      d="M100,150 C100,150 60,120 60,90 C60,75 67,68 77,68 C87,68 93,75 100,88 C107,75 113,68 123,68 C133,68 140,75 140,90 C140,120 100,150 100,150 Z"
      fill="#D4AF37"
      opacity="0.5"
    />

    {/* Mood indicator dots */}
    <circle cx="70" cy="50" r="6" fill="#8FA68E" opacity="0.4" />
    <circle cx="100" cy="40" r="8" fill="#D4AF37" opacity="0.6" />
    <circle cx="130" cy="50" r="6" fill="#8FA68E" opacity="0.4" />

    {/* Pulse lines */}
    <path d="M20,100 L40,100 L45,85 L50,115 L55,100 L180,100" stroke="#8FA68E" strokeWidth="2" fill="none" opacity="0.3" />
  </svg>
);

const VoiceIllustration = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    {/* Microphone/speaker center */}
    <ellipse cx="100" cy="100" rx="30" ry="40" fill="#8FA68E" opacity="0.6" />
    <ellipse cx="100" cy="100" rx="20" ry="30" fill="#F5F3F0" />

    {/* Sound waves */}
    <path d="M60,100 Q50,80 40,100 Q50,120 60,100" stroke="#D4AF37" strokeWidth="3" fill="none" opacity="0.6" />
    <path d="M140,100 Q150,80 160,100 Q150,120 140,100" stroke="#D4AF37" strokeWidth="3" fill="none" opacity="0.6" />

    <path d="M45,100 Q35,70 25,100 Q35,130 45,100" stroke="#8FA68E" strokeWidth="2" fill="none" opacity="0.4" />
    <path d="M155,100 Q165,70 175,100 Q165,130 155,100" stroke="#8FA68E" strokeWidth="2" fill="none" opacity="0.4" />

    <path d="M30,100 Q20,60 10,100 Q20,140 30,100" stroke="#8FA68E" strokeWidth="2" fill="none" opacity="0.2" />
    <path d="M170,100 Q180,60 190,100 Q180,140 170,100" stroke="#8FA68E" strokeWidth="2" fill="none" opacity="0.2" />

    {/* Microphone stand */}
    <rect x="95" y="140" width="10" height="30" rx="2" fill="#8FA68E" opacity="0.5" />
    <ellipse cx="100" cy="170" rx="20" ry="5" fill="#8FA68E" opacity="0.3" />
  </svg>
);

export default Onboarding;
