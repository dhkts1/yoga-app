/**
 * @typedef {Object} Week
 * @property {number} weekNumber - The week number in the program (1-indexed)
 * @property {string} name - Display name for the week
 * @property {string} focus - Main focus areas for this week
 * @property {string} description - Detailed description of the week's practice
 * @property {string[]} recommendedSessions - Array of session IDs from sessions.js
 * @property {string} practiceFrequency - Recommended practice frequency (e.g., "3-4 times this week")
 * @property {string} [notes] - Optional guidance or tips for the practitioner
 * @property {boolean} isMilestone - Whether this week marks a significant milestone
 */

/**
 * @typedef {Object} Program
 * @property {string} id - Unique program identifier
 * @property {string} name - Display name of the program
 * @property {string} description - Long description of the program
 * @property {string} style - Yoga style (e.g., 'iyengar', 'vinyasa', 'hatha', 'restorative')
 * @property {string} difficulty - Overall difficulty level ('beginner', 'intermediate', 'advanced', 'mixed')
 * @property {number} totalWeeks - Total number of weeks in the program
 * @property {string} [author] - Optional author or source of the program
 * @property {Week[]} weeks - Array of week objects
 */

/**
 * Multi-week yoga programs
 * @type {Program[]}
 */
export const programs = [
  {
    id: 'iyengar-foundation-13',
    name: 'Iyengar Foundation: First Course',
    description: 'A 13-week progressive introduction to Iyengar Yoga based on Light on Yoga. This course builds foundational strength, flexibility, and alignment through carefully sequenced standing poses, forward bends, twists, and basic inversions. Each week introduces new poses while reinforcing previous learning.',
    style: 'iyengar',
    difficulty: 'beginner',
    totalWeeks: 13,
    author: 'B.K.S. Iyengar',
    weeks: [
      {
        weekNumber: 1,
        name: 'Week 1: Standing Foundations',
        focus: 'Tadasana, Trikonasana, and breath awareness',
        description: 'Begin with the fundamental standing poses that form the foundation of all Iyengar practice. Focus on alignment, grounding through the feet, and developing body awareness.',
        recommendedSessions: ['iyengar-foundation', 'standing-strong'],
        practiceFrequency: '3-4 times this week',
        notes: 'Take your time with each pose. Use a wall for support if needed. Focus on feeling your foundation.',
        isMilestone: true
      },
      {
        weekNumber: 2,
        name: 'Week 2: Expanding the Foundation',
        focus: 'Parsvakonasana, Virabhadrasana I & II',
        description: 'Continue building strength and stability with warrior poses and extended side angle. Begin to understand the relationship between strength and flexibility.',
        recommendedSessions: ['iyengar-foundation', 'standing-strong'],
        practiceFrequency: '3-4 times this week',
        notes: 'Notice how the standing poses build heat and strength. Remember to breathe steadily.',
        isMilestone: false
      },
      {
        weekNumber: 3,
        name: 'Week 3: Balance and Coordination',
        focus: 'Vrksasana, Ardha Chandrasana',
        description: 'Introduce balance poses to develop concentration and coordination. Learn to find stability while standing on one leg.',
        recommendedSessions: ['foundation-poses-week-3', 'standing-strong'],
        practiceFrequency: '3-4 times this week',
        notes: 'Use a wall for balance poses initially. Focus your gaze on a fixed point to help with stability.',
        isMilestone: false
      },
      {
        weekNumber: 4,
        name: 'Week 4: Forward Bends Introduction',
        focus: 'Uttanasana, Prasarita Padottanasana',
        description: 'Begin exploring forward bends to lengthen the back body and calm the nervous system. Learn the difference between bending from the hips versus rounding the back.',
        recommendedSessions: ['foundation-poses-week-3', 'hamstring-release'],
        practiceFrequency: '4-5 times this week',
        notes: 'Bend your knees if needed to maintain a straight spine. Forward bends should feel calming, not straining.',
        isMilestone: false
      },
      {
        weekNumber: 5,
        name: 'Week 5: Seated Foundations',
        focus: 'Dandasana, Paschimottanasana preparation',
        description: 'Establish proper seated posture and begin working toward seated forward bends. Develop awareness of the pelvis and spine alignment while seated.',
        recommendedSessions: ['chair-warriors-week-5', 'hamstring-release'],
        practiceFrequency: '4-5 times this week',
        notes: 'Sit on a folded blanket if your hips are tight. The goal is a neutral spine, not touching your toes.',
        isMilestone: false
      },
      {
        weekNumber: 6,
        name: 'Week 6: Twists and Side Bends',
        focus: 'Bharadvajasana, Parsva Uttanasana',
        description: 'Introduce gentle twists to improve spinal mobility and detoxify. Learn to twist from the thoracic spine while keeping the hips stable.',
        recommendedSessions: ['chair-warriors-week-5', 'standing-strong'],
        practiceFrequency: '4-5 times this week',
        notes: 'Twists should feel opening, not compressing. Lengthen the spine before twisting deeper.',
        isMilestone: false
      },
      {
        weekNumber: 7,
        name: 'Week 7: Integration and Review',
        focus: 'Reviewing all standing poses and forward bends',
        description: 'This week focuses on consolidating your learning. Practice the poses you know with greater awareness and refinement.',
        recommendedSessions: ['iyengar-foundation', 'standing-strong', 'hamstring-release'],
        practiceFrequency: '4-5 times this week',
        notes: 'Notice your progress since week 1. Can you hold poses longer? Is your alignment improving?',
        isMilestone: true
      },
      {
        weekNumber: 8,
        name: 'Week 8: Backbends Introduction',
        focus: 'Bhujangasana, Salabhasana',
        description: 'Begin gentle backbends to strengthen the back body and open the chest. Learn to protect the lower back while backbending.',
        recommendedSessions: ['forward-bending-deep-dive-week-8', 'deep-backbend'],
        practiceFrequency: '4-5 times this week',
        notes: 'Keep your legs active in backbends to protect your lower back. Breathe into your chest.',
        isMilestone: false
      },
      {
        weekNumber: 9,
        name: 'Week 9: Core Strength',
        focus: 'Navasana, Chaturanga preparation',
        description: 'Develop core strength to support more advanced poses. Learn to engage the deep abdominal muscles.',
        recommendedSessions: ['core-flow', 'standing-strong'],
        practiceFrequency: '4-5 times this week',
        notes: 'Core work should feel challenging but not straining. Keep breathing steadily.',
        isMilestone: false
      },
      {
        weekNumber: 10,
        name: 'Week 10: Hip Opening',
        focus: 'Baddha Konasana, Janu Sirsasana',
        description: 'Work on hip flexibility with gentle hip openers. Learn to respect the limits of your hip joints.',
        recommendedSessions: ['hip-openers', 'hamstring-release'],
        practiceFrequency: '4-5 times this week',
        notes: 'Hip opening takes time. Never force the knees down in hip openers.',
        isMilestone: false
      },
      {
        weekNumber: 11,
        name: 'Week 11: Inversion Preparation',
        focus: 'Downward Dog, Dolphin Pose',
        description: 'Prepare the body for inversions by building shoulder and core strength. Learn to bear weight on the arms safely.',
        recommendedSessions: ['core-flow', 'advanced-backbend-flow-week-12'],
        practiceFrequency: '4-5 times this week',
        notes: 'Inversions can feel intimidating. Focus on building strength gradually.',
        isMilestone: false
      },
      {
        weekNumber: 12,
        name: 'Week 12: Gentle Inversions',
        focus: 'Legs up the wall, supported shoulderstand',
        description: 'Experience the benefits of gentle inversions. Learn modifications and proper support for shoulderstand.',
        recommendedSessions: ['advanced-backbend-flow-week-12', 'sleep-prep'],
        practiceFrequency: '4-5 times this week',
        notes: 'Always practice shoulderstand with proper support under the shoulders. Never turn your head while in the pose.',
        isMilestone: false
      },
      {
        weekNumber: 13,
        name: 'Week 13: Integration and Celebration',
        focus: 'Full practice sequences combining all elements',
        description: 'Celebrate 13 weeks of dedicated practice! This week brings together everything you have learned into complete, balanced sequences.',
        recommendedSessions: ['classical-complete', 'full-practice', 'iyengar-foundation'],
        practiceFrequency: '5-6 times this week',
        notes: 'Reflect on your journey. Notice how your body, mind, and breath have changed. Consider continuing to the Intermediate Course.',
        isMilestone: true
      }
    ]
  },
  {
    id: 'vinyasa-build-8',
    name: '8-Week Vinyasa Flow Builder',
    description: 'An 8-week program to build strength, flexibility, and breath-movement coordination through progressive vinyasa sequences. Perfect for those who want to develop a dynamic, flowing practice.',
    style: 'vinyasa',
    difficulty: 'mixed',
    totalWeeks: 8,
    author: null,
    weeks: [
      {
        weekNumber: 1,
        name: 'Week 1: Sun Salutation Foundations',
        focus: 'Learning the basic sun salutation flow',
        description: 'Master the fundamental building blocks of vinyasa: sun salutation A. Focus on linking breath to movement.',
        recommendedSessions: ['sun-salutation', 'morning-energizer'],
        practiceFrequency: '3-4 times this week',
        notes: 'One breath, one movement. Inhale to expand, exhale to fold or twist.',
        isMilestone: true
      },
      {
        weekNumber: 2,
        name: 'Week 2: Standing Flow Sequences',
        focus: 'Sun salutation B and warrior sequences',
        description: 'Add complexity with sun salutation B and flowing warrior sequences. Build heat and endurance.',
        recommendedSessions: ['sun-salutation', 'standing-strong'],
        practiceFrequency: '4-5 times this week',
        notes: 'Start to feel the meditative quality of flowing movement.',
        isMilestone: false
      },
      {
        weekNumber: 3,
        name: 'Week 3: Balance and Transitions',
        focus: 'Balancing poses within flows',
        description: 'Incorporate standing balance poses into your vinyasa sequences. Learn smooth transitions.',
        recommendedSessions: ['balance-challenge', 'standing-strong'],
        practiceFrequency: '4-5 times this week',
        notes: 'Transitions are poses too. Move mindfully between postures.',
        isMilestone: false
      },
      {
        weekNumber: 4,
        name: 'Week 4: Mid-Course Integration',
        focus: 'Longer flowing sequences',
        description: 'Combine everything learned so far into longer, more challenging flows. Build stamina and focus.',
        recommendedSessions: ['full-practice', 'balance-challenge', 'sun-salutation'],
        practiceFrequency: '4-5 times this week',
        notes: 'Notice how you can flow for longer periods. Your breath guides the way.',
        isMilestone: true
      },
      {
        weekNumber: 5,
        name: 'Week 5: Arm Balances',
        focus: 'Introduction to arm balances',
        description: 'Begin exploring arm balances and more challenging transitions. Build upper body strength.',
        recommendedSessions: ['core-flow', 'balance-challenge'],
        practiceFrequency: '4-5 times this week',
        notes: 'Arm balances are about technique as much as strength. Play at your edge.',
        isMilestone: false
      },
      {
        weekNumber: 6,
        name: 'Week 6: Deeper Backbends',
        focus: 'Dynamic backbending sequences',
        description: 'Explore flowing backbends with proper warm-up and counter-poses. Learn to move safely in and out of backbends.',
        recommendedSessions: ['deep-backbend', 'standing-strong'],
        practiceFrequency: '4-5 times this week',
        notes: 'Backbends are heart openers. Embrace the vulnerability and energy they bring.',
        isMilestone: false
      },
      {
        weekNumber: 7,
        name: 'Week 7: Peak Poses',
        focus: 'Building toward challenging peak poses',
        description: 'Each practice builds intelligently toward a peak pose. Learn the art of sequencing.',
        recommendedSessions: ['full-practice', 'balance-challenge', 'core-flow'],
        practiceFrequency: '5-6 times this week',
        notes: 'The journey to the peak is as important as the peak itself.',
        isMilestone: false
      },
      {
        weekNumber: 8,
        name: 'Week 8: Creative Flows',
        focus: 'Putting it all together',
        description: 'Celebrate 8 weeks of growth with creative, dynamic sequences that showcase your strength and fluidity.',
        recommendedSessions: ['full-practice', 'balance-challenge', 'core-flow', 'hip-openers'],
        practiceFrequency: '5-6 times this week',
        notes: 'You have built a strong, sustainable vinyasa practice. Keep flowing!',
        isMilestone: true
      }
    ]
  }
];

/**
 * Get a program by its ID
 * @param {string} id - Program ID
 * @returns {Program|undefined} The program object or undefined if not found
 */
export const getProgramById = (id) => {
  return programs.find(program => program.id === id);
};

/**
 * Get a specific week from a program
 * @param {string} programId - Program ID
 * @param {number} weekNumber - Week number (1-indexed)
 * @returns {Week|undefined} The week object or undefined if not found
 */
export const getWeekByNumber = (programId, weekNumber) => {
  const program = getProgramById(programId);
  if (!program) return undefined;
  return program.weeks.find(week => week.weekNumber === weekNumber);
};

/**
 * Get the next week in a program
 * @param {string} programId - Program ID
 * @param {number} currentWeekNumber - Current week number (1-indexed)
 * @returns {Week|null} The next week object, or null if at the end of the program
 */
export const getNextWeek = (programId, currentWeekNumber) => {
  const program = getProgramById(programId);
  if (!program) return null;

  const nextWeekNumber = currentWeekNumber + 1;
  if (nextWeekNumber > program.totalWeeks) return null;

  return getWeekByNumber(programId, nextWeekNumber);
};

/**
 * Get the previous week in a program
 * @param {string} programId - Program ID
 * @param {number} currentWeekNumber - Current week number (1-indexed)
 * @returns {Week|null} The previous week object, or null if at the beginning
 */
export const getPreviousWeek = (programId, currentWeekNumber) => {
  if (currentWeekNumber <= 1) return null;
  return getWeekByNumber(programId, currentWeekNumber - 1);
};

/**
 * Get all milestone weeks for a program
 * @param {string} programId - Program ID
 * @returns {Week[]} Array of milestone weeks
 */
export const getMilestoneWeeks = (programId) => {
  const program = getProgramById(programId);
  if (!program) return [];
  return program.weeks.filter(week => week.isMilestone);
};

/**
 * Get programs by style
 * @param {string} style - Yoga style (e.g., 'iyengar', 'vinyasa')
 * @returns {Program[]} Array of matching programs
 */
export const getProgramsByStyle = (style) => {
  return programs.filter(program => program.style.toLowerCase() === style.toLowerCase());
};

/**
 * Get programs by difficulty
 * @param {string} difficulty - Difficulty level ('beginner', 'intermediate', 'advanced', 'mixed')
 * @returns {Program[]} Array of matching programs
 */
export const getProgramsByDifficulty = (difficulty) => {
  return programs.filter(program => program.difficulty.toLowerCase() === difficulty.toLowerCase());
};

/**
 * Calculate program progress percentage
 * @param {number} currentWeek - Current week number (1-indexed)
 * @param {number} totalWeeks - Total weeks in program
 * @returns {number} Progress percentage (0-100)
 */
export const calculateProgramProgress = (currentWeek, totalWeeks) => {
  if (totalWeeks === 0) return 0;
  return Math.round((currentWeek / totalWeeks) * 100);
};

/**
 * Check if a week is the first week of a program
 * @param {number} weekNumber - Week number to check
 * @returns {boolean} True if first week
 */
export const isFirstWeek = (weekNumber) => {
  return weekNumber === 1;
};

/**
 * Check if a week is the last week of a program
 * @param {string} programId - Program ID
 * @param {number} weekNumber - Week number to check
 * @returns {boolean} True if last week
 */
export const isLastWeek = (programId, weekNumber) => {
  const program = getProgramById(programId);
  if (!program) return false;
  return weekNumber === program.totalWeeks;
};
