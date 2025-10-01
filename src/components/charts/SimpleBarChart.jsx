import { Card, Text } from '../design-system';

/**
 * SimpleBarChart - Pure CSS/SVG bar chart component
 * Used for displaying pose frequency, session types, etc.
 */
function SimpleBarChart({
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
        <Text variant="body" className="font-medium mb-4">
          {title}
        </Text>
        <div className="text-center py-8">
          <Text variant="caption" className="text-secondary">
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
      <Text variant="body" className="font-medium mb-4">
        {title}
      </Text>

      {/* Chart */}
      <div className="space-y-3">
        {sortedData.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

          return (
            <div key={item.label || index} className="space-y-1">
              {/* Label and Value */}
              <div className="flex justify-between items-center">
                <Text variant="caption" className="text-primary font-medium">
                  {item.label}
                </Text>
                {showValues && (
                  <Text variant="caption" className="text-secondary">
                    {item.value}
                  </Text>
                )}
              </div>

              {/* Bar */}
              <div className="w-full bg-cream-200 rounded-full h-2">
                <div
                  className="bg-sage-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend/Note */}
      {sortedData.length > 0 && (
        <Text variant="caption" className="text-secondary mt-3 block">
          Top {sortedData.length} most practiced
        </Text>
      )}
    </Card>
  );
}

export default SimpleBarChart;