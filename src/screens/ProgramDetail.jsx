import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Award,
  RotateCcw,
  ChevronRight,
  BookOpen,
  Clock,
  Calendar,
  Play,
  Pause,
  Lock,
} from "lucide-react";
import { DefaultLayout } from "../components/layouts";
import { PageHeader } from "../components/headers";
import { Button, StatusBadge } from "../components/design-system";
import { ProgressBar } from "../components/design-system/Progress";
import { getProgramById } from "../data/programs";
import useProgramProgressStore from "../stores/programProgress";
import { LIST_ANIMATION_SUBTLE } from "../utils/animations";
import useTranslation from "../hooks/useTranslation";

function ProgramDetail() {
  const navigate = useNavigate();
  const { programId } = useParams();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { t } = useTranslation();

  // Optimize Zustand selectors - get individual functions and values
  const getProgramStatus = useProgramProgressStore(
    (state) => state.getProgramStatus,
  );
  const getProgramProgress = useProgramProgressStore(
    (state) => state.getProgramProgress,
  );
  const getCurrentWeek = useProgramProgressStore(
    (state) => state.getCurrentWeek,
  );
  const isWeekCompleted = useProgramProgressStore(
    (state) => state.isWeekCompleted,
  );
  const startProgram = useProgramProgressStore((state) => state.startProgram);
  const pauseProgram = useProgramProgressStore((state) => state.pauseProgram);
  const resumeProgram = useProgramProgressStore((state) => state.resumeProgram);
  const resetProgram = useProgramProgressStore((state) => state.resetProgram);
  const activeProgram = useProgramProgressStore((state) => state.activeProgram);

  const program = getProgramById(programId);

  // Memoize program status and progress to prevent recalculation
  const { status, progress, currentWeek, isActive } = useMemo(() => {
    if (!program)
      return { status: null, progress: 0, currentWeek: 1, isActive: false };
    return {
      status: getProgramStatus(program.id, program.totalWeeks),
      progress: getProgramProgress(program.id, program.totalWeeks),
      currentWeek: getCurrentWeek(program.id),
      isActive: activeProgram?.programId === program.id,
    };
  }, [
    program,
    getProgramStatus,
    getProgramProgress,
    getCurrentWeek,
    activeProgram,
  ]);

  // Memoize weeks with their completion status
  const weeksWithStatus = useMemo(() => {
    if (!program) return [];
    return program.weeks.map((week) => ({
      ...week,
      completed: isWeekCompleted(program.id, week.weekNumber),
      unlocked:
        week.weekNumber === 1 ||
        isWeekCompleted(program.id, week.weekNumber - 1),
      isCurrent: week.weekNumber === currentWeek,
    }));
  }, [program, isWeekCompleted, currentWeek]);

  if (!program) {
    return (
      <DefaultLayout
        header={<PageHeader title="Program Not Found" backPath="/programs" />}
      >
        <div className="px-4 py-8 text-center">
          <p className="text-muted-foreground">
            This program could not be found.
          </p>
          <Button
            onClick={() => navigate("/programs")}
            variant="primary"
            className="mt-4"
          >
            Back to Programs
          </Button>
        </div>
      </DefaultLayout>
    );
  }

  const handleStartProgram = () => {
    startProgram(program.id);
  };

  const handlePauseProgram = () => {
    pauseProgram(program.id);
  };

  const handleResumeProgram = () => {
    resumeProgram(program.id);
  };

  const handleResetProgram = () => {
    if (showResetConfirm) {
      resetProgram(program.id);
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
    }
  };

  const handleWeekClick = (weekNumber, unlocked) => {
    if (unlocked) {
      navigate(`/programs/${program.id}/week/${weekNumber}`);
    }
  };

  const getWeekBadge = (week) => {
    return (
      <StatusBadge
        type="weekStatus"
        value={{
          isCompleted: week.completed,
          isCurrent: week.isCurrent,
          isActive,
          isUnlocked: week.unlocked,
        }}
      />
    );
  };

  return (
    <DefaultLayout
      header={
        <PageHeader
          title={program.name}
          subtitle={`${program.style.charAt(0).toUpperCase() + program.style.slice(1)} • ${program.difficulty}`}
          backPath="/programs"
        />
      }
      contentClassName="px-4 py-6"
    >
      {/* Program Overview Card */}
      <div className="mb-6 rounded-xl border border-border bg-card p-5 shadow-sm">
        {/* Progress */}
        {status !== "not-started" && (
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
              <span className="font-medium">
                {t("screens.programs.weekOf", {
                  current: currentWeek,
                  total: program.totalWeeks,
                })}
              </span>
              <span className="font-medium">
                {progress}% {t("screens.programDetail.completed")}
              </span>
            </div>
            <ProgressBar value={progress} max={100} size="default" />
          </div>
        )}

        {/* Description */}
        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
          {program.description}
        </p>

        {/* Metadata */}
        <div className="mb-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4 shrink-0" />
            <span>
              {t("screens.programDetail.weeks", { count: program.totalWeeks })}
            </span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <BookOpen className="size-4 shrink-0" />
            <span className="capitalize">{program.difficulty}</span>
          </div>
          {program.author && (
            <>
              <span>•</span>
              <span className="text-muted-foreground">by {program.author}</span>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {status === "not-started" && (
            <Button
              onClick={handleStartProgram}
              variant="primary"
              className="flex-1"
            >
              <Play className="mr-2 size-4" />
              {t("screens.programDetail.startProgram")}
            </Button>
          )}

          {status === "active" && (
            <Button
              onClick={handlePauseProgram}
              variant="secondary"
              className="flex-1"
            >
              <Pause className="mr-2 size-4" />
              {t("screens.programDetail.pauseProgram")}
            </Button>
          )}

          {status === "paused" && (
            <Button
              onClick={handleResumeProgram}
              variant="primary"
              className="flex-1"
            >
              <Play className="mr-2 size-4" />
              {t("screens.programDetail.resumeProgram")}
            </Button>
          )}

          {status !== "not-started" && (
            <Button
              onClick={handleResetProgram}
              variant={showResetConfirm ? "destructive" : "outline"}
              className="shrink-0"
            >
              <RotateCcw className="mr-2 size-4" />
              {showResetConfirm ? "Confirm Reset" : "Reset"}
            </Button>
          )}
        </div>

        {showResetConfirm && (
          <p className="mt-2 text-center text-xs text-state-error">
            Click again to confirm. This will delete all progress.
          </p>
        )}
      </div>

      {/* Weeks List */}
      <div className="mb-6">
        <h2 className="mb-4 px-1 text-lg font-medium text-card-foreground">
          Program Schedule
        </h2>

        <motion.div
          className="mb-24 space-y-3"
          variants={LIST_ANIMATION_SUBTLE.container}
          initial="hidden"
          animate="visible"
        >
          {weeksWithStatus.map((week) => {
            const { completed, unlocked, isCurrent } = week;

            return (
              <motion.button
                key={week.weekNumber}
                variants={LIST_ANIMATION_SUBTLE.item}
                onClick={() => handleWeekClick(week.weekNumber, unlocked)}
                disabled={!unlocked}
                className={`w-full rounded-xl border bg-card p-4 text-left shadow-sm transition-all duration-300 ${
                  unlocked
                    ? "border-border hover:scale-[1.01] hover:shadow-md active:scale-[0.99]"
                    : "cursor-not-allowed border-border opacity-60"
                } ${completed ? "border-l-4 border-l-state-success" : ""} ${
                  isCurrent && isActive ? "border-l-4 border-l-primary" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {/* Week number and milestone */}
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Week {week.weekNumber}
                      </span>
                      {week.isMilestone && (
                        <Award className="size-4 shrink-0 text-accent" />
                      )}
                      {getWeekBadge(week)}
                    </div>

                    {/* Week name */}
                    <h3 className="mb-1 line-clamp-1 text-base font-medium text-card-foreground">
                      {week.name}
                    </h3>

                    {/* Focus */}
                    <p className="mb-2 line-clamp-1 text-sm text-muted-foreground">
                      {week.focus}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="size-3 shrink-0" />
                        <span>{week.practiceFrequency}</span>
                      </div>
                      <span>•</span>
                      <span>{week.recommendedSessions.length} sessions</span>
                    </div>
                  </div>

                  {/* Arrow or Lock Icon */}
                  <div className="flex shrink-0 items-center">
                    {unlocked ? (
                      <ChevronRight className="size-5 text-muted-foreground" />
                    ) : (
                      <Lock className="size-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </DefaultLayout>
  );
}

export default ProgramDetail;
