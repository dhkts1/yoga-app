import { useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Filter } from 'lucide-react';
import { poses, getCategories } from '../data/poses';
import { Button } from '../components/design-system';
import { DefaultLayout } from '../components/layouts';
import { PageHeader } from '../components/headers';
import PoseImage from '../components/PoseImage';
import useTranslation from '../hooks/useTranslation';

function PoseLibrary() {
  // const navigate = useNavigate(); // Currently unused, keeping for future navigation features
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation();

  // Get unique categories and difficulties
  const categories = useMemo(() => getCategories(), []);
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  // Filter poses based on search and filters
  const filteredPoses = useMemo(() => {
    return poses.filter(pose => {
      const matchesSearch = searchQuery === '' ||
        pose.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pose.nameSanskrit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pose.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || pose.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || pose.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  // Count poses by category
  const categoryCounts = useMemo(() => {
    const counts = { all: poses.length };
    categories.forEach(cat => {
      counts[cat] = poses.filter(p => p.category === cat).length;
    });
    return counts;
  }, [categories]);

  // Count poses by difficulty
  const difficultyCounts = useMemo(() => {
    const counts = { all: poses.length };
    difficulties.forEach(diff => {
      counts[diff] = poses.filter(p => p.difficulty === diff).length;
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
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
  };

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedDifficulty !== 'all' ? 1 : 0);

  return (
    <DefaultLayout
      header={
        <PageHeader
          title={t('screens.poseLibrary.title')}
          subtitle={t('screens.poseLibrary.subtitle')}
          showBack={false}
        />
      }
      contentClassName="px-4 py-6"
    >
      {/* Search Bar */}
      <div className="mx-auto max-w-sm mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('screens.poseLibrary.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-card border-2 border-border focus:border-primary focus:outline-none text-card-foreground placeholder-sage-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Toggle Button */}
      <div className="mx-auto max-w-sm mb-4">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="w-full rounded-2xl border-primary text-muted-foreground hover:bg-muted"
        >
          <Filter className="h-5 w-5 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-secondary text-white text-xs font-medium">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mx-auto max-w-sm mb-6 p-4 bg-card rounded-2xl shadow-sm space-y-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              {t('screens.poseLibrary.filterByCategory')}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-secondary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted'
                }`}
              >
                All ({categoryCounts.all})
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                    selectedCategory === cat
                      ? 'bg-secondary text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {cat} ({categoryCounts[cat]})
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              {t('screens.poseLibrary.filterByDifficulty')}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDifficulty('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedDifficulty === 'all'
                    ? 'bg-secondary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted'
                }`}
              >
                All ({difficultyCounts.all})
              </button>
              {difficulties.map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                    selectedDifficulty === diff
                      ? 'bg-secondary text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted'
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
      <div className="mx-auto max-w-sm mb-4">
        <p className="text-sm text-muted-foreground text-center">
          {filteredPoses.length === poses.length
            ? `Showing all ${poses.length} poses`
            : `Found ${filteredPoses.length} pose${filteredPoses.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Poses Grid */}
      <div className="mx-auto max-w-sm">
        {filteredPoses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No poses found</p>
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
                className="bg-card rounded-xl p-3 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] text-left"
              >
                {/* Pose Image */}
                <div className="mb-3 aspect-square rounded-lg overflow-hidden bg-muted">
                  <PoseImage
                    poseId={pose.id}
                    alt={pose.nameEnglish}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Pose Info */}
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-card-foreground line-clamp-1">
                    {pose.nameEnglish}
                  </h3>
                  <p className="text-xs text-muted-foreground italic line-clamp-1">
                    {pose.nameSanskrit}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                      {pose.category}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                      pose.difficulty === 'beginner'
                        ? 'bg-state-info/10 text-state-info'
                        : pose.difficulty === 'intermediate'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gold/20 text-accent'
                    }`}>
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
