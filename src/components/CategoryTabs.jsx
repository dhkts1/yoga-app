import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';

/**
 * CategoryTabs Component
 *
 * Dropdown menu for filtering sessions by category.
 * Mobile-first design with 44px minimum touch targets.
 */
function CategoryTabs({ categories, selectedCategory, onCategoryChange, counts = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedCat = categories.find(c => c.id === selectedCategory) || categories[0];
  const selectedCount = counts[selectedCategory] || 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (categoryId) => {
    onCategoryChange(categoryId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Category Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white rounded-xl border-2 border-sage-200 hover:border-sage-400 transition-colors min-h-[56px] shadow-sm"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-xl flex-shrink-0" aria-hidden="true">
            {selectedCat.icon}
          </span>
          <span className="text-base font-medium text-sage-900 truncate">
            {selectedCat.label}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-sage-100 text-sage-700 font-medium">
            {selectedCount}
          </span>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-sage-600 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border-2 border-sage-200 shadow-lg z-[9999] overflow-hidden">
          <div className="max-h-[60vh] overflow-y-auto">
            {categories.map((category) => {
              const isActive = selectedCategory === category.id;
              const count = counts[category.id] || 0;
              const hasContent = count > 0;

              return (
                <button
                  key={category.id}
                  onClick={() => handleSelect(category.id)}
                  disabled={!hasContent && category.id !== 'all'}
                  className={`
                    w-full flex items-center justify-between gap-3 px-4 py-3 text-left min-h-[56px]
                    transition-colors border-b border-sage-100 last:border-b-0
                    ${
                      isActive
                        ? 'bg-sage-700 text-white'
                        : hasContent || category.id === 'all'
                        ? 'hover:bg-sage-50 active:bg-sage-100 text-sage-900'
                        : 'opacity-40 cursor-not-allowed text-sage-400'
                    }
                  `}
                  aria-label={`${category.label} category${hasContent ? ` (${count} items)` : ''}`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xl flex-shrink-0" aria-hidden="true">
                      {category.icon}
                    </span>
                    <span className="text-base font-medium truncate">
                      {category.label}
                    </span>
                  </div>
                  {(hasContent || category.id === 'all') && (
                    <span
                      className={`
                        text-xs px-2 py-1 rounded-full font-medium flex-shrink-0
                        ${
                          isActive
                            ? 'bg-sage-600 text-white'
                            : 'bg-sage-100 text-sage-700'
                        }
                      `}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

CategoryTabs.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  counts: PropTypes.objectOf(PropTypes.number)
};

export default CategoryTabs;
