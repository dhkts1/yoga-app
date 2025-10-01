import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertCircle } from 'lucide-react';
import { poses } from '../data/poses';
import {
  calculateTotalDuration,
  formatDuration
} from '../data/customSessions';
import SelectablePoseCard from '../components/SelectablePoseCard';
import { Button, Card } from '../components/design-system';
import { DefaultLayout } from '../components/layouts';

function SessionBuilder() {
  const navigate = useNavigate();
  const [sessionName, setSessionName] = useState('');
  const [sequencePoses, setSequencePoses] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const sequenceRef = useRef(null);

  // Auto-save draft functionality
  useEffect(() => {
    const savedDraft = localStorage.getItem('sessionBuilderDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        if (draft.name) setSessionName(draft.name);
        if (draft.poses) setSequencePoses(draft.poses);
      } catch (error) {
        console.warn('Failed to load draft session:', error);
      }
    }
  }, []);

  // Auto-save draft on changes
  useEffect(() => {
    const draft = {
      name: sessionName,
      poses: sequencePoses,
      lastModified: new Date().toISOString()
    };
    localStorage.setItem('sessionBuilderDraft', JSON.stringify(draft));
  }, [sessionName, sequencePoses]);

  const totalDuration = calculateTotalDuration(sequencePoses);

  // Add pose to sequence
  const handleAddPose = (poseId, duration = 30) => {
    const newPose = {
      poseId,
      duration,
      id: `${poseId}-${Date.now()}` // Unique ID for reordering
    };
    setSequencePoses(prev => [...prev, newPose]);
  };

  // Remove pose from sequence
  const handleRemovePose = (index) => {
    setSequencePoses(prev => prev.filter((_, i) => i !== index));
  };

  // Update pose duration
  const handleDurationChange = (poseId, newDuration, index) => {
    setSequencePoses(prev => prev.map((pose, i) =>
      i === index ? { ...pose, duration: newDuration } : pose
    ));
  };

  // Move pose up in sequence
  const handleMoveUp = (index) => {
    if (index > 0) {
      setSequencePoses(prev => {
        const newSequence = [...prev];
        [newSequence[index - 1], newSequence[index]] = [newSequence[index], newSequence[index - 1]];
        return newSequence;
      });
    }
  };

  // Move pose down in sequence
  const handleMoveDown = (index) => {
    setSequencePoses(prev => {
      if (index < prev.length - 1) {
        const newSequence = [...prev];
        [newSequence[index], newSequence[index + 1]] = [newSequence[index + 1], newSequence[index]];
        return newSequence;
      }
      return prev;
    });
  };

  // Clear session
  const handleClear = () => {
    if (confirm('Are you sure you want to clear this session? This will remove all poses.')) {
      setSessionName('');
      setSequencePoses([]);
      setValidationErrors([]);
      localStorage.removeItem('sessionBuilderDraft');
    }
  };

  // Validate and save session
  const handleSaveSession = () => {
    const errors = [];

    // Validate session name
    if (!sessionName.trim()) {
      errors.push('Please enter a session name');
    }

    // Validate poses
    if (sequencePoses.length < 2) {
      errors.push('Add at least 2 poses to your sequence');
    }

    if (sequencePoses.length > 20) {
      errors.push('Maximum 20 poses allowed per session');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Clear errors
    setValidationErrors([]);

    // Create session object
    const newSession = {
      id: `custom-${Date.now()}`,
      name: sessionName.trim(),
      isCustom: true,
      poses: sequencePoses.map((p, index) => ({
        poseId: p.poseId,
        duration: p.duration,
        order: index
      })),
      totalDurationSeconds: totalDuration,
      duration: Math.ceil(totalDuration / 60),
      createdAt: new Date().toISOString()
    };

    // Load existing custom sessions
    let customSessions = [];
    try {
      const saved = localStorage.getItem('customSessions');
      if (saved) {
        customSessions = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load custom sessions:', error);
    }

    // Add new session
    customSessions.push(newSession);
    localStorage.setItem('customSessions', JSON.stringify(customSessions));

    // Clear draft
    localStorage.removeItem('sessionBuilderDraft');

    // Navigate to session preview
    navigate(`/sessions/${newSession.id}/preview?custom=true`);
  };

  // Header component
  const header = (
    <div className="px-4 py-3 bg-cream-50 border-b border-sage-200">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-sage-900">
          Create Session
        </h1>
        <Button
          variant="ghost"
          onClick={() => navigate('/sessions')}
          className="text-sage-600 text-sm"
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <DefaultLayout
      header={header}
      className="bg-cream"
      contentClassName="px-4 py-6"
    >

      <div className="max-w-screen-xl mx-auto space-y-6">
        {/* Session Details */}
        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Name
              </label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="My Custom Session"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                maxLength={50}
              />
            </div>

            <div className="flex items-center justify-between text-sm flex-wrap gap-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sage-600">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(totalDuration)}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sage-600">{sequencePoses.length} poses</span>
              </div>
              {sequencePoses.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Card className="p-4 border-red-200 bg-red-50">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800 mb-1">Please fix these issues:</h3>
                <ul className="text-sm text-red-700 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Sequence Builder */}
        <Card className="p-3">
          <h2 className="font-medium text-gray-900 mb-2 text-sm">Your Sequence</h2>

          <div
            ref={sequenceRef}
            className="min-h-16 p-2 border-2 border-dashed rounded-lg border-gray-300"
          >
            {sequencePoses.length === 0 ? (
              <div className="text-center py-3 text-gray-400 text-sm">
                Empty
              </div>
            ) : (
              <div className="space-y-2 max-h-[30vh] overflow-y-auto">
                {sequencePoses.map((pose, index) => (
                  <SelectablePoseCard
                    key={pose.id}
                    poseId={pose.poseId}
                    duration={pose.duration}
                    mode="sequence"
                    index={index}
                    onDurationChange={handleDurationChange}
                    onRemove={handleRemovePose}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    canMoveUp={index > 0}
                    canMoveDown={index < sequencePoses.length - 1}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Pose Library */}
        <Card className="p-3">
          <h2 className="font-medium text-gray-900 mb-3 text-sm">
            Pose Library ({poses.length} poses)
          </h2>

          <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden">
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {poses.map((pose) => (
                <SelectablePoseCard
                  key={pose.id}
                  poseId={pose.id}
                  mode="library"
                  onAdd={handleAddPose}
                />
              ))}
            </div>
          </div>
        </Card>

        {/* Save Button - Fixed at bottom */}
        {sequencePoses.length > 0 && (
          <div className="fixed bottom-[60px] left-0 right-0 p-4 bg-gradient-to-t from-cream to-transparent pointer-events-none z-40">
            <div className="max-w-sm mx-auto pointer-events-auto">
              <Button
                onClick={handleSaveSession}
                className="w-full bg-sage-600 hover:bg-sage-700 text-white py-4 rounded-2xl shadow-lg text-base font-medium"
              >
                Save & Preview Session
              </Button>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}

export default SessionBuilder;