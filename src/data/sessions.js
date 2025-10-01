// Pre-built yoga sessions as per PRD requirements
export const sessions = [
  {
    id: 'morning-energizer',
    name: '5-min Morning Energizer',
    duration: 5, // minutes
    focus: 'energy',
    bodyPart: 'full',
    difficulty: 'beginner',
    description: 'A gentle way to wake up your body and mind',
    poses: [
      {
        poseId: 'mountain-pose',
        duration: 30, // seconds
        transition: 'Take a deep breath and step your feet apart'
      },
      {
        poseId: 'downward-dog',
        duration: 45,
        transition: 'Walk your feet forward and roll up slowly'
      },
      {
        poseId: 'warrior-one',
        duration: 30,
        side: 'right',
        transition: 'Step back and switch sides'
      },
      {
        poseId: 'warrior-one', // Other side
        duration: 30,
        side: 'left',
        transition: 'Return to center and find your balance'
      },
      {
        poseId: 'tree-pose',
        duration: 30,
        side: 'right',
        transition: 'Switch sides for tree pose'
      },
      {
        poseId: 'tree-pose', // Other side
        duration: 30,
        side: 'left',
        transition: 'Come down to the floor'
      },
      {
        poseId: 'cobra-pose',
        duration: 30,
        transition: 'Push back into child\'s pose'
      },
      {
        poseId: 'child-pose',
        duration: 60,
        transition: 'When ready, come to a comfortable seated position'
      }
    ]
  },
  {
    id: 'lunch-break-relief',
    name: '10-min Lunch Break Relief',
    duration: 10,
    focus: 'relax',
    bodyPart: 'back',
    difficulty: 'beginner',
    description: 'Release tension from your work day',
    poses: [
      {
        poseId: 'mountain-pose',
        duration: 30,
        transition: 'Ground yourself before we begin'
      },
      {
        poseId: 'seated-forward-fold',
        duration: 45,
        transition: 'Gently switch to the other side'
      },
      {
        poseId: 'seated-forward-fold', // Other side
        duration: 45,
        transition: 'Come to hands and knees'
      },
      {
        poseId: 'downward-dog',
        duration: 60,
        transition: 'Lower down to the floor'
      },
      {
        poseId: 'cobra-pose',
        duration: 45,
        transition: 'Push back to child\'s pose'
      },
      {
        poseId: 'child-pose',
        duration: 90,
        transition: 'Lie down for bridge pose'
      },
      {
        poseId: 'bridge-pose',
        duration: 45,
        transition: 'Lower down slowly'
      },
      {
        poseId: 'corpse-pose',
        duration: 120,
        transition: 'Find your final resting position'
      },
      {
        poseId: 'corpse-pose',
        duration: 120,
        transition: 'Take your time coming back to sitting'
      }
    ]
  },
  {
    id: 'evening-wind-down',
    name: '15-min Evening Wind-down',
    duration: 15,
    focus: 'relax',
    bodyPart: 'full',
    difficulty: 'beginner',
    description: 'Prepare your body and mind for restful sleep',
    poses: [
      {
        poseId: 'mountain-pose',
        duration: 30,
        transition: 'Let go of the day\'s stress'
      },
      {
        poseId: 'seated-forward-fold',
        duration: 60,
        transition: 'Switch to the other side'
      },
      {
        poseId: 'seated-forward-fold', // Other side
        duration: 60,
        transition: 'Come to hands and knees'
      },
      {
        poseId: 'downward-dog',
        duration: 60,
        transition: 'Walk feet toward hands'
      },
      {
        poseId: 'child-pose',
        duration: 120,
        transition: 'Slowly lie down on your back'
      },
      {
        poseId: 'bridge-pose',
        duration: 60,
        transition: 'Lower down and hug knees to chest'
      },
      {
        poseId: 'corpse-pose',
        duration: 180,
        transition: 'Move away from wall when ready'
      },
      {
        poseId: 'corpse-pose',
        duration: 300,
        transition: 'Rest here as long as you need'
      }
    ]
  },
  {
    id: 'quick-reset',
    name: '3-min Quick Reset',
    duration: 3,
    focus: 'relax',
    bodyPart: 'neck',
    difficulty: 'beginner',
    description: 'A quick micro-break to release neck and shoulder tension when you need it most',
    poses: [
      {
        poseId: 'mountain-pose',
        duration: 20,
        transition: 'Ground yourself and breathe'
      },
      {
        poseId: 'cat-cow',
        duration: 45,
        transition: 'Move slowly to child\'s pose'
      },
      {
        poseId: 'child-pose',
        duration: 60,
        transition: 'Come back to standing when ready'
      },
      {
        poseId: 'mountain-pose',
        duration: 20,
        transition: 'Notice how you feel now'
      }
    ]
  },
  {
    id: 'desk-relief',
    name: '7-min Desk Relief',
    duration: 7,
    focus: 'energy',
    bodyPart: 'back',
    difficulty: 'beginner',
    description: 'Standing poses to counteract hours of sitting',
    poses: [
      {
        poseId: 'mountain-pose',
        duration: 30,
        transition: 'Take a deep breath'
      },
      {
        poseId: 'downward-dog',
        duration: 45,
        transition: 'Walk feet toward hands'
      },
      {
        poseId: 'warrior-one',
        duration: 30,
        side: 'right',
        transition: 'Switch sides'
      },
      {
        poseId: 'warrior-one',
        duration: 30,
        side: 'left',
        transition: 'Step to warrior two'
      },
      {
        poseId: 'warrior-two',
        duration: 30,
        side: 'right',
        transition: 'Switch sides'
      },
      {
        poseId: 'warrior-two',
        duration: 30,
        side: 'left',
        transition: 'Come to triangle pose'
      },
      {
        poseId: 'triangle-pose',
        duration: 30,
        side: 'right',
        transition: 'Switch sides'
      },
      {
        poseId: 'triangle-pose',
        duration: 30,
        side: 'left',
        transition: 'Return to standing'
      },
      {
        poseId: 'mountain-pose',
        duration: 30,
        transition: 'Feel energized and refreshed'
      }
    ]
  },
  {
    id: 'hip-openers',
    name: '10-min Hip Openers',
    duration: 10,
    focus: 'flexibility',
    bodyPart: 'hips',
    difficulty: 'intermediate',
    description: 'Release tight hips with gentle, deep stretches',
    poses: [
      {
        poseId: 'child-pose',
        duration: 45,
        transition: 'Prepare for hip opening'
      },
      {
        poseId: 'pigeon-pose',
        duration: 90,
        side: 'right',
        transition: 'Switch sides'
      },
      {
        poseId: 'pigeon-pose',
        duration: 90,
        side: 'left',
        transition: 'Roll onto your back'
      },
      {
        poseId: 'happy-baby',
        duration: 60,
        transition: 'Rock gently side to side'
      },
      {
        poseId: 'supine-twist',
        duration: 60,
        side: 'right',
        transition: 'Switch sides'
      },
      {
        poseId: 'supine-twist',
        duration: 60,
        side: 'left',
        transition: 'Rest in final relaxation'
      },
      {
        poseId: 'corpse-pose',
        duration: 90,
        transition: 'Absorb the benefits'
      }
    ]
  },
  {
    id: 'sleep-prep',
    name: '12-min Sleep Prep',
    duration: 12,
    focus: 'relax',
    bodyPart: 'full',
    difficulty: 'beginner',
    description: 'Gentle restorative poses for better sleep',
    poses: [
      {
        poseId: 'child-pose',
        duration: 90,
        transition: 'Let go of the day'
      },
      {
        poseId: 'seated-forward-fold',
        duration: 90,
        transition: 'Breathe deeply'
      },
      {
        poseId: 'supine-twist',
        duration: 60,
        side: 'right',
        transition: 'Switch sides'
      },
      {
        poseId: 'supine-twist',
        duration: 60,
        side: 'left',
        transition: 'Draw knees to chest'
      },
      {
        poseId: 'happy-baby',
        duration: 60,
        transition: 'Prepare for legs up the wall'
      },
      {
        poseId: 'legs-up-wall',
        duration: 180,
        transition: 'Stay as long as you like'
      },
      {
        poseId: 'corpse-pose',
        duration: 120,
        transition: 'Drift into peaceful rest'
      }
    ]
  },
  {
    id: 'core-flow',
    name: '15-min Core Flow',
    duration: 15,
    focus: 'strength',
    bodyPart: 'core',
    difficulty: 'intermediate',
    description: 'Build core strength and stability with dynamic poses that challenge your balance and power',
    poses: [
      {
        poseId: 'mountain-pose',
        duration: 30,
        transition: 'Center yourself'
      },
      {
        poseId: 'downward-dog',
        duration: 45,
        transition: 'Move to plank'
      },
      {
        poseId: 'plank-pose',
        duration: 30,
        transition: 'Lower to cobra'
      },
      {
        poseId: 'cobra-pose',
        duration: 30,
        transition: 'Back to plank'
      },
      {
        poseId: 'plank-pose',
        duration: 30,
        transition: 'Step forward to warrior one'
      },
      {
        poseId: 'warrior-one',
        duration: 30,
        side: 'right',
        transition: 'Switch sides'
      },
      {
        poseId: 'warrior-one',
        duration: 30,
        side: 'left',
        transition: 'Come down for boat pose'
      },
      {
        poseId: 'boat-pose',
        duration: 30,
        transition: 'Rest briefly'
      },
      {
        poseId: 'boat-pose',
        duration: 30,
        transition: 'One more round'
      },
      {
        poseId: 'boat-pose',
        duration: 30,
        transition: 'Move to bridge'
      },
      {
        poseId: 'bridge-pose',
        duration: 45,
        transition: 'Lower down'
      },
      {
        poseId: 'supine-twist',
        duration: 45,
        side: 'right',
        transition: 'Switch sides'
      },
      {
        poseId: 'supine-twist',
        duration: 45,
        side: 'left',
        transition: 'Final rest'
      },
      {
        poseId: 'corpse-pose',
        duration: 120,
        transition: 'Absorb your practice'
      }
    ]
  },
  {
    id: 'balance-challenge',
    name: '20-min Balance Challenge',
    duration: 20,
    focus: 'balance',
    bodyPart: 'full',
    difficulty: 'intermediate',
    description: 'Test and refine your balance with progressively challenging poses that build focus and stability',
    poses: [
      {
        poseId: 'mountain-pose',
        duration: 30,
        transition: 'Find your center'
      },
      {
        poseId: 'tree-pose',
        duration: 45,
        side: 'right',
        transition: 'Switch sides'
      },
      {
        poseId: 'tree-pose',
        duration: 45,
        side: 'left',
        transition: 'Step to warrior three'
      },
      {
        poseId: 'downward-dog',
        duration: 45,
        transition: 'Prepare for eagle'
      },
      {
        poseId: 'eagle-pose',
        duration: 30,
        side: 'right',
        transition: 'Switch sides'
      },
      {
        poseId: 'eagle-pose',
        duration: 30,
        side: 'left',
        transition: 'Move to triangle'
      },
      {
        poseId: 'triangle-pose',
        duration: 30,
        side: 'right',
        transition: 'Prepare for half moon'
      },
      {
        poseId: 'half-moon',
        duration: 30,
        side: 'right',
        transition: 'Switch sides carefully'
      },
      {
        poseId: 'half-moon',
        duration: 30,
        side: 'left',
        transition: 'Return to standing'
      },
      {
        poseId: 'tree-pose',
        duration: 45,
        side: 'right',
        transition: 'Switch sides'
      },
      {
        poseId: 'tree-pose',
        duration: 45,
        side: 'left',
        transition: 'Come down to seated'
      },
      {
        poseId: 'boat-pose',
        duration: 30,
        transition: 'Release'
      },
      {
        poseId: 'seated-forward-fold',
        duration: 90,
        transition: 'Lie down'
      },
      {
        poseId: 'bridge-pose',
        duration: 45,
        transition: 'Lower down'
      },
      {
        poseId: 'supine-twist',
        duration: 45,
        side: 'right',
        transition: 'Switch sides'
      },
      {
        poseId: 'supine-twist',
        duration: 45,
        side: 'left',
        transition: 'Final rest'
      },
      {
        poseId: 'corpse-pose',
        duration: 180,
        transition: 'Celebrate your practice'
      }
    ]
  },
  {
    id: 'full-practice',
    name: '30-min Full Practice',
    duration: 30,
    focus: 'full',
    bodyPart: 'full',
    difficulty: 'intermediate',
    description: 'A comprehensive flow combining strength, flexibility, and balance for a complete practice',
    poses: [
      {
        poseId: 'mountain-pose',
        duration: 30,
        transition: 'Set your intention'
      },
      {
        poseId: 'cat-cow',
        duration: 60,
        transition: 'Warm up the spine'
      },
      {
        poseId: 'downward-dog',
        duration: 60,
        transition: 'Step forward'
      },
      {
        poseId: 'warrior-one',
        duration: 30,
        side: 'right',
        transition: 'Open to warrior two'
      },
      {
        poseId: 'warrior-two',
        duration: 30,
        side: 'right',
        transition: 'Extend to side angle'
      },
      {
        poseId: 'extended-side-angle',
        duration: 30,
        side: 'right',
        transition: 'Return to warrior two'
      },
      {
        poseId: 'warrior-two',
        duration: 30,
        side: 'right',
        transition: 'Switch sides - warrior one'
      },
      {
        poseId: 'warrior-one',
        duration: 30,
        side: 'left',
        transition: 'Warrior two'
      },
      {
        poseId: 'warrior-two',
        duration: 30,
        side: 'left',
        transition: 'Side angle'
      },
      {
        poseId: 'extended-side-angle',
        duration: 30,
        side: 'left',
        transition: 'Triangle pose'
      },
      {
        poseId: 'triangle-pose',
        duration: 30,
        side: 'right',
        transition: 'Switch sides'
      },
      {
        poseId: 'triangle-pose',
        duration: 30,
        side: 'left',
        transition: 'Pyramid pose'
      },
      {
        poseId: 'pyramid-pose',
        duration: 30,
        side: 'right',
        transition: 'Switch sides'
      },
      {
        poseId: 'pyramid-pose',
        duration: 30,
        side: 'left',
        transition: 'Downward dog'
      },
      {
        poseId: 'downward-dog',
        duration: 45,
        transition: 'Plank pose'
      },
      {
        poseId: 'plank-pose',
        duration: 30,
        transition: 'Lower to cobra'
      },
      {
        poseId: 'cobra-pose',
        duration: 30,
        transition: 'Back to child\'s pose'
      },
      {
        poseId: 'child-pose',
        duration: 60,
        transition: 'Come to standing'
      },
      {
        poseId: 'tree-pose',
        duration: 45,
        side: 'right',
        transition: 'Switch sides'
      },
      {
        poseId: 'tree-pose',
        duration: 45,
        side: 'left',
        transition: 'Eagle pose'
      },
      {
        poseId: 'eagle-pose',
        duration: 30,
        side: 'right',
        transition: 'Switch sides'
      },
      {
        poseId: 'eagle-pose',
        duration: 30,
        side: 'left',
        transition: 'Come down to seated'
      },
      {
        poseId: 'boat-pose',
        duration: 30,
        transition: 'Forward fold'
      },
      {
        poseId: 'seated-forward-fold',
        duration: 90,
        transition: 'Lie back for bridge'
      },
      {
        poseId: 'bridge-pose',
        duration: 60,
        transition: 'Lower down'
      },
      {
        poseId: 'happy-baby',
        duration: 60,
        transition: 'Supine twist'
      },
      {
        poseId: 'supine-twist',
        duration: 60,
        side: 'right',
        transition: 'Switch sides'
      },
      {
        poseId: 'supine-twist',
        duration: 60,
        side: 'left',
        transition: 'Final relaxation'
      },
      {
        poseId: 'corpse-pose',
        duration: 300,
        transition: 'Rest completely'
      }
    ]
  },
  {
    id: 'iyengar-foundation',
    name: 'Iyengar Foundation',
    duration: 15,
    focus: 'balance',
    bodyPart: 'full',
    difficulty: 'beginner',
    week: '1-2',
    description: 'Classical Week 1-2 sequence from Light on Yoga - the perfect introduction to traditional Iyengar practice',
    poses: [
      {
        poseId: 'mountain-pose',
        duration: 60,
        transition: 'Ground yourself in mountain pose'
      },
      {
        poseId: 'tree-pose',
        duration: 60,
        side: 'right',
        transition: 'Shift weight to left foot for tree pose'
      },
      {
        poseId: 'tree-pose',
        duration: 60,
        side: 'left',
        transition: 'Switch to right foot, find your balance'
      },
      {
        poseId: 'triangle-pose',
        duration: 60,
        side: 'right',
        transition: 'Step wide for triangle pose, right side first'
      },
      {
        poseId: 'triangle-pose',
        duration: 60,
        side: 'left',
        transition: 'Flow to the left side'
      },
      {
        poseId: 'extended-side-angle',
        duration: 45,
        side: 'right',
        transition: 'Bend your right knee for extended side angle'
      },
      {
        poseId: 'extended-side-angle',
        duration: 45,
        side: 'left',
        transition: 'Switch to the left side'
      },
      {
        poseId: 'warrior-one',
        duration: 45,
        side: 'right',
        transition: 'Square your hips for warrior one, right side'
      },
      {
        poseId: 'warrior-one',
        duration: 45,
        side: 'left',
        transition: 'Step through to the left side'
      },
      {
        poseId: 'warrior-two',
        duration: 45,
        side: 'right',
        transition: 'Open to warrior two, right side'
      },
      {
        poseId: 'warrior-two',
        duration: 45,
        side: 'left',
        transition: 'Flow to the left side'
      },
      {
        poseId: 'pyramid-pose',
        duration: 45,
        side: 'right',
        transition: 'Straighten your legs for pyramid pose, right side'
      },
      {
        poseId: 'pyramid-pose',
        duration: 45,
        side: 'left',
        transition: 'Switch to the left side'
      },
      {
        poseId: 'corpse-pose',
        duration: 180,
        transition: 'Come down slowly for final relaxation'
      }
    ]
  },
  {
    id: 'sun-salutation',
    name: 'Sun Salutation Flow',
    duration: 6,
    focus: 'energy',
    bodyPart: 'full',
    difficulty: 'beginner',
    description: 'Iyengar-style sun salutations - 6 energizing rounds to awaken body and mind',
    poses: [
      {
        poseId: 'mountain-pose',
        duration: 10,
        transition: 'Stand tall in mountain pose'
      },
      {
        poseId: 'plank-pose',
        duration: 10,
        transition: 'Flow down to plank'
      },
      {
        poseId: 'cobra-pose',
        duration: 15,
        transition: 'Lower and lift to cobra'
      },
      {
        poseId: 'downward-dog',
        duration: 15,
        transition: 'Press back to downward dog'
      },
      {
        poseId: 'mountain-pose',
        duration: 10,
        transition: 'Step forward to mountain - Round 2'
      },
      {
        poseId: 'plank-pose',
        duration: 10,
        transition: 'Flow to plank'
      },
      {
        poseId: 'cobra-pose',
        duration: 15,
        transition: 'Lift to cobra'
      },
      {
        poseId: 'downward-dog',
        duration: 15,
        transition: 'Press back to dog'
      },
      {
        poseId: 'mountain-pose',
        duration: 10,
        transition: 'Step forward - Round 3'
      },
      {
        poseId: 'plank-pose',
        duration: 10,
        transition: 'Plank pose'
      },
      {
        poseId: 'cobra-pose',
        duration: 15,
        transition: 'Cobra pose'
      },
      {
        poseId: 'downward-dog',
        duration: 15,
        transition: 'Downward dog'
      },
      {
        poseId: 'mountain-pose',
        duration: 10,
        transition: 'Round 4 begins'
      },
      {
        poseId: 'plank-pose',
        duration: 10,
        transition: 'Plank'
      },
      {
        poseId: 'cobra-pose',
        duration: 15,
        transition: 'Cobra'
      },
      {
        poseId: 'downward-dog',
        duration: 15,
        transition: 'Dog pose'
      },
      {
        poseId: 'mountain-pose',
        duration: 10,
        transition: 'Round 5'
      },
      {
        poseId: 'plank-pose',
        duration: 10,
        transition: 'Plank'
      },
      {
        poseId: 'cobra-pose',
        duration: 15,
        transition: 'Cobra'
      },
      {
        poseId: 'downward-dog',
        duration: 15,
        transition: 'Dog'
      },
      {
        poseId: 'mountain-pose',
        duration: 10,
        transition: 'Final round - Round 6'
      },
      {
        poseId: 'plank-pose',
        duration: 10,
        transition: 'Plank'
      },
      {
        poseId: 'cobra-pose',
        duration: 15,
        transition: 'Cobra'
      },
      {
        poseId: 'downward-dog',
        duration: 15,
        transition: 'Final downward dog'
      },
      {
        poseId: 'mountain-pose',
        duration: 10,
        transition: 'Return to mountain - complete'
      }
    ]
  },
  {
    id: 'standing-strong',
    name: 'Standing Strong',
    duration: 10,
    focus: 'strength',
    bodyPart: 'full',
    difficulty: 'beginner',
    description: 'Build a solid foundation with standing poses that develop strength, balance, and presence',
    poses: [
      {
        poseId: 'mountain-pose',
        duration: 45,
        transition: 'Root down through your feet'
      },
      {
        poseId: 'tree-pose',
        duration: 45,
        side: 'right',
        transition: 'Find your balance on the left foot'
      },
      {
        poseId: 'tree-pose',
        duration: 45,
        side: 'left',
        transition: 'Switch to the right foot'
      },
      {
        poseId: 'warrior-one',
        duration: 45,
        side: 'right',
        transition: 'Step back to warrior one, right leg forward'
      },
      {
        poseId: 'warrior-one',
        duration: 45,
        side: 'left',
        transition: 'Switch to left leg forward'
      },
      {
        poseId: 'warrior-two',
        duration: 45,
        side: 'right',
        transition: 'Open to warrior two, right side'
      },
      {
        poseId: 'warrior-two',
        duration: 45,
        side: 'left',
        transition: 'Flow to the left side'
      },
      {
        poseId: 'triangle-pose',
        duration: 45,
        side: 'right',
        transition: 'Straighten your legs for triangle, right side'
      },
      {
        poseId: 'triangle-pose',
        duration: 45,
        side: 'left',
        transition: 'Switch to the left side'
      },
      {
        poseId: 'extended-side-angle',
        duration: 30,
        side: 'right',
        transition: 'Bend your knee for side angle, right'
      },
      {
        poseId: 'extended-side-angle',
        duration: 30,
        side: 'left',
        transition: 'Left side'
      },
      {
        poseId: 'downward-dog',
        duration: 45,
        transition: 'Come down to all fours, then press up'
      },
      {
        poseId: 'mountain-pose',
        duration: 45,
        transition: 'Walk forward to mountain pose'
      },
      {
        poseId: 'corpse-pose',
        duration: 45,
        transition: 'Lie down for brief rest'
      }
    ]
  },
  {
    id: 'deep-backbend',
    name: 'Deep Backbend Session',
    duration: 12,
    focus: 'strength',
    bodyPart: 'back',
    difficulty: 'intermediate',
    week: '14-15',
    description: 'Week 14-15 Iyengar progression - build spine flexibility and upper body strength with classical backbends',
    poses: [
      {
        poseId: 'mountain-pose',
        duration: 30,
        transition: 'Center yourself, set your intention'
      },
      {
        poseId: 'cat-cow',
        duration: 60,
        transition: 'Warm up your spine with flowing movement'
      },
      {
        poseId: 'cobra-pose',
        duration: 45,
        transition: 'Lie face down, lift into cobra'
      },
      {
        poseId: 'plank-pose',
        duration: 30,
        transition: 'Press up to plank for strength'
      },
      {
        poseId: 'cobra-pose',
        duration: 45,
        transition: 'Lower and lift again to cobra'
      },
      {
        poseId: 'bridge-pose',
        duration: 60,
        transition: 'Roll onto your back for bridge'
      },
      {
        poseId: 'child-pose',
        duration: 60,
        transition: 'Release into child\'s pose'
      },
      {
        poseId: 'bridge-pose',
        duration: 60,
        transition: 'One more bridge, lift your heart'
      },
      {
        poseId: 'child-pose',
        duration: 60,
        transition: 'Counterpose in child\'s pose'
      },
      {
        poseId: 'supine-twist',
        duration: 45,
        side: 'right',
        transition: 'Gentle twist to the right'
      },
      {
        poseId: 'supine-twist',
        duration: 45,
        side: 'left',
        transition: 'Twist to the left'
      },
      {
        poseId: 'corpse-pose',
        duration: 180,
        transition: 'Final relaxation, absorb the benefits'
      }
    ]
  },
  {
    id: 'hamstring-release',
    name: 'Hamstring Release',
    duration: 15,
    focus: 'flexibility',
    bodyPart: 'legs',
    difficulty: 'intermediate',
    description: 'Classical forward bend sequence to deeply release tight hamstrings and calm the nervous system',
    poses: [
      {
        poseId: 'mountain-pose',
        duration: 45,
        transition: 'Stand tall and breathe'
      },
      {
        poseId: 'downward-dog',
        duration: 90,
        transition: 'Fold forward to downward dog, pedal your feet'
      },
      {
        poseId: 'pyramid-pose',
        duration: 60,
        side: 'right',
        transition: 'Step right foot forward for pyramid'
      },
      {
        poseId: 'pyramid-pose',
        duration: 60,
        side: 'left',
        transition: 'Switch to left foot forward'
      },
      {
        poseId: 'seated-forward-fold',
        duration: 120,
        transition: 'Come to seated, extend your legs'
      },
      {
        poseId: 'child-pose',
        duration: 90,
        transition: 'Rest in child\'s pose'
      },
      {
        poseId: 'seated-forward-fold',
        duration: 90,
        transition: 'Return to seated forward fold'
      },
      {
        poseId: 'supine-twist',
        duration: 60,
        side: 'right',
        transition: 'Lie back for gentle twist, right side'
      },
      {
        poseId: 'supine-twist',
        duration: 60,
        side: 'left',
        transition: 'Switch to left side'
      },
      {
        poseId: 'legs-up-wall',
        duration: 120,
        transition: 'Swing your legs up the wall'
      },
      {
        poseId: 'corpse-pose',
        duration: 105,
        transition: 'Lower legs and rest completely'
      }
    ]
  },
  {
    id: 'therapeutic-back-care',
    name: 'Therapeutic Back Care',
    duration: 10,
    focus: 'relax',
    bodyPart: 'back',
    difficulty: 'beginner',
    description: 'Gentle therapeutic sequence from Appendix II - soothe back pain and release tension',
    poses: [
      {
        poseId: 'mountain-pose',
        duration: 30,
        transition: 'Stand and breathe, notice your back'
      },
      {
        poseId: 'cat-cow',
        duration: 90,
        transition: 'Gentle spinal movements to warm up'
      },
      {
        poseId: 'child-pose',
        duration: 120,
        transition: 'Rest and release your lower back'
      },
      {
        poseId: 'bridge-pose',
        duration: 45,
        transition: 'Roll to your back, lift gently'
      },
      {
        poseId: 'child-pose',
        duration: 60,
        transition: 'Return to child\'s pose'
      },
      {
        poseId: 'supine-twist',
        duration: 60,
        side: 'right',
        transition: 'Lie back for healing twist, right'
      },
      {
        poseId: 'supine-twist',
        duration: 60,
        side: 'left',
        transition: 'Twist to the left'
      },
      {
        poseId: 'legs-up-wall',
        duration: 90,
        transition: 'Restore with legs up the wall'
      },
      {
        poseId: 'corpse-pose',
        duration: 45,
        transition: 'Final rest for your back'
      }
    ]
  },
  {
    id: 'pranayama-practice',
    name: 'Pranayama Practice',
    duration: 10,
    focus: 'relax',
    bodyPart: 'breathing',
    difficulty: 'beginner',
    description: 'Breath-focused session inspired by Light on Pranayama - cultivate awareness and calm through Ujjayi breathing',
    poses: [
      {
        poseId: 'mountain-pose',
        duration: 60,
        transition: 'Stand tall, begin Ujjayi breath - ocean sound in throat'
      },
      {
        poseId: 'seated-forward-fold',
        duration: 120,
        transition: 'Sit and fold, breathe deeply into your back'
      },
      {
        poseId: 'child-pose',
        duration: 120,
        transition: 'Child\'s pose, feel the breath expand your back ribs'
      },
      {
        poseId: 'bridge-pose',
        duration: 45,
        transition: 'Open your chest in bridge, breathe into the front body'
      },
      {
        poseId: 'corpse-pose',
        duration: 120,
        transition: 'Lie down, practice alternate nostril breathing mentally'
      },
      {
        poseId: 'seated-forward-fold',
        duration: 90,
        transition: 'Return to seated, continue Ujjayi breath'
      },
      {
        poseId: 'corpse-pose',
        duration: 45,
        transition: 'Final rest, natural breathing'
      }
    ]
  },
  {
    id: 'classical-complete',
    name: 'Classical Complete Practice',
    duration: 25,
    focus: 'full',
    bodyPart: 'full',
    difficulty: 'intermediate',
    description: 'A comprehensive Iyengar sequence based on the traditional 3-day weekly course for complete mind-body practice',
    poses: [
      {
        poseId: 'mountain-pose',
        duration: 45,
        transition: 'Set your intention for practice'
      },
      {
        poseId: 'cat-cow',
        duration: 60,
        transition: 'Warm the spine'
      },
      {
        poseId: 'downward-dog',
        duration: 60,
        transition: 'Press up to downward dog'
      },
      {
        poseId: 'warrior-one',
        duration: 45,
        side: 'right',
        transition: 'Step right foot forward, warrior one'
      },
      {
        poseId: 'warrior-one',
        duration: 45,
        side: 'left',
        transition: 'Left side warrior one'
      },
      {
        poseId: 'warrior-two',
        duration: 45,
        side: 'right',
        transition: 'Open to warrior two, right'
      },
      {
        poseId: 'warrior-two',
        duration: 45,
        side: 'left',
        transition: 'Left side warrior two'
      },
      {
        poseId: 'triangle-pose',
        duration: 45,
        side: 'right',
        transition: 'Triangle pose, right'
      },
      {
        poseId: 'triangle-pose',
        duration: 45,
        side: 'left',
        transition: 'Triangle pose, left'
      },
      {
        poseId: 'extended-side-angle',
        duration: 30,
        side: 'right',
        transition: 'Extended side angle, right'
      },
      {
        poseId: 'extended-side-angle',
        duration: 30,
        side: 'left',
        transition: 'Left side'
      },
      {
        poseId: 'pyramid-pose',
        duration: 45,
        side: 'right',
        transition: 'Pyramid pose, right'
      },
      {
        poseId: 'pyramid-pose',
        duration: 45,
        side: 'left',
        transition: 'Left side pyramid'
      },
      {
        poseId: 'plank-pose',
        duration: 30,
        transition: 'Build strength in plank'
      },
      {
        poseId: 'cobra-pose',
        duration: 45,
        transition: 'Lower and lift to cobra'
      },
      {
        poseId: 'child-pose',
        duration: 60,
        transition: 'Rest in child\'s pose'
      },
      {
        poseId: 'boat-pose',
        duration: 30,
        transition: 'Come to seated for boat pose'
      },
      {
        poseId: 'boat-pose',
        duration: 30,
        transition: 'One more round'
      },
      {
        poseId: 'seated-forward-fold',
        duration: 90,
        transition: 'Forward fold to release'
      },
      {
        poseId: 'bridge-pose',
        duration: 60,
        transition: 'Lie back for bridge'
      },
      {
        poseId: 'happy-baby',
        duration: 60,
        transition: 'Draw knees to chest, happy baby'
      },
      {
        poseId: 'supine-twist',
        duration: 45,
        side: 'right',
        transition: 'Gentle twist, right'
      },
      {
        poseId: 'supine-twist',
        duration: 45,
        side: 'left',
        transition: 'Twist to the left'
      },
      {
        poseId: 'legs-up-wall',
        duration: 120,
        transition: 'Restorative legs up the wall'
      },
      {
        poseId: 'corpse-pose',
        duration: 300,
        transition: 'Deep final relaxation - absorb your complete practice'
      }
    ]
  },
  {
    id: 'foundation-poses-week-3',
    name: 'Foundation Poses: Staff, Hero & Thunderbolt',
    duration: 10,
    focus: 'flexibility',
    bodyPart: 'full',
    difficulty: 'beginner',
    week: '3-4',
    description: 'Iyengar Week 3-4: Build your foundation with seated poses that develop proper alignment and breathing awareness.',
    poses: [
      {
        poseId: 'mountain-pose',
        duration: 45,
        transition: 'Stand tall and ground through your feet, then prepare to sit'
      },
      {
        poseId: 'staff-pose',
        duration: 60,
        transition: 'Sit with legs extended, hands beside hips, spine elongated. Feel the foundation of all seated poses'
      },
      {
        poseId: 'thunderbolt-pose',
        duration: 60,
        transition: 'Kneel with tops of feet flat, sit back on heels. Perfect for meditation and digestion'
      },
      {
        poseId: 'hero-pose',
        duration: 75,
        transition: 'From kneeling, separate feet wider than hips, sit between heels. Use block if needed'
      },
      {
        poseId: 'child-pose',
        duration: 60,
        transition: 'Release forward from hero pose, arms extended. Rest and integrate'
      },
      {
        poseId: 'cat-cow',
        duration: 60,
        transition: 'Come to hands and knees, flow between cat and cow to warm the spine'
      },
      {
        poseId: 'downward-dog',
        duration: 60,
        transition: 'Lift hips high, press hands down, lengthen spine. Foundational inversion'
      },
      {
        poseId: 'staff-pose',
        duration: 45,
        transition: 'Return to seated, legs extended. Notice the difference after movement'
      },
      {
        poseId: 'bharadvajas-twist',
        duration: 30,
        side: 'right',
        transition: 'Twist gently to the right, hand behind you'
      },
      {
        poseId: 'bharadvajas-twist',
        duration: 30,
        side: 'left',
        transition: 'Return to center, then twist left'
      },
      {
        poseId: 'corpse-pose',
        duration: 90,
        transition: 'Lie back and release completely. Observe the effects of your practice'
      }
    ]
  },
  {
    id: 'chair-warriors-week-5',
    name: 'Chair Pose & Warrior Variations',
    duration: 12,
    focus: 'strength',
    bodyPart: 'legs',
    difficulty: 'intermediate',
    week: '5-6',
    description: 'Iyengar Week 5-6: Build lower body strength with chair pose and warrior variations, developing stamina and alignment.',
    poses: [
      {
        poseId: 'mountain-pose',
        duration: 45,
        transition: 'Ground through feet, engage thighs, lift through crown'
      },
      {
        poseId: 'chair-pose',
        duration: 45,
        transition: 'Bend knees deeply, sit back as if into a chair, arms overhead. Feel the burn!'
      },
      {
        poseId: 'standing-forward-fold',
        duration: 45,
        transition: 'Release forward, let gravity do the work. Counter the heat'
      },
      {
        poseId: 'half-forward-fold',
        duration: 30,
        transition: 'Lift halfway up, hands to shins, lengthen spine. Prepare for warriors'
      },
      {
        poseId: 'warrior-one',
        duration: 60,
        side: 'left',
        transition: 'Step right foot back, bend left knee, arms overhead. Strong foundation'
      },
      {
        poseId: 'warrior-two',
        duration: 60,
        side: 'left',
        transition: 'Open hips and arms to sides, gaze over front hand. Feel the expansion'
      },
      {
        poseId: 'warrior-three',
        duration: 45,
        side: 'left',
        transition: 'Shift weight to left foot, extend right leg back parallel to floor, arms forward. Balance and strength unite'
      },
      {
        poseId: 'mountain-pose',
        duration: 30,
        transition: 'Return to standing, find center before second side'
      },
      {
        poseId: 'warrior-one',
        duration: 60,
        side: 'right',
        transition: 'Step left foot back, bend right knee, arms up'
      },
      {
        poseId: 'warrior-two',
        duration: 60,
        side: 'right',
        transition: 'Open to warrior two, steady gaze'
      },
      {
        poseId: 'warrior-three',
        duration: 45,
        side: 'right',
        transition: 'Lift into warrior three, left leg extends back'
      },
      {
        poseId: 'chair-pose',
        duration: 45,
        transition: 'Return to chair pose, feel the heat building again'
      },
      {
        poseId: 'standing-forward-fold',
        duration: 60,
        transition: 'Fold forward completely, release the legs'
      },
      {
        poseId: 'child-pose',
        duration: 60,
        transition: 'Come to kneeling and rest in child pose'
      },
      {
        poseId: 'corpse-pose',
        duration: 90,
        transition: 'Lie back and feel the strength you have built'
      }
    ]
  },
  {
    id: 'forward-bending-deep-dive-week-8',
    name: 'Forward Bending Deep Dive',
    duration: 15,
    focus: 'flexibility',
    bodyPart: 'back',
    difficulty: 'intermediate',
    week: '8-10',
    description: 'Iyengar Week 8-10: Explore the full spectrum of forward bends, from standing to seated, cultivating surrender and hamstring flexibility.',
    poses: [
      {
        poseId: 'mountain-pose',
        duration: 45,
        transition: 'Stand tall, breathe deeply, prepare to fold'
      },
      {
        poseId: 'standing-forward-fold',
        duration: 75,
        transition: 'Hinge at hips, fold forward completely, knees soft if needed'
      },
      {
        poseId: 'half-forward-fold',
        duration: 45,
        transition: 'Lift torso halfway, hands to shins, lengthen spine'
      },
      {
        poseId: 'standing-forward-fold',
        duration: 60,
        transition: 'Fold forward again, go deeper this time'
      },
      {
        poseId: 'wide-legged-forward-fold',
        duration: 90,
        transition: 'Step feet wide, fold forward between legs, hands to floor or blocks. Deep hamstring release'
      },
      {
        poseId: 'mountain-pose',
        duration: 30,
        transition: 'Walk feet together, rise up slowly with breath'
      },
      {
        poseId: 'downward-dog',
        duration: 60,
        transition: 'Step back to downward dog, continue lengthening the back body'
      },
      {
        poseId: 'staff-pose',
        duration: 45,
        transition: 'Sit down with legs extended, prepare for seated forward bends'
      },
      {
        poseId: 'head-to-knee-pose',
        duration: 75,
        side: 'left',
        transition: 'Bend right knee, sole of foot to left inner thigh, fold over extended left leg'
      },
      {
        poseId: 'head-to-knee-pose',
        duration: 75,
        side: 'right',
        transition: 'Switch sides, bend left knee, fold over right leg'
      },
      {
        poseId: 'seated-forward-fold',
        duration: 90,
        transition: 'Extend both legs, fold forward over both. The deepest surrender'
      },
      {
        poseId: 'supine-twist',
        duration: 45,
        side: 'right',
        transition: 'Lie back, twist to the right to neutralize the spine'
      },
      {
        poseId: 'supine-twist',
        duration: 45,
        side: 'left',
        transition: 'Twist to the left'
      },
      {
        poseId: 'bridge-pose',
        duration: 60,
        transition: 'Lift hips. Counter-pose for all the forward bending'
      },
      {
        poseId: 'child-pose',
        duration: 60,
        transition: 'Return to child pose, rest the back'
      },
      {
        poseId: 'corpse-pose',
        duration: 120,
        transition: 'Final relaxation, feel the openness in your back body'
      }
    ]
  },
  {
    id: 'advanced-backbend-flow-week-12',
    name: 'Advanced Backbend Flow',
    duration: 15,
    focus: 'strength',
    bodyPart: 'back',
    difficulty: 'advanced',
    week: '12-14',
    description: 'Iyengar Week 12-14: Build heat and open the heart with progressively challenging backbends from locust to camel.',
    poses: [
      {
        poseId: 'cat-cow',
        duration: 60,
        transition: 'Warm the spine with cat-cow, preparing for deeper backbends'
      },
      {
        poseId: 'downward-dog',
        duration: 45,
        transition: 'Lift into downward dog, lengthen the spine'
      },
      {
        poseId: 'cobra-pose',
        duration: 45,
        transition: 'Lower to belly, lift chest gently. First backbend'
      },
      {
        poseId: 'locust-pose',
        duration: 60,
        transition: 'Lift legs and chest simultaneously, arms back. Build back strength'
      },
      {
        poseId: 'child-pose',
        duration: 45,
        transition: 'Rest in child pose, counter the backbend'
      },
      {
        poseId: 'bow-pose',
        duration: 60,
        transition: 'Return to belly, grab ankles, lift into bow. The heat intensifies'
      },
      {
        poseId: 'child-pose',
        duration: 45,
        transition: 'Rest again, breathe deeply'
      },
      {
        poseId: 'upward-facing-dog',
        duration: 60,
        transition: 'Press to plank, then scoop forward into upward dog. Legs lift, chest opens'
      },
      {
        poseId: 'downward-dog',
        duration: 45,
        transition: 'Press back to downward dog, release'
      },
      {
        poseId: 'thunderbolt-pose',
        duration: 30,
        transition: 'Come to kneeling, prepare for camel'
      },
      {
        poseId: 'camel-pose',
        duration: 75,
        transition: 'Kneel, reach hands to heels, lift chest to sky. The peak backbend'
      },
      {
        poseId: 'child-pose',
        duration: 75,
        transition: 'Essential counter-pose, rest completely'
      },
      {
        poseId: 'reclining-hero',
        duration: 60,
        transition: 'From hero pose, recline back onto elbows or floor. Gentle quad and hip flexor stretch'
      },
      {
        poseId: 'supine-twist',
        duration: 45,
        side: 'right',
        transition: 'Sit up, twist right to neutralize'
      },
      {
        poseId: 'supine-twist',
        duration: 45,
        side: 'left',
        transition: 'Twist left'
      },
      {
        poseId: 'seated-forward-fold',
        duration: 75,
        transition: 'Counter all backbends with a deep forward fold'
      },
      {
        poseId: 'corpse-pose',
        duration: 120,
        transition: 'Lie back, feel the opening in your heart and chest'
      }
    ]
  },
  {
    id: 'twist-mastery-week-16',
    name: 'Twist Mastery: Bharadvaja, Half Lord, Revolved',
    duration: 12,
    focus: 'flexibility',
    bodyPart: 'core',
    difficulty: 'intermediate',
    week: '16-18',
    description: 'Iyengar Week 16-18: Master the art of twisting with three essential spinal rotations, improving digestion and spinal mobility.',
    poses: [
      {
        poseId: 'cat-cow',
        duration: 60,
        transition: 'Warm the spine in all directions before twisting'
      },
      {
        poseId: 'staff-pose',
        duration: 45,
        transition: 'Sit tall, lengthen spine before rotating'
      },
      {
        poseId: 'bharadvajas-twist',
        duration: 75,
        side: 'right',
        transition: 'Bend knees to right, twist torso to right. Gentle seated twist, one hand behind, one on knee'
      },
      {
        poseId: 'bharadvajas-twist',
        duration: 75,
        side: 'left',
        transition: 'Switch sides, knees to left, twist left'
      },
      {
        poseId: 'staff-pose',
        duration: 30,
        transition: 'Return to center, reset'
      },
      {
        poseId: 'half-lord-fishes',
        duration: 75,
        side: 'right',
        transition: 'Bend right knee up, cross right foot over left leg, twist right. Deeper twist'
      },
      {
        poseId: 'half-lord-fishes',
        duration: 75,
        side: 'left',
        transition: 'Switch sides, twist left'
      },
      {
        poseId: 'child-pose',
        duration: 45,
        transition: 'Rest the spine after deep twists'
      },
      {
        poseId: 'mountain-pose',
        duration: 30,
        transition: 'Stand tall, prepare for standing twists'
      },
      {
        poseId: 'revolved-triangle',
        duration: 60,
        side: 'right',
        transition: 'Step right foot back, twist torso left, left hand to floor outside right foot. Challenging standing twist'
      },
      {
        poseId: 'mountain-pose',
        duration: 30,
        transition: 'Return to center'
      },
      {
        poseId: 'revolved-triangle',
        duration: 60,
        side: 'left',
        transition: 'Step left foot back, twist right'
      },
      {
        poseId: 'revolved-side-angle',
        duration: 60,
        side: 'right',
        transition: 'Bend right knee deeply, twist left, left elbow outside right knee. Deepest standing twist'
      },
      {
        poseId: 'mountain-pose',
        duration: 30,
        transition: 'Center yourself'
      },
      {
        poseId: 'revolved-side-angle',
        duration: 60,
        side: 'left',
        transition: 'Bend left knee, twist right'
      },
      {
        poseId: 'standing-forward-fold',
        duration: 60,
        transition: 'Fold forward, release the spine'
      },
      {
        poseId: 'child-pose',
        duration: 60,
        transition: 'Come to kneeling, rest'
      },
      {
        poseId: 'corpse-pose',
        duration: 90,
        transition: 'Lie back, feel the detoxifying effects of twisting'
      }
    ]
  },
  {
    id: 'balance-inversion-prep-week-20',
    name: 'Balance & Inversion Preparation',
    duration: 18,
    focus: 'balance',
    bodyPart: 'core',
    difficulty: 'advanced',
    week: '20-25',
    description: 'Iyengar Week 20-25: Build arm strength and core stability for inversions with crow, side plank, and shoulderstand preparation.',
    poses: [
      {
        poseId: 'mountain-pose',
        duration: 45,
        transition: 'Find your center, ground your foundation'
      },
      {
        poseId: 'tree-pose',
        duration: 60,
        side: 'left',
        transition: 'Lift right foot to left inner thigh, hands to heart. Balance warm-up'
      },
      {
        poseId: 'tree-pose',
        duration: 60,
        side: 'right',
        transition: 'Switch sides'
      },
      {
        poseId: 'cat-cow',
        duration: 60,
        transition: 'Come to hands and knees, warm the spine and wrists'
      },
      {
        poseId: 'plank-pose',
        duration: 45,
        transition: 'Hold plank, build core and arm strength'
      },
      {
        poseId: 'side-plank',
        duration: 45,
        side: 'right',
        transition: 'Rotate to right side, stack feet, lift hips. Arm and oblique strength'
      },
      {
        poseId: 'plank-pose',
        duration: 30,
        transition: 'Return through center'
      },
      {
        poseId: 'side-plank',
        duration: 45,
        side: 'left',
        transition: 'Rotate left'
      },
      {
        poseId: 'downward-dog',
        duration: 45,
        transition: 'Press back, rest briefly'
      },
      {
        poseId: 'crow-pose',
        duration: 60,
        transition: 'Squat, hands flat, knees to upper arms, lean forward. First arm balance!'
      },
      {
        poseId: 'child-pose',
        duration: 45,
        transition: 'Rest after the challenge'
      },
      {
        poseId: 'extended-hand-to-toe',
        duration: 60,
        side: 'right',
        transition: 'Stand on left foot, hold right big toe, extend leg forward. Balance and hamstring flexibility'
      },
      {
        poseId: 'mountain-pose',
        duration: 30,
        transition: 'Return to center'
      },
      {
        poseId: 'extended-hand-to-toe',
        duration: 60,
        side: 'left',
        transition: 'Stand on right foot, extend left leg'
      },
      {
        poseId: 'standing-forward-fold',
        duration: 45,
        transition: 'Fold forward, prepare for inversions'
      },
      {
        poseId: 'bridge-pose',
        duration: 75,
        transition: 'Lie on back, lift hips. Shoulder and neck preparation for shoulderstand'
      },
      {
        poseId: 'shoulderstand',
        duration: 90,
        transition: 'From bridge, lift legs overhead, support lower back with hands. The queen of poses - use wall if needed'
      },
      {
        poseId: 'plow-pose',
        duration: 60,
        transition: 'Lower feet overhead to floor, essential counter to shoulderstand'
      },
      {
        poseId: 'seated-forward-fold',
        duration: 75,
        transition: 'Roll down carefully, sit up, fold forward. Neutralize the neck'
      },
      {
        poseId: 'corpse-pose',
        duration: 150,
        transition: 'Lie back completely, integrate the inversions. Extended savasana after advanced practice'
      }
    ]
  },
  {
    id: 'advanced-standing-balance-week-30',
    name: 'Advanced Standing Balance Mastery',
    duration: 15,
    focus: 'balance',
    bodyPart: 'legs',
    difficulty: 'advanced',
    week: '30+',
    description: 'Iyengar Week 30+: Challenge your balance and grace with warrior three, dancer, standing split, and extended hand-to-toe variations.',
    poses: [
      {
        poseId: 'mountain-pose',
        duration: 60,
        transition: 'Root down through all four corners of feet, find unwavering stillness'
      },
      {
        poseId: 'tree-pose',
        duration: 45,
        side: 'left',
        transition: 'Warm up balance on right leg'
      },
      {
        poseId: 'tree-pose',
        duration: 45,
        side: 'right',
        transition: 'Switch to left leg'
      },
      {
        poseId: 'warrior-three',
        duration: 60,
        side: 'left',
        transition: 'From mountain, shift to left foot, extend right leg back parallel to floor, arms forward. Strong line of energy'
      },
      {
        poseId: 'standing-split',
        duration: 60,
        side: 'left',
        transition: 'Hinge forward deeper, lift right leg higher toward sky, hands to floor or ankle. Extreme hamstring flexibility'
      },
      {
        poseId: 'mountain-pose',
        duration: 30,
        transition: 'Return to standing, reset before second side'
      },
      {
        poseId: 'warrior-three',
        duration: 60,
        side: 'right',
        transition: 'Balance on right foot, left leg extends back'
      },
      {
        poseId: 'standing-split',
        duration: 60,
        side: 'right',
        transition: 'Fold deeper, lift left leg high'
      },
      {
        poseId: 'mountain-pose',
        duration: 45,
        transition: 'Stand tall, breathe, prepare for dancer'
      },
      {
        poseId: 'dancer-pose',
        duration: 75,
        side: 'left',
        transition: 'Balance on left foot, bend right knee back, hold right foot, kick into hand as chest lifts. Grace and strength unite'
      },
      {
        poseId: 'mountain-pose',
        duration: 30,
        transition: 'Center yourself'
      },
      {
        poseId: 'dancer-pose',
        duration: 75,
        side: 'right',
        transition: 'Balance on right foot, left leg lifts behind'
      },
      {
        poseId: 'mountain-pose',
        duration: 30,
        transition: 'Return to center'
      },
      {
        poseId: 'extended-hand-to-toe',
        duration: 60,
        side: 'right',
        transition: 'Balance on left foot, hold right big toe, extend leg forward then rotate open to side if possible'
      },
      {
        poseId: 'mountain-pose',
        duration: 30,
        transition: 'Center'
      },
      {
        poseId: 'extended-hand-to-toe',
        duration: 60,
        side: 'left',
        transition: 'Balance on right foot, extend left leg'
      },
      {
        poseId: 'standing-forward-fold',
        duration: 75,
        transition: 'Fold forward, release all the effort'
      },
      {
        poseId: 'wide-legged-forward-fold',
        duration: 60,
        transition: 'Step wide, fold between legs, rest'
      },
      {
        poseId: 'child-pose',
        duration: 60,
        transition: 'Come to kneeling, deeply rest'
      },
      {
        poseId: 'corpse-pose',
        duration: 120,
        transition: 'Lie back, feel the steadiness and lightness you have cultivated'
      }
    ]
  },
  {
    id: 'full-inversion-practice-week-40',
    name: 'Full Inversion Practice: The Royal Sequence',
    duration: 20,
    focus: 'inversion',
    bodyPart: 'full',
    difficulty: 'advanced',
    week: '40+',
    description: 'Iyengar Week 40+: The complete inversion sequence with headstand, shoulderstand, and plow. Requires solid preparation and wall support recommended.',
    poses: [
      {
        poseId: 'cat-cow',
        duration: 60,
        transition: 'Warm the spine thoroughly before inversions'
      },
      {
        poseId: 'downward-dog',
        duration: 75,
        transition: 'First gentle inversion, build shoulder strength'
      },
      {
        poseId: 'child-pose',
        duration: 45,
        transition: 'Rest, prepare mentally for headstand'
      },
      {
        poseId: 'headstand',
        duration: 120,
        transition: 'Forearms down, crown of head on floor, lift legs overhead. The king of poses - use wall for support. Stay calm, breathe steadily'
      },
      {
        poseId: 'child-pose',
        duration: 90,
        transition: 'Essential rest after headstand, allow blood pressure to normalize'
      },
      {
        poseId: 'cat-cow',
        duration: 45,
        transition: 'Gentle movement to reorient'
      },
      {
        poseId: 'bridge-pose',
        duration: 75,
        transition: 'Lie on back, lift hips. Prepare shoulders and neck for shoulderstand'
      },
      {
        poseId: 'shoulderstand',
        duration: 150,
        transition: 'Lift legs overhead, support lower back with hands, weight on shoulders not neck. The queen of poses - longer hold than headstand'
      },
      {
        poseId: 'plow-pose',
        duration: 90,
        transition: 'Lower feet to floor overhead, arms extended opposite direction. Essential counter-pose to shoulderstand'
      },
      {
        poseId: 'bridge-pose',
        duration: 60,
        transition: 'Roll down slowly, lift hips again briefly to release neck'
      },
      {
        poseId: 'reclining-hero',
        duration: 75,
        transition: 'Come to hero pose, recline back. Open chest and hip flexors after inversions'
      },
      {
        poseId: 'supine-twist',
        duration: 60,
        side: 'right',
        transition: 'Sit up, twist right to neutralize spine'
      },
      {
        poseId: 'supine-twist',
        duration: 60,
        side: 'left',
        transition: 'Twist left'
      },
      {
        poseId: 'seated-forward-fold',
        duration: 90,
        transition: 'Forward fold to completely neutralize neck and spine'
      },
      {
        poseId: 'cow-face-pose',
        duration: 60,
        side: 'right',
        transition: 'Stack knees, right on top, sit between heels. Shoulder and hip release'
      },
      {
        poseId: 'cow-face-pose',
        duration: 60,
        side: 'left',
        transition: 'Switch sides, left knee on top'
      },
      {
        poseId: 'corpse-pose',
        duration: 180,
        transition: 'Extended savasana after advanced inversion practice. Allow the nervous system to fully integrate the profound effects of turning upside down'
      }
    ]
  }
];

// Helper function to get session by ID
export const getSessionById = (id) => {
  return sessions.find(session => session.id === id);
};

// Helper function to get total session duration in seconds
export const getSessionDurationInSeconds = (sessionId) => {
  const session = getSessionById(sessionId);
  if (!session) return 0;

  return session.poses.reduce((total, pose) => total + pose.duration, 0);
};

// Helper function to filter sessions by duration
export const getSessionsByDuration = (minutes) => {
  return sessions.filter(session => session.duration === minutes);
};

// Helper function to filter sessions by focus
export const getSessionsByFocus = (focus) => {
  return sessions.filter(session => session.focus === focus);
};