import { useState, useMemo, useEffect } from "react";
import {
  Clock,
  Minus,
  Plus,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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
import { getSessionById } from "../../data/sessions";
import { getPoseById } from "../../data/poses";
import useProgramCustomizationsStore from "../../stores/programCustomizations";
import { formatDuration } from "../../data/customSessions";

/**
 * ProgramDurationEditor - Modal for editing pose durations across all sessions in a program
 *
 * Allows users to customize pose durations with +/- buttons (15s increments)
 * Changes are saved to localStorage and persist across sessions
 */
const ProgramDurationEditor = ({ isOpen, onClose, program }) => {
  const [expandedSessions, setExpandedSessions] = useState({});

  // Get store methods
  const getDuration = useProgramCustomizationsStore(
    (state) => state.getDuration,
  );
  const setDuration = useProgramCustomizationsStore(
    (state) => state.setDuration,
  );
  const resetProgram = useProgramCustomizationsStore(
    (state) => state.resetProgram,
  );
  const hasCustomizations = useProgramCustomizationsStore(
    (state) => state.hasCustomizations,
  );

  // Get unique sessions from all weeks
  const uniqueSessions = useMemo(() => {
    if (!program) return [];

    const sessionIds = new Set();
    program.weeks.forEach((week) => {
      week.recommendedSessions.forEach((sessionId) => {
        sessionIds.add(sessionId);
      });
    });

    return Array.from(sessionIds)
      .map((id) => getSessionById(id))
      .filter(Boolean);
  }, [program]);

  // Initialize all sessions as expanded when dialog opens
  useEffect(() => {
    if (isOpen && uniqueSessions.length > 0) {
      const initial = {};
      uniqueSessions.forEach((session) => {
        initial[session.id] = true;
      });
      // Synchronizing dialog state with session data - legitimate setState in effect
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpandedSessions(initial);
    }
  }, [isOpen, uniqueSessions]);

  const toggleSession = (sessionId) => {
    setExpandedSessions((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  };

  const handleDurationChange = (sessionId, poseIndex, delta) => {
    const session = getSessionById(sessionId);
    if (!session) return;

    const pose = session.poses[poseIndex];
    const currentCustom = getDuration(program.id, sessionId, poseIndex);
    const currentDuration = currentCustom ?? pose.duration;
    const newDuration = Math.max(15, Math.min(300, currentDuration + delta));

    setDuration(program.id, sessionId, poseIndex, newDuration);
  };

  const handleReset = () => {
    resetProgram(program.id);
  };

  const getPoseDuration = (sessionId, poseIndex, originalDuration) => {
    const custom = getDuration(program.id, sessionId, poseIndex);
    return custom ?? originalDuration;
  };

  const isModified = (sessionId, poseIndex, originalDuration) => {
    const custom = getDuration(program.id, sessionId, poseIndex);
    return custom !== null && custom !== originalDuration;
  };

  if (!program) return null;

  const hasAnyCustomizations = hasCustomizations(program.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            Edit Durations
          </DialogTitle>
          <DialogDescription>
            Customize pose durations for {program.name}. Changes are saved
            automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[50vh] space-y-3 overflow-y-auto py-2 pr-2">
          {uniqueSessions.map((session) => (
            <div
              key={session.id}
              className="rounded-lg border border-border bg-card"
            >
              {/* Session Header */}
              <button
                onClick={() => toggleSession(session.id)}
                className="flex w-full items-center justify-between p-3 text-left"
              >
                <div>
                  <h4 className="font-medium text-foreground">
                    {session.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {session.poses.length} poses • {session.duration} min
                  </p>
                </div>
                {expandedSessions[session.id] ? (
                  <ChevronUp className="size-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-5 text-muted-foreground" />
                )}
              </button>

              {/* Poses List */}
              {expandedSessions[session.id] && (
                <div className="border-t border-border px-3 py-2">
                  <div className="space-y-2">
                    {session.poses.map((poseData, index) => {
                      const pose = getPoseById(poseData.poseId);
                      if (!pose) return null;

                      const duration = getPoseDuration(
                        session.id,
                        index,
                        poseData.duration,
                      );
                      const modified = isModified(
                        session.id,
                        index,
                        poseData.duration,
                      );

                      return (
                        <div
                          key={`${poseData.poseId}-${index}`}
                          className="flex items-center justify-between gap-2 py-1"
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
                              onClick={() =>
                                handleDurationChange(session.id, index, -15)
                              }
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
                              onClick={() =>
                                handleDurationChange(session.id, index, 15)
                              }
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
                  </div>
                </div>
              )}
            </div>
          ))}

          {uniqueSessions.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No sessions found in this program.
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

export default ProgramDurationEditor;
