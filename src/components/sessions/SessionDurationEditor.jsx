import { useState, useEffect } from "react";
import { Clock, Minus, Plus, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../design-system";
import { getPoseById } from "../../data/poses";
import useSessionCustomizationsStore from "../../stores/sessionCustomizations";
import useCustomSessions from "../../hooks/useCustomSessions";
import { formatDuration } from "../../data/customSessions";

/**
 * SessionDurationEditor - Modal for editing pose durations in a session
 *
 * Allows users to customize pose durations with +/- buttons (15s increments)
 * For pre-built sessions: saves to sessionCustomizations store
 * For custom sessions: updates the session directly
 */
const SessionDurationEditor = ({
  isOpen,
  onClose,
  session,
  isCustomSession,
}) => {
  const [localDurations, setLocalDurations] = useState({});

  // Get store methods for pre-built sessions
  const getDuration = useSessionCustomizationsStore(
    (state) => state.getDuration,
  );
  const setDuration = useSessionCustomizationsStore(
    (state) => state.setDuration,
  );
  const resetSession = useSessionCustomizationsStore(
    (state) => state.resetSession,
  );
  // Subscribe to the actual data to trigger re-renders when customizations change
  const durationOverrides = useSessionCustomizationsStore(
    (state) => state.durationOverrides,
  );

  // Get custom sessions hook for custom sessions
  const { update: updateCustomSession } = useCustomSessions();

  // Initialize local durations when dialog opens
  useEffect(() => {
    if (isOpen && session?.poses) {
      const initial = {};
      session.poses.forEach((pose, index) => {
        if (isCustomSession) {
          // For custom sessions, use the pose's current duration
          initial[index] = pose.duration;
        } else {
          // For pre-built sessions, check for customizations first
          const customDuration = getDuration(session.id, index);
          initial[index] = customDuration ?? pose.duration;
        }
      });
      // Synchronizing dialog state with session data - legitimate setState in effect
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalDurations(initial);
    }
  }, [isOpen, session, isCustomSession, getDuration]);

  const handleDurationChange = (poseIndex, delta) => {
    const currentDuration = localDurations[poseIndex] || 30;
    const newDuration = Math.max(15, Math.min(300, currentDuration + delta));

    setLocalDurations((prev) => ({
      ...prev,
      [poseIndex]: newDuration,
    }));

    // Save immediately
    if (isCustomSession) {
      // Update custom session directly
      const updatedPoses = session.poses.map((pose, i) =>
        i === poseIndex ? { ...pose, duration: newDuration } : pose,
      );
      const totalSeconds = updatedPoses.reduce(
        (sum, p) => sum + (p.duration || 0),
        0,
      );
      updateCustomSession(session.id, {
        poses: updatedPoses,
        totalDurationSeconds: totalSeconds,
        duration: Math.ceil(totalSeconds / 60),
      });
    } else {
      // Save to customizations store for pre-built sessions
      setDuration(session.id, poseIndex, newDuration);
    }
  };

  const handleReset = () => {
    if (isCustomSession) {
      // Reset to original durations would require storing original values
      // For now, just close the dialog
      onClose();
    } else {
      // Reset pre-built session customizations
      resetSession(session.id);
      // Reset local state to original durations
      const original = {};
      session.poses.forEach((pose, index) => {
        original[index] = pose.duration;
      });
      setLocalDurations(original);
    }
  };

  const isModified = (poseIndex, originalDuration) => {
    return localDurations[poseIndex] !== originalDuration;
  };

  if (!session) return null;

  // Compute hasAnyCustomizations from subscribed data for reactivity
  const hasAnyCustomizations = isCustomSession
    ? false // Custom sessions don't track "customizations" the same way
    : Boolean(
        durationOverrides[session.id] &&
          Object.keys(durationOverrides[session.id]).length > 0,
      );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            Edit Durations
          </DialogTitle>
          <DialogDescription>
            Customize pose durations for {session.name}. Changes are saved
            automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[50vh] space-y-2 overflow-y-auto py-2 pr-2">
          {session.poses?.map((poseData, index) => {
            const poseId = poseData.poseId || poseData.id;
            const pose = getPoseById(poseId);
            if (!pose) return null;

            const duration = localDurations[index] ?? poseData.duration;
            const modified = isModified(index, poseData.duration);

            return (
              <div
                key={`${poseId}-${index}`}
                className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card p-3"
              >
                {/* Pose Info */}
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="text-lg">{pose.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {pose.nameEnglish}
                      {poseData.side && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({poseData.side})
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Duration Controls */}
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => handleDurationChange(index, -15)}
                    disabled={duration <= 15}
                    className="flex size-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:opacity-40"
                    aria-label="Decrease duration"
                  >
                    <Minus className="size-4" />
                  </button>

                  <div
                    className={`min-w-[60px] text-center text-sm font-medium ${
                      modified ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {formatDuration(duration)}
                  </div>

                  <button
                    onClick={() => handleDurationChange(index, 15)}
                    disabled={duration >= 300}
                    className="flex size-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:opacity-40"
                    aria-label="Increase duration"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {(!session.poses || session.poses.length === 0) && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No poses in this session.
            </p>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          {hasAnyCustomizations && (
            <Button variant="outline" onClick={handleReset} className="mr-auto">
              <RotateCcw className="mr-2 size-4" />
              Reset All
            </Button>
          )}
          <DialogClose asChild>
            <Button className="bg-secondary hover:bg-primary">Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDurationEditor;
