import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Zap, Moon, Sun, Plus, Palette, Edit2, Trash2, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, ContentBody } from '../components/design-system';
import { DefaultLayout } from '../components/layouts';
import { PageHeader } from '../components/headers';
import FavoriteButton from '../components/FavoriteButton';
import CategoryTabs from '../components/CategoryTabs';
import SessionList, { FavoriteSessionList } from '../components/SessionList';
import { ConfirmDialog } from '../components/dialogs';
import PoseImage from '../components/PoseImage';
import useProgressStore from '../stores/progress';
import useCustomSessions from '../hooks/useCustomSessions';
import useFavorites from '../hooks/useFavorites';
import { getTopRecommendations, getRecommendationTag } from '../utils/recommendations';
import { getSessionById } from '../data/sessions';
import { getBreathingExerciseById } from '../data/breathing';
import {
  categories,
  filterSessionsByCategory,
  filterCustomSessionsByCategory,
  getCategoryCounts
} from '../utils/sessionCategories';
import { LIST_ANIMATION } from '../utils/animations';
import useTranslation from '../hooks/useTranslation';

function Sessions() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  // Optimize Zustand selectors
  const practiceHistory = useProgressStore(state => state.practiceHistory);
  const breathingHistory = useProgressStore(state => state.breathingHistory);
  const totalSessions = useProgressStore(state => state.totalSessions);

  // Use custom sessions hook instead of direct localStorage
  const { sessions: customSessions, remove: removeCustomSession } = useCustomSessions();

  // Memoize smart recommendations
  const allHistory = useMemo(() =>
    [...(practiceHistory || []), ...(breathingHistory || [])],
    [practiceHistory, breathingHistory]
  );
  const recommendations = useMemo(() =>
    getTopRecommendations(allHistory, 2),
    [allHistory]
  );

  const sessionIcons = {
    'morning-energizer': Sun,
    'lunch-break-relief': Zap,
    'evening-wind-down': Moon
  };

  const handleSessionSelect = (sessionId, isCustom = false) => {
    if (isCustom) {
      navigate(`/sessions/${sessionId}/preview?custom=true`);
    } else {
      navigate(`/sessions/${sessionId}/preview`);
    }
  };

  const handleCreateSession = () => {
    navigate('/sessions/builder');
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
  const filteredSessions = useMemo(() =>
    filterSessionsByCategory(selectedCategory),
    [selectedCategory]
  );
  const filteredCustomSessions = useMemo(() =>
    filterCustomSessionsByCategory(customSessions, selectedCategory),
    [customSessions, selectedCategory]
  );

  // Memoize category counts
  const categoryCounts = useMemo(() =>
    getCategoryCounts(customSessions),
    [customSessions]
  );

  // Use favorites hook to separate sessions
  const { favorites: favoriteSessionsList, nonFavorites: nonFavoriteSessionsList } = useFavorites(filteredSessions, 'session');
  const { favorites: favoriteCustomSessionsList, nonFavorites: nonFavoriteCustomSessionsList } = useFavorites(filteredCustomSessions, 'session');

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
        <Edit2 className="h-4 w-4 text-muted-foreground" />
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
        <Trash2 className="h-4 w-4 text-state-error" />
      </Button>
    </>
  );

  // Helper function to get favorite button for pre-built sessions
  const getPrebuiltSessionActions = (session) => (
    <FavoriteButton itemId={session.id} type="session" size="sm" />
  );

  return (
    <DefaultLayout
      header={<PageHeader title={t('screens.sessions.title')} subtitle={t('screens.sessions.subtitle')} showBack={false} />}
    >
      <ContentBody size="md" spacing="lg">
        {/* Category Tabs & Create Button */}
      <div className="mb-6 -mt-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <CategoryTabs
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              counts={categoryCounts}
            />
          </div>
          <button
            onClick={handleCreateSession}
            className="ml-3 flex items-center justify-center w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-white transition-colors flex-shrink-0"
            aria-label={t('screens.sessions.createCustom')}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Recommended Sessions Section - Only show if user has enough history */}
      {totalSessions >= 3 && recommendations.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-medium text-card-foreground">
              {t('screens.sessions.recommendedForYou')}
            </h2>
          </div>
          <motion.div
            className="space-y-3"
            variants={LIST_ANIMATION.container}
            initial="hidden"
            animate="visible"
          >
            {recommendations.map((rec, index) => {
              const sessionData = getSessionById(rec.sessionId) || getBreathingExerciseById(rec.sessionId);
              if (!sessionData) return null;

              const isBreathing = !!getBreathingExerciseById(rec.sessionId);
              const sessionName = isBreathing ? sessionData.nameEnglish : sessionData.name;
              const duration = sessionData.duration || sessionData.defaultDuration;
              const Icon = isBreathing ? Zap : (sessionIcons[rec.sessionId] || Clock);

              // Get first pose for image (if yoga session)
              const firstPoseId = !isBreathing && sessionData.poses?.[0]?.poseId;

              // Use bg-card for consistent theming
              const gradient = 'bg-card';

              // Hero size for first recommendation
              const isHero = index === 0 && rec.isPrimary;

              return (
                <motion.button
                  key={rec.sessionId}
                  variants={LIST_ANIMATION.item}
                  onClick={() => {
                    if (isBreathing) {
                      navigate(`/breathing/practice?exercise=${rec.sessionId}&duration=${duration}`);
                    } else {
                      handleSessionSelect(rec.sessionId);
                    }
                  }}
                  className={`w-full rounded-xl p-4 text-left shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] border-2 ${
                    rec.isPrimary ? 'border-accent' : 'border-transparent'
                  } ${gradient} ${isHero ? 'p-5 min-h-[160px]' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Pose Image */}
                    {firstPoseId && (
                      <PoseImage
                        poseId={firstPoseId}
                        size={isHero ? 'lg' : 'md'}
                        shape="circular"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!firstPoseId && <Icon className="h-5 w-5 text-accent flex-shrink-0" />}
                        <h3 className={`${isHero ? 'text-lg' : 'text-base'} font-medium text-card-foreground truncate`}>
                          {sessionName}
                        </h3>
                        {rec.isPrimary && (
                          <Star className="h-4 w-4 text-accent fill-current flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-white font-medium">
                          {getRecommendationTag(rec)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{duration} min</span>
                        </div>
                        {!isBreathing && (
                          <>
                            <span>•</span>
                            <span>{sessionData.poses.length} {t('screens.sessions.poses')}</span>
                          </>
                        )}
                        <span>•</span>
                        <span className="capitalize">{sessionData.difficulty || sessionData.category}</span>
                      </div>
                    </div>
                    <div className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 flex-shrink-0">
                      <span className="text-sm font-medium text-accent">
                        {duration}'
                      </span>
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
        sessions={favoriteCustomSessionsList.map(session => ({
          ...session,
          poseImage: session.poses?.[0]?.poseId ? (
            <PoseImage poseId={session.poses[0].poseId} size="md" shape="circular" />
          ) : null,
          gradient: 'bg-card'
        }))}
        title={t('screens.sessions.favoriteCustomSessions')}
        type="custom"
        onSessionClick={(session) => handleSessionSelect(session.id, true)}
        getIcon={() => Palette}
        getActions={getCustomSessionActions}
      />

      {/* Non-favorite Custom Sessions */}
      <SessionList
        sessions={nonFavoriteCustomSessionsList.map(session => ({
          ...session,
          poseImage: session.poses?.[0]?.poseId ? (
            <PoseImage poseId={session.poses[0].poseId} size="md" shape="circular" />
          ) : null,
          gradient: 'bg-card'
        }))}
        title={t('screens.sessions.yourCustomSessions')}
        variant="custom"
        type="custom"
        onSessionClick={(session) => handleSessionSelect(session.id, true)}
        getIcon={() => Palette}
        getActions={getCustomSessionActions}
      />

      {/* Favorite Pre-built Sessions */}
      <FavoriteSessionList
        sessions={favoriteSessionsList.map(session => ({
          ...session,
          poseImage: session.poses?.[0]?.poseId ? (
            <PoseImage poseId={session.poses[0].poseId} size="md" shape="circular" />
          ) : null,
          gradient: 'bg-card'
        }))}
        title={t('screens.sessions.favoriteSessions')}
        type="yoga"
        onSessionClick={(session) => handleSessionSelect(session.id)}
        getIcon={(session) => sessionIcons[session.id] || Clock}
        getActions={getPrebuiltSessionActions}
      />


      {/* Non-favorite Pre-built Sessions */}
      <SessionList
        sessions={nonFavoriteSessionsList.map(session => ({
          ...session,
          poseImage: session.poses?.[0]?.poseId ? (
            <PoseImage poseId={session.poses[0].poseId} size="md" shape="circular" />
          ) : null,
          gradient: 'bg-card'
        }))}
        title={(customSessions.length > 0 || favoriteSessionsList.length > 0) && nonFavoriteSessionsList.length > 0
          ? (favoriteSessionsList.length > 0 ? t('screens.sessions.moreSessions') : t('screens.sessions.prebuiltSessions'))
          : ''}
        variant="default"
        type="yoga"
        onSessionClick={(session) => handleSessionSelect(session.id)}
        getIcon={(session) => sessionIcons[session.id] || Clock}
        getActions={getPrebuiltSessionActions}
      />
      </ContentBody>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title={t('screens.sessions.deleteSessionTitle')}
        message={t('screens.sessions.deleteSessionMessage')}
        confirmText={t('common.delete')}
        confirmVariant="danger"
        icon="warning"
      />
    </DefaultLayout>
  );
}

export default Sessions;