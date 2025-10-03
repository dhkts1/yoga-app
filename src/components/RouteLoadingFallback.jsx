/**
 * RouteLoadingFallback Component
 *
 * Loading fallback for lazy-loaded routes with Suspense.
 * Shows skeleton loading state while route chunks are being loaded.
 */

import SkeletonLoader from './SkeletonLoader';

export default function RouteLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md px-4 space-y-4">
        {/* Header skeleton */}
        <SkeletonLoader variant="text" height="2rem" width="60%" className="mx-auto" />

        {/* Content skeletons */}
        <div className="space-y-3 mt-8">
          <SkeletonLoader variant="card" height="6rem" />
          <SkeletonLoader variant="card" height="6rem" />
          <SkeletonLoader variant="card" height="6rem" />
        </div>
      </div>
    </div>
  );
}
