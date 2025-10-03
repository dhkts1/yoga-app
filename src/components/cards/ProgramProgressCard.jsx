import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight, Calendar } from "lucide-react";
import { Card, Button, Text } from "../design-system";
import { ProgressBar } from "../design-system/Progress";
import useProgramProgressStore from "../../stores/programProgress";
import { getProgramById } from "../../data/programs";

/**
 * ProgramProgressCard - Shows active program progress on Insights dashboard
 *
 * Displays:
 * - Program name and metadata
 * - Current week progress
 * - Completion percentage
 * - Quick link to continue program
 */
function ProgramProgressCard() {
  const navigate = useNavigate();

  // Get active program from store
  const { activeProgram, getProgramProgress } = useProgramProgressStore();

  // If no active program, don't render
  if (!activeProgram) {
    return null;
  }

  // Fetch program details
  const program = getProgramById(activeProgram.programId);

  // Fallback if program not found
  if (!program) {
    return null;
  }

  // Calculate progress
  const currentWeek = activeProgram.currentWeek;
  const totalWeeks = program.totalWeeks;
  const progressPercentage = getProgramProgress(
    activeProgram.programId,
    totalWeeks,
  );

  // Get current week details
  const currentWeekData = program.weeks.find(
    (w) => w.weekNumber === currentWeek,
  );

  // Style badge color mapping
  const getStyleColor = (style) => {
    const styleColors = {
      iyengar: "bg-muted text-foreground",
      vinyasa: "bg-accent/20 text-accent",
      hatha: "bg-muted text-foreground",
      restorative: "bg-cream-200 text-sage-700",
    };
    return styleColors[style.toLowerCase()] || "bg-muted text-muted-foreground";
  };

  // Handle navigation to program
  const handleContinue = () => {
    navigate(`/programs/${activeProgram.programId}`);
  };

  return (
    <Card variant="sage" padding="sm" className="w-full">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex min-w-0 flex-1 items-start space-x-2">
          {/* Icon */}
          <div className="shrink-0">
            <div className="flex size-8 items-center justify-center rounded-full bg-muted">
              <BookOpen className="size-4 text-muted-foreground" />
            </div>
          </div>

          {/* Program Info */}
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
              <Text
                variant="heading"
                className="text-base font-semibold text-primary"
              >
                {program.name}
              </Text>
              <span
                className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${getStyleColor(program.style)}`}
              >
                {program.style}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-secondary">
              <Calendar className="size-3.5" />
              <span>
                Week {currentWeek} of {totalWeeks}
              </span>
              {currentWeekData?.isMilestone && (
                <span className="font-medium text-accent">Milestone</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Current Week Name */}
      {currentWeekData && (
        <div className="mb-2">
          <Text
            variant="body"
            className="text-sm font-medium text-card-foreground"
          >
            {currentWeekData.name}
          </Text>
          <Text variant="caption" className="mt-0.5 text-xs text-secondary">
            {currentWeekData.focus}
          </Text>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-3">
        <ProgressBar
          value={progressPercentage}
          max={100}
          variant="default"
          size="sm"
        />
        <div className="mt-1 flex justify-between text-xs">
          <Text variant="caption" className="text-secondary">
            {progressPercentage}% Complete
          </Text>
          <Text variant="caption" className="font-medium text-muted-foreground">
            {currentWeek - 1} / {totalWeeks} weeks
          </Text>
        </div>
      </div>

      {/* Action Button */}
      <Button
        onClick={handleContinue}
        variant="primary"
        size="sm"
        className="w-full sm:w-auto"
      >
        <span>Continue Week {currentWeek}</span>
        <ArrowRight className="ml-1.5 size-3.5" />
      </Button>
    </Card>
  );
}

export default ProgramProgressCard;
