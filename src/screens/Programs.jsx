import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Calendar } from "lucide-react";
import { DefaultLayout } from "../components/layouts";
import { PageHeader } from "../components/headers";
import { ProgressBar } from "../components/design-system/Progress";
import useProgramProgressStore from "../stores/programProgress";
import { programs } from "../data/programs";
import {
  StatusBadge,
  ContentBody,
  Card,
  Text,
} from "../components/design-system";
import { LIST_ANIMATION } from "../utils/animations";
import useTranslation from "../hooks/useTranslation";

function Programs() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Optimize Zustand selectors - get individual functions
  const getProgramStatus = useProgramProgressStore(
    (state) => state.getProgramStatus,
  );
  const getProgramProgress = useProgramProgressStore(
    (state) => state.getProgramProgress,
  );
  const getCurrentWeek = useProgramProgressStore(
    (state) => state.getCurrentWeek,
  );

  // Memoize programs with computed status/progress to prevent recalculation on every render
  const programsWithStatus = useMemo(() => {
    return programs.map((program) => ({
      ...program,
      status: getProgramStatus(program.id, program.totalWeeks),
      progress: getProgramProgress(program.id, program.totalWeeks),
      currentWeek: getCurrentWeek(program.id),
    }));
  }, [getProgramStatus, getProgramProgress, getCurrentWeek]);

  const handleProgramClick = (programId) => {
    navigate(`/programs/${programId}`);
  };

  return (
    <DefaultLayout
      header={
        <PageHeader
          title={t("screens.programs.title")}
          subtitle={t("screens.programs.subtitle")}
          showBack={false}
        />
      }
    >
      <ContentBody size="md" spacing="sm">
        {/* Introduction */}
        <Card padding="sm" className="mb-4 border-border bg-muted">
          <div className="flex items-start gap-2.5">
            <BookOpen className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
            <div>
              <Text className="mb-1 text-sm font-medium text-card-foreground">
                {t("screens.programs.beginJourney")}
              </Text>
              <Text
                variant="caption"
                className="leading-relaxed text-muted-foreground"
              >
                {t("screens.programs.chooseProgramDescription")}
              </Text>
            </div>
          </div>
        </Card>

        {/* Programs List */}
        <motion.div
          className="mb-24 space-y-1.5"
          variants={LIST_ANIMATION.container}
          initial="hidden"
          animate="visible"
        >
          {programsWithStatus.map((program) => {
            const { status, progress, currentWeek } = program;
            const isStarted = status !== "not-started";

            return (
              <motion.button
                key={program.id}
                variants={LIST_ANIMATION.item}
                onClick={() => handleProgramClick(program.id)}
                className="w-full rounded-lg border border-border bg-card p-3 text-left shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md active:scale-[0.99]"
              >
                {/* Header with badges */}
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1.5 line-clamp-2 text-sm font-medium text-card-foreground">
                      {program.name}
                    </h3>
                    <div className="mb-2 flex flex-wrap items-center gap-1.5">
                      <StatusBadge type="programStatus" value={status} />
                      <StatusBadge
                        type="difficulty"
                        value={program.difficulty}
                      />
                      <StatusBadge type="style" value={program.style} />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <Text
                  variant="caption"
                  className="mb-2 line-clamp-2 leading-relaxed text-muted-foreground"
                >
                  {program.description}
                </Text>

                {/* Progress bar (only for started programs) */}
                {isStarted && progress > 0 && (
                  <div className="mb-2">
                    <div className="mb-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>
                        {t("screens.programs.weekOf", {
                          current: currentWeek,
                          total: program.totalWeeks,
                        })}
                      </span>
                      <span className="font-medium">
                        {progress}% {t("common.complete")}
                      </span>
                    </div>
                    <ProgressBar value={progress} max={100} size="sm" />
                  </div>
                )}

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>
                      {program.totalWeeks} {t("common.weeks")}
                    </span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{t("screens.programs.progressiveLearning")}</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </ContentBody>
    </DefaultLayout>
  );
}

export default Programs;
