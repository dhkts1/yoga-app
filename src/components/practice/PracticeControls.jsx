import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { haptics } from "../../utils/haptics";

/**
 * Practice footer controls component.
 *
 * Renders play/pause, previous/next buttons, and next pose preview or end session button.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isPlaying - Whether practice is currently playing
 * @param {number} props.currentPoseIndex - Index of current pose
 * @param {Object} props.session - Session data with poses array
 * @param {Function} props.onPlayPause - Play/pause toggle handler
 * @param {Function} props.onPreviousPose - Previous pose handler
 * @param {Function} props.onNextPose - Next pose handler
 *
 * @returns {JSX.Element} Footer controls UI
 */
export function PracticeControls({
  isPlaying,
  currentPoseIndex,
  session,
  onPlayPause,
  onPreviousPose,
  onNextPose,
}) {
  if (!session) return null;

  const isLastPose = currentPoseIndex === session.poses.length - 1;
  const isFirstPose = currentPoseIndex === 0;

  // Handle play/pause with haptic feedback
  const handlePlayPause = () => {
    haptics.light();
    onPlayPause();
  };

  // Handle previous pose with haptic feedback
  const handlePreviousPose = () => {
    if (!isFirstPose) {
      haptics.medium();
      onPreviousPose();
    }
  };

  // Handle next pose with haptic feedback
  const handleNextPose = () => {
    if (!isLastPose) {
      haptics.medium();
    }
    onNextPose();
  };

  return (
    <div className="p-4">
      <div className="mx-auto flex max-w-sm items-center justify-center gap-6">
        <button
          onClick={handlePreviousPose}
          disabled={isFirstPose}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:hover:bg-muted"
          aria-label="Previous pose"
        >
          <SkipBack className="h-5 w-5" />
        </button>

        <button
          onClick={handlePlayPause}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 active:scale-95"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-7 w-7" />
          ) : (
            <Play className="ml-1 h-7 w-7" />
          )}
        </button>

        <button
          onClick={handleNextPose}
          disabled={isLastPose}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:hover:bg-muted"
          aria-label="Skip to next pose"
        >
          <SkipForward className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
