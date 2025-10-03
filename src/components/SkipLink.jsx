/**
 * SkipLink Component
 *
 * Provides a "Skip to main content" link for keyboard and screen reader users.
 * Visually hidden by default but becomes visible when focused via keyboard.
 *
 * WCAG 2.1 AA Compliance:
 * - Allows keyboard users to bypass repetitive navigation
 * - Meets Success Criterion 2.4.1 (Bypass Blocks)
 *
 * Usage:
 * Place at the very top of your app/layout, before any other content.
 * Ensure the target element has id="main-content".
 */
function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
    >
      Skip to main content
    </a>
  );
}

export default SkipLink;
