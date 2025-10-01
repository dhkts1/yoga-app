import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Calendar, Play, Pause, CheckCircle2, Lock } from 'lucide-react';
import { DefaultLayout } from '../components/layouts';
import { PageHeader } from '../components/headers';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import useProgramProgressStore from '../stores/programProgress';
import { programs } from '../data/programs';

// Animation variants for staggered list items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

function Programs() {
  const navigate = useNavigate();
  const { getProgramStatus, getProgramProgress, getCurrentWeek } = useProgramProgressStore();

  const handleProgramClick = (programId) => {
    navigate(`/programs/${programId}`);
  };

  const getStatusBadge = (program) => {
    const status = getProgramStatus(program.id, program.totalWeeks);

    switch (status) {
      case 'active':
        return (
          <Badge className="bg-sage-600 text-white border-0">
            <Play className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 'paused':
        return (
          <Badge className="bg-amber-500 text-white border-0">
            <Pause className="h-3 w-3 mr-1" />
            Paused
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-600 text-white border-0">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-white text-sage-700 border-sage-300">
            <Lock className="h-3 w-3 mr-1" />
            Not Started
          </Badge>
        );
    }
  };

  const getDifficultyBadge = (difficulty) => {
    const colors = {
      beginner: 'bg-blue-100 text-blue-800 border-0',
      intermediate: 'bg-purple-100 text-purple-800 border-0',
      advanced: 'bg-red-100 text-red-800 border-0',
      mixed: 'bg-gray-100 text-gray-800 border-0'
    };

    return (
      <Badge className={colors[difficulty]}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </Badge>
    );
  };

  const getStyleBadge = (style) => {
    const colors = {
      iyengar: 'bg-sage-100 text-sage-800 border-0',
      vinyasa: 'bg-accent/20 text-accent border-0',
      hatha: 'bg-cream-200 text-sage-800 border-0',
      restorative: 'bg-purple-50 text-purple-700 border-0'
    };

    return (
      <Badge className={colors[style] || 'bg-gray-100 text-gray-800 border-0'}>
        {style.charAt(0).toUpperCase() + style.slice(1)}
      </Badge>
    );
  };

  return (
    <DefaultLayout
      header={
        <PageHeader
          title="Multi-Week Programs"
          subtitle="Structured yoga journeys"
          showBack={false}
        />
      }
      className="bg-cream"
      contentClassName="px-4 py-6"
    >
      {/* Introduction */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-sage-100">
        <div className="flex items-start gap-3">
          <BookOpen className="h-6 w-6 text-sage-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-lg font-medium text-sage-900 mb-2">
              Begin Your Journey
            </h2>
            <p className="text-sm text-sage-700 leading-relaxed">
              Choose a multi-week program to deepen your practice with carefully sequenced sessions.
              Each week builds on the previous, guiding you through progressive learning.
            </p>
          </div>
        </div>
      </div>

      {/* Programs List */}
      <motion.div
        className="space-y-4 mb-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {programs.map((program) => {
          const status = getProgramStatus(program.id, program.totalWeeks);
          const progress = getProgramProgress(program.id, program.totalWeeks);
          const currentWeek = getCurrentWeek(program.id);
          const isStarted = status !== 'not-started';

          return (
            <motion.button
              key={program.id}
              variants={itemVariants}
              onClick={() => handleProgramClick(program.id)}
              className="w-full text-left bg-white rounded-xl p-5 shadow-sm border border-sage-100 transition-all duration-300 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
            >
              {/* Header with badges */}
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-sage-900 mb-2 line-clamp-2">
                    {program.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {getStatusBadge(program)}
                    {getDifficultyBadge(program.difficulty)}
                    {getStyleBadge(program.style)}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-sage-700 mb-4 line-clamp-2 leading-relaxed">
                {program.description}
              </p>

              {/* Progress bar (only for started programs) */}
              {isStarted && progress > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-sage-600 mb-2">
                    <span>Week {currentWeek} of {program.totalWeeks}</span>
                    <span className="font-medium">{progress}% Complete</span>
                  </div>
                  <Progress
                    value={progress}
                    className="h-2 bg-sage-100"
                  />
                </div>
              )}

              {/* Metadata */}
              <div className="flex items-center gap-4 text-sm text-sage-600 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>{program.totalWeeks} weeks</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span>Progressive learning</span>
                </div>
                {program.author && (
                  <>
                    <span>•</span>
                    <span className="text-sage-500 text-xs">by {program.author}</span>
                  </>
                )}
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </DefaultLayout>
  );
}

export default Programs;
