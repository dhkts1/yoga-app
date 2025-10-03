import { memo } from "react";
import PropTypes from "prop-types";
import { Clock, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Heading } from "../design-system";

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
  variant = "default",
  type = "yoga",
  size = "default",
  onClick,
  icon: CustomIcon,
  poseImage,
  gradient,
  description,
  showPoseCount = true,
  difficulty,
  actions,
  recommendation,
  className = "",
  motionVariants,
}) {
  // Determine display values
  const sessionName = type === "breathing" ? session.nameEnglish : session.name;
  const duration =
    session.duration ||
    session.defaultDuration ||
    (session.totalDurationSeconds
      ? Math.ceil(session.totalDurationSeconds / 60)
      : 0);
  const Icon = CustomIcon || Clock;

  // Determine styling based on variant, size, and gradient
  const getCardStyles = () => {
    // Base styles with gradient support - use bg-card for theme awareness
    const bgStyles = gradient || "bg-card";
    const baseStyles = `w-full rounded-lg text-left shadow-sm transition-all duration-300 ${bgStyles} border border-border`;

    // Size-specific padding and height - now more compact
    const sizeStyles = size === "hero" ? "p-4" : "p-3";

    switch (variant) {
      case "favorite":
        return `${baseStyles} ${sizeStyles} hover:shadow-md hover:scale-[1.02] active:scale-[0.98] border-l-4 border-gold`;

      case "recommended":
        return `${baseStyles} ${sizeStyles} hover:shadow-md hover:scale-[1.02] active:scale-[0.98] border-2 ${
          recommendation?.isPrimary ? "border-accent" : "border-transparent"
        }`;

      case "recent":
        return `${baseStyles} ${sizeStyles} hover:shadow-md border border-border hover:border-border`;

      case "custom":
        return `${baseStyles} ${sizeStyles} shadow-sm ${
          actions ? "border-l-4 border-primary" : ""
        }`;

      default:
        return `${baseStyles} ${sizeStyles} hover:shadow-md hover:scale-[1.02] active:scale-[0.98]`;
    }
  };

  // Get text color based on variant
  const getIconColor = () => {
    if (variant === "recommended") return "text-accent";
    return "text-muted-foreground";
  };

  const cardContent = (
    <button
      onClick={onClick}
      className={getCardStyles()}
      aria-label={`Start ${sessionName} session, ${duration} minutes`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Pose Image (if provided) */}
        {poseImage && <div className="shrink-0">{poseImage}</div>}

        <div
          className={`min-w-0 flex-1 ${actions ? "pr-0" : variant === "recent" ? "mr-3" : "pr-12"}`}
        >
          {/* Title Row */}
          <div className="mb-1 flex items-center gap-2">
            {!poseImage && (
              <Icon className={`size-5 ${getIconColor()} shrink-0`} />
            )}
            <h3
              className={`${size === "hero" ? "text-lg" : "text-base"} truncate font-medium text-foreground`}
            >
              {sessionName}
            </h3>
            {recommendation?.isPrimary && (
              <Star className="size-4 shrink-0 fill-current text-accent" />
            )}
          </div>

          {/* Sanskrit Name or Description */}
          {variant === "recent" && session.nameSanskrit ? (
            <p className="mb-0 line-clamp-1 text-sm text-muted-foreground">
              {session.nameSanskrit}
            </p>
          ) : description ? (
            <p className="mb-2 line-clamp-1 text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}

          {/* Recommendation Badge */}
          {recommendation?.tag && (
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                {recommendation.tag}
              </span>
            </div>
          )}

          {/* Metadata Row */}
          {variant !== "recent" && (
            <div className="flex items-center gap-2 overflow-hidden text-sm text-muted-foreground">
              <div className="flex shrink-0 items-center gap-1">
                <Clock className="size-4" />
                <span>{duration} min</span>
              </div>
              {showPoseCount &&
                session.poses?.length > 0 &&
                type !== "breathing" && (
                  <>
                    <span className="shrink-0">•</span>
                    <span className="shrink-0">
                      {session.poses.length} poses
                    </span>
                  </>
                )}
              {difficulty && (
                <>
                  <span className="shrink-0">•</span>
                  <span className="shrink-0 whitespace-nowrap capitalize">
                    {difficulty}
                  </span>
                </>
              )}
              {type === "custom" && (
                <>
                  <span className="shrink-0">•</span>
                  <span className="shrink-0 whitespace-nowrap text-muted-foreground">
                    Custom
                  </span>
                </>
              )}
              {session.week && (
                <>
                  <span>•</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    Week {session.week}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Duration Badge (for recent or recommended cards) */}
        {(variant === "recent" || variant === "recommended") && (
          <div
            className={`shrink-0 ${
              variant === "recent"
                ? "text-muted-foreground"
                : "ml-3 flex size-10 items-center justify-center rounded-full bg-accent/20"
            }`}
          >
            <span
              className={`text-sm font-medium ${
                variant === "recent" ? "text-muted-foreground" : "text-accent"
              }`}
            >
              {variant === "recommended" ? `${duration}'` : `${duration} min`}
            </span>
          </div>
        )}

        {/* Duration Badge for custom sessions */}
        {type === "custom" && !actions && (
          <div className="ml-3 flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
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
      <motion.div variants={motionVariants} className={`relative ${className}`}>
        {cardContent}
        {actions && (
          <div className="absolute right-2 top-2 flex gap-1">{actions}</div>
        )}
        {!actions && variant === "favorite" && actions !== null && (
          <div className="absolute right-3 top-3">
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
        <div
          className={`absolute ${type === "custom" ? "right-2 top-2" : "right-3 top-3"} flex gap-1`}
        >
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
  variant: PropTypes.oneOf([
    "default",
    "favorite",
    "recommended",
    "recent",
    "custom",
  ]),
  type: PropTypes.oneOf(["yoga", "breathing", "custom"]),
  size: PropTypes.oneOf(["default", "hero"]),
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
