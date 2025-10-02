import { Wind, Star } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DefaultLayout } from '../components/layouts';
import { PageHeader } from '../components/headers';
import { Button, Card, Text, ContentBody } from '../components/design-system';
import { breathingDurations, breathingExercises } from '../data/breathing';
import usePreferencesStore from '../stores/preferences';
import useFavorites from '../hooks/useFavorites';
import { ExerciseCard } from '../components/cards';
import { LIST_ANIMATION } from '../utils/animations';

/**
 * Breathing Screen
 *
 * Exercise selection screen with duration options.
 * Allows users to choose from different breathing exercises
 * and select session duration (2, 3, 5 minutes).
 */
function Breathing() {
  const navigate = useNavigate();
  const { breathing: breathingPrefs } = usePreferencesStore();
  const [selectedDuration, setSelectedDuration] = useState(breathingPrefs.defaultDuration || 3);

  // Use favorites hook to separate exercises
  const { favorites: favoriteExercises, nonFavorites: nonFavoriteExercises } = useFavorites(breathingExercises, 'breathing');

  const handleExerciseSelect = (exerciseId) => {
    navigate(`/breathing/practice?exercise=${exerciseId}&duration=${selectedDuration}`);
  };

  return (
    <DefaultLayout
      header={
        <PageHeader
          title="Breathwork & Pranayama"
          subtitle="Find calm in just a few breaths"
          showBack={false}
        />
      }
    >
      <ContentBody size="md" spacing="md">
        {/* Duration Selector */}
      <div className="mb-6">
        <Text variant="body" className="mb-3 font-medium text-foreground">
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
          <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-accent fill-accent" />
            Favorite Exercises
          </h2>
          <motion.div
            className="space-y-4"
            variants={LIST_ANIMATION.container}
            initial="hidden"
            animate="visible"
          >
            {favoriteExercises.map((exercise) => (
              <motion.div key={exercise.id} variants={LIST_ANIMATION.item}>
                <ExerciseCard
                  exercise={exercise}
                  selectedDuration={selectedDuration}
                  onClick={() => handleExerciseSelect(exercise.id)}
                  isFavorite={true}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Non-favorite Exercise Cards */}
      <motion.div
        className="space-y-4 mb-6"
        variants={LIST_ANIMATION.container}
        initial="hidden"
        animate="visible"
      >
        {favoriteExercises.length > 0 && (
          <h2 className="text-lg font-medium text-foreground mb-4">
            More Exercises
          </h2>
        )}
        {nonFavoriteExercises.map((exercise) => (
          <motion.div key={exercise.id} variants={LIST_ANIMATION.item}>
            <ExerciseCard
              exercise={exercise}
              selectedDuration={selectedDuration}
              onClick={() => handleExerciseSelect(exercise.id)}
              isFavorite={false}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Quick info about breathing exercises */}
      <Card className="p-4 mb-24 bg-muted border-border">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted flex-shrink-0">
            <Wind className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <Text variant="body" className="font-medium text-foreground mb-1">
              Why practice breathing exercises?
            </Text>
            <Text variant="caption" className="text-muted-foreground">
              Pranayama helps regulate your nervous system, reduce stress, and improve focus.
              These exercises can be done anywhere - perfect for a quick reset during your workday.
            </Text>
          </div>
        </div>
      </Card>
      </ContentBody>
    </DefaultLayout>
  );
}

export default Breathing;
