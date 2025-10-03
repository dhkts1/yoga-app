import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import { Text } from "./design-system/Typography";

/**
 * SortDropdown Component
 *
 * Dropdown menu for sorting sessions.
 * Mobile-first design with compact layout.
 */
const sortOptions = [
  { id: "recent", label: "Recently Added", icon: "🆕" },
  { id: "duration-asc", label: "Shortest First", icon: "⏱️" },
  { id: "duration-desc", label: "Longest First", icon: "⏳" },
  { id: "alpha-asc", label: "A to Z", icon: "🔤" },
  { id: "alpha-desc", label: "Z to A", icon: "🔠" },
];

function SortDropdown({ selectedSort, onSortChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleSelect = (sortId) => {
    onSortChange(sortId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Sort Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 shadow-sm transition-colors hover:border-primary"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Sort options"
      >
        <ArrowUpDown className="size-3.5 shrink-0 text-muted-foreground" />
        <Text className="text-xs font-medium text-foreground">Sort</Text>
        <ChevronDown
          className={`size-3.5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-[9999] mt-1 min-w-[180px] overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          <div className="max-h-[60vh] overflow-y-auto">
            {sortOptions.map((option) => {
              const isActive = selectedSort === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`flex w-full items-center gap-2 border-b border-border px-3 py-2 text-left transition-colors last:border-b-0 ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted active:bg-muted"
                  } `}
                  aria-label={option.label}
                >
                  <span className="shrink-0 text-sm" aria-hidden="true">
                    {option.icon}
                  </span>
                  <Text className="truncate text-sm font-medium">
                    {option.label}
                  </Text>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

SortDropdown.propTypes = {
  selectedSort: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export default SortDropdown;
