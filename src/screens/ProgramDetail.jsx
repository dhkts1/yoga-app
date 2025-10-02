import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, RotateCcw, ChevronRight, BookOpen, Clock, Calendar, Play, Pause, Lock } from 'lucide-react';
import { DefaultLayout } from '../components/layouts';
import { PageHeader } from '../components/headers';
import { Button, StatusBadge } from '../components/design-system';
import { ProgressBar } from '../components/design-system/Progress';
import { getProgramById } from '../data/programs';
import useProgramProgressStore from '../stores/programProgress';
import { LIST_ANIMATION_SUBTLE } from '../utils/animations';

function ProgramDetail() {
  const navigate = useNavigate();
  const { programId } = useParams();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const {
    getProgramStatus,
    getProgramProgress,
    getCurrentWeek,
    isWeekCompleted,
    startProgram,
    pauseProgram,
    resumeProgram,
    resetProgram,
    activeProgram
  } = useProgramProgressStore();

  const program = getProgramById(programId);

  if (!program) {
    return (
      <DefaultLayout header={<PageHeader title="Program Not Found" backPath="/programs" />}>
        <div className="px-4 py-8 text-center">
          <p className="text-muted-foreground">This program could not be found.</p>
          <Button onClick={() => navigate('/programs')} variant="primary" className="mt-4">
            Back to Programs
          </Button>
        </div>
      </DefaultLayout>
    );
  }

  const status = getProgramStatus(program.id, program.totalWeeks);
  const progress = getProgramProgress(program.id, program.totalWeeks);
  const currentWeek = getCurrentWeek(program.id);
  const isActive = activeProgram?.programId === program.id;

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

  const handleWeekClick = (weekNumber) => {
    // Check if week is unlocked (previous week must be completed or this is week 1)
    const isUnlocked = weekNumber === 1 || isWeekCompleted(program.id, weekNumber - 1);

    if (isUnlocked) {
      navigate(`/programs/${program.id}/week/${weekNumber}`);
    }
  };

  const isWeekUnlocked = (weekNumber) => {
    return weekNumber === 1 || isWeekCompleted(program.id, weekNumber - 1);
  };

  const getWeekBadge = (week) => {
    return (
      <StatusBadge
        type="weekStatus"
        value={{
          isCompleted: isWeekCompleted(program.id, week.weekNumber),
          isCurrent: week.weekNumber === currentWeek,
          isActive,
          isUnlocked: isWeekUnlocked(week.weekNumber),
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
      <div className="bg-card rounded-xl p-5 mb-6 shadow-sm border border-border">
        {/* Progress */}
        {status !== 'not-started' && (
          <div className="mb-5">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span className="font-medium">Week {currentWeek} of {program.totalWeeks}</span>
              <span className="font-medium">{progress}% Complete</span>
            </div>
            <ProgressBar value={progress} max={100} size="default" />
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          {program.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>{program.totalWeeks} weeks</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 flex-shrink-0" />
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
          {status === 'not-started' && (
            <Button
              onClick={handleStartProgram}
              variant="primary"
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Program
            </Button>
          )}

          {status === 'active' && (
            <Button
              onClick={handlePauseProgram}
              variant="secondary"
              className="flex-1"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause Program
            </Button>
          )}

          {status === 'paused' && (
            <Button
              onClick={handleResumeProgram}
              variant="primary"
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              Resume Program
            </Button>
          )}

          {status !== 'not-started' && (
            <Button
              onClick={handleResetProgram}
              variant={showResetConfirm ? 'destructive' : 'outline'}
              className="flex-shrink-0"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {showResetConfirm ? 'Confirm Reset' : 'Reset'}
            </Button>
          )}
        </div>

        {showResetConfirm && (
          <p className="text-xs text-state-error mt-2 text-center">
            Click again to confirm. This will delete all progress.
          </p>
        )}
      </div>

      {/* Weeks List */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-card-foreground mb-4 px-1">
          Program Schedule
        </h2>

        <motion.div
          className="space-y-3 mb-24"
          variants={LIST_ANIMATION_SUBTLE.container}
          initial="hidden"
          animate="visible"
        >
          {program.weeks.map((week) => {
            const completed = isWeekCompleted(program.id, week.weekNumber);
            const unlocked = isWeekUnlocked(week.weekNumber);
            const isCurrent = week.weekNumber === currentWeek;

            return (
              <motion.button
                key={week.weekNumber}
                variants={LIST_ANIMATION_SUBTLE.item}
                onClick={() => handleWeekClick(week.weekNumber)}
                disabled={!unlocked}
                className={`w-full text-left bg-card rounded-xl p-4 shadow-sm border transition-all duration-300 ${
                  unlocked
                    ? 'border-border hover:shadow-md hover:scale-[1.01] active:scale-[0.99]'
                    : 'border-gray-200 opacity-60 cursor-not-allowed'
                } ${
                  completed ? 'border-l-4 border-l-green-500' : ''
                } ${
                  isCurrent && isActive ? 'border-l-4 border-l-sage-600' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Week number and milestone */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Week {week.weekNumber}
                      </span>
                      {week.isMilestone && (
                        <Award className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      )}
                      {getWeekBadge(week)}
                    </div>

                    {/* Week name */}
                    <h3 className="text-base font-medium text-card-foreground mb-1 line-clamp-1">
                      {week.name}
                    </h3>

                    {/* Focus */}
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                      {week.focus}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span>{week.practiceFrequency}</span>
                      </div>
                      <span>•</span>
                      <span>{week.recommendedSessions.length} sessions</span>
                    </div>
                  </div>

                  {/* Arrow or Lock Icon */}
                  <div className="flex-shrink-0 flex items-center">
                    {unlocked ? (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Lock className="h-5 w-5 text-gray-400" />
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
