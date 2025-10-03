import { memo } from 'react';
import PropTypes from 'prop-types';
import { cn } from '../lib/utils';
import { getPoseById } from '../data/poses';

/**
 * PoseImage Component
 *
 * Dynamically displays yoga pose images (JPG photos or SVG illustrations)
 * with configurable size and shape variants.
 *
 * Features:
 * - Accepts imageUrl prop for dynamic image loading
 * - Falls back to poseId-based path if no imageUrl provided
 * - Size variants: sm (48px), md (64px), lg (96px), xl (128px)
 * - Shape variants: circular, rounded, square
 * - Dark mode support
 * - Fallback icon when pose image unavailable
 * - Memoized for performance optimization
 *
 * @example
 * <PoseImage imageUrl="/poses/mountain-pose.jpg" size="md" shape="circular" />
 * <PoseImage poseId="mountain-pose" size="md" shape="circular" />
 */

const PoseImage = memo(function PoseImage({
  poseId,
  imageUrl: providedImageUrl,
  size = 'md',
  shape = 'circular',
  className = '',
  showBorder = false,
  ...props
}) {
  // Determine imageUrl with priority:
  // 1. Explicitly provided imageUrl prop
  // 2. Look up pose data and use its imageUrl
  // 3. Construct from poseId as fallback
  let imageUrl = providedImageUrl;

  if (!imageUrl && poseId) {
    const poseData = getPoseById(poseId);
    imageUrl = poseData?.imageUrl || `/poses/${poseId}.jpg`;
  }

  // Size variants (mobile-first)
  const sizes = {
    sm: 'w-12 h-12',  // 48px
    md: 'w-40 h-40',  // 160px
    lg: 'w-56 h-56',  // 224px
    xl: 'w-64 h-64',  // 256px
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
    'shrink-0',
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
          className="size-1/2 text-muted-foreground dark:text-muted-foreground"
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
        className="size-full object-cover"
        loading="lazy"
      />
    </div>
  );
});

PoseImage.propTypes = {
  poseId: PropTypes.string, // Optional if imageUrl is provided
  imageUrl: PropTypes.string, // Optional if poseId is provided
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  shape: PropTypes.oneOf(['circular', 'rounded', 'square']),
  className: PropTypes.string,
  showBorder: PropTypes.bool,
};

export default PoseImage;
