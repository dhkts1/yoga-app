import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  MessageSquare,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { DefaultLayout } from '../components/layouts';
import { PageHeader } from '../components/headers';
import { Button } from '../components/design-system';
import { Badge } from '../components/ui/badge';
import useProgramProgressStore from '../stores/programProgress';
import useProgressStore from '../stores/progress';
import { getProgramById, getWeekByNumber } from '../data/programs';
import { getSessionById } from '../data/sessions';
import { LIST_ANIMATION_SUBTLE } from '../utils/animations';

function WeekDetail() {
  const navigate = useNavigate();
  const { programId, weekNumber } = useParams();
  const [note, setNote] = useState('');
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  const {
    isWeekCompleted,
    completeWeek,
    addWeekNote,
    getWeekNote
  } = useProgramProgressStore();

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
      <DefaultLayout header={<PageHeader title="Week Not Found" backPath={`/programs/${programId}`} />}>
        <div className="px-4 py-8 text-center">
          <p className="text-sage-700">This week could not be found.</p>
          <Button onClick={() => navigate(`/programs/${programId}`)} variant="primary" className="mt-4">
            Back to Program
          </Button>
        </div>
      </DefaultLayout>
    );
  }

  const completed = isWeekCompleted(programId, weekNum);

  // Calculate week progress
  const completedSessionsCount = week?.recommendedSessions.reduce((count, sessionId, index) => {
    return isProgramDayCompleted(programId, weekNum, index + 1) ? count + 1 : count;
  }, 0) || 0;
  const totalSessions = week?.recommendedSessions.length || 0;
  const progressPercentage = totalSessions > 0 ? Math.round((completedSessionsCount / totalSessions) * 100) : 0;

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
          dayNumber: dayNumber + 1 // Day numbers are 1-indexed
        }
      }
    });
  };

  const getSessionDetails = (sessionId) => {
    const session = getSessionById(sessionId);
    if (!session) {
      return { name: 'Session not found', duration: 0, poses: [] };
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
      className="bg-cream"
      contentClassName="px-4 py-6"
    >
      {/* Week Info Card */}
      <div className="bg-white rounded-xl p-5 mb-6 shadow-sm border border-sage-100">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {completed && (
              <Badge className="bg-state-success text-white border-0">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
            {week.isMilestone && (
              <Badge className="bg-amber-500 text-white border-0">
                <Award className="h-3 w-3 mr-1" />
                Milestone Week
              </Badge>
            )}
          </div>
        </div>

        {/* Focus */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-sage-500 uppercase tracking-wide mb-2">
            Focus
          </h3>
          <p className="text-base text-sage-900 font-medium">
            {week.focus}
          </p>
        </div>

        {/* Description */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-sage-500 uppercase tracking-wide mb-2">
            Description
          </h3>
          <p className="text-sm text-sage-700 leading-relaxed">
            {week.description}
          </p>
        </div>

        {/* Practice Frequency */}
        <div className="flex items-center gap-2 text-sm text-sage-600 mb-4">
          <Clock className="h-4 w-4 flex-shrink-0" />
          <span>{week.practiceFrequency}</span>
        </div>

        {/* Week Progress */}
        <div className="pt-4 border-t border-sage-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-sage-700">
              Week Progress
            </span>
            <span className="text-sm font-medium text-sage-900">
              {completedSessionsCount}/{totalSessions} sessions
            </span>
          </div>
          <div className="w-full bg-sage-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-state-success h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {progressPercentage === 100 && !completed && (
            <p className="text-xs text-state-success mt-2 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              All sessions complete! Mark week as complete below.
            </p>
          )}
        </div>
      </div>

      {/* Guidance Notes (if present) */}
      {week.notes && (
        <div className="bg-sage-50 rounded-xl p-5 mb-6 border border-sage-100">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-sage-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-sage-900 mb-2">
                Guidance for This Week
              </h3>
              <p className="text-sm text-sage-700 leading-relaxed">
                {week.notes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Sessions */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-sage-900 mb-4 px-1">
          Recommended Sessions
        </h2>

        <motion.div
          className="space-y-3"
          variants={LIST_ANIMATION_SUBTLE.container}
          initial="hidden"
          animate="visible"
        >
          {week.recommendedSessions.map((sessionId, index) => {
            const session = getSessionDetails(sessionId);
            const isCompleted = isProgramDayCompleted(programId, weekNum, index + 1);

            return (
              <motion.button
                key={sessionId}
                variants={LIST_ANIMATION_SUBTLE.item}
                onClick={() => handleSessionClick(sessionId, index)}
                className={`w-full text-left rounded-xl p-4 shadow-sm border transition-all duration-300 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] ${
                  isCompleted
                    ? 'bg-state-success/10 border-state-success/30'
                    : 'bg-white border-sage-100'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Session number and completion badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-sage-500 uppercase tracking-wide">
                        Session {index + 1}
                      </span>
                      {isCompleted && (
                        <Badge className="bg-state-success text-white border-0 text-xs py-0 px-2 h-5">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>

                    {/* Session name */}
                    <h3 className="text-base font-medium text-sage-900 mb-2 line-clamp-1">
                      {session.name}
                    </h3>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-sm text-sage-600 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span>{session.duration} min</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 flex-shrink-0" />
                        <span>{session.poses?.length || 0} poses</span>
                      </div>
                      <span>•</span>
                      <span className="capitalize text-sage-500">{session.difficulty}</span>
                    </div>
                  </div>

                  {/* Arrow or checkmark */}
                  <div className="flex-shrink-0 flex items-center">
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-state-success" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-sage-400" />
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Personal Notes Section */}
      <div className="bg-white rounded-xl p-5 mb-24 shadow-sm border border-sage-100">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="h-5 w-5 text-sage-600" />
          <h3 className="text-base font-medium text-sage-900">
            Your Notes
          </h3>
        </div>

        <p className="text-sm text-sage-600 mb-3">
          Reflect on your practice this week. What did you learn? How do you feel?
        </p>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={handleSaveNote}
          placeholder="Write your thoughts here..."
          className="w-full min-h-[120px] px-4 py-3 rounded-lg border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-400/20 outline-none text-sm text-sage-900 placeholder-sage-400 resize-none"
          disabled={completed}
        />

        {note && !completed && (
          <p className="text-xs text-sage-500 mt-2">
            Note saved automatically
          </p>
        )}
      </div>

      {/* Complete Week Button (Fixed at bottom) */}
      {!completed && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-sage-200 p-4 shadow-lg">
          <div className="max-w-md mx-auto">
            <Button
              onClick={handleCompleteWeek}
              variant={showCompleteConfirm ? 'primary' : 'secondary'}
              className="w-full"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {showCompleteConfirm ? 'Confirm - Mark Week Complete' : 'Mark Week as Complete'}
            </Button>

            {showCompleteConfirm && (
              <p className="text-xs text-sage-600 mt-2 text-center">
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
