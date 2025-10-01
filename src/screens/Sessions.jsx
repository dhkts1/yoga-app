import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Zap, Moon, Sun, Plus, Palette, Edit2, Trash2, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/design-system';
import { DefaultLayout } from '../components/layouts';
import { PageHeader } from '../components/headers';
import FavoriteButton from '../components/FavoriteButton';
import CategoryTabs from '../components/CategoryTabs';
import usePreferencesStore from '../stores/preferences';
import useProgressStore from '../stores/progress';
import { getTopRecommendations, getRecommendationTag } from '../utils/recommendations';
import { getSessionById } from '../data/sessions';
import { getBreathingExerciseById } from '../data/breathing';
import {
  categories,
  filterSessionsByCategory,
  filterCustomSessionsByCategory,
  getCategoryCounts
} from '../utils/sessionCategories';

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

function Sessions() {
  const navigate = useNavigate();
  const [customSessions, setCustomSessions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { getFavoriteSessionIds } = usePreferencesStore();
  const { practiceHistory, breathingHistory, totalSessions } = useProgressStore();
  const favoriteIds = getFavoriteSessionIds();

  // Get smart recommendations
  const allHistory = [...(practiceHistory || []), ...(breathingHistory || [])];
  const recommendations = getTopRecommendations(allHistory, 2);

  // Load custom sessions from localStorage
  useEffect(() => {
    const loadCustomSessions = () => {
      try {
        const saved = localStorage.getItem('customSessions');
        if (saved) {
          const parsed = JSON.parse(saved);
          setCustomSessions(parsed);
        }
      } catch (error) {
        console.error('Failed to load custom sessions:', error);
      }
    };

    loadCustomSessions();

    // Listen for storage changes (in case user has multiple tabs open)
    const handleStorageChange = (e) => {
      if (e.key === 'customSessions') {
        loadCustomSessions();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
    if (confirm('Are you sure you want to delete this custom session?')) {
      const updatedSessions = customSessions.filter(session => session.id !== sessionId);
      setCustomSessions(updatedSessions);
      localStorage.setItem('customSessions', JSON.stringify(updatedSessions));
    }
  };

  const formatSessionDuration = (session) => {
    if (session.isCustom && session.totalDurationSeconds) {
      const minutes = Math.ceil(session.totalDurationSeconds / 60);
      return minutes;
    }
    return session.duration;
  };

  // Filter by selected category
  const filteredSessions = filterSessionsByCategory(selectedCategory);
  const filteredCustomSessions = filterCustomSessionsByCategory(customSessions, selectedCategory);

  // Get category counts
  const categoryCounts = getCategoryCounts(customSessions);

  // Separate filtered sessions into favorites and non-favorites
  const favoriteSessionsList = filteredSessions.filter(s => favoriteIds.includes(s.id));
  const nonFavoriteSessionsList = filteredSessions.filter(s => !favoriteIds.includes(s.id));

  // Separate filtered custom sessions into favorites and non-favorites
  const favoriteCustomSessionsList = filteredCustomSessions.filter(s => favoriteIds.includes(s.id));
  const nonFavoriteCustomSessionsList = filteredCustomSessions.filter(s => !favoriteIds.includes(s.id));

  return (
    <DefaultLayout
      header={
        <PageHeader
          title="Sessions"
          showBack={false}
          actions={
            <button
              onClick={handleCreateSession}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-sage-600 hover:bg-sage-700 text-white transition-colors"
              aria-label="Create custom session"
            >
              <Plus className="h-5 w-5" />
            </button>
          }
        >
          {/* Category Tabs below header */}
          <div className="px-4 pb-3 bg-white border-b border-border-light">
            <div className="mx-auto max-w-sm">
              <CategoryTabs
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                counts={categoryCounts}
              />
            </div>
          </div>
        </PageHeader>
      }
      className="bg-cream"
      contentClassName="px-4 py-6"
    >
      {/* Recommended Sessions Section - Only show if user has enough history */}
      {totalSessions >= 3 && recommendations.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-medium text-sage-900">
              Recommended for You
            </h2>
          </div>
          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {recommendations.map((rec) => {
              const sessionData = getSessionById(rec.sessionId) || getBreathingExerciseById(rec.sessionId);
              if (!sessionData) return null;

              const isBreathing = !!getBreathingExerciseById(rec.sessionId);
              const sessionName = isBreathing ? sessionData.nameEnglish : sessionData.name;
              const duration = sessionData.duration || sessionData.defaultDuration;
              const Icon = isBreathing ? Zap : (sessionIcons[rec.sessionId] || Clock);

              return (
                <motion.button
                  key={rec.sessionId}
                  variants={itemVariants}
                  onClick={() => {
                    if (isBreathing) {
                      navigate(`/breathing/practice?exercise=${rec.sessionId}&duration=${duration}`);
                    } else {
                      handleSessionSelect(rec.sessionId);
                    }
                  }}
                  className={`w-full rounded-xl bg-gradient-to-br from-accent/10 to-sage/10 p-4 text-left shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] border-2 ${
                    rec.isPrimary ? 'border-accent' : 'border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-5 w-5 text-accent flex-shrink-0" />
                        <h3 className="text-base font-medium text-sage-900 truncate">
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
                      <div className="flex items-center gap-4 text-sm text-sage-600 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{duration} min</span>
                        </div>
                        {!isBreathing && (
                          <>
                            <span>•</span>
                            <span>{sessionData.poses.length} poses</span>
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
      {favoriteCustomSessionsList.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-sage-900 mb-4 text-center flex items-center justify-center gap-2">
            <Star className="h-5 w-5 text-gold fill-gold" />
            Favorite Custom Sessions
          </h2>
          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {favoriteCustomSessionsList.map((session) => (
              <motion.div
                key={session.id}
                variants={itemVariants}
                className="relative rounded-xl bg-white p-4 shadow-sm border-l-4 border-gold"
              >
                <button
                  onClick={() => handleSessionSelect(session.id, true)}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Palette className="h-5 w-5 text-sage-600 flex-shrink-0" />
                        <h3 className="text-base font-medium text-sage-900 truncate">
                          {session.name}
                        </h3>
                      </div>
                      <p className="text-sm text-sage-700 mb-2 line-clamp-1">
                        {session.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-sage-600 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatSessionDuration(session)} min</span>
                        </div>
                        <span>•</span>
                        <span>{session.poses.length} poses</span>
                        <span>•</span>
                        <span className="text-sage-500">Custom</span>
                      </div>
                    </div>
                    <div className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 flex-shrink-0">
                      <span className="text-sm font-medium text-sage-700">
                        {formatSessionDuration(session)}'
                      </span>
                    </div>
                  </div>
                </button>

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <FavoriteButton itemId={session.id} type="session" size="sm" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSession(session.id);
                    }}
                    className="p-2 hover:bg-sage-100"
                  >
                    <Edit2 className="h-4 w-4 text-sage-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSession(session.id);
                    }}
                    className="p-2 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Non-favorite Custom Sessions */}
      {nonFavoriteCustomSessionsList.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-sage-900 mb-4 text-center">
            Your Custom Sessions
          </h2>
          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {nonFavoriteCustomSessionsList.map((session) => (
              <motion.div
                key={session.id}
                variants={itemVariants}
                className="relative rounded-2xl bg-white p-6 shadow-sm border-l-4 border-sage-400"
              >
                <button
                  onClick={() => handleSessionSelect(session.id, true)}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Palette className="h-5 w-5 text-sage-600 flex-shrink-0" />
                        <h3 className="text-base font-medium text-sage-900 truncate">
                          {session.name}
                        </h3>
                      </div>
                      <p className="text-sm text-sage-700 mb-2 line-clamp-1">
                        {session.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-sage-600 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatSessionDuration(session)} min</span>
                        </div>
                        <span>•</span>
                        <span>{session.poses.length} poses</span>
                        <span>•</span>
                        <span className="text-sage-500">Custom</span>
                      </div>
                    </div>
                    <div className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 flex-shrink-0">
                      <span className="text-sm font-medium text-sage-700">
                        {formatSessionDuration(session)}'
                      </span>
                    </div>
                  </div>
                </button>

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <FavoriteButton itemId={session.id} type="session" size="sm" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSession(session.id);
                    }}
                    className="p-2 hover:bg-sage-100"
                  >
                    <Edit2 className="h-4 w-4 text-sage-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSession(session.id);
                    }}
                    className="p-2 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Favorite Pre-built Sessions */}
      {favoriteSessionsList.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-sage-900 mb-4 text-center flex items-center justify-center gap-2">
            <Star className="h-5 w-5 text-gold fill-gold" />
            Favorite Sessions
          </h2>
          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {favoriteSessionsList.map((session) => {
              const Icon = sessionIcons[session.id] || Clock;
              return (
                <motion.div key={session.id} variants={itemVariants} className="relative">
                  <button
                    onClick={() => handleSessionSelect(session.id)}
                    className="w-full rounded-xl bg-white p-4 text-left shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] border-l-4 border-gold"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-12">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-5 w-5 text-sage-600 flex-shrink-0" />
                          <h2 className="text-base font-medium text-sage-900 truncate">
                            {session.name}
                          </h2>
                        </div>
                        <p className="text-sm text-sage-700 mb-2 line-clamp-1">
                          {session.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-sage-600 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{session.duration} min</span>
                          </div>
                          <span>•</span>
                          <span>{session.poses.length} poses</span>
                          <span>•</span>
                          <span className="capitalize">{session.difficulty}</span>
                          {session.week && (
                            <>
                              <span>•</span>
                              <span className="px-2 py-0.5 rounded-full bg-sage-100 text-sage-700 font-medium text-xs">
                                Week {session.week}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                  <div className="absolute top-3 right-3">
                    <FavoriteButton itemId={session.id} type="session" size="sm" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}


      {/* Non-favorite Pre-built Sessions */}
      <div className="mb-8">
        {(customSessions.length > 0 || favoriteSessionsList.length > 0) && nonFavoriteSessionsList.length > 0 && (
          <h2 className="text-lg font-medium text-sage-900 mb-4 text-center">
            {favoriteSessionsList.length > 0 ? 'More Sessions' : 'Pre-built Sessions'}
          </h2>
        )}
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {nonFavoriteSessionsList.map((session) => {
            const Icon = sessionIcons[session.id] || Clock;
            return (
              <motion.div key={session.id} variants={itemVariants} className="relative">
                <button
                  onClick={() => handleSessionSelect(session.id)}
                  className="w-full rounded-xl bg-white p-4 text-left shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-12">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-5 w-5 text-sage-600 flex-shrink-0" />
                        <h2 className="text-base font-medium text-sage-900 truncate">
                          {session.name}
                        </h2>
                      </div>
                      <p className="text-sm text-sage-700 mb-2 line-clamp-1">
                        {session.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-sage-600 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{session.duration} min</span>
                        </div>
                        <span>•</span>
                        <span>{session.poses.length} poses</span>
                        <span>•</span>
                        <span className="capitalize">{session.difficulty}</span>
                        {session.week && (
                          <>
                            <span>•</span>
                            <span className="px-2 py-0.5 rounded-full bg-sage-100 text-sage-700 font-medium text-xs">
                              Week {session.week}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
                <div className="absolute top-3 right-3">
                  <FavoriteButton itemId={session.id} type="session" size="sm" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

    </DefaultLayout>
  );
}

export default Sessions;