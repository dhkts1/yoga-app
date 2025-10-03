import { memo } from "react";
import { Card, Text } from "../design-system";

/**
 * HeatmapCalendar - GitHub-style practice frequency calendar
 * Shows last 30 days of practice with intensity-based coloring
 * Interactive: click days to view session details
 * Memoized for performance optimization
 */
const HeatmapCalendar = memo(function HeatmapCalendar({
  title = "Practice Calendar",
  practiceData = {},
  days = 30,
  className = "",
  onDayClick = null, // Callback when a day is clicked
  selectedDate = null, // Currently selected date for highlighting
}) {
  // Generate array of last N days
  const generateDays = () => {
    const daysList = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dateString = date.toDateString();
      const practiceInfo = practiceData[dateString] || {
        sessions: 0,
        totalMinutes: 0,
      };

      daysList.push({
        date,
        dateString,
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        sessions: practiceInfo.sessions,
        totalMinutes: practiceInfo.totalMinutes,
        intensity: getIntensity(
          practiceInfo.sessions,
          practiceInfo.totalMinutes,
        ),
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
      case 0:
        return "bg-muted"; // No practice
      case 1:
        return "bg-muted"; // Light practice
      case 2:
        return "bg-muted"; // Moderate practice
      case 3:
        return "bg-muted0"; // Good practice
      case 4:
        return "bg-secondary"; // Intense practice
      default:
        return "bg-muted";
    }
  };

  const daysList = generateDays();
  const totalPracticeDays = daysList.filter((day) => day.sessions > 0).length;
  const currentStreak = calculateCurrentStreak(daysList);

  // Get month label for first day of each month in the range
  const getMonthLabel = (day, index) => {
    if (day.day === 1 || index === 0) {
      return day.date.toLocaleDateString("en-US", { month: "short" });
    }
    return null;
  };

  return (
    <Card className={`p-4 ${className}`}>
      {/* Title */}
      <Text variant="body" className="mb-4 font-medium">
        {title}
      </Text>

      {/* Calendar Grid */}
      <div className="space-y-3">
        {/* Month labels */}
        <div className="mb-2 flex items-center gap-2">
          {daysList
            .map((day, index) => {
              const monthLabel = getMonthLabel(day, index);
              if (monthLabel && (index === 0 || day.day === 1)) {
                return (
                  <Text
                    key={`month-${index}`}
                    variant="caption"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    {monthLabel}
                  </Text>
                );
              }
              return null;
            })
            .filter(Boolean)}
        </div>

        {/* Days grid - 7 columns for weeks */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Day labels */}
          {["S", "M", "T", "W", "T", "F", "S"].map((dayName, index) => (
            <div key={dayName + index} className="text-center">
              <Text variant="caption" className="text-xs text-muted-foreground">
                {dayName}
              </Text>
            </div>
          ))}

          {/* Pad beginning to align with correct day of week */}
          {Array.from({ length: daysList[0]?.date.getDay() || 0 }).map(
            (_, index) => (
              <div key={`pad-${index}`} className="size-8" />
            ),
          )}

          {/* Practice days */}
          {daysList.map((day, dayIndex) => {
            const isSelected =
              selectedDate &&
              day.dateString === new Date(selectedDate).toDateString();
            const isClickable = onDayClick && day.sessions > 0;

            // Calculate which row this day is in (0-indexed)
            const paddingDays = daysList[0]?.date.getDay() || 0;
            const gridPosition = paddingDays + dayIndex;
            const rowNumber = Math.floor(gridPosition / 7);

            // Show tooltip above for bottom 2 rows, below for others
            const totalRows = Math.ceil((daysList.length + paddingDays) / 7);
            const isBottomRows = rowNumber >= totalRows - 2;
            const tooltipPositionClass = isBottomRows ? "bottom-16" : "top-16";

            return (
              <button
                key={day.dateString}
                onClick={() => isClickable && onDayClick(day)}
                disabled={!isClickable}
                className={`size-8 rounded-md ${getIntensityColor(day.intensity)} transition-all duration-200 hover:ring-2 hover:ring-sage-400 ${isClickable ? "cursor-pointer" : "cursor-default"} ${isSelected ? "ring-2 ring-gold-500" : ""} group relative flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                aria-label={`${day.date.toLocaleDateString()} - ${day.sessions} sessions, ${day.totalMinutes} minutes`}
              >
                {/* Day number displayed inside cell */}
                <span className="text-[10px] font-medium text-muted-foreground opacity-70">
                  {day.day}
                </span>

                {/* Tooltip on hover - positioned dynamically based on row */}
                <div
                  className={`absolute ${tooltipPositionClass} pointer-events-none left-1/2 z-50 min-w-max -translate-x-1/2 whitespace-nowrap rounded border border-border bg-popover px-2 py-1 text-xs text-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100`}
                >
                  {day.date.toLocaleDateString()}
                  <br />
                  {day.sessions} session{day.sessions !== 1 ? "s" : ""}
                  <br />
                  {day.totalMinutes} min
                  {day.sessions > 0 && (
                    <>
                      <br />
                      <span className="text-accent">Click to view details</span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Text variant="caption" className="text-muted-foreground">
              Less
            </Text>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`size-3 rounded-sm ${getIntensityColor(level)}`}
              />
            ))}
            <Text variant="caption" className="text-muted-foreground">
              More
            </Text>
          </div>
        </div>

        {/* Summary stats */}
        <div className="flex justify-between border-t border-border pt-2">
          <div className="text-center">
            <Text variant="caption" className="text-muted-foreground">
              Practice Days
            </Text>
            <Text variant="body" className="font-medium">
              {totalPracticeDays}/{days}
            </Text>
          </div>
          <div className="text-center">
            <Text variant="caption" className="text-muted-foreground">
              Current Streak
            </Text>
            <Text variant="body" className="font-medium">
              {currentStreak} day{currentStreak !== 1 ? "s" : ""}
            </Text>
          </div>
          <div className="text-center">
            <Text variant="caption" className="text-muted-foreground">
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
});

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
