// Extended yoga poses: Standing, Seated, Backbends, Twists, Inversions, and Balance
// Based on B.K.S. Iyengar's "Light on Yoga" methodology
// Total: 28 poses (8 standing + 6 seated + 4 backbends + 3 twists + 3 inversions + 4 balance)
// Note: Backbends require forward bend counter-poses in sequencing
// Note: Shoulderstand MUST be followed by counter-pose (Fish/Bridge)

export const posesExtended = [
  // ==================== STANDING POSES ====================
  {
    id: 'chair-pose',
    emoji: '💺',
    nameEnglish: 'Chair Pose',
    nameSanskrit: 'Utkatasana',
    category: 'standing',
    difficulty: 'beginner',
    duration: 30,
    imageUrl: '/src/assets/poses/chair-pose.svg',
    iyengarPhotoReference: 'Photo 42',
    description: 'A powerful standing pose that builds heat and strength in the legs while opening the chest. Chair Pose cultivates determination and mental focus, preparing the body for deeper asanas.',
    instructions: [
      'Stand in Mountain Pose with feet hip-width apart',
      'Inhale and raise arms overhead, palms facing each other',
      'Exhale and bend knees deeply as if sitting in a chair',
      'Shift weight into heels, keeping them grounded',
      'Draw thighs together and engage inner thighs',
      'Lengthen tailbone toward floor to protect lower back',
      'Keep chest lifted and shoulders away from ears',
      'Gaze forward or slightly up toward hands',
      'Hold for 5-10 breaths, building strength gradually'
    ],
    benefits: [
      'Strengthens quadriceps, glutes, and ankles',
      'Tones abdominal organs and improves digestion',
      'Opens chest and shoulders',
      'Builds mental determination and focus',
      'Stimulates heart and diaphragm',
      'Improves balance and posture'
    ],
    tips: [
      'Keep weight in heels to protect knees',
      'Imagine sitting back into an actual chair',
      'Draw shoulder blades down the back',
      'Keep knees aligned over ankles, not beyond toes',
      'Engage core to support lower back'
    ],
    commonMistakes: [
      'Knees extending beyond toes',
      'Weight shifting forward onto balls of feet',
      'Lower back arching excessively',
      'Shoulders tensing up toward ears',
      'Chest collapsing forward'
    ],
    modifications: {
      beginner: 'Shorten hold time or raise arms only to shoulder height',
      advanced: 'Bring feet together or lift heels for added challenge',
      knees: 'Don\'t bend knees as deeply, use wall for support'
    },
    breathingCues: 'Steady ujjayi breathing to maintain pose, exhale to deepen',
    sequencingNotes: {
      warmUp: ['Mountain Pose', 'Cat-Cow'],
      counterPoses: ['Standing Forward Fold', 'Mountain Pose'],
      contraindications: ['Acute knee injury or pain', 'Recent ankle sprains', 'Low blood pressure (dizziness may occur)', 'Chronic headaches or migraines'],
      preparatoryPoses: ['Mountain Pose'],
      followUpPoses: ['Warrior I', 'Eagle Pose']
    }
  },
  {
    id: 'standing-forward-fold',
    emoji: '🙇‍♂️',
    nameEnglish: 'Standing Forward Fold',
    nameSanskrit: 'Uttanasana',
    category: 'standing',
    difficulty: 'beginner',
    duration: 45,
    imageUrl: '/src/assets/poses/standing-forward-fold.svg',
    iyengarPhotoReference: 'Photos 47-48',
    description: 'A calming inversion that stretches the entire back body while bringing blood flow to the brain. Uttanasana is both a resting pose and an active stretch, teaching surrender and release.',
    instructions: [
      'Stand in Mountain Pose with feet hip-width apart',
      'Place hands on hips and engage thigh muscles',
      'Inhale and lengthen through the crown of head',
      'Exhale and hinge forward from hip joints, not waist',
      'Release hands toward floor, blocks, or shins',
      'Let head hang heavy, releasing neck tension',
      'Press through all four corners of feet',
      'Straighten legs as much as comfortable without locking knees',
      'Hold for 30-60 seconds, breathing deeply into back body',
      'To exit: Place hands on hips, engage core, rise with flat back'
    ],
    benefits: [
      'Stretches hamstrings, calves, and hips deeply',
      'Calms the brain and relieves stress and anxiety',
      'Stimulates liver and kidneys',
      'Improves digestion through gentle compression',
      'Relieves tension headaches and insomnia',
      'Strengthens thighs and knees when held actively'
    ],
    tips: [
      'Bend knees generously if hamstrings are tight',
      'Focus on lengthening spine rather than touching floor',
      'Let gravity do the work rather than pulling down',
      'Shift weight slightly forward into balls of feet',
      'Engage quadriceps to release hamstrings'
    ],
    commonMistakes: [
      'Rounding back excessively from upper spine',
      'Locking knees completely',
      'Forcing hands to floor',
      'Weight too far back in heels',
      'Tensing shoulders and neck'
    ],
    modifications: {
      beginner: 'Bend knees significantly, use blocks under hands',
      tight: 'Place hands on shins or thighs, widen stance',
      advanced: 'Clasp opposite elbows overhead, work toward palms flat on floor'
    },
    breathingCues: 'Inhale to lengthen spine, exhale to fold deeper',
    sequencingNotes: {
      warmUp: ['Mountain Pose', 'Cat-Cow'],
      counterPoses: ['Mountain Pose', 'Gentle backbend'],
      contraindications: ['Back injury or sciatica', 'Hamstring tear or recent injury', 'Glaucoma or detached retina', 'Advanced pregnancy'],
      preparatoryPoses: ['Mountain Pose'],
      followUpPoses: ['Half Forward Fold', 'Pyramid Pose']
    }
  },
  {
    id: 'half-forward-fold',
    emoji: '📐',
    nameEnglish: 'Half Forward Fold',
    nameSanskrit: 'Ardha Uttanasana',
    category: 'standing',
    difficulty: 'beginner',
    duration: 30,
    imageUrl: '/src/assets/poses/half-forward-fold.svg',
    iyengarPhotoReference: 'Photo 49',
    description: 'A transitional pose that strengthens the back while creating length through the spine. Often used in Sun Salutations, this pose teaches proper spinal alignment in forward bending.',
    instructions: [
      'From Standing Forward Fold, place fingertips on floor or blocks',
      'Inhale and lift torso to create flat back parallel to floor',
      'Draw chest forward and crown of head forward',
      'Pull shoulder blades down back, opening chest',
      'Engage core to support lower back',
      'Keep legs straight or micro-bend knees',
      'Lengthen from tailbone to crown of head',
      'Gaze down or slightly forward to keep neck neutral',
      'Hold for 3-5 breaths with active engagement'
    ],
    benefits: [
      'Strengthens back muscles and spine',
      'Improves posture and body awareness',
      'Stretches hamstrings while protecting back',
      'Builds core strength and stability',
      'Prepares spine for deeper forward folds',
      'Stimulates abdominal organs'
    ],
    tips: [
      'Use blocks under hands to achieve proper height',
      'Think of lengthening rather than lifting',
      'Keep back of neck long, not compressed',
      'Draw belly in to support lower back',
      'Imagine someone pulling you forward by the crown'
    ],
    commonMistakes: [
      'Rounding upper back',
      'Head dropping or lifting too high',
      'Hands too far forward',
      'Hyperextending lower back',
      'Shoulders hunching up toward ears'
    ],
    modifications: {
      beginner: 'Place hands on shins or use tall blocks',
      advanced: 'Fingertips only on floor, work toward flat palms',
      back: 'Use higher props to reduce load on spine'
    },
    breathingCues: 'Inhale to lengthen and lift, maintain breath while holding',
    sequencingNotes: {
      warmUp: ['Standing Forward Fold', 'Mountain Pose'],
      counterPoses: ['Mountain Pose'],
      contraindications: ['Acute back injury', 'Severe scoliosis', 'Hamstring tear', 'Disc herniation'],
      preparatoryPoses: ['Mountain Pose', 'Standing Forward Fold'],
      followUpPoses: ['Standing Forward Fold', 'Downward Dog']
    }
  },
  {
    id: 'wide-legged-forward-fold',
    emoji: '🤸',
    nameEnglish: 'Wide-Legged Forward Fold',
    nameSanskrit: 'Prasarita Padottanasana',
    category: 'standing',
    difficulty: 'beginner',
    duration: 45,
    imageUrl: '/src/assets/poses/wide-legged-forward-fold.svg',
    iyengarPhotoReference: 'Photos 33-36',
    description: 'A calming standing forward fold that deeply stretches the inner legs and hamstrings while bringing blood flow to the head. This pose builds strength in the legs while cultivating introspection.',
    instructions: [
      'Stand with feet 3-4 feet apart, parallel to each other',
      'Place hands on hips and engage thigh muscles strongly',
      'Inhale and lift chest, creating length in torso',
      'Exhale and hinge forward from hips, keeping back flat',
      'Place hands on floor between feet, shoulder-width apart',
      'Walk hands back toward line of feet if possible',
      'Let crown of head release toward floor',
      'Press outer edges of feet firmly into mat',
      'Hold for 30-60 seconds, breathing into hamstrings',
      'To exit: Walk hands forward, place on hips, rise with flat back'
    ],
    benefits: [
      'Stretches inner thighs, hamstrings, and calves',
      'Strengthens and stretches spine',
      'Tones abdominal organs',
      'Calms the brain and relieves mild depression',
      'Relieves tension headaches',
      'Improves balance and posture'
    ],
    tips: [
      'Keep weight evenly distributed between both feet',
      'Engage inner thighs to protect hip joints',
      'Use blocks under hands if floor is too far',
      'Keep legs active and strong throughout',
      'Press through outer edges of feet to engage arches'
    ],
    commonMistakes: [
      'Feet turned out instead of parallel',
      'Weight shifting forward onto toes',
      'Rounding back excessively',
      'Locking knees completely',
      'Stance too wide or too narrow'
    ],
    modifications: {
      beginner: 'Hands on blocks, bend knees slightly, narrow stance',
      tight: 'Place forearms on blocks or chair seat',
      advanced: 'Clasp big toes with peace fingers, work toward crown touching floor'
    },
    breathingCues: 'Inhale to lengthen spine, exhale to fold deeper',
    sequencingNotes: {
      warmUp: ['Mountain Pose', 'Standing Forward Fold'],
      counterPoses: ['Mountain Pose', 'Gentle backbend'],
      contraindications: ['Lower back injury or disc issues', 'Hamstring tears', 'High blood pressure (avoid full forward fold)', 'Glaucoma or detached retina'],
      preparatoryPoses: ['Mountain Pose', 'Standing Forward Fold'],
      followUpPoses: ['Triangle Pose', 'Pyramid Pose']
    }
  },
  {
    id: 'revolved-triangle',
    emoji: '🔄',
    nameEnglish: 'Revolved Triangle',
    nameSanskrit: 'Parivrtta Trikonasana',
    category: 'standing',
    difficulty: 'intermediate',
    duration: 30,
    requiresBothSides: true,
    imageUrl: '/src/assets/poses/revolved-triangle.svg',
    iyengarPhotoReference: 'Photo 6',
    description: 'An intense twisting pose that challenges balance while deeply massaging the internal organs. This pose requires and builds strength, flexibility, and concentration.',
    instructions: [
      'Stand with feet 3 feet apart, turn right foot forward, left foot 45 degrees in',
      'Square hips toward front of mat, aligning hip points',
      'Place left hand on left hip to monitor hip alignment',
      'Inhale and lengthen spine, lifting from crown of head',
      'Exhale and hinge forward, rotating torso to the right',
      'Place left hand outside right foot or on block',
      'Extend right arm straight up toward ceiling',
      'Stack shoulders vertically, opening chest to the right',
      'Gaze up at right hand or straight ahead',
      'Press firmly through outer edge of back foot',
      'Hold for 5-8 breaths, then switch sides'
    ],
    benefits: [
      'Deeply massages and detoxifies abdominal organs',
      'Improves digestion and elimination',
      'Strengthens legs and ankles',
      'Opens chest and improves breathing capacity',
      'Stretches hamstrings and hips',
      'Improves balance and concentration'
    ],
    tips: [
      'Use block under bottom hand to maintain alignment',
      'Keep hips squared and level',
      'Engage back leg strongly to maintain stability',
      'Twist from navel, not just shoulders',
      'Keep both legs very straight and active'
    ],
    commonMistakes: [
      'Back hip jutting out to side',
      'Bending front knee',
      'Collapsing into bottom side',
      'Forcing twist too deeply',
      'Back foot lifting off mat'
    ],
    modifications: {
      beginner: 'Use tall block under bottom hand, back heel against wall',
      tight: 'Shorten stance significantly, keep back knee slightly bent',
      advanced: 'Bottom hand flat on floor, bind top arm behind back'
    },
    breathingCues: 'Inhale to lengthen spine, exhale to deepen twist',
    sequencingNotes: {
      warmUp: ['Triangle Pose', 'Pyramid Pose', 'Standing Forward Fold'],
      counterPoses: ['Standing Forward Fold', 'Mountain Pose'],
      contraindications: ['Back or spine injuries', 'Hamstring tears', 'Migraines or headaches', 'High or low blood pressure', 'Diarrhea'],
      preparatoryPoses: ['Triangle Pose', 'Pyramid Pose', 'Standing Forward Fold'],
      followUpPoses: ['Half Moon']
    }
  },
  {
    id: 'warrior-three',
    emoji: '✈️',
    nameEnglish: 'Warrior III',
    nameSanskrit: 'Virabhadrasana III',
    category: 'balance',
    difficulty: 'intermediate',
    duration: 30,
    requiresBothSides: true,
    imageUrl: '/src/assets/poses/warrior-three.svg',
    iyengarPhotoReference: 'Photo 89',
    description: 'A challenging balancing pose that requires full-body integration and concentration. Warrior III builds strength, focus, and the confidence of a peaceful warrior.',
    instructions: [
      'Stand in Mountain Pose, shift weight onto right foot',
      'Hinge forward at hips while lifting left leg back',
      'Keep left leg straight and flexed, toes pointing down',
      'Extend torso forward parallel to floor',
      'Reach arms forward alongside ears or hands to hips',
      'Create one straight line from fingertips to lifted heel',
      'Square hips toward floor, keeping both hip points level',
      'Engage standing leg without locking knee',
      'Gaze down at floor about 6 inches in front of standing foot',
      'Hold for 5-10 breaths, building to 30 seconds',
      'Lower with control and switch sides'
    ],
    benefits: [
      'Strengthens ankles, legs, shoulders, and back',
      'Tones and strengthens entire posterior chain',
      'Improves balance and posture',
      'Develops intense concentration and focus',
      'Builds confidence and determination',
      'Strengthens core and hip stabilizers'
    ],
    tips: [
      'Focus on lengthening rather than lifting',
      'Keep hips level and squared to floor',
      'Engage lifted leg as if pushing into wall behind',
      'Use wall or chair for support when learning',
      'Flex lifted foot to engage entire leg'
    ],
    commonMistakes: [
      'Back hip opening toward ceiling',
      'Standing knee locking completely',
      'Lifted leg turning out',
      'Torso not parallel to floor',
      'Holding breath'
    ],
    modifications: {
      beginner: 'Hands on wall or chair, reduce height of lifted leg',
      balance: 'Practice with hands on wall or blocks on floor',
      advanced: 'Hands in prayer at heart or interlaced behind back'
    },
    breathingCues: 'Steady, even breathing to maintain balance',
    sequencingNotes: {
      warmUp: ['Warrior I', 'Tree Pose', 'Mountain Pose'],
      counterPoses: ['Standing Forward Fold', 'Mountain Pose'],
      contraindications: ['High blood pressure', 'Heart conditions', 'Recent back injury', 'Balance disorders'],
      preparatoryPoses: ['Warrior I', 'Tree Pose', 'Mountain Pose'],
      followUpPoses: ['Half Moon', 'Standing Split']
    }
  },
  {
    id: 'standing-split',
    emoji: '🤸‍♀️',
    nameEnglish: 'Standing Split',
    nameSanskrit: 'Urdhva Prasarita Eka Padasana',
    category: 'balance',
    difficulty: 'advanced',
    duration: 30,
    requiresBothSides: true,
    imageUrl: '/src/assets/poses/standing-split.svg',
    iyengarPhotoReference: 'Photo 49',
    description: 'An advanced balance pose combining deep hamstring flexibility with core strength. This pose requires patience, dedication, and complete body awareness.',
    instructions: [
      'From Standing Forward Fold, shift weight onto right foot',
      'Place hands on floor or blocks in front of standing foot',
      'Inhale and lift left leg up behind you as high as possible',
      'Keep both legs straight and active',
      'Square hips toward floor initially',
      'As flexibility allows, let back hip open toward ceiling',
      'Bring chest toward standing leg',
      'Option to wrap hands around standing ankle',
      'Keep standing leg strong and engaged',
      'Hold for 5-10 breaths, building flexibility over time',
      'Lower with control and switch sides'
    ],
    benefits: [
      'Deeply stretches hamstrings and hip flexors',
      'Strengthens standing leg and ankle',
      'Improves balance and concentration',
      'Opens hips and increases flexibility',
      'Builds mental patience and determination',
      'Strengthens core and back muscles'
    ],
    tips: [
      'Focus on lifting lifted leg rather than bringing torso down',
      'Keep standing leg micro-bent to protect knee',
      'Engage quadriceps of both legs',
      'Use blocks under hands to maintain alignment',
      'Practice against wall for stability when learning'
    ],
    commonMistakes: [
      'Bending standing leg excessively',
      'Forcing torso down instead of lifting back leg',
      'Lifted leg turned out',
      'Collapsing into standing hip',
      'Holding breath through intensity'
    ],
    modifications: {
      beginner: 'Keep hands on blocks, lift back leg only to hip height',
      tight: 'Practice with bent standing knee, use wall for support',
      advanced: 'Hands wrapped around standing ankle, forehead to shin'
    },
    breathingCues: 'Deep steady breaths, exhale to release into stretch',
    sequencingNotes: {
      warmUp: ['Standing Forward Fold', 'Warrior III', 'Pyramid Pose'],
      counterPoses: ['Standing Forward Fold', 'Child\'s Pose'],
      contraindications: ['Hamstring tears or injuries', 'Back injury or sciatica', 'Ankle instability', 'High blood pressure', 'Vertigo or balance disorders'],
      preparatoryPoses: ['Standing Forward Fold', 'Warrior III', 'Pyramid Pose'],
      followUpPoses: ['Handstand preparation']
    }
  },
  {
    id: 'dancer-pose',
    emoji: '💃',
    nameEnglish: 'Dancer Pose',
    nameSanskrit: 'Natarajasana',
    category: 'balance',
    difficulty: 'advanced',
    duration: 30,
    requiresBothSides: true,
    imageUrl: '/src/assets/poses/dancer-pose.svg',
    iyengarPhotoReference: 'Photo 464',
    description: 'An elegant and challenging pose combining balance, backbending, and grace. Named after Shiva, the Lord of Dance, this pose embodies both strength and surrender.',
    instructions: [
      'Stand in Mountain Pose and find a steady focal point (drishti)',
      'Shift weight onto right foot, grounding firmly',
      'Bend left knee and reach left hand back to catch left foot',
      'Extend right arm forward and up',
      'Begin to kick left foot into left hand',
      'As you kick back, hinge torso forward to maintain balance',
      'Lift left leg higher, opening through chest',
      'Keep right leg straight and strong',
      'Reach right fingertips forward and up',
      'Hold for 5-10 breaths with steady focus',
      'Release slowly and switch sides'
    ],
    benefits: [
      'Improves balance and concentration dramatically',
      'Stretches shoulders, chest, and quadriceps',
      'Strengthens legs, ankles, and back',
      'Opens hip flexors deeply',
      'Creates beautiful spinal extension',
      'Builds grace, poise, and confidence'
    ],
    tips: [
      'Use strap around back foot if you cannot reach',
      'Press foot firmly into hand to deepen backbend',
      'Keep standing leg micro-bent for stability',
      'Lift from sternum, not by arching lower back',
      'Practice near wall when learning'
    ],
    commonMistakes: [
      'Collapsing into lower back',
      'Standing hip jutting out',
      'Dropping front shoulder',
      'Not kicking foot into hand',
      'Losing balance by looking around'
    ],
    modifications: {
      beginner: 'Use strap around back foot, hold onto wall or chair',
      tight: 'Keep torso more upright, focus on balance over flexibility',
      advanced: 'Catch foot from inside, bind both hands to foot, chin to shin'
    },
    breathingCues: 'Steady breath to maintain balance, inhale to lift and expand',
    sequencingNotes: {
      warmUp: ['Tree Pose', 'Warrior III', 'Bridge Pose', 'Cobra Pose'],
      counterPoses: ['Standing Forward Fold', 'Mountain Pose'],
      contraindications: ['Low blood pressure', 'Back injury or chronic back pain', 'Shoulder injury', 'Ankle or knee injury', 'Balance disorders'],
      preparatoryPoses: ['Tree Pose', 'Warrior III', 'Bridge Pose', 'Cobra Pose'],
      followUpPoses: ['Full Dancer variation', 'King Pigeon Pose']
    }
  },

  // ==================== SEATED & FOUNDATION POSES ====================
  {
    id: 'staff-pose',
    emoji: '📏',
    nameEnglish: 'Staff Pose',
    nameSanskrit: 'Dandasana',
    category: 'seated',
    difficulty: 'beginner',
    duration: 45,
    imageUrl: '/src/assets/poses/staff-pose.svg',
    iyengarPhotoReference: 'Photo 77',
    description: 'The foundational seated pose from which all other seated poses arise. Staff Pose teaches proper spinal alignment and active sitting, essential for meditation and forward bends.',
    instructions: [
      'Sit with legs extended straight in front',
      'Flex feet, toes pointing toward ceiling',
      'Place hands beside hips, fingers pointing forward',
      'Press sit bones firmly into floor',
      'Engage thigh muscles, pressing backs of knees down',
      'Lift through crown of head, lengthening spine',
      'Draw shoulder blades down and together',
      'Keep chest lifted and open',
      'Gaze straight ahead with soft eyes'
    ],
    benefits: [
      'Establishes proper seated alignment',
      'Strengthens back muscles and core',
      'Stretches hamstrings and calves',
      'Improves posture for meditation',
      'Teaches active engagement in stillness',
      'Prepares body for forward bends'
    ],
    tips: [
      'Sit on folded blanket if hamstrings are tight',
      'Think of spine growing taller with each inhale',
      'Keep legs actively engaged, not passive',
      'Press through heels to wake up leg muscles'
    ],
    commonMistakes: [
      'Rounding the lower back',
      'Collapsing chest forward',
      'Locking or hyperextending knees',
      'Shoulders hunching up toward ears'
    ],
    modifications: {
      beginner: 'Sit on one or two folded blankets, bend knees slightly',
      tight: 'Place rolled blanket under knees for support',
      advanced: 'Lift hands off floor while maintaining alignment'
    },
    breathingCues: 'Inhale to lengthen spine, exhale to root sit bones down',
    sequencingNotes: {
      warmUp: [],
      counterPoses: [],
      contraindications: ['Recent hamstring injury', 'Lower back injury (modify with props)', 'Wrist pain (rest on fists instead of palms)'],
      preparatoryPoses: [],
      followUpPoses: ['Seated Forward Fold', 'Head-to-Knee Pose', 'Boat Pose']
    }
  },
  {
    id: 'hero-pose',
    emoji: '🦸',
    nameEnglish: 'Hero Pose',
    nameSanskrit: 'Virasana',
    category: 'seated',
    difficulty: 'beginner',
    duration: 60,
    imageUrl: '/src/assets/poses/hero-pose.svg',
    iyengarPhotoReference: 'Photo 89',
    description: 'A kneeling pose that stretches the tops of the feet and ankles while opening the knees and thighs. Hero Pose is excellent for meditation and pranayama practice.',
    instructions: [
      'Kneel with knees together, feet slightly wider than hips',
      'Point toes straight back, tops of feet flat on floor',
      'Slowly sit back between feet (not on them)',
      'Place hands on thighs with palms down',
      'Lengthen spine upward from tailbone to crown',
      'Draw shoulders back and down',
      'Keep inner knees touching if possible',
      'Relax face and jaw',
      'Hold for 30-60 seconds, gradually increasing duration'
    ],
    benefits: [
      'Stretches tops of feet, ankles, and quadriceps',
      'Opens knees and improves knee flexibility',
      'Strengthens arches of feet',
      'Improves digestion and circulation in legs',
      'Excellent pose for meditation',
      'Relieves tired legs after standing'
    ],
    tips: [
      'Ensure feet point straight back, not splayed out',
      'Keep knees together or hip-width apart',
      'Use props generously to avoid knee strain',
      'Come out of pose if sharp pain in knees'
    ],
    commonMistakes: [
      'Feet splaying outward instead of pointing back',
      'Forcing hips down without proper support',
      'Collapsing spine forward',
      'Knees spreading too wide apart'
    ],
    modifications: {
      beginner: 'Sit on 1-3 blocks between feet for height',
      tight: 'Place blanket under knees and between calves and thighs',
      knees: 'Use bolster or multiple blocks for more height',
      pregnancy: 'Widen knees to make room for belly'
    },
    breathingCues: 'Deep, steady breathing through nose',
    sequencingNotes: {
      warmUp: ['Staff Pose'],
      counterPoses: ['Staff Pose', 'Seated Forward Fold'],
      contraindications: ['Knee injury or recent knee surgery', 'Ankle injury', 'Heart problems (don\'t hold for extended periods)', 'Headache'],
      preparatoryPoses: ['Staff Pose'],
      followUpPoses: ['Reclining Hero', 'Thunderbolt Pose', 'Cow Face Pose']
    }
  },
  {
    id: 'thunderbolt-pose',
    emoji: '⚡',
    nameEnglish: 'Thunderbolt Pose',
    nameSanskrit: 'Vajrasana',
    category: 'seated',
    difficulty: 'beginner',
    duration: 60,
    imageUrl: '/src/assets/poses/thunderbolt-pose.svg',
    iyengarPhotoReference: 'Photo 86',
    description: 'A simple kneeling pose that aids digestion and prepares for meditation. Vajrasana is one of the few poses that can be practiced immediately after eating.',
    instructions: [
      'Kneel on floor with knees together',
      'Sit back on heels with tops of feet flat',
      'Place hands on thighs, palms facing down',
      'Keep spine naturally upright and lengthened',
      'Draw shoulders back gently',
      'Tuck chin slightly toward chest',
      'Close eyes or maintain soft downward gaze',
      'Breathe naturally and steadily',
      'Hold for 1-5 minutes'
    ],
    benefits: [
      'Aids digestion (can practice after meals)',
      'Strengthens pelvic floor muscles',
      'Reduces gas and acidity',
      'Stretches tops of feet and ankles',
      'Improves posture and spinal alignment',
      'Calms mind for meditation'
    ],
    tips: [
      'Keep spine long without forcing',
      'Relax shoulders away from ears',
      'Distribute weight evenly on both legs',
      'Start with shorter durations and build up'
    ],
    commonMistakes: [
      'Rounding shoulders forward',
      'Tensing in the neck',
      'Sitting with feet apart instead of together',
      'Forcing pose if knees or ankles hurt'
    ],
    modifications: {
      beginner: 'Place folded blanket between calves and thighs',
      ankles: 'Put rolled towel under ankles for cushioning',
      knees: 'Sit on block between feet for less pressure',
      pregnancy: 'Slightly widen knees for belly space'
    },
    breathingCues: 'Natural abdominal breathing, ideal for pranayama',
    sequencingNotes: {
      warmUp: [],
      counterPoses: ['Staff Pose'],
      contraindications: ['Knee or ankle injury', 'Recent surgery on legs or feet', 'Severe arthritis in knees', 'Avoid if experiencing knee pain'],
      preparatoryPoses: [],
      followUpPoses: ['Hero Pose', 'Meditation practice', 'Pranayama exercises']
    }
  },
  {
    id: 'reclining-hero',
    emoji: '🛌',
    nameEnglish: 'Reclining Hero Pose',
    nameSanskrit: 'Supta Virasana',
    category: 'backbend',
    difficulty: 'intermediate',
    duration: 60,
    imageUrl: '/src/assets/poses/reclining-hero.svg',
    iyengarPhotoReference: 'Photo 96',
    description: 'An intense backbend and quad stretch that opens the chest and front body. This reclined variation of Hero Pose is deeply therapeutic when practiced with proper support.',
    instructions: [
      'Begin in Hero Pose (sitting between feet)',
      'Place hands behind you on floor',
      'Lean back on forearms, lowering slowly',
      'Lower upper back and head to floor if comfortable',
      'Keep knees on floor or as close as possible',
      'Rest arms alongside body or overhead',
      'Ensure lower back is supported, not strained',
      'Hold for 30-60 seconds initially',
      'Come up slowly on forearms, then sit up'
    ],
    benefits: [
      'Deeply stretches quadriceps and hip flexors',
      'Opens chest and improves breathing capacity',
      'Stretches abdomen and throat',
      'Relieves tired legs and swollen ankles',
      'Therapeutic for digestive issues',
      'Improves posture and spinal flexibility'
    ],
    tips: [
      'Use bolster lengthwise under spine for support',
      'Keep knees together if possible',
      'Don\'t force chest opening',
      'Exit immediately if sharp knee pain'
    ],
    commonMistakes: [
      'Going too deep too quickly',
      'Allowing knees to lift off floor',
      'Straining lower back without support',
      'Forcing head to floor'
    ],
    modifications: {
      beginner: 'Recline on bolster or stacked blankets',
      tight: 'Stay on forearms, don\'t go all the way down',
      knees: 'Use extra height under spine (2-3 bolsters)',
      pregnancy: 'Not recommended in 2nd/3rd trimester'
    },
    breathingCues: 'Deep chest breathing, feeling ribcage expand',
    sequencingNotes: {
      warmUp: ['Hero Pose', 'Staff Pose', 'Cat-Cow'],
      counterPoses: ['Child\'s Pose (essential)', 'Seated Forward Fold'],
      contraindications: ['Knee injury or knee surgery', 'Lower back problems', 'Neck injury (don\'t drop head back)', 'Second/third trimester pregnancy', 'High or low blood pressure (use support)'],
      preparatoryPoses: ['Hero Pose', 'Staff Pose'],
      followUpPoses: ['Deeper backbends', 'Camel Pose', 'Wheel Pose']
    }
  },
  {
    id: 'cow-face-pose',
    emoji: '🐄',
    nameEnglish: 'Cow Face Pose',
    nameSanskrit: 'Gomukhasana',
    category: 'seated',
    difficulty: 'intermediate',
    duration: 45,
    requiresBothSides: true,
    imageUrl: '/src/assets/poses/cow-face-pose.svg',
    iyengarPhotoReference: 'Photo 80',
    description: 'A deep hip and shoulder opener that stacks the knees and binds the arms. This pose reveals asymmetries in the body and requires patience to master.',
    instructions: [
      'Sit in Staff Pose with legs extended',
      'Bend right knee and place right foot outside left hip',
      'Bend left knee and stack left knee over right knee',
      'Align knees in center, feet wide',
      'Reach right arm up, bend elbow, hand behind back',
      'Bring left arm behind back from below',
      'Clasp hands behind back if possible',
      'Keep spine upright and lifted',
      'Hold for 30-45 seconds, then switch sides'
    ],
    benefits: [
      'Deeply stretches hips, ankles, and thighs',
      'Opens shoulders and chest',
      'Stretches triceps and front of shoulders',
      'Improves posture',
      'Reveals and corrects body asymmetries',
      'Prepares for advanced arm balances'
    ],
    tips: [
      'Keep sit bones grounded evenly',
      'Use strap between hands if they don\'t meet',
      'Focus on spine length over binding hands',
      'Expect differences between sides'
    ],
    commonMistakes: [
      'Leaning to one side',
      'Rounding spine to reach hands',
      'Forcing knees to stack',
      'Collapsing chest forward'
    ],
    modifications: {
      beginner: 'Use strap between hands, sit on blanket',
      tight: 'Keep bottom leg extended in Staff Pose',
      shoulders: 'Hold strap, don\'t force hand clasp',
      hips: 'Sit on folded blanket or block for height'
    },
    breathingCues: 'Inhale to lengthen spine, exhale to deepen stretch',
    sequencingNotes: {
      warmUp: ['Staff Pose', 'Hero Pose', 'Shoulder stretches'],
      counterPoses: ['Child\'s Pose', 'Seated Forward Fold'],
      contraindications: ['Knee injury', 'Shoulder injury or rotator cuff issues', 'Hip injury', 'Neck problems (if looking up)'],
      preparatoryPoses: ['Staff Pose', 'Hero Pose'],
      followUpPoses: ['Deeper hip openers', 'Arm balance preparation', 'Full Lotus']
    }
  },
  {
    id: 'head-to-knee-pose',
    emoji: '🙏',
    nameEnglish: 'Head-to-Knee Forward Bend',
    nameSanskrit: 'Janu Sirsasana',
    category: 'seated',
    difficulty: 'intermediate',
    duration: 60,
    requiresBothSides: true,
    imageUrl: '/src/assets/poses/head-to-knee-pose.svg',
    iyengarPhotoReference: 'Photo 125',
    description: 'An asymmetrical forward bend that deeply stretches one leg at a time. This pose combines hamstring flexibility with a gentle hip opener and calming forward fold.',
    instructions: [
      'Begin in Staff Pose',
      'Bend right knee and place sole of right foot against inner left thigh',
      'Open right knee toward floor',
      'Keep left leg straight, flexing foot',
      'Inhale and lengthen spine upward',
      'Exhale and hinge forward from hips over left leg',
      'Reach for shin, ankle, or foot',
      'Keep spine long, chest open toward extended leg',
      'Hold for 45-60 seconds, switch sides'
    ],
    benefits: [
      'Deeply stretches hamstrings and calves',
      'Opens hips and groin',
      'Stimulates liver and kidneys',
      'Calms brain and relieves mild depression',
      'Improves digestion',
      'Therapeutic for high blood pressure and insomnia'
    ],
    tips: [
      'Focus on lengthening forward, not down',
      'Keep chest open toward extended leg',
      'Use strap around foot if needed',
      'Bent knee doesn\'t have to touch floor'
    ],
    commonMistakes: [
      'Rounding spine excessively',
      'Pulling with arms instead of folding from hips',
      'Forcing head to knee',
      'Twisting torso away from extended leg'
    ],
    modifications: {
      beginner: 'Use strap around foot, sit on blanket',
      tight: 'Keep hand on shin, don\'t reach for foot',
      knees: 'Place blanket under bent knee for support',
      advanced: 'Clasp wrist beyond foot, rest head on shin'
    },
    breathingCues: 'Inhale to lengthen spine, exhale to fold deeper',
    sequencingNotes: {
      warmUp: ['Staff Pose', 'Seated Forward Fold'],
      counterPoses: ['Staff Pose', 'Gentle backbend'],
      contraindications: ['Hamstring injury', 'Lower back injury', 'Knee injury on bent leg side', 'Asthma (don\'t fold deeply)', 'Diarrhea'],
      preparatoryPoses: ['Staff Pose'],
      followUpPoses: ['Seated Forward Fold', 'Revolved Head-to-Knee', 'Tortoise Pose']
    }
  },

  // ==================== BACKBENDS ====================
  {
    id: 'sphinx-pose',
    emoji: '🦁',
    nameEnglish: 'Sphinx Pose',
    nameSanskrit: 'Salamba Bhujangasana',
    category: 'backbend',
    difficulty: 'beginner',
    duration: 45,
    imageUrl: '/src/assets/poses/sphinx-pose.svg',
    iyengarPhotoReference: 'Photo 68',
    description: 'A gentle, accessible backbend that strengthens the spine while opening the chest. The forearm support makes this sustainable for longer holds, allowing deep breath work.',
    instructions: [
      'Lie face down with legs extended, tops of feet pressing into mat',
      'Place forearms parallel on mat, elbows under shoulders',
      'Press palms firmly into mat, spreading fingers wide',
      'Engage legs strongly, pressing pubic bone into floor',
      'Lift chest forward and up, drawing sternum through arms',
      'Roll shoulder blades down the back, broadening chest',
      'Lengthen through crown of head, keeping neck long',
      'Engage lower abdomen to protect lower back',
      'Hold for 30-60 seconds, breathing steadily'
    ],
    benefits: [
      'Strengthens spinal muscles and erector spinae',
      'Opens chest, lungs, and shoulders',
      'Improves posture and spinal flexibility',
      'Stimulates abdominal organs and digestion',
      'Relieves stress and mild depression',
      'Therapeutic for fatigue and respiratory ailments'
    ],
    tips: [
      'Keep elbows directly under shoulders for proper alignment',
      'Engage legs actively to protect lower back',
      'Draw chest forward rather than just lifting up',
      'Use back muscles more than arm strength',
      'Practice after Cat-Cow to warm up spine'
    ],
    commonMistakes: [
      'Elbows too far forward or too wide',
      'Crunching lower back by lifting too high',
      'Shoulders hunched toward ears',
      'Legs relaxed and passive',
      'Holding breath or shallow breathing'
    ],
    modifications: {
      beginner: 'Place blanket under hips for support, reduce height of lift',
      advanced: 'Walk elbows slightly forward for deeper backbend',
      back: 'Reduce the lift, focus on length rather than depth',
      pregnancy: 'Avoid after first trimester'
    },
    breathingCues: 'Deep belly breathing, feeling ribs expand on inhale',
    sequencingNotes: {
      warmUp: ['Cat-Cow', 'Child\'s Pose'],
      counterPoses: ['Child\'s Pose', 'Downward Dog'],
      contraindications: ['Serious back injury', 'Headache', 'Pregnancy (after 1st trimester)'],
      preparatoryPoses: ['Cat-Cow', 'Cobra Pose'],
      followUpPoses: ['Child\'s Pose (essential counter-pose)', 'Downward Dog']
    }
  },
  {
    id: 'locust-pose',
    emoji: '🦗',
    nameEnglish: 'Locust Pose',
    nameSanskrit: 'Salabhasana',
    category: 'backbend',
    difficulty: 'beginner',
    duration: 30,
    imageUrl: '/src/assets/poses/locust-pose.svg',
    iyengarPhotoReference: 'Photo 60',
    description: 'A strengthening backbend that lifts the entire body against gravity. Builds back, glute, and hamstring strength while improving stamina.',
    instructions: [
      'Lie face down with arms alongside body, palms facing up',
      'Rest forehead on mat, legs extended hip-width apart',
      'Engage inner thighs, pressing tops of feet into mat',
      'On inhale, simultaneously lift head, chest, arms, and legs',
      'Keep arms parallel to floor, reaching through fingertips',
      'Lift thighs and kneecaps off floor, legs strongly engaged',
      'Draw shoulder blades toward each other, opening chest',
      'Gaze forward or slightly down to keep neck long',
      'Hold for 15-30 seconds, release on exhale',
      'Rest with head turned to one side between rounds'
    ],
    benefits: [
      'Strengthens entire posterior chain: back, glutes, hamstrings',
      'Improves posture and spinal alignment',
      'Opens chest, shoulders, and lungs',
      'Stimulates abdominal organs and digestion',
      'Builds heat and stamina',
      'Relieves stress and fatigue'
    ],
    tips: [
      'Engage legs strongly - active legs protect lower back',
      'Lift from back muscles, not by straining neck',
      'Keep gaze forward to maintain neck alignment',
      'Start with smaller lifts and build strength gradually',
      'Practice 2-3 rounds with rest between'
    ],
    commonMistakes: [
      'Lifting head too high and crunching neck',
      'Legs passive or turning outward',
      'Shoulders hunched, arms not engaged',
      'Holding breath or breathing shallowly',
      'Forcing the lift beyond current capacity'
    ],
    modifications: {
      beginner: 'Lift only chest and arms, keep legs on floor',
      intermediate: 'Clasp hands behind back for shoulder stretch',
      advanced: 'Interlace fingers behind back, straighten arms fully',
      back: 'Practice Half Locust - lift one leg at a time'
    },
    breathingCues: 'Inhale to lift, steady breathing while holding, exhale to release',
    sequencingNotes: {
      warmUp: ['Cat-Cow', 'Sphinx Pose'],
      counterPoses: ['Child\'s Pose (essential)', 'Downward Dog'],
      contraindications: ['Serious back injury', 'Headache', 'Pregnancy'],
      preparatoryPoses: ['Sphinx Pose', 'Cobra Pose'],
      followUpPoses: ['Child\'s Pose', 'Bow Pose (if continuing backbends)']
    }
  },
  {
    id: 'bow-pose',
    emoji: '🏹',
    nameEnglish: 'Bow Pose',
    nameSanskrit: 'Dhanurasana',
    category: 'backbend',
    difficulty: 'intermediate',
    duration: 30,
    imageUrl: '/src/assets/poses/bow-pose.svg',
    iyengarPhotoReference: 'Photo 63',
    description: 'A deep backbend that creates a bow shape with the body. Opens the entire front body while strengthening the back, combining flexibility and strength.',
    instructions: [
      'Lie face down with arms alongside body',
      'Bend knees and bring heels toward buttocks',
      'Reach back and grasp outside of ankles (right hand to right ankle)',
      'Keep knees hip-width apart throughout',
      'On inhale, kick feet into hands and lift chest and thighs off floor',
      'Press shoulder blades firmly into back, opening chest',
      'Keep gaze forward, avoiding neck strain',
      'Kick strongly into hands to deepen the bow shape',
      'Hold for 20-30 seconds, breathing steadily',
      'Release slowly on exhale, rest with head to one side'
    ],
    benefits: [
      'Deeply opens chest, throat, abdomen, hip flexors, and quadriceps',
      'Strengthens back muscles and improves spinal flexibility',
      'Stimulates abdominal organs and improves digestion',
      'Improves posture and reduces slouching',
      'Energizes and reduces fatigue',
      'Therapeutic for respiratory ailments and mild backache'
    ],
    tips: [
      'Keep knees no wider than hip-width apart',
      'Focus on kicking feet into hands to create lift',
      'Rock gently forward and back to massage abdomen',
      'Use strap around ankles if you cannot reach feet',
      'Practice Locust Pose first to build strength'
    ],
    commonMistakes: [
      'Knees splaying wider than hips',
      'Gripping with shoulders instead of opening chest',
      'Lifting head too high and straining neck',
      'Holding breath or breathing shallowly',
      'Forcing the pose before adequate flexibility'
    ],
    modifications: {
      beginner: 'Hold one ankle at a time (Half Bow Pose)',
      tight: 'Use yoga strap around ankles',
      advanced: 'Rock forward and back, massaging abdomen',
      shoulders: 'Practice Half Bow until shoulder flexibility improves'
    },
    breathingCues: 'Inhale to lift, deep belly breathing while holding, exhale to release',
    sequencingNotes: {
      warmUp: ['Cat-Cow', 'Sphinx Pose', 'Locust Pose', 'Cobra Pose'],
      counterPoses: ['Child\'s Pose (essential - hold 1-2 minutes)', 'Downward Dog'],
      contraindications: ['Serious back or neck injury', 'High or low blood pressure', 'Migraine', 'Insomnia', 'Pregnancy'],
      preparatoryPoses: ['Cobra Pose', 'Locust Pose', 'Bridge Pose', 'Camel Pose'],
      followUpPoses: ['Child\'s Pose', 'Seated Forward Fold', 'Supine Twist']
    }
  },
  {
    id: 'camel-pose',
    emoji: '🐫',
    nameEnglish: 'Camel Pose',
    nameSanskrit: 'Ustrasana',
    category: 'backbend',
    difficulty: 'intermediate',
    duration: 30,
    imageUrl: '/src/assets/poses/camel-pose.svg',
    iyengarPhotoReference: 'Photo 41',
    description: 'A kneeling backbend that opens the entire front body. Can be emotionally releasing as it opens the heart center while building back strength.',
    instructions: [
      'Kneel with knees hip-width apart, shins and tops of feet on mat',
      'Place hands on lower back, fingers pointing down',
      'Engage thighs and draw tailbone down toward knees',
      'Inhale and lift chest upward, drawing shoulder blades together',
      'Keep hips directly over knees (don\'t thrust hips forward)',
      'Option to reach one hand at a time to heels or blocks',
      'If accessible, bring both hands to heels or blocks beside feet',
      'Press hips forward, lifting chest toward ceiling',
      'Let head release back only if comfortable for neck',
      'Hold for 20-30 seconds, come up slowly on inhale'
    ],
    benefits: [
      'Deeply stretches entire front body: hip flexors, abdomen, chest, throat',
      'Strengthens back muscles and improves posture',
      'Opens shoulders and chest',
      'Stimulates abdominal organs and improves digestion',
      'Can be emotionally releasing and energizing',
      'Improves spinal flexibility'
    ],
    tips: [
      'Keep thighs perpendicular to floor - don\'t thrust hips forward',
      'Place blocks beside feet for hands to rest on',
      'Engage core to protect lower back',
      'Lift chest up and back rather than collapsing into lower back',
      'Come up slowly to avoid dizziness'
    ],
    commonMistakes: [
      'Hips thrust forward beyond knees',
      'Collapsing into lower back instead of even backbend',
      'Shoulders hunched or collapsed',
      'Dropping head back without neck support',
      'Holding breath or breathing shallowly'
    ],
    modifications: {
      beginner: 'Keep hands on lower back, toes tucked under for higher heel position',
      intermediate: 'Place blocks beside feet for hands',
      advanced: 'Untuck toes, reach hands to heels on mat',
      neck: 'Keep chin tucked toward chest, don\'t drop head back',
      knees: 'Place blanket under knees for padding'
    },
    breathingCues: 'Deep breathing into chest, exhale to deepen backbend',
    sequencingNotes: {
      warmUp: ['Cat-Cow', 'Sphinx Pose', 'Cobra Pose', 'Bridge Pose'],
      counterPoses: ['Child\'s Pose (essential - hold 1-2 minutes)', 'Seated Forward Fold'],
      contraindications: ['Serious back or neck injury', 'High or low blood pressure', 'Migraine', 'Insomnia'],
      preparatoryPoses: ['Bridge Pose', 'Cobra Pose', 'Bow Pose'],
      followUpPoses: ['Child\'s Pose', 'Seated Forward Fold', 'Downward Dog'],
      iyengarNote: 'Iyengar emphasizes keeping thighs perpendicular and lifting chest rather than collapsing into lumbar spine'
    }
  },

  // ==================== TWISTS ====================
  {
    id: 'seated-spinal-twist',
    emoji: '🌀',
    nameEnglish: 'Seated Spinal Twist',
    nameSanskrit: 'Ardha Matsyendrasana',
    category: 'twist',
    difficulty: 'intermediate',
    duration: 45,
    requiresBothSides: true,
    imageUrl: '/src/assets/poses/seated-spinal-twist.svg',
    iyengarPhotoReference: 'Photo 311',
    description: 'A classic seated twist that wrings out the spine and massages internal organs. Named after the great yogi Matsyendra, this pose improves spinal flexibility and digestion.',
    instructions: [
      'Sit with legs extended forward',
      'Bend right knee and place right foot outside left thigh, close to knee',
      'Bend left knee and tuck left foot beside right hip (or keep extended)',
      'Sit tall, lengthening spine on inhale',
      'Exhale and twist torso to right',
      'Place right hand on floor behind sacrum',
      'Bring left elbow outside right knee or hug knee with left arm',
      'On each inhale, lengthen spine; on each exhale, twist deeper',
      'Keep both sitting bones grounded',
      'Gaze over right shoulder',
      'Hold 30-45 seconds, release slowly, repeat other side'
    ],
    benefits: [
      'Increases spinal flexibility and rotation',
      'Massages abdominal organs, improving digestion',
      'Stimulates liver and kidneys',
      'Relieves menstrual discomfort and fatigue',
      'Stretches shoulders, hips, and neck',
      'Energizes the spine and nervous system'
    ],
    tips: [
      'Lengthen spine before twisting - height first, twist second',
      'Keep both sitting bones equally grounded',
      'Use each inhale to create length, each exhale to twist',
      'Twist from the entire spine, not just shoulders',
      'Start with easier variation: bottom leg extended'
    ],
    commonMistakes: [
      'Rounding spine instead of staying tall',
      'Lifting sitting bone off floor',
      'Forcing the twist from shoulders only',
      'Holding breath',
      'Collapsing into the twist'
    ],
    modifications: {
      beginner: 'Keep bottom leg extended straight, use only arm pressure (not elbow hook)',
      intermediate: 'Hook elbow outside bent knee',
      advanced: 'Bind arms behind back in full Matsyendrasana',
      tight: 'Sit on folded blanket to tilt pelvis forward',
      pregnancy: 'Twist gently away from bent knee (open twist)'
    },
    breathingCues: 'Inhale to lengthen spine, exhale to revolve deeper',
    sequencingNotes: {
      warmUp: ['Cat-Cow', 'Seated Forward Fold', 'Easy Pose with side bends'],
      counterPoses: ['Seated Forward Fold', 'Child\'s Pose'],
      contraindications: ['Back or spine injury', 'Recent abdominal surgery'],
      preparatoryPoses: ['Supine Twist', 'Easy seated twists'],
      followUpPoses: ['Seated Forward Fold', 'Bound Angle Pose'],
      sequencingRule: 'Practice twists after backbends as counter-pose, or after forward folds'
    }
  },
  {
    id: 'sage-twist',
    emoji: '🧘',
    nameEnglish: 'Sage Twist',
    nameSanskrit: 'Marichyasana III',
    category: 'twist',
    difficulty: 'intermediate',
    duration: 45,
    requiresBothSides: true,
    imageUrl: '/src/assets/poses/sage-twist.svg',
    iyengarPhotoReference: 'Photo 303',
    description: 'Named after the sage Marichi, this twist combines forward fold and spinal rotation. Excellent for digestion and spinal health.',
    instructions: [
      'Sit with legs extended forward, spine tall',
      'Bend right knee and place right foot flat on floor close to right sitting bone',
      'Keep left leg extended and active, foot flexed',
      'Inhale and raise left arm overhead, lengthening spine',
      'Exhale and twist torso to right',
      'Wrap left arm around outside of right knee',
      'Place right hand on floor behind sacrum',
      'On each inhale, lengthen through crown of head',
      'On each exhale, twist deeper from belly, then ribs, then chest',
      'Keep right foot grounded and left leg strong',
      'Hold 30-45 seconds, release mindfully, switch sides'
    ],
    benefits: [
      'Tones and massages abdominal organs',
      'Improves digestion and elimination',
      'Increases spinal flexibility and rotation',
      'Stretches shoulders and back muscles',
      'Stimulates liver, kidneys, and spleen',
      'Calms the mind and relieves mild backache'
    ],
    tips: [
      'Keep extended leg very active - pressing through heel',
      'Ground both sitting bones equally',
      'Twist from deep in the belly, spiraling upward',
      'Use extended leg\'s strength to deepen twist',
      'Keep bent knee foot close to sitting bone'
    ],
    commonMistakes: [
      'Extended leg passive or turning outward',
      'Lifting opposite sitting bone off floor',
      'Rounding spine instead of maintaining length',
      'Bent knee foot too far from sitting bone',
      'Forcing twist from shoulders only'
    ],
    modifications: {
      beginner: 'Keep hand on knee instead of wrapping arm',
      intermediate: 'Full arm wrap as described',
      advanced: 'Bind hands behind back in full twist',
      tight: 'Sit on folded blanket to elevate hips',
      hamstrings: 'Bend extended leg slightly'
    },
    breathingCues: 'Inhale to extend spine, exhale to revolve deeper',
    sequencingNotes: {
      warmUp: ['Seated Forward Fold', 'Supine Twist', 'Cat-Cow'],
      counterPoses: ['Seated Forward Fold', 'Child\'s Pose'],
      contraindications: ['Diarrhea', 'Headache', 'High or low blood pressure', 'Spine injury'],
      preparatoryPoses: ['Seated Forward Fold', 'Ardha Matsyendrasana'],
      followUpPoses: ['Seated Forward Fold', 'Janu Sirsasana'],
      iyengarNote: 'Focus on grounding sitting bones and keeping extended leg strongly engaged'
    }
  },
  {
    id: 'revolved-head-to-knee',
    emoji: '🔄',
    nameEnglish: 'Revolved Head-to-Knee Pose',
    nameSanskrit: 'Parivrtta Janu Sirsasana',
    category: 'twist',
    difficulty: 'advanced',
    duration: 45,
    requiresBothSides: true,
    imageUrl: '/src/assets/poses/revolved-head-to-knee.svg',
    iyengarPhotoReference: 'Photo 328',
    description: 'An advanced seated twist that combines side bending with spinal rotation. Opens the side body deeply while twisting the spine and stretching the hamstrings.',
    instructions: [
      'Sit with legs wide apart in a V shape',
      'Bend right knee and bring right heel to inner left thigh',
      'Turn torso to face over extended left leg',
      'Inhale and reach right arm up and over toward left foot',
      'Exhale and side bend to left, reaching for left foot with right hand',
      'Rotate chest and ribcage toward ceiling',
      'Extend left arm overhead, reaching toward right foot if possible',
      'Keep left leg straight and active, foot flexed',
      'Spiral chest open toward sky',
      'Hold 30-45 seconds, come up on inhale, switch sides'
    ],
    benefits: [
      'Deeply stretches hamstrings, groin, and side body',
      'Opens shoulders and chest',
      'Stimulates abdominal organs and improves digestion',
      'Calms the brain and relieves mild depression',
      'Stretches spine and increases flexibility',
      'Therapeutic for anxiety and fatigue'
    ],
    tips: [
      'Focus on rotating chest toward ceiling, not just side bending',
      'Keep extended leg strongly engaged',
      'Use strap around foot if cannot reach',
      'Bottom ribs should lift and rotate, not collapse',
      'This is more about the twist than touching head to knee'
    ],
    commonMistakes: [
      'Collapsing into side bend without rotation',
      'Extended leg turning inward or bending',
      'Forcing head toward knee',
      'Bottom shoulder dropping forward',
      'Losing the twist in effort to reach foot'
    ],
    modifications: {
      beginner: 'Use strap around extended foot, reduce side bend depth',
      intermediate: 'Reach toward foot without strap, focus on chest rotation',
      advanced: 'Clasp hands around foot, bring head toward shin',
      tight: 'Place bolster under bent knee for support',
      hamstrings: 'Bend extended leg slightly'
    },
    breathingCues: 'Inhale to lengthen and lift, exhale to twist and side bend deeper',
    sequencingNotes: {
      warmUp: ['Seated Wide-Legged Forward Fold', 'Simple seated twists', 'Side stretches'],
      counterPoses: ['Child\'s Pose', 'Seated Forward Fold with legs together'],
      contraindications: ['Diarrhea', 'Asthma', 'Lower back injury'],
      preparatoryPoses: ['Seated Forward Fold', 'Wide-Legged Forward Fold', 'Simple side bends', 'Ardha Matsyendrasana'],
      followUpPoses: ['Seated Forward Fold', 'Bound Angle Pose', 'Supine Twist'],
      iyengarNote: 'Emphasize the rotation of the ribcage toward ceiling rather than depth of side bend'
    }
  },

  // ==================== INVERSIONS ====================
  {
    id: 'shoulder-stand-prep',
    emoji: '🧘',
    nameEnglish: 'Shoulder Stand Prep',
    nameSanskrit: 'Salamba Sarvangasana (Supported)',
    category: 'inversion',
    difficulty: 'intermediate',
    duration: 60,
    iyengarPhotoReference: 'Photo 223',
    imageUrl: '/src/assets/poses/shoulder-stand-prep.svg',
    description: 'The "Queen of Asanas" in Iyengar yoga. A supported inversion that calms the nervous system, improves circulation, and reverses the effects of gravity. This preparatory version uses props for safety and accessibility.',
    instructions: [
      'Place 2-3 folded blankets under shoulders, head on floor',
      'Lie on back with knees bent, feet flat',
      'Press arms and feet down, lift hips and back',
      'Support lower back with hands, elbows shoulder-width',
      'Walk shoulders under, lift chest toward chin',
      'Slowly extend legs upward, keeping hand support',
      'Weight on shoulders and upper arms, NOT neck',
      'Keep legs together, feet flexed or pointed',
      'Hold for 1-3 minutes initially',
      'To exit: bend knees, slowly roll spine down'
    ],
    benefits: [
      'Calms the brain and nervous system',
      'Improves circulation and lymphatic drainage',
      'Stimulates thyroid and parathyroid glands',
      'Relieves tired legs and varicose veins',
      'Helps reduce stress and mild depression',
      'Therapeutic for insomnia and fatigue',
      'Improves digestion and metabolism',
      'Reverses effects of gravity on organs'
    ],
    tips: [
      'Use 2-3 firm folded blankets under shoulders',
      'Keep at least 1-2 inches between blanket edge and neck',
      'Never turn head while in pose',
      'Focus on lifting chest to chin, not chin to chest',
      'Keep weight off neck - shoulders bear the load',
      'Practice against wall for stability when learning'
    ],
    commonMistakes: [
      'Weight on neck instead of shoulders - risk of injury',
      'Turning head while in pose',
      'Insufficient shoulder support/padding',
      'Elbows too wide - keep shoulder-width apart',
      'Rushing into pose without proper warm-up',
      'Holding breath - breathe naturally'
    ],
    modifications: {
      beginner: 'Legs up the wall variation, or keep knees bent',
      intermediate: 'Use blanket support as described',
      advanced: 'Full Salamba Sarvangasana without prop support',
      neck: 'Skip this pose entirely - choose alternative inversions',
      menstruation: 'Avoid inversions during first 2-3 days (traditional Iyengar guidance)'
    },
    breathingCues: 'Natural breathing, do not hold breath. Long smooth breaths.',
    sequencingNotes: {
      warmUp: ['Downward Dog', 'Standing poses to warm legs', 'Cat-Cow for spine mobility'],
      counterPoses: ['Fish Pose (Matsyasana) - REQUIRED', 'Bridge Pose', 'Gentle backbend to neutralize cervical spine'],
      contraindications: [
        'High blood pressure (uncontrolled)',
        'Neck injury or cervical spine issues',
        'Glaucoma or detached retina',
        'Heart conditions',
        'Menstruation (traditional Iyengar guidance - first 2-3 days)',
        'Pregnancy (second and third trimester)',
        'Headache or migraine',
        'Recent shoulder injury'
      ],
      preparatoryPoses: ['Downward Dog', 'Bridge Pose', 'Legs Up Wall'],
      followUpPoses: ['Fish Pose or Bridge Pose (ESSENTIAL)', 'Child\'s Pose', 'Seated Forward Fold'],
      iyengarNote: 'Shoulderstand MUST be followed by a counter-pose. Never end practice with this pose. Build hold time gradually: 1-5 minutes intermediate, 5-15 minutes advanced. Considered a daily practice pose in Iyengar method.'
    }
  },
  {
    id: 'plow-pose',
    emoji: '🌙',
    nameEnglish: 'Plow Pose',
    nameSanskrit: 'Halasana',
    category: 'inversion',
    difficulty: 'intermediate',
    duration: 45,
    iyengarPhotoReference: 'Photo 244',
    imageUrl: '/src/assets/poses/plow-pose.svg',
    description: 'An inversion that deeply stretches the spine and shoulders. Often practiced after Shoulder Stand as a natural progression or alternative. Calms the nervous system and stimulates abdominal organs.',
    instructions: [
      'Begin from Shoulder Stand prep position',
      'Keep hands supporting lower back',
      'Slowly lower legs over head toward floor behind you',
      'Keep legs straight, feet flexed',
      'If toes touch floor, release hands and interlace fingers',
      'Press arms into floor, lift thighs toward ceiling',
      'Keep weight on shoulders, not neck',
      'Breathe steadily for 30-60 seconds',
      'To exit: support back with hands, slowly roll down'
    ],
    benefits: [
      'Stretches shoulders, spine, and hamstrings',
      'Calms the nervous system',
      'Stimulates thyroid and abdominal organs',
      'Relieves stress and fatigue',
      'Therapeutic for backache',
      'Improves digestion',
      'Reduces insomnia',
      'Massages digestive organs'
    ],
    tips: [
      'Use same blanket setup as Shoulder Stand',
      'Keep legs active and engaged',
      'Don\'t force feet to floor - use blocks or chair',
      'Keep breathing smooth and steady',
      'Practice after Shoulder Stand or as alternative',
      'Never turn head while in pose'
    ],
    commonMistakes: [
      'Weight on neck instead of shoulders',
      'Forcing feet to floor',
      'Collapsing through mid-back',
      'Holding breath',
      'Bending knees excessively',
      'Turning head'
    ],
    modifications: {
      beginner: 'Place chair behind head, rest feet on seat',
      intermediate: 'Toes on blocks or bolster behind head',
      advanced: 'Toes on floor with arms extended',
      tight: 'Significantly bend knees toward forehead',
      support: 'Keep hands on back for full duration'
    },
    breathingCues: 'Slow, deep breaths. Exhale to soften deeper into pose.',
    sequencingNotes: {
      warmUp: ['Shoulder Stand', 'Downward Dog', 'Seated Forward Fold'],
      counterPoses: ['Fish Pose or Bridge Pose (REQUIRED)', 'Gentle backbend to neutralize spine'],
      contraindications: [
        'Same as Shoulder Stand - neck injury, high blood pressure',
        'Diarrhea',
        'Neck injury',
        'Asthma (during active attack)',
        'Pregnancy',
        'Menstruation (traditional guidance)',
        'Recent shoulder surgery',
        'Glaucoma or retinal issues'
      ],
      preparatoryPoses: ['Shoulder Stand', 'Bridge Pose', 'Seated Forward Fold'],
      followUpPoses: ['Fish Pose (ESSENTIAL)', 'Bridge Pose', 'Child\'s Pose'],
      iyengarNote: 'Always follow with neck-releasing counter-pose. Classic inversion in Iyengar sequences. Use props liberally - feet need not touch floor.'
    }
  },
  {
    id: 'dolphin-pose',
    emoji: '🐬',
    nameEnglish: 'Dolphin Pose',
    nameSanskrit: 'Ardha Pincha Mayurasana',
    category: 'inversion',
    difficulty: 'intermediate',
    duration: 30,
    iyengarPhotoReference: 'Photo 477',
    imageUrl: '/src/assets/poses/dolphin-pose.svg',
    description: 'A forearm variation of Downward Dog that builds shoulder strength and prepares for Forearm Stand. Safer inversion for those with wrist issues.',
    instructions: [
      'Start on hands and knees',
      'Lower forearms to floor, elbows shoulder-width apart',
      'Interlace fingers or keep palms flat and parallel',
      'Tuck toes and lift hips up and back',
      'Walk feet toward elbows if flexible',
      'Press forearms firmly into floor',
      'Let head hang between arms',
      'Keep legs as straight as comfortable',
      'Hold for 30-60 seconds',
      'Lower knees to release'
    ],
    benefits: [
      'Strengthens arms, shoulders, and core',
      'Stretches hamstrings, calves, and arches',
      'Prepares for more advanced inversions',
      'Calms the brain and relieves stress',
      'Helps relieve headaches',
      'Builds upper body strength',
      'Gentle inversion benefits without full inversion',
      'Wrist-friendly alternative to Downward Dog'
    ],
    tips: [
      'Keep elbows shoulder-width - use strap around upper arms',
      'Press strongly through forearms',
      'Draw shoulder blades toward hips',
      'Bend knees to focus on shoulder strength',
      'Use blocks between hands to prevent elbow widening',
      'Practice against wall for alignment'
    ],
    commonMistakes: [
      'Elbows splaying wider than shoulders',
      'Dumping weight into shoulders',
      'Rounding upper back',
      'Head hanging too heavily',
      'Feet too far from elbows',
      'Holding breath'
    ],
    modifications: {
      beginner: 'Keep knees bent, focus on shoulder engagement',
      wrists: 'Perfect alternative to Downward Dog',
      advanced: 'Walk feet closer, shift weight forward',
      strength: 'Use as preparation for Forearm Stand',
      support: 'Practice with heels against wall'
    },
    breathingCues: 'Deep ujjayi breathing, focus on steady inhales and exhales',
    sequencingNotes: {
      warmUp: ['Downward Dog', 'Plank Pose', 'Cat-Cow'],
      counterPoses: ['Child\'s Pose', 'Puppy Pose to release shoulders'],
      contraindications: [
        'Shoulder injury or recent surgery',
        'Neck injury (keep head neutral)',
        'High blood pressure (use caution)',
        'Headache (skip during active headache)',
        'Pregnancy (later stages - consult teacher)'
      ],
      preparatoryPoses: ['Downward Dog', 'Plank Pose', 'Child\'s Pose'],
      followUpPoses: ['Child\'s Pose', 'Downward Dog', 'Forearm Stand (advanced)'],
      iyengarNote: 'Foundation pose for advanced inversions. Can be practiced daily to build strength. Excellent preparation for Pincha Mayurasana (Forearm Stand).'
    }
  },

  // ==================== BALANCE & CORE ====================
  {
    id: 'side-plank',
    emoji: '💪',
    nameEnglish: 'Side Plank',
    nameSanskrit: 'Vasisthasana',
    category: 'balance',
    difficulty: 'intermediate',
    duration: 30,
    requiresBothSides: true,
    iyengarPhotoReference: 'Photo 398',
    imageUrl: '/src/assets/poses/side-plank.svg',
    description: 'A powerful arm balance that strengthens the entire side body, arms, and core. Builds mental focus and physical stamina.',
    instructions: [
      'Start in Plank Pose',
      'Shift weight onto right hand and outer edge of right foot',
      'Stack left foot on top of right',
      'Engage core and lift hips high',
      'Extend left arm straight up toward ceiling',
      'Stack shoulders, hips, and ankles in one line',
      'Gaze up at top hand or forward',
      'Keep bottom hand firmly pressing into floor',
      'Hold for 15-30 seconds',
      'Return to Plank, switch sides'
    ],
    benefits: [
      'Strengthens arms, wrists, and shoulders',
      'Tones obliques and core muscles',
      'Improves balance and concentration',
      'Strengthens legs and glutes',
      'Builds wrist and arm stability',
      'Develops full-body coordination',
      'Improves sense of balance'
    ],
    tips: [
      'Keep hips lifted high - don\'t sag',
      'Press firmly through bottom hand',
      'Engage legs strongly',
      'Stack body in one plane',
      'Use blocks under bottom hand for less intensity',
      'Practice against wall for stability'
    ],
    commonMistakes: [
      'Hips sagging toward floor',
      'Bottom shoulder collapsing',
      'Feet not stacked (wobbly balance)',
      'Head dropping down',
      'Not engaging core',
      'Holding breath'
    ],
    modifications: {
      beginner: 'Lower bottom knee to floor for support',
      intermediate: 'Stack feet or place top foot in front',
      advanced: 'Lift top leg or hold toe with top hand',
      wrists: 'Come down to forearm side plank',
      balance: 'Practice with back against wall'
    },
    breathingCues: 'Steady breath, exhale to engage core and lift higher',
    sequencingNotes: {
      warmUp: ['Plank Pose', 'Downward Dog', 'Warrior II for leg strength'],
      counterPoses: ['Child\'s Pose to rest arms and wrists'],
      contraindications: [
        'Wrist, elbow, or shoulder injury',
        'Carpal tunnel syndrome (modify to forearm)',
        'Recent arm or shoulder surgery'
      ],
      preparatoryPoses: ['Plank Pose', 'Downward Dog', 'Warrior II'],
      followUpPoses: ['Child\'s Pose', 'Downward Dog'],
      iyengarNote: 'Excellent for building full-body strength and stability. Focus on alignment over duration. Build hold time gradually, 10-15 seconds to start.'
    }
  },
  {
    id: 'crow-pose',
    emoji: '🦅',
    nameEnglish: 'Crow Pose',
    nameSanskrit: 'Bakasana',
    category: 'balance',
    difficulty: 'advanced',
    duration: 20,
    iyengarPhotoReference: 'Photo 406',
    imageUrl: '/src/assets/poses/crow-pose.svg',
    description: 'An arm balance that requires strength, balance, and courage. Crow Pose builds confidence and mental focus while strengthening the entire upper body.',
    instructions: [
      'Start in a squat with feet hip-width apart',
      'Place hands on floor shoulder-width apart',
      'Spread fingers wide, press firmly through fingertips',
      'Bend elbows slightly, making a shelf with upper arms',
      'Place knees on backs of upper arms (near armpits)',
      'Lean weight forward, engage core',
      'Lift one foot, then the other, off the floor',
      'Bring feet together, gaze forward',
      'Hold for 5-20 seconds',
      'Lower feet with control'
    ],
    benefits: [
      'Strengthens arms, wrists, and shoulders',
      'Builds core strength and stability',
      'Improves balance and coordination',
      'Develops mental focus and courage',
      'Tones abdominal muscles',
      'Increases body awareness',
      'Builds confidence in inversions'
    ],
    tips: [
      'Engage core before lifting feet',
      'Look forward, not down at hands',
      'Keep elbows over wrists',
      'Round upper back to create a shelf',
      'Practice over pillow when learning',
      'Start by lifting one foot at a time',
      'Squeeze knees toward arms'
    ],
    commonMistakes: [
      'Arms too straight - keep slight bend',
      'Looking down instead of forward',
      'Not engaging core',
      'Knees too low on arms',
      'Butt too low - lift hips high',
      'Fear of falling forward',
      'Forgetting to breathe'
    ],
    modifications: {
      beginner: 'Place block under forehead as safety net',
      learning: 'Lift one foot at a time',
      wrists: 'Practice with hands on blocks',
      advanced: 'Extend into Crane Pose (arms straight)',
      fear: 'Practice over cushions or bolster'
    },
    breathingCues: 'Steady breath in preparation. Exhale to lift, breathe normally while holding',
    sequencingNotes: {
      warmUp: ['Plank Pose', 'Downward Dog', 'Malasana (squat)', 'Cat-Cow for wrist warm-up'],
      counterPoses: ['Child\'s Pose', 'Downward Dog to rest wrists'],
      contraindications: [
        'Wrist injury or carpal tunnel',
        'Shoulder injury',
        'Pregnancy',
        'Recent abdominal surgery',
        'Elbow injury'
      ],
      preparatoryPoses: ['Plank Pose', 'Downward Dog', 'Malasana', 'Cat-Cow'],
      followUpPoses: ['Child\'s Pose', 'Downward Dog', 'Forward Fold'],
      iyengarNote: 'Gateway to more advanced arm balances. Focus on building foundation strength first. May take weeks or months to achieve - be patient.'
    }
  },
  {
    id: 'low-lunge',
    emoji: '🏃',
    nameEnglish: 'Low Lunge',
    nameSanskrit: 'Anjaneyasana',
    category: 'balance',
    difficulty: 'beginner',
    duration: 30,
    requiresBothSides: true,
    iyengarPhotoReference: 'Photo 53',
    imageUrl: '/src/assets/poses/low-lunge.svg',
    description: 'A gentle hip opener that stretches the hip flexors and strengthens the legs. Creates length in the front body while building stability.',
    instructions: [
      'From Downward Dog, step right foot between hands',
      'Lower left knee to floor, untuck toes',
      'Align right knee over ankle',
      'Place hands on front thigh or reach arms overhead',
      'Sink hips forward and down',
      'Lift chest and draw shoulders back',
      'Keep front knee tracking over middle toe',
      'Option to lift back knee off floor for more intensity',
      'Hold for 5-8 breaths',
      'Step back to Downward Dog and switch sides'
    ],
    benefits: [
      'Opens hip flexors and quadriceps',
      'Stretches groin and inner thighs',
      'Strengthens legs and ankles',
      'Improves balance and stability',
      'Opens chest and shoulders',
      'Energizes the body',
      'Prepares for deeper backbends',
      'Counteracts effects of sitting'
    ],
    tips: [
      'Place blanket under back knee for comfort',
      'Keep front knee behind toes',
      'Press firmly through front heel',
      'Engage core to protect lower back',
      'Reach up through fingertips when arms are raised',
      'Look up gently if neck allows'
    ],
    commonMistakes: [
      'Front knee beyond ankle',
      'Arching lower back excessively',
      'Hips not squared forward',
      'Back knee too far back (not enough hip stretch)',
      'Shoulders tensing up to ears',
      'Collapsing into front hip'
    ],
    modifications: {
      beginner: 'Keep hands on floor or front thigh',
      knees: 'Place folded blanket under back knee',
      balance: 'Keep hands on blocks for support',
      advanced: 'Lift back knee, add gentle backbend',
      gentle: 'Keep arms down or at heart center'
    },
    breathingCues: 'Inhale to lift chest, exhale to sink hips deeper',
    sequencingNotes: {
      warmUp: ['Cat-Cow for hip mobility', 'Downward Dog', 'Standing poses'],
      counterPoses: ['Forward fold', 'Child\'s Pose'],
      contraindications: [
        'Knee injury (pad well or skip)',
        'Hip injury or replacement',
        'High blood pressure (keep arms down)'
      ],
      preparatoryPoses: ['Cat-Cow', 'Downward Dog', 'Standing poses'],
      followUpPoses: ['Forward fold', 'Child\'s Pose', 'Warrior poses'],
      iyengarNote: 'Foundation pose for hip opening. Essential for counteracting modern sedentary lifestyle. Classic pose in sun salutation variations.'
    }
  },
  {
    id: 'high-lunge',
    emoji: '🚀',
    nameEnglish: 'High Lunge',
    nameSanskrit: 'Utthita Ashwa Sanchalanasana (Crescent Pose)',
    category: 'balance',
    difficulty: 'beginner',
    duration: 30,
    requiresBothSides: true,
    imageUrl: '/src/assets/poses/high-lunge.svg',
    description: 'An energizing standing pose that builds leg strength and opens the hip flexors. Creates heat and develops focus while improving balance.',
    instructions: [
      'From Downward Dog, step right foot forward between hands',
      'Lift back heel high, keep back leg straight and strong',
      'Align front knee over ankle',
      'Square hips toward front of mat',
      'Engage both legs strongly',
      'Inhale and reach arms overhead',
      'Draw shoulders away from ears',
      'Lift through chest, lengthen tailbone down',
      'Gaze forward or up at thumbs',
      'Hold for 5-8 breaths, switch sides'
    ],
    benefits: [
      'Strengthens legs, glutes, and core',
      'Opens hip flexors and quadriceps',
      'Improves balance and stability',
      'Builds stamina and endurance',
      'Stretches chest and shoulders',
      'Develops focus and concentration',
      'Energizes entire body',
      'Prepares for Warrior I and III'
    ],
    tips: [
      'Keep back heel lifted high throughout',
      'Engage back leg as strongly as front leg',
      'Draw front hip back, back hip forward',
      'Keep front knee tracking over middle toe',
      'Press firmly through front heel',
      'Lengthen spine rather than backbend'
    ],
    commonMistakes: [
      'Back heel dropping toward floor',
      'Front knee beyond ankle',
      'Back leg not engaged',
      'Arching lower back too much',
      'Hips not squared forward',
      'Shoulders hunched up',
      'Leaning too far forward'
    ],
    modifications: {
      beginner: 'Keep hands on hips or at heart center',
      balance: 'Shorten stance slightly',
      strength: 'Lower back knee to floor (Low Lunge)',
      advanced: 'Add gentle backbend with arms overhead',
      stability: 'Practice near wall for support'
    },
    breathingCues: 'Inhale to reach arms up, exhale to ground through legs',
    sequencingNotes: {
      warmUp: ['Standing poses', 'Sun Salutations', 'Downward Dog'],
      counterPoses: ['Forward fold', 'Child\'s Pose'],
      contraindications: [
        'Knee injury (modify or skip)',
        'Hip injury',
        'High blood pressure (keep arms down)',
        'Heart conditions (reduce intensity)'
      ],
      preparatoryPoses: ['Standing poses', 'Sun Salutations', 'Downward Dog'],
      followUpPoses: ['Warrior poses', 'Forward fold', 'Half Moon'],
      iyengarNote: 'Fundamental strengthening pose. Excellent for building leg power and hip flexibility. Transitions well to Warrior I, III, or Half Moon.'
    }
  }
];

// Helper function to get pose by ID
export const getPoseExtendedById = (id) => {
  return posesExtended.find(pose => pose.id === id);
};

// Helper function to filter poses by category
export const getBackbends = () => {
  return posesExtended.filter(pose => pose.category === 'backbend');
};

export const getTwists = () => {
  return posesExtended.filter(pose => pose.category === 'twist');
};

export const getInversions = () => {
  return posesExtended.filter(pose => pose.category === 'inversion');
};

export const getBalancePoses = () => {
  return posesExtended.filter(pose => pose.category === 'balance');
};

// Get poses by difficulty
export const getPosesExtendedByDifficulty = (difficulty) => {
  return posesExtended.filter(pose => pose.difficulty === difficulty);
};

// Get poses requiring both sides
export const getPosesRequiringBothSides = () => {
  return posesExtended.filter(pose => pose.requiresBothSides);
};

// Sequencing helper: Get required counter-poses for a backbend or inversion
export const getCounterPosesForBackbend = (poseId) => {
  const pose = getPoseExtendedById(poseId);
  if (pose?.category === 'backbend' && pose?.sequencingNotes?.counterPoses) {
    return pose.sequencingNotes.counterPoses;
  }
  return [];
};

export const getCounterPosesForInversion = (poseId) => {
  const pose = getPoseExtendedById(poseId);
  if (pose?.category === 'inversion' && pose?.sequencingNotes?.counterPoses) {
    return pose.sequencingNotes.counterPoses;
  }
  return [];
};

// Iyengar-specific: Check if pose requires counter-pose
export const requiresCounterPose = (poseId) => {
  const pose = getPoseExtendedById(poseId);
  if (!pose?.sequencingNotes?.counterPoses) return false;

  // Check if any counter-pose contains "REQUIRED" or "ESSENTIAL"
  return pose.sequencingNotes.counterPoses.some(cp =>
    typeof cp === 'string' && (cp.includes('REQUIRED') || cp.includes('ESSENTIAL'))
  );
};

// Get recommended counter-poses for any pose
export const getCounterPoses = (poseId) => {
  const pose = getPoseExtendedById(poseId);
  return pose?.sequencingNotes?.counterPoses || [];
};

// Validate if a pose is safe for user conditions
export const checkContraindications = (poseId, userConditions = []) => {
  const pose = getPoseExtendedById(poseId);
  if (!pose?.sequencingNotes?.contraindications) return { safe: true, conflicts: [] };

  const conflicts = pose.sequencingNotes.contraindications.filter(condition =>
    userConditions.some(userCondition =>
      condition.toLowerCase().includes(userCondition.toLowerCase())
    )
  );

  return {
    safe: conflicts.length === 0,
    conflicts: conflicts
  };
};

// Sequencing validator: Check if twists and backbends are not alternating
export const validateSequencing = (poseIds) => {
  const categories = poseIds.map(id => {
    const pose = getPoseExtendedById(id);
    return pose?.category;
  });

  // Check for alternating backbends and twists (not recommended)
  for (let i = 0; i < categories.length - 1; i++) {
    if (
      (categories[i] === 'backbend' && categories[i + 1] === 'twist') ||
      (categories[i] === 'twist' && categories[i + 1] === 'backbend')
    ) {
      return {
        valid: false,
        warning: 'Avoid alternating backbends and twists. Practice backbends with counter-poses, then twists separately.'
      };
    }
  }

  // Check if inversions requiring counter-poses have them
  for (let i = 0; i < poseIds.length; i++) {
    const currentPose = getPoseExtendedById(poseIds[i]);
    if (currentPose?.category === 'inversion' && requiresCounterPose(poseIds[i])) {
      // Check if next pose is a counter-pose
      if (i === poseIds.length - 1) {
        return {
          valid: false,
          warning: `${currentPose.nameEnglish} requires a counter-pose (Fish Pose or Bridge Pose). Never end practice with Shoulderstand or Plow.`
        };
      }
    }
  }

  return { valid: true };
};

// Export all poses combined (for use with main poses array if needed)
export default posesExtended;
