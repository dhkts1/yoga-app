import { Star } from 'lucide-react';
import { useState } from 'react';
import usePreferencesStore from '../stores/preferences';
import useAnalyticsStore from '../stores/analytics';

/**
 * FavoriteButton Component
 *
 * A star icon button that allows users to favorite/unfavorite sessions or breathing exercises.
 * Features smooth scale animation on toggle and gold color when favorited.
 *
 * @param {Object} props
 * @param {string} props.itemId - Session or exercise ID
 * @param {string} props.type - 'session' or 'breathing'
 * @param {string} props.size - 'sm', 'md', or 'lg'
 * @param {string} props.className - Additional CSS classes
 * @param {function} props.onToggle - Optional callback when favorite is toggled
 */
function FavoriteButton({
  itemId,
  type = 'session',
  size = 'md',
  className = '',
  onToggle = null
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  // Get favorite methods from preferences store
  const {
    isFavorite,
    toggleFavoriteSession,
    toggleFavoriteExercise
  } = usePreferencesStore();

  // Get analytics tracking from analytics store
  const { trackFavoriteAction } = useAnalyticsStore();

  const isFavorited = isFavorite(itemId, type);

  // Size mappings
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-7 w-7'
  };

  const buttonSizeClasses = {
    sm: 'p-2 min-w-[44px] min-h-[44px]',
    md: 'p-2.5 min-w-[44px] min-h-[44px]',
    lg: 'p-3 min-w-[48px] min-h-[48px]'
  };

  const handleToggle = (e) => {
    // Prevent event bubbling (so clicking star doesn't trigger parent onClick)
    e.stopPropagation();
    e.preventDefault();

    // Trigger animation
    setIsAnimating(true);

    // Toggle favorite based on type
    if (type === 'breathing') {
      toggleFavoriteExercise(itemId);
    } else {
      toggleFavoriteSession(itemId);
    }

    // Track analytics
    trackFavoriteAction({
      itemId,
      type,
      action: isFavorited ? 'remove' : 'add'
    });

    // Call optional callback
    if (onToggle) {
      onToggle(!isFavorited);
    }

    // Reset animation after completion
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        flex items-center justify-center
        ${buttonSizeClasses[size]}
        rounded-full
        transition-all duration-200
        hover:bg-muted
        focus:outline-none
        focus:ring-2 focus:ring-sage-300 focus:ring-offset-1 active:scale-95
        ${className}
      `}
      aria-label={isFavorited ? `Remove ${itemId} from favorites` : `Add ${itemId} to favorites`}
      aria-pressed={isFavorited}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star
        className={`
          ${sizeClasses[size]}
          transition-all duration-150
          ${isFavorited ? 'fill-accent text-accent' : 'text-muted-foreground'}
          ${isAnimating ? 'animate-bounce-scale' : ''}
        `}
      />
    </button>
  );
}

export default FavoriteButton;
