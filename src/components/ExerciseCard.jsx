import PropTypes from 'prop-types';
import { Card, Heading } from './design-system';
import FavoriteButton from './FavoriteButton';
import { getCategoryColors } from '../utils/badges';

/**
 * ExerciseCard Component
 *
 * Displays a breathing exercise with emoji, title, duration, and category badge.
 * Used in Breathing.jsx for both favorite and non-favorite exercise lists.
 *
 * @param {Object} props
 * @param {Object} props.exercise - Exercise data object
 * @param {string} props.exercise.id - Unique exercise ID
 * @param {string} props.exercise.nameEnglish - Exercise name
 * @param {string} props.exercise.emoji - Exercise emoji
 * @param {string} props.exercise.category - Exercise category (calming, energizing, etc.)
 * @param {number} props.exercise.defaultDuration - Default duration in minutes
 * @param {number} props.selectedDuration - User-selected duration in minutes
 * @param {Function} props.onClick - Click handler for the card
 * @param {boolean} [props.isFavorite] - Whether this is a favorite exercise
 *
 * @example
 * <ExerciseCard
 *   exercise={exercise}
 *   selectedDuration={5}
 *   onClick={() => handleSelect(exercise.id)}
 *   isFavorite={true}
 * />
 */
function ExerciseCard({ exercise, selectedDuration, onClick, isFavorite = false }) {
  const categoryStyle = getCategoryColors(exercise.category);

  return (
    <Card
      className={`p-0 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] relative ${
        isFavorite ? 'border-l-4 border-gold' : ''
      }`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Exercise Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 flex-shrink-0">
              <span className="text-2xl">{exercise.emoji}</span>
            </div>
            <div className="flex-1 min-w-0">
              <Heading level={3} className="text-base truncate">
                {exercise.nameEnglish}
              </Heading>
              <div className="flex items-center gap-2 text-xs text-secondary flex-wrap">
                <span>{exercise.defaultDuration} min</span>
                <span>•</span>
                <span className={`capitalize px-2 py-0.5 rounded-full ${categoryStyle.bg} ${categoryStyle.text} font-medium`}>
                  {exercise.category}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Duration & Favorite Button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <div className="text-lg font-bold text-sage-700">{selectedDuration}</div>
              <div className="text-[10px] text-secondary">min</div>
            </div>
            <FavoriteButton itemId={exercise.id} type="breathing" size="sm" />
          </div>
        </div>
      </div>
    </Card>
  );
}

ExerciseCard.propTypes = {
  exercise: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nameEnglish: PropTypes.string.isRequired,
    emoji: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    defaultDuration: PropTypes.number.isRequired,
  }).isRequired,
  selectedDuration: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool,
};

export default ExerciseCard;
