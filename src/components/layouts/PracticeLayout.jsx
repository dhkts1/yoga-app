import AppLayout from '../AppLayout';

/**
 * PracticeLayout - Specialized layout for practice/breathing screens
 *
 * Features:
 * - Sticky header with practice controls
 * - Scrollable content area (pose info, breathing instructions)
 * - Sticky footer with play/pause controls
 * - No BottomNav (immersive practice mode)
 *
 * Usage:
 * <PracticeLayout
 *   header={<PracticeHeader />}
 *   footer={<PracticeFooter />}
 * >
 *   {content}
 * </PracticeLayout>
 */
function PracticeLayout({
  children,
  header,
  footer,
  className,
  contentClassName,
  ...props
}) {
  return (
    <AppLayout
      showHeader={!!header}
      showFooter={!!footer}
      showBottomNav={false}
      fixedHeader={false} // Use sticky instead
      fixedFooter={true}  // Footer should stick to bottom
      className={className}
      contentClassName={contentClassName}
      header={header}
      footer={footer}
      {...props}
    >
      {children}
    </AppLayout>
  );
}

export default PracticeLayout;
