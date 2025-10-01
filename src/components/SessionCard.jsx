import PropTypes from 'prop-types';
import { Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Unified SessionCard component that handles all session card variants
 * Eliminates 300+ lines of duplication across Welcome.jsx and Sessions.jsx
 *
 * @param {Object} session - Session data object
 * @param {string} variant - Card style variant: 'default' | 'favorite' | 'recommended' | 'recent' | 'custom'
 * @param {string} type - Session type: 'yoga' | 'breathing' | 'custom'
 * @param {Function} onClick - Click handler for the card
 * @param {ReactNode} icon - Custom icon component
 * @param {string} description - Optional description text
 * @param {boolean} showPoseCount - Show number of poses (default: true for yoga sessions)
 * @param {string} difficulty - Difficulty level or category
 * @param {ReactNode} actions - Action buttons (favorite, edit, delete)
 * @param {Object} recommendation - Recommendation data (tag, isPrimary)
 * @param {string} className - Additional CSS classes
 * @param {Object} motionVariants - Framer motion animation variants
 */
const SessionCard = ({
  session,
  variant = 'default',
  type = 'yoga',
  onClick,
  icon: CustomIcon,
  description,
  showPoseCount = true,
  difficulty,
  actions,
  recommendation,
  className = '',
  motionVariants,
}) => {
  // Determine display values
  const sessionName = type === 'breathing' ? session.nameEnglish : session.name;
  const duration = session.duration || session.defaultDuration || (session.totalDurationSeconds ? Math.ceil(session.totalDurationSeconds / 60) : 0);
  const Icon = CustomIcon || Clock;

  // Determine styling based on variant
  const getCardStyles = () => {
    const baseStyles = 'w-full rounded-xl bg-white text-left shadow-sm transition-all duration-300';

    switch (variant) {
      case 'favorite':
        return `${baseStyles} p-4 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] border-l-4 border-gold`;

      case 'recommended':
        return `${baseStyles} bg-gradient-to-br from-accent/10 to-sage/10 p-4 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] border-2 ${
          recommendation?.isPrimary ? 'border-accent' : 'border-transparent'
        }`;

      case 'recent':
        return `${baseStyles} p-4 hover:shadow-md border border-sage-100 hover:border-sage-200`;

      case 'custom':
        return `${baseStyles} p-4 shadow-sm ${
          actions ? 'border-l-4 border-sage-400' : ''
        }`;

      default:
        return `${baseStyles} p-4 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]`;
    }
  };

  // Get text color based on variant
  const getIconColor = () => {
    if (variant === 'recommended') return 'text-accent';
    return 'text-sage-600';
  };

  const cardContent = (
    <button
      onClick={onClick}
      className={getCardStyles()}
      aria-label={`Start ${sessionName} session, ${duration} minutes`}
    >
      <div className="flex items-start justify-between">
        <div className={`flex-1 min-w-0 ${actions ? 'pr-0' : variant === 'recent' ? 'mr-3' : 'pr-12'}`}>
          {/* Title Row */}
          <div className="flex items-center gap-2 mb-1">
            <Icon className={`h-5 w-5 ${getIconColor()} flex-shrink-0`} />
            <h3 className="text-base font-medium text-sage-900 truncate">
              {sessionName}
            </h3>
            {recommendation?.isPrimary && (
              <Star className="h-4 w-4 text-accent fill-current flex-shrink-0" />
            )}
          </div>

          {/* Sanskrit Name or Description */}
          {variant === 'recent' && session.nameSanskrit ? (
            <p className="text-sm text-sage-700 mb-0 line-clamp-1">
              {session.nameSanskrit}
            </p>
          ) : description ? (
            <p className="text-sm text-sage-700 mb-2 line-clamp-1">
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
            <div className="flex items-center gap-4 text-sm text-sage-600 flex-wrap">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{duration} min</span>
              </div>
              {showPoseCount && session.poses?.length > 0 && type !== 'breathing' && (
                <>
                  <span>•</span>
                  <span>{session.poses.length} poses</span>
                </>
              )}
              {difficulty && (
                <>
                  <span>•</span>
                  <span className="capitalize">{difficulty}</span>
                </>
              )}
              {type === 'custom' && (
                <>
                  <span>•</span>
                  <span className="text-sage-500">Custom</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Duration Badge (for recent or recommended cards) */}
        {(variant === 'recent' || variant === 'recommended') && (
          <div className={`flex-shrink-0 ${
            variant === 'recent'
              ? 'text-sage-700'
              : 'ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/20'
          }`}>
            <span className={`text-sm font-medium ${
              variant === 'recent' ? 'text-sage-700' : 'text-accent'
            }`}>
              {variant === 'recommended' ? `${duration}'` : `${duration} min`}
            </span>
          </div>
        )}

        {/* Duration Badge for custom sessions */}
        {type === 'custom' && !actions && (
          <div className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 flex-shrink-0">
            <span className="text-sm font-medium text-sage-700">
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
};

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
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.elementType,
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
