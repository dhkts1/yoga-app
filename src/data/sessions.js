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
    description: 'A micro break to release neck and shoulder tension',
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
    description: 'Build core strength with dynamic poses',
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
    description: 'Test your balance with progressively challenging poses',
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
    description: 'Comprehensive all-levels flow for complete practice',
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
    description: 'Comprehensive Iyengar sequence based on the 3-day weekly course - a complete traditional practice',
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