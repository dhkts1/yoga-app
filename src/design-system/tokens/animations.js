/**
 * Design Tokens: Animations
 *
 * Breath-like, calming animations that enhance the mindful experience.
 * 300ms standard duration with organic easing functions.
 */

export const animations = {
  // Duration tokens
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',    // Standard duration from PRD
    slow: '500ms',
    slower: '750ms',
    breath: '4000ms'    // Full breath cycle
  },

  // Easing functions - organic, breath-like
  easing: {
    // Standard easings
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',

    // Custom organic easings for yoga app
    breathe: 'cubic-bezier(0.4, 0.0, 0.2, 1)',      // Smooth breathing
    gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Gentle movement
    calm: 'cubic-bezier(0.23, 1, 0.32, 1)',         // Very smooth
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Slight bounce
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'          // Material design
  },

  // Keyframe animations
  keyframes: {
    // Breathing animation for meditation elements
    breathe: {
      '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
      '50%': { transform: 'scale(1.05)', opacity: '1' }
    },

    // Gentle fade in
    fadeIn: {
      '0%': { opacity: '0', transform: 'translateY(10px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' }
    },

    // Slide up from bottom (for overlays)
    slideUp: {
      '0%': { transform: 'translateY(100%)' },
      '100%': { transform: 'translateY(0)' }
    },

    // Slide down to bottom
    slideDown: {
      '0%': { transform: 'translateY(0)' },
      '100%': { transform: 'translateY(100%)' }
    },

    // Scale in (for modals)
    scaleIn: {
      '0%': { transform: 'scale(0.9)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' }
    },

    // Gentle pulse for interactive elements
    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.7' }
    },

    // Progress ring animation
    progressRing: {
      '0%': { 'stroke-dasharray': '0 251.2' },
      '100%': { 'stroke-dasharray': '251.2 0' }
    },

    // Floating animation for zen elements
    float: {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-10px)' }
    },

    // Gentle glow for focus states
    glow: {
      '0%, 100%': { 'box-shadow': '0 0 0 0 rgba(143, 166, 142, 0.4)' },
      '50%': { 'box-shadow': '0 0 0 8px rgba(143, 166, 142, 0.1)' }
    }
  },

  // Pre-defined animation combinations
  presets: {
    // Standard UI transitions
    fadeIn: {
      duration: '300ms',
      easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      keyframes: 'fadeIn'
    },

    slideUp: {
      duration: '300ms',
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      keyframes: 'slideUp'
    },

    slideDown: {
      duration: '300ms',
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      keyframes: 'slideDown'
    },

    scaleIn: {
      duration: '300ms',
      easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
      keyframes: 'scaleIn'
    },

    // Mindful animations
    breathe: {
      duration: '4000ms',
      easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      keyframes: 'breathe',
      iterationCount: 'infinite'
    },

    pulse: {
      duration: '2000ms',
      easing: 'ease-in-out',
      keyframes: 'pulse',
      iterationCount: 'infinite'
    },

    float: {
      duration: '3000ms',
      easing: 'ease-in-out',
      keyframes: 'float',
      iterationCount: 'infinite'
    },

    glow: {
      duration: '2000ms',
      easing: 'ease-in-out',
      keyframes: 'glow',
      iterationCount: 'infinite'
    },

    // Interactive states
    buttonHover: {
      property: 'all',
      duration: '150ms',
      easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
    },

    cardHover: {
      property: 'transform, box-shadow',
      duration: '300ms',
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    },

    focus: {
      property: 'box-shadow, border-color',
      duration: '150ms',
      easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
    }
  },

  // Page transition animations
  pageTransitions: {
    // Gentle page slides
    slideLeft: {
      enter: 'translateX(100%)',
      enterActive: 'translateX(0)',
      exit: 'translateX(0)',
      exitActive: 'translateX(-100%)',
      duration: '300ms'
    },

    slideRight: {
      enter: 'translateX(-100%)',
      enterActive: 'translateX(0)',
      exit: 'translateX(0)',
      exitActive: 'translateX(100%)',
      duration: '300ms'
    },

    fade: {
      enter: 'opacity: 0',
      enterActive: 'opacity: 1',
      exit: 'opacity: 1',
      exitActive: 'opacity: 0',
      duration: '300ms'
    }
  }
};

// Helper function to create CSS animation string
export const createAnimation = (preset) => {
  const anim = animations.presets[preset];
  if (!anim) return '';

  const parts = [
    anim.keyframes,
    anim.duration,
    anim.easing,
    anim.iterationCount || '1',
    anim.direction || 'normal',
    anim.fillMode || 'both'
  ];

  return parts.filter(Boolean).join(' ');
};

// Helper function for transition CSS
export const createTransition = (properties, duration = 'normal', easing = 'gentle') => {
  const dur = animations.duration[duration] || duration;
  const ease = animations.easing[easing] || easing;

  if (Array.isArray(properties)) {
    return properties.map(prop => `${prop} ${dur} ${ease}`).join(', ');
  }

  return `${properties} ${dur} ${ease}`;
};