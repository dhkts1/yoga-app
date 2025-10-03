/**
 * Onboarding Component
 *
 * First-time user experience introducing app features.
 * Shows once when user first opens the app, with option to skip.
 * Features abstract SVG illustrations matching app design system.
 */

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Navigation,
  Heart,
  Volume2,
  Palette,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "./design-system/Button";
import { Heading, Text } from "./design-system/Typography";
import usePreferencesStore from "../stores/preferences";
import { useTheme, DARK_MODE_THEMES, LIGHT_MODE_THEMES } from "./ThemeProvider";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const {
    hasSeenOnboarding,
    completeOnboarding,
    darkModeTheme,
    customDarkColor,
    lightModeTheme,
    customLightColor,
    setDarkModeTheme,
    setCustomDarkColor,
    setLightModeTheme,
    setCustomLightColor,
  } = usePreferencesStore();
  const { theme, setTheme } = useTheme();

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
        case "ArrowRight":
        case "Enter":
          handleNext();
          break;
        case "ArrowLeft":
          handlePrev();
          break;
        case "Escape":
          handleSkip();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, currentStep]);

  // Don't render if already seen onboarding
  if (hasSeenOnboarding) {
    return null;
  }

  const steps = [
    {
      title: "Welcome to Mindful Yoga",
      description:
        "Find peace through movement. Start your journey to a more mindful you with guided yoga and breathing exercises.",
      illustration: <WelcomeIllustration />,
      icon: Sparkles,
    },
    {
      title: "Choose Your Theme",
      description:
        "Personalize your experience. Select light or dark mode, then choose your preferred color palette to create the perfect ambiance.",
      illustration: <ThemeIllustration />,
      icon: Palette,
      interactive: true,
    },
    {
      title: "Quick Start Your Practice",
      description:
        "Tap the Quick Start button to instantly begin a session. We'll remember your preferences and pick up where you left off.",
      illustration: <QuickStartIllustration />,
      icon: Sparkles,
    },
    {
      title: "Easy Navigation",
      description:
        "Explore sessions, track insights, and manage your practice using the simple navigation at the bottom of your screen.",
      illustration: <NavigationIllustration />,
      icon: Navigation,
    },
    {
      title: "Track Your Mood",
      description:
        "Check in with yourself before and after each practice. Watch how yoga transforms your emotional state over time.",
      illustration: <MoodIllustration />,
      icon: Heart,
    },
    {
      title: "Voice Coaching",
      description:
        "Toggle voice guidance on or off anytime. Choose from gentle encouragement, motivational coaching, or peaceful silence.",
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
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? "opacity-100" : "pointer-events-none opacity-0"} `}
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) {
          handleSkip();
        }
      }}
    >
      {/* Onboarding Card */}
      <div
        className={`relative mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-muted shadow-2xl transition-all duration-300 ${isVisible ? "translate-y-0 scale-100" : "translate-y-4 scale-95"} `}
      >
        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Skip onboarding"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content Container */}
        <div className="p-8 pb-6">
          {/* Illustration */}
          <div
            className={`mb-4 flex justify-center ${currentStepData.interactive ? "mb-3" : "mb-6"}`}
          >
            <div
              className={`flex items-center justify-center ${currentStepData.interactive ? "h-32 w-32" : "h-48 w-48"}`}
            >
              {currentStepData.illustration}
            </div>
          </div>

          {/* Icon + Title */}
          <div className="mb-4 flex items-center justify-center">
            <StepIcon className="mr-2 h-6 w-6 text-accent" />
            <Heading level={2} className="text-center" id="onboarding-title">
              {currentStepData.title}
            </Heading>
          </div>

          {/* Description */}
          <Text variant="body" className="mb-6 text-center text-secondary">
            {currentStepData.description}
          </Text>

          {/* Interactive Theme Selector (only for theme step) */}
          {currentStepData.interactive && (
            <div className="mb-3 space-y-2">
              {/* Light/Dark Toggle */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex h-16 w-16 flex-col items-center justify-center rounded-lg transition-all ${
                    theme === "light"
                      ? "scale-105 bg-primary text-white shadow-sage"
                      : "bg-muted text-muted-foreground hover:scale-105 hover:bg-muted/80"
                  }`}
                  aria-label="Light mode"
                  aria-pressed={theme === "light"}
                >
                  <Sun className="mb-1 h-5 w-5" />
                  <span className="text-[10px] font-medium">Light</span>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex h-16 w-16 flex-col items-center justify-center rounded-lg transition-all ${
                    theme === "dark"
                      ? "scale-105 bg-primary text-white shadow-sage"
                      : "bg-muted text-muted-foreground hover:scale-105 hover:bg-muted/80"
                  }`}
                  aria-label="Dark mode"
                  aria-pressed={theme === "dark"}
                >
                  <Moon className="mb-1 h-5 w-5" />
                  <span className="text-[10px] font-medium">Dark</span>
                </button>
              </div>

              {/* Light Mode Color Selector */}
              {theme === "light" && (
                <div className="rounded-lg border border-border bg-muted p-2">
                  <Text
                    variant="caption"
                    className="mb-1.5 text-center text-[11px] text-muted-foreground"
                  >
                    Pick your color
                  </Text>
                  <div className="grid grid-cols-3 gap-1.5">
                    {Object.entries(LIGHT_MODE_THEMES).map(
                      ([key, themeData]) => {
                        if (key === "custom") return null;
                        return (
                          <button
                            key={key}
                            onClick={() => setLightModeTheme(key)}
                            className={`flex flex-col items-center gap-0.5 rounded-md border p-1.5 transition-all ${
                              lightModeTheme === key
                                ? "border-primary bg-primary/10 shadow-sm"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div
                              className="h-6 w-6 rounded-full border-2 border-border"
                              style={{ backgroundColor: themeData.preview }}
                            />
                            <span className="text-[9px] font-medium text-foreground">
                              {themeData.name.split(" ")[0]}
                            </span>
                          </button>
                        );
                      },
                    )}
                    {/* Custom Color */}
                    <button
                      onClick={() => setLightModeTheme("custom")}
                      className={`relative flex flex-col items-center gap-0.5 rounded-md border p-1.5 transition-all ${
                        lightModeTheme === "custom"
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="relative h-6 w-6">
                        <div
                          className="h-6 w-6 rounded-full border-2 border-border"
                          style={{ backgroundColor: customLightColor }}
                        />
                        <input
                          type="color"
                          value={customLightColor}
                          onChange={(e) => {
                            setCustomLightColor(e.target.value);
                            setLightModeTheme("custom");
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                      </div>
                      <span className="text-[9px] font-medium text-foreground">
                        Custom
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Dark Mode Color Selector */}
              {theme === "dark" && (
                <div className="rounded-lg border border-border bg-muted p-2">
                  <Text
                    variant="caption"
                    className="mb-1.5 text-center text-[11px] text-muted-foreground"
                  >
                    Pick your color
                  </Text>
                  <div className="grid grid-cols-3 gap-1.5">
                    {Object.entries(DARK_MODE_THEMES).map(
                      ([key, themeData]) => {
                        if (key === "custom") return null;
                        return (
                          <button
                            key={key}
                            onClick={() => setDarkModeTheme(key)}
                            className={`flex flex-col items-center gap-0.5 rounded-md border p-1.5 transition-all ${
                              darkModeTheme === key
                                ? "border-primary bg-primary/10 shadow-sm"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div
                              className="h-6 w-6 rounded-full border-2 border-border"
                              style={{ backgroundColor: themeData.preview }}
                            />
                            <span className="text-[9px] font-medium text-foreground">
                              {themeData.name.split(" ")[0]}
                            </span>
                          </button>
                        );
                      },
                    )}
                    {/* Custom Color */}
                    <button
                      onClick={() => setDarkModeTheme("custom")}
                      className={`relative flex flex-col items-center gap-0.5 rounded-md border p-1.5 transition-all ${
                        darkModeTheme === "custom"
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="relative h-6 w-6">
                        <div
                          className="h-6 w-6 rounded-full border-2 border-border"
                          style={{ backgroundColor: customDarkColor }}
                        />
                        <input
                          type="color"
                          value={customDarkColor}
                          onChange={(e) => {
                            setCustomDarkColor(e.target.value);
                            setDarkModeTheme("custom");
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                      </div>
                      <span className="text-[9px] font-medium text-foreground">
                        Custom
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Progress Dots */}
          <div className="mb-6 flex items-center justify-center gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                  index === currentStep
                    ? "h-2 w-8 bg-secondary"
                    : "h-2 w-2 bg-muted hover:bg-sage-400"
                } `}
                aria-label={`Go to step ${index + 1}`}
                aria-current={index === currentStep ? "step" : undefined}
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
              className={currentStep === 0 ? "w-full" : "flex-1"}
              icon={
                currentStep < steps.length - 1 ? (
                  <ChevronRight className="h-5 w-5" />
                ) : undefined
              }
              iconPosition="right"
            >
              {currentStep < steps.length - 1 ? "Next" : "Get Started"}
            </Button>
          </div>

          {/* Step Counter */}
          <Text variant="caption" className="mt-4 text-center text-secondary">
            Step {currentStep + 1} of {steps.length}
          </Text>
        </div>

        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-muted opacity-50" />
        <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-12 translate-y-12 rounded-full bg-accent/20 opacity-50" />
      </div>
    </div>
  );
};

// Abstract SVG Illustrations matching app design system

const WelcomeIllustration = () => (
  <svg viewBox="0 0 200 200" className="h-full w-full">
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
  <svg viewBox="0 0 200 200" className="h-full w-full">
    {/* Lightning bolt / energy shape */}
    <circle
      cx="100"
      cy="100"
      r="70"
      fill="#E8E4DC"
      stroke="#8FA68E"
      strokeWidth="3"
    />

    {/* Play button / start symbol */}
    <polygon points="80,60 80,140 150,100" fill="#8FA68E" opacity="0.8" />

    {/* Energy rings */}
    <circle
      cx="100"
      cy="100"
      r="85"
      fill="none"
      stroke="#D4AF37"
      strokeWidth="2"
      opacity="0.4"
    />
    <circle
      cx="100"
      cy="100"
      r="95"
      fill="none"
      stroke="#D4AF37"
      strokeWidth="2"
      opacity="0.2"
    />

    {/* Sparkle dots */}
    <circle cx="50" cy="70" r="3" fill="#D4AF37" />
    <circle cx="150" cy="70" r="3" fill="#D4AF37" />
    <circle cx="50" cy="130" r="3" fill="#D4AF37" />
    <circle cx="150" cy="130" r="3" fill="#D4AF37" />
  </svg>
);

const NavigationIllustration = () => (
  <svg viewBox="0 0 200 200" className="h-full w-full">
    {/* Bottom navigation bar representation */}
    <rect
      x="30"
      y="140"
      width="140"
      height="40"
      rx="8"
      fill="#8FA68E"
      opacity="0.3"
    />

    {/* Navigation icons */}
    <circle cx="60" cy="160" r="8" fill="#8FA68E" />
    <circle cx="100" cy="160" r="8" fill="#D4AF37" />
    <circle cx="140" cy="160" r="8" fill="#8FA68E" />

    {/* Screen representation */}
    <rect
      x="40"
      y="40"
      width="120"
      height="80"
      rx="8"
      fill="#F5F3F0"
      stroke="#8FA68E"
      strokeWidth="2"
    />

    {/* Content lines */}
    <line
      x1="55"
      y1="60"
      x2="110"
      y2="60"
      stroke="#8FA68E"
      strokeWidth="3"
      opacity="0.5"
    />
    <line
      x1="55"
      y1="75"
      x2="145"
      y2="75"
      stroke="#8FA68E"
      strokeWidth="2"
      opacity="0.3"
    />
    <line
      x1="55"
      y1="85"
      x2="130"
      y2="85"
      stroke="#8FA68E"
      strokeWidth="2"
      opacity="0.3"
    />
    <line
      x1="55"
      y1="95"
      x2="145"
      y2="95"
      stroke="#8FA68E"
      strokeWidth="2"
      opacity="0.3"
    />

    {/* Connecting line from screen to nav */}
    <line
      x1="100"
      y1="120"
      x2="100"
      y2="140"
      stroke="#D4AF37"
      strokeWidth="2"
      strokeDasharray="4,4"
      opacity="0.6"
    />
  </svg>
);

const MoodIllustration = () => (
  <svg viewBox="0 0 200 200" className="h-full w-full">
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
    <path
      d="M20,100 L40,100 L45,85 L50,115 L55,100 L180,100"
      stroke="#8FA68E"
      strokeWidth="2"
      fill="none"
      opacity="0.3"
    />
  </svg>
);

const VoiceIllustration = () => (
  <svg viewBox="0 0 200 200" className="h-full w-full">
    {/* Microphone/speaker center */}
    <ellipse cx="100" cy="100" rx="30" ry="40" fill="#8FA68E" opacity="0.6" />
    <ellipse cx="100" cy="100" rx="20" ry="30" fill="#F5F3F0" />

    {/* Sound waves */}
    <path
      d="M60,100 Q50,80 40,100 Q50,120 60,100"
      stroke="#D4AF37"
      strokeWidth="3"
      fill="none"
      opacity="0.6"
    />
    <path
      d="M140,100 Q150,80 160,100 Q150,120 140,100"
      stroke="#D4AF37"
      strokeWidth="3"
      fill="none"
      opacity="0.6"
    />

    <path
      d="M45,100 Q35,70 25,100 Q35,130 45,100"
      stroke="#8FA68E"
      strokeWidth="2"
      fill="none"
      opacity="0.4"
    />
    <path
      d="M155,100 Q165,70 175,100 Q165,130 155,100"
      stroke="#8FA68E"
      strokeWidth="2"
      fill="none"
      opacity="0.4"
    />

    <path
      d="M30,100 Q20,60 10,100 Q20,140 30,100"
      stroke="#8FA68E"
      strokeWidth="2"
      fill="none"
      opacity="0.2"
    />
    <path
      d="M170,100 Q180,60 190,100 Q180,140 170,100"
      stroke="#8FA68E"
      strokeWidth="2"
      fill="none"
      opacity="0.2"
    />

    {/* Microphone stand */}
    <rect
      x="95"
      y="140"
      width="10"
      height="30"
      rx="2"
      fill="#8FA68E"
      opacity="0.5"
    />
    <ellipse cx="100" cy="170" rx="20" ry="5" fill="#8FA68E" opacity="0.3" />
  </svg>
);

const ThemeIllustration = () => (
  <svg viewBox="0 0 200 200" className="h-full w-full">
    {/* Split circle - half light, half dark */}
    <defs>
      <linearGradient id="themeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="50%" style={{ stopColor: "#F5F3F0", stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: "#282B2E", stopOpacity: 1 }} />
      </linearGradient>
    </defs>

    {/* Main circle with gradient */}
    <circle cx="100" cy="100" r="65" fill="url(#themeGradient)" />

    {/* Light side - Sun */}
    <circle cx="70" cy="100" r="20" fill="#D4AF37" opacity="0.8" />
    {/* Sun rays */}
    <line
      x1="70"
      y1="70"
      x2="70"
      y2="75"
      stroke="#D4AF37"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <line
      x1="70"
      y1="125"
      x2="70"
      y2="130"
      stroke="#D4AF37"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <line
      x1="40"
      y1="100"
      x2="45"
      y2="100"
      stroke="#D4AF37"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <line
      x1="95"
      y1="100"
      x2="90"
      y2="100"
      stroke="#D4AF37"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <line
      x1="50"
      y1="80"
      x2="55"
      y2="85"
      stroke="#D4AF37"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <line
      x1="85"
      y1="115"
      x2="80"
      y2="110"
      stroke="#D4AF37"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <line
      x1="50"
      y1="120"
      x2="55"
      y2="115"
      stroke="#D4AF37"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <line
      x1="85"
      y1="85"
      x2="80"
      y2="90"
      stroke="#D4AF37"
      strokeWidth="3"
      strokeLinecap="round"
    />

    {/* Dark side - Moon with stars */}
    <circle cx="130" cy="100" r="18" fill="#8FA68E" opacity="0.9" />
    <circle cx="138" cy="95" r="16" fill="#282B2E" opacity="0.9" />
    {/* Stars */}
    <circle cx="155" cy="85" r="2" fill="#8FA68E" />
    <circle cx="150" cy="115" r="2.5" fill="#8FA68E" />
    <circle cx="165" cy="100" r="1.5" fill="#8FA68E" />

    {/* Dividing line */}
    <line
      x1="100"
      y1="35"
      x2="100"
      y2="165"
      stroke="#8FA68E"
      strokeWidth="2"
      opacity="0.5"
    />

    {/* Outer decorative rings */}
    <circle
      cx="100"
      cy="100"
      r="75"
      fill="none"
      stroke="#8FA68E"
      strokeWidth="2"
      opacity="0.3"
    />
    <circle
      cx="100"
      cy="100"
      r="85"
      fill="none"
      stroke="#D4AF37"
      strokeWidth="2"
      opacity="0.2"
    />
  </svg>
);

export default Onboarding;
