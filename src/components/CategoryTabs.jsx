import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { ChevronDown } from "lucide-react";
import { Badge } from "./design-system";
import { Text } from "./design-system/Typography";

/**
 * CategoryTabs Component
 *
 * Dropdown menu for filtering sessions by category.
 * Mobile-first design with compact layout.
 */
function CategoryTabs({
  categories,
  selectedCategory,
  onCategoryChange,
  counts = {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedCat =
    categories.find((c) => c.id === selectedCategory) || categories[0];
  const selectedCount = counts[selectedCategory] || 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
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
        className="flex min-h-touch w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm transition-colors hover:border-primary"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="shrink-0 text-base" aria-hidden="true">
            {selectedCat.icon}
          </span>
          <Text className="truncate text-sm font-medium text-foreground">
            {selectedCat.label}
          </Text>
          <Badge variant="default" size="sm">
            {selectedCount}
          </Badge>
        </div>
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute inset-x-0 top-full z-[9999] mt-1 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          <div className="max-h-[60vh] overflow-y-auto">
            {categories.map((category) => {
              const isActive = selectedCategory === category.id;
              const count = counts[category.id] || 0;
              const hasContent = count > 0;

              return (
                <button
                  key={category.id}
                  onClick={() => handleSelect(category.id)}
                  disabled={!hasContent && category.id !== "all"}
                  className={`flex min-h-touch w-full items-center justify-between gap-2 border-b border-border px-3 py-2 text-left transition-colors last:border-b-0 ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : hasContent || category.id === "all"
                        ? "text-foreground hover:bg-muted active:bg-muted"
                        : "cursor-not-allowed text-muted-foreground opacity-40"
                  } `}
                  aria-label={`${category.label} category${hasContent ? ` (${count} items)` : ""}`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="shrink-0 text-base" aria-hidden="true">
                      {category.icon}
                    </span>
                    <Text className="truncate text-sm font-medium">
                      {category.label}
                    </Text>
                  </div>
                  {(hasContent || category.id === "all") && (
                    <Badge
                      variant="default"
                      size="sm"
                      className={
                        isActive ? "bg-primary-foreground text-foreground" : ""
                      }
                    >
                      {count}
                    </Badge>
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
      icon: PropTypes.string.isRequired,
    }),
  ).isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  counts: PropTypes.objectOf(PropTypes.number),
};

export default CategoryTabs;
