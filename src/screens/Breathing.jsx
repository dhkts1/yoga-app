import { Wind, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DefaultLayout } from "../components/layouts";
import { PageHeader } from "../components/headers";
import { Button, Card, Text, ContentBody } from "../components/design-system";
import { breathingDurations, breathingExercises } from "../data/breathing";
import usePreferencesStore from "../stores/preferences";
import useFavorites from "../hooks/useFavorites";
import { ExerciseCard } from "../components/cards";
import { LIST_ANIMATION } from "../utils/animations";
import useTranslation from "../hooks/useTranslation";

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
  const [selectedDuration, setSelectedDuration] = useState(
    breathingPrefs.defaultDuration || 3,
  );
  const { t } = useTranslation();

  // Use favorites hook to separate exercises
  const { favorites: favoriteExercises, nonFavorites: nonFavoriteExercises } =
    useFavorites(breathingExercises, "breathing");

  const handleExerciseSelect = (exerciseId) => {
    navigate(
      `/breathing/practice?exercise=${exerciseId}&duration=${selectedDuration}`,
    );
  };

  return (
    <DefaultLayout
      header={
        <PageHeader
          title={t("screens.breathing.title")}
          subtitle={t("screens.breathing.subtitle")}
          showBack={false}
        />
      }
    >
      <ContentBody size="md" spacing="sm">
        {/* Duration Selector */}
        <div className="mb-4">
          <Text
            variant="body"
            className="mb-2 text-sm font-medium text-foreground"
          >
            Session Duration
          </Text>
          <div className="flex w-full gap-2 overflow-x-auto">
            {breathingDurations.map((duration) => (
              <Button
                key={duration.value}
                variant={
                  selectedDuration === duration.value ? "primary" : "secondary"
                }
                size="sm"
                onClick={() => setSelectedDuration(duration.value)}
                className="min-w-0 flex-1 pb-2 pt-2.5"
              >
                <div className="w-full text-center">
                  <div className="text-base font-bold leading-none">
                    {duration.value}min
                  </div>
                  <div className="mt-0.5 truncate text-[10px] leading-tight opacity-80">
                    {duration.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Favorite Exercise Cards */}
        {favoriteExercises.length > 0 && (
          <div className="mb-4">
            <h2 className="mb-2 flex items-center justify-center gap-1.5 text-sm font-medium text-foreground">
              <Star className="size-4 fill-accent text-accent" />
              Favorite Exercises
            </h2>
            <motion.div
              className="space-y-1.5"
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
          className="mb-4 space-y-1.5"
          variants={LIST_ANIMATION.container}
          initial="hidden"
          animate="visible"
        >
          {favoriteExercises.length > 0 && (
            <h2 className="mb-2 text-center text-sm font-medium text-foreground">
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
        <Card padding="sm" className="mb-24 border-border bg-muted">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <Wind className="size-4 text-muted-foreground" />
            </div>
            <div>
              <Text variant="body" className="mb-1 font-medium text-foreground">
                Why practice breathing exercises?
              </Text>
              <Text variant="caption" className="text-muted-foreground">
                Pranayama helps regulate your nervous system, reduce stress, and
                improve focus. These exercises can be done anywhere - perfect
                for a quick reset during your workday.
              </Text>
            </div>
          </div>
        </Card>
      </ContentBody>
    </DefaultLayout>
  );
}

export default Breathing;
