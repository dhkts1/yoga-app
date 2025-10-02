import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';
import SessionCard from './cards/SessionCard';
import { LIST_ANIMATION } from '../utils/animations';

/**
 * SessionList component for displaying grouped session cards with optional animations
 *
 * Features:
 * - Automatic list animations with stagger effect
 * - Section headers with icons
 * - Support for different session groupings (favorites, custom, recommended)
 */

/**
 * SessionList - Renders a list of session cards with optional header and animations
 */
const SessionList = ({
  sessions,
  title,
  icon: TitleIcon,
  variant = 'default',
  type = 'yoga',
  onSessionClick,
  getIcon,
  getDescription,
  getDifficulty,
  getActions,
  showHeader = true,
  showPoseCount = true,
  className = '',
  animate = true,
  containerVariants = LIST_ANIMATION.container,
  itemVariants = LIST_ANIMATION.item,
  recommendation,
}) => {
  if (!sessions || sessions.length === 0) return null;

  const headerContent = showHeader && title && (
    <h2 className="text-lg font-medium text-foreground mb-4 text-center flex items-center justify-center gap-2">
      {TitleIcon && <TitleIcon className="h-5 w-5 text-accent fill-accent" />}
      {title}
    </h2>
  );

  const listContent = (
    <motion.div
      className="space-y-3"
      variants={animate ? containerVariants : undefined}
      initial={animate ? "hidden" : undefined}
      animate={animate ? "visible" : undefined}
    >
      {sessions.map((session) => {
        const cardVariant = variant === 'auto'
          ? (recommendation ? 'recommended' : 'default')
          : variant;

        return (
          <SessionCard
            key={session.id}
            session={session}
            variant={cardVariant}
            type={type}
            onClick={() => onSessionClick(session)}
            icon={getIcon ? getIcon(session) : undefined}
            poseImage={session.poseImage}
            gradient={session.gradient}
            description={getDescription ? getDescription(session) : session.description}
            difficulty={getDifficulty ? getDifficulty(session) : session.difficulty || session.category}
            showPoseCount={showPoseCount}
            actions={getActions ? getActions(session) : undefined}
            recommendation={recommendation ? recommendation(session) : undefined}
            motionVariants={animate ? itemVariants : undefined}
          />
        );
      })}
    </motion.div>
  );

  return (
    <div className={`mb-8 ${className}`}>
      {headerContent}
      {listContent}
    </div>
  );
};

SessionList.propTypes = {
  sessions: PropTypes.array.isRequired,
  title: PropTypes.string,
  icon: PropTypes.elementType,
  variant: PropTypes.oneOf(['default', 'favorite', 'recommended', 'recent', 'custom', 'auto']),
  type: PropTypes.oneOf(['yoga', 'breathing', 'custom']),
  onSessionClick: PropTypes.func.isRequired,
  getIcon: PropTypes.func,
  getDescription: PropTypes.func,
  getDifficulty: PropTypes.func,
  getActions: PropTypes.func,
  showHeader: PropTypes.bool,
  showPoseCount: PropTypes.bool,
  className: PropTypes.string,
  animate: PropTypes.bool,
  containerVariants: PropTypes.object,
  itemVariants: PropTypes.object,
  recommendation: PropTypes.func,
};

/**
 * RecommendedSessionList - Specialized list for recommended sessions
 */
export const RecommendedSessionList = ({
  sessions,
  onSessionClick,
  getRecommendationTag,
  animate = true,
}) => {
  if (!sessions || sessions.length === 0) return null;

  return (
    <SessionList
      sessions={sessions}
      title="Recommended for You"
      icon={Sparkles}
      variant="recommended"
      onSessionClick={onSessionClick}
      animate={animate}
      recommendation={(session) => ({
        tag: getRecommendationTag ? getRecommendationTag(session) : undefined,
        isPrimary: session.isPrimary,
      })}
    />
  );
};

RecommendedSessionList.propTypes = {
  sessions: PropTypes.array.isRequired,
  onSessionClick: PropTypes.func.isRequired,
  getRecommendationTag: PropTypes.func,
  animate: PropTypes.bool,
};

/**
 * FavoriteSessionList - Specialized list for favorite sessions
 */
export const FavoriteSessionList = ({
  sessions,
  title = "Favorite Sessions",
  type = 'yoga',
  onSessionClick,
  getIcon,
  getDescription,
  getActions,
  animate = true,
}) => {
  if (!sessions || sessions.length === 0) return null;

  return (
    <SessionList
      sessions={sessions}
      title={title}
      icon={Star}
      variant="favorite"
      type={type}
      onSessionClick={onSessionClick}
      getIcon={getIcon}
      getDescription={getDescription}
      getActions={getActions}
      animate={animate}
    />
  );
};

FavoriteSessionList.propTypes = {
  sessions: PropTypes.array.isRequired,
  title: PropTypes.string,
  type: PropTypes.oneOf(['yoga', 'breathing', 'custom']),
  onSessionClick: PropTypes.func.isRequired,
  getIcon: PropTypes.func,
  getDescription: PropTypes.func,
  getActions: PropTypes.func,
  animate: PropTypes.bool,
};

/**
 * RecentSessionList - Specialized list for recent sessions (minimal style)
 */
export const RecentSessionList = ({
  sessions,
  onSessionClick,
  animate = false,
}) => {
  if (!sessions || sessions.length === 0) return null;

  return (
    <SessionList
      sessions={sessions}
      variant="recent"
      onSessionClick={onSessionClick}
      showHeader={false}
      showPoseCount={false}
      animate={animate}
    />
  );
};

RecentSessionList.propTypes = {
  sessions: PropTypes.array.isRequired,
  onSessionClick: PropTypes.func.isRequired,
  animate: PropTypes.bool,
};

export default SessionList;
