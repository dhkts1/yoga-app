import { Card, Text } from '../design-system';

/**
 * HeatmapCalendar - GitHub-style practice frequency calendar
 * Shows last 30 days of practice with intensity-based coloring
 * Interactive: click days to view session details
 */
function HeatmapCalendar({
  title = 'Practice Calendar',
  practiceData = {},
  days = 30,
  className = '',
  onDayClick = null, // Callback when a day is clicked
  selectedDate = null // Currently selected date for highlighting
}) {
  // Generate array of last N days
  const generateDays = () => {
    const daysList = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dateString = date.toDateString();
      const practiceInfo = practiceData[dateString] || { sessions: 0, totalMinutes: 0 };

      daysList.push({
        date,
        dateString,
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        sessions: practiceInfo.sessions,
        totalMinutes: practiceInfo.totalMinutes,
        intensity: getIntensity(practiceInfo.sessions, practiceInfo.totalMinutes)
      });
    }

    return daysList;
  };

  // Calculate intensity level (0-4) based on sessions and minutes
  const getIntensity = (sessions, minutes) => {
    if (sessions === 0) return 0;
    if (sessions === 1 && minutes < 10) return 1;
    if (sessions === 1 && minutes < 20) return 2;
    if (sessions === 1 || minutes < 30) return 3;
    return 4; // Multiple sessions or long sessions
  };

  // Get color class for intensity level
  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 0: return 'bg-cream-200'; // No practice
      case 1: return 'bg-sage-200'; // Light practice
      case 2: return 'bg-sage-300'; // Moderate practice
      case 3: return 'bg-sage-500'; // Good practice
      case 4: return 'bg-sage-700'; // Intense practice
      default: return 'bg-cream-200';
    }
  };

  const daysList = generateDays();
  const totalPracticeDays = daysList.filter(day => day.sessions > 0).length;
  const currentStreak = calculateCurrentStreak(daysList);

  // Get month label for first day of each month in the range
  const getMonthLabel = (day, index) => {
    if (day.day === 1 || index === 0) {
      return day.date.toLocaleDateString('en-US', { month: 'short' });
    }
    return null;
  };

  return (
    <Card className={`p-4 !overflow-visible ${className}`}>
      {/* Title */}
      <Text variant="body" className="font-medium mb-4">
        {title}
      </Text>

      {/* Calendar Grid */}
      <div className="space-y-3 overflow-visible">
        {/* Month labels */}
        <div className="flex items-center gap-2 mb-2">
          {daysList.map((day, index) => {
            const monthLabel = getMonthLabel(day, index);
            if (monthLabel && (index === 0 || day.day === 1)) {
              return (
                <Text key={`month-${index}`} variant="caption" className="text-sage-700 font-medium text-xs">
                  {monthLabel}
                </Text>
              );
            }
            return null;
          }).filter(Boolean)}
        </div>

        {/* Days grid - 7 columns for weeks */}
        <div className="grid grid-cols-7 gap-1.5 overflow-visible">
          {/* Day labels */}
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayName, index) => (
            <div key={dayName + index} className="text-center">
              <Text variant="caption" className="text-secondary text-xs">
                {dayName}
              </Text>
            </div>
          ))}

          {/* Pad beginning to align with correct day of week */}
          {Array.from({ length: daysList[0]?.date.getDay() || 0 }).map((_, index) => (
            <div key={`pad-${index}`} className="w-8 h-8" />
          ))}

          {/* Practice days */}
          {daysList.map((day, dayIndex) => {
            const isSelected = selectedDate && day.dateString === new Date(selectedDate).toDateString();
            const isClickable = onDayClick && day.sessions > 0;

            // Calculate which row this day is in (0-indexed)
            const paddingDays = daysList[0]?.date.getDay() || 0;
            const gridPosition = paddingDays + dayIndex;
            const rowNumber = Math.floor(gridPosition / 7);

            // Show tooltip above for bottom 2 rows, below for others
            const totalRows = Math.ceil((daysList.length + paddingDays) / 7);
            const isBottomRows = rowNumber >= totalRows - 2;
            const tooltipPositionClass = isBottomRows ? 'bottom-16' : 'top-16';

            return (
              <button
                key={day.dateString}
                onClick={() => isClickable && onDayClick(day)}
                disabled={!isClickable}
                className={`w-8 h-8 rounded-md ${getIntensityColor(day.intensity)}
                           hover:ring-2 hover:ring-sage-400 transition-all duration-200
                           ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                           ${isSelected ? 'ring-2 ring-gold-500' : ''}
                           relative group flex items-center justify-center
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500`}
                aria-label={`${day.date.toLocaleDateString()} - ${day.sessions} sessions, ${day.totalMinutes} minutes`}
              >
                {/* Day number displayed inside cell */}
                <span className="text-[10px] font-medium text-sage-700 opacity-70">
                  {day.day}
                </span>

                {/* Tooltip on hover - positioned dynamically based on row */}
                <div className={`absolute ${tooltipPositionClass} left-1/2 -translate-x-1/2
                              bg-gray-800 text-white text-xs rounded px-2 py-1
                              opacity-0 group-hover:opacity-100 transition-opacity
                              pointer-events-none z-50 whitespace-nowrap shadow-lg min-w-max`}>
                  {day.date.toLocaleDateString()}<br />
                  {day.sessions} session{day.sessions !== 1 ? 's' : ''}<br />
                  {day.totalMinutes} min
                  {day.sessions > 0 && <><br /><span className="text-gold-300">Click to view details</span></>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Text variant="caption" className="text-secondary">
              Less
            </Text>
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getIntensityColor(level)}`}
              />
            ))}
            <Text variant="caption" className="text-secondary">
              More
            </Text>
          </div>
        </div>

        {/* Summary stats */}
        <div className="flex justify-between pt-2 border-t border-cream-300">
          <div className="text-center">
            <Text variant="caption" className="text-secondary">
              Practice Days
            </Text>
            <Text variant="body" className="font-medium">
              {totalPracticeDays}/{days}
            </Text>
          </div>
          <div className="text-center">
            <Text variant="caption" className="text-secondary">
              Current Streak
            </Text>
            <Text variant="body" className="font-medium">
              {currentStreak} day{currentStreak !== 1 ? 's' : ''}
            </Text>
          </div>
          <div className="text-center">
            <Text variant="caption" className="text-secondary">
              Consistency
            </Text>
            <Text variant="body" className="font-medium">
              {Math.round((totalPracticeDays / days) * 100)}%
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Helper function to calculate current streak from recent days
function calculateCurrentStreak(daysList) {
  let streak = 0;

  // Start from most recent day and count backwards
  for (let i = daysList.length - 1; i >= 0; i--) {
    if (daysList[i].sessions > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export default HeatmapCalendar;