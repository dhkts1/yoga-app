import { memo } from 'react';
import PropTypes from 'prop-types';
import { cn } from '../lib/utils';

/**
 * PoseImage Component
 *
 * Dynamically displays yoga pose SVG illustrations from /src/assets/poses
 * with configurable size and shape variants.
 *
 * Features:
 * - Dynamic SVG imports for all poses
 * - Size variants: sm (48px), md (64px), lg (96px), xl (128px)
 * - Shape variants: circular, rounded, square
 * - Dark mode support
 * - Fallback icon when pose image unavailable
 * - Memoized for performance optimization
 *
 * @example
 * <PoseImage poseId="mountain-pose" size="md" shape="circular" />
 */

// Import all pose SVGs statically for performance
import mountainPose from '../assets/poses/mountain-pose.svg';
import downwardDog from '../assets/poses/downward-dog.svg';
import warriorOne from '../assets/poses/warrior-one.svg';
import warriorTwo from '../assets/poses/warrior-two.svg';
import treePose from '../assets/poses/tree-pose.svg';
import childPose from '../assets/poses/child-pose.svg';
import cobraPose from '../assets/poses/cobra-pose.svg';
import trianglePose from '../assets/poses/triangle-pose.svg';
import catCow from '../assets/poses/cat-cow.svg';
import plankPose from '../assets/poses/plank-pose.svg';
import bridgePose from '../assets/poses/bridge-pose.svg';
import corpsePose from '../assets/poses/corpse-pose.svg';
import boatPose from '../assets/poses/boat-pose.svg';
import eaglePose from '../assets/poses/eagle-pose.svg';
import extendedSideAngle from '../assets/poses/extended-side-angle.svg';
import halfMoon from '../assets/poses/half-moon.svg';
import happyBaby from '../assets/poses/happy-baby.svg';
import legsUpWall from '../assets/poses/legs-up-wall.svg';
import pigeonPose from '../assets/poses/pigeon-pose.svg';
import pyramidPose from '../assets/poses/pyramid-pose.svg';
import seatedForwardFold from '../assets/poses/seated-forward-fold.svg';
import supineTwist from '../assets/poses/supine-twist.svg';

// Pose image mapping
const POSE_IMAGES = {
  'mountain-pose': mountainPose,
  'downward-dog': downwardDog,
  'warrior-one': warriorOne,
  'warrior-two': warriorTwo,
  'tree-pose': treePose,
  'child-pose': childPose,
  'cobra-pose': cobraPose,
  'triangle-pose': trianglePose,
  'cat-cow': catCow,
  'plank-pose': plankPose,
  'bridge-pose': bridgePose,
  'corpse-pose': corpsePose,
  'boat-pose': boatPose,
  'eagle-pose': eaglePose,
  'extended-side-angle': extendedSideAngle,
  'half-moon': halfMoon,
  'happy-baby': happyBaby,
  'legs-up-wall': legsUpWall,
  'pigeon-pose': pigeonPose,
  'pyramid-pose': pyramidPose,
  'seated-forward-fold': seatedForwardFold,
  'supine-twist': supineTwist,
};

const PoseImage = memo(function PoseImage({
  poseId,
  size = 'md',
  shape = 'circular',
  className = '',
  showBorder = false,
  ...props
}) {
  // Get pose image URL
  const imageUrl = POSE_IMAGES[poseId];

  // Size variants (mobile-first)
  const sizes = {
    sm: 'w-12 h-12',  // 48px
    md: 'w-16 h-16',  // 64px
    lg: 'w-24 h-24',  // 96px
    xl: 'w-32 h-32',  // 128px
  };

  // Shape variants
  const shapes = {
    circular: 'rounded-full',
    rounded: 'rounded-xl',
    square: 'rounded-md',
  };

  // Border styles (optional)
  const borderStyles = showBorder ? 'border-2 border-border dark:border-sage-700' : '';

  // Base styles
  const baseStyles = cn(
    // Size
    sizes[size],
    // Shape
    shapes[shape],
    // Common styles
    'flex items-center justify-center',
    'bg-muted dark:bg-sage-900/20',
    'overflow-hidden',
    'flex-shrink-0',
    // Border
    borderStyles,
    // Dark mode image adjustment
    '[&_img]:dark:opacity-80',
    // Custom classes
    className
  );

  // Fallback if no image found
  if (!imageUrl) {
    return (
      <div className={baseStyles} {...props}>
        <svg
          className="w-1/2 h-1/2 text-muted-foreground dark:text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={baseStyles} {...props}>
      <img
        src={imageUrl}
        alt={`${poseId} pose`}
        className="w-full h-full object-contain p-2"
        loading="lazy"
      />
    </div>
  );
});

PoseImage.propTypes = {
  poseId: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  shape: PropTypes.oneOf(['circular', 'rounded', 'square']),
  className: PropTypes.string,
  showBorder: PropTypes.bool,
};

export default PoseImage;
