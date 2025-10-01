// Custom sessions data structure and management
import { poses } from './poses.js';

// Generate unique ID for custom sessions
const generateSessionId = () => {
  return 'custom-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

// Default custom session template
export const createCustomSession = (name = 'My Custom Session', poseList = []) => {
  const totalDuration = poseList.reduce((total, pose) => total + pose.duration, 0);

  return {
    id: generateSessionId(),
    name,
    duration: Math.ceil(totalDuration / 60), // Convert to minutes
    focus: 'custom',
    bodyPart: 'custom',
    difficulty: 'custom',
    description: 'Your personalized yoga sequence',
    poses: poseList,
    totalDurationSeconds: totalDuration,
    createdAt: new Date().toISOString(),
    isCustom: true
  };
};

// Validate custom session before saving
export const validateCustomSession = (session) => {
  const errors = [];

  if (!session.name || session.name.trim().length === 0) {
    errors.push('Session name is required');
  }

  if (session.name && session.name.trim().length > 50) {
    errors.push('Session name must be 50 characters or less');
  }

  if (!session.poses || session.poses.length < 2) {
    errors.push('Session must have at least 2 poses');
  }

  if (session.poses && session.poses.length > 20) {
    errors.push('Session cannot have more than 20 poses');
  }

  // Validate each pose
  if (session.poses) {
    session.poses.forEach((pose, index) => {
      if (!pose.poseId) {
        errors.push(`Pose ${index + 1} is missing pose ID`);
      }

      if (!pose.duration || pose.duration < 15 || pose.duration > 120) {
        errors.push(`Pose ${index + 1} duration must be between 15-120 seconds`);
      }

      if (pose.duration % 15 !== 0) {
        errors.push(`Pose ${index + 1} duration must be in 15-second increments`);
      }

      // Check if pose ID exists
      const poseExists = poses.find(p => p.id === pose.poseId);
      if (!poseExists) {
        errors.push(`Pose ${index + 1} references unknown pose: ${pose.poseId}`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Get custom session with populated pose data
export const getCustomSessionWithPoses = (customSession) => {
  if (!customSession) return null;

  const posesWithData = customSession.poses.map(sessionPose => {
    const poseData = poses.find(p => p.id === sessionPose.poseId);
    return {
      ...sessionPose,
      poseData
    };
  });

  return {
    ...customSession,
    poses: posesWithData
  };
};

// Duration options for pose selector (15-120 seconds in 15s increments)
export const getDurationOptions = () => {
  const options = [];
  for (let duration = 15; duration <= 120; duration += 15) {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    let label = '';

    if (minutes > 0) {
      label += `${minutes}m`;
      if (seconds > 0) label += ` ${seconds}s`;
    } else {
      label = `${seconds}s`;
    }

    options.push({
      value: duration,
      label
    });
  }
  return options;
};

// Calculate total session time helper
export const calculateTotalDuration = (poses) => {
  return poses.reduce((total, pose) => total + (pose.duration || 0), 0);
};

// Format duration helper
export const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  } else if (remainingSeconds === 0) {
    return `${minutes}m`;
  } else {
    return `${minutes}m ${remainingSeconds}s`;
  }
};

// Auto-generate transitions between poses
export const generateTransition = (fromPose, toPose) => {
  if (!fromPose || !toPose) return 'Move to the next pose';

  // Simple transition generator based on pose categories
  const transitions = {
    'standing-standing': 'Shift your weight and transition',
    'standing-seated': 'Lower down to a seated position',
    'standing-balance': 'Find your center and balance',
    'seated-standing': 'Press through your feet to stand',
    'seated-seated': 'Adjust your position',
    'balance-standing': 'Return to standing',
    'backbend-forward': 'Counter with a gentle forward fold',
    'forward-backbend': 'Open your chest for the backbend',
    'restorative-any': 'Take your time transitioning',
    'any-restorative': 'Settle into this restorative pose'
  };

  const fromCategory = fromPose.category || 'any';
  const toCategory = toPose.category || 'any';
  const key = `${fromCategory}-${toCategory}`;

  return transitions[key] || transitions[`${fromCategory}-any`] || transitions[`any-${toCategory}`] || 'Transition mindfully to the next pose';
};

// Default draft session for auto-save
export const createDraftSession = () => {
  return {
    id: 'draft',
    name: '',
    poses: [],
    lastModified: new Date().toISOString()
  };
};