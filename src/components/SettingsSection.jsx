import { ChevronDown } from 'lucide-react';
import { Heading, Text } from './design-system/Typography';
import { Card } from './design-system/Card';

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
  iconBgColor = 'bg-cream-100',
  children,
  isOpen = false,
  onToggle
}) {
  return (
    <Card variant="default" padding="none" className="overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 hover:bg-sage-50 transition-colors group"
        aria-expanded={isOpen}
        aria-controls={`settings-section-${id}`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${iconBgColor} text-sage-600`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="text-left">
            <Heading level={3} className="text-sage-800 text-base sm:text-lg">
              {title}
            </Heading>
            <Text variant="caption" className="text-sage-600">
              {subtitle}
            </Text>
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-sage-500 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          id={`settings-section-${id}`}
          className="space-y-4 p-4 sm:p-5 pt-0 border-t border-sage-100 animate-in fade-in slide-in-from-top-2 duration-300"
        >
          {children}
        </div>
      )}
    </Card>
  );
}

export default SettingsSection;
