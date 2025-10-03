/**
 * Badge Utility Functions
 *
 * Centralized badge configuration for consistent styling across the app.
 * Returns props objects compatible with the Badge component.
 *
 * Usage:
 *   import { getProgramStatusBadge } from '../utils/badges';
 *   const { className, Icon, iconProps, children } = getProgramStatusBadge('active');
 *   <Badge className={className}>{Icon && <Icon {...iconProps} />}{children}</Badge>
 *
 * Or use the helper to render directly:
 *   import { Badge } from '../components/ui/badge';
 *   import { renderBadgeWithIcon } from '../utils/badges';
 *   renderBadgeWithIcon(getProgramStatusBadge('active'))
 */

import { Play, Pause, CheckCircle2, Lock } from "lucide-react";

/**
 * Program Status Badges
 * Used in Programs.jsx and ProgramDetail.jsx
 *
 * @param {string} status - 'active' | 'paused' | 'completed' | 'not-started'
 * @returns {Object} Badge config { className, Icon, iconProps, children }
 */
export function getProgramStatusBadge(status) {
  const configs = {
    active: {
      className: "bg-sage-600 text-primary-foreground border-0",
      Icon: Play,
      iconProps: { className: "h-3 w-3 mr-1" },
      children: "Active",
    },
    paused: {
      className: "bg-state-warning text-primary-foreground border-0",
      Icon: Pause,
      iconProps: { className: "h-3 w-3 mr-1" },
      children: "Paused",
    },
    completed: {
      className: "bg-state-success text-primary-foreground border-0",
      Icon: CheckCircle2,
      iconProps: { className: "h-3 w-3 mr-1" },
      children: "Completed",
    },
    "not-started": {
      className: "bg-background text-sage-700 border-sage-300",
      variant: "outline",
      Icon: Lock,
      iconProps: { className: "h-3 w-3 mr-1" },
      children: "Not Started",
    },
  };

  return configs[status] || configs["not-started"];
}

/**
 * Week Status Badges
 * Used in ProgramDetail.jsx for individual week status
 *
 * @param {Object} options - { isCompleted, isCurrent, isActive, isUnlocked }
 * @returns {Object|null} Badge config or null if no badge needed
 */
export function getWeekStatusBadge({
  isCompleted,
  isCurrent,
  isActive,
  isUnlocked,
}) {
  if (isCompleted) {
    return {
      className: "bg-state-success text-primary-foreground border-0",
      Icon: CheckCircle2,
      iconProps: { className: "h-3 w-3 mr-1" },
      children: "Completed",
    };
  }

  if (isCurrent && isActive) {
    return {
      className: "bg-sage-600 text-primary-foreground border-0",
      Icon: Play,
      iconProps: { className: "h-3 w-3 mr-1" },
      children: "Current",
    };
  }

  if (!isUnlocked) {
    return {
      className: "bg-muted text-muted-foreground border-border",
      variant: "outline",
      Icon: Lock,
      iconProps: { className: "h-3 w-3 mr-1" },
      children: "Locked",
    };
  }

  return null;
}

/**
 * Difficulty Level Badges
 * Used in Programs.jsx and other components showing difficulty
 *
 * @param {string} difficulty - 'beginner' | 'intermediate' | 'advanced' | 'mixed'
 * @returns {Object} Badge component props { className, children }
 */
export function getDifficultyBadge(difficulty) {
  const configs = {
    beginner: {
      className: "bg-state-info/10 text-state-info border-0",
      children: "Beginner",
    },
    intermediate: {
      className: "bg-accent/20 text-accent border-0",
      children: "Intermediate",
    },
    advanced: {
      className: "bg-gold/20 text-accent border-0",
      children: "Advanced",
    },
    mixed: {
      className: "bg-muted text-muted-foreground border-0",
      children: "Mixed",
    },
  };

  return configs[difficulty] || configs.beginner;
}

/**
 * Yoga Style Badges
 * Used in Programs.jsx and other components showing yoga style
 *
 * @param {string} style - 'iyengar' | 'vinyasa' | 'hatha' | 'restorative'
 * @returns {Object} Badge component props { className, children }
 */
export function getStyleBadge(style) {
  const configs = {
    iyengar: {
      className: "bg-sage-100 text-sage-800 border-0",
      children: "Iyengar",
    },
    vinyasa: {
      className: "bg-accent/20 text-accent border-0",
      children: "Vinyasa",
    },
    hatha: {
      className: "bg-cream-200 text-sage-800 border-0",
      children: "Hatha",
    },
    restorative: {
      className: "bg-cream-200 text-sage-700 border-0",
      children: "Restorative",
    },
  };

  return (
    configs[style] || {
      className: "bg-muted text-muted-foreground border-0",
      children: style.charAt(0).toUpperCase() + style.slice(1),
    }
  );
}

/**
 * Breathing Exercise Category Badges
 * Used in Breathing.jsx for exercise categories
 *
 * @param {string} category - 'calming' | 'relaxing' | 'energizing' | 'balancing'
 * @returns {Object} Style classes for inline badge rendering { bg, text }
 */
export function getCategoryColors(category) {
  const configs = {
    calming: {
      bg: "bg-sage-100",
      text: "text-sage-700",
    },
    relaxing: {
      bg: "bg-sage-100",
      text: "text-sage-700",
    },
    energizing: {
      bg: "bg-gold/20",
      text: "text-accent",
    },
    balancing: {
      bg: "bg-accent/20",
      text: "text-accent",
    },
  };

  return configs[category] || configs.calming;
}

/**
 * Breathing Exercise Category Badge (Full Badge Props)
 * Alternative to getCategoryColors for Badge component usage
 *
 * @param {string} category - 'calming' | 'relaxing' | 'energizing' | 'balancing'
 * @returns {Object} Badge component props { className, children }
 */
export function getCategoryBadge(category) {
  const configs = {
    calming: {
      className: "bg-sage-100 text-sage-700 border-0",
      children: "Calming",
    },
    relaxing: {
      className: "bg-sage-100 text-sage-700 border-0",
      children: "Relaxing",
    },
    energizing: {
      className: "bg-gold/20 text-accent border-0",
      children: "Energizing",
    },
    balancing: {
      className: "bg-accent/20 text-accent border-0",
      children: "Balancing",
    },
  };

  return configs[category] || configs.calming;
}

/**
 * Get all badge utility functions
 * Useful for importing all utilities at once
 */
export const badgeUtils = {
  getProgramStatusBadge,
  getWeekStatusBadge,
  getDifficultyBadge,
  getStyleBadge,
  getCategoryColors,
  getCategoryBadge,
};

export default badgeUtils;
