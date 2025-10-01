
/**
 * PoseImage Component
 *
 * Displays abstract SVG illustrations for yoga poses with proper styling
 * and responsive behavior. Follows the app's design system principles.
 */
const PoseImage = ({
  pose,
  size = 'medium',
  className = '',
  showName = false
}) => {
  // Size variants
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48',
    full: 'w-full h-full'
  };

  if (!pose || !pose.imageUrl) {
    return (
      <div
        className={`
          ${sizeClasses[size]}
          bg-sage-100
          rounded-lg
          flex items-center justify-center
          ${className}
        `}
      >
        <div className="text-sage-400 text-2xl">
          {pose?.emoji || '🧘'}
        </div>
      </div>
    );
  }

  return (
    <div className={`pose-image-container ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          relative
          rounded-lg
          overflow-hidden
          transition-all duration-300 ease-out
          hover:scale-105
          hover:shadow-lg
        `}
      >
        <img
          src={pose.imageUrl}
          alt={`${pose.nameEnglish} (${pose.nameSanskrit})`}
          className="
            w-full
            h-full
            object-contain
            transition-opacity duration-300
          "
          onError={(e) => {
            // Fallback to emoji if SVG fails to load
            e.target.style.display = 'none';
            const fallback = e.target.parentElement.querySelector('.fallback-emoji');
            if (fallback) fallback.style.display = 'flex';
          }}
        />

        {/* Fallback emoji if SVG fails */}
        <div
          className="
            fallback-emoji
            hidden
            absolute inset-0
            bg-sage-50
            rounded-lg
            flex items-center justify-center
            text-4xl
          "
        >
          {pose.emoji}
        </div>

        {/* Optional gentle gradient overlay for depth */}
        <div className="
          absolute inset-0
          bg-gradient-to-t
          from-black/5
          to-transparent
          pointer-events-none
        " />
      </div>

      {showName && (
        <div className="mt-2 text-center">
          <div className="text-sm font-medium text-sage-800">
            {pose.nameEnglish}
          </div>
          <div className="text-xs text-sage-600 font-light">
            {pose.nameSanskrit}
          </div>
        </div>
      )}
    </div>
  );
};

export default PoseImage;