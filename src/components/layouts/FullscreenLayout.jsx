import AppLayout from '../AppLayout';

/**
 * FullscreenLayout - Fullscreen layout with no header/footer chrome
 *
 * Features:
 * - No header or footer
 * - Optional BottomNav
 * - Content fills entire viewport
 * - Centered content support
 *
 * Usage:
 * <FullscreenLayout showBottomNav={true}>
 *   {content}
 * </FullscreenLayout>
 */
function FullscreenLayout({
  children,
  showBottomNav = false,
  centered = false,
  className,
  contentClassName,
  ...props
}) {
  return (
    <AppLayout
      showHeader={false}
      showFooter={false}
      showBottomNav={showBottomNav}
      className={className}
      contentClassName={
        centered
          ? `flex items-center justify-center ${contentClassName || ''}`
          : contentClassName
      }
      {...props}
    >
      {children}
    </AppLayout>
  );
}

export default FullscreenLayout;
