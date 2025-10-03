import { useState, useMemo } from "react";
// import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Filter } from "lucide-react";
import { poses, getCategories } from "../data/poses";
import { Button } from "../components/design-system";
import { DefaultLayout } from "../components/layouts";
import { PageHeader } from "../components/headers";
import PoseImage from "../components/PoseImage";
import useTranslation from "../hooks/useTranslation";

function PoseLibrary() {
  // const navigate = useNavigate(); // Currently unused, keeping for future navigation features
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation();

  // Get unique categories and difficulties
  const categories = useMemo(() => getCategories(), []);
  const difficulties = ["beginner", "intermediate", "advanced"];

  // Filter poses based on search and filters
  const filteredPoses = useMemo(() => {
    return poses.filter((pose) => {
      const matchesSearch =
        searchQuery === "" ||
        pose.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pose.nameSanskrit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pose.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || pose.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === "all" || pose.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  // Count poses by category
  const categoryCounts = useMemo(() => {
    const counts = { all: poses.length };
    categories.forEach((cat) => {
      counts[cat] = poses.filter((p) => p.category === cat).length;
    });
    return counts;
  }, [categories]);

  // Count poses by difficulty
  const difficultyCounts = useMemo(() => {
    const counts = { all: poses.length };
    difficulties.forEach((diff) => {
      counts[diff] = poses.filter((p) => p.difficulty === diff).length;
    });
    return counts;
  }, [difficulties]);

  // eslint-disable-next-line no-unused-vars
  const handlePoseSelect = (poseId) => {
    // Navigate to pose detail or add to custom session
    // For now, we'll just show the pose details in a future enhancement
    // Future: navigate(`/poses/${poseId}`)
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDifficulty("all");
  };

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedDifficulty !== "all" ? 1 : 0);

  return (
    <DefaultLayout
      header={
        <PageHeader
          title={t("screens.poseLibrary.title")}
          subtitle={t("screens.poseLibrary.subtitle")}
          showBack={false}
        />
      }
      contentClassName="px-4 py-6"
    >
      {/* Search Bar */}
      <div className="mx-auto mb-4 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("screens.poseLibrary.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border-2 border-border bg-card px-10 py-3 text-card-foreground placeholder:text-sage-500 focus:border-primary focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-muted"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Toggle Button */}
      <div className="mx-auto mb-4 max-w-sm">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="w-full rounded-2xl border-primary text-muted-foreground hover:bg-muted"
        >
          <Filter className="mr-2 size-5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mx-auto mb-6 max-w-sm space-y-4 rounded-2xl bg-card p-4 shadow-sm">
          {/* Category Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-card-foreground">
              {t("screens.poseLibrary.filterByCategory")}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                  selectedCategory === "all"
                    ? "bg-secondary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted"
                }`}
              >
                All ({categoryCounts.all})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-all ${
                    selectedCategory === cat
                      ? "bg-secondary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {cat} ({categoryCounts[cat]})
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-card-foreground">
              {t("screens.poseLibrary.filterByDifficulty")}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDifficulty("all")}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                  selectedDifficulty === "all"
                    ? "bg-secondary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted"
                }`}
              >
                All ({difficultyCounts.all})
              </button>
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-all ${
                    selectedDifficulty === diff
                      ? "bg-secondary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {diff} ({difficultyCounts[diff]})
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <Button
              onClick={clearFilters}
              variant="ghost"
              className="w-full text-muted-foreground hover:text-card-foreground"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="mx-auto mb-4 max-w-sm">
        <p className="text-center text-sm text-muted-foreground">
          {filteredPoses.length === poses.length
            ? `Showing all ${poses.length} poses`
            : `Found ${filteredPoses.length} pose${filteredPoses.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Poses Grid */}
      <div className="mx-auto max-w-sm">
        {filteredPoses.length === 0 ? (
          <div className="py-12 text-center">
            <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
            <p className="mb-2 text-muted-foreground">No poses found</p>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-primary text-muted-foreground hover:bg-muted"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-20">
            {filteredPoses.map((pose) => (
              <button
                key={pose.id}
                onClick={() => handlePoseSelect(pose.id)}
                className="rounded-xl bg-card p-3 text-left shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
              >
                {/* Pose Image */}
                <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-muted">
                  <PoseImage
                    poseId={pose.id}
                    alt={pose.nameEnglish}
                    className="size-full object-cover"
                  />
                </div>

                {/* Pose Info */}
                <div className="space-y-1">
                  <h3 className="line-clamp-1 text-sm font-medium text-card-foreground">
                    {pose.nameEnglish}
                  </h3>
                  <p className="line-clamp-1 text-xs italic text-muted-foreground">
                    {pose.nameSanskrit}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground">
                      {pose.category}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs capitalize ${
                        pose.difficulty === "beginner"
                          ? "bg-state-info/10 text-state-info"
                          : pose.difficulty === "intermediate"
                            ? "bg-accent/20 text-accent"
                            : "bg-gold/20 text-accent"
                      }`}
                    >
                      {pose.difficulty}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}

export default PoseLibrary;
