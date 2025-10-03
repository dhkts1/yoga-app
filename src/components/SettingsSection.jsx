import { ChevronDown } from "lucide-react";
import { Heading, Text } from "./design-system/Typography";
import { Card } from "./design-system/Card";

/**
 * SettingsSection Component
 * Reusable collapsible section for Settings screen with accordion behavior
 *
 * @param {string} id - Unique identifier for the section (used for open/close state)
 * @param {string} title - Section heading
 * @param {string} subtitle - Section description
 * @param {React.Component} icon - Lucide icon component
 * @param {string} iconBgColor - Tailwind background color class for icon container
 * @param {React.ReactNode} children - Section content (shown when expanded)
 * @param {boolean} isOpen - Whether section is currently expanded
 * @param {function} onToggle - Callback when section header is clicked
 */
function SettingsSection({
  id,
  title,
  subtitle,
  icon: Icon,
  iconBgColor = "bg-muted",
  children,
  isOpen = false,
  onToggle,
}) {
  return (
    <Card variant="default" padding="none" className="overflow-hidden">
      <button
        onClick={onToggle}
        className="group flex w-full items-center justify-between gap-3 p-4 transition-colors hover:bg-muted sm:p-5"
        aria-expanded={isOpen}
        aria-controls={`settings-section-${id}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`rounded-lg p-2 ${iconBgColor} text-muted-foreground`}
          >
            <Icon className="size-5" />
          </div>
          <div className="text-left">
            <Heading level={3} className="text-base text-foreground sm:text-lg">
              {title}
            </Heading>
            <Text variant="caption" className="text-muted-foreground">
              {subtitle}
            </Text>
          </div>
        </div>
        <ChevronDown
          className={`size-5 text-muted-foreground transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          id={`settings-section-${id}`}
          className="space-y-2 border-t border-border px-4 pb-3 pt-0 duration-300 animate-in fade-in slide-in-from-top-2"
        >
          {children}
        </div>
      )}
    </Card>
  );
}

export default SettingsSection;
