import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertCircle } from 'lucide-react';
import { poses } from '../data/poses';
import {
  calculateTotalDuration,
  formatDuration
} from '../data/customSessions';
import useLocalStorage from '../hooks/useLocalStorage';
import useCustomSessions from '../hooks/useCustomSessions';
import { SelectablePoseCard } from '../components/cards';
import SequenceItem from '../components/SequenceItem';
import { DurationEditDialog, AddPosesDialog, ConfirmDialog } from '../components/dialogs';
import { Button, Card, ContentBody, EmptyState } from '../components/design-system';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { DefaultLayout } from '../components/layouts';
import PageHeader from '../components/headers/PageHeader';

function SessionBuilder() {
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('sequence');

  // Duration edit dialog state
  const [durationDialog, setDurationDialog] = useState({
    isOpen: false,
    poseId: null,
    duration: 30,
    index: null
  });

  // Multi-select state
  const [selectedPoseIds, setSelectedPoseIds] = useState([]);
  const [showAddPosesDialog, setShowAddPosesDialog] = useState(false);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Use custom sessions hook for saving
  const { add: addCustomSession } = useCustomSessions();

  // Use localStorage hook for draft auto-save
  const [draft, setDraft, clearDraft] = useLocalStorage('sessionBuilderDraft', {
    name: '',
    poses: []
  });

  // Local state synced with draft
  const [sessionName, setSessionName] = useState(draft.name || '');
  const [sequencePoses, setSequencePoses] = useState(draft.poses || []);

  // Auto-save draft whenever sessionName or sequencePoses change
  useEffect(() => {
    setDraft({
      name: sessionName,
      poses: sequencePoses
    });
  }, [sessionName, sequencePoses, setDraft]);

  const totalDuration = calculateTotalDuration(sequencePoses);

  // Toggle pose selection
  const handleTogglePoseSelection = (poseId) => {
    setSelectedPoseIds(prev =>
      prev.includes(poseId)
        ? prev.filter(id => id !== poseId)
        : [...prev, poseId]
    );
  };

  // Open add poses dialog
  const handleOpenAddDialog = () => {
    if (selectedPoseIds.length > 0) {
      setShowAddPosesDialog(true);
    }
  };

  // Add multiple poses with side options
  const handleAddPoses = (posesToAdd) => {
    const newPoses = posesToAdd.map(({ poseId, side, duration }) => ({
      poseId,
      side,
      duration,
      id: `${poseId}-${side || 'default'}-${Date.now()}-${Math.random()}` // Unique ID
    }));

    setSequencePoses(prev => [...prev, ...newPoses]);
    setSelectedPoseIds([]);
    setActiveTab('sequence');
  };

  // Open duration edit dialog
  const handleDurationClick = (index, poseId, currentDuration) => {
    setDurationDialog({
      isOpen: true,
      poseId,
      duration: currentDuration,
      index
    });
  };

  // Save duration from dialog
  const handleDurationSave = (newDuration) => {
    if (durationDialog.index !== null) {
      handleDurationChange(
        durationDialog.poseId,
        newDuration,
        durationDialog.index
      );
    }
  };

  // Close duration dialog
  const closeDurationDialog = () => {
    setDurationDialog({
      isOpen: false,
      poseId: null,
      duration: 30,
      index: null
    });
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

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (draggedIndex === null || draggedIndex === index) return;

    setSequencePoses(prev => {
      const newSequence = [...prev];
      const draggedItem = newSequence[draggedIndex];
      newSequence.splice(draggedIndex, 1);
      newSequence.splice(index, 0, draggedItem);
      setDraggedIndex(index);
      return newSequence;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
  };

  // Clear session
  const handleClear = () => {
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    setSessionName('');
    setSequencePoses([]);
    setValidationErrors([]);
    clearDraft();
    setShowClearConfirm(false);
  };

  const cancelClear = () => {
    setShowClearConfirm(false);
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
        ...(p.side && { side: p.side }), // Include side if present
        order: index
      })),
      totalDurationSeconds: totalDuration,
      duration: Math.ceil(totalDuration / 60),
      createdAt: new Date().toISOString()
    };

    // Add new session using hook
    try {
      addCustomSession(newSession);

      // Clear draft
      clearDraft();

      // Navigate to session preview
      navigate(`/sessions/${newSession.id}/preview?custom=true`);
    } catch (error) {
      setValidationErrors([error.message]);
    }
  };

  return (
    <DefaultLayout
      header={
        <PageHeader
          title="Create Session"
          subtitle="Build your custom yoga sequence"
          backPath="/sessions"
          actions={
            <Button
              variant="ghost"
              onClick={() => navigate('/sessions')}
              className="text-muted-foreground text-sm"
            >
              Cancel
            </Button>
          }
        />
      }
    >
      <ContentBody size="lg" spacing="md">
        {/* Session Details */}
        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Session Name
              </label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="My Custom Session"
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                maxLength={50}
              />
            </div>

            <div className="flex items-center justify-between text-sm flex-wrap gap-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(totalDuration)}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-muted-foreground">{sequencePoses.length} poses</span>
              </div>
              {sequencePoses.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="text-state-error border-state-error/30 hover:bg-state-error/10"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Card className="p-4 border-state-error/30 bg-state-error/10">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-state-error flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-state-error mb-1">Please fix these issues:</h3>
                <ul className="text-sm text-state-error space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger
              value="sequence"
              className="data-[state=active]:bg-card data-[state=active]:text-card-foreground"
            >
              Your Sequence ({sequencePoses.length})
            </TabsTrigger>
            <TabsTrigger
              value="library"
              className="data-[state=active]:bg-card data-[state=active]:text-card-foreground"
            >
              Add Poses
            </TabsTrigger>
          </TabsList>

          {/* Sequence Tab */}
          <TabsContent value="sequence" className="mt-4">
            <Card className="p-4">
              {sequencePoses.length === 0 ? (
                <EmptyState
                  icon="🧘"
                  title="No poses yet"
                  description="Switch to 'Add Poses' to build your sequence"
                />
              ) : (
                <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto pr-1">
                  {sequencePoses.map((pose, index) => (
                    <SequenceItem
                      key={pose.id}
                      poseId={pose.poseId}
                      duration={pose.duration}
                      side={pose.side}
                      index={index}
                      onDurationClick={handleDurationClick}
                      onRemove={handleRemovePose}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      isDragging={draggedIndex === index}
                    />
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Library Tab */}
          <TabsContent value="library" className="mt-4 space-y-3">
            {/* Add Selected Button */}
            {selectedPoseIds.length > 0 && (
              <div className="sticky top-0 z-10 bg-cream pb-2">
                <Button
                  variant="primary"
                  onClick={handleOpenAddDialog}
                  className="w-full"
                >
                  Add {selectedPoseIds.length} Selected Pose{selectedPoseIds.length !== 1 ? 's' : ''}
                </Button>
              </div>
            )}

            <Card className="p-4">
              <div className="max-h-[calc(100vh-450px)] overflow-y-auto overflow-x-hidden pr-1">
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  {poses.map((pose) => (
                    <SelectablePoseCard
                      key={pose.id}
                      poseId={pose.id}
                      mode="library"
                      isSelected={selectedPoseIds.includes(pose.id)}
                      onSelect={handleTogglePoseSelection}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button - Fixed at bottom */}
        {sequencePoses.length > 0 && (
          <div className="sticky bottom-0 left-0 right-0 pt-4 pb-2 bg-gradient-to-t from-cream via-cream to-transparent">
            <Button
              variant="primary"
              onClick={handleSaveSession}
              className="w-full py-4 rounded-2xl shadow-lg text-base font-medium"
            >
              Save & Preview Session
            </Button>
          </div>
        )}
      </ContentBody>

      {/* Clear Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={cancelClear}
        onConfirm={confirmClear}
        title="Clear Session?"
        message="This will remove all poses from your session. This action cannot be undone."
        confirmText="Clear All"
        confirmVariant="danger"
        icon="warning"
      />

      {/* Duration Edit Dialog */}
      <DurationEditDialog
        isOpen={durationDialog.isOpen}
        onClose={closeDurationDialog}
        poseId={durationDialog.poseId}
        currentDuration={durationDialog.duration}
        onSave={handleDurationSave}
      />

      {/* Add Poses Dialog */}
      <AddPosesDialog
        isOpen={showAddPosesDialog}
        onClose={() => setShowAddPosesDialog(false)}
        selectedPoseIds={selectedPoseIds}
        onAdd={handleAddPoses}
      />
    </DefaultLayout>
  );
}

export default SessionBuilder;