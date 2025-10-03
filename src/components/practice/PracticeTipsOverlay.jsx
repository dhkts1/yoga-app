/**
 * Practice tips overlay component.
 *
 * Displays pose guidance including benefits, alignment tips, common mistakes, and breathing cues.
 * Rendered as a fixed overlay at the bottom of the practice screen.
 *
 * @param {Object} props - Component props
 * @param {Object} props.pose - Pose data with tips, benefits, mistakes, breathing cues
 * @param {boolean} props.show - Whether to show the overlay
 *
 * @returns {JSX.Element|null} Tips overlay UI or null if not shown
 */
export function PracticeTipsOverlay({ pose, show }) {
  if (!show || !pose) return null;

  return (
    <div className="fixed inset-x-4 bottom-32 z-50 mx-safe-left mr-safe-right max-h-[40vh] animate-fade-in overflow-y-auto rounded-lg bg-card p-3 shadow-lg">
      <h3 className="mb-2 text-base font-medium text-foreground">Pose Guidance</h3>

      {/* Benefits */}
      {pose.benefits && pose.benefits.length > 0 && (
        <div className="mb-3">
          <h4 className="mb-1 text-sm font-medium text-muted-foreground">Benefits:</h4>
          <ul className="space-y-1">
            {pose.benefits.slice(0, 3).map((benefit, index) => (
              <li key={index} className="text-xs text-muted-foreground">
                • {benefit}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Form Tips */}
      {pose.tips && pose.tips.length > 0 && (
        <div className="mb-3">
          <h4 className="mb-1 text-sm font-medium text-muted-foreground">Alignment Tips:</h4>
          <ul className="space-y-1">
            {pose.tips.map((tip, index) => (
              <li key={index} className="text-xs text-muted-foreground">
                • {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Common Mistakes */}
      {pose.commonMistakes && pose.commonMistakes.length > 0 && (
        <div className="mb-3">
          <h4 className="mb-1 text-sm font-medium text-muted-foreground">Avoid:</h4>
          <ul className="space-y-1">
            {pose.commonMistakes.slice(0, 2).map((mistake, index) => (
              <li key={index} className="text-xs text-state-error">
                • {mistake}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Breathing */}
      {pose.breathingCues && (
        <div className="rounded-md bg-muted p-2">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Breathing:</span> {pose.breathingCues}
          </p>
        </div>
      )}
    </div>
  );
}
