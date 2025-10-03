import { useNavigate } from "react-router-dom";
import { Activity, Wind, Clock, TrendingUp, Repeat } from "lucide-react";
import { Modal, Button, Text, Heading } from "./design-system";
import { getSessionById } from "../data/sessions";

/**
 * SessionHistoryModal - Display all sessions practiced on a selected day
 * Shows session details, mood improvements, and allows repeating sessions
 */
function SessionHistoryModal({
  isOpen = false,
  onClose,
  selectedDate,
  sessions = [],
}) {
  const navigate = useNavigate();

  if (!selectedDate || sessions.length === 0) {
    return null;
  }

  // Format date for display
  const dateObj = new Date(selectedDate);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate totals for the day
  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce(
    (sum, session) => sum + session.duration,
    0,
  );
  const yogaSessions = sessions.filter((s) => s.type !== "breathing").length;
  const breathingSessions = sessions.filter(
    (s) => s.type === "breathing",
  ).length;

  // Get mood improvements
  const sessionsWithMood = sessions.filter((s) => s.moodImprovement !== null);
  const avgMoodImprovement =
    sessionsWithMood.length > 0
      ? (
          sessionsWithMood.reduce((sum, s) => sum + s.moodImprovement, 0) /
          sessionsWithMood.length
        ).toFixed(1)
      : null;
  const avgEnergyImprovement =
    sessionsWithMood.length > 0
      ? (
          sessionsWithMood.reduce(
            (sum, s) => sum + (s.energyImprovement || 0),
            0,
          ) / sessionsWithMood.length
        ).toFixed(1)
      : null;

  // Handle repeat session
  const handleRepeatSession = (session) => {
    if (session.type === "breathing") {
      // Navigate to breathing practice
      navigate(`/breathing/${session.exerciseId}`);
    } else {
      // Navigate to yoga practice
      navigate(`/practice/${session.sessionId}`);
    }
    onClose();
  };

  // Format time of day
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get session type badge
  const getSessionTypeBadge = (session) => {
    if (session.type === "breathing") {
      return (
        <span className="inline-flex items-center rounded-full bg-state-info/10 px-2 py-1 text-xs font-medium text-state-info">
          <Wind className="mr-1 size-3" />
          Breathing
        </span>
      );
    }

    // Determine yoga session type from metadata
    const sessionData = getSessionById(session.sessionId);
    if (!sessionData) {
      return (
        <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-foreground">
          <Activity className="mr-1 size-3" />
          Yoga
        </span>
      );
    }

    // Custom session if not in pre-built sessions
    if (session.sessionId.startsWith("custom-")) {
      return (
        <span className="inline-flex items-center rounded-full bg-accent/20 px-2 py-1 text-xs font-medium text-accent">
          <Activity className="mr-1 size-3" />
          Custom
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-foreground">
        <Activity className="mr-1 size-3" />
        Yoga
      </span>
    );
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="mobile" showCloseButton={true}>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-4 text-center">
          <Heading level={2} className="mb-2">
            Practice History
          </Heading>
          <Text variant="secondary" className="text-sm">
            {formattedDate}
          </Text>
        </div>

        {/* Day Summary Stats */}
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted p-4">
          <div className="text-center">
            <div className="mb-1 flex items-center justify-center">
              <Activity className="mr-1 size-4 text-muted-foreground" />
              <Text variant="caption" className="text-muted-foreground">
                Total Sessions
              </Text>
            </div>
            <Text variant="body" className="text-lg font-semibold">
              {totalSessions}
            </Text>
            <Text variant="caption" className="text-xs text-muted-foreground">
              {yogaSessions > 0 && `${yogaSessions} yoga`}
              {yogaSessions > 0 && breathingSessions > 0 && " • "}
              {breathingSessions > 0 && `${breathingSessions} breathing`}
            </Text>
          </div>
          <div className="text-center">
            <div className="mb-1 flex items-center justify-center">
              <Clock className="mr-1 size-4 text-muted-foreground" />
              <Text variant="caption" className="text-muted-foreground">
                Total Time
              </Text>
            </div>
            <Text variant="body" className="text-lg font-semibold">
              {totalMinutes}
            </Text>
            <Text variant="caption" className="text-xs text-muted-foreground">
              minutes
            </Text>
          </div>
        </div>

        {/* Mood Improvement Summary */}
        {avgMoodImprovement && (
          <div className="rounded-lg border border-accent/20 bg-accent/10 p-4">
            <div className="mb-2 flex items-center justify-center">
              <TrendingUp className="mr-2 size-5 text-accent" />
              <Heading level={4} className="text-foreground">
                Wellbeing Impact
              </Heading>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <Text variant="body" className="font-semibold text-accent">
                  +{avgMoodImprovement}
                </Text>
                <Text
                  variant="caption"
                  className="text-xs text-muted-foreground"
                >
                  Avg Mood
                </Text>
              </div>
              {avgEnergyImprovement && (
                <div>
                  <Text variant="body" className="font-semibold text-accent">
                    +{avgEnergyImprovement}
                  </Text>
                  <Text
                    variant="caption"
                    className="text-xs text-muted-foreground"
                  >
                    Avg Energy
                  </Text>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="space-y-3">
          <Heading level={4} className="text-sm font-medium text-muted-foreground">
            Sessions ({totalSessions})
          </Heading>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {sessions.map((session, index) => {
              const sessionName =
                session.type === "breathing"
                  ? session.exerciseName
                  : session.sessionName;

              return (
                <div
                  key={`${session.id}-${index}`}
                  className="rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary"
                >
                  {/* Session Header */}
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <Text variant="body" className="font-medium">
                          {sessionName}
                        </Text>
                        {getSessionTypeBadge(session)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Clock className="mr-1 size-3" />
                          {session.duration} min
                        </span>
                        <span>{formatTime(session.completedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mood Data */}
                  {session.moodImprovement !== null && (
                    <div className="mb-2 flex items-center gap-4 rounded bg-muted px-2 py-1 text-xs">
                      <span
                        className={`font-medium ${session.moodImprovement >= 0 ? "text-state-success" : "text-state-error"}`}
                      >
                        {session.moodImprovement >= 0 ? "+" : ""}
                        {session.moodImprovement} mood
                      </span>
                      {session.energyImprovement !== null && (
                        <span
                          className={`font-medium ${session.energyImprovement >= 0 ? "text-state-success" : "text-state-error"}`}
                        >
                          {session.energyImprovement >= 0 ? "+" : ""}
                          {session.energyImprovement} energy
                        </span>
                      )}
                    </div>
                  )}

                  {/* Repeat Button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRepeatSession(session)}
                    className="mt-2 w-full"
                  >
                    <Repeat className="mr-2 size-4" />
                    Repeat This Session
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Close Button */}
        <div className="border-t border-border pt-4">
          <Button variant="primary" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default SessionHistoryModal;
