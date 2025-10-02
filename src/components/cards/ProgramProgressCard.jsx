import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, Calendar } from 'lucide-react';
import { Card, Button, Text } from '../design-system';
import { ProgressBar } from '../design-system/Progress';
import useProgramProgressStore from '../../stores/programProgress';
import { getProgramById } from '../../data/programs';

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
  const progressPercentage = getProgramProgress(activeProgram.programId, totalWeeks);

  // Get current week details
  const currentWeekData = program.weeks.find(w => w.weekNumber === currentWeek);

  // Style badge color mapping
  const getStyleColor = (style) => {
    const styleColors = {
      iyengar: 'bg-muted text-foreground',
      vinyasa: 'bg-accent/20 text-accent',
      hatha: 'bg-muted text-foreground',
      restorative: 'bg-purple-50 text-purple-700',
    };
    return styleColors[style.toLowerCase()] || 'bg-muted text-muted-foreground';
  };

  // Handle navigation to program
  const handleContinue = () => {
    navigate(`/programs/${activeProgram.programId}`);
  };

  return (
    <Card
      variant="sage"
      padding="default"
      className="w-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {/* Icon */}
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {/* Program Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Text variant="heading" className="text-lg font-semibold text-primary">
                {program.name}
              </Text>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getStyleColor(program.style)}`}>
                {program.style}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-secondary">
              <Calendar className="h-4 w-4" />
              <span>
                Week {currentWeek} of {totalWeeks}
              </span>
              {currentWeekData?.isMilestone && (
                <span className="text-accent font-medium">Milestone Week</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Current Week Name */}
      {currentWeekData && (
        <div className="mb-4">
          <Text variant="body" className="text-card-foreground font-medium">
            {currentWeekData.name}
          </Text>
          <Text variant="caption" className="text-secondary mt-1">
            {currentWeekData.focus}
          </Text>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <ProgressBar
          value={progressPercentage}
          max={100}
          variant="default"
          size="default"
        />
        <div className="flex justify-between mt-2 text-sm">
          <Text variant="caption" className="text-secondary">
            {progressPercentage}% Complete
          </Text>
          <Text variant="caption" className="text-muted-foreground font-medium">
            {currentWeek - 1} / {totalWeeks} weeks completed
          </Text>
        </div>
      </div>

      {/* Action Button */}
      <Button
        onClick={handleContinue}
        variant="primary"
        className="w-full sm:w-auto"
      >
        <span>Continue Week {currentWeek}</span>
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </Card>
  );
}

export default ProgramProgressCard;
