import { Wind, Star } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DefaultLayout } from '../components/layouts';
import { PageHeader } from '../components/headers';
import { Button, Card, Heading, Text } from '../components/design-system';
import { breathingDurations, breathingExercises } from '../data/breathing';
import usePreferencesStore from '../stores/preferences';
import FavoriteButton from '../components/FavoriteButton';
import { getCategoryColors } from '../utils/badges';

/**
 * Breathing Screen
 *
 * Exercise selection screen with duration options.
 * Allows users to choose from different breathing exercises
 * and select session duration (2, 3, 5 minutes).
 */
function Breathing() {
  const navigate = useNavigate();
  const { breathing: breathingPrefs, getFavoriteExerciseIds } = usePreferencesStore();
  const [selectedDuration, setSelectedDuration] = useState(breathingPrefs.defaultDuration || 3);

  const favoriteExerciseIds = getFavoriteExerciseIds();

  // Separate exercises into favorites and non-favorites
  const favoriteExercises = breathingExercises.filter(ex => favoriteExerciseIds.includes(ex.id));
  const nonFavoriteExercises = breathingExercises.filter(ex => !favoriteExerciseIds.includes(ex.id));

  const handleExerciseSelect = (exerciseId) => {
    navigate(`/breathing/practice?exercise=${exerciseId}&duration=${selectedDuration}`);
  };

  return (
    <DefaultLayout
      header={
        <PageHeader
          title="Breathing Exercises"
          subtitle="Practice pranayama for quick stress relief and focus"
          showBack={false}
        />
      }
      contentClassName="px-4"
    >

      {/* Duration Selector */}
      <div className="mb-6 mt-6">
        <Text variant="body" className="mb-3 font-medium">
          Session Duration
        </Text>
        <div className="flex gap-2 w-full overflow-x-auto">
          {breathingDurations.map((duration) => (
            <Button
              key={duration.value}
              variant={selectedDuration === duration.value ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedDuration(duration.value)}
              className="flex-1 min-w-0 pt-3 pb-2"
            >
              <div className="text-center w-full">
                <div className="text-lg font-bold leading-none">{duration.value}min</div>
                <div className="text-[10px] leading-tight opacity-80 truncate mt-0.5">{duration.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Favorite Exercise Cards */}
      {favoriteExercises.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-medium text-sage-900 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-gold fill-gold" />
            Favorite Exercises
          </h2>
          <div className="space-y-4">
            {favoriteExercises.map((exercise) => {
              const categoryStyle = getCategoryColors(exercise.category);

              return (
                <Card
                  key={exercise.id}
                  className="p-0 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] relative border-l-4 border-gold"
                  onClick={() => handleExerciseSelect(exercise.id)}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 flex-shrink-0">
                          <span className="text-2xl">{exercise.emoji}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <Heading level={3} className="text-base truncate">
                            {exercise.nameEnglish}
                          </Heading>
                          <div className="flex items-center gap-2 text-xs text-secondary flex-wrap">
                            <span>{exercise.defaultDuration} min</span>
                            <span>•</span>
                            <span className={`capitalize px-2 py-0.5 rounded-full ${categoryStyle.bg} ${categoryStyle.text} font-medium`}>
                              {exercise.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="text-right">
                          <div className="text-lg font-bold text-sage-700">{selectedDuration}</div>
                          <div className="text-[10px] text-secondary">min</div>
                        </div>
                        <FavoriteButton itemId={exercise.id} type="breathing" size="sm" />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Non-favorite Exercise Cards */}
      <div className="space-y-4 mb-8">
        {favoriteExercises.length > 0 && (
          <h2 className="text-lg font-medium text-sage-900 mb-4">
            More Exercises
          </h2>
        )}
        {nonFavoriteExercises.map((exercise) => {
          const categoryStyle = getCategoryColors(exercise.category);

          return (
            <Card
              key={exercise.id}
              className="p-0 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] relative"
              onClick={() => handleExerciseSelect(exercise.id)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 flex-shrink-0">
                      <span className="text-2xl">{exercise.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Heading level={3} className="text-base truncate">
                        {exercise.nameEnglish}
                      </Heading>
                      <div className="flex items-center gap-2 text-xs text-secondary flex-wrap">
                        <span>{exercise.defaultDuration} min</span>
                        <span>•</span>
                        <span className={`capitalize px-2 py-0.5 rounded-full ${categoryStyle.bg} ${categoryStyle.text} font-medium`}>
                          {exercise.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-lg font-bold text-sage-700">{selectedDuration}</div>
                      <div className="text-[10px] text-secondary">min</div>
                    </div>
                    <FavoriteButton itemId={exercise.id} type="breathing" size="sm" />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick info about breathing exercises */}
      <Card className="p-4 mb-24 bg-sage-50 border-sage-200">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-200 flex-shrink-0">
            <Wind className="h-4 w-4 text-sage-700" />
          </div>
          <div>
            <Text variant="body" className="font-medium mb-1">
              Why practice breathing exercises?
            </Text>
            <Text variant="caption" className="text-secondary">
              Pranayama helps regulate your nervous system, reduce stress, and improve focus.
              These exercises can be done anywhere - perfect for a quick reset during your workday.
            </Text>
          </div>
        </div>
      </Card>
    </DefaultLayout>
  );
}

export default Breathing;
