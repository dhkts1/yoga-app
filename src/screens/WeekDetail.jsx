import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  MessageSquare,
  ChevronRight,
  Lightbulb,
} from "lucide-react";
import { DefaultLayout } from "../components/layouts";
import { PageHeader } from "../components/headers";
import { Button } from "../components/design-system";
import { Badge } from "../components/ui/badge";
import useProgramProgressStore from "../stores/programProgress";
import useProgressStore from "../stores/progress";
import { getProgramById, getWeekByNumber } from "../data/programs";
import { getSessionById } from "../data/sessions";
import { LIST_ANIMATION_SUBTLE } from "../utils/animations";
import useTranslation from "../hooks/useTranslation";

function WeekDetail() {
  const navigate = useNavigate();
  const { programId, weekNumber } = useParams();
  const [note, setNote] = useState("");
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const { t } = useTranslation();

  const { isWeekCompleted, completeWeek, addWeekNote, getWeekNote } =
    useProgramProgressStore();

  const { isProgramDayCompleted } = useProgressStore();

  const program = getProgramById(programId);
  const week = getWeekByNumber(programId, parseInt(weekNumber));
  const weekNum = parseInt(weekNumber);

  // Load existing note
  const existingNote = getWeekNote(programId, weekNum);
  if (!note && existingNote) {
    setNote(existingNote);
  }

  if (!program || !week) {
    return (
      <DefaultLayout
        header={
          <PageHeader
            title="Week Not Found"
            backPath={`/programs/${programId}`}
          />
        }
      >
        <div className="px-4 py-8 text-center">
          <p className="text-muted-foreground">This week could not be found.</p>
          <Button
            onClick={() => navigate(`/programs/${programId}`)}
            variant="primary"
            className="mt-4"
          >
            Back to Program
          </Button>
        </div>
      </DefaultLayout>
    );
  }

  const completed = isWeekCompleted(programId, weekNum);

  // Calculate week progress
  const completedSessionsCount =
    week?.recommendedSessions.reduce((count, sessionId, index) => {
      return isProgramDayCompleted(programId, weekNum, index + 1)
        ? count + 1
        : count;
    }, 0) || 0;
  const totalSessions = week?.recommendedSessions.length || 0;
  const progressPercentage =
    totalSessions > 0
      ? Math.round((completedSessionsCount / totalSessions) * 100)
      : 0;

  const handleSaveNote = () => {
    if (note.trim()) {
      addWeekNote(programId, weekNum, note);
    }
  };

  const handleCompleteWeek = () => {
    if (showCompleteConfirm) {
      // Save note first
      if (note.trim()) {
        addWeekNote(programId, weekNum, note);
      }

      // Complete the week (you can track sessions completed this week if needed)
      completeWeek(programId, weekNum, week.recommendedSessions.length, note);

      setShowCompleteConfirm(false);

      // Navigate back to program detail
      navigate(`/programs/${programId}`);
    } else {
      setShowCompleteConfirm(true);
    }
  };

  const handleSessionClick = (sessionId, dayNumber) => {
    // Pass program context so session completion gets tracked
    navigate(`/sessions/${sessionId}/preview`, {
      state: {
        programContext: {
          programId,
          programName: program.name,
          weekNumber: weekNum,
          dayNumber: dayNumber + 1, // Day numbers are 1-indexed
        },
      },
    });
  };

  const getSessionDetails = (sessionId) => {
    const session = getSessionById(sessionId);
    if (!session) {
      return { name: "Session not found", duration: 0, poses: [] };
    }
    return session;
  };

  return (
    <DefaultLayout
      header={
        <PageHeader
          title={week.name}
          subtitle={`Week ${weekNum} of ${program.totalWeeks}`}
          backPath={`/programs/${programId}`}
        />
      }
      contentClassName="px-4 py-6"
    >
      {/* Week Info Card */}
      <div className="mb-6 rounded-xl border border-border bg-card p-5 shadow-sm">
        {/* Status Badge */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {completed && (
              <Badge className="border-0 bg-state-success text-white">
                <CheckCircle2 className="mr-1 size-3" />
                {t("screens.weekDetail.completed")}
              </Badge>
            )}
            {week.isMilestone && (
              <Badge className="border-0 bg-accent text-accent-foreground">
                <Award className="mr-1 size-3" />
                Milestone Week
              </Badge>
            )}
          </div>
        </div>

        {/* Focus */}
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Focus
          </h3>
          <p className="text-base font-medium text-card-foreground">
            {week.focus}
          </p>
        </div>

        {/* Description */}
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Description
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {week.description}
          </p>
        </div>

        {/* Practice Frequency */}
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-4 shrink-0" />
          <span>{week.practiceFrequency}</span>
        </div>

        {/* Week Progress */}
        <div className="border-t border-border pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Week Progress
            </span>
            <span className="text-sm font-medium text-card-foreground">
              {completedSessionsCount}/{totalSessions} sessions
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-sage-100">
            <div
              className="h-full rounded-full bg-state-success transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {progressPercentage === 100 && !completed && (
            <p className="mt-2 flex items-center gap-1 text-xs text-state-success">
              <CheckCircle2 className="size-3" />
              All sessions complete! Mark week as complete below.
            </p>
          )}
        </div>
      </div>

      {/* Guidance Notes (if present) */}
      {week.notes && (
        <div className="mb-6 rounded-xl border border-border bg-muted p-5">
          <div className="flex items-start gap-3">
            <Lightbulb className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
            <div>
              <h3 className="mb-2 text-sm font-medium text-card-foreground">
                Guidance for This Week
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {week.notes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Sessions */}
      <div className="mb-6">
        <h2 className="mb-4 px-1 text-lg font-medium text-card-foreground">
          {t("screens.weekDetail.sessionsThisWeek")}
        </h2>

        <motion.div
          className="space-y-3"
          variants={LIST_ANIMATION_SUBTLE.container}
          initial="hidden"
          animate="visible"
        >
          {week.recommendedSessions.map((sessionId, index) => {
            const session = getSessionDetails(sessionId);
            const isCompleted = isProgramDayCompleted(
              programId,
              weekNum,
              index + 1,
            );

            return (
              <motion.button
                key={sessionId}
                variants={LIST_ANIMATION_SUBTLE.item}
                onClick={() => handleSessionClick(sessionId, index)}
                className={`w-full rounded-xl border p-4 text-left shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md active:scale-[0.99] ${
                  isCompleted
                    ? "border-state-success/30 bg-state-success/10"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {/* Session number and completion badge */}
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Session {index + 1}
                      </span>
                      {isCompleted && (
                        <Badge className="h-5 border-0 bg-state-success px-2 py-0 text-xs text-white">
                          <CheckCircle2 className="mr-1 size-3" />
                          {t("screens.weekDetail.completed")}
                        </Badge>
                      )}
                    </div>

                    {/* Session name */}
                    <h3 className="mb-2 line-clamp-1 text-base font-medium text-card-foreground">
                      {session.name}
                    </h3>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="size-4 shrink-0" />
                        <span>
                          {t("screens.weekDetail.sessionDuration", {
                            duration: session.duration,
                          })}
                        </span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <BookOpen className="size-4 shrink-0" />
                        <span>
                          {t("screens.weekDetail.posesCount", {
                            count: session.poses?.length || 0,
                          })}
                        </span>
                      </div>
                      <span>•</span>
                      <span className="capitalize text-muted-foreground">
                        {session.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Arrow or checkmark */}
                  <div className="flex shrink-0 items-center">
                    {isCompleted ? (
                      <CheckCircle2 className="size-6 text-state-success" />
                    ) : (
                      <ChevronRight className="size-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Personal Notes Section */}
      <div className="mb-36 rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <MessageSquare className="size-5 text-muted-foreground" />
          <h3 className="text-base font-medium text-card-foreground">
            Your Notes
          </h3>
        </div>

        <p className="mb-3 text-sm text-muted-foreground">
          Reflect on your practice this week. What did you learn? How do you
          feel?
        </p>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={handleSaveNote}
          placeholder="Write your thoughts here..."
          className="min-h-[120px] w-full resize-none rounded-lg border border-border px-4 py-3 text-sm text-card-foreground outline-none placeholder:text-sage-400 focus:border-primary focus:ring-2 focus:ring-sage-400/20"
          disabled={completed}
        />

        {note && !completed && (
          <p className="mt-2 text-xs text-muted-foreground">
            Note saved automatically
          </p>
        )}
      </div>

      {/* Complete Week Button (Fixed at bottom) */}
      {!completed && (
        <div className="fixed inset-x-0 bottom-[calc(48px+env(safe-area-inset-bottom))] border-t border-border bg-card p-4 shadow-lg">
          <div className="mx-auto max-w-md">
            <Button
              onClick={handleCompleteWeek}
              variant={showCompleteConfirm ? "primary" : "secondary"}
              className="w-full"
            >
              <CheckCircle2 className="mr-2 size-4" />
              {showCompleteConfirm
                ? "Confirm - Mark Week Complete"
                : "Mark Week as Complete"}
            </Button>

            {showCompleteConfirm && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Click again to confirm completion and unlock next week
              </p>
            )}
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}

export default WeekDetail;
