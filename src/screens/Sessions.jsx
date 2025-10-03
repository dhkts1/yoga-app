import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Zap,
  Moon,
  Sun,
  Plus,
  Palette,
  Edit2,
  Trash2,
  Star,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button, ContentBody } from "../components/design-system";
import { DefaultLayout } from "../components/layouts";
import { PageHeader } from "../components/headers";
import FavoriteButton from "../components/FavoriteButton";
import CategoryTabs from "../components/CategoryTabs";
import SortDropdown from "../components/SortDropdown";
import SessionList, { FavoriteSessionList } from "../components/SessionList";
import { ConfirmDialog } from "../components/dialogs";
import PoseImage from "../components/PoseImage";
import useProgressStore from "../stores/progress";
import useCustomSessions from "../hooks/useCustomSessions";
import useFavorites from "../hooks/useFavorites";
import { getTopRecommendations } from "../utils/recommendations";
import { getSessionById } from "../data/sessions";
import { getBreathingExerciseById } from "../data/breathing";
import {
  categories,
  filterSessionsByCategory,
  filterCustomSessionsByCategory,
  getCategoryCounts,
} from "../utils/sessionCategories";
import { LIST_ANIMATION } from "../utils/animations";
import useTranslation from "../hooks/useTranslation";

// Session icon mapping - moved outside component for React Compiler
const SESSION_ICONS = {
  "morning-energizer": Sun,
  "lunch-break-relief": Zap,
  "evening-wind-down": Moon,
};

// Helper to enrich session with pose image - React Compiler compatible
const enrichSessionWithImage = (session) => ({
  ...session,
  poseImage: session.poses?.[0]?.poseId ? (
    <PoseImage
      poseId={session.poses[0].poseId}
      size="sm"
      shape="circular"
    />
  ) : null,
  gradient: "bg-card",
});

function Sessions() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("recent");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  // Optimize Zustand selectors
  const practiceHistory = useProgressStore((state) => state.practiceHistory);
  const breathingHistory = useProgressStore((state) => state.breathingHistory);
  const totalSessions = useProgressStore((state) => state.totalSessions);

  // Use custom sessions hook instead of direct localStorage
  const { sessions: customSessions, remove: removeCustomSession } =
    useCustomSessions();

  // Memoize smart recommendations
  const allHistory = useMemo(
    () => [...(practiceHistory || []), ...(breathingHistory || [])],
    [practiceHistory, breathingHistory],
  );
  const recommendations = useMemo(
    () => getTopRecommendations(allHistory, 2),
    [allHistory],
  );

  const handleSessionSelect = (sessionId, isCustom = false) => {
    if (isCustom) {
      navigate(`/sessions/${sessionId}/preview?custom=true`);
    } else {
      navigate(`/sessions/${sessionId}/preview`);
    }
  };

  const handleCreateSession = () => {
    navigate("/sessions/builder");
  };

  const handleEditSession = (sessionId) => {
    navigate(`/sessions/builder?edit=${sessionId}`);
  };

  const handleDeleteSession = (sessionId) => {
    setSessionToDelete(sessionId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (sessionToDelete) {
      removeCustomSession(sessionToDelete);
    }
    setShowDeleteConfirm(false);
    setSessionToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSessionToDelete(null);
  };

  // Memoize filtered sessions
  const filteredSessions = useMemo(
    () => filterSessionsByCategory(selectedCategory),
    [selectedCategory],
  );
  const filteredCustomSessions = useMemo(
    () => filterCustomSessionsByCategory(customSessions, selectedCategory),
    [customSessions, selectedCategory],
  );

  // Memoize category counts
  const categoryCounts = useMemo(
    () => getCategoryCounts(customSessions),
    [customSessions],
  );

  // Sorting function - wrapped in useCallback for React Compiler
  const sortSessions = useCallback((sessions) => {
    const sorted = [...sessions];
    switch (selectedSort) {
      case "duration-asc":
        return sorted.sort(
          (a, b) =>
            (a.duration || a.defaultDuration || 0) -
            (b.duration || b.defaultDuration || 0),
        );
      case "duration-desc":
        return sorted.sort(
          (a, b) =>
            (b.duration || b.defaultDuration || 0) -
            (a.duration || a.defaultDuration || 0),
        );
      case "alpha-asc":
        return sorted.sort((a, b) =>
          (a.name || a.nameEnglish || "").localeCompare(
            b.name || b.nameEnglish || "",
          ),
        );
      case "alpha-desc":
        return sorted.sort((a, b) =>
          (b.name || b.nameEnglish || "").localeCompare(
            a.name || a.nameEnglish || "",
          ),
        );
      case "recent":
      default:
        return sorted; // Keep original order (most recent first for custom)
    }
  }, [selectedSort]);

  // Apply sorting to filtered sessions
  const sortedFilteredSessions = useMemo(
    () => sortSessions(filteredSessions),
    [sortSessions, filteredSessions],
  );
  const sortedFilteredCustomSessions = useMemo(
    () => sortSessions(filteredCustomSessions),
    [sortSessions, filteredCustomSessions],
  );

  // Use favorites hook to separate sessions
  const {
    favorites: favoriteSessionsList,
    nonFavorites: nonFavoriteSessionsList,
  } = useFavorites(sortedFilteredSessions, "session");
  const {
    favorites: favoriteCustomSessionsList,
    nonFavorites: nonFavoriteCustomSessionsList,
  } = useFavorites(sortedFilteredCustomSessions, "session");

  // Helper function to get custom session actions
  const getCustomSessionActions = (session) => (
    <>
      <FavoriteButton itemId={session.id} type="session" size="sm" />
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleEditSession(session.id);
        }}
        className="p-2 hover:bg-muted"
        aria-label={`Edit ${session.name}`}
      >
        <Edit2 className="size-4 text-muted-foreground" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteSession(session.id);
        }}
        className="p-2 hover:bg-state-error/10"
        aria-label={`Delete ${session.name}`}
      >
        <Trash2 className="size-4 text-state-error" />
      </Button>
    </>
  );

  // Helper function to get favorite button for pre-built sessions
  const getPrebuiltSessionActions = (session) => (
    <FavoriteButton itemId={session.id} type="session" size="sm" />
  );

  return (
    <DefaultLayout
      header={
        <PageHeader
          title={t("screens.sessions.title")}
          subtitle={t("screens.sessions.subtitle")}
          showBack={false}
        />
      }
    >
      <ContentBody size="md" spacing="sm">
        {/* Category Tabs, Sort & Create Button */}
        <div className="-mt-2 mb-4">
          <div className="mb-3 flex items-start gap-2">
            <div className="flex-1">
              <CategoryTabs
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                counts={categoryCounts}
              />
            </div>
            <SortDropdown
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
            />
            <button
              onClick={handleCreateSession}
              className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
              aria-label={t("screens.sessions.createCustom")}
            >
              <Plus className="size-5" />
            </button>
          </div>
        </div>

        {/* Recommended Sessions Section - Only show if user has enough history */}
        {totalSessions >= 3 && recommendations.length > 0 && (
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-center gap-1.5">
              <Sparkles className="size-3.5 shrink-0 text-accent" />
              <h2 className="text-sm font-medium text-foreground">
                {t("screens.sessions.recommendedForYou")}
              </h2>
            </div>
            <motion.div
              className="space-y-1.5"
              variants={LIST_ANIMATION.container}
              initial="hidden"
              animate="visible"
            >
              {recommendations.map((rec) => {
                const sessionData =
                  getSessionById(rec.sessionId) ||
                  getBreathingExerciseById(rec.sessionId);
                if (!sessionData) return null;

                const isBreathing = !!getBreathingExerciseById(rec.sessionId);
                const sessionName = isBreathing
                  ? sessionData.nameEnglish
                  : sessionData.name;
                const duration =
                  sessionData.duration || sessionData.defaultDuration;
                const Icon = isBreathing
                  ? Zap
                  : SESSION_ICONS[rec.sessionId] || Clock;

                // Get first pose for image (if yoga session)
                const firstPoseId =
                  !isBreathing && sessionData.poses?.[0]?.poseId;

                // Use bg-card for consistent theming
                const gradient = "bg-card";

                return (
                  <motion.button
                    key={rec.sessionId}
                    variants={LIST_ANIMATION.item}
                    onClick={() => {
                      if (isBreathing) {
                        navigate(
                          `/breathing/practice?exercise=${rec.sessionId}&duration=${duration}`,
                        );
                      } else {
                        handleSessionSelect(rec.sessionId);
                      }
                    }}
                    className={`w-full rounded-lg border p-3 text-left shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] ${
                      rec.isPrimary ? "border-accent" : "border-border"
                    } ${gradient}`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Pose Image */}
                      {firstPoseId && (
                        <div className="size-10 shrink-0">
                          <PoseImage
                            poseId={firstPoseId}
                            size="sm"
                            shape="circular"
                          />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="mb-0.5 flex items-center gap-1.5">
                          {!firstPoseId && (
                            <Icon className="size-4 shrink-0 text-accent" />
                          )}
                          <h3 className="line-clamp-1 text-sm font-medium text-foreground">
                            {sessionName}
                          </h3>
                          {rec.isPrimary && (
                            <Star className="size-3.5 shrink-0 fill-current text-accent" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="size-3.5" />
                            <span>{duration} min</span>
                          </div>
                          {!isBreathing && (
                            <>
                              <span>•</span>
                              <span>{sessionData.poses.length} poses</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        )}

        {/* Favorite Custom Sessions */}
        <FavoriteSessionList
          sessions={favoriteCustomSessionsList.map(enrichSessionWithImage)}
          title={t("screens.sessions.favoriteCustomSessions")}
          type="custom"
          onSessionClick={(session) => handleSessionSelect(session.id, true)}
          getIcon={() => Palette}
          getActions={getCustomSessionActions}
        />

        {/* Non-favorite Custom Sessions */}
        <SessionList
          sessions={nonFavoriteCustomSessionsList.map(enrichSessionWithImage)}
          title={t("screens.sessions.yourCustomSessions")}
          variant="custom"
          type="custom"
          onSessionClick={(session) => handleSessionSelect(session.id, true)}
          getIcon={() => Palette}
          getActions={getCustomSessionActions}
        />

        {/* Favorite Pre-built Sessions */}
        <FavoriteSessionList
          sessions={favoriteSessionsList.map(enrichSessionWithImage)}
          title={t("screens.sessions.favoriteSessions")}
          type="yoga"
          onSessionClick={(session) => handleSessionSelect(session.id)}
          getIcon={(session) => SESSION_ICONS[session.id] || Clock}
          getActions={getPrebuiltSessionActions}
        />

        {/* Non-favorite Pre-built Sessions */}
        <SessionList
          sessions={nonFavoriteSessionsList.map(enrichSessionWithImage)}
          title={
            (customSessions.length > 0 || favoriteSessionsList.length > 0) &&
            nonFavoriteSessionsList.length > 0
              ? favoriteSessionsList.length > 0
                ? t("screens.sessions.moreSessions")
                : t("screens.sessions.prebuiltSessions")
              : ""
          }
          variant="default"
          type="yoga"
          onSessionClick={(session) => handleSessionSelect(session.id)}
          getIcon={(session) => SESSION_ICONS[session.id] || Clock}
          getActions={getPrebuiltSessionActions}
        />
      </ContentBody>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title={t("screens.sessions.deleteSessionTitle")}
        message={t("screens.sessions.deleteSessionMessage")}
        confirmText={t("common.delete")}
        confirmVariant="danger"
        icon="warning"
      />
    </DefaultLayout>
  );
}

export default Sessions;
