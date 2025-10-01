// Enhanced breathing exercises (Pranayama) with detailed patterns and instructions
export const breathingExercises = [
  {
    id: 'box-breathing',
    emoji: '📦',
    nameEnglish: 'Box Breathing',
    nameSanskrit: 'Sama Vritti Pranayama',
    category: 'calming',
    difficulty: 'beginner',
    pattern: {
      inhale: 4,      // seconds
      holdIn: 4,      // seconds
      exhale: 4,      // seconds
      holdOut: 4      // seconds
    },
    cycleLength: 16, // total seconds per cycle
    defaultDuration: 3, // minutes
    description: 'A foundational breathing technique that creates calm and focus through equal-length breathing phases. Perfect for stress relief and concentration.',
    instructions: [
      'Sit comfortably with spine straight',
      'Close your eyes or soften your gaze',
      'Inhale slowly through nose for 4 counts',
      'Hold your breath gently for 4 counts',
      'Exhale slowly through nose for 4 counts',
      'Hold empty for 4 counts',
      'Repeat the cycle smoothly and steadily'
    ],
    benefits: [
      'Reduces stress and anxiety',
      'Improves focus and concentration',
      'Balances nervous system',
      'Lowers blood pressure',
      'Promotes mental clarity',
      'Helps with insomnia'
    ],
    tips: [
      'Don\'t strain - reduce counts if needed',
      'Keep breath smooth and natural',
      'Focus on the rhythm, not the depth',
      'Practice regularly for best results'
    ],
    bestFor: [
      'Before important meetings',
      'When feeling overwhelmed',
      'Difficulty falling asleep',
      'Improving concentration'
    ],
    voiceInstructions: {
      inhale: 'Breathe in slowly and deeply',
      holdIn: 'Hold your breath gently',
      exhale: 'Breathe out completely',
      holdOut: 'Rest in the stillness'
    }
  },
  {
    id: 'four-seven-eight',
    emoji: '💤',
    nameEnglish: '4-7-8 Breathing',
    nameSanskrit: 'Pranayama for Sleep',
    category: 'relaxing',
    difficulty: 'beginner',
    pattern: {
      inhale: 4,      // seconds
      holdIn: 7,      // seconds
      exhale: 8,      // seconds
      holdOut: 0      // seconds
    },
    cycleLength: 19, // total seconds per cycle
    defaultDuration: 2, // minutes (shorter for potency)
    description: 'A powerful relaxation technique that activates the body\'s natural relaxation response. Excellent for falling asleep and reducing anxiety.',
    instructions: [
      'Place tongue tip against roof of mouth behind teeth',
      'Exhale completely through mouth with whoosh sound',
      'Close mouth, inhale through nose for 4 counts',
      'Hold breath for 7 counts',
      'Exhale through mouth for 8 counts with whoosh',
      'This completes one cycle',
      'Repeat for 3-4 cycles maximum when starting'
    ],
    benefits: [
      'Promotes deep relaxation',
      'Helps fall asleep faster',
      'Reduces anxiety quickly',
      'Activates parasympathetic nervous system',
      'Lowers heart rate',
      'Calms racing thoughts'
    ],
    tips: [
      'Start with shorter holds if needed',
      'Don\'t do more than 4 cycles initially',
      'The exhale whoosh sound is important',
      'Practice twice daily for best results'
    ],
    bestFor: [
      'Bedtime routine',
      'Acute anxiety',
      'After stressful events',
      'When mind is racing'
    ],
    voiceInstructions: {
      inhale: 'Inhale quietly through your nose',
      holdIn: 'Hold your breath completely',
      exhale: 'Exhale through mouth with a whoosh',
      holdOut: 'Rest and prepare for next cycle'
    }
  },
  {
    id: 'energizing-breath',
    emoji: '⚡',
    nameEnglish: 'Energizing Breath',
    nameSanskrit: 'Bhastrika Pranayama',
    category: 'energizing',
    difficulty: 'intermediate',
    pattern: {
      inhale: 2,      // seconds (faster)
      holdIn: 0,      // seconds
      exhale: 2,      // seconds (faster)
      holdOut: 0      // seconds
    },
    cycleLength: 4, // total seconds per cycle
    defaultDuration: 2, // minutes (shorter for intensity)
    description: 'A dynamic breathing practice that increases energy and alertness. Like bellows breathing, it generates heat and vitality in the body.',
    instructions: [
      'Sit tall with spine erect',
      'Begin with a few natural breaths',
      'Take 3 deep, slow breaths to prepare',
      'Begin rapid, forceful breathing through nose',
      'Equal emphasis on inhale and exhale',
      'Keep breath rhythmic and powerful',
      'After 10-15 breaths, take one deep inhale and hold briefly',
      'Exhale slowly and return to natural breathing'
    ],
    benefits: [
      'Increases energy and alertness',
      'Improves circulation',
      'Generates internal heat',
      'Boosts metabolism',
      'Enhances mental clarity',
      'Strengthens respiratory muscles'
    ],
    tips: [
      'Start slowly and build intensity',
      'Stop if you feel dizzy',
      'Keep breath even and rhythmic',
      'Don\'t practice if pregnant or with heart conditions'
    ],
    bestFor: [
      'Morning energy boost',
      'Before workouts',
      'Combating afternoon fatigue',
      'Cold weather warming'
    ],
    voiceInstructions: {
      inhale: 'Inhale powerfully',
      holdIn: 'Continue the rhythm',
      exhale: 'Exhale forcefully',
      holdOut: 'Keep the flow going'
    }
  },
  {
    id: 'alternate-nostril',
    emoji: '🌊',
    nameEnglish: 'Alternate Nostril Breathing',
    nameSanskrit: 'Nadi Shodhana Pranayama',
    category: 'balancing',
    difficulty: 'intermediate',
    pattern: {
      inhale: 4,      // seconds
      holdIn: 2,      // seconds
      exhale: 4,      // seconds
      holdOut: 1      // seconds
    },
    cycleLength: 11, // total seconds per cycle (but alternates nostrils)
    defaultDuration: 5, // minutes
    description: 'A balancing breath that harmonizes the left and right hemispheres of the brain. Promotes mental balance and inner calm.',
    instructions: [
      'Sit comfortably with spine straight',
      'Use right hand: thumb for right nostril, ring finger for left',
      'Close right nostril with thumb, inhale through left',
      'Close both nostrils, hold briefly',
      'Release thumb, exhale through right nostril',
      'Inhale through right nostril',
      'Close both nostrils, hold briefly',
      'Release ring finger, exhale through left',
      'This completes one full cycle'
    ],
    benefits: [
      'Balances nervous system',
      'Harmonizes brain hemispheres',
      'Improves concentration',
      'Reduces stress and anxiety',
      'Enhances mental clarity',
      'Promotes emotional balance'
    ],
    tips: [
      'Use gentle pressure, don\'t press hard',
      'If pregnant, practice without hand positions',
      'Keep breath smooth and even',
      'Start with shorter sessions'
    ],
    bestFor: [
      'Before meditation',
      'When feeling mentally scattered',
      'Midday reset',
      'Preparing for important decisions'
    ],
    voiceInstructions: {
      inhale: 'Inhale through the open nostril',
      holdIn: 'Hold gently',
      exhale: 'Exhale through the other nostril',
      holdOut: 'Pause briefly before switching'
    }
  }
];

// Duration options available for breathing sessions
export const breathingDurations = [
  { value: 2, label: '2 minutes', description: 'Quick reset' },
  { value: 3, label: '3 minutes', description: 'Short practice' },
  { value: 5, label: '5 minutes', description: 'Standard session' }
];

// Helper function to get breathing exercise by ID
export const getBreathingExerciseById = (id) => {
  return breathingExercises.find(exercise => exercise.id === id);
};

// Helper function to filter exercises by category
export const getBreathingExercisesByCategory = (category) => {
  return breathingExercises.filter(exercise => exercise.category === category);
};

// Helper function to get exercises by difficulty
export const getBreathingExercisesByDifficulty = (difficulty) => {
  return breathingExercises.filter(exercise => exercise.difficulty === difficulty);
};

// Get random breathing exercise
export const getRandomBreathingExercise = () => {
  return breathingExercises[Math.floor(Math.random() * breathingExercises.length)];
};

// Get exercise categories
export const getBreathingCategories = () => {
  return [...new Set(breathingExercises.map(exercise => exercise.category))];
};

// Calculate total cycles for a given duration
export const calculateBreathingCycles = (exercise, durationMinutes) => {
  const totalSeconds = durationMinutes * 60;
  return Math.floor(totalSeconds / exercise.cycleLength);
};

// Helper to get next phase in breathing cycle
export const getNextBreathingPhase = (currentPhase) => {
  const phases = ['inhale', 'holdIn', 'exhale', 'holdOut'];
  const currentIndex = phases.indexOf(currentPhase);
  return phases[(currentIndex + 1) % phases.length];
};

// Helper to get breathing instruction text
export const getBreathingInstruction = (exercise, phase) => {
  return exercise.voiceInstructions[phase] || `${phase} for ${exercise.pattern[phase]} seconds`;
};

// Validate breathing pattern (ensure all durations are positive)
export const validateBreathingPattern = (pattern) => {
  return pattern.inhale > 0 && pattern.exhale > 0 &&
         pattern.holdIn >= 0 && pattern.holdOut >= 0;
};