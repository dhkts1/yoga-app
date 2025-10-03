import { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  Clock,
  TrendingUp,
  Target,
  Calendar,
  Play,
  Heart,
  Share2,
  BookMarked,
} from "lucide-react";
import { getSessionById } from "../data/sessions";
import { getBreathingExerciseById } from "../data/breathing";
import { getPoseById } from "../data/poses";
import { Button } from "../components/design-system";
import { DefaultLayout } from "../components/layouts";
import { PageHeader } from "../components/headers";
import FavoriteButton from "../components/FavoriteButton";
import PoseImage from "../components/PoseImage";
import useProgressStore from "../stores/progress";
import useCustomSessions from "../hooks/useCustomSessions";
import useTranslation from "../hooks/useTranslation";

function SessionDetail() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  // Get program context if this session is part of a program
  const programContext = location.state?.programContext || null;
  const [sessionData, setSessionData] = useState(null);
  const [sessionType, setSessionType] = useState(null); // 'prebuilt', 'custom', 'breathing'
  const [isCustom, setIsCustom] = useState(false);
  const { practiceHistory, breathingHistory } = useProgressStore();

  // Use custom sessions hook
  const { getById: getCustomSessionById, isLoading: customSessionsLoading } =
    useCustomSessions();

  // Load session data on mount
  useEffect(() => {
    const loadSessionData = () => {
      // Check if it's a custom session from URL param
      const customParam = searchParams.get("custom");

      if (customParam === "true") {
        // Wait for custom sessions to load
        if (customSessionsLoading) {
          return;
        }

        // Load using hook
        const session = getCustomSessionById(sessionId);
        if (session) {
          setSessionData(session);
          setSessionType("custom");
          setIsCustom(true);
          return;
        }
      }

      // Try pre-built session
      const prebuiltSession = getSessionById(sessionId);
      if (prebuiltSession) {
        setSessionData(prebuiltSession);
        setSessionType("prebuilt");
        setIsCustom(false);
        return;
      }

      // Try breathing exercise
      const breathingExercise = getBreathingExerciseById(sessionId);
      if (breathingExercise) {
        setSessionData(breathingExercise);
        setSessionType("breathing");
        setIsCustom(false);
        return;
      }

      // Session not found
      console.error("Session not found:", sessionId);
      navigate("/sessions");
    };

    loadSessionData();
  }, [
    sessionId,
    searchParams,
    navigate,
    getCustomSessionById,
    customSessionsLoading,
  ]);

  // Calculate total duration in minutes for custom sessions
  const getTotalDuration = () => {
    if (!sessionData) return 0;

    if (sessionType === "breathing") {
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

    if (sessionType === "breathing") {
      return breathingHistory.filter((h) => h.exerciseId === sessionId).length;
    }

    return practiceHistory.filter((h) => h.sessionId === sessionId).length;
  };

  // Handle start practice
  const handleStartPractice = () => {
    if (!sessionData) return;

    if (sessionType === "breathing") {
      navigate(
        `/breathing/practice?exercise=${sessionId}&duration=${sessionData.defaultDuration}`,
      );
    } else if (isCustom) {
      navigate(`/practice?customSession=${sessionId}`, {
        // Pass program context if available
        ...(programContext && { state: { programContext } }),
      });
    } else {
      navigate(`/practice?session=${sessionId}`, {
        // Pass program context if available
        ...(programContext && { state: { programContext } }),
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
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Determine back path based on program context
  const backPath =
    programContext?.programId && programContext?.weekNumber
      ? `/programs/${programContext.programId}/week/${programContext.weekNumber}`
      : "/sessions";

  if (!sessionData) {
    return (
      <DefaultLayout
        header={<PageHeader title="Loading..." backPath={backPath} />}
      >
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="text-lg text-muted-foreground">
              Loading session...
            </div>
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
            <FavoriteButton itemId={sessionId} type="session" size="md" />
          }
        />
      }
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-cream-50 to-cream px-4 py-3">
        <div className="mx-auto max-w-sm text-center">
          {/* Session Icon/Emoji */}
          <div className="mb-2 flex items-center justify-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <span className="text-2xl">{sessionData.emoji || "🧘"}</span>
            </div>
          </div>

          {/* Description */}
          <p className="mb-3 text-sm text-muted-foreground">
            {sessionDescription}
          </p>

          {/* Metadata Badges */}
          <div className="mb-2 flex flex-wrap items-center justify-center gap-2">
            {/* Program Context Badge */}
            {programContext && (
              <div className="flex items-center gap-1 rounded-full border border-accent/30 bg-accent/20 px-2.5 py-1 shadow-sm">
                <BookMarked className="size-3.5 text-accent" />
                <span className="text-xs font-semibold text-accent">
                  Week {programContext.weekNumber}, Day{" "}
                  {programContext.dayNumber}
                </span>
              </div>
            )}

            {/* Duration */}
            <div className="flex items-center gap-1 rounded-full bg-card px-2.5 py-1 shadow-sm">
              <Clock className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">
                {totalDuration} min
              </span>
            </div>

            {/* Difficulty */}
            {sessionData.difficulty && (
              <div className="flex items-center gap-1 rounded-full bg-card px-2.5 py-1 shadow-sm">
                <TrendingUp className="size-3.5 text-muted-foreground" />
                <span className="text-xs font-medium capitalize text-foreground">
                  {sessionData.difficulty}
                </span>
              </div>
            )}

            {/* Category/Focus */}
            {(sessionData.focus || sessionData.category) && (
              <div className="flex items-center gap-1 rounded-full bg-card px-2.5 py-1 shadow-sm">
                <Target className="size-3.5 text-muted-foreground" />
                <span className="text-xs font-medium capitalize text-foreground">
                  {sessionData.focus || sessionData.category}
                </span>
              </div>
            )}

            {/* Practice Count */}
            {practiceCount > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 shadow-sm">
                <Calendar className="size-3.5 text-accent" />
                <span className="text-xs font-medium text-accent">
                  Practiced {practiceCount}x
                </span>
              </div>
            )}
          </div>

          {/* Custom Session Badge */}
          {isCustom && (
            <div className="inline-block rounded-full bg-muted px-2.5 py-0.5">
              <span className="text-xs font-medium text-muted-foreground">
                Custom Session
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-32">
        <div className="mx-auto max-w-sm space-y-6">
          {/* Poses List (for yoga sessions) */}
          {sessionType !== "breathing" &&
            sessionData.poses &&
            sessionData.poses.length > 0 && (
              <div className="rounded-2xl bg-card p-5 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-medium text-foreground">
                  <Heart className="size-5 text-muted-foreground" />
                  Poses in This Session ({sessionData.poses.length})
                </h2>
                <div className="space-y-3">
                  {sessionData.poses.map((poseItem, index) => {
                    const pose = getPoseDetails(poseItem);
                    if (!pose) return null;

                    return (
                      <div
                        key={`${pose.id}-${index}`}
                        className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted/50"
                      >
                        {/* Pose Number */}
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                          <span className="text-sm font-medium text-muted-foreground">
                            {index + 1}
                          </span>
                        </div>

                        {/* Pose Thumbnail */}
                        <div className="shrink-0">
                          <PoseImage poseId={pose.id} size="sm" />
                        </div>

                        {/* Pose Info */}
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-medium text-foreground">
                            {pose.nameEnglish}
                            {poseItem?.side && (
                              <span className="ml-1 text-xs font-normal text-muted-foreground">
                                ({poseItem.side === "right" ? "Right" : "Left"})
                              </span>
                            )}
                          </h3>
                          <p className="truncate text-xs text-muted-foreground">
                            {pose.nameSanskrit}
                          </p>
                        </div>

                        {/* Duration */}
                        <div className="shrink-0 text-right">
                          <div className="text-sm font-medium text-muted-foreground">
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
            <div className="rounded-2xl bg-card p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-medium text-foreground">
                Benefits
              </h2>
              <ul className="space-y-2">
                {sessionData.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-0.5 text-lg text-accent">•</span>
                    <span className="text-sm text-muted-foreground">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Focus Areas (for yoga sessions) */}
          {sessionType !== "breathing" && sessionData.bodyPart && (
            <div className="rounded-2xl bg-card p-5 shadow-sm">
              <h2 className="mb-3 text-lg font-medium text-foreground">
                Focus Areas
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium capitalize text-muted-foreground">
                  {sessionData.bodyPart === "full"
                    ? "Full Body"
                    : sessionData.bodyPart}
                </span>
              </div>
            </div>
          )}

          {/* Best For (for breathing exercises) */}
          {sessionType === "breathing" &&
            sessionData.bestFor &&
            sessionData.bestFor.length > 0 && (
              <div className="rounded-2xl bg-card p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-medium text-foreground">
                  Best For
                </h2>
                <div className="flex flex-wrap gap-2">
                  {sessionData.bestFor.map((item, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Tips Section */}
          {sessionData.tips && sessionData.tips.length > 0 && (
            <div className="rounded-2xl bg-card p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-medium text-foreground">Tips</h2>
              <ul className="space-y-2">
                {sessionData.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-0.5 text-lg text-accent">💡</span>
                    <span className="text-sm text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions (for breathing exercises) */}
          {sessionType === "breathing" &&
            sessionData.instructions &&
            sessionData.instructions.length > 0 && (
              <div className="rounded-2xl bg-card p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-medium text-foreground">
                  Instructions
                </h2>
                <ol className="space-y-3">
                  {sessionData.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                        {index + 1}
                      </span>
                      <span className="pt-0.5 text-sm text-muted-foreground">
                        {instruction}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
        </div>
      </div>

      {/* Fixed Footer CTA */}
      <div className="fixed inset-x-0 bottom-[calc(48px+env(safe-area-inset-bottom))] border-t border-border bg-card p-4 shadow-lg">
        <div className="mx-auto flex max-w-sm items-center justify-between">
          <div className="size-12 shrink-0" />
          <Button
            variant="primary"
            onClick={handleStartPractice}
            className="flex h-auto items-center justify-center gap-2 rounded-xl py-3"
          >
            <Play className="size-5" />
            <span className="font-medium">
              {t("screens.sessionDetail.startPractice")}
            </span>
          </Button>
          <button
            onClick={handleShare}
            className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
            aria-label="Share Session"
          >
            <Share2 className="size-5" />
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default SessionDetail;
