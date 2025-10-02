import { Heart, TrendingUp, Star } from 'lucide-react';

/**
 * Mood Calculator Utility
 *
 * Calculates mood and energy improvements from pre/post practice data
 * and returns formatted results with icons, messages, and styling.
 *
 * @module moodCalculator
 */

/**
 * Calculate mood improvement metrics and return formatted result
 *
 * @param {Object} preMoodData - Pre-practice mood/energy data
 * @param {Object} preMoodData.mood - { emoji: string, value: number (1-5), label: string }
 * @param {Object} preMoodData.energy - { value: number (1-5), label: string, color: string }
 * @param {Object} postMoodData - Post-practice mood/energy data
 * @param {Object} postMoodData.mood - { emoji: string, value: number (1-5), label: string }
 * @param {Object} postMoodData.energy - { value: number (1-5), label: string, color: string }
 *
 * @returns {Object|null} Result object with icon, message, detail, color or null if no data
 *
 * @example
 * // Mood improved, energy improved
 * calculateMoodImprovement(
 *   { mood: { emoji: '😐', value: 2 }, energy: { value: 2 } },
 *   { mood: { emoji: '😊', value: 4 }, energy: { value: 4 } }
 * )
 * // => {
 * //   icon: <Heart className="h-5 w-5 text-state-error" />,
 * //   message: "Your mood and energy both improved!",
 * //   detail: "Mood: 😐 → 😊 • Energy: +2",
 * //   color: "bg-state-success/10 border-state-success/30 text-state-success"
 * // }
 *
 * @example
 * // Mood improved only
 * calculateMoodImprovement(
 *   { mood: { emoji: '😐', value: 2 }, energy: { value: 3 } },
 *   { mood: { emoji: '😊', value: 4 }, energy: { value: 3 } }
 * )
 * // => {
 * //   icon: <TrendingUp className="h-5 w-5 text-state-success" />,
 * //   message: "Your mood improved!",
 * //   detail: "😐 → 😊",
 * //   color: "bg-state-success/10 border-state-success/30 text-state-success"
 * // }
 *
 * @example
 * // Energy improved only
 * calculateMoodImprovement(
 *   { mood: { emoji: '😊', value: 4 }, energy: { value: 2 } },
 *   { mood: { emoji: '😊', value: 4 }, energy: { value: 4 } }
 * )
 * // => {
 * //   icon: <TrendingUp className="h-5 w-5 text-state-info" />,
 * //   message: "Your energy level increased!",
 * //   detail: "Energy boost: +2",
 * //   color: "bg-state-info/10 border-state-info/30 text-state-info"
 * // }
 *
 * @example
 * // No change (maintained positive state)
 * calculateMoodImprovement(
 *   { mood: { emoji: '😊', value: 4 }, energy: { value: 4 } },
 *   { mood: { emoji: '😊', value: 4 }, energy: { value: 4 } }
 * )
 * // => {
 * //   icon: <Star className="h-5 w-5 text-accent" />,
 * //   message: "You maintained your positive state!",
 * //   detail: "Consistency is key to wellbeing",
 * //   color: "bg-state-warning/10 border-state-warning/30 text-state-warning"
 * // }
 *
 * @example
 * // Decline or negative change
 * calculateMoodImprovement(
 *   { mood: { emoji: '😊', value: 4 }, energy: { value: 4 } },
 *   { mood: { emoji: '😐', value: 2 }, energy: { value: 2 } }
 * )
 * // => {
 * //   icon: <Heart className="h-5 w-5 text-muted-foreground" />,
 * //   message: "Thank you for taking time for yourself",
 * //   detail: "Every practice is valuable for your wellbeing",
 * //   color: "bg-muted border-border text-foreground"
 * // }
 *
 * @example
 * // Missing data
 * calculateMoodImprovement(null, { mood: { emoji: '😊', value: 4 }, energy: { value: 4 } })
 * // => null
 */
export function calculateMoodImprovement(preMoodData, postMoodData) {
  // Precondition: Both pre and post mood data must exist
  if (!preMoodData || !postMoodData) {
    return null;
  }

  // Precondition: Mood and energy objects must exist with value properties
  if (!preMoodData.mood?.value || !preMoodData.energy?.value ||
      !postMoodData.mood?.value || !postMoodData.energy?.value) {
    return null;
  }

  // Calculate improvement deltas
  const moodImprovement = postMoodData.mood.value - preMoodData.mood.value;
  const energyImprovement = postMoodData.energy.value - preMoodData.energy.value;

  // State-Action-State: Determine improvement category based on deltas
  // State 1: Both mood and energy improved
  if (moodImprovement > 0 && energyImprovement > 0) {
    return {
      icon: <Heart className="h-5 w-5 text-state-error" />,
      message: "Your mood and energy both improved!",
      detail: `Mood: ${preMoodData.mood.emoji} → ${postMoodData.mood.emoji} • Energy: +${energyImprovement}`,
      color: "bg-state-success/10 border-state-success/30 text-state-success"
    };
  }

  // State 2: Only mood improved
  if (moodImprovement > 0) {
    return {
      icon: <TrendingUp className="h-5 w-5 text-state-success" />,
      message: "Your mood improved!",
      detail: `${preMoodData.mood.emoji} → ${postMoodData.mood.emoji}`,
      color: "bg-state-success/10 border-state-success/30 text-state-success"
    };
  }

  // State 3: Only energy improved
  if (energyImprovement > 0) {
    return {
      icon: <TrendingUp className="h-5 w-5 text-state-info" />,
      message: "Your energy level increased!",
      detail: `Energy boost: +${energyImprovement}`,
      color: "bg-state-info/10 border-state-info/30 text-state-info"
    };
  }

  // State 4: No change (maintained state)
  if (moodImprovement === 0 && energyImprovement === 0) {
    return {
      icon: <Star className="h-5 w-5 text-accent" />,
      message: "You maintained your positive state!",
      detail: "Consistency is key to wellbeing",
      color: "bg-state-warning/10 border-state-warning/30 text-state-warning"
    };
  }

  // State 5: Decline or negative change (fallback)
  return {
    icon: <Heart className="h-5 w-5 text-muted-foreground" />,
    message: "Thank you for taking time for yourself",
    detail: "Every practice is valuable for your wellbeing",
    color: "bg-muted border-border text-foreground"
  };
}

/**
 * Get mood trend description for analytics
 *
 * @param {string} trendType - Trend type: 'improving' | 'stable' | 'declining' | 'insufficient_data'
 * @returns {string} Human-readable trend description
 *
 * @example
 * getMoodTrendText('improving') // => 'Mood improving ✨'
 * getMoodTrendText('stable') // => 'Mood stable 😌'
 * getMoodTrendText('declining') // => 'Consider more practice 💙'
 * getMoodTrendText('insufficient_data') // => 'No mood data yet'
 */
export function getMoodTrendText(trendType) {
  switch (trendType) {
    case 'improving':
      return 'Mood improving ✨';
    case 'stable':
      return 'Mood stable 😌';
    case 'declining':
      return 'Consider more practice 💙';
    case 'insufficient_data':
      return 'No mood data yet';
    default:
      return 'Tracking your wellbeing';
  }
}

/**
 * Calculate mood improvement percentage
 *
 * @param {number} preMoodValue - Pre-practice mood value (1-5)
 * @param {number} postMoodValue - Post-practice mood value (1-5)
 * @returns {number} Improvement percentage (0-100)
 *
 * @example
 * calculateMoodImprovementPercentage(2, 4) // => 50 (improved 2 out of 4 possible points)
 * calculateMoodImprovementPercentage(4, 5) // => 25 (improved 1 out of 4 possible points)
 * calculateMoodImprovementPercentage(3, 3) // => 0 (no change)
 * calculateMoodImprovementPercentage(4, 2) // => -50 (declined 2 out of 4 possible points)
 */
export function calculateMoodImprovementPercentage(preMoodValue, postMoodValue) {
  if (!preMoodValue || !postMoodValue) {
    return 0;
  }

  const improvement = postMoodValue - preMoodValue;
  const maxImprovement = 4; // Max possible change on 1-5 scale
  return Math.round((improvement / maxImprovement) * 100);
}
