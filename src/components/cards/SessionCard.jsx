import { memo } from 'react';
import PropTypes from 'prop-types';
import { Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Unified SessionCard component that handles all session card variants
 * Eliminates 300+ lines of duplication across Welcome.jsx and Sessions.jsx
 * Memoized for performance optimization
 *
 * @param {Object} session - Session data object
 * @param {string} variant - Card style variant: 'default' | 'favorite' | 'recommended' | 'recent' | 'custom'
 * @param {string} type - Session type: 'yoga' | 'breathing' | 'custom'
 * @param {string} size - Card size: 'default' | 'hero' (hero is larger for featured cards)
 * @param {Function} onClick - Click handler for the card
 * @param {ReactNode} icon - Custom icon component
 * @param {ReactNode} poseImage - PoseImage component to display
 * @param {string} gradient - Custom gradient classes (e.g., from sessionGradients utility)
 * @param {string} description - Optional description text
 * @param {boolean} showPoseCount - Show number of poses (default: true for yoga sessions)
 * @param {string} difficulty - Difficulty level or category
 * @param {ReactNode} actions - Action buttons (favorite, edit, delete)
 * @param {Object} recommendation - Recommendation data (tag, isPrimary)
 * @param {string} className - Additional CSS classes
 * @param {Object} motionVariants - Framer motion animation variants
 */
const SessionCard = memo(function SessionCard({
  session,
  variant = 'default',
  type = 'yoga',
  size = 'default',
  onClick,
  icon: CustomIcon,
  poseImage,
  gradient,
  description,
  showPoseCount = true,
  difficulty,
  actions,
  recommendation,
  className = '',
  motionVariants,
}) {
  // Determine display values
  const sessionName = type === 'breathing' ? session.nameEnglish : session.name;
  const duration = session.duration || session.defaultDuration || (session.totalDurationSeconds ? Math.ceil(session.totalDurationSeconds / 60) : 0);
  const Icon = CustomIcon || Clock;

  // Determine styling based on variant, size, and gradient
  const getCardStyles = () => {
    // Base styles with gradient support - use bg-card for theme awareness
    const bgStyles = gradient || 'bg-card';
    const baseStyles = `w-full rounded-xl text-left shadow-sm transition-all duration-300 ${bgStyles} border border-border`;

    // Size-specific padding and height
    const sizeStyles = size === 'hero' ? 'p-5 min-h-[160px]' : 'p-4';

    switch (variant) {
      case 'favorite':
        return `${baseStyles} ${sizeStyles} hover:shadow-md hover:scale-[1.02] active:scale-[0.98] border-l-4 border-gold`;

      case 'recommended':
        return `${baseStyles} ${sizeStyles} hover:shadow-md hover:scale-[1.02] active:scale-[0.98] border-2 ${
          recommendation?.isPrimary ? 'border-accent' : 'border-transparent'
        }`;

      case 'recent':
        return `${baseStyles} ${sizeStyles} hover:shadow-md border border-border hover:border-border`;

      case 'custom':
        return `${baseStyles} ${sizeStyles} shadow-sm ${
          actions ? 'border-l-4 border-primary' : ''
        }`;

      default:
        return `${baseStyles} ${sizeStyles} hover:shadow-md hover:scale-[1.02] active:scale-[0.98]`;
    }
  };

  // Get text color based on variant
  const getIconColor = () => {
    if (variant === 'recommended') return 'text-accent';
    return 'text-muted-foreground';
  };

  const cardContent = (
    <button
      onClick={onClick}
      className={getCardStyles()}
      aria-label={`Start ${sessionName} session, ${duration} minutes`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Pose Image (if provided) */}
        {poseImage && (
          <div className="flex-shrink-0">
            {poseImage}
          </div>
        )}

        <div className={`flex-1 min-w-0 ${actions ? 'pr-0' : variant === 'recent' ? 'mr-3' : 'pr-12'}`}>
          {/* Title Row */}
          <div className="flex items-center gap-2 mb-1">
            {!poseImage && <Icon className={`h-5 w-5 ${getIconColor()} flex-shrink-0`} />}
            <h3 className={`${size === 'hero' ? 'text-lg' : 'text-base'} font-medium text-card-foreground truncate`}>
              {sessionName}
            </h3>
            {recommendation?.isPrimary && (
              <Star className="h-4 w-4 text-accent fill-current flex-shrink-0" />
            )}
          </div>

          {/* Sanskrit Name or Description */}
          {variant === 'recent' && session.nameSanskrit ? (
            <p className="text-sm text-muted-foreground mb-0 line-clamp-1">
              {session.nameSanskrit}
            </p>
          ) : description ? (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
              {description}
            </p>
          ) : null}

          {/* Recommendation Badge */}
          {recommendation?.tag && (
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-white font-medium">
                {recommendation.tag}
              </span>
            </div>
          )}

          {/* Metadata Row */}
          {variant !== 'recent' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground overflow-hidden">
              <div className="flex items-center gap-1 flex-shrink-0">
                <Clock className="h-4 w-4" />
                <span>{duration} min</span>
              </div>
              {showPoseCount && session.poses?.length > 0 && type !== 'breathing' && (
                <>
                  <span className="flex-shrink-0">•</span>
                  <span className="flex-shrink-0">{session.poses.length} poses</span>
                </>
              )}
              {difficulty && (
                <>
                  <span className="flex-shrink-0">•</span>
                  <span className="capitalize flex-shrink-0 whitespace-nowrap">{difficulty}</span>
                </>
              )}
              {type === 'custom' && (
                <>
                  <span className="flex-shrink-0">•</span>
                  <span className="text-muted-foreground flex-shrink-0 whitespace-nowrap">Custom</span>
                </>
              )}
              {session.week && (
                <>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium text-xs">
                    Week {session.week}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Duration Badge (for recent or recommended cards) */}
        {(variant === 'recent' || variant === 'recommended') && (
          <div className={`flex-shrink-0 ${
            variant === 'recent'
              ? 'text-muted-foreground'
              : 'ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/20'
          }`}>
            <span className={`text-sm font-medium ${
              variant === 'recent' ? 'text-muted-foreground' : 'text-accent'
            }`}>
              {variant === 'recommended' ? `${duration}'` : `${duration} min`}
            </span>
          </div>
        )}

        {/* Duration Badge for custom sessions */}
        {type === 'custom' && !actions && (
          <div className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted flex-shrink-0">
            <span className="text-sm font-medium text-muted-foreground">
              {duration}'
            </span>
          </div>
        )}
      </div>
    </button>
  );

  // Wrap with motion.div if variants are provided
  if (motionVariants) {
    return (
      <motion.div
        variants={motionVariants}
        className={`relative ${className}`}
      >
        {cardContent}
        {actions && (
          <div className="absolute top-2 right-2 flex gap-1">
            {actions}
          </div>
        )}
        {!actions && variant === 'favorite' && actions !== null && (
          <div className="absolute top-3 right-3">
            {/* Placeholder for FavoriteButton - passed via actions prop */}
          </div>
        )}
      </motion.div>
    );
  }

  // Non-animated version
  return (
    <div className={`relative ${className}`}>
      {cardContent}
      {actions && (
        <div className={`absolute ${type === 'custom' ? 'top-2 right-2' : 'top-3 right-3'} flex gap-1`}>
          {actions}
        </div>
      )}
    </div>
  );
});

SessionCard.propTypes = {
  session: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    nameEnglish: PropTypes.string,
    nameSanskrit: PropTypes.string,
    duration: PropTypes.number,
    defaultDuration: PropTypes.number,
    totalDurationSeconds: PropTypes.number,
    poses: PropTypes.array,
    description: PropTypes.string,
    difficulty: PropTypes.string,
    category: PropTypes.string,
  }).isRequired,
  variant: PropTypes.oneOf(['default', 'favorite', 'recommended', 'recent', 'custom']),
  type: PropTypes.oneOf(['yoga', 'breathing', 'custom']),
  size: PropTypes.oneOf(['default', 'hero']),
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.elementType,
  poseImage: PropTypes.node,
  gradient: PropTypes.string,
  description: PropTypes.string,
  showPoseCount: PropTypes.bool,
  difficulty: PropTypes.string,
  actions: PropTypes.node,
  recommendation: PropTypes.shape({
    tag: PropTypes.string,
    isPrimary: PropTypes.bool,
  }),
  className: PropTypes.string,
  motionVariants: PropTypes.object,
};

export default SessionCard;
