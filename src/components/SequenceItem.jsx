import { GripVertical, Trash2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './design-system';
import { getPoseById } from '../data/poses';
import { formatDuration } from '../data/customSessions';

/**
 * SequenceItem - Draggable compact pose item for sequence builder
 *
 * Displays pose info with drag handle and controls
 */
const SequenceItem = ({
  poseId,
  duration,
  side = null,
  index,
  onDurationClick,
  onRemove,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragging = false,
  className = ""
}) => {
  const pose = getPoseById(poseId);

  if (!pose) {
    console.warn(`Pose not found: ${poseId}`);
    return null;
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onDragOver?.(e, index)}
      onDrop={(e) => onDrop?.(e, index)}
      className={`flex items-center gap-2 p-2 bg-card border border-gray-200 rounded-lg hover:border-primary transition-all cursor-move ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${className}`}
    >
      {/* Drag Handle */}
      <GripVertical className="h-4 w-4 text-gray-400 flex-shrink-0" />

      {/* Pose Info */}
      <span className="text-xl flex-shrink-0" aria-label={pose.nameEnglish}>
        {pose.emoji}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {pose.nameEnglish}
          {side && (
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              ({side})
            </span>
          )}
        </p>
        <p className="text-xs text-gray-500 italic truncate">
          {pose.nameSanskrit}
        </p>
      </div>

      {/* Duration Badge - Clickable */}
      <Badge
        variant="secondary"
        className="cursor-pointer hover:bg-muted transition-colors flex-shrink-0"
        onClick={() => onDurationClick?.(index, poseId, duration)}
      >
        {formatDuration(duration)}
      </Badge>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove?.(index)}
        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
        aria-label="Remove pose"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SequenceItem;
