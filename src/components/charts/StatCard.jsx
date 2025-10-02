import { Card, Text } from '../design-system';

/**
 * StatCard - Display key metrics in a clean card format
 * Used for insights dashboard to show practice statistics
 */
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendDirection = 'neutral',
  className = ''
}) {
  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-500';
      default: return 'text-secondary';
    }
  };

  const formatValue = (val) => {
    if (typeof val === 'number') {
      // Format large numbers with commas
      if (val >= 1000) {
        return val.toLocaleString();
      }
      return val.toString();
    }
    return val;
  };

  return (
    <Card className={`p-3 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Title */}
          <Text variant="caption" className="text-secondary mb-1 block text-xs">
            {title}
          </Text>

          {/* Main Value */}
          <div className="flex items-baseline space-x-1">
            <Text variant="heading" className="text-xl font-semibold text-primary">
              {formatValue(value)}
            </Text>
            {subtitle && (
              <Text variant="caption" className="text-secondary text-xs">
                {subtitle}
              </Text>
            )}
          </div>

          {/* Trend indicator */}
          {trend && (
            <Text variant="caption" className={`mt-1 text-xs ${getTrendColor()}`}>
              {trend}
            </Text>
          )}
        </div>

        {/* Icon */}
        {Icon && (
          <div className="ml-2">
            <Icon className="h-5 w-5 text-sage-600" />
          </div>
        )}
      </div>
    </Card>
  );
}

export default StatCard;