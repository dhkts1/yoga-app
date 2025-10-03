import { GripVertical, Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./design-system";
import { getPoseById } from "../data/poses";
import { formatDuration } from "../data/customSessions";

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
  className = "",
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
      className={`flex cursor-move items-center gap-2 rounded-lg border border-border bg-card p-2 transition-all hover:border-primary ${
        isDragging ? "scale-95 opacity-50" : ""
      } ${className}`}
    >
      {/* Drag Handle */}
      <GripVertical className="size-4 shrink-0 text-muted-foreground" />

      {/* Pose Info */}
      <span className="shrink-0 text-xl" aria-label={pose.nameEnglish}>
        {pose.emoji}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {pose.nameEnglish}
          {side && (
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              ({side})
            </span>
          )}
        </p>
        <p className="truncate text-xs italic text-muted-foreground">
          {pose.nameSanskrit}
        </p>
      </div>

      {/* Duration Badge - Clickable */}
      <Badge
        variant="default"
        className="shrink-0 cursor-pointer transition-colors hover:bg-muted"
        onClick={() => onDurationClick?.(index, poseId, duration)}
      >
        {formatDuration(duration)}
      </Badge>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove?.(index)}
        className="size-8 shrink-0 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
        aria-label="Remove pose"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
};

export default SequenceItem;
