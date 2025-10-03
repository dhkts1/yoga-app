import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Calendar } from 'lucide-react';
import { DefaultLayout } from '../components/layouts';
import { PageHeader } from '../components/headers';
import { ProgressBar } from '../components/design-system/Progress';
import useProgramProgressStore from '../stores/programProgress';
import { programs } from '../data/programs';
import { StatusBadge, ContentBody } from '../components/design-system';
import { LIST_ANIMATION } from '../utils/animations';
import useTranslation from '../hooks/useTranslation';

function Programs() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Optimize Zustand selectors - get individual functions
  const getProgramStatus = useProgramProgressStore(state => state.getProgramStatus);
  const getProgramProgress = useProgramProgressStore(state => state.getProgramProgress);
  const getCurrentWeek = useProgramProgressStore(state => state.getCurrentWeek);

  // Memoize programs with computed status/progress to prevent recalculation on every render
  const programsWithStatus = useMemo(() => {
    return programs.map(program => ({
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
          title={t('screens.programs.title')}
          subtitle={t('screens.programs.subtitle')}
          showBack={false}
        />
      }
    >
      <ContentBody size="md" spacing="md">
        {/* Introduction */}
      <div className="bg-card rounded-xl p-6 mb-6 shadow-sm border border-border">
        <div className="flex items-start gap-3">
          <BookOpen className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-lg font-medium text-card-foreground mb-2">
              {t('screens.programs.beginJourney')}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('screens.programs.chooseProgramDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* Programs List */}
      <motion.div
        className="space-y-4 mb-24"
        variants={LIST_ANIMATION.container}
        initial="hidden"
        animate="visible"
      >
        {programsWithStatus.map((program) => {
          const { status, progress, currentWeek } = program;
          const isStarted = status !== 'not-started';

          return (
            <motion.button
              key={program.id}
              variants={LIST_ANIMATION.item}
              onClick={() => handleProgramClick(program.id)}
              className="w-full text-left bg-card rounded-xl p-5 shadow-sm border border-border transition-all duration-300 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
            >
              {/* Header with badges */}
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-card-foreground mb-2 line-clamp-2">
                    {program.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <StatusBadge type="programStatus" value={status} />
                    <StatusBadge type="difficulty" value={program.difficulty} />
                    <StatusBadge type="style" value={program.style} />
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                {program.description}
              </p>

              {/* Progress bar (only for started programs) */}
              {isStarted && progress > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>{t('screens.programs.weekOf', { current: currentWeek, total: program.totalWeeks })}</span>
                    <span className="font-medium">{progress}% {t('common.complete')}</span>
                  </div>
                  <ProgressBar
                    value={progress}
                    max={100}
                    size="sm"
                  />
                </div>
              )}

              {/* Metadata */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>{program.totalWeeks} {t('common.weeks')}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span>{t('screens.programs.progressiveLearning')}</span>
                </div>
                {program.author && (
                  <>
                    <span>•</span>
                    <span className="text-muted-foreground text-xs">{t('screens.programs.by')} {program.author}</span>
                  </>
                )}
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
