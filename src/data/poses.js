// Enhanced yoga poses with detailed information
import { posesExtended } from './poses_extended.js';

export const poses = [
  {
    id: 'mountain-pose',
    emoji: '🏔️',
    nameEnglish: 'Mountain Pose',
    nameSanskrit: 'Tadasana',
    category: 'standing',
    difficulty: 'beginner',
    duration: 30,
    imageUrl: '/src/assets/poses/mountain-pose.svg',
    description: 'The foundation of all standing poses, Mountain Pose teaches us how to ground ourselves and find our center. Though it appears simple, this pose is actively engaging every muscle.',
    instructions: [
      'Stand with feet hip-width apart, parallel to each other',
      'Spread your toes and press evenly through all four corners of your feet',
      'Engage your thigh muscles and draw them upward',
      'Lengthen your tailbone toward the floor',
      'Draw your belly button gently toward your spine',
      'Roll your shoulders back and down, opening your chest',
      'Let your arms hang naturally with palms facing forward',
      'Lengthen through the crown of your head',
      'Soften your gaze and breathe steadily'
    ],
    benefits: [
      'Improves posture and body awareness',
      'Strengthens thighs, knees, and ankles',
      'Increases focus and concentration',
      'Reduces flat feet',
      'Relieves sciatica',
      'Firms abdomen and buttocks'
    ],
    tips: [
      'Imagine a string pulling you up from the crown of your head',
      'Distribute weight evenly between both feet',
      'Keep a micro-bend in your knees to avoid locking',
      'Practice against a wall to feel proper alignment'
    ],
    commonMistakes: [
      'Locking the knees completely',
      'Arching the lower back excessively',
      'Tensing the shoulders up toward ears',
      'Leaning weight forward or backward'
    ],
    modifications: {
      beginner: 'Stand with back against a wall for support',
      advanced: 'Close eyes to challenge balance',
      pregnancy: 'Widen stance for better stability'
    },
    breathingCues: 'Breathe naturally, focusing on lengthening spine on inhale'
  },
  {
    id: 'downward-dog',
    emoji: '🐕',
    nameEnglish: 'Downward-Facing Dog',
    nameSanskrit: 'Adho Mukha Svanasana',
    category: 'standing',
    difficulty: 'beginner',
    duration: 45,
    imageUrl: '/src/assets/poses/downward-dog.svg',
    description: 'One of the most recognized yoga poses, Downward Dog is both energizing and restorative. It creates length through the entire back body while building strength in the arms and shoulders.',
    instructions: [
      'Start on hands and knees in table top position',
      'Spread fingers wide, middle finger pointing forward',
      'Tuck toes under and lift knees off the floor',
      'Send hips up and back, creating an inverted V shape',
      'Straighten legs as much as comfortable',
      'Press hands firmly into mat, rotating upper arms outward',
      'Keep head between arms, ears aligned with upper arms',
      'Pedal feet to warm up hamstrings if needed',
      'Hold and breathe deeply'
    ],
    benefits: [
      'Stretches shoulders, hamstrings, calves, and hands',
      'Strengthens arms, shoulders, and legs',
      'Improves digestion',
      'Relieves headache and fatigue',
      'Calms the brain and relieves stress',
      'Energizes the body'
    ],
    tips: [
      'Focus on creating length in spine rather than straight legs',
      'Bend knees generously if hamstrings are tight',
      'Press through knuckles to protect wrists',
      'Draw shoulder blades toward tailbone'
    ],
    commonMistakes: [
      'Dumping weight into wrists',
      'Rounding the spine',
      'Head hanging heavily',
      'Feet too close or far from hands'
    ],
    modifications: {
      beginner: 'Keep knees bent, focus on spine length',
      advanced: 'Lift one leg up for Three-Legged Dog',
      wrists: 'Use blocks under hands or make fists'
    },
    breathingCues: 'Deep ujjayi breathing, focus on long exhales'
  },
  {
    id: 'warrior-one',
    emoji: '⚔️',
    nameEnglish: 'Warrior I',
    nameSanskrit: 'Virabhadrasana I',
    category: 'standing',
    difficulty: 'beginner',
    duration: 30,
    requiresBothSides: true,
    imageUrl: '/src/assets/poses/warrior-one.svg',
    description: 'A powerful standing pose that builds focus, power, and stability. Warrior I creates a strong foundation while opening the chest and hips.',
    instructions: [
      'From Mountain Pose, step left foot back 3-4 feet',
      'Turn left foot out 45-60 degrees',
      'Bend right knee directly over ankle, thigh parallel to floor if possible',
      'Square hips toward front of mat',
      'Ground through outer edge of back foot',
      'Inhale and raise arms overhead, palms facing each other',
      'Lift through the sides of the waist',
      'Gaze forward or up at thumbs',
      'Hold for 5-10 breaths, then switch sides'
    ],
    benefits: [
      'Strengthens shoulders, arms, legs, ankles, and back',
      'Opens hips, chest, and lungs',
      'Develops concentration and balance',
      'Improves circulation and respiration',
      'Energizes entire body',
      'Builds stamina'
    ],
    tips: [
      'Keep front knee tracking over middle toe',
      'Press through outer edge of back foot',
      'Draw front hip back and back hip forward',
      'Relax shoulders away from ears'
    ],
    commonMistakes: [
      'Front knee collapsing inward',
      'Back foot not grounded',
      'Arching lower back excessively',
      'Shoulders tensed up'
    ],
    modifications: {
      beginner: 'Shorten stance or keep back heel lifted',
      advanced: 'Interlace fingers behind back for shoulder opener',
      knees: 'Don\'t bend front knee as deeply'
    },
    breathingCues: 'Inhale to lift arms, exhale to deepen front knee'
  },
  {
    id: 'warrior-two',
    emoji: '💪',
    nameEnglish: 'Warrior II',
    nameSanskrit: 'Virabhadrasana II',
    category: 'standing',
    difficulty: 'beginner',
    duration: 30,
    requiresBothSides: true,
    imageUrl: '/src/assets/poses/warrior-two.svg',
    description: 'A pose of strength and grace, Warrior II cultivates concentration while strengthening the legs and opening the hips. It teaches us to stay centered even in challenge.',
    instructions: [
      'From Mountain Pose, step feet 3-4 feet apart',
      'Turn right foot out 90 degrees',
      'Turn left foot slightly inward',
      'Align right heel with left arch',
      'Bend right knee over ankle, thigh parallel to floor',
      'Extend arms out to sides at shoulder height',
      'Turn head to gaze over right fingertips',
      'Keep torso upright and centered',
      'Hold for 5-10 breaths, then switch sides'
    ],
    benefits: [
      'Strengthens and stretches legs and ankles',
      'Opens hips, groin, and chest',
      'Increases stamina and endurance',
      'Relieves backaches',
      'Stimulates abdominal organs',
      'Develops concentration'
    ],
    tips: [
      'Keep arms active, reaching through fingertips',
      'Stack shoulders over hips',
      'Press through outer edge of back foot',
      'Soften face and jaw while holding'
    ],
    commonMistakes: [
      'Leaning torso toward front leg',
      'Front knee beyond ankle',
      'Dropping arms below shoulder height',
      'Back foot lifting off mat'
    ],
    modifications: {
      beginner: 'Shorten stance or don\'t bend knee as deeply',
      advanced: 'Add gentle backbend in upper spine',
      pregnancy: 'Widen stance for stability'
    },
    breathingCues: 'Steady breath, exhale to deepen the pose'
  },
  {
    id: 'tree-pose',
    emoji: '🌳',
    nameEnglish: 'Tree Pose',
    nameSanskrit: 'Vrksasana',
    category: 'balance',
    difficulty: 'beginner',
    duration: 30,
    requiresBothSides: true,
    imageUrl: '/src/assets/poses/tree-pose.svg',
    description: 'Tree Pose teaches us to find balance and grace while remaining grounded. It strengthens the legs while opening the hips and improving focus.',
    instructions: [
      'Begin in Mountain Pose',
      'Shift weight onto left foot, grounding through all four corners',
      'Bend right knee and place right foot on inner left thigh or calf',
      'Avoid placing foot directly on knee',
      'Press foot and leg into each other',
      'Bring palms together at heart center',
      'Option to raise arms overhead like branches',
      'Find a focal point (drishti) to help with balance',
      'Hold for 5-10 breaths, then switch sides'
    ],
    benefits: [
      'Improves balance and stability',
      'Strengthens thighs, calves, ankles, and spine',
      'Stretches groin and inner thighs',
      'Opens hips and chest',
      'Calms and focuses the mind',
      'Builds confidence'
    ],
    tips: [
      'Start with toes on ground and heel on ankle',
      'Use a wall for support when learning',
      'Engage standing leg without locking knee',
      'Think of growing roots and branches'
    ],
    commonMistakes: [
      'Placing foot on knee joint',
      'Hip of lifted leg jutting out',
      'Collapsing into standing hip',
      'Holding breath'
    ],
    modifications: {
      beginner: 'Keep toes on floor, heel against ankle',
      advanced: 'Close eyes or add arm variations',
      balance: 'Practice near wall for support'
    },
    breathingCues: 'Steady breath helps steady balance'
  },
  {
    id: 'triangle-pose',
    emoji: '🔺',
    nameEnglish: 'Triangle Pose',
    nameSanskrit: 'Trikonasana',
    category: 'standing',
    difficulty: 'beginner',
    duration: 30,
    requiresBothSides: true,
    imageUrl: '/src/assets/poses/triangle-pose.svg',
    description: 'Triangle Pose is a standing pose that stretches and strengthens the entire body. It improves digestion and relieves stress while building core strength.',
    instructions: [
      'Stand with feet 3-4 feet apart',
      'Turn right foot out 90 degrees, left foot slightly in',
      'Extend arms parallel to floor',
      'Shift hips toward left as you reach right hand forward',
      'Lower right hand to shin, ankle, or floor',
      'Extend left arm straight up toward ceiling',
      'Turn gaze up toward left hand',
      'Keep both legs straight and strong',
      'Hold for 5-10 breaths, then switch sides'
    ],
    benefits: [
      'Stretches and strengthens thighs, knees, and ankles',
      'Opens hips, groin, and hamstrings',
      'Stimulates abdominal organs',
      'Relieves stress and improves digestion',
      'Improves balance and stability',
      'Stretches spine and chest'
    ],
    tips: [
      'Think of body in one plane, as if between two walls',
      'Use a block under bottom hand if needed',
      'Keep both sides of torso equally long',
      'Engage quadriceps to protect knees'
    ],
    commonMistakes: [
      'Collapsing into bottom side',
      'Bending front knee',
      'Dropping forward instead of sideways',
      'Forcing hand to floor'
    ],
    modifications: {
      beginner: 'Place hand on shin or block',
      advanced: 'Bind top arm behind back',
      tight: 'Shorten stance slightly'
    },
    breathingCues: 'Inhale to lengthen spine, exhale to deepen twist'
  },
  {
    id: 'child-pose',
    emoji: '🧘',
    nameEnglish: 'Child\'s Pose',
    nameSanskrit: 'Balasana',
    category: 'seated',
    difficulty: 'beginner',
    duration: 60,
    imageUrl: '/src/assets/poses/child-pose.svg',
    description: 'A restful pose that can be used anytime you need a break. Child\'s Pose gently stretches the body while calming the mind and relieving stress.',
    instructions: [
      'Kneel on the floor with big toes touching',
      'Separate knees hip-width apart or wider',
      'Exhale and fold forward from the hips',
      'Rest forehead on the floor',
      'Extend arms forward or rest them alongside body',
      'Release shoulders toward the floor',
      'Rest here for 30 seconds to several minutes',
      'To come up, walk hands back toward knees'
    ],
    benefits: [
      'Gently stretches hips, thighs, and ankles',
      'Calms the brain and relieves stress',
      'Relieves back and neck pain',
      'Helps digestion',
      'Reduces fatigue',
      'Quiets the mind'
    ],
    tips: [
      'Place blanket under knees for comfort',
      'Use bolster lengthwise under torso for support',
      'Turn head to one side if forehead doesn\'t reach floor',
      'Breathe into the back body'
    ],
    commonMistakes: [
      'Forcing forehead to floor',
      'Tensing shoulders and neck',
      'Not breathing deeply',
      'Knees too close together'
    ],
    modifications: {
      beginner: 'Place pillow under forehead or between thighs and calves',
      pregnancy: 'Widen knees to make room for belly',
      shoulders: 'Keep arms alongside body instead of extended'
    },
    breathingCues: 'Deep belly breathing, feeling back expand'
  },
  {
    id: 'cat-cow',
    emoji: '🐱',
    nameEnglish: 'Cat-Cow Stretch',
    nameSanskrit: 'Marjaryasana-Bitilasana',
    category: 'flexibility',
    difficulty: 'beginner',
    duration: 45,
    imageUrl: '/src/assets/poses/cat-cow.svg',
    description: 'A gentle flow between two poses that warms up the body and brings flexibility to the spine. This movement coordinates breath and movement.',
    instructions: [
      'Start on hands and knees in tabletop position',
      'Stack shoulders over wrists, hips over knees',
      'Inhale: Drop belly, lift chest and tailbone (Cow)',
      'Exhale: Round spine toward ceiling, tuck chin (Cat)',
      'Continue flowing between poses for 5-10 breaths',
      'Move slowly with awareness',
      'Let breath guide the movement'
    ],
    benefits: [
      'Improves spine flexibility',
      'Stretches neck, back, and torso',
      'Massages internal organs',
      'Relieves stress and calms mind',
      'Improves posture and balance',
      'Coordinates breath and movement'
    ],
    tips: [
      'Initiate movement from tailbone',
      'Keep arms straight but not locked',
      'Move slowly and mindfully',
      'Close eyes to feel the movement'
    ],
    commonMistakes: [
      'Moving too quickly',
      'Forcing the back arch',
      'Holding breath',
      'Collapsing into wrists'
    ],
    modifications: {
      beginner: 'Smaller movements, focus on breath',
      wrists: 'Make fists or use forearms',
      knees: 'Place blanket under knees'
    },
    breathingCues: 'Inhale for Cow, Exhale for Cat'
  },
  {
    id: 'cobra-pose',
    emoji: '🐍',
    nameEnglish: 'Cobra Pose',
    nameSanskrit: 'Bhujangasana',
    category: 'backbend',
    difficulty: 'beginner',
    duration: 30,
    imageUrl: '/src/assets/poses/cobra-pose.svg',
    description: 'A gentle backbend that strengthens the spine and opens the chest. Cobra pose is energizing and helps improve posture.',
    instructions: [
      'Lie face down with legs extended',
      'Place hands under shoulders, elbows close to body',
      'Press tops of feet and thighs into floor',
      'On inhale, straighten arms to lift chest',
      'Keep slight bend in elbows',
      'Draw shoulders back and down',
      'Lift through sternum, not by pushing hands',
      'Gaze forward or slightly up',
      'Hold for 15-30 seconds'
    ],
    benefits: [
      'Strengthens spine and back muscles',
      'Stretches chest, lungs, shoulders, and abdomen',
      'Improves posture',
      'Stimulates abdominal organs',
      'Opens the heart',
      'Relieves stress and fatigue'
    ],
    tips: [
      'Use back muscles more than arms',
      'Keep pubic bone grounded',
      'Distribute backbend through entire spine',
      'Start with Baby Cobra (lower height)'
    ],
    commonMistakes: [
      'Pushing too hard with arms',
      'Crunching lower back',
      'Elbows splaying out',
      'Lifting too high too fast'
    ],
    modifications: {
      beginner: 'Keep forearms on ground (Sphinx pose)',
      advanced: 'Straighten arms fully for Upward Dog',
      back: 'Reduce height of lift'
    },
    breathingCues: 'Inhale to lift, exhale to release'
  },
  {
    id: 'bridge-pose',
    emoji: '🌉',
    nameEnglish: 'Bridge Pose',
    nameSanskrit: 'Setu Bandha Sarvangasana',
    category: 'backbend',
    difficulty: 'beginner',
    duration: 45,
    imageUrl: '/src/assets/poses/bridge-pose.svg',
    description: 'Bridge Pose is an energizing backbend that opens the chest and strengthens the legs and glutes. It\'s both calming and rejuvenating.',
    instructions: [
      'Lie on back with knees bent, feet hip-width apart',
      'Place feet flat on floor, close to sitting bones',
      'Arms alongside body, palms down',
      'Press feet and arms into floor',
      'Exhale and lift hips toward ceiling',
      'Roll shoulders under, clasp hands if comfortable',
      'Keep thighs and feet parallel',
      'Lift chin slightly away from sternum',
      'Hold for 30-60 seconds'
    ],
    benefits: [
      'Stretches chest, neck, and spine',
      'Strengthens back, glutes, and hamstrings',
      'Improves digestion',
      'Reduces anxiety and fatigue',
      'Rejuvenates tired legs',
      'Opens heart and lungs'
    ],
    tips: [
      'Press evenly through all four corners of feet',
      'Keep knees directly over ankles',
      'Engage inner thighs to keep knees from splaying',
      'Place block under sacrum for supported version'
    ],
    commonMistakes: [
      'Knees splaying outward',
      'Pushing from belly instead of legs',
      'Tensing buttocks too much',
      'Feet too far from body'
    ],
    modifications: {
      beginner: 'Keep arms on floor for stability',
      advanced: 'Lift one leg for one-legged bridge',
      restorative: 'Place block under sacrum'
    },
    breathingCues: 'Exhale to lift, steady breath while holding'
  },
  {
    id: 'seated-forward-fold',
    emoji: '🙇',
    nameEnglish: 'Seated Forward Fold',
    nameSanskrit: 'Paschimottanasana',
    category: 'seated',
    difficulty: 'beginner',
    duration: 60,
    imageUrl: '/src/assets/poses/seated-forward-fold.svg',
    description: 'A calming forward fold that stretches the entire back body. This pose helps quiet the mind and relieve stress while improving flexibility.',
    instructions: [
      'Sit with legs extended straight in front',
      'Flex feet and engage thigh muscles',
      'Inhale and raise arms overhead',
      'Exhale and hinge forward from hips',
      'Reach for shins, ankles, or feet',
      'Keep spine long rather than rounding',
      'Rest forehead toward legs if flexible',
      'Hold for 1-3 minutes'
    ],
    benefits: [
      'Stretches spine, shoulders, and hamstrings',
      'Calms the brain and relieves stress',
      'Improves digestion',
      'Soothes headache and reduces fatigue',
      'Helps relieve symptoms of menopause',
      'Therapeutic for high blood pressure'
    ],
    tips: [
      'Use strap around feet if needed',
      'Sit on folded blanket to tilt pelvis forward',
      'Focus on lengthening rather than reaching',
      'Keep breath smooth and steady'
    ],
    commonMistakes: [
      'Rounding the back excessively',
      'Forcing the stretch',
      'Holding breath',
      'Pulling with arms instead of folding from hips'
    ],
    modifications: {
      beginner: 'Bend knees slightly or use strap',
      tight: 'Sit on blanket, use blocks under knees',
      advanced: 'Clasp wrist beyond feet'
    },
    breathingCues: 'Inhale to lengthen, exhale to deepen fold'
  },
  {
    id: 'corpse-pose',
    emoji: '😌',
    nameEnglish: 'Corpse Pose',
    nameSanskrit: 'Savasana',
    category: 'restorative',
    difficulty: 'beginner',
    duration: 180,
    imageUrl: '/src/assets/poses/corpse-pose.svg',
    description: 'The most important pose in yoga, Savasana allows the body to absorb the benefits of practice. Though it looks easy, true relaxation can be challenging.',
    instructions: [
      'Lie flat on back with legs extended',
      'Let feet fall open naturally',
      'Place arms alongside body, palms facing up',
      'Tuck shoulder blades under for comfort',
      'Close eyes gently',
      'Release all muscular effort',
      'Let breath flow naturally',
      'Rest for 5-15 minutes',
      'To exit, deepen breath and wiggle fingers and toes'
    ],
    benefits: [
      'Calms the brain and relieves stress',
      'Relaxes the entire body',
      'Reduces headache, fatigue, and insomnia',
      'Lowers blood pressure',
      'Integrates benefits of practice',
      'Promotes healing and renewal'
    ],
    tips: [
      'Place blanket under head for comfort',
      'Cover yourself if you get cold',
      'Put bolster under knees for lower back',
      'Set a gentle timer if worried about time'
    ],
    commonMistakes: [
      'Trying too hard to relax',
      'Falling asleep completely',
      'Getting frustrated with thoughts',
      'Rushing out of the pose'
    ],
    modifications: {
      beginner: 'Bend knees with feet on floor',
      pregnancy: 'Lie on left side with props',
      anxiety: 'Place weight on belly or chest'
    },
    breathingCues: 'Natural breathing, no control needed'
  },
  {
    id: 'plank-pose',
    emoji: '🏋️',
    nameEnglish: 'Plank Pose',
    nameSanskrit: 'Phalakasana',
    category: 'core',
    difficulty: 'beginner',
    duration: 30,
    imageUrl: '/src/assets/poses/plank-pose.svg',
    description: 'A foundational strength-building pose that engages the entire body. Plank builds core stability, arm strength, and mental endurance.',
    instructions: [
      'Start on hands and knees in tabletop position',
      'Step feet back one at a time, creating a straight line',
      'Stack shoulders directly over wrists',
      'Engage core by drawing navel toward spine',
      'Press through heels and crown of head',
      'Keep neck neutral, gaze slightly forward',
      'Engage thighs and press heels back',
      'Hold for 20-30 seconds initially',
      'Lower knees to release'
    ],
    benefits: [
      'Strengthens core, arms, and shoulders',
      'Builds full-body stability',
      'Improves posture',
      'Tones abdominal muscles',
      'Strengthens spine',
      'Builds mental focus and endurance'
    ],
    tips: [
      'Keep hips level with shoulders',
      'Don\'t let lower back sag',
      'Distribute weight evenly through hands',
      'Breathe steadily throughout'
    ],
    commonMistakes: [
      'Hips sagging or piking up',
      'Shoulders collapsing forward',
      'Head dropping down',
      'Holding breath'
    ],
    modifications: {
      beginner: 'Keep knees on floor for modified plank',
      advanced: 'Lift one leg for added challenge',
      wrists: 'Come down to forearms for forearm plank'
    },
    breathingCues: 'Steady breathing, exhale to engage core'
  },
  {
    id: 'extended-side-angle',
    emoji: '🔷',
    nameEnglish: 'Extended Side Angle',
    nameSanskrit: 'Utthita Parsvakonasana',
    category: 'standing',
    difficulty: 'intermediate',
    duration: 30,
    requiresBothSides: true,
    imageUrl: '/src/assets/poses/extended-side-angle.svg',
    description: 'A powerful standing pose that stretches the entire side body while building leg strength. Creates length and opening from heel to fingertips.',
    instructions: [
      'Start in Warrior II with right knee bent',
      'Place right forearm on right thigh',
      'Extend left arm overhead toward front of mat',
      'Create one long line from left heel to left fingertips',
      'Keep chest open toward ceiling',
      'Press into outer edge of back foot',
      'Draw front hip back, back hip forward',
      'Hold for 5-8 breaths',
      'Switch sides'
    ],
    benefits: [
      'Stretches side body, groin, and hamstrings',
      'Strengthens legs, knees, and ankles',
      'Opens chest and shoulders',
      'Improves stamina',
      'Stimulates abdominal organs',
      'Increases lung capacity'
    ],
    tips: [
      'Keep front knee tracking over middle toe',
      'Reach through top arm to create length',
      'Use block under bottom hand if needed',
      'Keep gaze forward if neck is uncomfortable'
    ],
    commonMistakes: [
      'Collapsing into bottom side',
      'Front knee beyond ankle',
      'Chest facing downward',
      'Back foot lifting off mat'
    ],
    modifications: {
      beginner: 'Keep forearm on thigh, shorten stance',
      advanced: 'Place bottom hand flat on floor outside foot',
      balance: 'Practice near wall for support'
    },
    breathingCues: 'Inhale to lengthen, exhale to deepen'
  },
  {
    id: 'pyramid-pose',
    emoji: '🔺',
    nameEnglish: 'Pyramid Pose',
    nameSanskrit: 'Parsvottanasana',
    category: 'standing',
    difficulty: 'intermediate',
    duration: 30,
    requiresBothSides: true,
    imageUrl: '/src/assets/poses/pyramid-pose.svg',
    description: 'An intense hamstring stretch that also improves balance and calms the mind. Pyramid pose teaches patience and alignment.',
    instructions: [
      'Stand with feet 3 feet apart',
      'Turn right foot forward, left foot 45 degrees',
      'Square hips toward front of mat',
      'Place hands on hips',
      'Inhale and lengthen spine',
      'Exhale and fold forward over front leg',
      'Keep back flat, hinge from hips',
      'Hands to floor, blocks, or shins',
      'Hold for 5-8 breaths, switch sides'
    ],
    benefits: [
      'Deeply stretches hamstrings and hips',
      'Strengthens legs and spine',
      'Improves balance and posture',
      'Calms the mind',
      'Stimulates abdominal organs',
      'Improves digestion'
    ],
    tips: [
      'Keep hips level and squared',
      'Use blocks under hands if needed',
      'Micro-bend in front knee to protect hamstring',
      'Focus on lengthening spine more than depth'
    ],
    commonMistakes: [
      'Rounding the spine',
      'Hips not squared',
      'Locking front knee',
      'Weight too far forward'
    ],
    modifications: {
      beginner: 'Hands on blocks or front thigh',
      tight: 'Shorten stance considerably',
      advanced: 'Hands in prayer behind back'
    },
    breathingCues: 'Inhale lengthen, exhale fold deeper'
  },
  {
    id: 'pigeon-pose',
    emoji: '🕊️',
    nameEnglish: 'Pigeon Pose',
    nameSanskrit: 'Eka Pada Rajakapotasana',
    category: 'seated',
    difficulty: 'intermediate',
    duration: 60,
    requiresBothSides: true,
    imageUrl: '/src/assets/poses/pigeon-pose.svg',
    description: 'A deep hip opener that releases tension stored in the hips. Often emotional, this pose teaches surrender and patience.',
    instructions: [
      'From Downward Dog, bring right knee forward',
      'Place right knee behind right wrist',
      'Angle right shin across mat',
      'Extend left leg straight back',
      'Square hips toward front of mat',
      'Walk hands forward to fold over front leg',
      'Rest forehead on hands or mat',
      'Hold for 1-2 minutes',
      'Switch sides slowly'
    ],
    benefits: [
      'Deeply opens hips and hip flexors',
      'Stretches glutes and piriformis',
      'Releases lower back tension',
      'Calms nervous system',
      'Helps process emotions',
      'Prepares for deeper backbends'
    ],
    tips: [
      'Use blanket under front hip for support',
      'Keep hips level with props',
      'Don\'t force the opening',
      'Breathe into any sensations'
    ],
    commonMistakes: [
      'Front hip not supported',
      'Back knee twisted',
      'Forcing hip to open',
      'Holding breath through discomfort'
    ],
    modifications: {
      beginner: 'Keep front shin more parallel to back of mat',
      tight: 'Place folded blanket under front hip',
      advanced: 'Walk front foot farther forward'
    },
    breathingCues: 'Long, slow breaths into hips'
  },
  {
    id: 'happy-baby',
    emoji: '👶',
    nameEnglish: 'Happy Baby',
    nameSanskrit: 'Ananda Balasana',
    category: 'seated',
    difficulty: 'beginner',
    duration: 45,
    imageUrl: '/src/assets/poses/happy-baby.svg',
    description: 'A playful, calming pose that gently opens the hips and releases the lower back. Often brings a smile to practitioners.',
    instructions: [
      'Lie on back and draw knees toward chest',
      'Grab outside edges of feet with hands',
      'Bring knees toward armpits',
      'Stack ankles over knees',
      'Gently press feet into hands',
      'Keep lower back grounded on mat',
      'Rock gently side to side if desired',
      'Hold for 30-60 seconds',
      'Release feet slowly'
    ],
    benefits: [
      'Opens hips and inner thighs',
      'Releases lower back tension',
      'Calms the mind',
      'Relieves stress and fatigue',
      'Gently stretches hamstrings',
      'Brings playfulness to practice'
    ],
    tips: [
      'Keep shoulders relaxed on mat',
      'Use strap around feet if can\'t reach',
      'Gentle rocking massages spine',
      'Smile and breathe'
    ],
    commonMistakes: [
      'Straining neck to lift head',
      'Lower back arching off mat',
      'Pulling too aggressively',
      'Knees too wide or narrow'
    ],
    modifications: {
      beginner: 'Hold behind thighs instead of feet',
      tight: 'Use yoga strap around feet',
      advanced: 'Straighten legs toward ceiling'
    },
    breathingCues: 'Deep belly breathing, relax and soften'
  },
  {
    id: 'eagle-pose',
    emoji: '🦅',
    nameEnglish: 'Eagle Pose',
    nameSanskrit: 'Garudasana',
    category: 'balance',
    difficulty: 'intermediate',
    duration: 30,
    requiresBothSides: true,
    imageUrl: '/src/assets/poses/eagle-pose.svg',
    description: 'A challenging balance pose that wraps and stretches the shoulders and outer hips. Builds focus and coordination.',
    instructions: [
      'Stand in Mountain Pose',
      'Bend knees slightly and lift left foot',
      'Cross left thigh over right thigh',
      'Hook left foot behind right calf if possible',
      'Extend arms forward, cross right over left',
      'Bend elbows and bring palms to touch',
      'Lift elbows to shoulder height',
      'Sink deeper into standing leg',
      'Hold 5-8 breaths, switch sides'
    ],
    benefits: [
      'Improves balance and focus',
      'Stretches shoulders and upper back',
      'Opens hips and outer thighs',
      'Strengthens ankles and calves',
      'Improves concentration',
      'Builds leg strength'
    ],
    tips: [
      'Focus gaze on one point',
      'Sit deeper for more intensity',
      'Keep spine long',
      'Use wall for balance support'
    ],
    commonMistakes: [
      'Leaning too far forward',
      'Not sitting deep enough',
      'Arms not lifted',
      'Holding breath'
    ],
    modifications: {
      beginner: 'Keep toes of lifted leg on floor',
      balance: 'Practice near wall',
      advanced: 'Fold forward over legs'
    },
    breathingCues: 'Steady breath helps steady balance'
  },
  {
    id: 'half-moon',
    emoji: '🌓',
    nameEnglish: 'Half Moon',
    nameSanskrit: 'Ardha Chandrasana',
    category: 'balance',
    difficulty: 'advanced',
    duration: 30,
    requiresBothSides: true,
    imageUrl: '/src/assets/poses/half-moon.svg',
    description: 'An advanced balancing pose that builds strength, flexibility, and concentration. Creates a crescent moon shape with the body.',
    instructions: [
      'From Triangle Pose, bend front knee',
      'Place front hand 6-12 inches forward',
      'Step back foot slightly forward',
      'Straighten front leg as you lift back leg',
      'Raise back leg parallel to floor',
      'Stack hips and shoulders',
      'Extend top arm toward ceiling',
      'Gaze up at top hand',
      'Hold 5-8 breaths, switch sides'
    ],
    benefits: [
      'Improves balance and coordination',
      'Strengthens legs, ankles, and core',
      'Stretches hamstrings and hips',
      'Opens chest and shoulders',
      'Improves focus',
      'Builds confidence'
    ],
    tips: [
      'Use block under bottom hand',
      'Keep standing leg micro-bent',
      'Press through lifted heel',
      'Practice against wall first'
    ],
    commonMistakes: [
      'Hips not stacked',
      'Lifted leg too low',
      'Chest facing downward',
      'Standing leg locked'
    ],
    modifications: {
      beginner: 'Use block under hand, practice at wall',
      balance: 'Keep lower hand on block',
      advanced: 'Bind arm behind back'
    },
    breathingCues: 'Long steady breaths for stability'
  },
  {
    id: 'boat-pose',
    emoji: '🚣',
    nameEnglish: 'Boat Pose',
    nameSanskrit: 'Navasana',
    category: 'core',
    difficulty: 'intermediate',
    duration: 30,
    imageUrl: '/src/assets/poses/boat-pose.svg',
    description: 'A powerful core-strengthening pose that builds abdominal strength and hip flexor flexibility. Challenges both body and mind.',
    instructions: [
      'Sit with knees bent, feet flat on floor',
      'Place hands behind thighs',
      'Lean back slightly and lift chest',
      'Engage core and lift feet off floor',
      'Straighten legs to create V shape',
      'Extend arms parallel to floor',
      'Keep chest lifted, gaze forward',
      'Hold for 10-30 seconds',
      'Rest and repeat 2-3 times'
    ],
    benefits: [
      'Strengthens core and hip flexors',
      'Improves balance and stability',
      'Stimulates digestive organs',
      'Builds mental focus',
      'Strengthens spine',
      'Tones abdominal muscles'
    ],
    tips: [
      'Focus on lifting chest, not rounding',
      'Keep spine straight',
      'Start with knees bent',
      'Breathe steadily throughout'
    ],
    commonMistakes: [
      'Rounding the back',
      'Holding breath',
      'Shoulders tensing up',
      'Leaning too far back'
    ],
    modifications: {
      beginner: 'Keep knees bent, hold behind thighs',
      core: 'Practice with knees bent until stronger',
      advanced: 'Lower and lift several times'
    },
    breathingCues: 'Exhale to engage core, steady breath'
  },
  {
    id: 'supine-twist',
    emoji: '🌀',
    nameEnglish: 'Supine Twist',
    nameSanskrit: 'Supta Matsyendrasana',
    category: 'seated',
    difficulty: 'beginner',
    duration: 45,
    requiresBothSides: true,
    imageUrl: '/src/assets/poses/supine-twist.svg',
    description: 'A gentle restorative twist that releases the spine and hips. Perfect for ending practice or before bed.',
    instructions: [
      'Lie on back with knees bent',
      'Draw right knee toward chest',
      'Guide right knee across body to left',
      'Extend right arm out to side',
      'Turn head to gaze at right hand',
      'Keep right shoulder grounded',
      'Hold for 1-2 minutes',
      'Return to center slowly',
      'Repeat on other side'
    ],
    benefits: [
      'Releases spine and lower back',
      'Stretches chest and shoulders',
      'Massages internal organs',
      'Aids digestion',
      'Calms nervous system',
      'Prepares body for rest'
    ],
    tips: [
      'Use blanket under knee for support',
      'Keep shoulders grounded',
      'Breathe into any tightness',
      'Move slowly and mindfully'
    ],
    commonMistakes: [
      'Forcing knee to floor',
      'Top shoulder lifting',
      'Moving too quickly',
      'Holding breath'
    ],
    modifications: {
      beginner: 'Place pillow under knee',
      tight: 'Keep bottom foot on floor',
      advanced: 'Straighten top leg'
    },
    breathingCues: 'Deep breaths into belly, exhale to soften'
  },
  {
    id: 'legs-up-wall',
    emoji: '🧘‍♀️',
    nameEnglish: 'Legs Up the Wall',
    nameSanskrit: 'Viparita Karani',
    category: 'restorative',
    difficulty: 'beginner',
    duration: 180,
    imageUrl: '/src/assets/poses/legs-up-wall.svg',
    description: 'A deeply restorative inversion that refreshes tired legs and calms the nervous system. One of the most relaxing yoga poses.',
    instructions: [
      'Sit sideways next to a wall',
      'Swing legs up the wall as you lie back',
      'Scoot hips close to or touching wall',
      'Rest arms alongside body, palms up',
      'Close eyes and relax completely',
      'Let legs rest against wall',
      'Stay for 5-15 minutes',
      'Bend knees and roll to side to exit',
      'Rest before standing'
    ],
    benefits: [
      'Relieves tired legs and feet',
      'Calms anxiety and stress',
      'Improves circulation',
      'Reduces swelling in legs',
      'Relieves mild backache',
      'Prepares for restful sleep'
    ],
    tips: [
      'Place folded blanket under hips',
      'Use eye pillow for deeper relaxation',
      'Cover with blanket if cold',
      'Set timer so you can fully relax'
    ],
    commonMistakes: [
      'Hips too far from wall',
      'Tensing in the pose',
      'Not staying long enough',
      'Standing up too quickly after'
    ],
    modifications: {
      beginner: 'Move hips farther from wall',
      tight: 'Bend knees slightly',
      restorative: 'Place bolster under hips'
    },
    breathingCues: 'Natural, effortless breathing'
  }
];

// Combine original poses with extended Iyengar poses (28 additional poses)
// Total: 23 original + 28 extended = 51 poses
export const allPoses = [...poses, ...posesExtended];

// Export combined array as default for backward compatibility
export default allPoses;

// Helper function to get pose by ID (works with all poses)
export const getPoseById = (id) => {
  return allPoses.find(pose => pose.id === id);
};

// Helper function to filter poses by category
export const getPosesByCategory = (category) => {
  return allPoses.filter(pose => pose.category === category);
};

// Helper function to get poses by difficulty
export const getPosesByDifficulty = (difficulty) => {
  return allPoses.filter(pose => pose.difficulty === difficulty);
};

// Get random pose
export const getRandomPose = () => {
  return allPoses[Math.floor(Math.random() * allPoses.length)];
};

// Get pose categories
export const getCategories = () => {
  return [...new Set(allPoses.map(pose => pose.category))];
};