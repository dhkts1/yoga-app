import { useNavigate } from 'react-router-dom';
import { Activity, Wind, Clock, TrendingUp, Repeat } from 'lucide-react';
import { Modal, Button, Text, Heading } from './design-system';
import { getSessionById } from '../data/sessions';

/**
 * SessionHistoryModal - Display all sessions practiced on a selected day
 * Shows session details, mood improvements, and allows repeating sessions
 */
function SessionHistoryModal({
  isOpen = false,
  onClose,
  selectedDate,
  sessions = []
}) {
  const navigate = useNavigate();

  if (!selectedDate || sessions.length === 0) {
    return null;
  }

  // Format date for display
  const dateObj = new Date(selectedDate);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate totals for the day
  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);
  const yogaSessions = sessions.filter(s => s.type !== 'breathing').length;
  const breathingSessions = sessions.filter(s => s.type === 'breathing').length;

  // Get mood improvements
  const sessionsWithMood = sessions.filter(s => s.moodImprovement !== null);
  const avgMoodImprovement = sessionsWithMood.length > 0
    ? (sessionsWithMood.reduce((sum, s) => sum + s.moodImprovement, 0) / sessionsWithMood.length).toFixed(1)
    : null;
  const avgEnergyImprovement = sessionsWithMood.length > 0
    ? (sessionsWithMood.reduce((sum, s) => sum + (s.energyImprovement || 0), 0) / sessionsWithMood.length).toFixed(1)
    : null;

  // Handle repeat session
  const handleRepeatSession = (session) => {
    if (session.type === 'breathing') {
      // Navigate to breathing practice
      navigate(`/breathing/${session.exerciseId}`);
    } else {
      // Navigate to yoga practice
      navigate(`/practice/${session.sessionId}`);
    }
    onClose();
  };

  // Format time of day
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get session type badge
  const getSessionTypeBadge = (session) => {
    if (session.type === 'breathing') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Wind className="w-3 h-3 mr-1" />
          Breathing
        </span>
      );
    }

    // Determine yoga session type from metadata
    const sessionData = getSessionById(session.sessionId);
    if (!sessionData) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-sage-100 text-sage-800">
          <Activity className="w-3 h-3 mr-1" />
          Yoga
        </span>
      );
    }

    // Custom session if not in pre-built sessions
    if (session.sessionId.startsWith('custom-')) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <Activity className="w-3 h-3 mr-1" />
          Custom
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-sage-100 text-sage-800">
        <Activity className="w-3 h-3 mr-1" />
        Yoga
      </span>
    );
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="mobile"
      showCloseButton={true}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center border-b border-cream-200 pb-4">
          <Heading level={2} className="mb-2">
            Practice History
          </Heading>
          <Text variant="secondary" className="text-sm">
            {formattedDate}
          </Text>
        </div>

        {/* Day Summary Stats */}
        <div className="grid grid-cols-2 gap-3 bg-sage-50 rounded-lg p-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Activity className="w-4 h-4 text-sage-600 mr-1" />
              <Text variant="caption" className="text-secondary">
                Total Sessions
              </Text>
            </div>
            <Text variant="body" className="font-semibold text-lg">
              {totalSessions}
            </Text>
            <Text variant="caption" className="text-muted text-xs">
              {yogaSessions > 0 && `${yogaSessions} yoga`}
              {yogaSessions > 0 && breathingSessions > 0 && ' • '}
              {breathingSessions > 0 && `${breathingSessions} breathing`}
            </Text>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-sage-600 mr-1" />
              <Text variant="caption" className="text-secondary">
                Total Time
              </Text>
            </div>
            <Text variant="body" className="font-semibold text-lg">
              {totalMinutes}
            </Text>
            <Text variant="caption" className="text-muted text-xs">
              minutes
            </Text>
          </div>
        </div>

        {/* Mood Improvement Summary */}
        {avgMoodImprovement && (
          <div className="bg-gold-50 rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-gold-600 mr-2" />
              <Heading level={4} className="text-gold-900">
                Wellbeing Impact
              </Heading>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <Text variant="body" className="font-semibold text-gold-900">
                  +{avgMoodImprovement}
                </Text>
                <Text variant="caption" className="text-gold-700 text-xs">
                  Avg Mood
                </Text>
              </div>
              {avgEnergyImprovement && (
                <div>
                  <Text variant="body" className="font-semibold text-gold-900">
                    +{avgEnergyImprovement}
                  </Text>
                  <Text variant="caption" className="text-gold-700 text-xs">
                    Avg Energy
                  </Text>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="space-y-3">
          <Heading level={4} className="text-sm font-medium text-secondary">
            Sessions ({totalSessions})
          </Heading>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {sessions.map((session, index) => {
              const sessionName = session.type === 'breathing'
                ? session.exerciseName
                : session.sessionName;

              return (
                <div
                  key={session.id || `session-${index}`}
                  className="bg-white border border-cream-200 rounded-lg p-3 hover:border-sage-300 transition-colors"
                >
                  {/* Session Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Text variant="body" className="font-medium">
                          {sessionName}
                        </Text>
                        {getSessionTypeBadge(session)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-secondary">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {session.duration} min
                        </span>
                        <span>
                          {formatTime(session.completedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mood Data */}
                  {session.moodImprovement !== null && (
                    <div className="flex items-center gap-4 text-xs mb-2 bg-sage-50 rounded px-2 py-1">
                      <span className={`font-medium ${session.moodImprovement >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {session.moodImprovement >= 0 ? '+' : ''}{session.moodImprovement} mood
                      </span>
                      {session.energyImprovement !== null && (
                        <span className={`font-medium ${session.energyImprovement >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                          {session.energyImprovement >= 0 ? '+' : ''}{session.energyImprovement} energy
                        </span>
                      )}
                    </div>
                  )}

                  {/* Repeat Button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRepeatSession(session)}
                    className="w-full mt-2"
                  >
                    <Repeat className="w-4 h-4 mr-2" />
                    Repeat This Session
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-4 border-t border-cream-200">
          <Button
            variant="primary"
            onClick={onClose}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default SessionHistoryModal;
