/**
 * StatusBadge Component
 *
 * Higher-level badge component that automatically applies correct styling
 * based on badge type and value. Wraps the base Badge component.
 *
 * Usage:
 *   <StatusBadge type="programStatus" value="active" />
 *   <StatusBadge type="difficulty" value="beginner" />
 *   <StatusBadge type="style" value="iyengar" />
 *   <StatusBadge type="weekStatus" value={{ isCompleted: true }} />
 *
 * Benefits:
 * - Single import instead of multiple utility functions
 * - Automatic icon and color selection
 * - Type-safe badge rendering
 * - Consistent API across the app
 */

import PropTypes from 'prop-types';
import { Badge } from '../ui/badge';
import {
  getProgramStatusBadge,
  getWeekStatusBadge,
  getDifficultyBadge,
  getStyleBadge,
  getCategoryBadge,
} from '../../utils/badges';

const StatusBadge = ({ type, value, className, ...props }) => {
  let config = {};

  switch (type) {
    case 'programStatus':
      config = getProgramStatusBadge(value);
      break;

    case 'weekStatus':
      config = getWeekStatusBadge(value);
      // Week status can return null if no badge needed
      if (!config) return null;
      break;

    case 'difficulty':
      config = getDifficultyBadge(value);
      break;

    case 'style':
      config = getStyleBadge(value);
      break;

    case 'category':
      config = getCategoryBadge(value);
      break;

    default:
      console.warn(`Unknown badge type: ${type}`);
      return null;
  }

  const { Icon, iconProps, children, className: configClassName, ...rest } = config;

  // Merge custom className with badge-specific className
  const mergedClassName = className
    ? `${configClassName} ${className}`
    : configClassName;

  return (
    <Badge
      {...rest}
      {...props}
      className={mergedClassName}
    >
      {Icon && <Icon {...iconProps} />}
      {children}
    </Badge>
  );
};

StatusBadge.propTypes = {
  type: PropTypes.oneOf([
    'programStatus',
    'weekStatus',
    'difficulty',
    'style',
    'category',
  ]).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object, // For weekStatus
  ]).isRequired,
  className: PropTypes.string,
};

export default StatusBadge;
