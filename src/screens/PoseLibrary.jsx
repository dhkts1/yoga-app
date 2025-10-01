import { useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Filter } from 'lucide-react';
import { poses, getCategories } from '../data/poses';
import { Button } from '../components/design-system';
import { DefaultLayout } from '../components/layouts';
import { PageHeader } from '../components/headers';
import PoseImage from '../components/PoseImage';

function PoseLibrary() {
  // const navigate = useNavigate(); // Currently unused, keeping for future navigation features
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

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
          title="Pose Library"
          subtitle={`Explore ${poses.length} yoga poses`}
          showBack={false}
        />
      }
      contentClassName="px-4 py-6"
    >
      {/* Search Bar */}
      <div className="mx-auto max-w-sm mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sage-600" />
          <input
            type="text"
            placeholder="Search poses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border-2 border-sage-100 focus:border-sage-400 focus:outline-none text-sage-900 placeholder-sage-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-sage-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-sage-600" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Toggle Button */}
      <div className="mx-auto max-w-sm mb-4">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="w-full rounded-2xl border-sage-300 text-sage-700 hover:bg-sage-50"
        >
          <Filter className="h-5 w-5 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-sage-600 text-white text-xs font-medium">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mx-auto max-w-sm mb-6 p-4 bg-white rounded-2xl shadow-sm space-y-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-sage-900 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-sage-700 text-white'
                    : 'bg-cream-100 text-sage-700 hover:bg-sage-100'
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
                      ? 'bg-sage-700 text-white'
                      : 'bg-cream-100 text-sage-700 hover:bg-sage-100'
                  }`}
                >
                  {cat} ({categoryCounts[cat]})
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-sage-900 mb-2">
              Difficulty
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDifficulty('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedDifficulty === 'all'
                    ? 'bg-sage-700 text-white'
                    : 'bg-cream-100 text-sage-700 hover:bg-sage-100'
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
                      ? 'bg-sage-700 text-white'
                      : 'bg-cream-100 text-sage-700 hover:bg-sage-100'
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
              className="w-full text-sage-600 hover:text-sage-900"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="mx-auto max-w-sm mb-4">
        <p className="text-sm text-sage-600 text-center">
          {filteredPoses.length === poses.length
            ? `Showing all ${poses.length} poses`
            : `Found ${filteredPoses.length} pose${filteredPoses.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Poses Grid */}
      <div className="mx-auto max-w-sm">
        {filteredPoses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-sage-400 mb-4" />
            <p className="text-sage-600 mb-2">No poses found</p>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-sage-300 text-sage-700 hover:bg-sage-50"
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
                className="bg-white rounded-xl p-3 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] text-left"
              >
                {/* Pose Image */}
                <div className="mb-3 aspect-square rounded-lg overflow-hidden bg-cream-50">
                  <PoseImage
                    poseId={pose.id}
                    alt={pose.nameEnglish}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Pose Info */}
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-sage-900 line-clamp-1">
                    {pose.nameEnglish}
                  </h3>
                  <p className="text-xs text-sage-600 italic line-clamp-1">
                    {pose.nameSanskrit}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-sage-100 text-sage-700 capitalize">
                      {pose.category}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                      pose.difficulty === 'beginner'
                        ? 'bg-green-100 text-green-700'
                        : pose.difficulty === 'intermediate'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
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
