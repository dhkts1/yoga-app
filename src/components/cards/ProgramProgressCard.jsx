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
      padding="sm"
      className="w-full"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start space-x-2 flex-1 min-w-0">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Program Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
              <Text variant="heading" className="text-base font-semibold text-primary">
                {program.name}
              </Text>
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getStyleColor(program.style)}`}>
                {program.style}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-secondary">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                Week {currentWeek} of {totalWeeks}
              </span>
              {currentWeekData?.isMilestone && (
                <span className="text-accent font-medium">Milestone</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Current Week Name */}
      {currentWeekData && (
        <div className="mb-2">
          <Text variant="body" className="text-card-foreground font-medium text-sm">
            {currentWeekData.name}
          </Text>
          <Text variant="caption" className="text-secondary mt-0.5 text-xs">
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
        <div className="flex justify-between mt-1 text-xs">
          <Text variant="caption" className="text-secondary">
            {progressPercentage}% Complete
          </Text>
          <Text variant="caption" className="text-muted-foreground font-medium">
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
        <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
      </Button>
    </Card>
  );
}

export default ProgramProgressCard;
