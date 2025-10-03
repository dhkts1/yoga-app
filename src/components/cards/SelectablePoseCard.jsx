import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { Card, Button } from "../design-system";
import { getPoseById } from "../../data/poses";
import { getDurationOptions, formatDuration } from "../../data/customSessions";
import PoseImage from "../PoseImage";

/**
 * SelectablePoseCard - Mobile-friendly pose card for session building
 *
 * Two modes:
 * - library: Shows pose info with checkbox for multi-select
 * - sequence: Shows pose in sequence with duration controls and reordering
 */
const SelectablePoseCard = ({
  poseId,
  duration = 30,
  mode = "library", // 'library' or 'sequence'
  index,
  onRemove,
  onDurationChange,
  onMoveUp,
  onMoveDown,
  className = "",
  canMoveUp = false,
  canMoveDown = false,
  // Multi-select props
  isSelected = false,
  onSelect,
}) => {
  const pose = getPoseById(poseId);

  if (!pose) {
    console.warn(`Pose not found: ${poseId}`);
    return null;
  }

  const durationOptions = getDurationOptions();

  const handleDurationSelect = (newDuration) => {
    if (onDurationChange) {
      onDurationChange(poseId, newDuration, index);
    }
  };

  // const handleAddPose = () => {
  //   if (onAdd) {
  //     onAdd(poseId, duration);
  //   }
  // };

  const handleRemovePose = () => {
    if (onRemove) {
      onRemove(index);
    }
  };

  const handleMoveUpClick = () => {
    if (onMoveUp && canMoveUp) {
      onMoveUp(index);
    }
  };

  const handleMoveDownClick = () => {
    if (onMoveDown && canMoveDown) {
      onMoveDown(index);
    }
  };

  if (mode === "library") {
    // Library mode: Compact card with color indicator for selection
    return (
      <Card
        className={`cursor-pointer p-2 transition-all ${
          isSelected
            ? "border-2 border-primary bg-muted shadow-sm"
            : "border border-gray-200 hover:bg-gray-50"
        } ${className}`}
        onClick={() => onSelect?.(poseId)}
      >
        <div className="flex items-center gap-2">
          {/* Small selection indicator */}
          <div
            className={`h-8 w-1 flex-shrink-0 rounded-full ${
              isSelected ? "bg-secondary" : "bg-transparent"
            }`}
          />
          <PoseImage
            poseId={poseId}
            size="sm"
            shape="circular"
            className="flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3
              className={`truncate text-sm font-medium ${
                isSelected ? "text-card-foreground" : "text-gray-900"
              }`}
            >
              {pose.nameEnglish}
            </h3>
            <p className="truncate text-xs italic text-gray-500">
              {pose.nameSanskrit}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Sequence mode: Full controls for pose in sequence
  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        {/* Pose Info Row */}
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center space-x-3">
            <PoseImage
              poseId={poseId}
              size="sm"
              shape="circular"
              className="flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-medium text-gray-900">
                {pose.nameEnglish}
              </h3>
              <p className="truncate text-sm text-gray-500">
                {pose.nameSanskrit}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-shrink-0 items-center space-x-2">
            {/* Move Up Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMoveUpClick}
              disabled={!canMoveUp}
              className="min-h-[44px] min-w-[44px] p-2"
              aria-label="Move pose up"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>

            {/* Move Down Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMoveDownClick}
              disabled={!canMoveDown}
              className="min-h-[44px] min-w-[44px] p-2"
              aria-label="Move pose down"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemovePose}
              className="min-h-[44px] min-w-[44px] p-2 text-red-500 hover:bg-red-50 hover:text-red-600"
              aria-label="Remove pose"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Duration Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground">
            Duration: {formatDuration(duration)}
          </label>
          <div className="flex flex-wrap gap-2">
            {durationOptions.slice(0, 8).map((option) => (
              <Button
                key={option.value}
                variant={duration === option.value ? "primary" : "outline"}
                size="sm"
                onClick={() => handleDurationSelect(option.value)}
                className="min-h-[44px] px-3 py-2 text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SelectablePoseCard;
