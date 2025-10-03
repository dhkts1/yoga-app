import { Text } from "./design-system/Typography";
import { Card } from "./design-system";

/**
 * ThemeColorSelector Component
 * Reusable theme color picker for both light and dark mode themes
 *
 * Props:
 * @param {string} mode - "light" or "dark" - determines which mode we're configuring
 * @param {Object} themes - Theme data object (LIGHT_MODE_THEMES or DARK_MODE_THEMES)
 * @param {string} currentTheme - Currently selected theme key
 * @param {string} customColor - Custom color hex value
 * @param {function} onThemeChange - Callback when theme selection changes
 * @param {function} onColorChange - Callback when custom color changes
 */
function ThemeColorSelector({
  mode,
  themes,
  currentTheme,
  customColor,
  onThemeChange,
  onColorChange,
}) {
  const modeLabel = mode === "light" ? "Light Mode" : "Dark Mode";

  return (
    <div className="mt-4 border-t border-border py-4">
      <div className="mb-4">
        <Text className="font-medium text-foreground">
          {modeLabel} Color
        </Text>
        <Text variant="caption" className="text-muted-foreground">
          Choose your preferred {mode} mode palette
        </Text>
      </div>

      <div className="space-y-1.5">
        {Object.entries(themes).map(([key, themeData]) => {
          const isSelected = currentTheme === key;
          const isCustom = key === "custom";

          return (
            <Card
              key={key}
              variant={isSelected ? "outlined" : "default"}
              padding="xs"
              interactive
              onClick={() => onThemeChange(key)}
              className={isSelected ? "border-primary bg-primary/5" : ""}
            >
              <div className="flex items-center gap-2.5">
                {/* Color preview circle */}
                <div className="relative shrink-0">
                  <div
                    className="size-8 rounded-full border-2 border-border"
                    style={{
                      backgroundColor: isCustom ? customColor : themeData.preview,
                    }}
                  />
                  {/* Color picker for custom theme */}
                  {isCustom && (
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => {
                        onColorChange(e.target.value);
                        onThemeChange("custom");
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute inset-0 size-full cursor-pointer rounded-full opacity-0"
                      title="Pick a custom color"
                    />
                  )}
                </div>

                {/* Theme info */}
                <div className="min-w-0 flex-1">
                  <Text className="font-medium leading-tight text-foreground">
                    {themeData.name}
                  </Text>
                  <Text
                    variant="caption"
                    className="leading-tight text-muted-foreground"
                  >
                    {themeData.description}
                  </Text>
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <div className="shrink-0 text-foreground">
                    <svg
                      className="size-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default ThemeColorSelector;
