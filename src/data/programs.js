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
  },
  {
    id: 'breath-movement-8',
    name: 'Foundations of Breath & Movement',
    description: 'An 8-week program integrating pranayama with basic asanas. Learn to harmonize breath and movement, building the foundation for deeper practice. Based on Iyengar\'s teaching that "prana and mind are intimately connected."',
    style: 'hatha',
    difficulty: 'beginner',
    totalWeeks: 8,
    author: 'Based on B.K.S. Iyengar\'s teachings',
    weeks: [
      {
        weekNumber: 1,
        name: 'Week 1: Natural Breath Awareness',
        focus: 'Observing the breath in simple poses',
        description: 'Begin with awareness of natural breathing patterns in Tadasana and simple standing poses. Learn to breathe through the nostrils and observe breath without manipulation.',
        recommendedSessions: ['iyengar-foundation', 'morning-energizer'],
        practiceFrequency: '3-4 times this week',
        notes: 'Simply observe your breath. Notice how it changes in different poses without trying to control it.',
        isMilestone: true
      },
      {
        weekNumber: 2,
        name: 'Week 2: Deepening the Breath',
        focus: 'Full yogic breath in standing poses',
        description: 'Learn three-part breath (diaphragmatic, thoracic, clavicular) while maintaining standing poses. Build breath capacity.',
        recommendedSessions: ['standing-strong', 'iyengar-foundation'],
        practiceFrequency: '4 times this week',
        notes: 'Feel the breath fill your belly, ribs, and chest sequentially. Never strain.',
        isMilestone: false
      },
      {
        weekNumber: 3,
        name: 'Week 3: Breath in Forward Bends',
        focus: 'Calming breath with forward folding',
        description: 'Experience how forward bends naturally slow and deepen the breath. Learn to use exhalation to release deeper into poses.',
        recommendedSessions: ['hamstring-release', 'evening-wind-down'],
        practiceFrequency: '4 times this week',
        notes: 'Forward bends should calm the nervous system. Let your breath be soft and steady.',
        isMilestone: false
      },
      {
        weekNumber: 4,
        name: 'Week 4: Introduction to Ujjayi',
        focus: 'Victorious breath technique',
        description: 'Learn ujjayi pranayama (ocean-sounding breath) in seated poses. This will become the foundation for all future pranayama.',
        recommendedSessions: ['chair-warriors-week-5', 'hamstring-release'],
        practiceFrequency: '4-5 times this week',
        notes: 'Ujjayi should sound like ocean waves. Practice first in seated poses before adding movement.',
        isMilestone: true
      },
      {
        weekNumber: 5,
        name: 'Week 5: Breath-Movement Coordination',
        focus: 'Linking ujjayi breath to movement',
        description: 'Begin moving with ujjayi breath in simple sequences. One breath per movement, cultivating flow.',
        recommendedSessions: ['sun-salutation', 'morning-energizer'],
        practiceFrequency: '4-5 times this week',
        notes: 'Let the breath lead the movement. If breath becomes strained, slow down or rest.',
        isMilestone: false
      },
      {
        weekNumber: 6,
        name: 'Week 6: Energizing Breath',
        focus: 'Kapalabhati (skull shining breath)',
        description: 'Learn energizing breathing techniques. Understand when to use calming versus energizing breath.',
        recommendedSessions: ['morning-energizer', 'standing-strong'],
        practiceFrequency: '4-5 times this week',
        notes: 'Practice kapalabhati on an empty stomach. Start with short rounds (20-30 breaths).',
        isMilestone: false
      },
      {
        weekNumber: 7,
        name: 'Week 7: Alternate Nostril Breathing',
        focus: 'Nadi Shodhana introduction',
        description: 'Learn alternate nostril breathing to balance the nervous system. Practice after asanas for best effect.',
        recommendedSessions: ['evening-wind-down', 'sleep-prep'],
        practiceFrequency: '5 times this week',
        notes: 'Nadi Shodhana balances left and right energy channels. Perfect before meditation.',
        isMilestone: false
      },
      {
        weekNumber: 8,
        name: 'Week 8: Integration & Practice',
        focus: 'Complete breath-centered practice',
        description: 'Integrate all breathing techniques into a complete practice. Choose appropriate pranayama for different times of day and states of mind.',
        recommendedSessions: ['morning-energizer', 'full-practice', 'evening-wind-down'],
        practiceFrequency: '5-6 times this week',
        notes: 'You now have a complete toolkit of breathing practices. Continue daily pranayama for life.',
        isMilestone: true
      }
    ]
  },
  {
    id: 'back-care-10',
    name: 'Therapeutic Yoga for Back Care',
    description: 'A 10-week therapeutic program for spinal health and pain relief. Drawing from Iyengar\'s extensive therapeutic applications, this course systematically addresses back pain through alignment, strengthening, and release.',
    style: 'iyengar',
    difficulty: 'mixed',
    totalWeeks: 10,
    author: 'Based on Iyengar therapeutic sequences',
    weeks: [
      {
        weekNumber: 1,
        name: 'Week 1: Foundation & Assessment',
        focus: 'Gentle movement and body awareness',
        description: 'Begin with gentle poses to assess your current state. Learn proper alignment in Tadasana to protect the spine in all poses.',
        recommendedSessions: ['iyengar-foundation', 'gentle-evening'],
        practiceFrequency: '3-4 times this week',
        notes: 'Move slowly. Notice where you feel tightness or discomfort. Use props liberally.',
        isMilestone: true
      },
      {
        weekNumber: 2,
        name: 'Week 2: Standing Alignment',
        focus: 'Standing poses for spinal strength',
        description: 'Build foundational strength through standing poses. Learn to engage legs to support the spine.',
        recommendedSessions: ['standing-strong', 'iyengar-foundation'],
        practiceFrequency: '4 times this week',
        notes: 'Strong legs create a stable base for a healthy spine. Keep the spine long.',
        isMilestone: false
      },
      {
        weekNumber: 3,
        name: 'Week 3: Hip Release',
        focus: 'Releasing hip tension',
        description: 'Tight hips often contribute to back pain. Gentle hip openers with proper support.',
        recommendedSessions: ['hip-openers', 'hamstring-release'],
        practiceFrequency: '4-5 times this week',
        notes: 'Hip tightness pulls on the lower back. Be patient with hip opening.',
        isMilestone: false
      },
      {
        weekNumber: 4,
        name: 'Week 4: Gentle Twists',
        focus: 'Spinal rotation and mobility',
        description: 'Introduce gentle twists to improve spinal mobility. Twists help realign vertebrae and release tension.',
        recommendedSessions: ['chair-warriors-week-5', 'evening-wind-down'],
        practiceFrequency: '4-5 times this week',
        notes: 'Lengthen before twisting. Never force a twist, especially if you have disc issues.',
        isMilestone: false
      },
      {
        weekNumber: 5,
        name: 'Week 5: Forward Bends for Release',
        focus: 'Supported forward bending',
        description: 'Forward bends with support release the entire back body. Learn to hinge from the hips, not round the spine.',
        recommendedSessions: ['hamstring-release', 'evening-wind-down'],
        practiceFrequency: '4-5 times this week',
        notes: 'Use blocks, bolsters, or chairs for support. Forward bends should feel releasing, not straining.',
        isMilestone: true
      },
      {
        weekNumber: 6,
        name: 'Week 6: Gentle Back Strengthening',
        focus: 'Building back body strength',
        description: 'Gentle backbends like Bhujangasana strengthen back muscles. Focus on even distribution of the backbend.',
        recommendedSessions: ['deep-backbend', 'standing-strong'],
        practiceFrequency: '4-5 times this week',
        notes: 'Keep legs active. Lengthen the front of the body as you arch. Never collapse into the lower back.',
        isMilestone: false
      },
      {
        weekNumber: 7,
        name: 'Week 7: Core Stability',
        focus: 'Strengthening core support',
        description: 'Build core strength to support the spine. Learn to engage deep abdominal muscles.',
        recommendedSessions: ['core-flow', 'standing-strong'],
        practiceFrequency: '4-5 times this week',
        notes: 'A strong core protects the back. Focus on steady engagement, not gripping.',
        isMilestone: false
      },
      {
        weekNumber: 8,
        name: 'Week 8: Restorative Poses',
        focus: 'Deep restoration and healing',
        description: 'Supported restorative poses allow the nervous system to release chronic tension patterns.',
        recommendedSessions: ['sleep-prep', 'evening-wind-down'],
        practiceFrequency: '5-6 times this week',
        notes: 'Restorative poses work deeply. Stay in poses 5-15 minutes with full support.',
        isMilestone: false
      },
      {
        weekNumber: 9,
        name: 'Week 9: Integration',
        focus: 'Balanced practice sequences',
        description: 'Combine strengthening, stretching, and restoration in balanced sequences.',
        recommendedSessions: ['full-practice', 'iyengar-foundation', 'evening-wind-down'],
        practiceFrequency: '5 times this week',
        notes: 'Your back should feel stronger and more mobile. Notice improvements in daily life.',
        isMilestone: false
      },
      {
        weekNumber: 10,
        name: 'Week 10: Sustainable Self-Care',
        focus: 'Building a daily back care practice',
        description: 'Establish a sustainable daily practice for ongoing back health. Learn which poses help most for your specific needs.',
        recommendedSessions: ['morning-energizer', 'full-practice', 'sleep-prep'],
        practiceFrequency: '5-6 times this week',
        notes: 'Create a daily 15-minute routine for your back. Consistency is more important than duration.',
        isMilestone: true
      }
    ]
  },
  {
    id: 'eight-limbs-12',
    name: 'The Eight Limbs Journey',
    description: 'A 12-week exploration of Patanjali\'s Ashtanga (eight-limbed) Yoga. Systematically progress through yama, niyama, asana, pranayama, pratyahara, dharana, dhyana, and samadhi through embodied practice.',
    style: 'hatha',
    difficulty: 'intermediate',
    totalWeeks: 12,
    author: 'Based on Patanjali\'s Yoga Sutras',
    weeks: [
      {
        weekNumber: 1,
        name: 'Week 1: Yama - Ahimsa (Non-violence)',
        focus: 'Practicing non-violence on the mat',
        description: 'Learn to practice with compassion toward yourself. Notice when you push too hard or give up too easily. Find the middle path.',
        recommendedSessions: ['iyengar-foundation', 'gentle-evening'],
        practiceFrequency: '4 times this week',
        notes: 'Ahimsa begins with yourself. Listen to your body. Honor your limits while exploring your edges.',
        isMilestone: true
      },
      {
        weekNumber: 2,
        name: 'Week 2: Yama - Satya (Truthfulness)',
        focus: 'Honest alignment and effort',
        description: 'Practice with truthful alignment. Be honest about where you are versus where you think you should be.',
        recommendedSessions: ['iyengar-foundation', 'standing-strong'],
        practiceFrequency: '4-5 times this week',
        notes: 'Satya means seeing yourself clearly. No pretending, no self-deception.',
        isMilestone: false
      },
      {
        weekNumber: 3,
        name: 'Week 3: Niyama - Saucha & Tapas',
        focus: 'Purity and disciplined practice',
        description: 'Saucha (cleanliness) inside and out. Tapas (disciplined effort) builds inner fire and transformation.',
        recommendedSessions: ['full-practice', 'core-flow'],
        practiceFrequency: '5 times this week',
        notes: 'Create a clean practice space. Show up consistently. Feel the transformative fire of tapas.',
        isMilestone: false
      },
      {
        weekNumber: 4,
        name: 'Week 4: Asana - Steadiness & Ease',
        focus: 'Sthira sukham asanam',
        description: 'Patanjali defines asana as steady and comfortable. Find this balance in every pose - neither forcing nor collapsing.',
        recommendedSessions: ['iyengar-foundation', 'balance-challenge'],
        practiceFrequency: '5 times this week',
        notes: 'In every pose, ask: Am I steady (sthira)? Am I at ease (sukham)? Both must be present.',
        isMilestone: true
      },
      {
        weekNumber: 5,
        name: 'Week 5: Asana Refinement',
        focus: 'Perfecting alignment and stability',
        description: 'Deepen asana practice with precise alignment. Prepare the body for pranayama and meditation.',
        recommendedSessions: ['iyengar-foundation', 'standing-strong', 'balance-challenge'],
        practiceFrequency: '5 times this week',
        notes: 'Asanas prepare the body for the inward journey. Build a stable, comfortable seat.',
        isMilestone: false
      },
      {
        weekNumber: 6,
        name: 'Week 6: Pranayama - Breath Extension',
        focus: 'Beginning pranayama practice',
        description: 'Start formal pranayama practice. Learn proper posture, nostril breathing, and breath observation.',
        recommendedSessions: ['chair-warriors-week-5', 'evening-wind-down'],
        practiceFrequency: '5-6 times this week',
        notes: 'Pranayama controls the life force. Approach with respect and patience. Never strain.',
        isMilestone: true
      },
      {
        weekNumber: 7,
        name: 'Week 7: Pranayama Deepening',
        focus: 'Ratio and retention',
        description: 'Explore breath ratios and gentle retention (kumbhaka). Experience the calming effects of controlled breathing.',
        recommendedSessions: ['gentle-evening', 'sleep-prep'],
        practiceFrequency: '5-6 times this week',
        notes: 'Kumbhaka (retention) is powerful. Start with short holds. Observe the stillness between breaths.',
        isMilestone: false
      },
      {
        weekNumber: 8,
        name: 'Week 8: Pratyahara - Sense Withdrawal',
        focus: 'Turning inward',
        description: 'Practice with eyes closed when safe. Draw the senses inward. Restorative poses support pratyahara.',
        recommendedSessions: ['sleep-prep', 'evening-wind-down'],
        practiceFrequency: '5-6 times this week',
        notes: 'Like a turtle withdrawing into its shell. Let external stimuli fade. Turn toward inner awareness.',
        isMilestone: true
      },
      {
        weekNumber: 9,
        name: 'Week 9: Dharana - Concentration',
        focus: 'One-pointed focus',
        description: 'Practice concentration in balancing poses and breath counting. Learn to focus the scattered mind.',
        recommendedSessions: ['balance-challenge', 'evening-wind-down'],
        practiceFrequency: '5-6 times this week',
        notes: 'Dharana is concentration on a single point. The breath, a candle flame, a mantra. Practice daily.',
        isMilestone: false
      },
      {
        weekNumber: 10,
        name: 'Week 10: Dhyana - Meditation',
        focus: 'Sustained meditation',
        description: 'When concentration deepens and sustains, it becomes meditation. Experience moments of uninterrupted awareness.',
        recommendedSessions: ['gentle-evening', 'sleep-prep'],
        practiceFrequency: '6 times this week',
        notes: 'Dhyana arises naturally from dharana. Don\'t force. Simply sustain gentle awareness.',
        isMilestone: false
      },
      {
        weekNumber: 11,
        name: 'Week 11: Integration',
        focus: 'All eight limbs in harmony',
        description: 'Practice that integrates ethical living, asana, breath, sense withdrawal, and meditation.',
        recommendedSessions: ['full-practice', 'balance-challenge', 'sleep-prep'],
        practiceFrequency: '6 times this week',
        notes: 'The eight limbs support each other. Each strengthens the others. Practice the whole path.',
        isMilestone: false
      },
      {
        weekNumber: 12,
        name: 'Week 12: Samadhi - Glimpses of Unity',
        focus: 'Touching the transcendent',
        description: 'Samadhi is the goal - absorption, union, liberation. Most will only taste glimpses. That is enough. The journey continues.',
        recommendedSessions: ['gentle-evening', 'sleep-prep', 'full-practice'],
        practiceFrequency: '6-7 times this week',
        notes: 'Samadhi is beyond technique. Continue walking the eight-fold path with dedication and surrender.',
        isMilestone: true
      }
    ]
  },
  {
    id: 'pranayama-mastery-10',
    name: 'Pranayama Mastery',
    description: 'A 10-week intensive course in breath control. Iyengar warns: "As lions and elephants are tamed slowly and cautiously, so should prana be brought under control." This systematic approach builds breath capacity and control safely.',
    style: 'hatha',
    difficulty: 'intermediate',
    totalWeeks: 10,
    author: 'Based on Hatha Yoga Pradipika & Iyengar',
    weeks: [
      {
        weekNumber: 1,
        name: 'Week 1: Foundation & Observation',
        focus: 'Natural breath study',
        description: 'Observe natural breathing patterns without manipulation. Learn proper seated posture for pranayama. Understand the mechanics of respiration.',
        recommendedSessions: ['gentle-evening', 'chair-warriors-week-5'],
        practiceFrequency: '4 times this week (10-15 min pranayama)',
        notes: 'Simply watch the breath. Notice length, depth, pauses. No control yet.',
        isMilestone: true
      },
      {
        weekNumber: 2,
        name: 'Week 2: Diaphragmatic Breathing',
        focus: 'Full belly breath',
        description: 'Learn to breathe fully into the diaphragm. This is the foundation for all pranayama. Build breath capacity.',
        recommendedSessions: ['gentle-evening', 'hamstring-release'],
        practiceFrequency: '5 times this week (15 min pranayama)',
        notes: 'Place hands on belly. Feel it rise on inhale, fall on exhale. Breathe deep and slow.',
        isMilestone: false
      },
      {
        weekNumber: 3,
        name: 'Week 3: Three-Part Breath',
        focus: 'Complete yogic breath',
        description: 'Learn dirga pranayama - filling belly, ribs, then chest sequentially. Empty in reverse order. The complete breath.',
        recommendedSessions: ['gentle-evening', 'chair-warriors-week-5'],
        practiceFrequency: '5 times this week (15-20 min pranayama)',
        notes: 'Three-part breath oxygenates fully. Practice until it becomes natural.',
        isMilestone: false
      },
      {
        weekNumber: 4,
        name: 'Week 4: Ujjayi Pranayama',
        focus: 'Victorious breath',
        description: 'Master ujjayi - the ocean-sounding breath. Learn proper throat constriction. Build heat and focus.',
        recommendedSessions: ['standing-strong', 'gentle-evening'],
        practiceFrequency: '5-6 times this week (20 min pranayama)',
        notes: 'Ujjayi should sound like ocean waves. Practice seated first, then add to asana practice.',
        isMilestone: true
      },
      {
        weekNumber: 5,
        name: 'Week 5: Nadi Shodhana',
        focus: 'Alternate nostril breathing',
        description: 'Learn the purifying breath that balances ida and pingala nadis (energy channels). Calms and centers the mind.',
        recommendedSessions: ['evening-wind-down', 'sleep-prep'],
        practiceFrequency: '6 times this week (20 min pranayama)',
        notes: 'Use proper hand position (Vishnu mudra). Keep breath smooth and even. Never force.',
        isMilestone: false
      },
      {
        weekNumber: 6,
        name: 'Week 6: Breath Ratios',
        focus: 'Counted breathing',
        description: 'Introduce breath ratios. Start with 1:1 (equal inhale/exhale), progress to 1:2 (exhale twice as long).',
        recommendedSessions: ['gentle-evening', 'evening-wind-down'],
        practiceFrequency: '6 times this week (20-25 min pranayama)',
        notes: 'Count mentally to maintain ratio. Longer exhales activate parasympathetic nervous system.',
        isMilestone: false
      },
      {
        weekNumber: 7,
        name: 'Week 7: Kumbhaka - Breath Retention',
        focus: 'Gentle retention practices',
        description: 'Introduce very gentle breath retention after inhale (antara) and exhale (bahya). Start with 2-3 second holds.',
        recommendedSessions: ['chair-warriors-week-5', 'gentle-evening'],
        practiceFrequency: '6 times this week (20-25 min pranayama)',
        notes: 'CAUTION: Never strain with retention. Stop if dizzy or anxious. Build very gradually.',
        isMilestone: true
      },
      {
        weekNumber: 8,
        name: 'Week 8: Kapalabhati',
        focus: 'Skull shining breath',
        description: 'Learn this energizing, cleansing technique. Short, forceful exhales from the belly. Practice on empty stomach.',
        recommendedSessions: ['morning-energizer', 'sun-salutation'],
        practiceFrequency: '6 times this week (25 min pranayama)',
        notes: 'Start with 20-30 breaths. Pause between rounds. Very energizing - practice in morning.',
        isMilestone: false
      },
      {
        weekNumber: 9,
        name: 'Week 9: Bhastrika',
        focus: 'Bellows breath',
        description: 'Powerful, energizing breath. Forceful inhale and exhale. Builds heat and energy. Practice with caution.',
        recommendedSessions: ['morning-energizer', 'standing-strong'],
        practiceFrequency: '6 times this week (25-30 min pranayama)',
        notes: 'CAUTION: Not for those with high blood pressure or heart conditions. Very heating.',
        isMilestone: false
      },
      {
        weekNumber: 10,
        name: 'Week 10: Integration & Daily Practice',
        focus: 'Complete pranayama routine',
        description: 'Integrate all techniques into a complete daily pranayama sadhana. Understand which practices to use when.',
        recommendedSessions: ['morning-energizer', 'full-practice', 'sleep-prep'],
        practiceFrequency: '7 times this week (30 min pranayama)',
        notes: 'You now have a complete pranayama toolkit. Practice daily for life. The breath is the bridge to the inner Self.',
        isMilestone: true
      }
    ]
  },
  {
    id: 'strength-stability-10',
    name: 'Strength & Stability',
    description: 'A 10-week program building serious physical strength through standing poses, arm balances, and core work. Develop virya (vigor/enthusiasm) and achieve poses that seemed impossible.',
    style: 'hatha',
    difficulty: 'intermediate',
    totalWeeks: 10,
    author: null,
    weeks: [
      {
        weekNumber: 1,
        name: 'Week 1: Standing Strength Foundation',
        focus: 'Warrior poses and standing endurance',
        description: 'Build foundational leg and core strength through held standing poses. Learn to find steadiness while working hard.',
        recommendedSessions: ['standing-strong', 'iyengar-foundation'],
        practiceFrequency: '4 times this week',
        notes: 'Hold standing poses longer than comfortable. Build mental strength along with physical.',
        isMilestone: true
      },
      {
        weekNumber: 2,
        name: 'Week 2: Core Awakening',
        focus: 'Foundational core strength',
        description: 'Introduce core-strengthening poses. Learn to engage deep abdominal muscles and pelvic floor.',
        recommendedSessions: ['core-flow', 'standing-strong'],
        practiceFrequency: '4-5 times this week',
        notes: 'Core strength protects the back and enables arm balances. Focus on quality over quantity.',
        isMilestone: false
      },
      {
        weekNumber: 3,
        name: 'Week 3: Upper Body Strength',
        focus: 'Building shoulder and arm strength',
        description: 'Plank variations, chaturanga, and downward dog holds. Prepare upper body for arm balances.',
        recommendedSessions: ['core-flow', 'sun-salutation'],
        practiceFrequency: '5 times this week',
        notes: 'Modify as needed (knees down). Build gradually. You\'re building strength for life.',
        isMilestone: false
      },
      {
        weekNumber: 4,
        name: 'Week 4: Balance Challenges',
        focus: 'Standing balance and focus',
        description: 'Advanced standing balances. Build concentration while strengthening stabilizer muscles.',
        recommendedSessions: ['balance-challenge', 'standing-strong'],
        practiceFrequency: '5 times this week',
        notes: 'Falling is part of learning. Use a wall without shame. Smile when you fall.',
        isMilestone: false
      },
      {
        weekNumber: 5,
        name: 'Week 5: First Arm Balance',
        focus: 'Crow pose (Bakasana)',
        description: 'Learn your first arm balance. Break it down step by step. Discover that arm balances are about technique as much as strength.',
        recommendedSessions: ['core-flow', 'balance-challenge'],
        practiceFrequency: '5-6 times this week',
        notes: 'Crow is about hip height, hand position, and gaze. Practice against a wall. Celebrate small wins.',
        isMilestone: true
      },
      {
        weekNumber: 6,
        name: 'Week 6: Arm Balance Progressions',
        focus: 'Side crow and variations',
        description: 'Build on crow pose. Learn variations and transitions. Develop wrist and forearm strength.',
        recommendedSessions: ['core-flow', 'balance-challenge', 'sun-salutation'],
        practiceFrequency: '5-6 times this week',
        notes: 'Warm up wrists thoroughly. Use padding under hands if needed. Play at your edge.',
        isMilestone: false
      },
      {
        weekNumber: 7,
        name: 'Week 7: Inversion Strength',
        focus: 'Building toward headstand',
        description: 'Prepare for inversions through dolphin pose, forearm planks, and supported variations.',
        recommendedSessions: ['core-flow', 'full-practice'],
        practiceFrequency: '5-6 times this week',
        notes: 'Inversions require strong core and shoulders. Never jump into headstand - build foundation first.',
        isMilestone: false
      },
      {
        weekNumber: 8,
        name: 'Week 8: Peak Strength',
        focus: 'Challenging sequences',
        description: 'Put it all together in demanding sequences. Hold poses longer. Flow powerfully.',
        recommendedSessions: ['full-practice', 'core-flow', 'balance-challenge'],
        practiceFrequency: '6 times this week',
        notes: 'You are strong. Notice how your capacity has grown. Keep breathing through challenges.',
        isMilestone: true
      },
      {
        weekNumber: 9,
        name: 'Week 9: Endurance Building',
        focus: 'Longer holds and more rounds',
        description: 'Build endurance by holding poses longer and repeating sequences. Mental strength training.',
        recommendedSessions: ['full-practice', 'standing-strong', 'sun-salutation'],
        practiceFrequency: '6 times this week',
        notes: 'When the body says "I can\'t," the mind can say "breathe, you can." Find your edge and breathe.',
        isMilestone: false
      },
      {
        weekNumber: 10,
        name: 'Week 10: Strength in Softness',
        focus: 'Integrating strength with ease',
        description: 'True strength includes knowing when to rest. Balance your powerful practice with restoration and ease.',
        recommendedSessions: ['full-practice', 'balance-challenge', 'sleep-prep'],
        practiceFrequency: '5-6 times this week',
        notes: 'Strength without ease creates rigidity. Ease without strength creates weakness. Find both.',
        isMilestone: true
      }
    ]
  },
  {
    id: 'inversion-intensive-12',
    name: 'Inversion Intensive',
    description: 'A 12-week deep dive into inversions. Iyengar calls Sirsasana "the king of asanas" and Sarvangasana "the queen." This program builds the strength, alignment, and courage to invert safely.',
    style: 'iyengar',
    difficulty: 'advanced',
    totalWeeks: 12,
    author: 'Based on B.K.S. Iyengar\'s inversion teachings',
    weeks: [
      {
        weekNumber: 1,
        name: 'Week 1: Foundation Assessment',
        focus: 'Building prerequisites',
        description: 'Assess readiness for inversions. Build shoulder, core, and neck strength. Learn proper alignment principles.',
        recommendedSessions: ['core-flow', 'standing-strong'],
        practiceFrequency: '4-5 times this week',
        notes: 'Not everyone is ready for inversions. Build strength patiently. No rushing.',
        isMilestone: true
      },
      {
        weekNumber: 2,
        name: 'Week 2: Shoulder Opening',
        focus: 'Shoulder flexibility and strength',
        description: 'Inversions require mobile, strong shoulders. Dolphin pose, shoulder stretches, and strengthening.',
        recommendedSessions: ['core-flow', 'full-practice'],
        practiceFrequency: '5 times this week',
        notes: 'Shoulders must be open and strong. This protects the neck in inversions.',
        isMilestone: false
      },
      {
        weekNumber: 3,
        name: 'Week 3: Core for Inversions',
        focus: 'Deep core engagement',
        description: 'Learn to engage bandhas (energy locks). Build core control necessary for lifting legs overhead.',
        recommendedSessions: ['core-flow', 'balance-challenge'],
        practiceFrequency: '5 times this week',
        notes: 'Core strength lifts the legs. Practice leg lifts against wall. Engage uddiyana bandha.',
        isMilestone: false
      },
      {
        weekNumber: 4,
        name: 'Week 4: First Headstand Preparation',
        focus: 'Sirsasana foundation',
        description: 'Learn proper head and forearm placement. Practice bearing weight on forearms, not head. Use wall support.',
        recommendedSessions: ['core-flow', 'full-practice'],
        practiceFrequency: '5-6 times this week',
        notes: 'Head placement is critical. Weight primarily on forearms. Crown of head touches floor lightly.',
        isMilestone: true
      },
      {
        weekNumber: 5,
        name: 'Week 5: Sirsasana Progressions',
        focus: 'Building headstand step by step',
        description: 'Progress from tucked legs to full headstand. Learn to come up controlled, not kicked. Practice at wall.',
        recommendedSessions: ['full-practice', 'balance-challenge'],
        practiceFrequency: '5-6 times this week',
        notes: 'Never kick up into headstand. Walk feet in, tuck knees, extend when ready. Use wall.',
        isMilestone: false
      },
      {
        weekNumber: 6,
        name: 'Week 6: Headstand Refinement',
        focus: 'Longer holds and alignment',
        description: 'Hold headstand longer. Perfect alignment. Learn to breathe easily inverted. Begin releasing from wall.',
        recommendedSessions: ['full-practice', 'core-flow'],
        practiceFrequency: '6 times this week',
        notes: 'Work toward 3-5 minute holds. Keep legs active, core engaged, breath steady.',
        isMilestone: false
      },
      {
        weekNumber: 7,
        name: 'Week 7: Shoulderstand Foundation',
        focus: 'Sarvangasana with support',
        description: 'Learn shoulderstand with proper support (folded blankets under shoulders). Never without support initially.',
        recommendedSessions: ['full-practice', 'sleep-prep'],
        practiceFrequency: '5-6 times this week',
        notes: 'CRITICAL: Always use blanket support. Never turn head in shoulderstand. Protects cervical spine.',
        isMilestone: true
      },
      {
        weekNumber: 8,
        name: 'Week 8: Shoulderstand Variations',
        focus: 'Exploring variations',
        description: 'Once stable in basic shoulderstand, explore leg variations. Eka Pada, Parsva, Karnapidasana.',
        recommendedSessions: ['full-practice', 'sleep-prep', 'evening-wind-down'],
        practiceFrequency: '6 times this week',
        notes: 'The "queen of asanas" benefits thyroid, calms nervous system. Hold 5-10 minutes.',
        isMilestone: false
      },
      {
        weekNumber: 9,
        name: 'Week 9: Forearm Stand',
        focus: 'Pincha Mayurasana',
        description: 'Build toward forearm stand. Requires strong shoulders and core. Practice at wall initially.',
        recommendedSessions: ['core-flow', 'balance-challenge'],
        practiceFrequency: '6 times this week',
        notes: 'Keep shoulders over elbows. Engage core strongly. Play with small hops. Wall is friend.',
        isMilestone: false
      },
      {
        weekNumber: 10,
        name: 'Week 10: Handstand Preparation',
        focus: 'Building toward Adho Mukha Vrksasana',
        description: 'Handstand requires different alignment than forearm stand. Build wrist strength. Practice controlled lifts.',
        recommendedSessions: ['core-flow', 'balance-challenge'],
        practiceFrequency: '6 times this week',
        notes: 'Handstand is challenging. Some need months or years. Enjoy the journey.',
        isMilestone: false
      },
      {
        weekNumber: 11,
        name: 'Week 11: Inversion Sequences',
        focus: 'Combining inversions',
        description: 'Learn to sequence inversions safely. Rest between inversions. Follow with forward bends.',
        recommendedSessions: ['full-practice', 'balance-challenge'],
        practiceFrequency: '6 times this week',
        notes: 'Traditional sequence: headstand, shoulderstand, then forward bends. Always counter inversions.',
        isMilestone: false
      },
      {
        weekNumber: 12,
        name: 'Week 12: Inversion Mastery',
        focus: 'Independence and confidence',
        description: 'Practice inversions away from wall. Hold for longer durations. Experience the profound effects on body and mind.',
        recommendedSessions: ['full-practice', 'balance-challenge', 'sleep-prep'],
        practiceFrequency: '6-7 times this week',
        notes: 'You are now an inverter. Daily practice of inversions brings vitality, clarity, and courage.',
        isMilestone: true
      }
    ]
  },
  {
    id: 'backbending-journey-12',
    name: 'Backbending Journey',
    description: 'A 12-week progressive exploration of backbends from gentle heart openers to deep wheel pose. Learn to backbend safely while opening physically and emotionally.',
    style: 'iyengar',
    difficulty: 'advanced',
    totalWeeks: 12,
    author: null,
    weeks: [
      {
        weekNumber: 1,
        name: 'Week 1: Backbend Foundations',
        focus: 'Understanding spine extension',
        description: 'Learn the mechanics of safe backbending. Strengthen back body. Open chest and shoulders. Engage legs.',
        recommendedSessions: ['standing-strong', 'deep-backbend'],
        practiceFrequency: '4 times this week',
        notes: 'Backbends are heart openers. They can bring up emotions. Breathe and allow.',
        isMilestone: true
      },
      {
        weekNumber: 2,
        name: 'Week 2: Cobra and Locust',
        focus: 'Prone backbends',
        description: 'Master Bhujangasana (cobra) and Salabhasana (locust). Build back strength evenly. Learn to protect lower back.',
        recommendedSessions: ['deep-backbend', 'sun-salutation'],
        practiceFrequency: '4-5 times this week',
        notes: 'Keep legs active. Don\'t collapse into lower back. Lengthen before deepening.',
        isMilestone: false
      },
      {
        weekNumber: 3,
        name: 'Week 3: Bridge Pose',
        focus: 'Setu Bandha Sarvangasana',
        description: 'Learn bridge pose mechanics. Strengthen legs and glutes. Open chest and shoulders. Prepare for wheel.',
        recommendedSessions: ['deep-backbend', 'hip-openers'],
        practiceFrequency: '5 times this week',
        notes: 'Bridge is foundational. Press into feet. Lift hips. Roll shoulders under. Breathe into chest.',
        isMilestone: false
      },
      {
        weekNumber: 4,
        name: 'Week 4: Bow Pose',
        focus: 'Dhanurasana',
        description: 'Learn to hold ankles and lift into bow shape. Full body backbend. Requires flexibility and strength.',
        recommendedSessions: ['deep-backbend', 'full-practice'],
        practiceFrequency: '5 times this week',
        notes: 'Bow pose is intense. Start with one leg. Build gradually. Keep breathing.',
        isMilestone: true
      },
      {
        weekNumber: 5,
        name: 'Week 5: Camel Pose',
        focus: 'Ustrasana',
        description: 'Kneeling backbend. Intense heart and throat opening. Can bring up strong emotions. Move slowly.',
        recommendedSessions: ['deep-backbend', 'hip-openers'],
        practiceFrequency: '5 times this week',
        notes: 'Camel opens the heart powerfully. Keep hips over knees. Press into shins. Breathe deeply.',
        isMilestone: false
      },
      {
        weekNumber: 6,
        name: 'Week 6: Wheel Preparation',
        focus: 'Building toward Urdhva Dhanurasana',
        description: 'Prepare for wheel (upward bow). Strengthen arms and shoulders. Open upper back thoroughly.',
        recommendedSessions: ['deep-backbend', 'core-flow'],
        practiceFrequency: '5-6 times this week',
        notes: 'Wheel requires strong arms, open shoulders, flexible spine, and strong legs. Build all.',
        isMilestone: false
      },
      {
        weekNumber: 7,
        name: 'Week 7: First Wheel',
        focus: 'Urdhva Dhanurasana',
        description: 'Attempt full wheel pose. Use props if needed. Learn to press up safely. Breathe in the backbend.',
        recommendedSessions: ['deep-backbend', 'full-practice'],
        practiceFrequency: '5-6 times this week',
        notes: 'Wheel is challenging. Hands shoulder-width, feet hip-width. Press evenly. Breathe. Come down slowly.',
        isMilestone: true
      },
      {
        weekNumber: 8,
        name: 'Week 8: Wheel Refinement',
        focus: 'Deepening and holding',
        description: 'Refine alignment in wheel. Straighten arms. Walk feet in. Hold longer. Build endurance.',
        recommendedSessions: ['deep-backbend', 'full-practice', 'standing-strong'],
        practiceFrequency: '6 times this week',
        notes: 'In wheel, keep legs parallel. Press into hands and feet equally. Breathe into back body.',
        isMilestone: false
      },
      {
        weekNumber: 9,
        name: 'Week 9: Backbend Variations',
        focus: 'Exploring deeper backbends',
        description: 'Explore variations: one-legged wheel, wheel from standing, forearm wheel. Play at your edge.',
        recommendedSessions: ['deep-backbend', 'balance-challenge'],
        practiceFrequency: '6 times this week',
        notes: 'Advanced variations require patience. Warm up thoroughly. Rest adequately between attempts.',
        isMilestone: false
      },
      {
        weekNumber: 10,
        name: 'Week 10: Backbend Endurance',
        focus: 'Multiple rounds and longer holds',
        description: 'Practice multiple rounds of wheel. Hold for longer. Build cardiovascular endurance and mental strength.',
        recommendedSessions: ['deep-backbend', 'full-practice'],
        practiceFrequency: '6 times this week',
        notes: 'Each round gets easier as spine warms. Rest between rounds. Counter with forward bends.',
        isMilestone: false
      },
      {
        weekNumber: 11,
        name: 'Week 11: Dropbacks (Optional)',
        focus: 'Standing to wheel',
        description: 'For those ready: learn to drop back from standing to wheel. Requires confidence, strength, and trust.',
        recommendedSessions: ['deep-backbend', 'balance-challenge'],
        practiceFrequency: '5-6 times this week',
        notes: 'CAUTION: Use wall or spotter initially. Not for everyone. Honor your body. No ego.',
        isMilestone: true
      },
      {
        weekNumber: 12,
        name: 'Week 12: Integration & Balance',
        focus: 'Balanced practice',
        description: 'Balance backbending with forward bends, twists, and rest. Create sustainable practice. Maintain heart opening.',
        recommendedSessions: ['full-practice', 'deep-backbend', 'evening-wind-down'],
        practiceFrequency: '5-6 times this week',
        notes: 'Backbends are powerful. Always counter. Always rest. Always breathe. Keep your heart open.',
        isMilestone: true
      }
    ]
  },
  {
    id: 'restorative-therapeutic-13',
    name: 'Restorative & Therapeutic Practice',
    description: 'A 13-week journey into deep healing and restoration. Perfect for stress relief, chronic conditions, recovery, or anyone seeking profound relaxation. As Iyengar teaches: "The pose removes fatigue and soothes the nerves."',
    style: 'restorative',
    difficulty: 'beginner',
    totalWeeks: 13,
    author: 'Based on restorative yoga principles',
    weeks: [
      {
        weekNumber: 1,
        name: 'Week 1: Introduction to Rest',
        focus: 'Learning to receive support',
        description: 'Begin with fully supported poses. Learn to use props (bolsters, blankets, blocks). Understand that doing less can be more.',
        recommendedSessions: ['sleep-prep', 'gentle-evening'],
        practiceFrequency: '3-4 times this week',
        notes: 'In restorative yoga, the props do the work. Your job is simply to relax and receive.',
        isMilestone: true
      },
      {
        weekNumber: 2,
        name: 'Week 2: Supported Forward Bends',
        focus: 'Calming the nervous system',
        description: 'Forward bends with full support calm the nervous system. Hold poses 5-10 minutes. Allow gravity to work.',
        recommendedSessions: ['sleep-prep', 'evening-wind-down'],
        practiceFrequency: '4-5 times this week',
        notes: 'Use bolsters under torso. Let head rest on something. Surrender to gravity. Breathe softly.',
        isMilestone: false
      },
      {
        weekNumber: 3,
        name: 'Week 3: Supported Backbends',
        focus: 'Gentle heart opening',
        description: 'Supported backbends over bolsters open the heart gently. Encourage deep breathing. Release emotional holding.',
        recommendedSessions: ['gentle-evening', 'sleep-prep'],
        practiceFrequency: '4-5 times this week',
        notes: 'Lie over bolster with support under head. Arms open. Heart lifts gently. Breathe deeply.',
        isMilestone: false
      },
      {
        weekNumber: 4,
        name: 'Week 4: Legs Up the Wall',
        focus: 'Viparita Karani',
        description: 'Master this queen of restorative poses. Drains legs, calms mind, aids sleep. Hold 10-20 minutes.',
        recommendedSessions: ['sleep-prep', 'evening-wind-down'],
        practiceFrequency: '5-6 times this week (daily if possible)',
        notes: 'Place bolster or folded blanket under sacrum. Legs up wall. Arms open. Stay 15-20 minutes.',
        isMilestone: true
      },
      {
        weekNumber: 5,
        name: 'Week 5: Supported Twists',
        focus: 'Gentle detoxification',
        description: 'Supported twists release spinal tension without strain. Aid digestion. Calm and center.',
        recommendedSessions: ['evening-wind-down', 'sleep-prep'],
        practiceFrequency: '5 times this week',
        notes: 'Lie on side with bolster between knees. Support head. Gentle twist. Hold 5-10 minutes each side.',
        isMilestone: false
      },
      {
        weekNumber: 6,
        name: 'Week 6: Hip Opening',
        focus: 'Supported hip releases',
        description: 'Supported Baddha Konasana, Supta Baddha Konasana. Release hip and groin tension. Highly therapeutic.',
        recommendedSessions: ['hip-openers', 'sleep-prep'],
        practiceFrequency: '5 times this week',
        notes: 'Support knees with blocks or blankets. Never force hips open. Let gravity and time do the work.',
        isMilestone: false
      },
      {
        weekNumber: 7,
        name: 'Week 7: Restorative Inversions',
        focus: 'Supported shoulderstand',
        description: 'Gentle inversions with full support. All benefits, no strain. Calms nervous system profoundly.',
        recommendedSessions: ['sleep-prep', 'evening-wind-down'],
        practiceFrequency: '5-6 times this week',
        notes: 'Use blankets under shoulders, wall for support. Stay supported. Never strain neck.',
        isMilestone: true
      },
      {
        weekNumber: 8,
        name: 'Week 8: Savasana Mastery',
        focus: 'The art of conscious relaxation',
        description: 'Learn to truly rest in corpse pose. Use props for complete support. Practice body scan and release.',
        recommendedSessions: ['sleep-prep', 'gentle-evening'],
        practiceFrequency: '6-7 times this week',
        notes: 'Support head, knees, arms. Cover with blanket. Stay 15-20 minutes. This is the most important pose.',
        isMilestone: false
      },
      {
        weekNumber: 9,
        name: 'Week 9: Restorative Breathing',
        focus: 'Breath awareness in stillness',
        description: 'Combine restorative poses with gentle pranayama. Extend exhalations. Find profound calm.',
        recommendedSessions: ['sleep-prep', 'evening-wind-down'],
        practiceFrequency: '6 times this week',
        notes: 'In supported poses, count breath. Extend exhale gradually. Let breath deepen naturally.',
        isMilestone: false
      },
      {
        weekNumber: 10,
        name: 'Week 10: Yoga Nidra',
        focus: 'Yogic sleep',
        description: 'Learn guided yoga nidra practice. Conscious relaxation that restores like hours of sleep.',
        recommendedSessions: ['sleep-prep', 'gentle-evening'],
        practiceFrequency: '6-7 times this week',
        notes: 'Lie in supported savasana. Follow guided relaxation. Stay on the edge of sleep. Deeply restorative.',
        isMilestone: true
      },
      {
        weekNumber: 11,
        name: 'Week 11: Self-Care Sequences',
        focus: 'Creating personal practice',
        description: 'Learn to create restorative sequences for specific needs: anxiety, insomnia, fatigue, pain.',
        recommendedSessions: ['sleep-prep', 'evening-wind-down', 'gentle-evening'],
        practiceFrequency: '6-7 times this week',
        notes: 'Choose 3-5 poses that address your needs. Hold each 5-15 minutes. Practice daily.',
        isMilestone: false
      },
      {
        weekNumber: 12,
        name: 'Week 12: Therapeutic Applications',
        focus: 'Healing specific conditions',
        description: 'Apply restorative yoga therapeutically: back pain, headaches, digestive issues, stress, insomnia.',
        recommendedSessions: ['sleep-prep', 'gentle-evening', 'evening-wind-down'],
        practiceFrequency: '6-7 times this week',
        notes: 'Restorative yoga is medicine. Regular practice heals. Use props. Stay supported. Surrender.',
        isMilestone: false
      },
      {
        weekNumber: 13,
        name: 'Week 13: Rest as Practice',
        focus: 'Integrating rest into daily life',
        description: 'Understand that rest is not laziness but essential practice. Create sustainable self-care routine.',
        recommendedSessions: ['sleep-prep', 'gentle-evening', 'evening-wind-down'],
        practiceFrequency: '7 times this week (daily practice)',
        notes: 'In our culture of "doing," rest is revolutionary. You have learned to rest consciously. This is profound.',
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
