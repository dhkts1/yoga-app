import { useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, AlertCircle } from "lucide-react";
import { poses } from "../data/poses";
import { calculateTotalDuration, formatDuration } from "../data/customSessions";
import useLocalStorage from "../hooks/useLocalStorage";
import useCustomSessions from "../hooks/useCustomSessions";
import { SelectablePoseCard } from "../components/cards";
import SequenceItem from "../components/SequenceItem";
import {
  DurationEditDialog,
  AddPosesDialog,
  ConfirmDialog,
} from "../components/dialogs";
import {
  Button,
  Card,
  ContentBody,
  EmptyState,
  ScrollableTabContent,
} from "../components/design-system";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { DefaultLayout } from "../components/layouts";
import PageHeader from "../components/headers/PageHeader";
import useTranslation from "../hooks/useTranslation";

// Action types
const ACTIONS = {
  SET_SESSION_NAME: "SET_SESSION_NAME",
  SET_SEQUENCE_POSES: "SET_SEQUENCE_POSES",
  ADD_POSES: "ADD_POSES",
  REMOVE_POSE: "REMOVE_POSE",
  UPDATE_POSE_DURATION: "UPDATE_POSE_DURATION",
  REORDER_POSES: "REORDER_POSES",
  TOGGLE_POSE_SELECTION: "TOGGLE_POSE_SELECTION",
  CLEAR_POSE_SELECTION: "CLEAR_POSE_SELECTION",
  SET_ACTIVE_TAB: "SET_ACTIVE_TAB",
  OPEN_DURATION_DIALOG: "OPEN_DURATION_DIALOG",
  CLOSE_DURATION_DIALOG: "CLOSE_DURATION_DIALOG",
  OPEN_ADD_POSES_DIALOG: "OPEN_ADD_POSES_DIALOG",
  CLOSE_ADD_POSES_DIALOG: "CLOSE_ADD_POSES_DIALOG",
  OPEN_CLEAR_CONFIRM: "OPEN_CLEAR_CONFIRM",
  CLOSE_CLEAR_CONFIRM: "CLOSE_CLEAR_CONFIRM",
  SET_DRAG_INDEX: "SET_DRAG_INDEX",
  CLEAR_DRAG_INDEX: "CLEAR_DRAG_INDEX",
  SET_VALIDATION_ERRORS: "SET_VALIDATION_ERRORS",
  CLEAR_VALIDATION_ERRORS: "CLEAR_VALIDATION_ERRORS",
  RESET_BUILDER: "RESET_BUILDER",
  LOAD_DRAFT: "LOAD_DRAFT",
};

// Initial state
const initialState = {
  sessionName: "",
  sequencePoses: [],
  selectedPoseIds: [],
  activeTab: "sequence",
  durationDialog: {
    isOpen: false,
    poseId: null,
    duration: 30,
    index: null,
  },
  showAddPosesDialog: false,
  showClearConfirm: false,
  draggedIndex: null,
  validationErrors: [],
};

// Reducer function (defined outside component for React Compiler compatibility)
function sessionBuilderReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_SESSION_NAME:
      return { ...state, sessionName: action.payload };

    case ACTIONS.SET_SEQUENCE_POSES:
      return { ...state, sequencePoses: action.payload };

    case ACTIONS.ADD_POSES:
      return {
        ...state,
        sequencePoses: [...state.sequencePoses, ...action.payload],
        selectedPoseIds: [],
        activeTab: "sequence",
      };

    case ACTIONS.REMOVE_POSE:
      return {
        ...state,
        sequencePoses: state.sequencePoses.filter(
          (_, i) => i !== action.payload,
        ),
      };

    case ACTIONS.UPDATE_POSE_DURATION:
      return {
        ...state,
        sequencePoses: state.sequencePoses.map((pose, i) =>
          i === action.payload.index
            ? { ...pose, duration: action.payload.duration }
            : pose,
        ),
      };

    case ACTIONS.REORDER_POSES: {
      const { draggedIndex, targetIndex } = action.payload;
      const newSequence = [...state.sequencePoses];
      const draggedItem = newSequence[draggedIndex];
      newSequence.splice(draggedIndex, 1);
      newSequence.splice(targetIndex, 0, draggedItem);
      return {
        ...state,
        sequencePoses: newSequence,
        draggedIndex: targetIndex,
      };
    }

    case ACTIONS.TOGGLE_POSE_SELECTION: {
      const poseId = action.payload;
      const isSelected = state.selectedPoseIds.includes(poseId);
      return {
        ...state,
        selectedPoseIds: isSelected
          ? state.selectedPoseIds.filter((id) => id !== poseId)
          : [...state.selectedPoseIds, poseId],
      };
    }

    case ACTIONS.CLEAR_POSE_SELECTION:
      return { ...state, selectedPoseIds: [] };

    case ACTIONS.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };

    case ACTIONS.OPEN_DURATION_DIALOG:
      return {
        ...state,
        durationDialog: {
          isOpen: true,
          poseId: action.payload.poseId,
          duration: action.payload.duration,
          index: action.payload.index,
        },
      };

    case ACTIONS.CLOSE_DURATION_DIALOG:
      return {
        ...state,
        durationDialog: {
          isOpen: false,
          poseId: null,
          duration: 30,
          index: null,
        },
      };

    case ACTIONS.OPEN_ADD_POSES_DIALOG:
      return { ...state, showAddPosesDialog: true };

    case ACTIONS.CLOSE_ADD_POSES_DIALOG:
      return { ...state, showAddPosesDialog: false };

    case ACTIONS.OPEN_CLEAR_CONFIRM:
      return { ...state, showClearConfirm: true };

    case ACTIONS.CLOSE_CLEAR_CONFIRM:
      return { ...state, showClearConfirm: false };

    case ACTIONS.SET_DRAG_INDEX:
      return { ...state, draggedIndex: action.payload };

    case ACTIONS.CLEAR_DRAG_INDEX:
      return { ...state, draggedIndex: null };

    case ACTIONS.SET_VALIDATION_ERRORS:
      return { ...state, validationErrors: action.payload };

    case ACTIONS.CLEAR_VALIDATION_ERRORS:
      return { ...state, validationErrors: [] };

    case ACTIONS.RESET_BUILDER:
      return {
        ...state,
        sessionName: "",
        sequencePoses: [],
        validationErrors: [],
        showClearConfirm: false,
      };

    case ACTIONS.LOAD_DRAFT:
      return {
        ...state,
        sessionName: action.payload.name || "",
        sequencePoses: action.payload.poses || [],
      };

    default:
      return state;
  }
}

function SessionBuilder() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Use custom sessions hook for saving
  const { add: addCustomSession } = useCustomSessions();

  // Use localStorage hook for draft auto-save
  const [draft, setDraft, clearDraft] = useLocalStorage("sessionBuilderDraft", {
    name: "",
    poses: [],
  });

  // Initialize reducer with draft data
  const [state, dispatch] = useReducer(
    sessionBuilderReducer,
    initialState,
    () => ({
      ...initialState,
      sessionName: draft.name || "",
      sequencePoses: draft.poses || [],
    }),
  );

  // Auto-save draft whenever sessionName or sequencePoses change
  useEffect(() => {
    setDraft({
      name: state.sessionName,
      poses: state.sequencePoses,
    });
  }, [state.sessionName, state.sequencePoses, setDraft]);

  const totalDuration = calculateTotalDuration(state.sequencePoses);

  // Toggle pose selection
  const handleTogglePoseSelection = (poseId) => {
    dispatch({ type: ACTIONS.TOGGLE_POSE_SELECTION, payload: poseId });
  };

  // Open add poses dialog
  const handleOpenAddDialog = () => {
    if (state.selectedPoseIds.length > 0) {
      dispatch({ type: ACTIONS.OPEN_ADD_POSES_DIALOG });
    }
  };

  // Add multiple poses with side options
  const handleAddPoses = (posesToAdd) => {
    const newPoses = posesToAdd.map(({ poseId, side, duration }) => ({
      poseId,
      side,
      duration,
      id: crypto.randomUUID(), // Unique ID using Web Crypto API
    }));

    dispatch({ type: ACTIONS.ADD_POSES, payload: newPoses });
  };

  // Open duration edit dialog
  const handleDurationClick = (index, poseId, currentDuration) => {
    dispatch({
      type: ACTIONS.OPEN_DURATION_DIALOG,
      payload: { poseId, duration: currentDuration, index },
    });
  };

  // Save duration from dialog
  const handleDurationSave = (newDuration) => {
    if (state.durationDialog.index !== null) {
      dispatch({
        type: ACTIONS.UPDATE_POSE_DURATION,
        payload: { index: state.durationDialog.index, duration: newDuration },
      });
    }
  };

  // Close duration dialog
  const closeDurationDialog = () => {
    dispatch({ type: ACTIONS.CLOSE_DURATION_DIALOG });
  };

  // Remove pose from sequence
  const handleRemovePose = (index) => {
    dispatch({ type: ACTIONS.REMOVE_POSE, payload: index });
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    dispatch({ type: ACTIONS.SET_DRAG_INDEX, payload: index });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    dispatch({ type: ACTIONS.CLEAR_DRAG_INDEX });
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (state.draggedIndex === null || state.draggedIndex === index) return;

    dispatch({
      type: ACTIONS.REORDER_POSES,
      payload: { draggedIndex: state.draggedIndex, targetIndex: index },
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
  };

  // Clear session
  const handleClear = () => {
    dispatch({ type: ACTIONS.OPEN_CLEAR_CONFIRM });
  };

  const confirmClear = () => {
    dispatch({ type: ACTIONS.RESET_BUILDER });
    clearDraft();
  };

  const cancelClear = () => {
    dispatch({ type: ACTIONS.CLOSE_CLEAR_CONFIRM });
  };

  // Validate and save session
  const handleSaveSession = () => {
    const errors = [];

    // Validate session name
    if (!state.sessionName.trim()) {
      errors.push("Please enter a session name");
    }

    // Validate poses
    if (state.sequencePoses.length < 2) {
      errors.push("Add at least 2 poses to your sequence");
    }

    if (state.sequencePoses.length > 20) {
      errors.push("Maximum 20 poses allowed per session");
    }

    if (errors.length > 0) {
      dispatch({ type: ACTIONS.SET_VALIDATION_ERRORS, payload: errors });
      return;
    }

    // Clear errors
    dispatch({ type: ACTIONS.CLEAR_VALIDATION_ERRORS });

    // Create session object
    const newSession = {
      id: `custom-${crypto.randomUUID()}`,
      name: state.sessionName.trim(),
      isCustom: true,
      poses: state.sequencePoses.map((p, index) => ({
        poseId: p.poseId,
        duration: p.duration,
        ...(p.side && { side: p.side }), // Include side if present
        order: index,
      })),
      totalDurationSeconds: totalDuration,
      duration: Math.ceil(totalDuration / 60),
      createdAt: new Date().toISOString(),
    };

    // Add new session using hook
    try {
      addCustomSession(newSession);

      // Clear draft
      clearDraft();

      // Navigate to session preview
      navigate(`/sessions/${newSession.id}/preview?custom=true`);
    } catch (error) {
      dispatch({
        type: ACTIONS.SET_VALIDATION_ERRORS,
        payload: [error.message],
      });
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
              onClick={() => navigate("/sessions")}
              className="text-sm text-muted-foreground"
            >
              Cancel
            </Button>
          }
        />
      }
    >
      <ContentBody size="lg" spacing="none" className="flex h-full flex-col">
        {/* Session Details */}
        <Card padding="sm" className="shrink-0">
          <div className="space-y-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                {t("screens.sessionBuilder.sessionName")}
              </label>
              <input
                type="text"
                value={state.sessionName}
                onChange={(e) =>
                  dispatch({
                    type: ACTIONS.SET_SESSION_NAME,
                    payload: e.target.value,
                  })
                }
                placeholder={t("screens.sessionBuilder.sessionNamePlaceholder")}
                className="w-full rounded-lg border border-border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-ring"
                maxLength={50}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="size-4" />
                  <span>{formatDuration(totalDuration)}</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {state.sequencePoses.length} poses
                </span>
              </div>
              {state.sequencePoses.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="border-state-error/30 text-state-error hover:bg-state-error/10"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Validation Errors */}
        {state.validationErrors.length > 0 && (
          <Card
            padding="sm"
            className="mt-3 shrink-0 border-state-error/30 bg-state-error/10"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-state-error" />
              <div>
                <h3 className="mb-1 font-medium text-state-error">
                  Please fix these issues:
                </h3>
                <ul className="space-y-1 text-sm text-state-error">
                  {state.validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Tab Navigation */}
        <Tabs
          value={state.activeTab}
          onValueChange={(tab) =>
            dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: tab })
          }
          className="mt-4 flex min-h-0 w-full flex-1 flex-col overflow-hidden"
        >
          <TabsList className="grid h-auto w-full grid-cols-2 rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger
              value="sequence"
              className="min-h-touch rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              {t("screens.sessionBuilder.selectedPoses", {
                count: state.sequencePoses.length,
              })}
            </TabsTrigger>
            <TabsTrigger
              value="library"
              className="min-h-touch rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              {t("screens.sessionBuilder.selectPoses")}
            </TabsTrigger>
          </TabsList>

          {/* Sequence Tab */}
          <TabsContent
            value="sequence"
            className="mt-3 data-[state=active]:flex data-[state=active]:min-h-0 data-[state=active]:flex-1 data-[state=active]:flex-col"
          >
            <ScrollableTabContent
              emptyState={
                state.sequencePoses.length === 0 ? (
                  <EmptyState
                    icon="🧘"
                    title="No poses yet"
                    description="Switch to 'Select Poses' to build your sequence"
                  />
                ) : null
              }
            >
              <div className="space-y-2">
                {state.sequencePoses.map((pose, index) => (
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
                    isDragging={state.draggedIndex === index}
                  />
                ))}
              </div>
            </ScrollableTabContent>
          </TabsContent>

          {/* Library Tab */}
          <TabsContent
            value="library"
            className="mt-3 data-[state=active]:flex data-[state=active]:min-h-0 data-[state=active]:flex-1 data-[state=active]:flex-col"
          >
            <ScrollableTabContent
              actionButton={
                state.selectedPoseIds.length > 0 ? (
                  <Button
                    variant="primary"
                    onClick={handleOpenAddDialog}
                    fullWidth
                  >
                    Add {state.selectedPoseIds.length} Selected Pose
                    {state.selectedPoseIds.length !== 1 ? "s" : ""}
                  </Button>
                ) : null
              }
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {poses.map((pose) => (
                  <SelectablePoseCard
                    key={pose.id}
                    poseId={pose.id}
                    mode="library"
                    isSelected={state.selectedPoseIds.includes(pose.id)}
                    onSelect={handleTogglePoseSelection}
                  />
                ))}
              </div>
            </ScrollableTabContent>
          </TabsContent>
        </Tabs>

        {/* Save Button - Fixed at bottom */}
        {state.sequencePoses.length > 0 && (
          <div className="mt-3 shrink-0">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSaveSession}
              fullWidth
            >
              {t("screens.sessionBuilder.savePractice")}
            </Button>
          </div>
        )}
      </ContentBody>

      {/* Clear Confirmation Dialog */}
      <ConfirmDialog
        isOpen={state.showClearConfirm}
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
        key={`${state.durationDialog.poseId}-${state.durationDialog.isOpen}`}
        isOpen={state.durationDialog.isOpen}
        onClose={closeDurationDialog}
        poseId={state.durationDialog.poseId}
        currentDuration={state.durationDialog.duration}
        onSave={handleDurationSave}
      />

      {/* Add Poses Dialog */}
      <AddPosesDialog
        isOpen={state.showAddPosesDialog}
        onClose={() => dispatch({ type: ACTIONS.CLOSE_ADD_POSES_DIALOG })}
        selectedPoseIds={state.selectedPoseIds}
        onAdd={handleAddPoses}
      />
    </DefaultLayout>
  );
}

export default SessionBuilder;
