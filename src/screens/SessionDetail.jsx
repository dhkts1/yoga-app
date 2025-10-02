import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Clock, TrendingUp, Target, Calendar, Play, Heart, Share2, BookMarked } from 'lucide-react';
import { getSessionById } from '../data/sessions';
import { getBreathingExerciseById } from '../data/breathing';
import { getPoseById } from '../data/poses';
import { Button } from '../components/design-system';
import { DefaultLayout } from '../components/layouts';
import { PageHeader } from '../components/headers';
import FavoriteButton from '../components/FavoriteButton';
import PoseImage from '../components/PoseImage';
import useProgressStore from '../stores/progress';
import useCustomSessions from '../hooks/useCustomSessions';

function SessionDetail() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Get program context if this session is part of a program
  const programContext = location.state?.programContext || null;
  const [sessionData, setSessionData] = useState(null);
  const [sessionType, setSessionType] = useState(null); // 'prebuilt', 'custom', 'breathing'
  const [isCustom, setIsCustom] = useState(false);
  const { practiceHistory, breathingHistory } = useProgressStore();

  // Use custom sessions hook
  const { getById: getCustomSessionById, isLoading: customSessionsLoading } = useCustomSessions();

  // Load session data on mount
  useEffect(() => {
    const loadSessionData = () => {
      // Check if it's a custom session from URL param
      const customParam = searchParams.get('custom');

      if (customParam === 'true') {
        // Wait for custom sessions to load
        if (customSessionsLoading) {
          return;
        }

        // Load using hook
        const session = getCustomSessionById(sessionId);
        if (session) {
          setSessionData(session);
          setSessionType('custom');
          setIsCustom(true);
          return;
        }
      }

      // Try pre-built session
      const prebuiltSession = getSessionById(sessionId);
      if (prebuiltSession) {
        setSessionData(prebuiltSession);
        setSessionType('prebuilt');
        setIsCustom(false);
        return;
      }

      // Try breathing exercise
      const breathingExercise = getBreathingExerciseById(sessionId);
      if (breathingExercise) {
        setSessionData(breathingExercise);
        setSessionType('breathing');
        setIsCustom(false);
        return;
      }

      // Session not found
      console.error('Session not found:', sessionId);
      navigate('/sessions');
    };

    loadSessionData();
  }, [sessionId, searchParams, navigate, getCustomSessionById, customSessionsLoading]);

  // Calculate total duration in minutes for custom sessions
  const getTotalDuration = () => {
    if (!sessionData) return 0;

    if (sessionType === 'breathing') {
      return sessionData.defaultDuration;
    }

    if (sessionData.duration) {
      return sessionData.duration;
    }

    // Calculate from poses for custom sessions
    if (sessionData.poses && sessionData.poses.length > 0) {
      const totalSeconds = sessionData.poses.reduce((sum, poseItem) => {
        return sum + (poseItem.duration || 0);
      }, 0);
      return Math.ceil(totalSeconds / 60);
    }

    return 0;
  };

  // Get pose details for session poses
  const getPoseDetails = (poseItem) => {
    const poseId = poseItem.poseId || poseItem.id;
    return getPoseById(poseId);
  };

  // Calculate times this session has been practiced
  const getSessionPracticeCount = () => {
    if (!sessionData) return 0;

    if (sessionType === 'breathing') {
      return breathingHistory.filter(h => h.exerciseId === sessionId).length;
    }

    return practiceHistory.filter(h => h.sessionId === sessionId).length;
  };

  // Handle start practice
  const handleStartPractice = () => {
    if (!sessionData) return;

    if (sessionType === 'breathing') {
      navigate(`/breathing/practice?exercise=${sessionId}&duration=${sessionData.defaultDuration}`);
    } else if (isCustom) {
      navigate(`/practice?customSession=${sessionId}`, {
        // Pass program context if available
        ...(programContext && { state: { programContext } })
      });
    } else {
      navigate(`/practice?session=${sessionId}`, {
        // Pass program context if available
        ...(programContext && { state: { programContext } })
      });
    }
  };

  // Handle share
  const handleShare = async () => {
    if (!sessionData) return;

    const shareData = {
      title: `Mindful Yoga - ${sessionData.name || sessionData.nameEnglish}`,
      text: `Check out this ${getTotalDuration()} minute yoga session!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Determine back path based on program context
  const backPath = programContext?.programId && programContext?.weekNumber
    ? `/programs/${programContext.programId}/week/${programContext.weekNumber}`
    : '/sessions';

  if (!sessionData) {
    return (
      <DefaultLayout header={<PageHeader title="Loading..." backPath={backPath} />}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-sage-400 text-lg">Loading session...</div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  const totalDuration = getTotalDuration();
  const practiceCount = getSessionPracticeCount();
  const sessionName = sessionData.name || sessionData.nameEnglish;
  const sessionDescription = sessionData.description;

  return (
    <DefaultLayout
      header={
        <PageHeader
          title={sessionName}
          backPath={backPath}
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 text-sage-600 hover:text-sage-700 rounded-lg hover:bg-sage-50 transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <FavoriteButton itemId={sessionId} type="session" size="md" />
            </div>
          }
        />
      }
    >
      {/* Hero Section */}
      <div className="px-4 py-3 bg-gradient-to-b from-cream-50 to-cream">
        <div className="mx-auto max-w-sm text-center">
          {/* Session Icon/Emoji */}
          <div className="mb-2 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center">
              <span className="text-2xl">
                {sessionData.emoji || '🧘'}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sage-700 text-sm mb-3">
            {sessionDescription}
          </p>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
            {/* Program Context Badge */}
            {programContext && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-accent/20 rounded-full shadow-sm border border-accent/30">
                <BookMarked className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-semibold text-accent">
                  Week {programContext.weekNumber}, Day {programContext.dayNumber}
                </span>
              </div>
            )}

            {/* Duration */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-white rounded-full shadow-sm">
              <Clock className="h-3.5 w-3.5 text-sage-600" />
              <span className="text-xs font-medium text-sage-900">{totalDuration} min</span>
            </div>

            {/* Difficulty */}
            {sessionData.difficulty && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-white rounded-full shadow-sm">
                <TrendingUp className="h-3.5 w-3.5 text-sage-600" />
                <span className="text-xs font-medium text-sage-900 capitalize">{sessionData.difficulty}</span>
              </div>
            )}

            {/* Category/Focus */}
            {(sessionData.focus || sessionData.category) && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-white rounded-full shadow-sm">
                <Target className="h-3.5 w-3.5 text-sage-600" />
                <span className="text-xs font-medium text-sage-900 capitalize">
                  {sessionData.focus || sessionData.category}
                </span>
              </div>
            )}

            {/* Practice Count */}
            {practiceCount > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-accent/10 rounded-full shadow-sm">
                <Calendar className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-medium text-accent">
                  Practiced {practiceCount}x
                </span>
              </div>
            )}
          </div>

          {/* Custom Session Badge */}
          {isCustom && (
            <div className="inline-block px-2.5 py-0.5 bg-sage-100 rounded-full">
              <span className="text-xs font-medium text-sage-700">Custom Session</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-32">
        <div className="mx-auto max-w-sm space-y-6">
          {/* Poses List (for yoga sessions) */}
          {sessionType !== 'breathing' && sessionData.poses && sessionData.poses.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-medium text-sage-900 mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-sage-600" />
                Poses in This Session ({sessionData.poses.length})
              </h2>
              <div className="space-y-3">
                {sessionData.poses.map((poseItem, index) => {
                  const pose = getPoseDetails(poseItem);
                  if (!pose) return null;

                  return (
                    <div
                      key={`${pose.id}-${index}`}
                      className="flex items-center gap-3 p-3 bg-cream-50 rounded-xl hover:bg-cream-100 transition-colors"
                    >
                      {/* Pose Number */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-sage-700">{index + 1}</span>
                      </div>

                      {/* Pose Thumbnail */}
                      <div className="flex-shrink-0">
                        <PoseImage pose={pose} size="small" />
                      </div>

                      {/* Pose Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-sage-900 truncate">
                          {pose.nameEnglish}
                          {poseItem?.side && (
                            <span className="ml-1 text-xs font-normal text-sage-500">
                              ({poseItem.side === 'right' ? 'Right' : 'Left'})
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-sage-600 truncate">
                          {pose.nameSanskrit}
                        </p>
                      </div>

                      {/* Duration */}
                      <div className="flex-shrink-0 text-right">
                        <div className="text-sm font-medium text-sage-700">
                          {poseItem.duration || pose.duration}s
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Benefits Section */}
          {sessionData.benefits && sessionData.benefits.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-medium text-sage-900 mb-4">
                Benefits
              </h2>
              <ul className="space-y-2">
                {sessionData.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-accent text-lg mt-0.5">•</span>
                    <span className="text-sm text-sage-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Focus Areas (for yoga sessions) */}
          {sessionType !== 'breathing' && sessionData.bodyPart && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-medium text-sage-900 mb-3">
                Focus Areas
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-sage-100 text-sage-700 rounded-full text-sm font-medium capitalize">
                  {sessionData.bodyPart === 'full' ? 'Full Body' : sessionData.bodyPart}
                </span>
              </div>
            </div>
          )}

          {/* Best For (for breathing exercises) */}
          {sessionType === 'breathing' && sessionData.bestFor && sessionData.bestFor.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-medium text-sage-900 mb-4">
                Best For
              </h2>
              <div className="flex flex-wrap gap-2">
                {sessionData.bestFor.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tips Section */}
          {sessionData.tips && sessionData.tips.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-medium text-sage-900 mb-4">
                Tips
              </h2>
              <ul className="space-y-2">
                {sessionData.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-gold text-lg mt-0.5">💡</span>
                    <span className="text-sm text-sage-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions (for breathing exercises) */}
          {sessionType === 'breathing' && sessionData.instructions && sessionData.instructions.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-medium text-sage-900 mb-4">
                Instructions
              </h2>
              <ol className="space-y-3">
                {sessionData.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sage-100 text-sage-700 text-xs font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm text-sage-700 pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer CTA */}
      <div className="fixed bottom-[calc(48px+env(safe-area-inset-bottom))] left-0 right-0 bg-white border-t border-sage-200 p-4 shadow-lg">
        <div className="mx-auto max-w-sm">
          <Button
            onClick={handleStartPractice}
            className="w-full bg-sage-600 hover:bg-sage-700 text-white rounded-xl py-3 h-auto flex items-center justify-center gap-2"
          >
            <Play className="h-5 w-5" />
            <span className="font-medium">Start Practice</span>
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default SessionDetail;
