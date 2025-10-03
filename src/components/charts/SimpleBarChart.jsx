import { memo } from 'react';
import { Card, Text } from '../design-system';

/**
 * SimpleBarChart - Pure CSS/SVG bar chart component
 * Used for displaying pose frequency, session types, etc.
 * Memoized for performance optimization
 */
const SimpleBarChart = memo(function SimpleBarChart({
  title,
  data = [],
  maxItems = 5,
  showValues = true,
  className = ''
}) {
  // Prepare data: sort by value descending and take top items
  const sortedData = [...data]
    .sort((a, b) => b.value - a.value)
    .slice(0, maxItems);

  if (sortedData.length === 0) {
    return (
      <Card className={`p-4 ${className}`}>
        <Text variant="body" className="mb-4 font-medium">
          {title}
        </Text>
        <div className="py-8 text-center">
          <Text variant="caption" className="text-muted-foreground">
            No data available yet
          </Text>
        </div>
      </Card>
    );
  }

  const maxValue = Math.max(...sortedData.map(item => item.value));

  return (
    <Card className={`p-4 ${className}`}>
      {/* Title */}
      <Text variant="body" className="mb-4 font-medium">
        {title}
      </Text>

      {/* Chart */}
      <div className="space-y-3">
        {sortedData.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

          return (
            <div key={item.label || index} className="space-y-1">
              {/* Label and Value */}
              <div className="flex items-center justify-between">
                <Text variant="caption" className="font-medium text-foreground">
                  {item.label}
                </Text>
                {showValues && (
                  <Text variant="caption" className="text-muted-foreground">
                    {item.value}
                  </Text>
                )}
              </div>

              {/* Bar */}
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="bg-muted0 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend/Note */}
      {sortedData.length > 0 && (
        <Text variant="caption" className="mt-3 block text-muted-foreground">
          Top {sortedData.length} most practiced
        </Text>
      )}
    </Card>
  );
});

export default SimpleBarChart;